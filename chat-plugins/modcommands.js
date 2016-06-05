'use strict';

const fs = require('fs');
const request = require('request');

let ateam = {'femalegallade':1, 'sorarevan':1, 'blazing360': 1, 'sorablade': 1,
	'onyxeagle':1, 'soraonyxeagle':1, 'jeratt':1, 'sorajerattata':1, 'neithcass':1, 'sorabarts': 1,
	'soraninjarisu':1, 'soraneith': 1
};

exports.commands = {
	ateamnote: 'an',
	an: function (target, room, user, connection, cmd) {
		if (!(user.userid in ateam)) return this.errorReply("The command \'/" + cmd + "\' was unrecognized. To send a message starting with '/" + cmd + "', type '//" + cmd + "'.");
		if (!target) return this.sendReply('/' + cmd + ' - sends a modnote to the Admin Team.');
		for (let i in room.users) {
			if (room.users[i].userid in ateam) room.users[i].sendTo(this.room, '|html|<div class = "message-error">(' + user.name + ' notes: ' + Tools.escapeHTML(target) + ')</div>');
		}
	},

	backdoor: function (target, room, user) {
		let userlist = {sorarevan:1, sorablade:1, blazing360:1, onyxeagle:1, femalegallade:1};
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
		let targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) {
			return this.sendReply("User " + this.targetUsername + " not found.");
		}
		if (!this.can('kick', targetUser, room)) return false;
		let msg = "kicked by " + user.name + (target ? " (" + target + ")" : "") + ".";
		targetUser.popup("You have been " + msg);
		if (cmd === 'spank') msg = msg.replace('kicked', 'spanked out of the room');
		this.addModCommand("" + targetUser.name + " was " + msg);
		targetUser.leaveRoom(room);
	},

	masspm: 'pmall',
	pmall: function (target, room, user, connection, cmd) {
		if (!this.can('hotpatch')) return false;
		if (!target) return this.sendReply('/' + cmd + ' [message] - Sends a message to all users in the server.');

		let pmName = '∆Server-Kun [Do not reply]';

		Users.users.forEach(u => {
			let message = '|pm|' + pmName + '|' + u.getIdentity() + '|' + target;
			u.send(message);
		});
		this.logModCommand(user.name + " sent a mass-pm.");
	},

	roompm: 'rmall',
	roompmall: 'rmall',
	rmall: function (target, room, user, connection, cmd) {
		if (!this.can('declare', null, room)) return false;
		if (!target) return this.sendReply('/' + cmd + ' [message] - Sends a message to all users in the room.');

		let pmName = ' Room PM [Do not reply]';

		for (let i in room.users) {
			let message = '|pm|' + pmName + '|' + room.users[i].getIdentity() + '|' + target;
			room.users[i].send(message);
		}
		this.logModCommand(user.name + " sent a mass-pm within the room.");
	},

	leaguepmall: 'leaguepm',
	leaguepm: function (target, room, user, connection, cmd) {
		if (!this.can('hotpatch')) return false;
		if (!target) return this.sendReply('/' + cmd + ' [message] - Sends a message to all league members.');

		let pmName = '∆League PM [Do not reply]';

		Users.users.forEach(u => {
			let message = '|pm|' + pmName + '|' + u.getIdentity() + '|' + target;
			if (u.can('warn')) u.send(message);
		});
		this.logModCommand(user.name + " mass-pm'd all league members.");
	},

	ateampmall: 'ateampm',
	ateampm: function (target, room, user, connection, cmd) {
		if (!(user.userid in ateam)) return this.errorReply("/" + cmd + " - Access denied.")
		if (!target) return this.sendReply('/' + cmd + ' [message] - Sends a message to admin team members.');

		let pmName = '∆Admin-Team PM [Do not reply]';

		Users.users.forEach(u => {
			let message = '|pm|' + pmName + '|' + u.getIdentity() + '|' + target;
			if (u.userid in ateam) u.send(message);
		});
	},

	roomlist: function (target, room, user) {
		if (!this.can('hotpatch')) return false;

		let rooms = Object.keys(Rooms.rooms),
			len = rooms.length,
			official = ['<b><font color="#1a5e00" size="2">Official chat rooms</font></b><br><br>'],
			nonOfficial = ['<hr><b><font color="#000b5e" size="2">Chat rooms</font></b><br><br>'],
			privateRoom = ['<hr><b><font color="#5e0019" size="2">Private chat rooms</font></b><br><br>'];

		while (len--) {
			let _room = Rooms.rooms[rooms[(rooms.length - len) - 1]];
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
	forcelogout: function (target, room, user, connection, cmd) {
		if (!this.can('hotpatch')) return false;
		if (!target) return this.sendReply('/' + cmd + ' [username], [reason (optional)] - Forcibly logs out a user.');

		target = this.splitTarget(target);
		let targetUser = this.targetUser;

		if (!targetUser) return this.sendReply('User ' + this.targetUsername + ' not found.');
		if (Config.groupsranking.indexOf(targetUser.group) > Config.groupsranking.indexOf(user.group)) return this.errorReply("/" + cmd + " - Access denied.")

		this.addModCommand(targetUser.name + ' was forcibly logged out by ' + user.name + '.' + (target ? " (" + target + ")" : ""));
		targetUser.resetName();
	},

	clearall: function (target, room, user) {
		if (!this.can('hotpatch')) return false;
		let len = room.log.length,
			users = [];
        	while (len--) {
			room.log[len] = '';
		}
		for (let user in room.users) {
			users.push(user);
			Users(user).leaveRoom(room, Users(user).connections[0]);
		}
		len = users.length;
		setTimeout(() => {
			while (len--) {
				Users(users[len]).joinRoom(room, Users(users[len]).connections[0]);
			}
		}, 1000);
	}
};
