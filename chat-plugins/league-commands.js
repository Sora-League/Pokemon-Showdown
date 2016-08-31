'use strict';

exports.commands = {
	addsymbols: 'symbols',
	symbols: function (target, room, user) {
		if (!user.can('warn')) this.errorReply('You need to be a league member to be able to use this command.');

		let front = user.name.match(/^∆/) ? '' : '∆'; 
		let back =  user.name.match(/∆$/) ? '' : '∆';
		if (!front && !back) return;
		user.forceRename(front + user.name + back, undefined, true);
		return this.sendReply('Your league symbols have been added.');
	},
	
	site: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox('Here is The Sora League Website:<br />' +
			'- <a href="http://sora.cu.cc/index.html">Sora League Site</a>'
		);
	},
	
	discord: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox('Here is a permanent link to The Sora League\'s Discord server:<br />' +
			'- <a href="https://discord.gg/vYV5dxD">Sora Discord</a>'
		);
	},
	

	priomon: 'priomons',
	priomons: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox('Here is a detailed explanation of the format Priomons:<br />' +
			'- <a href="http://sora.cu.cc/format.html">Priomons</a>'
		);
	},

	incweather: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox('Here is a detailed explanation of the format Inclement Weather:<br />' +
			'- <a href="http://sora.cu.cc/format.html">Inclement Weather</a>'
		);
	},

	pokemonsandbox: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox('Here is a detailed explanation of the format Pokemon Sandbox:<br />' +
			'- <a href=http://sora.cu.cc/format.html">Pokemon Sandbox</a>'
		);
	},

	championschallenge: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox('Here is a detailed explanation of the format Champion\'s Challenge:<br />' +
			'- <a href="http://sora.cu.cc/format.html">Champion\'s Challenge</a>'
		);
	},

	ipl: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox('Here is a link to the International Pokemon League Tournament (IPL):<br />' +
			'- <a href="http://sorapremierleague.weebly.com/">IPL Tournament Web Site</a><br />' +
			'</div>');
	},
	
	gymleaders: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox('Here is a list of Sora League Gym Leaders:<br />' +
			'- <a href="http://sora.cu.cc/leaders.html">Sora League Gym Leaders</a>'
		);
	},

	frontier: 'battlefrontier',
	battlefrontier: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox('<b>Sora Battle Frontier</b><br />' +
			'<i>"Welcome to the Sora Battle Frontier! Challenge us if you Dare."</i> <br />' +
			'<b>Requirements:</b> 8 Badges<br />' +
			'<b>Rules:</b> The Battle Frontier must be challenged after collecting 8 gym badges and 2 normal Frontiers must be defeated to gain access to the Elite 4.<br />' +
			'- The Elite Frontiers can only be challenged once a challenger has 4 different symbols.<br />' +
			'- The Frontier Head can be challenged after deafeating all other Frontier members.<br />' +
			'- If a challenger loses to an Elite Frontier or the Frontier Head, they will randomly lose one Elite symbol and one normal symbol.<br />' +
			'<blink><b>Notes:</b></blink><br />' +
			'- The same frontier may be challenged once every 24 hours.<br />' +
			'- <a href="http://sora.cu.cc/challenge.html">Challenging Rules</a><br />' +
			'<b>Here is a list of Sora League Frontier Brains:</b><br>' +
			'- <a href="http://sora.cu.cc/frontier.html">Sora League Frontier Brains</a>'
		);
	},

	elitefour: 'e4',
	e4: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox('Here is a list of Sora League Elite Four:<br />' +
			'- <a href="http://sora.cu.cc/elite.html">Sora League Elite Four</a>'
		);
	},

	champions: 'champions',
	champions: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox('Here is a list of Sora League Champions:<br />' +
			'- <a href="http://sora.cu.cc/champion.html">Sora League Champions</a>'
		);
	},

	quoteoftheday: 'qotd',
	qotd: function (target, room, user) {
		if (!this.runBroadcast()) return;
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
			'"Chief Akkie, head of the meme police, serving for 38 years; no meme slips through her cracks." -Eska and Desna 14/3/15<br />'
		);
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
			'165.255.119.159 -James357 <br />' +
			'62.209.10.78 -Tails <br />' +
			'108.41.153.97 -heart lady <br />'+
			'Shame on them!');
	},

	donate: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox('<center><font size = 2>If you wish to donate to the server, please click on the button below.<br>' +
			'<a href = "https://www.paypal.com/au/cgi-bin/webscr?cmd=_flow&SESSION=txF-f1lkPkrs1RLQ2TfUzeIXDI176kExf_PLDSQyoUynCjAHc5EIdQTJgPO&dispatch=5885d80a13c0db1f8e263663d3faee8d5c97cbf3d75cb63effe5661cdf3adb6d"><img src = "https://www.paypalobjects.com/en_AU/i/btn/btn_donate_SM.gif"></a><br>' +
			'Remember to mention your username when you leave a note with your donation, or we won\'t know who donated. To all of those who\'ve donated or plan on donating, thank you! We really appreciate it!</center></font><br><br>' +
			'<b>Donation benefits:</b><br>' +
			'<strong>$1 or more:</strong>' +
			'<li>Earns you the Server Donator badge, which will be displayed on your trainer card.' +
			'<li>Allows you to set a custom username colour visible in chats, but not the userlist.<br><br>' +
			'<strong>$5 or more:</strong>' +
			'<li>All of the above^' +
			'<li>A red <span style = "background: rgba(255, 26, 26, 0.5);">userlist highlight color</span>, visible on the Lobby\'s userlist');
	}
};
