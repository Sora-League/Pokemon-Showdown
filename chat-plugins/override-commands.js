'use strict';

function giveGift (user) {
	var file;
	try {
		file = JSON.parse(fs.readFileSync("storage-files/given.json"));
	} catch (err) {
		fs.writeFileSync('storage-files/given.json', '{}');
		file = JSON.parse(fs.readFileSync("storage-files/given.json"));
	}
	var users = ["blazing360"];
	if (user.userid in file || users.indexOf(user.userid) === -1) return;
	file[user.userid] = 1;
	fs.writeFileSync("storage-files/given.json", JSON.stringify(file, null, 1));
	user.popup('|html|<center><h2><font color=#992114>Merry Christmas</font> <font color=#1A3112>and have a</font> <font color=#992114>Happy New Year</font> <font color=#1A3112>from the Sora League!</font></h2><br>' +
		'<img src="http://rs522.pbsrc.com/albums/w348/sunilmsn/present.gif~c200"><br>' +
               	'<b>You have received 5 Bucks! Stay tuned throughout the day for special events for more chances of picking up presents!</b><br>' +
		'<audio controls autoplay src = "https://dl2.pushbulletusercontent.com/EYtKI65FLYuGfJRI1Me8QnVRzgSG89eM/Pok%C3%A9mon%20Christmas%20Medley%202015%20%28Feat-%20Trickywi%29.mp3"></audio><br>' +
                '<font color=#C5A436>GlitchxCity - Pokémon Christmas Medley 2015 (Feat: Trickywi)</font></center>');

}

const fs = require('fs');

exports.commands = {
	uptime: function (target, room, user) {
		if (!this.runBroadcast()) return;
		let uptime = process.uptime(), uptimeText;
		function getUptime(uptime) {
			if (uptime < 24 * 60 * 60) return Chat.toDurationString(uptime * 1000);
			let uptimeDays = Math.floor(uptime / (24 * 60 * 60));
			let uptimeText = uptimeDays + " " + (uptimeDays === 1 ? "day" : "days");
			let uptimeHours = Math.floor(uptime / (60 * 60)) - uptimeDays * 24;
			if (uptimeHours) uptimeText += ", " + uptimeHours + " " + (uptimeHours === 1 ? "hour" : "hours");
			return uptimeText;
		}
		let maxUptime = 'storage-files/maxuptime.txt';
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

		if (Chat.updateServerLock) {
			return this.sendReply("Wait for /updateserver to finish before using /kill.");
		}

		Users.users.forEach(u => {
			Seen.set(u.userid);
		});

		if (!fs.existsSync('storage-files/maxuptime.txt')) fs.writeFileSync('storage-files/maxuptime.txt', process.uptime());
		else if (parseFloat(fs.readFileSync('storage-files/maxuptime.txt')) < process.uptime()) {
			fs.writeFileSync('storage-files/maxuptime.txt', process.uptime());
		}

		for (let i in Sockets.workers) {
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

	joim: 'join',
	j: 'join',
	join: function (target, room, user, connection) {
		if (!target) return false;
		if (user.tryJoinRoom(target, connection) === null) {
			connection.sendTo(target, "|noinit|namerequired|The room '" + target + "' does not exist or requires a login to join.");
		}
		let blacklist = ["dhcp-077-250-225-247.chello.nl", "c-76-100-209-92.hsd1.md.comcast.net", "zenmate",
			"74.88.1.127", "27.122.15.28", "mx-ll-223.205.20-59.dynamic.3bb.co.th", "50-108-108-125.adr01.mskg.mi.frontiernet.net",
			"cpe-67-253-120-124.maine.res.rr.com", "62.140.132.94", "62.140.132.19", "50.84.151.157", "67.164.32.244",
			"117.216.41.194", "CPE-155-143-4-109.vic.bigpond.net.au", "94.254.0.55", "108.61.179.200.vultr.com",
			"ool-4573a317.dyn.optonline.net", "69.115.163.23", "173.30.53.93", "71.41.165.94",
			"bb116-15-8-217.singnet.com.sg", "62.140.132.13", "103-10-199-146.pacswitch.com", "116.14.185.162", "62.209.10.6", "62-209-10-6.wimax.bb.zain.com",
			"122.162.78.223", "abts-north-dynamic-223.78.162.122.airtelbroadband.in", "71.207.119.61", "c-71-207-119-61.hsd1.pa.comcast.net", "122.162.133.188", "abts-north-dynamic-188.133.162.122.airtelbroadband.in"
		];
		for (let i = 0; i < blacklist.length; i++) {
			if (user.latestHost.indexOf(blacklist[i]) > -1 || user.latestIp.indexOf(blacklist[i]) > -1) {
				user.popup('You are on the Sora League banlist or are using a Proxy. GET REKT SON.');
				user.disconnectAll();
			}
		}
	},

	chall: 'challenge',
	challenge: function (target, room, user, connection) {
		target = this.splitTarget(target);
		let targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) {
			return this.popupReply("The user '" + this.targetUsername + "' was not found.");
		}
		if (targetUser.blockChallenges && !user.can('bypassblocks', targetUser)) {
			return this.popupReply("The user '" + this.targetUsername + "' is not accepting challenges right now.");
		}
		if (user.challengeTo) {
			return this.popupReply("You're already challenging '" + user.challengeTo.to + "'. Cancel that challenge before challenging someone else.");
		}
		if (Config.pmmodchat) {
			let userGroup = user.group;
			if (Config.groupsranking.indexOf(userGroup) < Config.groupsranking.indexOf(Config.pmmodchat)) {
				let groupName = Config.groups[Config.pmmodchat].name || Config.pmmodchat;
				this.popupReply("Because moderated chat is set, you must be of rank " + groupName + " or higher to challenge users.");
				return false;
			}
		}
		if (toId(target) == 'leaguebattle') {
			if (!user.can('warn') && !targetUser.can('lock')) return this.popupReply('Only Gym Leaders or higher can be challenged in this format.');
			else if (user.can('warn') && targetUser.can('lock')) return this.popupReply('Only challengers can be challenged in this format.');
		}
		user.prepBattle(Tools.getFormat(target).id, 'challenge', connection).then(result => {
			if (result) user.makeChallenge(targetUser, target);
		});
	}
};
