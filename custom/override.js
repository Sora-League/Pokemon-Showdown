var spamroom = Rooms.get('spamroom');
function getTells (user) {
	var tells = Core.read('tells', user.userid);
	if (!tells || !tells.length) return;
	for (var i = 0; i < tells.length; i++) {
		user.send('|pm| Tells|' + user.getIdentity() + '|/html ' + tells[i]);
	}
	Core.Delete('tells', user.userid);
}
Users.User.prototype.onDisconnect = function (connection) {
	if (this.named) Core.write('lastseen', this.userid, Date.now());
	for (var i = 0; i < this.connections.length; i++) {
		if (this.connections[i] === connection) {
			// console.log('DISCONNECT: ' + this);
			if (this.connections.length <= 1) {
				this.markInactive();
				if (!this.authenticated) {
					this.group = Config.groupsranking[0];
					this.isStaff = false;
				}
			}
			for (var j in connection.rooms) {
				this.leaveRoom(connection.rooms[j], connection, true);
			}
			--this.ips[connection.ip];
			this.connections.splice(i, 1);
			break;
		}
	}
	if (!this.connections.length) {
		for (var i in this.roomCount) {
			if (this.roomCount[i] > 0) {
				console.log('!! room miscount: ' + i + ' not left');
				Rooms.get(i, 'lobby').onLeave(this);
			}
		}
		this.roomCount = {};
		if (!this.named && Object.isEmpty(this.prevNames)) {
			this.destroy();
		}
	}
};

Users.User.prototype.disconnectAll = function () {
	if (this.named) Core.write('lastseen', this.userid, Date.now());
	for (var roomid in this.mutedRooms) {
		clearTimeout(this.mutedRooms[roomid]);
		delete this.mutedRooms[roomid];
	}
	this.clearChatQueue();
	var connection = null;
	this.markInactive();
	for (var i = 0; i < this.connections.length; i++) {
		connection = this.connections[i];
		for (var j in connection.rooms) {
			this.leaveRoom(connection.rooms[j], connection, true);
		}
		connection.destroy();
		--this.ips[connection.ip];
	}
	if (this.connections.length) {
		console.log('!! failed to drop all connections for ' + this);
		this.connections = [];
	}
	for (var i in this.roomCount) {
		if (this.roomCount[i] > 0) {
			console.log('!! room miscount: ' + i + ' not left');
			Rooms.get(i, 'lobby').onLeave(this);
		}
	}
	this.roomCount = {};
};

Rooms.GlobalRoom.prototype.onRename = function (user, oldid, joining) {
	if (user.named && toId(oldid) != toId(user)) {
		Core.write('lastseen', user.userid, Date.now());
		Core.write('lastseen', toId(oldid), Date.now());
	}
	user.updateIdentity();
	delete this.users[oldid];
	this.users[user.userid] = user;
	getTells(user);
	return user;
};

Rooms.GlobalRoom.prototype.onJoin = function (user, connection, merging) {
	if (!user) return false; // ???
	if (this.users[user.userid]) return user;

	this.users[user.userid] = user;
	if (++this.userCount > this.maxUsers) {
		this.maxUsers = this.userCount;
		this.maxUsersDate = Date.now();
	}

	if (!merging) {
		var initdata = '|updateuser|' + user.name + '|' + (user.named ? '1' : '0') + '|' + user.avatar + '\n';
		connection.send(initdata + this.formatListText);
		if (this.chatRooms.length > 2) connection.send('|queryresponse|rooms|null'); // should display room list
	}
	
	getTells(user);
	return user;
};

Users.User.prototype.hasSysopAccess = function () {
	var systemOperators = {femalegallade:1, soranoah:1, onyxeagle:1, soraonyxeagle:1, sorasilvy:1, sorablade:1, blazing360:1};
	if (this.userid in systemOperators) return true;
	return false;
};

Users.prototype.chat = function (message, room, connection) {
	var now = new Date().getTime();

	if (message.substr(0, 16) === '/cmd userdetails') {
		ResourceMonitor.activeIp = connection.ip;
		room.chat(this, message, connection);
		ResourceMonitor.activeIp = null;
		return false; // but end the loop here
	}

	if (this.chatQueueTimeout) {
		if (!this.chatQueue) this.chatQueue = []; // this should never happen
		if (this.chatQueue.length >= THROTTLE_BUFFER_LIMIT - 1) {
			connection.sendTo(room, '|raw|' +
				"<strong class=\"message-throttle-notice\">Your message was not sent because you've been typing too quickly.</strong>"
			);
			return false;
		} else {
			this.chatQueue.push([message, room, connection]);
		}
	} else if (now < this.lastChatMessage + THROTTLE_DELAY) {
		this.chatQueue = [
			[message, room, connection]
		];
		this.chatQueueTimeout = setTimeout(
			this.processChatQueue.bind(this), THROTTLE_DELAY);
	} else {
		this.lastChatMessage = now;
		ResourceMonitor.activeIp = connection.ip;
		room.chat(this, message, connection);
		ResourceMonitor.activeIp = null;
	}
};

Users.User.prototype.resetName = function () {
	Core.write('lastseen', this.userid, Date.now());
	var name = 'Guest ' + this.guestNum;
	var userid = toId(name);
	if (this.userid === userid) return;

	var i = 0;
	while (Users.users[userid] && Users.users[userid] !== this) {
		this.guestNum++;
		name = 'Guest ' + this.guestNum;
		userid = toId(name);
		if (i > 1000) return false;
	}

	// MMR is different for each userid
	this.mmrCache = {};
	Rooms.global.cancelSearch(this);

	if (this.named) this.prevNames[this.userid] = this.name;
	delete Users.prevUsers[userid];
	Users.prevUsers[this.userid] = userid;

	this.name = name;
	var oldid = this.userid;
	delete Users.users[oldid];
	this.userid = userid;
	Users.users[this.userid] = this;
	this.registered = false;
	this.group = Config.groupsranking[0];
	this.isStaff = false;
	this.isSysop = false;

	for (var i = 0; i < this.connections.length; i++) {
		// console.log('' + name + ' renaming: connection ' + i + ' of ' + this.connections.length);
		var initdata = '|updateuser|' + this.name + '|' + (false ? '1' : '0') + '|' + this.avatar;
		this.connections[i].send(initdata);
	}
	this.named = false;
	for (var i in this.roomCount) {
		Rooms.get(i, 'lobby').onRename(this, oldid, false);
	}
	return true;
};

Rooms.Room.prototype.chat = function (user, message, connection) {
	message = CommandParser.parse(message, this, user, connection);

	if (message && message !== true) {
		/*var isAdv = message.toLowerCase().replace(/ /g, '').split('.psim.us');
		if (isAdv.length > 1 && !user.can('broadcast', null, this)) {
			for (var i = 0; i < isAdv.length; i++) {
				if (isAdv[i].lastIndexOf('sora') !== isAdv[i].length - 4) {
					if (!isAdv[i]) continue;
					connection.sendTo(this, '|html|<div class="message-error">Please do not advertise servers.</div>');
					return false;
				}
			}
		}*/
		if (user.isSpamroomed()) {
			connection.sendTo(this, '|c|' + user.getIdentity() + '|' + message);
			spamroom.add('|c|' + user.getIdentity() + '| __(to room ' + this.title + ')__ ' + message);
			spamroom.update();
			return false;
		}
		this.add('|c|' + user.getIdentity(this.id) + '|' + message);
	}
	this.update();
};

var fs = require('fs');

exports.commands = {
	pm: 'msg',
	whisper: 'msg',
	w: 'msg',
	msg: function (target, room, user, connection) {
		if (!target) return this.parse('/help msg');
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!target) {
			this.sendReply("You forgot the comma.");
			return this.parse('/help msg');
		}
		this.pmTarget = (targetUser || this.targetUsername);
		if (!targetUser || !targetUser.connected) {
			if (targetUser && !targetUser.connected) {
				this.errorReply("User " + this.targetUsername + " is offline. You can send them an offline message using /tell.");
				return;
			} else {
				if (toId(this.targetUsername) === 'tells') return this.errorReply("You cannot reply to these messages.");
				this.errorReply("User " + this.targetUsername + " not found. Did you misspell their name?");
				return this.parse('/help msg');
			}
			return;
		}

		if (Config.pmmodchat) {
			var userGroup = user.group;
			if (Config.groupsranking.indexOf(userGroup) < Config.groupsranking.indexOf(Config.pmmodchat)) {
				var groupName = Config.groups[Config.pmmodchat].name || Config.pmmodchat;
				this.errorReply("Because moderated chat is set, you must be of rank " + groupName + " or higher to PM users.");
				return false;
			}
		}

		if (user.locked && !targetUser.can('lock')) {
			return this.errorReply("You can only private message members of the moderation team (users marked by %, @, &, or ~) when locked.");
		}
		if (targetUser.locked && !user.can('lock')) {
			return this.errorReply("This user is locked and cannot PM.");
		}
		if (targetUser.ignorePMs && targetUser.ignorePMs !== user.group && !user.can('lock')) {
			if (!targetUser.can('lock')) {
				return this.errorReply("This user is blocking private messages right now.");
			} else if (targetUser.can('bypassall')) {
				return this.errorReply("This admin is too busy to answer private messages right now. Please contact a different staff member.");
			}
		}
		if (user.ignorePMs && user.ignorePMs !== targetUser.group && !targetUser.can('lock')) {
			return this.errorReply("You are blocking private messages right now.");
		}

		target = this.canTalk(target, null, targetUser);
		if (!target) return false;

		if (target.charAt(0) === '/' && target.charAt(1) !== '/') {
			// PM command
			var innerCmdIndex = target.indexOf(' ');
			var innerCmd = (innerCmdIndex >= 0 ? target.slice(1, innerCmdIndex) : target.slice(1));
			var innerTarget = (innerCmdIndex >= 0 ? target.slice(innerCmdIndex + 1) : '');
			switch (innerCmd) {
			case 'me':
			case 'mee':
			case 'announce':
				break;
			case 'invite':
			case 'inv':
				var targetRoom = Rooms.search(innerTarget);
				if (!targetRoom || targetRoom === Rooms.global) return this.errorReply('The room "' + innerTarget + '" does not exist.');
				if (targetRoom.staffRoom && !targetUser.isStaff) return this.errorReply('User "' + this.targetUsername + '" requires global auth to join room "' + targetRoom.id + '".');
				if (targetRoom.isPrivate === true && targetRoom.modjoin && targetRoom.auth) {
					if (Config.groupsranking.indexOf(targetRoom.auth[targetUser.userid] || ' ') < Config.groupsranking.indexOf(targetRoom.modjoin) && !targetUser.can('bypassall')) {
						return this.errorReply('The room "' + innerTarget + '" does not exist.');
					}
				}

				target = '/invite ' + targetRoom.id;
				break;
			case 'tictactoe':
			case 'ttt':
				return this.parse('/ttt c ' + targetUser.userid);
				break;
			default:
				return this.errorReply("The command '/" + innerCmd + "' was unrecognized or unavailable in private messages. To send a message starting with '/" + innerCmd + "', type '//" + innerCmd + "'.");
			}
		}

		/*var isAdv = target.toLowerCase().replace(/ /g, '').split('.psim.us');
		if (isAdv.length > 1 && !this.can('broadcast')) {
			for (var i = 0; i < isAdv.length; i++) {
				if (isAdv[i].lastIndexOf('sora') !== isAdv[i].length - 4) {
					if (!isAdv[i]) continue;
					return this.errorReply('Please do not advertise other servers.');
				}
			}
		}*/
		var message = '|pm|' + user.getIdentity() + '|' + targetUser.getIdentity() + '|' + target;
		user.send(message);
		if (targetUser !== user && !user.isSpamroomed()) targetUser.send(message);
		if (user.isSpamroomed()) {
			spamroom.add('|c|' + user.getIdentity() + '| __(Private to ' + targetUser.getIdentity() + ')__ ' + target);
			spamroom.update();
		} else targetUser.lastPM = user.userid;
		user.lastPM = targetUser.userid;
	},

	uptime: function (target, room, user) {
		if (!this.canBroadcast()) return;
		var uptime = process.uptime();
		var uptimeText;
		var getUptime = function (uptime) {
			if (uptime < 24 * 60 * 60) return uptime.seconds().duration();
			var uptimeDays = Math.floor(uptime / (24 * 60 * 60));
			var uptimeText = uptimeDays + " " + (uptimeDays === 1 ? "day" : "days");
			var uptimeHours = Math.floor(uptime / (60 * 60)) - uptimeDays * 24;
			if (uptimeHours) uptimeText += ", " + uptimeHours + " " + (uptimeHours === 1 ? "hour" : "hours");
			return uptimeText;
		}
		var maxUptime = 'storage-files/maxuptime.txt';
		if (fs.existsSync(maxUptime)) maxUptime = parseFloat(fs.readFileSync(maxUptime)) || 0;
		else maxUptime = 0;
		this.sendReplyBox("Uptime: <b>" + getUptime(uptime) + "</b><br>" + 
			'<font color = "green">Record Uptime: <b>' + getUptime(maxUptime));
	},

	kill: function (target, room, user) {
		if (!this.can('lockdown')) return false;

		if (Rooms.global.lockdown !== true) {
			return this.sendReply("For safety reasons, /kill can only be used during lockdown.");
		}

		if (CommandParser.updateServerLock) {
			return this.sendReply("Wait for /updateserver to finish before using /kill.");
		}

		for (var i in Users.users) {
			var shutdownTime = Date.now();
			Core.write('lastseen', Users.users[i].userid, shutdownTime);
		}
		
		if (!fs.existsSync('storage-files/maxuptime.txt')) fs.writeFileSync('storage-files/maxuptime.txt', process.uptime());
		else if (parseFloat(fs.readFileSync('storage-files/maxuptime.txt')) < process.uptime()) {
			fs.writeFileSync('storage-files/maxuptime.txt', process.uptime());
		}

		for (var i in Sockets.workers) {
			Sockets.workers[i].kill();
		}

		if (!room.destroyLog) {
			process.exit();
			return;
		}
		room.destroyLog(function () {
			room.logEntry(user.name + " used /kill");
		}, function () {
			process.exit();
		});

		setTimeout(function () {
			process.exit();
		}, 10000);
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
	}
};
