'use strict';
const fs = require('fs');
const request = require('request');

let deleteLadderConfirm = false;

let regdateCache = {};

exports.commands = {
	afk: 'away',
	dinner: 'away',
	dindins: 'away',
	busy: 'away',
	away: function (target, room, user, connection, cmd) {
		if (user.isAway) return this.parse('/back');
		let Names = {dindins: ' - ⒹⓘⓝⒹⓘⓝⓢ', dinner: ' - ⒹⓘⓝⒹⓘⓝⓢ', busy: '- ⒷⓊⓈⓎ'};
		let Messages = {dindins: 'is now having dindins', dinner: 'is now having dinner', busy: 'is now busy'};

		user.awayName = Names[cmd] || '- ⒶⒻⓀ';
		let awayMessage = Messages[cmd] || 'is now away';
		target = Chat.escapeHTML(target);
		let name = user.name;

		if (user.isStaff && this.canTalk()) this.add('|raw|-- <b>' + name + '</b> ' + awayMessage + '. ' + (target ? " (" + target + ")" : ""));
		else this.sendReply('You are now away.');
		for (let i in Names) name = name.replace(RegExp(Names[i], 'g'), '');
		user.forceRename(name + user.awayName, undefined, true);
		user.isAway = true;
		user.updateIdentity();
	},

	unafk: 'unafk',
	back: function(target, room, user, connection) {
		if (!user.isAway) return this.sendReply('You are not set as away.');
		let name = user.name.replace(RegExp(user.awayName, 'g'), '');
		user.forceRename(name, undefined, true);
		if (user.isStaff && this.canTalk()) this.add('|raw|-- <b>' + user.name + '</b> is back.');
		user.isAway = false;
		delete user.awayName;
		user.updateIdentity();
	},

	tell: function (target, room, user, connection, cmd) {
		if (!target) return this.parse('/help tell')
		target = this.splitTarget(target);
		let targetUser = this.targetUsername;
		let id = toId(targetUser);
		if (!user.autoconfirmed && !user.isStaff) return this.errorReply("You must be autoconfirmed to use this command.")
		if (id === user.userid || (Users(id) && Users(id).userid === user.userid)) return this.sendReply('You can\'t send a message to yourself!');
		if (Users(id) && Users(id).connected) return this.sendReply('User ' + Users(id).name + ' is currently online. PM them instead.');
		if (!id || !target) return this.parse('/help tell');

		let tells = JSON.parse(fs.readFileSync('storage-files/tells.json')) || {};
		if (tells[id]) {
			if (!user.can('hotpatch')) {
				let names = Object.keys(user.prevNames).concat(user.userid);
				for (let i in names) {
					let name = names[i];
					if (tells[id][name] && tells[id][name].length > 3) return this.sendReply('You may only leave 3 messages for a user at a time. Please wait until ' + targetUser + ' comes online and views them before sending more.');
				}
			}
		} else tells[id] = {};

		let tell = tells[id][user.userid];
		let msg = '<font color = "gray"><i>(Sent by ' + user.name + ' on ' + (new Date()).toUTCString() + ')</i></font><br><b><font color = "' + hashColor(user.userid) + '">' + user.name + ':</color></b> ' + Chat.escapeHTML(target);
		if (tell) tells[id][user.userid].push(msg);
		else tells[id][user.userid] = [msg];

		fs.writeFileSync('storage-files/tells.json', JSON.stringify(tells));
		this.sendReply('Your message "' + target + '" has successfully been sent to ' + this.targetUsername + '.');
	},
	tellhelp: ['/tell [user], [message] - Leaves a message for an offline user for them to see when they log on next.'],

	seen: 'lastseen',
	lastseen: function (target, room, user, connection, cmd) {
		if (!this.runBroadcast()) return;
		target = Users.getExact(target) ? Users.getExact(target).name : target;
		if (!toId(target) || toId(target) === user.userid) target = user.name;

		let seen = Seen.get(target);
		if (seen === 'never') return this.sendReplyBox(target + ' has <font color = "red">never</font> been seen online.');
		seen = seen.join(', ');

		let hash = '<b style = "color:' + hashColor(target) + ';">' + target + '</b>';
		if (Users.getExact(target) && Users.getExact(target).connected) return this.sendReplyBox(hash + ' is currently <font color = "green">online</font>. This user has stayed online for ' + seen + '.');
		return this.sendReplyBox(hash + ' was last seen ' + seen + ' ago.');
	},

	registered: 'regdate',
	regdate: function (target, room, user, connection, cmd) {
		if (!target) return this.parse('/help regdate');

		let id = toId(target);
		if (!id) return this.sendReply("'" + target + "' is not a valid username.");
		if (id.length > 18) return this.sendReply('Usernames cannot exceed 18 characters.');
		if (!this.runBroadcast()) return;
		
		if (regdateCache[id]) return this.sendReplyBox(regdateCache[id]);

		let path = "http://pokemonshowdown.com/users/" + toId(target) + '.json';

		request(path, (error, response, body) => {
			if (error || response.statusCode === 404) {
				this.sendReplyBox(target + ' is not registered.');
			} else {
				let info = JSON.parse(body);
				let name = (Users(target) ? Users(target).name : info.username);
				if (!info.registertime) return this.sendReplyBox(name + ' is not registered.');
				else {
					let regTime = info.registertime;
					while (('' + regTime).length < 13) regTime = Number(('' + regTime) + '0');
					regTime = require('dateformat')(regTime, 'dddd, mmmm dS yyyy, HH:MM:ss');
					let msg = name + ' was registered on ' + regTime + '.';
					regdateCache[toId(name)] = msg;
					this.sendReplyBox(msg);
				}
			}
			if (this.broadcasting) room.update();
		});
	},
	regdatehelp: ['/regdate [user] - Displays the day, date, and time a user was registered.'],

	u: 'urbandefine',
	ud: 'urbandefine',
	urbandefine: function (target, room, user) {
		if (!this.runBroadcast() && this.can('hotpatch')) return;
		else (room.id === 'lobby' && this.broadcasting) return this.sendReply('You cannot broadcast this command in the lobby.');
		else if (!target) return this.parse('/help urbandefine')
		else if (target > 50) return this.sendReply('Phrase can not be longer than 50 characters.');

		let self = this;
		let options = {
			url: 'http://www.urbandictionary.com/iphone/search/define',
			term: target,
			headers: {
				'Referer': 'http://m.urbandictionary.com'
			},
			qs: {
				'term': target
			}
		};

		function callback(error, response, body) {
			if (!error && response.statusCode == 200) {
				let page = JSON.parse(body);
				let definitions = page['list'];
				if (page['result_type'] == 'no_results') {
					self.sendReplyBox('No results for <b>"' + Chat.escapeHTML(target) + '"</b>.');
					return room.update();
				} else {
					if (!definitions[0]['word'] || !definitions[0]['definition']) {
						self.sendReplyBox('No results for <b>"' + Chat.escapeHTML(target) + '"</b>.');
						return room.update();
					}
					let output = '<b>' + Chat.escapeHTML(definitions[0]['word']) + ':</b> ' + Chat.escapeHTML(definitions[0]['definition']).replace(/\r\n/g, '<br />').replace(/\n/g, ' ');
					if (output.length > 400) output = output.slice(0, 400) + '...';
					self.sendReplyBox(output);
					return room.update();
				}
			}
		}
		request(options, callback);
	},

	def: 'define',
	define: function (target, room, user) {
		if (!this.runBroadcast()) return;
		if (!target) return this.parse('/help define');
		target = toId(target);
		if (target > 50) return this.sendReply('Word can not be longer than 50 characters.');

		let self = this;
		let options = {
			url: 'http://api.wordnik.com:80/v4/word.json/' + target + '/definitions?limit=3&sourceDictionaries=all' +
				'&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5',
		};

		function callback(error, response, body) {
			if (!error && response.statusCode == 200) {
				let page = JSON.parse(body);
				let output = '<b>Definitions for ' + target + ':</b><br />';
				if (!page[0]) {
					self.sendReplyBox('No results for <b>"' + target + '"</b>.');
					return room.update();
				} else {
					let count = 1;
					for (let u in page) {
						if (count > 3) break;
						output += '(' + count + ') ' + page[u]['text'] + '<br />';
						count++;
					}
					self.sendReplyBox(output);
					return room.update();
				}
			}
		}
		request(options, callback);
	},

	sprite: function (target, room, user, connection, cmd) {
		if (!this.runBroadcast()) return;
		if (!toId(target)) return this.sendReply('/sprite [Pokémon] - Allows you to view the sprite of a Pokémon');
		target = target.toLowerCase().split(',');
		let alt = '';
		let type = toId(target[1]);
		let sprite = target[0].trim();
		let url;
		if (type === 'shiny') url = 'http://play.pokemonshowdown.com/sprites/xyani-shiny/';
		else if (type === 'back') url = 'http://play.pokemonshowdown.com/sprites/xyani-back/';
		else if (type === 'backshiny' || type === 'shinyback') url = 'http://play.pokemonshowdown.com/sprites/xyani-back-shiny/';
		else url = 'http://play.pokemonshowdown.com/sprites/xyani/';

		if (Number(sprite[sprite.length - 1]) && !toId(sprite[sprite.length - 2])) {
			alt = '-' + sprite[sprite.length - 1];
			sprite = sprite.substr(0, sprite.length - 1);
			url = 'http://www.pkparaiso.com/imagenes/xy/sprites/animados/';
		}
		let main = target[0].split(',');
		if (Tools.data.Pokedex[toId(sprite)]) {
			sprite = Tools.data.Pokedex[toId(sprite)].species.toLowerCase();
		} else {
			let correction = Tools.dataSearch(toId(sprite));
			if (correction && correction.length) {
				for (let i = 0; i < correction.length; i++) {
					if (correction[i].id !== toId(sprite) && !Tools.data.Aliases[toId(correction[i].id)] && !i) {
						if (!Tools.data.Pokedex[toId(correction[i])]) continue;
						if (!Tools.data.Aliases[toId(sprite)]) this.sendReply("There isn't any Pokémon called '" + sprite + "'... Did you mean '" + correction[0].name + "'?\n");
						sprite = Tools.data.Pokedex[correction[0].id].species.toLowerCase();
					}
				}
			} else {
				return this.sendReply("There isn\'t any Pokémon called '" + sprite + "'...");
			}
		}
		let self = this;
		require('request').get(url + sprite + alt + '.gif').on('error', function () {
			self.sendReply('The sprite for ' + sprite + alt + ' is unavailable.');
			room.update();
		}).on('response', function (response) {
			if (response.statusCode == 404) return self.sendReply('The sprite for ' + sprite + alt + ' is currently unavailable.');
			self.sendReply('|html|<img src = "' + url + sprite + alt + '.gif">');
			room.update();
		});
	},

	tourelo: 'tourladder',
	tourladder: function (target, room, user) {
		if (!this.runBroadcast()) return;
		if (!this.broadcasting) return this.parse('/fulltourladder');
		let tourLadder = Ladders('tournaments');
		if (!target || !target.trim()) {
			tourLadder.load().then(users => {
				if (!users.length) return this.sendReplyBox('No rated tournaments have been played yet.');
				users.sort((a, b) => {
					return b[1] - a[1];
				});
				let padding = this.broadcasting ? '5' : '8';
				let table = '<center><b><u>Tournament Ladder</u></b><br>' +
					'<table border = "1" cellspacing = "0" cellpadding = "' + padding + '"><tr><th>No.</th><th>User</th><th>Elo</th>';
				for (let i = 0; i < (this.broadcasting && users.length > 10 ? 10 : users.length); i++) {
					if (!users[i] || users[i][1] <= 1000) break;
					let user = (Users.getExact(users[i][0]) ? Users.getExact(users[i][0]).name : users[i][0]);
					table += '<tr><td><center>' + (i + 1) + '</center></td><td style = "text-align: center">' + user + '</td><td style = "text-align: center">' + Math.round(users[i][1]) + '</td></tr>';
				}
				table += '</table></center>';
				if (this.broadcasting && users.length > 10) table += '<center><button name = "send" value = "/tourladder"><small>Click to see the full ladder</small></button></center>';

				if (this.broadcasting) this.sendReplyBox(table);
				else this.popupReply(table);
				room.update();
			});
			return;
		}

		target = (Users.getExact(target) ? Users.getExact(target).name : target);
		if (tourLadder.indexOfUser(target) === -1) return this.sendReplyBox(target + ' has not played any rated tournaments yet.');
		tourLadder.load().then(users => {
			let elo = users[tourLadder.indexOfUser(target)][1];
			this.sendReplyBox(target + '\'s Tournament Elo is <b>' + Math.round(elo) + '</b>.');
		});
	},

	fulltourladder: function (target, room, user) {
		Ladders('tournaments').load().then(users => {
			if (!users.length) return this.sendReplyBox('No rated tournaments have been played yet.');
			users.sort((a, b) => { 
				return b[1] - a[1];
			});
			var table = '|html|<center><b><u>Tournament Ladder</u></b><br>' +
				'<table border = "1" cellspacing = "0" cellpadding = "5" style = "font-size: 12pt"><tr><th>No.</th><th>User</th><th>Elo</th>';
			for (var i = 0; i < users.length; i++) {
				if (!users[i] || users[i][1] <= 1000) break;
				var user = (Users.getExact(users[i][0]) ? Users.getExact(users[i][0]).name : users[i][0]);
				table += '<tr><td><center>' + (i + 1) + '</center></td><td style = "text-align: center">' + user + '</td><td style = "text-align: center">' + Math.round(users[i][1]) + '</td></tr>';
			}
			this.popupReply(table + '</table>');
		});
	},

	deletetourladder: 'resettourladder',
	resettourladder: function (target, room, user) {
		if (!this.can('hotpatch')) return false;
		Ladders('tournaments').load().then(users => {
			if (!users.length) return this.sendReply('No rated tournaments have been played yet.');
			if (!deleteLadderConfirm) {
				deleteLadderConfirm = true;
				return this.sendReply('WARNING: This will permanently delete all tournament ladder ratings. If you\'re sure you want to do this, use this command again.');
			}
			deleteLadderConfirm = false;
			delete Ladders.ladderCaches['tournaments'];
			require('fs').unlinkSync('config/ladders/tournaments.tsv');
			Rooms('lobby').add('|html|<b>The Tournament Ladder has been reset.</b>').update();
			if (room.id !== 'lobby') this.sendReply('The Tournament Ladder has been reset.');
		});
	},
}
