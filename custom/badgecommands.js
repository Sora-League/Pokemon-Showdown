var badgeList = {
	parasect: ['Parasect', '<img src="http://oi61.tinypic.com/2nkoyyu.jpg" title="Parasect: Founder of Sora">', '<img src = "http://oi61.tinypic.com/2nkoyyu.jpg"'],
	aegislash: ['Aegislash', '<img src="http://i.imgur.com/aJY3eKg.png" title="Aegislash: Winner of a major Sora tournament">', '<img src = "http://i.imgur.com/tXkJKKU.png"'],
	meowth: ['Meowth', '<img src="http://i.imgur.com/WmfgOXf.png" title="Meowth: Server Donator">', '<img src = "http://i.imgur.com/a2X7EY3.png"'],
	golduck: ['Golduck', '<img src="http://i.imgur.com/tMLknqb.png" title="Golduck the Meta Breaker: Reached the Hall of Fame">', '<img src = "http://i.imgur.com/QRSsHWD.png"'],
	starly: ['Starly', '<img src="http://i.imgur.com/zaLhq1k.png" title="Starly: One Year on Sora">', '<img src = "http://i.imgur.com/LiH48HR.png"'],
	staravia: ['Staravia', '<img src="http://i.imgur.com/2UmjiLt.png" title="Staravia Badge: Two Years on Sora">', '<img src = "http://i.imgur.com/keVLipY.png"'],
	staraptor: ['Staraptor', '<img src="http://i.imgur.com/5g3lvwi.png" title="Staraptor Badge: Three Years on Sora">', '<img src = "http://i.imgur.com/JeamPIZ.png"'],
	gym: ['Gym Badge Collector', '<img src="http://i.imgur.com/tnkW9J9.png" title="Gym Badge Collector: Obtained all 18 Gym Badges">', '<img src = "http://i.imgur.com/LlbC6np.png"'],
	e4: ['Elite Four Conqueror', '<img src="http://i.imgur.com/y21ENWF.png" title="Elite Four Conqueror: Cleared the Elite Four">', '<img src = "http://i.imgur.com/u0vyZtn.png"'],
	frontier: ['Frontier Symbol Obtainer', '<img src="http://i.imgur.com/RFkf6oV.png" title="Frontier Symbol Obtainer: Obtained all Frontier Symbols">', '<img src = "http://i.imgur.com/ZMfqdIl.png"'],
	bertha: ['Bertha', '<img src="http://i.imgur.com/MDcdCka.png" title="Bertha Badge: 5 E4 Defends">', '<img src = "http://i.imgur.com/VjFdlzz.png"'],
	koga: ['Koga', '<img src="http://i.imgur.com/2eC21HT.png" title="Koga Badge: 10 E4 Defends">', '<img src = "http://i.imgur.com/DeMzNfU.png"'],
	caitlin: ['Caitlin', '<img src="http://i.imgur.com/fbbyoaR.png" title="Caitlin Badge: 20 E4 Defends">', '<img src = "http://i.imgur.com/Svyy5rD.png"'],
	flannery: ['Flannery', '<img src="http://i.imgur.com/0ScjBhf.png" title="Flannery Badge: 10 Badge Defends">', '<img src = "http://i.imgur.com/rfGR9uC.png"'],
	skyla: ['Skyla', '<img src="http://i.imgur.com/HMGmJ2d.png" title="Skyla Badge: 20 Badge Defends">', '<img src = "http://i.imgur.com/pWm24fS.png"'],
	volkner: ['Volkner', '<img src="http://i.imgur.com/8AQYYZ7.png" title="Volkner Badge: 35 Badge Defends">', '<img src = "http://i.imgur.com/Vobc91V.png"'],
	brock: ['Brock', '<img src="http://i.imgur.com/hMg0cgf.gif" title="Brock Badge: 50 Badge Defends">', '<img src = "http://i.imgur.com/fsyWAdn.gif"'],
	gymrank: ['Gym Leader Rank', '<img src="http://i.imgur.com/ELFPzW8.png" title = "Achieved Gym Leader Status">', '<img src = "http://i.imgur.com/CqLjnZB.png"'],
	e4rank: ['Elite Four Rank', '<img src="http://i.imgur.com/QtECCD9.png" title = "Achieved Elite 4 Status">', '<img src = "http://i.imgur.com/vBBcMc4.png"'],
	frontierrank: ['Frontier Rank', '<img src="http://i.imgur.com/7jbhEJC.png" title="Achieved Frontier Status">', '<img src = "http://i.imgur.com/x9xJbkQ.png"'],
	efrontierrank: ['Elite Frontier Rank', '<img src="http://i.imgur.com/2iZp7Mi.png" title="Achieved Elite Frontier Status">', '<img src = "http://i.imgur.com/x2xEGgc.png"'],
	brandon: ['Brandon', '<img src="http://i.imgur.com/875rXde.png" title="Brandon Badge: 5 Symbol Defends">', '<img src = "http://i.imgur.com/AMlbLMU.png"'],
	lucy: ['Lucy', '<img src="http://i.imgur.com/djszmLN.png" title="Lucy Badge: 10 Symbol Defends">', '<img src = "http://i.imgur.com/vc0HjNg.png"'],
	noland: ['Noland', '<img src="http://i.imgur.com/tNKAuzy.png" title="Noland Badge: 20 Symbol Defends">', '<img src = "http://i.imgur.com/nSP68YI.png"'],
	meme: ['ℳℯღℯ', '<img src="http://i.imgur.com/XWAudeE.gif" title="I\'m a dank memer">', '<img src = "http://i.imgur.com/VG0RWYS.gif"'],
	egg: ['Egg', '<img src="http://i.imgur.com/dLyGYK5.png" title="This user is an egg without trying">', '<img src = "http://i.imgur.com/8vrprMK.png"'],
	porygonz: ['Porygon-Z', '<img src="http://i.imgur.com/bJrRxB8.png" title="Porygon-Z: Broke the server while trying to repair it. Good job mate">', '<img src = "http://i.imgur.com/3iPLvlj.png"'],
	smeargle: ['Smeargle', '<img src="http://i.imgur.com/A8h3FJN.png" title="Smeargle the Creator: Created a work of art for Sora">', '<img src = "http://i.imgur.com/1JYlYS0.png"']
};

var comm = {
	'': 'info',
	info: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<a><center><b><font size= 4>Badges</b></font></center></a><br />' +
			'<b>What are Badges:</b><br />' +
			'Badges are prestigious achievements awarded on the user\'s badge case and might come with a buck reward.<br />' +
			'They are currently awarded for league and community activity and vary in difficulty to achieve.<br />' +
			'A full list of badges can be found <a href="http://sora.cu.cc/badges.html">HERE</a> <br />' +
			'<br />' +
			'<details><summary><b>User\'s Badges</b></center></summary><center><a href="http://soraleague.weebly.com/badges.html#parasect"><img src="http://oi61.tinypic.com/2nkoyyu.jpg" title="Parasect the God Above All"></a><br /></details>' +
			'<br />' +
			'<blink><font color=#FF0000><b>Notes:</b></font></blink><br />' +
			'- Your badges are shown by the command /badgecase<br />' +
			'- You may request for your badges to be shown on your Trainer Card<br />'+
			'<font color=#006600>- <b>Hover over a badge for details <br />' +
			'- Click on a badge for an enlarged image and further information</b></font><br />' +
			'- Test your skills above');
	},

	help: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<strong>Badge commands (Can only be used by Frontier Blade and ~):</strong><br />' +
		'- /badge give or /givebadge <i>User</i>, <i>Badge Name</i> - Gives the specified badge to the specified user. <br />' +
		'- /badge remove or /takebadge <i>User</i>, <i>Badge Name</i> - Removes the specified badge from the specified user. <br />' +
		'- /badge removeall or /removeallbadges <i>User</i> - Removes all of the specified user\'s badges. <br />' +
		'- /badge transfer or /transferbadges <i>User 1</i>, <i>User 2</i> - Moves all of user 1\'s badges to another user, user 2. If user 2 already has badges, this command transfers all badges user 2 does not have. <br />' +
		'- /badges view or /badgecase <i>User</i> - Shows all the badges owned by the user, or the specified user. <br />');
	},
	
	forcegive: 'give',
	award: 'give',
    give: function (target, room, user, connection, cmd) {
        if (!this.can('hotpatch')) return this.sendReply('Only Frontier Blade and Admins can give badges.');
        target = target.split(",");
		var targetUser = target[0].trim();
        var badge = toId(target[1]);
        if (!badge || !toId(targetUser)) return this.sendReply('|raw|/badge ' + cmd + ' <i>User</i>, <i>Badge Name</i> - Gives a specified user the specified badge.');
        if ((!Users.get(targetUser) || !Users.get(targetUser).connected) && cmd !== 'forcegive') return this.sendReply('The user \'' + targetUser + '\' was not found. If you would still like to give this user a badge, use /forcegivebadge or /badge forcegive instead.');
        badge.replace(/badge/g, '');
        
		var name = (Users.getExact(targetUser) ? Users.getExact(targetUser).name : targetUser);
        if (!(badge in badgeList)) return this.sendReply('That is not a valid badge.');
		if (Core.read('badges', toId(targetUser), badge)) return this.sendReply(name + ' already has the ' + badgeList[badge][0] + ' badge!');
        Core.write('badges', toId(targetUser), badgeList[badge][1], null, badge);
        if (Users.get(targetUser) && Users.get(targetUser).connected && cmd !== 'forcegive') {
			//I didn't feel very creative while making this. Not that I do even otherwise though
            Users.get(targetUser).popup('|html|<center><h3>Congratulations! You have earned the ' + badgeList[badge][0] + ' Badge!</h3><br>' +
				badgeList[badge][2] + ' width="200" height="200"><br>' + 
				'<audio controls autoplay src = "https://dl.pushbulletusercontent.com/bzHXO5J6rNUigY3uwx1bNx4jzE7kXHfJ/megastone.mp3"><br>');
        }
        this.sendReply('You have successfully given ' + name + ' the ' + badgeList[badge][0] + ' Badge.');
    },
	
	remove: 'take',
	take: function (target, room, user, connection, cmd) {
		if (!this.can('hotpatch')) return this.sendReply('Only Frontier Blade and Admins can remove badges.');
        target = target.split(",");
		var targetUser = target[0].trim();
        var badge = toId(target[1]);
        if (!badge || !toId(targetUser)) return this.sendReply('|raw|/badge ' + cmd + ' <i>User</i>, <i>Badge Name</i> - Removes a specified badge from the specified user.');
        badge.replace(/badge/g, '');
		
		if (!(badge in badgeList)) return this.sendReply('That is not a valid badge.');
		var name = Users.getExact(targetUser) ? Users.getExact(targetUser).name : targetUser;
		if (!Core.read('badges', toId(targetUser))) return this.sendReply("User " + name + " doesn't have any badges.");
		if (!Core.read('badges', toId(targetUser), badge)) return this.sendReply(name + " doesn't have the " + badgeList[badge][0] + " badge.");
		
		Core.Delete('badges', toId(targetUser), badge);
		if (Users.get(name) && Users.get(name).connected) Users.get(name).send('The ' + badgeList[badge][0] + ' badge has been removed from you.');
		this.sendReply('You have successfully removed the ' + badgeList[badge][0] + ' badge from ' + name + '.');
	},
	
	removeall: 'takeall',
	'delete': 'takeall',
	takeall: function (target, room, user, connection, cmd) {
		if (!this.can('hotpatch')) return this.sendReply('Only Frontier Blade and Admins can remove badges.');
        if (!toId(target)) return this.sendReply('|raw|/badge ' + cmd + ' <i>User</i> - Removes all badges from the specified user.');
		var name = Users.get(target) ? Users.get(target).name : target.trim();
		if (!Core.read('badges', toId(target))) return this.sendReply("User " + name + " doesn't have any badges.");
		if (!user.confirm) {
			user.confirm = true;
			this.sendReply('WARNING: You are about to delete ALL of ' + name + '\'s badges. If you\'re sure you want to do this, use this command again.');
		} else {
			Core.Delete('badges', toId(target));
			this.sendReply('You have successfully removed all badges from ' + name + '.');
			if (Users.get(name)&& Users.get(name).connected) Users.get(name).send('All of your badges have been removed.');
			user.confirm = false;
		}
	},
	
	move: 'transfer',
	transfer: function (target, room, user, connection, cmd) {
		if (!this.can('hotpatch')) return this.sendReply('Only Frontier Blade and Admins can remove badges.');
        if (!toId(target)) return this.sendReply('|raw|/badge ' + cmd + ' <i>User 1</i>, <i>User 2</i> - Moves all of user 1\'s badges to user 2. If user 2 already has badges, this command transfers all badges user 2 does not have.');
		target = target.split(',');
		var user1 = (Users.getExact(target[0]) ? Users.getExact(target[0]).name : target[0].trim());
        var user2 = (Users.getExact(target[1]) ? Users.getExact(target[1]).name : target[1].trim());
        if (user1 === user2) return this.sendReply("You can't transfer badges between the same user.");
		
		var user1Badges = Core.read('badges', toId(user1));
		var user2Badges = Core.read('badges', toId(user2));
		if (Object.keys(user1Badges).length < 1) return this.sendReply("User " + user1 + " doesn't have any badges to transfer.");
		if (!user2Badges || !Object.keys(user2Badges).length) {
			var list = Core.read('badges', toId(user1));
			Core.write('badges', toId(user2), list);
			Core.Delete('badges', toId(user1));
		} else {
			for (var i in user1Badges) {
				if (user2Badges[i]) continue;
				user2Badges[i] = user1Badges[i];
			}
			Core.write('badges', toId(user2), user2Badges);
			Core.Delete('badges', toId(user1));
		}
		return this.sendReply(user1 + '\'s badges have successfully been transferred to ' + user2);
	},
	
	display: 'show', 
	view: 'show',
	show: function (target, room, user, connection, cmd) {
		if (!this.canBroadcast()) return;
		if (!toId(target)) target = user.userid;
		var file = Core.read('badges', toId(target));
		target = Users.getExact(target) ? Users.getExact(target).name : target;
		if (!file) return this.sendReplyBox(target + " doesn't have any badges...");
		var list = target + '\'s Badges:';
		if (this.broadcasting) list = '<summary>' + list + '</summary>';
		else list += '<br/>';
		for (var i in file) {
			list += file[i] + ' ';
		}
		if (this.broadcasting) return this.sendReplyBox('<details>' + list + '</details>');
		this.sendReplyBox(list);
	}
};
        
exports.commands = {
	badge: 'badges',
	badges: comm,
	givebadge: comm.give,
	forcegivebadge: function (target, room, user) {
		this.parse('/badge forcegive ' + target);
	},
	takebadge: 'removebadge',
	removebadge: comm.take,
	removeallbadges: comm.takeall,
	transferbadges: 'movebadges',
	transferbadge: 'movebadges',
	movebadge: 'movebadges',
	movebadges: comm.transfer,
	badgecase: 'viewbadges',
	viewbadges: comm.show
};
