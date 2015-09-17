/*Sooo.. here's a small script I made that adds custom avatars.
~SilverTactic*/
var fs = require('fs');
var request = require('request');
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
		try {
			delete require.cache[require.resolve('./config/config.js')];
			global.Config = require('./config/config.js');
			if (global.Users) Users.cacheGroupData();
			console.log('Reloaded config/config.js');
			loadAvatars();
		} catch (e) {}
	});
}

var cmds = {
	'': 'help',
	help: function (target, room, user) {
		if (!this.canBroadcast()) return;
		return this.sendReplyBox('<b>Custom Avatar commands<b><br>' +
			'All commands require ~ unless specified otherwise.<br><br>' +
			'<li>/ca set <small>or</small> /setavatar <em>URL</em> (For normal users) - Sets the user\'s avatar to the specified image link.The user needs to buy this from the shop first.' +
			'<li>/ca set <small>or</small> /setavatar <em>User</em>, <em>URL</em> - Sets the specified user\'s avatar to the specified image link.' +
			'<li>/ca delete <small>or</small> /deleteavatar <em>User</em> - Delete\'s the specified user\'s custom avatar.' +
			'<li>/ca move <small>or</small> /moveavatar <em>User 1</em>, <em>User 2</em> - Moves User 1\'s custom avatar to User 2.' +
			'<li>/ca swap <small>or</small> /swapavatar <em>User 1</em>, <em>User 2</em> - Swaps User 1\'s and User 2\'s custom avatars.'
		);
	},

	add: 'set',
	set: function (target, room, user, connection, cmd) {
		var User;
		if (!this.can('hotpatch')) {
			if (!target || !target.trim()) return this.sendReply('|html|/avatar ' + cmd + ' <em>URL</em> - Sets your custom avatar to the specified image.');
			if (!user.boughtAvatar) return this.sendReply('You need to buy a custom avatar from the shop before using this command.');

			target = target.trim();
			User = user;
		} else {
			if (!target || !target.trim()) return this.sendReply('|html|/avatar ' + cmd + ' <em>User</em>, <em>URL</em> - Sets the specified user\'s custom avatar to the specified image.');
			target = this.splitTarget(target);
			var targetUser = this.targetUser;
			if (!targetUser) return this.sendReply('User ' + this.targetUsername + ' not found. Did you misspell their name?');
			target = target.trim();
			User = targetUser;
		}
		var formatList = ['.png', '.jpg', '.gif', '.bmp', '.jpeg'];
		var format = path.extname(target);
		if (formatList.indexOf(format) === -1) return this.sendReply('The format of your avatar is not supported. The allowed formats are ' + formatList.join(', ') + '.');
		if (target.indexOf('https://') === 0) target = 'http://' + target.substr(8);
		else if (target.indexOf('http://') !== 0) target = 'http://' + target;

		//We don't need to keep the user's original avatar
		if (typeof user.avatar === 'string') fs.unlink('config/avatars/' + user.avatar);
		var self = this;
		request.get(target).on('error', function () {
			return self.sendReply("The selected avatar doesn\'t exist. Try picking a new avatar.");
		}).on('response', function (response) {
			if (response.statusCode == 404) return self.sendReply("The selected avatar is unavailable. Try picking a different one.");
			User.avatar = User.userid + format;
			Config.customavatars[user.userid] = User.avatar;
			var their = (User.userid === user.userid ? User.name + '\'s' : 'Your');
			self.sendReply('|html|' + their + ' custom avatar has been set to <br><div style = "width: 80px; height: 80px; overflow: hidden;"><img src = "' + target + '" style = "max-height: 100%; max-width: 100%"></div>');
			response.pipe(fs.createWriteStream('config/avatars/' + User.userid + format));
		});
		loadAvatars();
	},
	
	'delete': 'remove',
	remove: function (target, room, user, connection, cmd) {
		if (!target || !target.trim()) return this.sendReply('|html|/ca ' + cmd + ' <em>User</em> - Delete\'s the specified user\'s custom avatar.');
		if (!Users.get(target) || !Users.get(target).connected) return this.sendReply('User ' + target + ' is not online. If you still want to delete this user\'s avatar, use the command "forcedelete" instead.');
		target = Users.get(target) ? Users.get(target).name : target;
		if (!Config.customavatars(toId(target))) return this.sendReply('User ' + target + ' does not have a custom avatar.');
		fs.unlink('config/avatars/' + Config.customavatars[toId(target)]);
		delete Config.customavatars[toId(target)];
		this.sendReply(target + '\'s custom avatar has been successfully removed.');
		if (Users.get(target) && Users.get(target).connected) {
			Users.get(target).send('Your custom avatar has been removed.');
			Users.get(target).avatar = 1;
		}
	}
};

exports.commands = {
	ca: 'customavatar',
	customavatar: cmds
}
