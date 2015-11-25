if (!global.dicegames) global.dicegames = {};
var dicegames = global.dicegames;

const INACTIVE_END_TIME = 60 * 1000; //1 minute

function diceImg (num) {
	switch (num) {
		case 0: return "http://i.imgur.com/nUbpLTD.png";
		case 1: return "http://i.imgur.com/BSt9nfV.png";
		case 2: return "http://i.imgur.com/eTQMVhY.png";
		case 3: return "http://i.imgur.com/3Y2hCAJ.png";
		case 4: return "http://i.imgur.com/KP3Za7O.png";
		case 5: return "http://i.imgur.com/lvi2ZZe.png";
	}
}

var Dice = (function () {
	function Dice (room, amount) {
		this.room = room;
		this.reward = amount;
		this.players = [];
		this.timer = setTimeout(function () {
			this.room.add('|html|<b>The game of dice has been ended due to the lack of players.</b>');
			this.room.update();
			delete dicegames[this.room.id];
		}.bind(this), INACTIVE_END_TIME);
	}

	Dice.prototype.join = function (user, self) {
		if (Core.read('money', user.userid) < this.reward) return self.sendReply('You don\'t have enough money for this game of dice.');
		if (~this.players.indexOf(user)) return self.sendReply('You have already joined this game of dice.');
		var p1 = this.players[0];
		if (this.players.length) {
			for (var i in user.getAlts().length) {
				if (p1.userid === user.getAlts()[i]) return self.sendReply('Your alt \'' + user.getAlts()[i] + '\' has already joined this game of dice.');
			}
			if (~p1.getAlts().indexOf(user.userid)) return self.sendReply('Your alt \'' + p1.name + '\' has already joined this game of dice.');
		}
		this.players.push(user);
		this.room.add(user.name + ' has joined the game!');
		if (this.players.length === 2) this.play();
	};

	Dice.prototype.leave = function (user, self) {
		if (!~this.players.indexOf(user)) return self.sendReply('You haven\'t joined the game of dice yet.');
		this.players.splice(0, this.players.indexOf(user), 1);
		this.room.add(user.name + ' has left the game.');
	};

	Dice.prototype.play = function () {
		var p1 = this.players[0], p2 = this.players[1];
		var roll1, roll2;
		do {
			roll1 = Math.floor(Math.random() * 6);
			roll2 = Math.floor(Math.random() * 6);
		} while (roll1 === roll2);
		if (roll2 > roll1) this.players.reverse();
		var winner = this.players[0], loser = this.players[1];

		var buck = (this.reward === 1 ? 'buck' : 'bucks');
		this.room.add('|html|<div class="infobox"><center><b>The game of dice has been started!</b><br />' +
            'Rolling the dice...<br />' +
            '<img src = "' + diceImg(roll1) + '" align = "left" title = "' + p1.name + '\'s roll"><img src = "' + diceImg(roll2) + '" align = "right" title = "' + p2.name + '\'s roll"><br/>' +
            '<b>' + p1.name + '</b> rolled ' + (roll1 + 1) + '!<br />' +
            '<b>' + p2.name + '</b> rolled ' + (roll2 + 1) + '!<br />' +
			'<b>' + winner.name + '</b> has won <b>' + this.reward + '</b> ' + buck + '!<br/>' + 
			'Better luck next time, ' + loser.name + '!');
		Core.write('money', winner.userid, this.reward, '+');
		Core.write('money', loser.userid, this.reward, '-');
		this.room.update();
		this.end();
	};
	
	Dice.prototype.end = function (user) {
		if (user) this.room.add('|html|<b>The game of dice has been ended by ' + user.name);
		clearTimeout(this.timer);
		delete dicegames[this.room.id];
	};
	return Dice;
})();

exports.commands = {
	dicecommands: 'dicegamehelp',
	dicegamehelp: function (target, room, user) {
		this.sendReplyBox('<b><center>Dice commands</center></b><br>' +
            '-/startdice or /dicegame <i>Amount</i> - Starts a game of dice in the room for the specified number of bucks (1 by default). Must be ranked + or higher to use.<br>' +
            '-/joindice - Joins the game of dice. You cannot use this if you don\'t have the number of bucks the game is for.<br>' +
            '-/leavedice - Leaves the game of dice.<br>' +
            '-/enddice - Ends the game of dice.');
	},

	startdice: 'dicegame',
	dicegame: function (target, room, user) {
		if (!this.can('broadcast', null, room)) return this.errorReply('You must be ranked + or higher to start a game of dice.');
		if (dicegames[room.id]) return this.errorReply('There is already a game of dice going on in this room.');
		if ((user.locked || room.isMuted(user)) && !user.can('bypassall')) return this.errorReply("You cannot use this while unable to talk.");
		target = target.trim();
		if (isNaN(target)) return this.errorReply('"' + target + '" isn\'t a valid number.');
		if (~target.indexOf('.')) return this.sendReply('The number of bucks to gamble for cannot be a decimal.');
        var amount = Number(target) || 1;
		if (amount < 1) return this.sendReply('The number of bucks to gamble for cannot be less than 1.');
		if (amount > 500) return this.sendReply('The number of bucks to gamble for cannot be more than 500.');
		
		var buck = (amount === 1 ? 'buck' : 'bucks');
		this.add('|html|<div class="infobox"><span style = "color: #007cc9"><center><h2>' + user.name + ' has started a game of dice for <span style = "color: green">' + amount + '</span> ' + buck + '!</h2></center></span>' +
            '<center><button name = "send" value = "/joindice">Click to join!</button></div>'
		);
		dicegames[room.id] = new Dice(room, amount);
	},

	dicejoin: 'joindice',
	joindice: function (target, room, user) {
		if (!dicegames[room.id]) return this.errorReply('There is no game of dice going on in this room.');
		if ((user.locked || room.isMuted(user)) && !user.can('bypassall')) return this.sendReply("You cannot use this while unable to talk.");

		dicegames[room.id].join(user, this);
	},

	diceleave: 'leavedice',
	leavedice: function (target, room, user) {
		if (!dicegames[room.id]) return this.errorReply('There is no game of dice going on in this room.');
		
		dicegames[room.id].leave(user, this);
	},

	diceend: 'enddice',
	enddice: function (target, room, user) {
		if (!this.can('broadcast', null, room)) return this.errorReply('You must be ranked + or higher to end a game of dice.');
		if (!dicegames[room.id]) return this.errorReply('There is no game of dice going on in this room.');
		
		dicegames[room.id].end(user);
	}
}
