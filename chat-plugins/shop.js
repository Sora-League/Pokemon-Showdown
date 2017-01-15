//This is the shop. Pretty self explanatory :P
'use strict';

const fs = require('fs');
const request = require('request');

let shopList = {
	//Adding true as the last element of an array over here notifies admins when that item has been bought. This is useful for items like trainer cards that
	//require an admin's assistance
	potd: ['POTD', 'Buys the ability to set the Pokémon of the Day. Not purchasable if there is already a POTD.', 2],
	poof: ['Poof', 'Buy a poof message to be added into the pool of possible poofs.', 10, true],
	deletepoof: ['Delete Poof', 'Delete a current poof message from the available pool. *Final decision will be made by an Admin Team member to prevent quality poofs from being removed.', 20, true],
	avatar: ['Avatar', 'Set your own custom avatar.', 35, true],
	card: ['Card', 'Buys a trainer card which can show information through a command.', 50, true],
	song: ['Song', 'Buys a song that can be played on a declarable card. (You must supply the song as a RAW MP3/OGG URL) <button name="send", value="/feelingit"><b>Example</b></button>', 25, true],
	customize: ['Customise', 'This allows you to stylise your Trainer Card with HTML5 Elements such as Audio/Mouse Cursor/Background Image/etc.', 15, true],
	fix: ['Fix', 'Buys the ability to edit your custom avatar or trainer card.', 10, true],
	room: ['Room', 'Buys a chatroom for you to own (within reasons, can be refused).', 100, true],
	rng: ['RNG', 'Buys Floatzel\'s and Tempest\'s RNG/Cloning <a href="http://pastebin.com/eL8CjvS1">Services</a> for Pokemon X&Y/ORAS. <button name ="send", value="/Powersaves"><b>More Info</b></button>', 2]
};

function getShop () {
	let status = (!global.shopclosed) ? '<b>Shop status: <font color = "green">Open</font></b><br>To buy an item, type in /buy [item] in the chat, or simply click on one of the buttons.' : '<b>Shop status: <font color = "red">Closed</font></b>';
	let text = '<center><h3><b><u>Sora\'s Shop</u></b></h3><table border = "1" cellspacing = "0" cellpadding = "4"><tr><th>Item</th><th>Description</th><th>Price</th><th></th></tr>';

	for (let i in shopList) {
		text = text + '<tr><td>' + shopList[i][0] + '</td><td>' + shopList[i][1] + '</td><td>' + shopList[i][2] + '</td><td><button name = "send", value="/buy ' + i + '"><b>Buy!</b></button></td></tr>';
	}
	text = text + '</table><br>' + status + '</center>';
	return text; //escaping quotation marks
}

function addLog(message) {
	if (!global.moneyLog) global.moneyLog = '';
	global.moneyLog += '<small>[' + require('dateformat')(new Date(), 'yyyy-mm-dd HH:MM:ss') + ']</small> ';
	global.moneyLog += message + '<br/>';
}

exports.commands = {

	getbucks: function(target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox('Please check out the Shop page in the link below to see methods of earning money:<br />' +
			'- <a href="http://soraleague.weebly.com/shop.html">Shop</a><br /></div>');
	},

	buckslog: 'moneylog',
	moneylog: function(target, room, user) {
		if (!this.can('lock')) return false;
		this.popupReply('|html|<center><u>Transaction Log (Time Zone:)</u></center><br/>' + (global.moneyLog || '(empty)'));
	},

	atm: 'wallet',
	money: 'wallet',
	cash: 'wallet',
	purse: 'wallet',
	wallet: function(target, room, user) {
		if (!this.runBroadcast()) return;
		if (!target || !target.trim()) target = user.name;
		else target = Users.getExact(target) ? Users.getExact(target).name : target;
		let money = Economy.read(target) || 'no';
		this.sendReplyBox(target + ' has ' + money + ' buck' + (money === 1 ? '' : 's') + '.');
	},

	shop: function(target, room, user) {
		if (!this.runBroadcast()) return;
		let shop = getShop();
		if (this.broadcasting) {
			return this.sendReply('|uhtml|shop|<div class = "infobox"><center>Click <button name = "receive" value = "|uhtmlchange|shop|<div class = &quot;infobox&quot;>' + shop.replace(/"/g, '&quot;') + '</div>">here</button> to enter our shop!</center></div>');
		}
		this.sendReplyBox(shop);
	},

	toggleshop: 'adjustshop',
	adjustshop: function(target, room, user) {
		if (!this.can('hotpatch')) return false;
		global.shopclosed = !global.shopclosed;
		addLog(user.name + ' ' + (global.shopclosed ? 'closed' : 'opened') + ' the shop.');
		this.sendReply('The shop is now ' + (global.shopclosed ? 'closed' : 'open') + '.');
	},

	givebucks: 'award',
	givebucks: 'award',
	gb: 'award',
	award: function(target, room, user, connection, cmd) {
		if (!this.can('hotpatch')) return false;
		if (!target) return this.sendReply('The correct syntax is /' + cmd + ' [user], [amount]');
		target = target.split(',');
		if (target.length < 2) return this.sendReply('/' + cmd + ' [user], [amount] - Gives a user the specified number of bucks.')
		let targetUser = Users.getExact(target[0]) ? Users.getExact(target[0]).name : target[0];
		let amt = Number(toId(target[1])) || target[1];
		if (!amt) return this.sendReply('You need to mention the number of bucks you want to give ' + targetUser);
		if (isNaN(amt)) return this.sendReply(amt + " is not a valid number.");
		if (amt < 1) return this.sendReply('You cannot give ' + targetUser + ' anything less than 1 buck!');
		if (String(amt).includes('.')) return this.sendReply('You cannot give ' + targetUser + ' fractions of bucks.');

		Economy.write(targetUser, amt);
		let giveFormat = (amt == 1) ? 'buck' : 'bucks';
		let hasFormat = (Economy.read(targetUser) === 1) ? 'buck' : 'bucks';
		if (Users.getExact(targetUser)) Users.getExact(targetUser).send('|popup|' + user.name + ' has given you ' + amt + ' ' + giveFormat + '. You now have ' + Economy.read(toId(targetUser)) + ' ' + hasFormat + '.');
		addLog(user.name + ' has given ' + targetUser + ' ' + amt + ' ' + giveFormat + '. This user now has ' + Economy.read(targetUser) + ' ' + hasFormat + '.');
		return this.sendReply(targetUser + ' was given ' + amt + ' ' + giveFormat + '. This user now has ' + Economy.read(targetUser) + ' ' + hasFormat + '.');
	},

	removebucks: 'remove',
	rb: 'remove',
	tb: 'remove',
	takebucks: 'remove',
	take: 'remove',
	remove: function(target, room, user, connection, cmd) {
		if (!this.can('hotpatch')) return false;
		if (!target) return this.sendReply('/' + cmd + ' [user], [amount] - Removes the specified number of bucks from a user.');
		target = target.split(',');
		if (target.length < 2) return this.sendReply('/' + cmd + ' [user], [amount] - Removes the specified number of bucks from a user.')
		let targetUser = Users.getExact(target[0]) ? Users.getExact(target[0]).name : target[0];
		let amt = Number(toId(target[1])) || target[1];
		if (!amt) return this.sendReply('You need to mention the number of bucks you want to remove from ' + targetUser + '.');
		if (isNaN(amt)) return this.sendReply(amt + " is not a valid number.");
		if (amt < 1) return this.sendReply('You cannot take away anything less than 1 buck!');
		if (String(amt).includes('.')) return this.sendReply('You cannot take away fractions.');
		if (Economy.read(targetUser) < amt) return this.sendReply('You can\'t take away more than what ' + targetUser + ' already has!');

		Economy.write(targetUser, -amt);
		let takeFormat = (amt === 1) ? 'buck' : 'bucks';
		let hasFormat = (Economy.read(toId(targetUser)) === 1) ? 'buck' : 'bucks';
		if (Users.getExact(targetUser) && Users.getExact(targetUser).connected) Users(targetUser).send('|popup|' + user.name + ' has taken away ' + amt + ' ' + takeFormat + ' from you. You now have ' + Economy.read(targetUser) + ' ' + hasFormat + ' left.');
		addLog(user.name + ' has taken away ' + amt + ' ' + takeFormat + ' from ' + targetUser + '. This user now has ' + Economy.read(targetUser) + ' ' + hasFormat + ' left.');
		return this.sendReply('You have taken away ' + amt + ' ' + takeFormat + ' from ' + targetUser + '. This user now has ' + Economy.read(targetUser) + ' ' + hasFormat + ' left.');
	},

	transfermoney: 'transferbucks',
	transferbucks: function(target, room, user, connection, cmd) {
		if (!this.runBroadcast()) return false;
		if (!target) return this.parse('/help transferbucks');
		target = this.splitTarget(target, true);
		let targetUser = this.targetUsername;
		targetUser = Users.getExact(targetUser) ? Users.getExact(targetUser).name : targetUser;
		if (!targetUser || !targetUser.trim()) return this.parse('/help transferbucks');
		if (!toId(targetUser)) return this.sendReply('"' + targetUser + '" is not a valid username.')
		if (toId(targetUser) === user.userid) return this.sendReply('You can\'t transfer bucks to yourself!');
		if (!toId(target)) return this.sendReply('You need to specify the number of bucks you want to transfer to ' + targetUser);
		if (isNaN(target)) return this.sendReply(target + " isn't a valid number.");
		if (Economy.read(user.userid) < target) return this.sendReply('You can\'t give ' + targetUser + ' more than what you have!');

		Economy.write(targetUser, Number(target));
		Economy.write(user.userid, -Number(target));
		let amt = (Economy.read(toId(targetUser)) == 1) ? 'buck' : 'bucks';
		let userAmt = (Economy.read(user.userid) == 1) ? 'buck' : 'bucks';
		let bucks = (target == 1) ? 'buck' : 'bucks';
		if (Users.getExact(targetUser)) Users.getExact(targetUser).send('|popup|' + user.name + ' has transferred ' + target + ' ' + bucks + ' to you. You now have ' + Economy.read(toId(targetUser)) + ' ' + amt + '.');
		addLog(user.name + ' has transferred ' + target + ' ' + bucks + ' to ' + targetUser + '. This user now has ' + Economy.read(toId(targetUser)) + ' ' + amt + '. ' + user.name + ' has ' + Economy.read(user.userid) + ' ' + userAmt + ' left.');
		return this.sendReply('You have transferred ' + target + ' ' + bucks + ' to ' + targetUser + '. You have ' + Economy.read(user.userid) + ' ' + userAmt + ' left.');
	},
	transferbuckshelp: ['/transferbucks or /transfermoney [user], [amount] - Transfers the specified number of bucks to a user.'],

	buy: function(target, room, user) {
		if (global.shopclosed) return this.sendReply("The shop is closed for now. Wait until it re-opens shortly.");
		target = toId(target);
		if (!shopList[target]) return this.sendReply('That item isn\'t in the shop.');
		let price = shopList[target][2];
		if (Economy.read(user.userid) < price) return this.sendReply("You don't have enough money to buy a " + shopList[target][0].toLowerCase() + ".");

		//these items have their own specifics
		if (target === 'avatar') {
			if (!Number(user.avatar) && fs.existsSync('config/avatars/' + user.avatar)) return this.sendReply('You already have a custom avatar. Buy a fix if you want to change it.');
		} else if (target === 'potd') {
			if (Config.potd) return this.sendReply('The Pokémon of the Day has already been set.');
			this.sendReply("|html|Use /setpotd <em>Pokémon</em> to set the Pokémon of the day.");
			user.setpotd = true;
		}

		if (shopList[target][3]) {
			Users.users.forEach(u => {
				if (u.can('hotpatch')) u.send('|pm|~Server-Kun [Do Not Reply]|' + u.userid + '|' + user.name + ' has bought a ' + target + ".")
			});
			this.sendReply('PM the details of your ' + shopList[target][0].toLowerCase() + ' to an Admin.');
		}

		room.add('|html|' + user.name + ' bought a <b>' + target + '</b>!');
		Economy.write(user.userid, -price);
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
