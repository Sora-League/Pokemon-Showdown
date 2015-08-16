var dicegames = exports.dicegames = {};

function diceImg (num) {
	switch (num) {
		case 0: return "http://i1171.photobucket.com/albums/r545/Brahak/1_zps4bef0fe2.png";
		case 1: return "http://i1171.photobucket.com/albums/r545/Brahak/2_zpsa0efaac0.png";
		case 2: return "http://i1171.photobucket.com/albums/r545/Brahak/3_zps36d44175.png";
		case 3: return "http://i1171.photobucket.com/albums/r545/Brahak/4_zpsd3983524.png";
		case 4: return "http://i1171.photobucket.com/albums/r545/Brahak/5_zpsc9bc5572.png";
		case 5: return "http://i1171.photobucket.com/albums/r545/Brahak/6_zps05c8b6f5.png";
	}
}

var Dice = (function () {
	function Dice (room, amount) {
		this.room = room;
		this.reward = amount;
		this.players = [];
		var that = this;
		this.timer = setTimeout(function () {
			that.room.add('|html|<b>The game of dice has been ended due to the lack of players');
			that.room.update();
			delete dicegames[that.room.id];
		}, 60 * 1000); //1 minute
	}
	
	Dice.prototype.join = function (user, self) {
		if (Core.read('money', user.userid) < this.reward) return self.sendReply('You don\'t have enough money for this game of dice.');
		if (this.players.indexOf(user) > -1) return self.sendReply('You have already joined this game of dice.');
		var p1 = this.players[0];
		if (this.players.length) {
			for (var i = 0; i < user.getAlts().length; i++) {
				if (p1.userid === user.getAlts()[i]) return self.sendReply('Your alt \'' + user.getAlts()[i] + '\' has already joined this game of dice.');
			}
			if (p1.getAlts().indexOf(user.userid) > -1) return self.sendReply('Your alt \'' + p1.name + '\' has already joined this game of dice.');
			
			for (i in user.prevNames) {
				if (pl.userid === i && i !== user.userid) return self.sendReply('Your have already joined this game of dice.');
			}
		}
		this.players.push(user);
		this.room.add(user.name + ' has joined the game!');
		if (this.players.length === 2) this.play();
	};
	
	Dice.prototype.leave = function (user, self) {
		if (this.players.indexOf(user) === -1) return self.sendReply('You haven\'t joined the game of dice yet.');
		this.players.splice(0, this.players.indexOf(user), 1);
		this.room.add(user.name + ' has left the game.');
	};
	
	Dice.prototype.play = function () {
		var p1 = this.players[0];
		var p2 = this.players[1];
		var roll1 = Math.floor(Math.random() * 6);
		var roll2 = Math.floor(Math.random() * 6);
		while (roll1 === roll2) {
			roll1 = Math.floor(Math.random() * 6);
			roll2 = Math.floor(Math.random() * 6);
		}
		var winner, loser;
		if (roll1 > roll2) {
			winner = p1.name;
			loser = p2.name;
		} else {
			winner = p2.name;
			loser = p1.name;
		}
		var buck = (this.reward === 1 ? 'buck' : 'bucks');
		this.room.add('|html|<div class="infobox"><center><b>The dice game has been started!</b><br />' +
            'Rolling the dice...<br />' +
            '<img src = "' + diceImg(roll1) + '" align = "left"><img src = "' + diceImg(roll2) + '" align = "right"><br/>' +
            '<b>' + p1.name + '</b> rolled ' + (roll1 + 1) + '!<br />' +
            '<b>' + p2.name + '</b> rolled ' + (roll2 + 1) + '!<br />' +
			'<b>' + winner + '</b> has won <b>' + this.reward + '</b> ' + buck + '!<br/>' + 
			'Better luck next time, ' + loser + '!');
		Core.write('money', toId(winner), this.reward, '+');
		Core.write('money', toId(loser), this.reward, '-');
		this.room.update();
		clearTimeout(this.timer);
		delete dicegames[this.room.id];
	};
	
	Dice.prototype.end = function (user) {
		this.room.add('|html|<b>The game of dice has been ended by ' + user.name);
		clearTimeout(this.timer);
		delete dicegames[this.room.id];
	};
	return Dice;
})();

var cmds = {
	'': 'help',
	help: function (target, room, user) {
		this.sendReplyBox('<b><center>Dice rules and commands</center></font></b><br />' +
            '-/diceon or /dicegame <i>Amount</i> - Starts a game of dice in the room for the specified number of bucks (1 by default). Must be ranked + or higher to use.<br />' +
            '-/dicegame join or /play - Joins the game of dice. You cannot use this if you don\'t have the number of bucks the game is for. <br />' +
            '-/dicegame leave or /leavegame - Leaves the game of dice. <br />' +
            '-/dicegame end or /diceend - Shows the number of participants in the game.');
	},
	start: function (target, room, user) {
		if (!this.can('broadcast', null, room)) return this.sendReply('You must be ranked + or higher to start a game of dice.');
		if (dicegames[room.id]) return this.sendReply('There is already a game of dice going on in this room.');
		target = toId(target);
		if (isNaN(target)) return this.sendReply(target + ' isn\'t a valid number.');
        var amount = Number(target) || 1;
		
		var buck = (amount === 1 ? 'buck' : 'bucks');
		this.add('|html|<div class="infobox"><font color = #007cc9><center><h2>' + user.name + ' has started a dice game for <font color = green>' + amount + '</font color> ' + buck + '!<br />' +
            '<center><button name = "send" value = "/dicegame join">Click to join!</button>');
		dicegames[room.id] = new Dice(room, amount);
	},
	join: function (target, room, user) {
		if (!dicegames[room.id]) return this.sendReply('There is no game of dice going on in this room.');
		if ((user.locked || room.isMuted(user)) && !user.can('bypassall')) return this.sendReply("You cannot do this while unable to talk.");
		
		dicegames[room.id].join(user, this);
	},
	leave: function (target, room, user) {
		if (!dicegames[room.id]) return this.sendReply('There is no game of dice going on in this room.');
		
		dicegames[room.id].leave(user, this);
	},
	end: function (target, room, user) {
		if (!this.can('broadcast', null, room)) return this.sendReply('You must be ranked + or higher to end a game of dice.');
		if (!dicegames[room.id]) return this.sendReply('There is no game of dice going on in this room.');
		
		dicegames[room.id].end(user);
	}
};

exports.commands = {
	diceg: 'dicegame',
	dicegame: cmds,
	diceon: cmds.start,
	dicehelp: cmds.help,
	diceon: cmds.start,
	joindice: cmds.join,
	play: cmds.join,
	diceend: cmds.end,
	leavegame: cmds.leave,
	diceleave: cmds.leave
};