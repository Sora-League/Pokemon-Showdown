//This is the shop. Pretty self explanatory :P
var fs = require('fs');
var request = require('request');
var path = require('path');

var shopList = {
	//Adding true as the last element of an array over here notifies admins when that item has been bought. This is useful for items like trainer cards that
	//require an admin's assistance
	potd: ['POTD', 'Buys the ability to set the Pokémon of the Day. Not purchasable if there is already a POTD.', 2],
	poof: ['Poof', 'Buy a poof message to be added into the pool of possible poofs.', 10, true],
	avatar: ['Avatar', 'Set your own custom avatar.', 35, true],
	card: ['Card', 'Buys a trainer card which can show information through a command.', 50, true],
	song: ['Song', 'Buys a song that can be played on a declarable card. (You must supply the song as a RAW MP3/OGG URL) <button name="send", value="/feelingit"><b>Example</b></button>', 25, true],
	customize: ['Customise', 'This allows you to stylise your Trainer Card with HTML5 Elements such as Audio/Mouse Cursor/Background Image/etc.', 15, true],
	fix: ['Fix', 'Buys the ability to edit your custom avatar or trainer card.', 10, true],
	room: ['Room', 'Buys a chatroom for you to own (within reasons, can be refused).', 100, true],
	rng: ['RNG', 'Buys Floatzel\'s and Tempest\'s RNG/Cloning <a href="http://pastebin.com/eL8CjvS1">Services</a> for Pokemon X&Y/ORAS. <button name ="send", value="/Powersaves"><b>More Info</b></button>', 2]
};

function addLog(message) {
	if (!global.moneyLog) global.moneyLog = '';
	var d = new Date();
	global.moneyLog += '<small>[' + d.format('{yyyy}-{MM}-{dd} {hh}:{mm}:{ss} {tt}') + ']</small> ';
	global.moneyLog += message + '<br/>';
}

exports.commands = {

	getbucks: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Please check out the Shop page in the link below to see methods of earning money:<br />' +
			'- <a href="http://soraleague.weebly.com/shop.html">Shop</a><br /></div>');
	},

	buckslog: 'moneylog',
	moneylog: function(target, room, user) {
		if (!this.can('lock')) return false;
		this.popupReply('|html|<center><u>Transaction Log (Time Zone:)</u></center><br/>' + global.moneyLog);
	},

	atm: 'wallet',
	money: 'wallet',
	cash: 'wallet',
	bucks: 'wallet',
	purse: 'wallet',
	wallet: function(target, room, user) {
		if (!this.canBroadcast()) return;
		var User;
		if (!toId(target)) User = user.name;
		else User = Users.getExact(target) ? Users.getExact(target).name : target;
		var money = Number(Core.read('money', toId(User))) || 'no';
		this.sendReplyBox(User + ' has ' + money + ' buck' + (money === 1 ? '' : 's') + '.');
	},

	shop: function(target, room, user) {
		if (!this.canBroadcast()) return;
		if (this.broadcasting) return this.sendReplyBox('<center><b>Click <button name = "send" value = "/shop">here</button> to enter our shop!');
		var status = (!global.shopclosed) ? '<b>Shop status: <font color = "green">Open</font></b><br />To buy an item, type in /buy [item] in the chat, or simply click on one of the buttons.' : '<b>Shop status: <font color = "red">Closed</font></b>';
		var text = '<center><h3><b><u>Sora\'s Shop</u></b></h3><table border = "1" cellspacing = "0" cellpadding = "4"><tr><th>Item</th><th>Description</th><th>Price</th><th></th></tr>';

		for (var i in shopList) {
			text = text + '<tr><td>' + shopList[i][0] + '</td><td>' + shopList[i][1] + '</td><td>' + shopList[i][2] + '</td><td><button name = "send", value="/buy ' + i + '"><b>Buy!</b></button></td></tr>';
		}
		text = text + '</table><br />' + status + '</center>';
		this.sendReplyBox(text);
	},

	toggleshop: 'adjustshop',
	adjustshop: function(target, room, user) {
		if (!this.can('hotpatch')) return false;
		global.shopclosed = !global.shopclosed;
		addLog(user.name + ' ' + (global.shopclosed ? 'closed' : 'opened') + ' the shop.');
		this.sendReply('The shop is now ' + (global.shopclosed ? 'closed' : 'open') + '.');
	},

	give: 'award',
	givebucks: 'award',
	givebucks: 'award',
	gb: 'award',
	award: function(target, room, user, connection, cmd) {
		if (!this.can('hotpatch')) return false;
		if (!target) return this.sendReply('The correct syntax is /' + cmd + ' [user], [amount]');
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) return this.sendReply('User \'' + this.targetUsername + '\' not found.');
		if (!target) return this.sendReply('You need to mention the number of bucks you want to give ' + targetUser.name);
		if (isNaN(target)) return this.sendReply(target + " is not a valid number.");
		if (target < 1) return this.sendReply('You cannot give ' + targetUser.name + ' anything less than 1 buck!');

		Core.write('money', targetUser.userid, Number(target), '+');
		var amt = (Number(target) == 1) ? 'buck' : 'bucks';
		var bucks = (Core.read('money', targetUser.userid) == 1) ? 'buck' : 'bucks';
		targetUser.send('|popup|' + user.name + ' has given you ' + target + ' ' + amt + '. You now have ' + Core.read('money', targetUser.userid) + ' ' + bucks + '.');
		addLog(user.name + ' has given ' + targetUser.name + ' ' + target + ' ' + amt + '. This user now has ' + Core.read('money', targetUser.userid) + ' ' + bucks + '.');
		return this.sendReply(targetUser.name + ' was given ' + Number(target) + ' ' + amt + '. This user now has ' + Core.read('money', targetUser.userid) + ' ' + bucks + '.');
	},

	removebucks: 'remove',
	rb: 'remove',
	tb: 'remove',
	takebucks: 'remove',
	take: 'remove',
	remove: function(target, room, user, connection, cmd) {
		if (!this.can('hotpatch')) return false;
		if (!target) return this.sendReply('/' + cmd + ' [user], [amount] - Gives the specified user the specified number of bucks.');
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) return this.sendReply('User ' + this.targetUsername + ' not found.');
		if (!toId(target)) return this.sendReply('You need to specify the number of bucks you want to remove from ' + targetUser.name);
		if (isNaN(target)) return this.sendReply(target + " isn't a valid number.");
		if (Core.read('money', targetUser.userid) < target) return this.sendReply('You can\'t take away more than what ' + targetUser.name + ' already has!');

		Core.write('money', targetUser.userid, Number(target), '-');
		var bucks = (Core.read('money', targetUser.userid) == 1) ? 'buck' : 'bucks';
		var amt = (target == 1) ? 'buck' : 'bucks';
		targetUser.send('|popup|' + user.name + ' has taken away ' + target + ' ' + amt + ' from you. You now have ' + Core.read('money', targetUser.userid) + ' ' + bucks + '.');
		addLog(user.name + ' has taken away ' + target + ' ' + amt + ' from ' + targetUser.name + '. This user now has ' + Core.read('money', targetUser.userid) + ' ' + bucks + '.');
		return this.sendReply('You have taken away ' + target + ' ' + amt + ' from ' + targetUser.name + '. This user now has ' + Core.read('money', targetUser.userid) + ' ' + bucks + '.');
	},

	transfermoney: 'transferbucks',
	transferbucks: function(target, room, user, connection, cmd) {
		if (!this.canBroadcast()) return false;
		if (!target) return this.sendReply('/' + cmd + ' [user], [amount] - Transfers the specified number of bucks to the specified user.');
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) return this.sendReply('User ' + this.targetUsername + ' not found.');
		if (targetUser.userid === user.userid) return this.sendReply('You can\'t transfer bucks to yourself!');
		if (!toId(target)) return this.sendReply('You need to specify the number of bucks you want to transfer to ' + targetUser.name);
		if (isNaN(target)) return this.sendReply(target + " isn't a valid number.");
		if (Core.read('money', user.userid) < target) return this.sendReply('You can\'t give ' + targetUser.name + ' more than what you have!');

		Core.write('money', targetUser.userid, Number(target), '+');
		Core.write('money', user.userid, Number(target), '-');
		var amt = (Core.read('money', targetUser.userid) == 1) ? 'buck' : 'bucks';
		var userAmt = (Core.read('money', user.userid) == 1) ? 'buck' : 'bucks';
		var bucks = (target == 1) ? 'buck' : 'bucks';
		targetUser.send('|popup|' + user.name + ' has transferred ' + target + ' ' + bucks + ' to you. You now have ' + Core.read('money', targetUser.userid) + ' ' + amt + '.');
		addLog(user.name + ' has transferred ' + target + ' ' + bucks + ' to ' + targetUser.name + '. This user now has ' + Core.read('money', targetUser.userid) + ' ' + amt + '. ' + user.name + ' has ' + Core.read('money', user.userid) + ' ' + userAmt + ' left.');
		return this.sendReply('You have transferred ' + target + ' ' + bucks + ' to ' + targetUser.name + '. You have ' + Core.read('money', user.userid) + ' ' + userAmt + ' left.');
	},

	buy: function(target, room, user) {
		if (global.shopclosed) return this.sendReply("The shop is closed for now. Wait until it re-opens shortly.");
		target = toId(target);
		if (!shopList[target]) return this.sendReply('That item isn\'t in the shop.');
		var price = shopList[target][2];
		if (Core.read('money', user.userid) < price) return this.sendReply("You don't have enough money to buy a " + shopList[target][0].toLowerCase() + ".");

		//these items have their own specifics
		if (target === 'avatar') {
			if (!Number(user.avatar) && fs.existsSync('config/avatars/' + user.avatar)) return this.sendReply('You already have a custom avatar. Buy a fix if you want to change it.');

		} else if (target === 'potd') {
			if (Config.potd) return this.sendReply('The Pokémon of the Day has already been set.');
			this.sendReply("|html|Use /setpotd <em>Pokémon</em> to set the Pokémon of the day.");
			user.setpotd = true;
		}

		if (shopList[target][3]) {
			for (var i in Users.users) {
				if (Users.users[i].can('hotpatch')) Users.users[i].send('|pm|~Server-Kun [Do Not Reply]|' + Users.users[i].userid + '|' + user.name + ' has bought a ' + target + ".")
			}
			this.sendReply('PM the details of your ' + shopList[target][0].toLowerCase() + ' to an Admin.');
		}

		room.add('|html|' + user.name + ' bought a <b>' + target + '</b>!');
		Core.write("money", user.userid, price, '-');
		addLog(user.name + ' bought a ' + target + ' from the shop.');
	},

	setpotd: function (target, room, user) {
		if (!user.setpotd) return this.sendReply("You need to buy the ability to set the Pokemon of the Day!");
		if (user.alreadysetpotd) return this.sendReply("You've already set the POTD!");

		Config.potd = target;
		Simulator.SimulatorProcess.eval('Config.potd = \'' + toId(target) + '\'');
		if (!target) return this.sendRepply("You need to choose a Pokémon to set as the POTD.");
		if (Rooms.lobby) Rooms.lobby.addRaw('<div class="broadcast-blue"><b>The Pokémon of the Day is now ' + target + '!</b><br />This Pokemon will be guaranteed to show up in random battles.</div>');
		this.logModCommand('The Pokemon of the Day was changed to ' + target + ' by ' + user.name + '.');
		user.setpotd = false;
		user.alreadysetpotd = true;
	}
};
