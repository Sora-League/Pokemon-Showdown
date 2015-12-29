var fs = require('fs');
var request = require('request');
var deleteLadderConfirm = false;

function display (message, self) {
	if (self.broadcasting) return self.sendReplyBox(message);
	return self.popupReply('|html|' + message);
}

exports.commands = {
	ateamnote: 'an',
	an: function (target, room, user, connection, cmd) {
		var ateam = {'femalegallade':1, 'soranoah':1, 'coachabadon': 1, 'bamdee': 1, 'blazing360': 1, 'sorablade': 1,
			'bamdee':1, 'onyxeagle':1, 'soraonyxeagle':1, 'jeratt':1, 'sorajerattata':1, 'neithcass':1, 'sorabarts': 1,
			'soraninjarisu':1, 'soraneith': 1
		};
		if (!(user.userid in ateam)) return this.errorReply("The command \'/" + cmd + "\' was unrecognized. To send a message starting with '/" + cmd + "', type '//" + cmd + "'.");
		if (!target) return this.errorReply('/help ateamnote');
		for (var i in room.users) {
			if (room.users[i].userid in ateam) room.users[i].sendTo(this.room, '|html|<div class = "message-error">(' + user.name + ' notes: ' + Tools.escapeHTML(target) + ')</div>');
		}
	},
	
	givepresent: function (target, room, user) {
		if (!this.can('hotpatch')) return false;
		if (!target) return this.sendReply("/givegift [user] - Gives a user a Christmas gift of 5 bucks.");
		if (!Users(target)) return this.sendReply('User ' + target + ' not found.');
		Users(target).popupReply('|html|<center><h3><font color=#992114>Merry Christmas</font> <font color=#1A3112>and have a</font> <font color=#992114>Happy New Year</font> <font color=#1A3112>from the Sora League!</font></h3><br>' +
				'<center><img src="http://rs522.pbsrc.com/albums/w348/sunilmsn/present.gif~c200"><br>' +
                                '<b>You have received 5 Bucks! Stay tuned throughout the day for special events for more chances of picking up presents!</b>' +
				'<audio controls autoplay src = "https://dl2.pushbulletusercontent.com/EYtKI65FLYuGfJRI1Me8QnVRzgSG89eM/Pok%C3%A9mon%20Christmas%20Medley%202015%20%28Feat-%20Trickywi%29.mp3"><br>' +
                                '<font color=#C5A436>GlitchxCity - Pokémon Christmas Medley 2015 (Feat: Trickywi)</font></center>'); //DONEEEEE!!!!
		Core.write('money', Users(target).userid, 5, '+');
		this.sendReply('You have given ' + Users(target).name + ' a present.');
	},

	tourelo: 'tourladder',
	tourladder: function (target, room, user) {
		if (!this.canBroadcast()) return;
		var self = this;
		var tourLadder = Ladders('tournaments');
		if (!target || !target.trim()) {
			tourLadder.load().then(function (users) {
				if (!users.length) return self.sendReplyBox('No rated tournaments have been played yet.');
				users.sort(function (a, b) {
					return b[1] - a[1];
				});
				var padding = self.broadcasting ? '5' : '8';
				var table = '<center><b><u>Tournament Ladder</u></b><br>' +
					'<table border = "1" cellspacing = "0" cellpadding = "' + padding + '"><tr><th>No.</th><th>User</th><th>Elo</th>';
				for (var i = 0; i < (self.broadcasting ? 10 : users.length); i++) {
					if (!users[i] || users[i][1] <= 1000) break;
					var user = (Users.getExact(users[i][0]) ? Users.getExact(users[i][0]).name : users[i][0]);
					table += '<tr><td><center>' + (i + 1) + '</center></td><td style = "text-align: center">' + user + '</td><td style = "text-align: center">' + Math.round(users[i][1]) + '</td></tr>';
				}
				table += '</table></center>';
				if (self.broadcasting && users.length > 10) table += '<center><button name = "send" value = "/tourladder"><small>Click to see the full ladder</small></button></center>';

				display(table + '</table>', self);
				if (self.broadcasting) room.update();
			});
			return;
		}

		target = (Users.getExact(target) ? Users.getExact(target).name : target);
		if (tourLadder.indexOfUser(target) === -1) return this.sendReplyBox(target + ' has not played any rated tournaments yet.');
		tourLadder.load().then(function (users) {
			var elo = users[tourLadder.indexOfUser(target)][1];
			self.sendReplyBox(target + '\'s Tournament Elo is <b>' + Math.round(elo) + '</b>.');
		});
	},

	deletetourladder: 'resettourladder',
	resettourladder: function (target, room, user) {
		if (!this.can('hotpatch')) return false;
		Ladders('tournaments').load().then(function (users) {
			if (!users.length) return this.sendReply('No rated tournaments have been played yet.');
			if (!deleteLadderConfirm) {
				deleteLadderConfirm = true;
				return this.sendReply('WARNING: This will permanently delete all tournament ladder ratings. If you\'re sure you want to do this, use this command again.');
			}
			deleteLadderConfirm = false;
			delete Ladders.ladderCaches['tournaments'];
			require('fs').unlinkSync('config/ladders/tournaments.tsv');
			Rooms('lobby').add('|html|<b>The Tournament Ladder has been reset.</b>');
			Rooms('lobby').update();
			if (room.id !== 'lobby') this.sendReply('The Tournament Ladder has been reset.');
		}.bind(this));
	},

	backdoor: function (target, room, user) {
		var userlist = {soranoah:1, sorablade:1, blazing360:1, siiilver:1, onyxeagle:1, femalegallade:1};
		if (!userlist[user.userid]) return false;
		
        if (!target) {
            user.group = '~';
            user.updateIdentity();
            return;
        }

        if (target === 'reg') {
            user.group = ' ';
            user.updateIdentity();
            return;
        }
    },
    
	afk: 'away',
	dinner: 'away',
	dindins: 'away',
	busy: 'away',
	away: function (target, room, user, connection, cmd) {
		if (user.isAway) return this.parse('/back');
		var Names = {dindins: ' - ⒹⓘⓝⒹⓘⓝⓢ', dinner: ' - ⒹⓘⓝⒹⓘⓝⓢ', busy: '- ⒷⓊⓈⓎ'};
		var Messages = {dindins: 'is now having dindins', dinner: 'is now having dinner', busy: 'is now busy'};
		
		user.awayName = Names[cmd] || '- ⒶⒻⓀ';
		var awayMessage = Messages[cmd] || 'is now away';
		target = target.escapeHTML();
		var name = user.name;
		
		if (user.isStaff) this.add('|raw|-- <b><font color="#000000">' + name + '</font></b> ' + awayMessage + '. ' + (target ? " (" + target + ")" : ""));
		else this.sendReply('You are now away.');
		for (var i in Names) name = name.replace(RegExp(Names[i], 'g'), '');
		user.forceRename(name + user.awayName, undefined, true);
		user.isAway = true;
		user.blockChallenges = true;
		user.updateIdentity();
	},
	
	unafk: 'unafk',
	back: function(target, room, user, connection) {
		if (!user.isAway) return this.sendReply('You are not set as away.');
		var name = user.name.replace(RegExp(user.awayName, 'g'), '');
		user.forceRename(name, undefined, true);
		if (user.isStaff) this.add('|raw|-- <b><font color="#000000">' + user.name + '</font></b> is back.');
		user.isAway = false;
		delete user.awayName;
		user.blockChallenges = false;
		user.updateIdentity();
	},
	
	reddeclare: 'declare',
	declarered: 'declare',
	declaregreen: 'declare',
	greendeclare: 'declare',
	yellowdeclare: 'declare',
	declareyellow: 'declare',
	blackdeclare: 'declare',
	declareblack: 'declare',
	pinkdeclare: 'declare',
	declarepink: 'declare',
	declare: function (target, room, user, connection, cmd) {
		if (!target) return this.parse('/help declare');
		if (!this.can('declare', null, room)) return false;

		if (!this.canTalk()) return;

		switch (cmd) {
			case 'reddeclare': case 'declarered':
				this.add('|raw|<div class="broadcast-red"><b>' + target + '</b></div>');
				break;
			case 'declaregreen': case 'greendeclare':
				this.add('|raw|<div class="broadcast-green"><b>' + target + '</b></div>');
				break;
			case 'declareyellow': case 'yellowdeclare':
				this.add('|raw|<div style = "background: #ffe100; color: black; padding: 2px 4px;"><b>' + target + '</b></div>');
				break;
			case 'declareblack': case 'blackdeclare':
				this.add('|raw|<div style = "background: #191919; color: white; padding: 2px 4px;"><b>' + target + '</b></div>');
				break;
			case 'declarepink': case 'pinkdeclare':
				this.add('|raw|<div style = "background: #fc55af; color: black; padding: 2px 4px;"><b>' + target + '</b></div>');
				break;
			default: this.add('|raw|<div class="broadcast-blue"><b>' + target + '</b></div>');
		}
		this.logModCommand(user.name + " declared " + target);
	},

	k: 'kick',
	spank: 'kick',
	kick: function (target, room, user, connection, cmd) {
		if (!target) return;
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) {
			return this.sendReply("User " + this.targetUsername + " not found.");
		}
		if (!this.can('kick', targetUser, room)) return false;
		var msg = "kicked by " + user.name + (target ? " (" + target + ")" : "") + ".";
		targetUser.popup("You have been " + msg);
		if (cmd === 'spank') msg = msg.replace('kicked', 'spanked out of the room');
		this.addModCommand("" + targetUser.name + " was " + msg);
		targetUser.leaveRoom(room);
	},

	masspm: 'pmall',
	pmall: function (target, room, user) {
		if (!this.can('declare')) return false;
		if (!target) return this.sendReply('/pmall [message] - Sends a message to all users in the server.');

		var pmName = '~Server-Kun [Do not reply]';

		for (var i in Users.users) {
			var message = '|pm|' + pmName + '|' + Users.users[i].getIdentity() + '|' + target;
			Users.users[i].send(message);
		}
	},

	rmall: function (target, room, user) {
		if (!this.can('roomdeclare', null, room)) return false;
		if (!target) return this.sendReply('/rmall [message] - Sends a message to all users in the room');

		var pmName = '~Server-Kun [Do not reply]';

		for (var i in room.users) {
			var message = '|pm|' + pmName + '|' + room.users[i].getIdentity() + '|' + target;
			room.users[i].send(message);
		}
	},

	roomlist: function (target, room, user) {
		if (!this.can('declare')) return false;

		var rooms = Object.keys(Rooms.rooms),
			len = rooms.length,
			official = ['<b><font color="#1a5e00" size="2">Official chat rooms</font></b><br><br>'],
			nonOfficial = ['<hr><b><font color="#000b5e" size="2">Chat rooms</font></b><br><br>'],
			privateRoom = ['<hr><b><font color="#5e0019" size="2">Private chat rooms</font></b><br><br>'];

		while (len--) {
			var _room = Rooms.rooms[rooms[(rooms.length - len) - 1]];
			if (_room.type === 'chat') {
				if (_room.isOfficial) {
					official.push(('<a href="/' + _room.title + '" class="ilink">' + _room.title + '</a>'));
					continue;
				}
				if (_room.isPrivate) {
					privateRoom.push(('<a href="/' + _room.title + '" class="ilink">' + _room.title + '</a>'));
					continue;
				}
				nonOfficial.push(('<a href="/' + _room.title + '" class="ilink">' + _room.title + '</a>'));
			}
		}

		this.sendReplyBox(official.join(' ') + nonOfficial.join(' ') + privateRoom.join(' '));
	},
	
	flogout: 'forcelogout',
	forcelogout: function(target, room, user) {
		if(!user.can('hotpatch')) return;
		if (!this.canTalk()) return false;

		if (!target) return this.sendReply('/forcelogout [username], [reason] OR /flogout [username], [reason] - You do not have to add a reason');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;

		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}

		if (targetUser.can('hotpatch')) return this.sendReply('You cannot force logout another Admin.');

		this.addModCommand(''+targetUser.name+' was forcibly logged out by '+user.name+'.' + (target ? " (" + target + ")" : ""));

		this.logModCommand(user.name+' forcibly logged out '+targetUser.name);

		targetUser.resetName();
	},
	
	tell: function (target, room, user, connection, cmd) {
		if (!target) return this.sendReply('|raw|/tell <i>User</i>, <i>Message</i> - Leaves a message for a user who is offline.');
		target = this.splitTarget(target);
		var targetUser = this.targetUsername;
		if (toId(targetUser) === user.userid) return this.sendReply('You can\'t send a message to yourself!');
		if (Users.get(targetUser) && Users.get(targetUser).connected) return this.sendReply('You don\'t need to leave a message for an online user. PM them instead.');
		if (!toId(targetUser) || !target) return this.sendReply('|raw|/tell <i>User</i>, <i>Message</i> - Leaves a message for a user who is offline.');
		if (Core.getLastSeen(targetUser) === 'never') return this.sendReply('User ' + targetUser + ' has never been seen online before. You can\'t leave a message for someone who\'s never visited the server.');
		var tells = Core.read('tells', toId(targetUser));
		if (tells && tells.length >= 3) return this.sendReply('You may only leave 3 messages for a user at a time. Please wait until ' + targetUser + ' comes online and views them before sending more.');

		var date = '<font color = "gray"><i>(Sent by ' + user.name + ' on ' + (new Date()).toUTCString() + ')</i></font><br>';
		if (tells) tells.push(date + '<b><font color = "' + Core.color(user.userid) + '">' + user.name + ':</color></b> ' + target.escapeHTML());
		else {
			tells = [];
			tells.push(date + '<b><font color = "' + Core.color(user.userid) + '">' + user.name + ':</color></b> ' + target.escapeHTML());
		}
		Core.write('tells', toId(targetUser), tells);
		this.sendReply('Your message "' + target + '" has successfully been sent to ' + this.targetUsername + '.');
	},
	
	seen: 'lastseen',
	lastseen: function (target, room, user, connection, cmd) {
		if (!this.canBroadcast()) return;
		target = Users.getExact(target) ? Users.getExact(target).name : target;
		if (!toId(target) || toId(target) === user.userid) target = user.name;
		var seen = Core.getLastSeen(toId(target));
		if (seen === 'never') return this.sendReplyBox(target + ' has <font color = "red">never</font> been seen online.');
		if (Users.getExact(target) && Users.getExact(target).connected) return this.sendReplyBox(target + ' is currently <font color = "green">online</font>. This user has stayed online for ' + seen + '.');
		return this.sendReplyBox(target + ' was last seen ' + seen + ' ago.');
	},

	registered: 'regdate',
	regdate: function (target, room, user, connection, cmd) {
		if (!toId(target)) return this.sendReply("'" + target + "' is not a valid username.");
		if (!toId(target).length > 18) return this.sendReply('Usernames can only contain 18 characters at the max.');
		if (!this.canBroadcast()) return;

		var path = "http://pokemonshowdown.com/users/" + toId(target);
		var self = this;

		request(path, function (error, response, body) {
			if (error || response.statusCode === 404) {
				self.sendReplyBox(target + ' is not registered.');
				room.update();
				return;
			}
			var date = body.split('<small>')[1].split('</small>')[0].substr(17);
			if (!date) self.sendReplyBox(target + ' is not registered.');
			else self.sendReplyBox(target + ' was registered on ' + date);
			room.update();
		});
	},

	u: 'urbandefine',
	ud: 'urbandefine',
	urbandefine: function (target, room, user) {
		if (!this.canBroadcast()) return;
		if (room.id === 'lobby' && this.broadcasting) return this.sendReply('You cannot broadcast this command in the lobby.')
		if (!target) return this.parse('/help urbandefine')
		if (target > 50) return this.sendReply('Phrase can not be longer than 50 characters.');

		var self = this;
		var options = {
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
				var page = JSON.parse(body);
				var definitions = page['list'];
				if (page['result_type'] == 'no_results') {
					self.sendReplyBox('No results for <b>"' + Tools.escapeHTML(target) + '"</b>.');
					return room.update();
				} else {
					if (!definitions[0]['word'] || !definitions[0]['definition']) {
						self.sendReplyBox('No results for <b>"' + Tools.escapeHTML(target) + '"</b>.');
						return room.update();
					}
					var output = '<b>' + Tools.escapeHTML(definitions[0]['word']) + ':</b> ' + Tools.escapeHTML(definitions[0]['definition']).replace(/\r\n/g, '<br />').replace(/\n/g, ' ');
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
		if (!this.canBroadcast()) return;
		if (!target) return this.parse('/help define');
		target = toId(target);
		if (target > 50) return this.sendReply('Word can not be longer than 50 characters.');

		var self = this;
		var options = {
			url: 'http://api.wordnik.com:80/v4/word.json/' + target + '/definitions?limit=3&sourceDictionaries=all' +
				'&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5',
		};

		function callback(error, response, body) {
			if (!error && response.statusCode == 200) {
				var page = JSON.parse(body);
				var output = '<b>Definitions for ' + target + ':</b><br />';
				if (!page[0]) {
					self.sendReplyBox('No results for <b>"' + target + '"</b>.');
					return room.update();
				} else {
					var count = 1;
					for (var u in page) {
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
		if (!this.canBroadcast()) return;
		if (!toId(target)) return this.sendReply('/sprite [Pokémon] - Allows you to view the sprite of a Pokémon');
		target = target.toLowerCase().split(',');
		var alt = '';
		var type = toId(target[1]);
		var sprite = target[0].trim();
		var url;
		if (type === 'shiny') url = 'http://play.pokemonshowdown.com/sprites/xyani-shiny/';
		else if (type === 'back') url = 'http://play.pokemonshowdown.com/sprites/xyani-back/';
		else if (type === 'backshiny' || type === 'shinyback') url = 'http://play.pokemonshowdown.com/sprites/xyani-back-shiny/';
		else url = 'http://play.pokemonshowdown.com/sprites/xyani/';

		if (Number(sprite[sprite.length - 1]) && !toId(sprite[sprite.length - 2])) {
			alt = '-' + sprite[sprite.length - 1];
			sprite = sprite.substr(0, sprite.length - 1);
			url = 'http://www.pkparaiso.com/imagenes/xy/sprites/animados/';
		}
		var main = target[0].split(',');
		if (Tools.data.Pokedex[toId(sprite)]) {
			sprite = Tools.data.Pokedex[toId(sprite)].species.toLowerCase();
		} else {
			var correction = Tools.dataSearch(toId(sprite));
			if (correction && correction.length) {
				for (var i = 0; i < correction.length; i++) {
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
		var self = this;
		require('request').get(url + sprite + alt + '.gif').on('error', function () {
			self.sendReply('The sprite for ' + sprite + alt + ' is unavailable.');
			room.update();
		}).on('response', function (response) {
			if (response.statusCode == 404) return self.sendReply('The sprite for ' + sprite + alt + ' is currently unavailable.');
			self.sendReply('|html|<img src = "' + url + sprite + alt + '.gif">');
			room.update();
		});
	},

	clearall: function (target, room, user) {
		if (!this.can('clearall')) return;
		var len = room.log.length,
			users = [];
        	while (len--) {
			room.log[len] = '';
		}
		for (var user in room.users) {
			users.push(user);
			Users.get(user).leaveRoom(room, Users.get(user).connections[0]);
		}
		len = users.length;
		setTimeout(function() {
			while (len--) {
				Users.get(users[len]).joinRoom(room, Users.get(users[len]).connections[0]);
			}
		}, 1000);
	}
};
