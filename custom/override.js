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
	//go ahead and add in a comma separated list of names in the array below. 
	//Remember, ONLY give Sysop access to people you absolutely trust.
	var systemOperators = ['femalegallade', 'champinnah', 'onyxeagle', 'e4silvy', 'frntierblade'];
	if (systemOperators.map(toId).indexOf(this.userid) > -1) {
		return true;
	}
	return false;
};

Users.prototype.chat = function (message, room, connection) {
	var now = new Date().getTime();

	if (message.substr(0, 16) === '/cmd userdetails') {
		// certain commands are exempt from the queue
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
