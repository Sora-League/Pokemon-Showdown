/**
 * Commands
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * These are commands. For instance, you can define the command 'whois'
 * here, then use it by typing /whois into Pokemon Showdown.
 *
 * A command can be in the form:
 *   ip: 'whois',
 * This is called an alias: it makes it so /ip does the same thing as
 * /whois.
 *
 * But to actually define a command, it's a function:
 *   birkal: function(target, room, user) {
 *     this.sendReply("It's not funny anymore.");
 *   },
 *
 * Commands are actually passed five parameters:
 *   function(target, room, user, connection, cmd, message)
 * Most of the time, you only need the first three, though.
 *
 * target = the part of the message after the command
 * room = the room object the message was sent to
 *   The room name is room.id
 * user = the user object that sent the message
 *   The user's name is user.name
 * connection = the connection that the message was sent from
 * cmd = the name of the command
 * message = the entire message sent by the user
 *
 * If a user types in "/msg zarel, hello"
 *   target = "zarel, hello"
 *   cmd = "msg"
 *   message = "/msg zarel, hello"
 *
 * Commands return the message the user should say. If they don't
 * return anything or return something falsy, the user won't say
 * anything.
 *
 * Commands have access to the following functions:
 *
 * this.sendReply(message)
 *   Sends a message back to the room the user typed the command into.
 *
 * this.sendReplyBox(html)
 *   Same as sendReply, but shows it in a box, and you can put HTML in
 *   it.
 *
 * this.popupReply(message)
 *   Shows a popup in the window the user typed the command into.
 *
 * this.add(message)
 *   Adds a message to the room so that everyone can see it.
 *   This is like this.sendReply, except everyone in the room gets it,
 *   instead of just the user that typed the command.
 *
 * this.send(message)
 *   Sends a message to the room so that everyone can see it.
 *   This is like this.add, except it's not logged, and users who join
 *   the room later won't see it in the log, and if it's a battle, it
 *   won't show up in saved replays.
 *   You USUALLY want to use this.add instead.
 *
 * this.logEntry(message)
 *   Log a message to the room's log without sending it to anyone. This
 *   is like this.add, except no one will see it.
 *
 * this.addModCommand(message)
 *   Like this.add, but also logs the message to the moderator log
 *   which can be seen with /modlog.
 *
 * this.logModCommand(message)
 *   Like this.addModCommand, except users in the room won't see it.
 *
 * this.can(permission)
 * this.can(permission, targetUser)
 *   Checks if the user has the permission to do something, or if a
 *   targetUser is passed, check if the user has permission to do
 *   it to that user. Will automatically give the user an "Access
 *   denied" message if the user doesn't have permission: use
 *   user.can() if you don't want that message.
 *
 *   Should usually be near the top of the command, like:
 *     if (!this.can('potd')) return false;
 *
 * this.canBroadcast()
 *   Signifies that a message can be broadcast, as long as the user
 *   has permission to. This will check to see if the user used
 *   "!command" instead of "/command". If so, it will check to see
 *   if the user has permission to broadcast (by default, voice+ can),
 *   and return false if not. Otherwise, it will set it up so that
 *   this.sendReply and this.sendReplyBox will broadcast to the room
 *   instead of just the user that used the command.
 *
 *   Should usually be near the top of the command, like:
 *     if (!this.canBroadcast()) return false;
 *
 * this.canTalk()
 *   Checks to see if the user can speak in the room. Returns false
 *   if the user can't speak (is muted, the room has modchat on, etc),
 *   or true otherwise.
 *
 *   Should usually be near the top of the command, like:
 *     if (!this.canTalk()) return false;
 *
 * this.canTalk(message)
 *   Checks to see if the user can say the message. In addition to
 *   running the checks from this.canTalk(), it also checks to see if
 *   the message has any banned words or is too long. Returns the
 *   filtered message, or a falsy value if the user can't speak.
 *
 *   Should usually be near the top of the command, like:
 *     target = this.canTalk(target);
 *     if (!target) return false;
 *
 * this.parse(message)
 *   Runs the message as if the user had typed it in.
 *
 *   Mostly useful for giving help messages, like for commands that
 *   require a target:
 *     if (!target) return this.parse('/help msg');
 *
 *   After 10 levels of recursion (calling this.parse from a command
 *   called by this.parse from a command called by this.parse etc)
 *   we will assume it's a bug in your command and error out.
 *
 * this.targetUserOrSelf(target)
 *   If target is blank, returns the user that sent the message.
 *   Otherwise, returns the user with the username in target, or
 *   a falsy value if no user with that username exists.
 *
 * this.splitTarget(target)
 *   Splits a target in the form "user, message" into its
 *   constituent parts. Returns message, and sets this.targetUser to
 *   the user, and this.targetUsername to the username.
 *
 *   Remember to check if this.targetUser exists before going further.
 *
 * Unless otherwise specified, these functions will return undefined,
 * so you can return this.sendReply or something to send a reply and
 * stop the command there.
 *
 * @license MIT license
 */

var commands = exports.commands = {

	ip: 'whois',
	getip: 'whois',
	rooms: 'whois',
	altcheck: 'whois',
	alt: 'whois',
	alts: 'whois',
	getalts: 'whois',
	whois: function(target, room, user) {
		var targetUser = this.targetUserOrSelf(target);
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}

		this.sendReply('User: '+targetUser.name);
		if (user.can('alts', targetUser)) {
			var alts = targetUser.getAlts();
			var output = '';
			for (var i in targetUser.prevNames) {
				if (output) output += ", ";
				output += targetUser.prevNames[i];
			}
			if (output) this.sendReply('Previous names: '+output);

			for (var j=0; j<alts.length; j++) {
				var targetAlt = Users.get(alts[j]);
				if (!targetAlt.named && !targetAlt.connected) continue;
				if (targetAlt.group === '~' && user.group !== '~') continue;

				this.sendReply('Alt: '+targetAlt.name);
				output = '';
				for (var i in targetAlt.prevNames) {
					if (output) output += ", ";
					output += targetAlt.prevNames[i];
				}
				if (output) this.sendReply('Previous names: '+output);
			}
		}
		if (config.groups[targetUser.group] && config.groups[targetUser.group].name) {
			this.sendReply('Group: ' + config.groups[targetUser.group].name + ' (' + targetUser.group + ')');
		}
		if (targetUser.isSysop) {
			this.sendReply('(Pok\xE9mon Showdown System Operator)');
		}
		if (!targetUser.authenticated) {
			this.sendReply('(Unregistered)');
		}
		if (!this.broadcasting && (user.can('ip', targetUser) || user === targetUser)) {
			var ips = Object.keys(targetUser.ips);
			this.sendReply('IP' + ((ips.length > 1) ? 's' : '') + ': ' + ips.join(', '));
		}
		var output = 'In rooms: ';
		var first = true;
		for (var i in targetUser.roomCount) {
			if (i === 'global' || Rooms.get(i).isPrivate) continue;
			if (!first) output += ' | ';
			first = false;

			output += '<a href="/'+i+'" room="'+i+'">'+i+'</a>';
		}
		this.sendReply('|raw|'+output);
	},

	ipsearch: function(target, room, user) {
		if (!this.can('rangeban')) return;
		var atLeastOne = false;
		this.sendReply("Users with IP "+target+":");
		for (var userid in Users.users) {
			var user = Users.users[userid];
			if (user.latestIp === target) {
				this.sendReply((user.connected?"+":"-")+" "+user.name);
				atLeastOne = true;
			}
		}
		if (!atLeastOne) this.sendReply("No results found.");
	},
	
	/*********************************************************
	 * Additional Commands
	 *********************************************************/

	getrandom: 'pickrandom',
	pickrandom: function (target, room, user) {
		if (!target) return this.sendReply('/pickrandom [option 1], [option 2], ... - Randomly chooses one of the given options.');
		if (!this.canBroadcast()) return;
		var targets;
		if (target.indexOf(',') === -1) {
			targets = target.split(' ');
		} else {
			targets = target.split(',');
		};
		var result = Math.floor(Math.random() * targets.length);
		return this.sendReplyBox(targets[result].trim());
	},
	
	resetsymbol: function(target, room, user) {
		if (!user.hasCustomSymbol) return this.sendReply('You don\'t have a custom symbol!');
		user.getIdentity = function() {
			if (this.muted) return '!' + this.name;
			if (this.locked) return '‽' + this.name;
			return this.group + this.name;
		};
		user.hasCustomSymbol = false;
		user.updateIdentity();
		this.sendReply('Your symbol has been reset.');
	},


	/*********************************************************
	 * Shortcuts
	 *********************************************************/

	invite: function(target, room, user) {
		target = this.splitTarget(target);
		if (!this.targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		var roomid = (target || room.id);
		if (!Rooms.get(roomid)) {
			return this.sendReply('Room '+roomid+' not found.');
		}
		return this.parse('/msg '+this.targetUsername+', /invite '+roomid);
	},

	/*********************************************************
	 * Informational commands
	 *********************************************************/

	stats: 'data',
	dex: 'data',
	pokedex: 'data',
	data: function(target, room, user) {
		if (!this.canBroadcast()) return;

		var data = '';
		var targetId = toId(target);
		var newTargets = Tools.dataSearch(target);
		if (newTargets && newTargets.length) {
			for (var i = 0; i < newTargets.length; i++) {
				var template = Tools.getTemplate(newTargets[i].species);
				if (newTargets[i].id !== targetId && !Tools.data.Aliases[targetId] && !i) {
					data = "No Pokemon, item, move or ability named '" + target + "' was found. Showing the data of '" + newTargets[0].name + "' instead.\n";
				}
				data += '|c|~|/data-' + newTargets[i].searchType + ' ' + newTargets[i].name + '\n';
				if (newTargets[i].searchType === 'pokemon') data += 'Tier: ' + template.tier + '\n';
			}
		} else {
			data = "No Pokemon, item, move or ability named '" + target + "' was found. (Check your spelling?)";
		}

		this.sendReply(data);
	},

	dexsearch: function (target, room, user) {
		if (!this.canBroadcast()) return;

		if (!target) return this.parse('/help dexsearch');
		var targets = target.split(',');
		var moves = {}, tiers = {}, colours = {}, ability = {}, gens = {}, types = {};
		var allTiers = {'uber':1,'ou':1,'uu':1,'ru':1,'nu':1,'lc':1,'cap':1,'bl':1,'bl2':1,'nfe':1, 'limbo':1};
		var allColours = {'green':1,'red':1,'blue':1,'white':1,'brown':1,'yellow':1,'purple':1,'pink':1,'gray':1,'black':1};
		var count = 0;
		var showAll = false;
		var output = 10;

		for (var i in targets) {
			target = Tools.getMove(targets[i]);
			if (target.exists) {
				if (!moves.count) {
					count++;
					moves.count = 0;
				}
				if (moves.count === 4) {
					return this.sendReply('Specify a maximum of 4 moves.');
				}
				moves[target] = 1;
				moves.count++;
				continue;
			}

			target = Tools.getAbility(targets[i]);
			if (target.exists) {
				if (!ability.count) {
					count++;
					ability.count = 0;
				}
				if (ability.count === 1) {
					return this.sendReply('Specify only one ability.');
				}
				ability[target] = 1;
				ability.count++;
				continue;
			}

			target = targets[i].trim().toLowerCase();
			if (target in allTiers) {
				if (!tiers.count) {
					count++;
					tiers.count = 0;
				}
				tiers[target] = 1;
				tiers.count++;
				continue;
			}
			if (target in allColours) {
				if (!colours.count) {
					count++;
					colours.count = 0;
				}
				colours[target] = 1;
				colours.count++;
				continue;
			}
			var targetInt = parseInt(target);
			if (0 < targetInt && targetInt < 6) {
				if (!gens.count) {
					count++;
					gens.count = 0;
				}
				gens[targetInt] = 1;
				gens.count++;
				continue;
			}
			if (target === 'all') {
				if (this.broadcasting) {
					return this.sendReply('A search with the parameter "all" cannot be broadcast.')
				}
				showAll = true;
				continue;
			}
			if (target.indexOf(' type') > -1) {
				target = target.charAt(0).toUpperCase() + target.slice(1, target.indexOf(' type'));
				if (target in Tools.data.TypeChart) {
					if (!types.count) {
						count++;
						types.count = 0;
					}
					if (types.count === 2) {
						return this.sendReply('Specify a maximum of two types.');
					}
					types[target] = 1;
					types.count++;
					continue;
				}
			} else {
				return this.sendReply('"' + targets[i].trim() + '" could not be found in any of the search categories.');
			}
		}

		if (showAll && count === 0) return this.sendReply('No search parameters other than "all" were found.\nTry "/help dexsearch" for more information on this command.');

		while (count > 0) {
			count--;
			var tempResults = [];
			if (!results) {
				for (var pokemon in Tools.data.Pokedex) {
					pokemon = Tools.getTemplate(pokemon);
					if (pokemon.tier !== 'Illegal' && (pokemon.tier !== 'CAP' || 'cap' in tiers)) {
						tempResults.add(pokemon);
					}
				}
			} else {
				for (var mon in results) tempResults.add(results[mon]);
			}
			var results = [];

			if (types.count > 0) {
				for (var mon in tempResults) {
					if (types.count === 1) {
						if (tempResults[mon].types[0] in types || tempResults[mon].types[1] in types) results.add(tempResults[mon]);
					} else {
						if (tempResults[mon].types[0] in types && tempResults[mon].types[1] in types) results.add(tempResults[mon]);
					}
				}
				types.count = 0;
				continue;
			}

			if (tiers.count > 0) {
				for (var mon in tempResults) {
					if (tempResults[mon].tier.toLowerCase() in tiers) results.add(tempResults[mon]);
				}
				tiers.count = 0;
				continue;
			}

			if (ability.count > 0) {
				for (var mon in tempResults) {
					for (var monAbility in tempResults[mon].abilities) {
						if (Tools.getAbility(tempResults[mon].abilities[monAbility]) in ability) results.add(tempResults[mon]);
					}
				}
				ability.count = 0;
				continue;
			}

			if (colours.count > 0) {
				for (var mon in tempResults) {
					if (tempResults[mon].color.toLowerCase() in colours) results.add(tempResults[mon]);
				}
				colours.count = 0;
				continue;
			}

			if (moves.count > 0) {
				var problem;
				var move = {};
				for (var mon in tempResults) {
					var template = Tools.getTemplate(tempResults[mon].id);
					if (!template.learnset) template = Tools.getTemplate(template.baseSpecies);
					if (!template.learnset) continue;
					for (var i in moves) {
						move = Tools.getMove(i);
						if (move.id !== 'count') {
							if (!move.exists) return this.sendReplyBox('"' + move + '" is not a known move.');
							if (!template.learnset.sketch && !template.learnset[move.id]) break;
						}
					}
					if (template.learnset[move.id] || template.learnset.sketch) results.add(tempResults[mon]);
				}
				moves.count = 0;
				continue;
			}

			if (gens.count > 0) {
				for (var mon in tempResults) {
					if (tempResults[mon].gen in gens) results.add(tempResults[mon]);
				}
				gens.count = 0;
				continue;
			}
		}

		var resultsStr = '';
		if (results && results.length > 0) {
			for (var i = 0; i < results.length; ++i) results[i] = results[i].species;
			if (showAll || results.length <= output) {
				resultsStr = results.join(', ');
			} else {
				var hidden = string(results.length - output);
				results.sort(function(a,b) {return Math.round(Math.random());});
				var shown = results.slice(0, 10);
				resultsStr = shown.join(', ');
				resultsStr += ', and ' + hidden + ' more. Redo the search with "all" as a search parameter to show all results.';
			}
		} else {
			resultsStr = 'No Pokémon found.';
		}
		return this.sendReplyBox(resultsStr);
	},

	learnset: 'learn',
	learnall: 'learn',
	learn5: 'learn',
	g6learn: 'learn',
	learn: function(target, room, user, connection, cmd) {
		if (!target) return this.parse('/help learn');

		if (!this.canBroadcast()) return;

		var lsetData = {set:{}};
		var targets = target.split(',');
		var template = Tools.getTemplate(targets[0]);
		var move = {};
		var problem;
		var all = (cmd === 'learnall');
		if (cmd === 'learn5') lsetData.set.level = 5;
		if (cmd === 'g6learn') lsetData.format = {noPokebank: true};

		if (!template.exists) {
			return this.sendReply('Pokemon "'+template.id+'" not found.');
		}

		if (targets.length < 2) {
			return this.sendReply('You must specify at least one move.');
		}

		for (var i=1, len=targets.length; i<len; i++) {
			move = Tools.getMove(targets[i]);
			if (!move.exists) {
				return this.sendReply('Move "'+move.id+'" not found.');
			}
			problem = TeamValidator.checkLearnsetSync(null, move, template, lsetData);
			if (problem) break;
		}
		var buffer = ''+template.name+(problem?" <span class=\"message-learn-cannotlearn\">can't</span> learn ":" <span class=\"message-learn-canlearn\">can</span> learn ")+(targets.length>2?"these moves":move.name);
		if (!problem) {
			var sourceNames = {E:"egg",S:"event",D:"dream world"};
			if (lsetData.sources || lsetData.sourcesBefore) buffer += " only when obtained from:<ul class=\"message-learn-list\">";
			if (lsetData.sources) {
				var sources = lsetData.sources.sort();
				var prevSource;
				var prevSourceType;
				for (var i=0, len=sources.length; i<len; i++) {
					var source = sources[i];
					if (source.substr(0,2) === prevSourceType) {
						if (prevSourceCount < 0) buffer += ": "+source.substr(2);
						else if (all || prevSourceCount < 3) buffer += ', '+source.substr(2);
						else if (prevSourceCount == 3) buffer += ', ...';
						prevSourceCount++;
						continue;
					}
					prevSourceType = source.substr(0,2);
					prevSourceCount = source.substr(2)?0:-1;
					buffer += "<li>gen "+source.substr(0,1)+" "+sourceNames[source.substr(1,1)];
					if (prevSourceType === '5E' && template.maleOnlyHidden) buffer += " (cannot have hidden ability)";
					if (source.substr(2)) buffer += ": "+source.substr(2);
				}
			}
			if (lsetData.sourcesBefore) buffer += "<li>any generation before "+(lsetData.sourcesBefore+1);
			buffer += "</ul>";
		}
		this.sendReplyBox(buffer);
	},

	weak: 'weakness',
	weakness: function(target, room, user){
		var targets = target.split(/[ ,\/]/);

		var pokemon = Tools.getTemplate(target);
		var type1 = Tools.getType(targets[0]);
		var type2 = Tools.getType(targets[1]);

		if (pokemon.exists) {
			target = pokemon.species;
		} else if (type1.exists && type2.exists) {
			pokemon = {types: [type1.id, type2.id]};
			target = type1.id + "/" + type2.id;
		} else if (type1.exists) {
			pokemon = {types: [type1.id]};
			target = type1.id;
		} else {
			return this.sendReplyBox(target + " isn't a recognized type or pokemon.");
		}

		var weaknesses = [];
		Object.keys(Tools.data.TypeChart).forEach(function (type) {
			var notImmune = Tools.getImmunity(type, pokemon);
			if (notImmune) {
				var typeMod = Tools.getEffectiveness(type, pokemon);
				if (typeMod == 1) weaknesses.push(type);
				if (typeMod == 2) weaknesses.push("<b>" + type + "</b>");
			}
		});

		if (!weaknesses.length) {
			this.sendReplyBox(target + " has no weaknesses.");
		} else {
			this.sendReplyBox(target + " is weak to: " + weaknesses.join(', ') + " (not counting abilities).");
		}
	},

	matchup: 'effectiveness',
	effectiveness: function(target, room, user) {
		var targets = target.split(/[,/]/);
		var type = Tools.getType(targets[1]);
		var pokemon = Tools.getTemplate(targets[0]);
		var defender;

		if (!pokemon.exists || !type.exists) {
			// try the other way around
			pokemon = Tools.getTemplate(targets[1]);
			type = Tools.getType(targets[0]);
		}
		defender = pokemon.species+' (not counting abilities)';

		if (!pokemon.exists || !type.exists) {
			// try two types
			if (Tools.getType(targets[0]).exists && Tools.getType(targets[1]).exists) {
				// two types
				type = Tools.getType(targets[0]);
				defender = Tools.getType(targets[1]).id;
				pokemon = {types: [defender]};
				if (Tools.getType(targets[2]).exists) {
					defender = Tools.getType(targets[1]).id + '/' + Tools.getType(targets[2]).id;
					pokemon = {types: [Tools.getType(targets[1]).id, Tools.getType(targets[2]).id]};
				}
			} else {
				if (!targets[1]) {
					return this.sendReply("Attacker and defender must be separated with a comma.");
				}
				return this.sendReply("'"+targets[0].trim()+"' and '"+targets[1].trim()+"' aren't a recognized combination.");
			}
		}

		if (!this.canBroadcast()) return;

		var typeMod = Tools.getEffectiveness(type.id, pokemon);
		var notImmune = Tools.getImmunity(type.id, pokemon);
		var factor = 0;
		if (notImmune) {
			factor = Math.pow(2, typeMod);
		}

		this.sendReplyBox(''+type.id+' attacks are '+factor+'x effective against '+defender+'.');
	},

	uptime: function(target, room, user) {
		if (!this.canBroadcast()) return;
		var uptime = process.uptime();
		var uptimeText;
		if (uptime > 24*60*60) {
			var uptimeDays = Math.floor(uptime/(24*60*60));
			uptimeText = ''+uptimeDays+' '+(uptimeDays == 1 ? 'day' : 'days');
			var uptimeHours = Math.floor(uptime/(60*60)) - uptimeDays*24;
			if (uptimeHours) uptimeText += ', '+uptimeHours+' '+(uptimeHours == 1 ? 'hour' : 'hours');
		} else {
			uptimeText = uptime.seconds().duration();
		}
		this.sendReplyBox('Uptime: <b>'+uptimeText+'</b>');
	},

	groups: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('+ <b>Voice</b> - League friends and respected users. They can use ! commands.<br />' +
		        '$ <b>Operator</b> - Loyal Gym Trainers in training. They can warn users.<br />'+
			'% <b>Driver</b> - Gym Leaders, expert in their respective types. They can mute users and check alts.<br />' +
			'@ <b>Moderator</b> - Frontier Brains, a twist in every game. They can ban users.<br />' +
			'&amp; <b>Leader</b> - Elite Four, the best of the best in the battlefield. They can force ties and promote users.<br />'+
			'~ <b>Administrator</b> - Supreme Rulers of this server. They can do anything.');
	},
	
	server: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('This is The Server of <b>The Sora League</b>. Hosted by <b>Champion Onyx</b><br />');
	},
	
	tourhelp: function(target, room, user) {
	    if (!this.canBroadcast()) return;
	    this.sendReplyBox('<b>Tournament Commands:</b><br />' +
	        'Only Voice (+) Users and Above can Start Tournaments. <br />'+
	        '- <b>/tour [tier],[size / X minutes]</b> - Starts a tournament or sets a timer.<br />' +
	        '- <b>/tourtime </b> - Adjusts the timer length.<br />' +
	        '- <b>/forcejoin</b> - Forces a user to join the tournament.<br />' +
	        '- <b>/forceleave </b> - Forces a user to leave the tournament.<br />' +
	        '- <b>/replace </b> - Replaces a participant pre-tournament.<br />' +
	        '- <b>!remind</b> - Reminds everyone of tournaments in their sign-up phase.<br />' +
	        '- <b>!vr</b> - Shows the current round.<br />' +
	        '- <b>/dq</b> - Disqualifies a participant.<br />' +
	        '- <b>/endtour</b> - Cancels a tournament.<br />');
        },

	battlefrontier: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<b>Sora Battle Frontier</b><br />'+
		 	'<i>"Welcome to the Sora Battle Frontier! Challenge us if you Dare."</i> <br />'+
		 	'<b>Requirements:</b> 8 Badges<br />'+
	 	    '<b>Rules:</b> The battle frontier may be challenged after collecting 8 gym badges and is needed to enter the Hall of Fame. You must beat 7 frontiers (Frontier Head needs to be the last Frontier battle and teams may be changed after each game to fit the next Battle Frontiers set of rules). You can not use Super Effective type pokemon against Mono-Type frontier brains. The same frontier may be challenged once every 24 hours.The Challenger must choose a partner Pokemon that must be present in all Frontier challenges.<br/>');
        },
	
	onyxe: function(target, room, user) {
	 	if (!this.canBroadcast()) return;
	 	this.sendReplyBox('Champion <b>OnyxE</b><br />'+
	 	    '<i>"Heads or Tails? Heads, I Win; Tails, you Lose"</i> <br />'+
	 	    '<b>Ace:</b> Tyranitar<br />'+
	 	    '<b>Battle Rules:</b> <br />'+
	 	    '-Pokebank OU Format<br />'+
	 	    '-No Weather except Sandstorm<br />'+
	 	    '-No Status<br />'+
	 	    '<img src="http://sprites.pokecheck.org/i/248.gif"> <img src="http://sprites.pokecheck.org/i/639.gif"> <img src="http://sprites.pokecheck.org/i/567.gif"> <img src="http://play.pokemonshowdown.com/sprites/bwani/tyrantrum.gif"> <img src="http://sprites.pokecheck.org/t/099.gif">');
        },
        
        noah: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Champion <b>Noah</b><br />'+
		      '<i>"Need a Champion? I Noah guy."</i> <br />'+
		      '<b>Ace:</b> Nidoqueen the Nidoking <br />'+
	 	      '<b>Battle Rules:</b> <br/>'+
	 	      '-Monotype <br/>'+
	 	      '-All Tiers must be Represented (Except Ubers and LC) <br/>'+
	 	      '-Tiershift<br />'+
	 	      '<img src="http://sprites.pokecheck.org/s/034.gif"> <img src="http://sprites.pokecheck.org/t/069.gif">');
	},
	
	bart: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Frontier Head <b>Bart</b><br />'+
		     '<i>"Patience? Nah.... Speed and power is what you need!"</i> <br />'+
		     '<b>Ace:</b> Weavile<br />'+
	 	     '<b>Battle Rules:</b> <br/>'+
	 	     '-Ubers Battle <br/>'+
	 	     '-At least 2 must be OU or lower <br/>'+
	 	     '-No Lowering opponents stats (if not caused by a damaging move is banned (Unless caused by Attack) <br/>'+
	 	     '-No Pokemon with a base stat over 130<br />'+
	 	     '<img src="http://sprites.pokecheck.org/i/461.gif"> <img src="http://sprites.pokecheck.org/t/148.gif">');
        },
	
	gary: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('E4 <b>Gary</b><br />'+
		      '<i>"The Mighty warrior of Sora."</i> <br />'+
		      '<b>Type:</b> Dragon<br />'+
		      '<b>Ace:</b> Goodra<br />'+
	 	      '<b>Battle Rules:</b> <br/>'+
	 	      '-No Focus Sash <br/>'+
	 	      '-No Hazards <br/>'+
	 	      '-No Status <br/>'+
	 	      '-OU Monotype <br />'+
	 	      '<img src="http://play.pokemonshowdown.com/sprites/bw/goodra.png"> <img src="http://sprites.pokecheck.org/t/137.gif">');
        },
	
	toast: function(target, room, user) {
			if (!this.canBroadcast()) return;
			this.sendReplyBox('E4 <b>Toast</b><br />'+
			  '<i>"A Day without SunShine is like Night Time."</i> <br />'+
			  '<b>Type:</b> Fire<br />'+
			  '<b>Ace:</b> Charizard<br />'+
	 	          '<b>Battle Rules:</b> <br/>'+
	 	          '-No Hazards <br/>'+
	 	          '-Only Sun Allowed <br/>'+
	 	          '-No Flinching Moves <br />'+
	 	          '-No Focus Sash <br />'+
	 	          '<img src="http://sprites.pokecheck.org/s/250.gif"> <img src="http://sprites.pokecheck.org/t/025.gif">');
        },
        
        iris: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Gym Ldr <b>Iris</b><br />'+
			  '<i>"I don\'t care if I am the weakest person in the world as long as i can protect my fairies."</i> <br />'+
			  '<b>Type:</b> Fairy<br />'+
			  '<b>Ace:</b> Azumarill<br />');
        },
	
	bighug: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('E4 <b>Big Hug</b><br />'+
		      '<i>"BIG HUG, the big bug, will give your team a BIG BUG HUG!"</i> <br />'+
		      '<b>Type:</b> Bug<br />'+
		      '<b>Ace:</b> Galvantula <br />'+
		      '<b>Note:</b> Hugs (not optional)<br />'+
		      '<b>Optional Rule:</b> All Pokemon must have hug based nicknames for the duration of the challenge<br />'+
	 	      '<b>Battle Rules:</b> <br/>'+
	 	      '-Max 1 Focus Sash <br/>'+
	 	      '-No Entry Hazards <br/>');
	},
	
	ninjarisu: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Overlord <b>Ninjarisu</b><br />'+
		    '<i>"Fear my pink sparkles of awesomeness!"</i> <br />'+
		    '<b>Ace:</b> All<br />'+
	 	    '<b>Who am I?:</b> You get to battle me after obtaining 10 badges!<br />'+
	 	    '<b>Note:</b> Nemesis of Guardian, him or me? Choose<br />'+
	 	    '<img src="http://sprites.pokecheck.org/s/417.gif"> <img src="http://sprites.pokecheck.org/t/138.gif">');
        },
        
        darkus: function(target, room, user) {
			if (!this.canBroadcast()) return;
			this.sendReplyBox('Guardian <b>Darkus</b><br />'+
			    '<i>"You Snooze, You Lose!"</i> <br />'+
			    '<b>Ace:</b> Klinklang<br />'+
		 	    '<b>Who am I?:</b> You get to battle me after obtaining 10 badges!<br />'+
		 	    '<b>Note:</b> Nemesis of Overlord, him or me? Choose<br />'+
		 	    '<img src="http://sprites.pokecheck.org/i/601.gif"> <img src="http://sprites.pokecheck.org/t/187.gif">');
        },
	
        vader: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Frontier <b>Vader</b><br />'+
	              '<i>"Laugh my friend, and the whole world laughs with you."</i> <br />'+
	              '<b>Ace:</b> Hitmonlee<br />'+
	 	      '<b>Battle Rules:</b> <br/>'+
	 	      '-UU Battle <br/>'+
	 	      '-No Healing/Status Healing Moves and Abilities <br/>'+
	 	      '-No Status (Unless Caused by Attack) <br/>'+
	 	      '<img src="http://sprites.pokecheck.org/s/006.gif"> <img src="http://sprites.pokecheck.org/t/040.gif">');
	},
	
	ascher: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Frontier <b>Ascher</b><br />'+
	       	      '<i>"Strategy is key."</i> <br />'+
		      '<b>Ace:</b> Clefable<br />'+
	 	      '<b>Battle Rules:</b> <br/>'+
	 	      '-Pokemon Chess - 1 OU, 2 UU, 1 RU, 1 NU, 1 Uber <br/>'+
	 	      '-Ubers is King (Loss if the King Faints) <br/>'+
	 	      '-No Mega-Evolutions <br/>'+
	 	      '<img src="http://play.pokemonshowdown.com/sprites/trainers/54.png"> <img src="http://sprites.pokecheck.org/i/003f.gif">');
	},
	
	bm: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Gym Ldr <b>B/m/</b><br />'+
			'<i>"The scalpel is art, the match fuels the flames."</i> <br />'+
			'<b>Type:</b> Fire<br />'+
			'<b>Ace:</b> Darmanitan<br />');
        },
        
        abadon: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Gym Ldr <b>Abadon</b><br />'+
			'<i>"The battle is only lost when one looses faith in there Pokemon."</i> <br />'+
			'<b>Type:</b> Bug<br />'+
			'<b>Ace:</b> Volcarona<br />');
        },
        
        floatzel: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Frontier <b>Floatzel</b><br />'+
	              '<i>"When it comes down to it, I am still the strongest!"</i> <br />'+
	              '<b>Ace:</b> Haxxi (Jirachi)<br />'+
	 	      '<b>Battle Rules:</b> <br/>'+
	 	      '-Pokemon Dominoes (OU Pokebank tier) <br/>'+
	 	      '-Every Pokemon\'s 2nd typing must match the next Pokemon\'s first typing <br/>'+
	 	      '-Last Pokemon must be Single-type <br/>'+
	 	      '-Must lead with the first pokemon in the chain and continued by the next one <br/>'+
	 	      '-No flying types (there are no flying primary types) <br/>'+
	 	      '-No switching (Moves that result switching) <br/>'+
	 	      '-No Sturdy (Focus sash) <br/>'+
	 	      '<img src="http://sprites.pokecheck.org/s/385.gif"> <img src="http://sprites.pokecheck.org/t/139.gif">');
        },
        
	leaf: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Frontier <b>Leaf</b><br />'+
		          '<i>"Adaptability isn’t just Eevee’s ability it’s a way to use your true strength. In any situation learn it and you can conquer any foe."</i> <br />'+
			  '<b>Ace:</b> Cincinno<br />'+
		 	  '<b>Battle Rules:</b> <br/>'+
		 	  '-Pokebank OU Battle <br/>'+
		 	  '-No OU <br/>'+
		 	  '-Max 1 Limbo<br/>'+
		 	  '-No Mega-Evolutions<br />'+
		 	  '-1 UU,1 NU and 1 RU pokemon are required in a team <br/>'+
		 	  '<img src="http://sprites.pokecheck.org/s/573.gif"> <img src="http://sprites.pokecheck.org/t/100.gif">');
	},
	
	ryu: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Frontier <b>Ryu</b><br />'+
		          '<i>"Skill is more important than brute strength."</i> <br />'+
			  '<b>Ace:</b> Kangaskhan<br />'+
		 	  '<b>Battle Rules:</b> <br/>'+
		 	  '-OU Battle <br/>'+
		 	  '-No Item Repetition <br/>'+
		 	  '-1 Starter Pokemon must be used<br/>'+
		 	  '-No healing moves or items <br/>'+
		 	  '-Max 1 potential mega Pokemon <br/>'+
		 	  '-1 Not Fully evolved Pokemon must be used<br/>');
	},
        
        akash: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Frontier <b>Akash</b><br />'+
			  '<i>"Fly high or die."</i> <br />'+
			  '<b>Ace:</b> Arceus<br />'+
			  '<b>Battle Rules:</b> <br/>'+
		 	  '-Sky Battle (Only Flying or levitating Pokemon may be used) <br/>'+
		 	  '-Ubers Format (Max 1 Uber) <br/>'+
		 	  '-No +1 Priority moves <br/>'+
		 	  '-No Item Repetition <br/>'+
		 	  '-No Stealth Rocks <br/>');
	},
	
        ericaj: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Gym Ldr <b>EricaJ</b><br />'+
			  '<i>"Simplicity is the ultimate sophistication."</i> <br />'+
			  '<b>Type:</b> Normal<br />'+
			  '<b>Ace:</b> Porygon 2<br />');
        },
        
        daredevil: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Gym Ldr <b>Daredevil</b><br />'+
			  '<i>"Baby I\'ll rock your world."</i> <br />'+
			  '<b>Type:</b> Rock<br />'+
			  '<b>Ace:</b> Terrakion<br />');
        },
        
        vanilla: function(target, room, user) {
		if (!this.canBroadcast()) return;
	        this.sendReplyBox('E4 <b>Vanilla</b><br />'+
			  '<i>"I\'ll land the slam dunk to your heart! Nyaa~!"</i> <br />'+
			  '<b>Type:</b> Normal<br />'+
			  '<b>Ace:</b> Miltank (Dragonslayer)<br />'+
			  '<b>Battle Rules:</b><br />'+
			  '-No Focus Sash<br />'+
			  '-No Choice Scarf<br />'+
			  '-No force switching moves or items<br />'+
			  '-No protecting moves<br />'+
			  '<img src="http://sprites.pokecheck.org/i/241.gif"> <img src="http://sprites.pokecheck.org/t/111.gif">');
        },
        
        manifest: function(target, room, user) {
		    if (!this.canBroadcast()) return;
			this.sendReplyBox('Gym Ldr <b>Manifest</b><br />'+
			  '<i>"When you think you can\'t fall any further, I\'ll be there."</i> <br />'+
			  '<b>Type:</b> Dark<br />'+
			  '<b>Ace:</b> All<br />');
        },
        
        srewop: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Gym Ldr <b>Srewop</b><br />'+
			 '<i>"My name backwards is what I\'m all about"</i> <br />'+
			 '<b>Type:</b> Poison<br />'+
			 '<b>Ace:</b> Venusaur<br />');
	},
        
        matt99: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Gym Ldr <b>Matt99</b><br />'+
		      '<i>"Face the power of the dragons if you dare."</i> <br />'+
		      '<b>Type:</b> Dragon<br />'+
		      '<b>Ace:</b> Latios<br />');
        },
        
        lynne: function(target, room, user) {
		if (!this.canBroadcast()) return;
	        this.sendReplyBox('Frontier <b>Lynne</b><br />'+
			  '<i>"A wise warrior copies successful combat tactics to prevail in battle."</i> <br />'+
			  '<b>Ace:</b> Chansey<br />'+
			  '<b>Battle Rules:</b> <br />'+
			  '-Standard Ubers<br />');
        },
        
        spelings: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Gym Ldr <b>Spelings</b><br />'+
		         '<i>"May the Lady Hax watch over you."</i> <br />'+
	              	 '<b>Type:</b> Flying<br />'+
			 '<b>Ace:</b> Salamence<br />'+
			 '<img src="http://sprites.pokecheck.org/i/373.gif"> <img src="http://sprites.pokecheck.org/t/117.gif">');
        },
        
        leaf: function(target, room, user) {
	        if (!this.canBroadcast()) return;
		this.sendReplyBox('Gym Ldr <b>Leaf</b><br />'+
			  '<i>"The barren earth is from whence you came and where I shal return you."</i> <br />'+
			  '<b>Type:</b> Ground<br />'+
			  '<b>Ace:</b> Mamoswine (Extinction)<br />');
	},
	
	night: function(target, room, user) {
			if (!this.canBroadcast()) return;
			this.sendReplyBox('Frontier <b>Night</b><br />'+
			  '<i>"Slow and steady wins the race."</i> <br />'+
			  '<b>Ace:</b> Escavalier<br />'+
			  '<b>Battle Rules:</b> <br/>'+
		 	  '-Only Pokemon with speed below 40 may be used <br/>'+
		 	  '-No Hazards <br/>'+
		 	  '-No Speed-boosting moves/abilities<br />'+
			  '<img src="http://sprites.pokecheck.org/i/123.gif">');
	},
	
	lance: function(target, room, user) {
	        if (!this.canBroadcast()) return;
		this.sendReplyBox('Gym Ldr <b>Lance</b><br />'+
			  '<i>"I need a paralyze heal, \'Cause you\'re 2shocking4me."</i> <br />'+
			  '<b>Type:</b> Electric<br />'+
			  '<b>Ace:</b> Eelektross<br />'+
			  '<img src="http://sprites.pokecheck.org/t/136.gif">');
			  
	},
	
	mayhem: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Gym Ldr <b>Mayhem</b><br />'+
			 '<i>"When the shadow strikes there is nowhere to hide."</i> <br />'+
		         '<b>Type:</b> Ghost<br />'+
			 '<b>Ace:</b> Aegislash<br />');
        },
	
	tempest: function(target, room, user) {
	        if (!this.canBroadcast()) return;
		this.sendReplyBox('Gym Ldr <b>Tempest</b><br />'+
			  '<i>"Behold, the power of nature; serene, vast, and infinite."</i> <br />'+
			  '<b>Type:</b> Grass<br />'+
			  '<b>Ace:</b> Whimsicott<br />'+
			  '<img src="http://sprites.pokecheck.org/t/144.gif">');
	},
	
	glh: function(target, room, user) {
			if (!this.canBroadcast()) return;
			this.sendReplyBox('Gym Ldr <b>H</b><br />'+
			  '<i>"Only the hardiest of warriors withstand my powerful currents."</i> <br />'+
			  '<b>Type:</b> Water<br />'+
			  '<b>Ace:</b> -<br />');
	},
	
	bean877: function(target, room, user) {
	        if (!this.canBroadcast()) return;
		this.sendReplyBox('Gym Ldr <b>Bean877</b><br />'+
			  '<i>"Control the mind of the beast to control it\'s strength."</i> <br />'+
			  '<b>Type:</b> Psychic<br />'+
			  '<b>Ace:</b> Victini<br />');
	},
	
	lapry: function(target, room, user) {
	        if (!this.canBroadcast()) return;
		this.sendReplyBox('Gym Ldr <b>Lapry</b><br />'+
			  '<i>"Start off with an icy lead, then you will always succeed ~"</i> <br />'+
			  '<b>Type:</b> Ice<br />'+
			  '<b>Ace:</b> Sneasel<br />');
	},
	
	killer: function(target, room, user) {
	        if (!this.canBroadcast()) return;
		this.sendReplyBox('Gym Ldr <b>Killer</b><br />'+
			  '<i>"Come forth, o challenger, for after our blades and wits clash in a metal maelstrom, only one man will stand, and stand victorious he shall!"</i> <br />'+
			  '<b>Type:</b> Steel<br />'+
			  '<b>Ace:</b> Genesect<br />');
	},
	
	jeratt: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Artiste <b>Jeratt</b><br />'+
			'<i>"Still dragon you away~"</i> <br />'+
			'<b>Skilled in:</b> Dragon & Ice<br />'+
		 	'<b>Note:</b> Close the Lobby and see what I can really do. <br/>'+
		 	'<b>History:</b> Greatest Ice E4, <strike>undefeated</strike> Dragon E4. <br/>'+
		 	'<img src="http://sprites.pokecheck.org/i/235.gif"> <img src="http://sprites.pokecheck.org/t/033.gif"> <img src="http://sprites.pokecheck.org/s/473.gif"> <img src="http://sprites.pokecheck.org/i/378.gif"> <img src="http://sprites.pokecheck.org/i/483.gif">');
        },
	
	getbucks: 'getbucks',
		getbucks: function(target, room, user) {
			if (!this.canBroadcast()) return;
			this.sendReplyBox('Please check out the Shop page in the link below to see methods of earning money:<br />' +
				'- <a href="http://soraleague.weebly.com/shop.html">Shop</a><br />' +
				'</div>');
	},
	
	site: 'site',
		site: function(target, room, user) {
			if (!this.canBroadcast()) return;
			this.sendReplyBox('Here is The Sora League Website:<br />' +
				'- <a href="http://soraleague.weebly.com/index.html">Sora League Site</a><br />' +
				'</div>');
	},
	
	incweather: 'incweather',
		incweather: function(target, room, user) {
			if (!this.canBroadcast()) return;
			this.sendReplyBox('Here is a detailed explanation of the format Inclement Weather:<br />' +
				'- <a href="http://soraleague.weebly.com/inclement-weather.html">Inclement Weather</a><br />' +
				'</div>');
	},
	
	events: 'events',
		events: function(target, room, user) {
			if (!this.canBroadcast()) return;
			this.sendReplyBox('Here is a list of events held in The Sora League:<br />' +
				'- <a href="http://soraleague.weebly.com/events.html">Sora League Events</a><br />' +
				'</div>');
	},
	
	gymtrainers: 'gym trainers',
		gymtrainers: function(target, room, user) {
			if (!this.canBroadcast()) return;
			this.sendReplyBox('Here is a list of Sora League Gym Trainers:<br />' +
				'- <a href="http://soraleague.weebly.com/gym-trainers.html">Sora League Gym Trainers</a><br />' +
				'</div>');
	},

        gymleaders: 'gym leaders',
		gymleaders: function(target, room, user) {
			if (!this.canBroadcast()) return;
			this.sendReplyBox('Here is a list of Sora League Gym Leaders:<br />' +
				'- <a href="http://soraleague.weebly.com/gym-leaders.html">Sora League Gym Leaders</a><br />' +
				'</div>');
	},

	elitefour: 'e4',
		elitefour: function(target, room, user) {
				if (!this.canBroadcast()) return;
				this.sendReplyBox('Here is a list of Sora League Elite Four:<br />' +
					'- <a href="http://soraleague.weebly.com/elite-four.html">Sora League Elite Four</a><br />' +
					'</div>');
	},

	champions: 'champions',
			champions: function(target, room, user) {
					if (!this.canBroadcast()) return;
					this.sendReplyBox('Here is a list of Sora League Champions:<br />' +
						'- <a href="http://soraleague.weebly.com/champions.html">Sora League Champions</a><br />' +
						'</div>');
	},

	frontiers: 'frontiers',
			frontiers: function(target, room, user) {
					if (!this.canBroadcast()) return;
					this.sendReplyBox('Here is a list of Sora League Frontier Brains:<br />' +
						'- <a href="http://soraleague.weebly.com/frontier.html">Sora League Frontier Brains</a><br />' +
						'</div>');
	},

	sidemissions: 'sidemissions',
			sidemissions: function(target, room, user) {
					if (!this.canBroadcast()) return;
					this.sendReplyBox('Here is a list of Sora League Side Missions:<br />' +
						'- <a href="http://soraleague.weebly.com/side-missions.html">Sora League Side Missions</a><br />' +
						'</div>');
	},

        opensource: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Pokemon Showdown is open source:<br />- Language: JavaScript<br />- <a href="https://github.com/Zarel/Pokemon-Showdown/commits/master">What\'s new?</a><br />- <a href="https://github.com/Zarel/Pokemon-Showdown">Server source code</a><br />- <a href="https://github.com/Zarel/Pokemon-Showdown-Client">Client source code</a>');
	},

	avatars: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Your avatar can be changed using the Options menu (it looks like a gear) in the upper right of Pokemon Showdown.');
	},

	introduction: 'intro',
	intro: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('New to competitive pokemon?<br />' +
			'- <a href="http://www.smogon.com/forums/threads/3496279/">Beginner\'s Guide to Pokémon Showdown</a><br />' +
			'- <a href="http://www.smogon.com/dp/articles/intro_comp_pokemon">An introduction to competitive Pokémon</a><br />' +
			'- <a href="http://www.smogon.com/bw/articles/bw_tiers">What do "OU", "UU", etc mean?</a><br />' +
			'- <a href="http://www.smogon.com/bw/banlist/">What are the rules for each format? What is "Sleep Clause"?</a>');
	},

	smogonintro: 'smogintro',
	smogintro: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Welcome to Smogon\'s Official Pokémon Showdown server!<br /><br />' + 
			'Here are some useful links to Smogon\'s Mentorship Program to help you get integrated into the community:<br />' +
			'- <a href="http://www.smogon.com/mentorship/primer">Smogon Primer: A brief introduction to Smogon\'s subcommunities</a><br />' +
			'- <a href="http://www.smogon.com/mentorship/introductions">Introduce yourself to Smogon!</a><br />' +
			'- <a href="http://www.smogon.com/mentorship/profiles">Profiles of current Smogon Mentors</a><br />' +
			'- <a href="http://mibbit.com/#mentor@irc.synirc.net">#mentor: the Smogon Mentorship IRC channel</a><br />' +
			'All of these links and more can be found at the <a href="http://www.smogon.com/mentorship/">Smogon Mentorship Program\'s hub</a>.');
	},

	calculator: 'calc',
	calc: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Pokemon Showdown! damage calculator. (Courtesy of Honko)<br />' +
			'- <a href="http://pokemonshowdown.com/damagecalc/">Damage Calculator</a>');
	},

	cap: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('An introduction to the Create-A-Pokemon project:<br />' +
			'- <a href="http://www.smogon.com/cap/">CAP project website and description</a><br />' +
			'- <a href="http://www.smogon.com/forums/showthread.php?t=48782">What Pokemon have been made?</a><br />' +
			'- <a href="http://www.smogon.com/forums/showthread.php?t=3464513">Talk about the metagame here</a><br />' +
			'- <a href="http://www.smogon.com/forums/showthread.php?t=3466826">Practice BW CAP teams</a>');
	},

	gennext: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('NEXT (also called Gen-NEXT) is a mod that makes changes to the game:<br />' +
			'- <a href="https://github.com/Zarel/Pokemon-Showdown/blob/master/mods/gennext/README.md">README: overview of NEXT</a><br />' +
			'Example replays:<br />' +
			'- <a href="http://pokemonshowdown.com/replay/gennextou-37815908">roseyraid vs Zarel</a><br />' +
			'- <a href="http://pokemonshowdown.com/replay/gennextou-37900768">QwietQwilfish vs pickdenis</a>');
	},

	om: 'othermetas',
	othermetas: function(target, room, user) {
		if (!this.canBroadcast()) return;
		target = toId(target);
		var buffer = '';
		var matched = false;
		if (!target || target === 'all') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/forums/forums/206/">Information on the Other Metagames</a><br />';
		}
		if (target === 'all' || target === 'hackmons') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/forums/threads/3475624/">Hackmons</a><br />';
		}
		if (target === 'all' || target === 'balancedhackmons' || target === 'bh') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/forums/threads/3463764/">Balanced Hackmons</a><br />';
		}
		if (target === 'all' || target === 'glitchmons') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/forums/threads/3467120/">Glitchmons</a><br />';
		}
		if (target === 'all' || target === 'tiershift' || target === 'ts') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/forums/threads/3479358/">Tier Shift</a><br />';
		}
		if (target === 'all' || target === 'seasonal') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/sim/seasonal">Seasonal Ladder</a><br />';
		}
		if (target === 'all' || target === 'stabmons') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/forums/threads/3484106/">STABmons</a>';
		}
		if (target === 'all' || target === 'omotm' || target === 'omofthemonth' || target === 'month') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/forums/threads/3481155/">OM of the Month</a>';
		}
		if (!matched) {
			return this.sendReply('The Other Metas entry "'+target+'" was not found. Try /othermetas or /om for general help.');
		}
		this.sendReplyBox(buffer);
	},

	roomhelp: function(target, room, user) {
		if (room.id === 'lobby') return this.sendReply('This command is too spammy for lobby.');
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Room drivers (%) can use:<br />' +
			'- /warn OR /k <em>username</em>: warn a user and show the Pokemon Showdown rules<br />' +
			'- /mute OR /m <em>username</em>: 7 minute mute<br />' +
			'- /hourmute OR /hm <em>username</em>: 60 minute mute<br />' +
			'- /unmute <em>username</em>: unmute<br />' +
			'- /announce OR /wall <em>message</em>: make an announcement<br />' +
			'<br />' +
			'Room moderators (@) can also use:<br />' +
			'- /roomban OR /rb <em>username</em>: bans user from the room<br />' +
			'- /roomunban <em>username</em>: unbans user from the room<br />' +
			'- /roomvoice <em>username</em>: appoint a room voice<br />' +
			'- /roomdevoice <em>username</em>: remove a room voice<br />' +
			'- /modchat <em>[off/autoconfirmed/+]</em>: set modchat level<br />' +
			'<br />' +
			'Room owners (#) can also use:<br />' +
			'- /roomdesc <em>description</em>: set the room description on the room join page<br />' +
			'- /roommod, /roomdriver <em>username</em>: appoint a room moderator/driver<br />' +
			'- /roomdemod, /roomdedriver <em>username</em>: remove a room moderator/driver<br />' +
			'- /modchat <em>[%/@/#]</em>: set modchat level<br />' +
			'- /declare <em>message</em>: make a global declaration<br />' +
			'</div>');
	},

	restarthelp: function(target, room, user) {
		if (room.id === 'lobby' && !this.can('lockdown')) return false;
		if (!this.canBroadcast()) return;
		this.sendReplyBox('The server is restarting. Things to know:<br />' +
			'- We wait a few minutes before restarting so people can finish up their battles<br />' +
			'- The restart itself will take around 0.6 seconds<br />' +
			'- Your ladder ranking and teams will not change<br />' +
			'- We are restarting to update Pokémon Showdown to a newer version' +
			'</div>');
	},

	rule: 'rules',
	rules: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Please follow the rules:<br />' +
			'- <a href="http://soraleague.weebly.com/rules.html">Sora League Rules</a><br />' +
			'</div>');
	},

	faq: function(target, room, user) {
		if (!this.canBroadcast()) return;
		target = target.toLowerCase();
		var buffer = '';
		var matched = false;
		if (!target || target === 'all') {
			matched = true;
			buffer += '<a href="http://www.smogon.com/sim/faq">Frequently Asked Questions</a><br />';
		}
		if (target === 'all' || target === 'deviation') {
			matched = true;
			buffer += '<a href="http://www.smogon.com/sim/faq#deviation">Why did this user gain or lose so many points?</a><br />';
		}
		if (target === 'all' || target === 'doubles' || target === 'triples' || target === 'rotation') {
			matched = true;
			buffer += '<a href="http://www.smogon.com/sim/faq#doubles">Can I play doubles/triples/rotation battles here?</a><br />';
		}
		if (target === 'all' || target === 'randomcap') {
			matched = true;
			buffer += '<a href="http://www.smogon.com/sim/faq#randomcap">What is this fakemon and what is it doing in my random battle?</a><br />';
		}
		if (target === 'all' || target === 'restarts') {
			matched = true;
			buffer += '<a href="http://www.smogon.com/sim/faq#restarts">Why is the server restarting?</a><br />';
		}
		if (target === 'all' || target === 'staff') {
			matched = true;
			buffer += '<a href="http://www.smogon.com/sim/staff_faq">Staff FAQ</a><br />';
		}
		if (target === 'all' || target === 'autoconfirmed') {
			matched = true;
			buffer += 'A user is autoconfirmed when they have won at least one rated battle and has been registered for a week or longer.<br />';
		}
		if (!matched) {
			return this.sendReply('The FAQ entry "'+target+'" was not found. Try /faq for general help.');
		}
		this.sendReplyBox(buffer);
	},

	banlists: 'tiers',
	tier: 'tiers',
	tiers: function(target, room, user) {
		if (!this.canBroadcast()) return;
		target = toId(target);
		var buffer = '';
		var matched = false;
		if (!target || target === 'all') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/tiers/">Smogon Tiers</a><br />';
			buffer += '- <a href="http://www.smogon.com/bw/banlist/">The banlists for each tier</a><br />';
		}
		if (target === 'all' || target === 'ubers' || target === 'uber') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/bw/tiers/uber">Uber Pokemon</a><br />';
		}
		if (target === 'all' || target === 'overused' || target === 'ou') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/bw/tiers/ou">Overused Pokemon</a><br />';
		}
		if (target === 'all' || target === 'underused' || target === 'uu') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/bw/tiers/uu">Underused Pokemon</a><br />';
		}
		if (target === 'all' || target === 'rarelyused' || target === 'ru') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/bw/tiers/ru">Rarelyused Pokemon</a><br />';
		}
		if (target === 'all' || target === 'neverused' || target === 'nu') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/bw/tiers/nu">Neverused Pokemon</a><br />';
		}
		if (target === 'all' || target === 'littlecup' || target === 'lc') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/bw/tiers/lc">Little Cup Pokemon</a><br />';
		}
		if (target === 'all' || target === 'doubles') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/bw/metagames/doubles">Doubles</a><br />';
		}
		if (!matched) {
			return this.sendReply('The Tiers entry "'+target+'" was not found. Try /tiers for general help.');
		}
		this.sendReplyBox(buffer);
	},

	analysis: 'smogdex',
	strategy: 'smogdex',
	smogdex: function(target, room, user) {
		if (!this.canBroadcast()) return;

		var targets = target.split(',');
		if (toId(targets[0]) === 'previews') return this.sendReplyBox('<a href="http://www.smogon.com/forums/threads/sixth-generation-pokemon-analyses-index.3494918/">Generation 6 Analyses Index</a>, brought to you by <a href="http://www.smogon.com">Smogon University</a>');
		var pokemon = Tools.getTemplate(targets[0]);
		var item = Tools.getItem(targets[0]);
		var move = Tools.getMove(targets[0]);
		var ability = Tools.getAbility(targets[0]);
		var atLeastOne = false;
		var generation = (targets[1] || "bw").trim().toLowerCase();
		var genNumber = 5;
		var doublesFormats = {'vgc2012':1,'vgc2013':1,'doubles':1};
		var doublesFormat = (!targets[2] && generation in doublesFormats)? generation : (targets[2] || '').trim().toLowerCase();
		var doublesText = '';
		if (generation === "bw" || generation === "bw2" || generation === "5" || generation === "five") {
			generation = "bw";
		} else if (generation === "dp" || generation === "dpp" || generation === "4" || generation === "four") {
			generation = "dp";
			genNumber = 4;
		} else if (generation === "adv" || generation === "rse" || generation === "rs" || generation === "3" || generation === "three") {
			generation = "rs";
			genNumber = 3;
		} else if (generation === "gsc" || generation === "gs" || generation === "2" || generation === "two") {
			generation = "gs";
			genNumber = 2;
		} else if(generation === "rby" || generation === "rb" || generation === "1" || generation === "one") {
			generation = "rb";
			genNumber = 1;
		} else {
			generation = "bw";
		}
		if (doublesFormat !== '') {
			// Smogon only has doubles formats analysis from gen 5 onwards.
			if (!(generation in {'bw':1,'xy':1}) || !(doublesFormat in doublesFormats)) {
				doublesFormat = '';
			} else {
				doublesText = {'vgc2012':'VGC 2012 ','vgc2013':'VGC 2013 ','doubles':'Doubles '}[doublesFormat];
				doublesFormat = '/' + doublesFormat;
			}
		}

		// Pokemon
		if (pokemon.exists) {
			atLeastOne = true;
			if (genNumber < pokemon.gen) {
				return this.sendReplyBox(pokemon.name+' did not exist in '+generation.toUpperCase()+'!');
			}
			if (pokemon.tier === 'G4CAP' || pokemon.tier === 'G5CAP') {
				generation = "cap";
			}

			var poke = pokemon.name.toLowerCase();
			if (poke === 'nidoranm') poke = 'nidoran-m';
			if (poke === 'nidoranf') poke = 'nidoran-f';
			if (poke === 'farfetch\'d') poke = 'farfetchd';
			if (poke === 'mr. mime') poke = 'mr_mime';
			if (poke === 'mime jr.') poke = 'mime_jr';
			if (poke === 'deoxys-attack' || poke === 'deoxys-defense' || poke === 'deoxys-speed' || poke === 'kyurem-black' || poke === 'kyurem-white') poke = poke.substr(0,8);
			if (poke === 'wormadam-trash') poke = 'wormadam-s';
			if (poke === 'wormadam-sandy') poke = 'wormadam-g';
			if (poke === 'rotom-wash' || poke === 'rotom-frost' || poke === 'rotom-heat') poke = poke.substr(0,7);
			if (poke === 'rotom-mow') poke = 'rotom-c';
			if (poke === 'rotom-fan') poke = 'rotom-s';
			if (poke === 'giratina-origin' || poke === 'tornadus-therian' || poke === 'landorus-therian') poke = poke.substr(0,10);
			if (poke === 'shaymin-sky') poke = 'shaymin-s';
			if (poke === 'arceus') poke = 'arceus-normal';
			if (poke === 'thundurus-therian') poke = 'thundurus-t';

			this.sendReplyBox('<a href="http://www.smogon.com/'+generation+'/pokemon/'+poke+doublesFormat+'">'+generation.toUpperCase()+' '+doublesText+pokemon.name+' analysis</a>, brought to you by <a href="http://www.smogon.com">Smogon University</a>');
		}

		// Item
		if (item.exists && genNumber > 1 && item.gen <= genNumber) {
			atLeastOne = true;
			var itemName = item.name.toLowerCase().replace(' ', '_');
			this.sendReplyBox('<a href="http://www.smogon.com/'+generation+'/items/'+itemName+'">'+generation.toUpperCase()+' '+item.name+' item analysis</a>, brought to you by <a href="http://www.smogon.com">Smogon University</a>');
		}

		// Ability
		if (ability.exists && genNumber > 2 && ability.gen <= genNumber) {
			atLeastOne = true;
			var abilityName = ability.name.toLowerCase().replace(' ', '_');
			this.sendReplyBox('<a href="http://www.smogon.com/'+generation+'/abilities/'+abilityName+'">'+generation.toUpperCase()+' '+ability.name+' ability analysis</a>, brought to you by <a href="http://www.smogon.com">Smogon University</a>');
		}

		// Move
		if (move.exists && move.gen <= genNumber) {
			atLeastOne = true;
			var moveName = move.name.toLowerCase().replace(' ', '_');
			this.sendReplyBox('<a href="http://www.smogon.com/'+generation+'/moves/'+moveName+'">'+generation.toUpperCase()+' '+move.name+' move analysis</a>, brought to you by <a href="http://www.smogon.com">Smogon University</a>');
		}

		if (!atLeastOne) {
			return this.sendReplyBox('Pokemon, item, move, or ability not found for generation ' + generation.toUpperCase() + '.');
		}
	},

	/*********************************************************
	 * Miscellaneous commands
	 *********************************************************/

	birkal: function(target, room, user) {
		this.sendReply("It's not funny anymore.");
	},

	potd: function(target, room, user) {
		if (!this.can('potd')) return false;

		config.potd = target;
		Simulator.SimulatorProcess.eval('config.potd = \''+toId(target)+'\'');
		if (target) {
			if (Rooms.lobby) Rooms.lobby.addRaw('<div class="broadcast-blue"><b>The Pokemon of the Day is now '+target+'!</b><br />This Pokemon will be guaranteed to show up in random battles.</div>');
			this.logModCommand('The Pokemon of the Day was changed to '+target+' by '+user.name+'.');
		} else {
			if (Rooms.lobby) Rooms.lobby.addRaw('<div class="broadcast-blue"><b>The Pokemon of the Day was removed!</b><br />No pokemon will be guaranteed in random battles.</div>');
			this.logModCommand('The Pokemon of the Day was removed by '+user.name+'.');
		}
	},

	roll: 'dice',
	dice: function(target, room, user) {
		if (!this.canBroadcast()) return;
		var d = target.indexOf("d");
		if (d != -1) {
			var num = parseInt(target.substring(0,d));
			faces = NaN;
			if (target.length > d) var faces = parseInt(target.substring(d + 1));
			if (isNaN(num)) num = 1;
			if (isNaN(faces)) return this.sendReply("The number of faces must be a valid integer.");
			if (faces < 1 || faces > 1000) return this.sendReply("The number of faces must be between 1 and 1000");
			if (num < 1 || num > 20) return this.sendReply("The number of dice must be between 1 and 20");
			var rolls = new Array();
			var total = 0;
			for (var i=0; i < num; i++) {
				rolls[i] = (Math.floor(faces * Math.random()) + 1);
				total += rolls[i];
			}
			return this.sendReplyBox('Random number ' + num + 'x(1 - ' + faces + '): ' + rolls.join(', ') + '<br />Total: ' + total);
		}
		if (target && isNaN(target) || target.length > 21) return this.sendReply('The max roll must be a number under 21 digits.');
		var maxRoll = (target)? target : 6;
		var rand = Math.floor(maxRoll * Math.random()) + 1;
		return this.sendReplyBox('Random number (1 - ' + maxRoll + '): ' + rand);
	},

	register: function() {
		if (!this.canBroadcast()) return;
		this.sendReply("You must win a rated battle to register.");
	},

	br: 'banredirect',
	banredirect: function(){
		this.sendReply('/banredirect - This command is obsolete and has been removed.');
	},

	lobbychat: function(target, room, user, connection) {
		if (!Rooms.lobby) return this.popupReply("This server doesn't have a lobby.");
		target = toId(target);
		if (target === 'off') {
			user.leaveRoom(Rooms.lobby, connection.socket);
			connection.send('|users|');
			this.sendReply('You are now blocking lobby chat.');
		} else {
			user.joinRoom(Rooms.lobby, connection);
			this.sendReply('You are now receiving lobby chat.');
		}
	},

	a: function(target, room, user) {
		if (!this.can('battlemessage')) return false;
		// secret sysop command
		room.add(target);
	},

	/*********************************************************
	 * Help commands
	 *********************************************************/

	commands: 'help',
	h: 'help',
	'?': 'help',
	help: function(target, room, user) {
		target = target.toLowerCase();
		var matched = false;
		if (target === 'all' || target === 'msg' || target === 'pm' || target === 'whisper' || target === 'w') {
			matched = true;
			this.sendReply('/msg OR /whisper OR /w [username], [message] - Send a private message.');
		}
		if (target === 'all' || target === 'r' || target === 'reply') {
			matched = true;
			this.sendReply('/reply OR /r [message] - Send a private message to the last person you received a message from, or sent a message to.');
		}
		if (target === 'all' || target === 'getip' || target === 'ip') {
			matched = true;
			this.sendReply('/ip - Get your own IP address.');
			this.sendReply('/ip [username] - Get a user\'s IP address. Requires: @ & ~');
		}
		if (target === 'all' || target === 'rating' || target === 'ranking' || target === 'rank' || target === 'ladder') {
			matched = true;
			this.sendReply('/rating - Get your own rating.');
			this.sendReply('/rating [username] - Get user\'s rating.');
		}
		if (target === 'all' || target === 'nick') {
			matched = true;
			this.sendReply('/nick [new username] - Change your username.');
		}
		if (target === 'all' || target === 'avatar') {
			matched = true;
			this.sendReply('/avatar [new avatar number] - Change your trainer sprite.');
		}
		if (target === 'all' || target === 'rooms') {
			matched = true;
			this.sendReply('/rooms [username] - Show what rooms a user is in.');
		}
		if (target === 'all' || target === 'whois') {
			matched = true;
			this.sendReply('/whois [username] - Get details on a username: group, and rooms.');
		}
		if (target === 'all' || target === 'data') {
			matched = true;
			this.sendReply('/data [pokemon/item/move/ability] - Get details on this pokemon/item/move/ability.');
			this.sendReply('!data [pokemon/item/move/ability] - Show everyone these details. Requires: + % @ & ~');
		}
		if (target === "all" || target === 'analysis') {
			matched = true;
			this.sendReply('/analysis [pokemon], [generation] - Links to the Smogon University analysis for this Pokemon in the given generation.');
			this.sendReply('!analysis [pokemon], [generation] - Shows everyone this link. Requires: + % @ & ~');
		}
		if (target === 'all' || target === 'groups') {
			matched = true;
			this.sendReply('/groups - Explains what the + % @ & next to people\'s names mean.');
			this.sendReply('!groups - Show everyone that information. Requires: + % @ & ~');
		}
		if (target === 'all' || target === 'opensource') {
			matched = true;
			this.sendReply('/opensource - Links to PS\'s source code repository.');
			this.sendReply('!opensource - Show everyone that information. Requires: + % @ & ~');
		}
		if (target === 'all' || target === 'avatars') {
			matched = true;
			this.sendReply('/avatars - Explains how to change avatars.');
			this.sendReply('!avatars - Show everyone that information. Requires: + % @ & ~');
		}
		if (target === 'all' || target === 'intro') {
			matched = true;
			this.sendReply('/intro - Provides an introduction to competitive pokemon.');
			this.sendReply('!intro - Show everyone that information. Requires: + % @ & ~');
		}
		if (target === 'all' || target === 'cap') {
			matched = true;
			this.sendReply('/cap - Provides an introduction to the Create-A-Pokemon project.');
			this.sendReply('!cap - Show everyone that information. Requires: + % @ & ~');
		}
		if (target === 'all' || target === 'om') {
			matched = true;
			this.sendReply('/om - Provides links to information on the Other Metagames.');
			this.sendReply('!om - Show everyone that information. Requires: + % @ & ~');
		}
		if (target === 'all' || target === 'learn' || target === 'learnset' || target === 'learnall') {
			matched = true;
			this.sendReply('/learn [pokemon], [move, move, ...] - Displays how a Pokemon can learn the given moves, if it can at all.')
			this.sendReply('!learn [pokemon], [move, move, ...] - Show everyone that information. Requires: + % @ & ~')
		}
		if (target === 'all' || target === 'calc' || target === 'caclulator') {
			matched = true;
			this.sendReply('/calc - Provides a link to a damage calculator');
			this.sendReply('!calc - Shows everyone a link to a damage calculator. Requires: + % @ & ~');
		}
		if (target === 'all' || target === 'blockchallenges' || target === 'away' || target === 'idle') {
			matched = true;
			this.sendReply('/away - Blocks challenges so no one can challenge you. Deactivate it with /back.');
		}
		if (target === 'all' || target === 'allowchallenges' || target === 'back') {
			matched = true;
			this.sendReply('/back - Unlocks challenges so you can be challenged again. Deactivate it with /away.');
		}
		if (target === 'all' || target === 'faq') {
			matched = true;
			this.sendReply('/faq [theme] - Provides a link to the FAQ. Add deviation, doubles, randomcap, restart, or staff for a link to these questions. Add all for all of them.');
			this.sendReply('!faq [theme] - Shows everyone a link to the FAQ. Add deviation, doubles, randomcap, restart, or staff for a link to these questions. Add all for all of them. Requires: + % @ & ~');
		}
		if (target === 'all' || target === 'highlight') {
			matched = true;
			this.sendReply('Set up highlights:');
			this.sendReply('/highlight add, word - add a new word to the highlight list.');
			this.sendReply('/highlight list - list all words that currently highlight you.');
			this.sendReply('/highlight delete, word - delete a word from the highlight list.');
			this.sendReply('/highlight delete - clear the highlight list');
		}
		if (target === 'all' || target === 'timestamps') {
			matched = true;
			this.sendReply('Set your timestamps preference:');
			this.sendReply('/timestamps [all|lobby|pms], [minutes|seconds|off]');
			this.sendReply('all - change all timestamps preferences, lobby - change only lobby chat preferences, pms - change only PM preferences');
			this.sendReply('off - set timestamps off, minutes - show timestamps of the form [hh:mm], seconds - show timestamps of the form [hh:mm:ss]');
		}
		if (target === 'all' || target === 'effectiveness') {
			matched = true;
			this.sendReply('/effectiveness [type1], [type2] - Provides the effectiveness of a [type1] attack to a [type2] Pokémon.');
			this.sendReply('!effectiveness [type1], [type2] - Shows everyone the effectiveness of a [type1] attack to a [type2] Pokémon.');
		}
		if (target === 'all' || target === 'dexsearch') {
			matched = true;
			this.sendReply('/dexsearch [type], [move], [move], ... - Searches for Pokemon that fulfill the selected criteria.');
			this.sendReply('Search categories are: type, tier, color, moves, ability, gen.');
			this.sendReply('Valid colors are: green, red, blue, white, brown, yellow, purple, pink, gray and black.');
			this.sendReply('Valid tiers are: Uber/OU/BL/UU/BL2/RU/NU/NFE/LC/CAP.');
			this.sendReply('Types must be followed by " type", e.g., "dragon type".');
			this.sendReply('The order of the parameters does not matter.');
		}
		if (target === 'all' || target === 'dice' || target === 'roll') {
			matched = true;
			this.sendReply('/dice [optional max number] - Randomly picks a number between 1 and 6, or between 1 and the number you choose.');
			this.sendReply('/dice [number of dice]d[number of sides] - Simulates rolling a number of dice, e.g., /dice 2d4 simulates rolling two 4-sided dice.');
		}
		if (target === 'all' || target === 'join') {
			matched = true;
			this.sendReply('/join [roomname] - Attempts to join the room [roomname].');
		}
		if (target === 'all' || target === 'ignore') {
			matched = true;
			this.sendReply('/ignore [user] - Ignores all messages from the user [user].');
			this.sendReply('Note that staff messages cannot be ignored.');
		}
		if (target === '%' || target === 'invite') {
			matched = true;
			this.sendReply('/invite [username], [roomname] - Invites the player [username] to join the room [roomname].');
		}
		if (target === '%' || target === 'roomban') {
			matched = true;
			this.sendReply('/roomban [username] - Bans the user from the room you are in. Requires: % @ & ~');
		}
		if (target === '%' || target === 'roomunban') {
			matched = true;
			this.sendReply('/roomunban [username] - Unbans the user from the room you are in. Requires: % @ & ~');
		}
		if (target === '%' || target === 'redirect' || target === 'redir') {
			matched = true;
			this.sendReply('/redirect or /redir [username], [roomname] - Attempts to redirect the user [username] to the room [roomname]. Requires: % @ & ~');
		}
		if (target === '%' || target === 'modnote') {
			matched = true;
			this.sendReply('/modnote [note] - Adds a moderator note that can be read through modlog. Requires: % @ & ~');
		}
		if (target === '%' || target === 'altcheck' || target === 'alt' || target === 'alts' || target === 'getalts') {
			matched = true;
			this.sendReply('/alts OR /altcheck OR /alt OR /getalts [username] - Get a user\'s alts. Requires: % @ & ~');
		}
		if (target === '%' || target === 'forcerename' || target === 'fr') {
			matched = true;
			this.sendReply('/forcerename OR /fr [username], [reason] - Forcibly change a user\'s name and shows them the [reason]. Requires: % @ & ~');
		}
		if (target === '@' || target === 'ban' || target === 'b') {
			matched = true;
			this.sendReply('/ban OR /b [username], [reason] - Kick user from all rooms and ban user\'s IP address with reason. Requires: @ & ~');
		}
		if (target === '&' || target === 'banip') {
			matched = true;
			this.sendReply('/banip [ip] - Kick users on this IP or IP range from all rooms and bans it. Accepts wildcards to ban ranges. Requires: & ~');
		}
		if (target === '@' || target === 'unban') {
			matched = true;
			this.sendReply('/unban [username] - Unban a user. Requires: @ & ~');
		}
		if (target === '@' || target === 'unbanall') {
			matched = true;
			this.sendReply('/unbanall - Unban all IP addresses. Requires: @ & ~');
		}
		if (target === '%' || target === 'modlog') {
			matched = true;
			this.sendReply('/modlog [roomid|all], [n] - Roomid defaults to current room. If n is a number or omitted, display the last n lines of the moderator log. Defaults to 15. If n is not a number, search the moderator log for "n" on room\'s log [roomid]. If you set [all] as [roomid], searches for "n" on all rooms\'s logs. Requires: % @ & ~');
		}
		if (target === "%" || target === 'kickbattle ') {
			matched = true;
			this.sendReply('/kickbattle [username], [reason] - Kicks an user from a battle with reason. Requires: % @ & ~');
		}
		if (target === "%" || target === 'warn' || target === 'k') {
			matched = true;
			this.sendReply('/warn OR /k [username], [reason] - Warns a user showing them the Pokemon Showdown Rules and [reason] in an overlay. Requires: $ % @ & ~');
		}
		if (target === '%' || target === 'mute' || target === 'm') {
			matched = true;
			this.sendReply('/mute OR /m [username], [reason] - Mute user with reason for 7 minutes. Requires: % @ & ~');
		}
		if (target === '%' || target === 'hourmute' || target === 'hm') {
			matched = true;
			this.sendReply('/hourmute OR /hm [username], [reason] - Mute user with reason for an hour. Requires: % @ & ~');
		}
		if (target === '%' || target === 'unmute') {
			matched = true;
			this.sendReply('/unmute [username] - Remove mute from user. Requires: % @ & ~');
		}
		if (target === '&' || target === 'promote') {
			matched = true;
			this.sendReply('/promote [username], [group] - Promotes the user to the specified group or next ranked group. Requires: & ~');
		}
		if (target === '&' || target === 'demote') {
			matched = true;
			this.sendReply('/demote [username], [group] - Demotes the user to the specified group or previous ranked group. Requires: & ~');
		}
		if (target === '~' || target === 'forcerenameto' || target === 'frt') {
			matched = true;
			this.sendReply('/forcerenameto OR /frt [username] - Force a user to choose a new name. Requires: & ~');
			this.sendReply('/forcerenameto OR /frt [username], [new name] - Forcibly change a user\'s name to [new name]. Requires: & ~');
		}
		if (target === '&' || target === 'forcetie') {
			matched = true;
			this.sendReply('/forcetie - Forces the current match to tie. Requires: & ~');
		}
		if (target === '&' || target === 'declare') {
			matched = true;
			this.sendReply('/declare [message] - Anonymously announces a message. Requires: ~');
		}
		if (target === '~' || target === 'chatdeclare' || target === 'cdeclare') {
			matched = true;
			this.sendReply('/cdeclare [message] - Anonymously announces a message to all chatrooms on the server. Requires: ~');
		}
		if (target === '~' || target === 'globaldeclare' || target === 'gdeclare') {
			matched = true;
			this.sendReply('/globaldeclare [message] - Anonymously announces a message to every room on the server. Requires: ~');
		}
		if (target === '%' || target === 'announce' || target === 'wall') {
			matched = true;
			this.sendReply('/announce OR /wall [message] - Makes an announcement. Requires: @ & ~');
		}
		if (target === '@' || target === 'modchat') {
			matched = true;
			this.sendReply('/modchat [off/autoconfirmed/+/%/@/&/~] - Set the level of moderated chat. Requires: @ for off/autoconfirmed/+ options, & ~ for all the options');
		}
		if (target === '~' || target === 'hotpatch') {
			matched = true;
			this.sendReply('Hot-patching the game engine allows you to update parts of Showdown without interrupting currently-running battles. Requires: ~');
			this.sendReply('Hot-patching has greater memory requirements than restarting.');
			this.sendReply('/hotpatch chat - reload chat-commands.js');
			this.sendReply('/hotpatch battles - spawn new simulator processes');
			this.sendReply('/hotpatch formats - reload the tools.js tree, rebuild and rebroad the formats list, and also spawn new simulator processes');
		}
		if (target === '~' || target === 'lockdown') {
			matched = true;
			this.sendReply('/lockdown - locks down the server, which prevents new battles from starting so that the server can eventually be restarted. Requires: ~');
		}
		if (target === '~' || target === 'kill') {
			matched = true;
			this.sendReply('/kill - kills the server. Can\'t be done unless the server is in lockdown state. Requires: ~');
		}
		if (target === '~' || target === 'loadbanlist') {
			matched = true;
			this.sendReply('/loadbanlist - Loads the bans located at ipbans.txt. The command is executed automatically at startup. Requires: ~');
		}
		if (target === '~' || target === 'makechatroom') {
			matched = true;
			this.sendReply('/makechatroom [roomname] - Creates a new room named [roomname]. Requires: ~');
		}
		if (target === '~' || target === 'deregisterchatroom') {
			matched = true;
			this.sendReply('/deregisterchatroom [roomname] - Deletes room [roomname] after the next server restart. Requires: ~');
		}
		if (target === '~' || target === 'roomowner') {
			matched = true;
			this.sendReply('/roomowner [username] - Appoints [username] as a room owner. Removes official status. Requires: ~');
		}
		if (target === '~' || target === 'roomdeowner') {
			matched = true;
			this.sendReply('/roomdeowner [username] - Removes [username]\'s status as a room owner. Requires: ~');
		}
		if (target === '~' || target === 'privateroom') {
			matched = true;
			this.sendReply('/privateroom [on/off] - Makes or unmakes a room private. Requires: ~');
		}
		if (target === 'all' || target === 'help' || target === 'h' || target === '?' || target === 'commands') {
			matched = true;
			this.sendReply('/help OR /h OR /? - Gives you help.');
		}
		if (!target) {
			this.sendReply('COMMANDS: /msg, /reply, /ignore, /ip, /rating, /nick, /avatar, /rooms, /whois, /help, /away, /back, /timestamps, /highlight');
			this.sendReply('INFORMATIONAL COMMANDS: /data, /dexsearch, /groups, /opensource, /avatars, /faq, /rules, /intro, /tiers, /othermetas, /learn, /analysis, /calc (replace / with ! to broadcast. (Requires: + % @ & ~))');
			this.sendReply('For details on all room commands, use /roomhelp');
			this.sendReply('For details on all commands, use /help all');
			if (user.group !== config.groupsranking[0]) {
				this.sendReply('OPERATOR COMMANDS: /warn')
				this.sendReply('DRIVER COMMANDS: /mute, /unmute, /forcerename, /alts');
				this.sendReply('MODERATOR COMMANDS: /announce, /ban, /unban, /unbanall, /ip, /modlog, /redirect, /kick');
				this.sendReply('LEADER COMMANDS: /promote, /demote, /forcewin, /forcetie');
				this.sendReply('For details on all moderator commands, use /help @');
			}
			this.sendReply('For details of a specific command, use something like: /help data');
		} else if (!matched) {
			this.sendReply('The command "/'+target+'" was not found. Try /help for general help');
		}
	},

};
