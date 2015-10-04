/*var pGames = exports.pGames = {};

function mix(word) {
	var arr = [];
	for (var k = 0; k < word.length; k++) {
		arr.push(word[k]);
	}
	var a, b, i = arr.length;
	while (i) {
		a = Math.floor(Math.random() * i);
		i--;
		b = arr[i];
		arr[i] = arr[a];
		arr[a] = b;
	}
	return arr.join('').toString();
}

var Panagram = (function () {
	function Panagram(room, category) {
		this.room = room;
		this.category = category;
		switch (toId(category)) {
		case 'items':
		case 'item':
			this.dex = Tools.data.Items;
			break;
		case 'abilities':
		case 'ability':
			this.dex = Tools.data.Abilities;
			break;
		case 'moves':
		case 'move':
			this.dex = Tools.data.Movedex;
			break;
		default:
			this.dex = Tools.data.Pokedex;
		}
		do {
			this.answer = this.dex[Object.keys(this.dex)[Math.floor(Math.random() * Object.keys(this.dex).length)]];
		} while (this.answer.num < 1 || this.answer.baseSpecies);
		this.mixed = mix(this.category === 'pokemon' ? toId(this.answer.species) : this.answer.name.toLowerCase());

		this.room.add('|html|<div class = "infobox"><center>A game of Panagram was started! Scrambled word: <b>' + this.mixed + '</b>. Category: <b>' + category + '</b><br>' +
			'<small>Enter your answer into the chat to guess!</small></center>'
		);
		this.users = {};
		this.guessed = {};

		var Game = this;
		this.room.chat = function (user, message, connection) {
			message = CommandParser.parse(message, this, user, connection);
			if (Game.dex[toId(message)]) {
				var guess = Game.dex[toId(message)];
				var guessName = guess.id || toId(guess.species);
				if (Game.users[user.userid]) return user.sendTo(this, 'You cannot guess more than once per game of panagram.');
				for (var i in Game.users)
					if (Game.users[i].latestIp === user.latestIp) return user.sendTo(this, 'One of your alts have already guessed once in this game of panagram.');
				if (guessName in Game.guessed) return user.sendTo(this, 'That word has already been guessed.');
				if (guessName === (Game.answer.id || toId(Game.answer.species))) {
					this.add('|html|<b>' + user.name + '</b> guessed <b>' + (guess.name || guess.species) + '</b>, which was the correct answer! Congratulations!');
					Game.end();
				} else if (guess.num < 1 || guess.baseSpecies) user.sendTo(this, (guess.name || guess.species) + ' is either an alternate form or doesn\'t exist in the games. These cannot be guessed.');
				else {
					if (Object.keys(Game.users).length < 3) {
						this.add('|html|<b>' + user.name + '</b> guessed <b>' + (guess.name || guess.species) + '</b>, but was not the correct answer...');
						Game.guessed[guessName] = user.userid;
						Game.users[user.userid] = user;
					} else {
						this.add('|html|<b>' + user.name + '</b> guessed <b>' + (guess.name || guess.species) + '</b>, but was not the correct answer. You have failed to guess the Pokemon, which was <b>' + (answer.name || answer.species) + '</b>');
						Game.end();
					}
				}
			} else {
				if (message && message !== true) {
					this.add('|c|' + user.getIdentity(this.id) + '|' + message);
				}
			}
			this.update();
		};
	}

	Panagram.prototype.end = function (forced) {
		if (forced) this.room.add('The game of panagram has been forcibly ended.');
		this.room.chat = Rooms.Room.prototype.chat;
		delete pGames[this.room.id];
	};
	return Panagram;
})();

var cmds = {
	rules: 'help',
	help: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<b>Panagram Commands</b><br>' +
			'<li>/panagram <em>Category</em> - Starts a game of panagram that follows the specified category. Valid categories include <i>Pokemon, Items, Abilities</i> and <i>moves</i>. Not specifying a category starts a pokemon panagram by default. Requires + or higher to use.' +
			'<li>/panagram end <small>or</small> /endp - Ends a game of panagram. Requires + or higher to use.<br>' +
			'Users can guess answers by simply typing them into the chat.'
		);
	},

	pokemon: '',
	item: '',
	items: '',
	ability: '',
	abilities: '',
	move: '',
	moves: '',
	'': function (target, room, user, connection, cmd) {
		if (pGames[room.id]) return this.sendReply('There is currently a game of panagram going on in this room.');
		if (!this.can('broadcast', null, room)) return this.sendReply('You must be ranked + or higher to start a game of panagram in this room.');
		if (!cmd) cmd = 'pokemon';

		pGames[room.id] = new Panagram(room, cmd);
	},

	end: function (target, room, user) {
		if (!pGames[room.id]) return this.sendReply('There is no game of panagram going on in this room.');
		if (!this.can('broadcast', null, room)) return this.sendReply('You must be ranked + or higher to end a game of panagram in this room.');

		pGames[room.id].end(true);
	}
}

exports.commands = {
	panagram: cmds,
	endpanagram: 'endp',
	endp: cmds.end,
}*/
