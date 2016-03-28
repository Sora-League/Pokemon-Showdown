'use strict';
let spamroom = Rooms("spamroom");
if (!spamroom) {
	Rooms.global.addChatRoom("Spam Room");
	spamroom = Rooms.get("spamroom");
	spamroom.isPrivate = true;
	spamroom.staffRoom = true;
	spamroom.chatRoomData.isPrivate = true;
	spamroom.chatRoomData.staffRoom = true;
	spamroom.chatRoomData.addedUsers = {};
	spamroom.chatRoomData.exceptions = {};
	Rooms.global.writeChatRoomData();
}
let userlist = spamroom.chatRoomData.addedUsers;
let exceptions = spamroom.chatRoomData.exceptions;

function addUser(target, user) {
	let names = [];
	userlist[target.userid] = true;
	for (let name in target.prevNames) {
		userlist[toId(name)] = true;
		names.push(name);
	}
	let alts = target.getAlts();
	for (let i = 0; i < alts.length; i++) {
		if (!user.can('lock', target)) continue;
		userlist[toId(alts[i])] = true;
		names.push(Users.get(alts[i].name));
	}
	Rooms.global.writeChatRoomData();
	return names;
}

function removeUser(target, user) {
	let names = [];
	delete userlist[target.userid];
	for (let name in target.prevNames) {
		delete userlist[toId(name)];
		names.push(name);
	}
	let alts = target.getAlts();
	for (let i = 0; i < alts.length; i++) {
		if (!user.can('lock', target)) continue;
		delete userlist[toId(alts[i])];
		names.push(Users.get(alts[i].name));
	}
	Rooms.global.writeChatRoomData();
	return names;
}

let commands = {
	'': 'add',
	add: function (target, room, user, connection, cmd) {
		if (!this.can('lock')) return false;
		if (!toId(target)) return this.sendReply('/spamroom ' + cmd + ' [user] - Adds a user and their alts to the spamroom.');
		let targetUser = Users.get(target);
		if (!targetUser) return this.sendReply('User ' + target + ' not found.');
		if (!this.can('lock', targetUser)) return false;
		delete exceptions[targetUser.userid];
		Rooms.global.writeChatRoomData();
		if (userlist[targetUser.userid]) return this.sendReply(targetUser.name + ' is already in the spamroom!');
		let alts = addUser(targetUser, user);
		this.privateModCommand('(' + targetUser.name + ' was added to the spamroom.)');
		if (alts.length) this.privateModCommand('(' + targetUser.name + '\'s alts were added to the spamroom: ' + alts.join(', '));
	},
	removeuser: 'remove',
	removeusers: 'remove',
	removealts: 'remove',
	remove: function (target, room, user, connection, cmd) {
		if (!this.can('lock')) return false;
		if (!toId(target)) return this.sendReply('/spamroom ' + cmd + ' [user] - Removes a user and all of their alts from the spamroom.');
		let targetUser = Users.getExact(target);
		if (!targetUser) return this.sendReply('User ' + target + ' not found.');
		if (!this.can('lock', targetUser)) return false;
		let check;
		if (exceptions[targetUser.userid]) check = true;
		if (!userlist[targetUser.userid] || check) return this.sendReply(targetUser.name + ' isn\'t in the spamroom.');
		let alts = removeUser(targetUser, user);
		if (!check) this.privateModCommand('(' + targetUser.name + ' was removed from the spam room.)');
		if (alts.length) this.privateModCommand('(' + targetUser.name + '\'s alts were removed from the spamroom: ' + alts.join(', '));
	},

	exception: function (target, room, user, connection, cmd) {
		if (!this.can('lock')) return false;
		if (!toId(target)) return this.sendReply('/spamroom ' + cmd + ' [user] - Excludes a specific user from the spam room.');
		let targetUser = Users.get(target);
		if (!targetUser) return this.sendReply('User ' + target + ' not found.');
		if (!this.can('lock', targetUser)) return false;
		exceptions[targetUser.userid] = true;
		Rooms.global.writeChatRoomData();
		this.privateModCommand('(' + targetUser.name + ' was given an exception from the spam room.)');
	},

	removeexception: 'unexception',
	unexception: function (target, room, user, connection, cmd) {
		if (!this.can('lock')) return false;
		if (!toId(target)) return this.sendReply('/spamroom ' + cmd + ' [user] - Excludes a specific user from the spam room.');
		let targetUser = Users.get(target);
		if (!targetUser) return this.sendReply('User ' + target + ' not found.');
		if (!this.can('lock', targetUser)) return false;
		delete exceptions[targetUser.userid];
		Rooms.global.writeChatRoomData();
		this.privateModCommand('(' + targetUser.name + '\'s exception from the spam room was removed.)');
	},

	list: 'view',
	see: 'view',
	view: function (target, room, user, connection, cmd) {
		if (!this.can('lock')) return false;
		let list = [];
		for (let i in userlist) {
			list.push(i);
		}
		let exceptionlist = [];
		for (i in exceptions) {
			exceptionlist.push(i);
		}
		list = (list.length ? list.join(', ') : 'None');
		exceptionlist = (exceptionlist.length ? exceptionlist.join(', ') : 'None');
		this.sendReplyBox('Users in spamroom: ' + list + '<br/>Exceptions: ' + exceptionlist);
	},

	help: function (target, room, user) {
		if (!this.can('lock')) return false;
		this.sendReplyBox('<strong>Spamroom commands (Requires: % @ & ~):</strong><br />' +
			'- /spamroom or /shadowban or /spamroom add <i>User</i> - Adds a user and all of their alts to the spamroom <br />' +
			'- /removespamroom or /spamroom remove <i>User</i> - Removes a user and all of their alts from the spamroom <br />' +
			'- /spamroomexception or /spamroom exception <i>User</i> - Excludes a specific user from the spamroom by adding them to an exceptional list <br />' +
			'- /spamroom removeexception or /spamroom unexception <i>User</i> - Removes a specific user from the exceptional list<br />' +
			'- /spamroom list or /spamroom view - Shows all spamroomed users and users in the exceptional list<br />');
	}
};

exports.commands = {
	pm: 'msg',
	whisper: 'msg',
	w: 'msg',
	msg: function (target, room, user, connection) {
		if (!target) return this.parse('/help msg');
		target = this.splitTarget(target);
		let targetUser = this.targetUser;
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
			let userGroup = user.group;
			if (Config.groupsranking.indexOf(userGroup) < Config.groupsranking.indexOf(Config.pmmodchat)) {
				let groupName = Config.groups[Config.pmmodchat].name || Config.pmmodchat;
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
			let innerCmdIndex = target.indexOf(' ');
			let innerCmd = (innerCmdIndex >= 0 ? target.slice(1, innerCmdIndex) : target.slice(1));
			let innerTarget = (innerCmdIndex >= 0 ? target.slice(innerCmdIndex + 1) : '');
			switch (innerCmd) {
			case 'me':
			case 'mee':
			case 'announce':
				break;
			case 'invite':
			case 'inv':
				let targetRoom = Rooms.search(innerTarget);
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

		/*let isAdv = target.toLowerCase().replace(/ /g, '').split('.psim.us');
		if (isAdv.length > 1 && !this.can('broadcast')) {
			for (let i = 0; i < isAdv.length; i++) {
				if (isAdv[i].lastIndexOf('sora') !== isAdv[i].length - 4) {
					if (!isAdv[i]) continue;
					return this.errorReply('Please do not advertise other servers.');
				}
			}
		}*/
		let message = '|pm|' + user.getIdentity() + '|' + targetUser.getIdentity() + '|' + target;
		user.send(message);
		if (targetUser !== user && !user.isSpamroomed()) targetUser.send(message);
		if (user.isSpamroomed()) {
			spamroom.add('|c|' + user.getIdentity() + '| __(Private to ' + targetUser.getIdentity() + ')__ ' + target);
			spamroom.update();
		} else targetUser.lastPM = user.userid;
		user.lastPM = targetUser.userid;
	},
	shadowban: commands.add,
	removespamroom: commands.remove,
	spamroomexception: commands.unexception,
	spamroomhelp: commands.help,
	spamroomlist: commands.list,
	spamroom: commands
};

Users.prototype.chat = function (message, room, connection) {
	let now = new Date().getTime();

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
