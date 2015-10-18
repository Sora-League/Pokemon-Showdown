/* A small script that deals with custom avatars. Please report any bugs to me~
~SilverTactic/Siiilver
*/
var fs = require('fs');
var path = require('path');

function loadAvatars() {
	var formatList = ['.png', '.gif', '.bmp', '.jpeg', '.jpg'];
	var avatarList = fs.readdirSync('config/avatars');
	for (var i = 0; i < avatarList.length; i++) {
		var name = path.basename(avatarList[i], path.extname(avatarList[i]));
		if (Config.customavatars[name] || formatList.indexOf(path.extname(avatarList[i])) === -1) continue;
		Config.customavatars[name] = avatarList[i];
	}
}
loadAvatars();

if (Config.watchconfig) {
	fs.watchFile(path.resolve(__dirname, 'config/config.js'), function (curr, prev) {
		if (curr.mtime <= prev.mtime) return;
		loadAvatars();
	});
}

var cmds = {
	'': 'help',
	help: function (target, room, user) {
		if (!this.canBroadcast()) return;
		return this.sendReplyBox('<b>Custom Avatar commands</b><br>' +
			'All commands require ~ unless specified otherwise.<br><br>' +
			'<li>/ca set <small>or</small> /setavatar <em>URL</em> (For normal users) - Sets the user\'s avatar to the specified image link.The user needs to buy this from the shop first.' +
			'<li>/ca set <small>or</small> /setavatar <em>User</em>, <em>URL</em> - Sets the specified user\'s avatar to the specified image link.' +
			'<li>/ca delete <small>or</small> /deleteavatar <em>User</em> - Delete\'s the specified user\'s custom avatar.' +
			'<li>/ca move <small>or</small> /moveavatar <em>User 1</em>, <em>User 2</em> - Moves User 1\'s custom avatar to User 2.'
		);
	},

	add: 'set',
	forceset: 'set',
	set: function (target, room, user, connection, cmd) {
		if (!this.can('hotpatch')) return false;
		if (!target || !target.trim()) return this.sendReply('|html|/' + cmd + ' <em>User</em>, <em>URL</em> - Sets the specified user\'s custom avatar to the specified image.');
		target = this.splitTarget(target);
		var targetUser = Users.getExact(this.targetUsername);
		if (!target || !target.trim()) return this.sendReply('|html|/' + cmd + ' <em>User</em>, <em>URL</em> - Sets the specified user\'s custom avatar to the specified image.');
		if (!targetUser && cmd !== 'forceset') return this.sendReply('User ' + this.targetUsername + ' is offline. Use the command /forcesetavatar instead of /' + cmd + ' to set their custom avatar.');
		targetUser = (targetUser ? targetUser.name : this.targetUsername);
	
		var avatars = Config.customavatars;
		if (target.indexOf('http://') !== 0) target = 'http://' + target;
		var allowedFormats = ['png', 'jpg', 'jpeg', 'gif', 'bmp'];

		var self = this;
		require("request").get(target)
		.on('error', function (err) {
			console.log(err);
			return self.sendReply('The selected avatar is unavailable. Try choosing a different one.');
		})
		.on('response', function (response) {
			if (response.statusCode != 200) return self.sendReply('The selected avatar is unavailable. Try choosing a different one.');
			var type = response.headers['content-type'].split('/');
			console.log(type);
			if (type[0] !== 'image') return self.sendReply('The selected link is not an image...');

			var getUser = Users.getExact(targetUser);
			if (!~allowedFormats.indexOf(type[1])) return self.sendReply('The format of the selected avatar is not supported. The allowed formats are: ' + allowedFormats.join(', '));

			var file = toId(targetUser) + '.' + type[1];
			if (avatars[toId(targetUser)]) fs.unlinkSync('config/avatars/' + avatars[toId(targetUser)]);
			response.pipe(fs.createWriteStream('config/avatars/' + file));
			avatars[toId(targetUser)] = file;
			if (getUser) getUser.avatar = file;

			var desc = 'custom avatar has been set to <br><div style = "width: 80px; height: 80px; display: block"><img src = "' + target + '" style = "max-height: 100%; max-width: 100%"></div>'
			self.sendReply('|html|' + targetUser + '\'s ' + desc);
			if (getUser) {
				getUser.send('|html|' + user.name + ' set your custom avatar. Refresh if you don\'t see it.');
				getUser.popup('|html|<center>Your ' + desc + '<br>Refresh your page if you don\'t see it under your username.</center>');
			}
		});
	},
	
	remove: 'delete',
	'delete': function (target, room, user, connection, cmd) {
		if (!this.can('hotpatch')) return false;
		if (!target || !target.trim()) return this.sendReply('|html|/' + cmd + ' <em>User</em> - Deletes the specified user\'s custom avatar.');
		target = Users.getExact(target) ? Users.getExact(target).name : target;
		var avatars = Config.customavatars;
		if (!avatars[toId(target)]) return this.sendReply('User ' + target + ' does not have a custom avatar.');
		fs.unlinkSync('config/avatars/' + avatars[toId(target)]);
		delete avatars[toId(target)];
		this.sendReply(target + '\'s custom avatar has been successfully removed.');
		if (Users.getExact(target) && Users.getExact(target).connected) {
			Users.getExact(target).send('Your custom avatar has been removed.');
			Users.getExact(target).avatar = 1;
		}
	},
	
	shift: 'move',
	move: function (target, room, user, connection, cmd) {
		if (!this.can('hotpatch')) return false;
		if (!target || !target.trim()) return this.sendReply('|html|/' + cmd + ' <em>User 1</em>, <em>User 2</em> - Moves User 1\'s custom avatar to User 2.');
		target = this.splitTarget(target);
		var avatars = Config.customavatars;
		var user1 = (this.targetUser ? Users.getExact(this.targetUsername).name : this.targetUsername);
		var user2 = (Users.getExact(target) ? Users.getExact(target).name : target);
		if (!toId(user1) || !toId(user2)) return this.sendReply('|html|/' + cmd + ' <em>User 1</em>, <em>User 2</em> - Moves User 1\'s custom avatar to User 2.');
		var user1Av = avatars[toId(user1)];
		var user2Av = avatars[toId(user2)];
		if (!user1Av) return this.sendReply(user1 + ' does not have a custom avatar.');

		if (user2Av) fs.unlinkSync('config/avatars/' + user2Av);
		var newAv = toId(user2) + path.extname(user1Av);
		fs.renameSync('config/avatars/' + user1Av, 'config/avatars/' + newAv);
		delete avatars[toId(user1)];
		avatars[toId(user2)] = newAv;
		if (Users.getExact(user1)) Users.getExact(user1).avatar = 1;
		if (Users.getExact(user2)) {
			delete Users.getExact(user1).avatar;
			Users.getExact(user1).avatar = newAv;
		}

		return this.sendReply(user1 + '\'s custom avatar has been moved to ' + user2);
	}
};

exports.commands = {
	ca: 'customavatar',
	customavatar: cmds,
	shiftavatar: 'moveavatar',
	moveavatar: cmds.move,
	deleteavatar: 'removeavatar',
	removeavatar: cmds['delete'],
	sca: 'setavatar',
	setavatar: cmds.set,
	forcesetavatar: function (target, room, user) {
		return this.parse('/customavatar forceset ' + target);
	}
}
