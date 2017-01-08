'use strict';

exports.commands = {
	christmasmessage: function (target, room, user, connection, cmd) {
		user.popup('|html|<center><h1><font color=#c6432b>2016, What a year!</font></h1><br><br>'+
			'It all started with a gorilla and from there it all went downhill...<br><br><br>'+
			'<center><audio controls autoplay src = "https://dl2.pushbulletusercontent.com/PhdUwVZMKdkqgWEkC4YGP3o8j5aQfbmd/Michael%20Giacchino%20-%20Jyn%20Erso%20&%20Hope%20Suite%20%28From%20Rogue%20One-%20A%20Star%20Wars%20Story-Audio%20Only%29.mp3"></audio><br>'+
                	'<font color=green>Michael Giacchino - Jyn Erso & Hope Suite (From "Rogue One: A Star Wars Story")</font></center><br>5 Minutes Read<br><br><br>'+
			'<img src="https://img.pokemondb.net/sprites/ruby-sapphire/normal/parasect.png"><br><h3>Year in Review</h3><br>'+
			'Wow what a damm long year it has been and thank god it\'s about to end. Lets have a quick look back on 2016!<br>'+
			'We moved into the whole renaming process of become Sora.psim.us a little more than a year ago and this was only scratching the surface. The entire server was redesigned from the base code upwards with the help of Silvy and also Tempy who by himself redisgned our new site not once but twice!!! <br><br>'+
			'We have had a bunch of new members move in a lot of old ones move out but that\'s the nature of online gaming, we all have a real life to get to once we\'re done with the nightly grind.<br></center><br>'+
			'<ul><li>I would like to firstly congratulate Bart on moving into a new part of life and also thank him for running the Frontier and Champion for 3 years now. That\'s an achievement in itself.</li><br>'+
			'<li>Secondly Silvy! Wow I will honestly say I will have no idea where the server will be today without the help of you. Seriously I can\'t thank you enough for your help throughout this year from teaching me the basics of running the server to fixing the various issues that comes up when we merge with main as an example. Congratulations again for making it to university and without you teaching me stuff, the second you resigned would\'ve actually been the death of Sora!</li><br><br>'+
			'<li>Thirdly, but obviously not the least, Tempy. May Parasect bless your artworks forever. Holy smokes they get better and better every single damm time. Thank You, Thank You and THANK YOU again and again for constantly updating the site of ours and making it look damm professional. (I hated weebly so much) You keep delivering man, site after site, artwork after artwork. You don\'t get much out of it so I appreciate every single piece of work you do!!! I owe you a drink when I see you</li><br><br></ul>'+
			'Shout out to my boi Noah for keeping the server paid for, Risu for constantly fixing up that spreadsheet, Neith for just being the sickest cunt, Onyx for actually being the realserverkun and Jeratt for your constant enthusiasm!<br>'+
			'A quick callout to Zach, Meows and Float for being OG and completing your battles monthly, every damm month!<br><br>'+
                	'To the rest of Sora, thanks for being on this wild ride of 2016. I couldn\'t have possibly listed everyone or you\'ll be spending more than 5minutes reading this! Strap yourself in cause 2017 is gonna be a big one and it all starts with a GEN 7 E4 TOUR!!!<br><br><br><br>'+
                
		'<center><img src="https://img.pokemondb.net/sprites/black-white/normal/victini.png"><br><b>Personal Statement</b><br><br>'+
		'It\'s been a long one for me, I started this year with a month and a half long hiatus from Showdown, since I was on holidays overseas. That literally feels like it happened 3 years ago. The year has been a long one but it has also been very fast as well. I started university and you know I\'m now casually 9k in debt but it was worth every cent for me.<br><br>'+
		'I started this job as a fun thing to do on lazy Sunday nights 2.5 years ago and now it has turned into a thing I do full time to make sure the server is running. Wow I have come far but I still don\'t understand half the bullshit showdown has. I want to quickly apologise to all those people I\'ve promised to put something or consider something for the server, I still have your ideas on a list but there will be no more promises I\'ll make in 2017.<br>'+
		'Development on the server has been slowed down since I\'m well in (33% done) my degree and against the odds I also have a job in Sydney! I\'ve been keeping the server in a stable mode for the past year and development for any new commands or games will come slowly as I find time to code for fun. I feel that the Showdown project I\'ve started on 2.5 years ago has taught me heaps of things, especially being grateful for the works that developers do. In my very own opinion, everyone should learn how to code in their life. It\'s like learning how to use a damm calculator, you don\'t have to be great at it but just understand the process a computer takes to execute the many things it processes.<br><br>'+
		'I\'ll be around in 2017 for sure but right now I can\'t promise how long I can keep at it, this year alone has nearly killed me and it doesn\'t get any easier from here onwards. To everyone that has helped me in the past year, I would like to extend a thank you for making life that one line of code easier. It\'s been such a rush of a year for me and at the end of the day like right now (I just finished a Christmas Eve shift in retail (3 nights in a row)) and I\'ll be sitting behind my MBP at home bringing the server up to date. This is something I did for fun and I still do for fun and let me tell you, it beats talking to customers. You guys are what makes this job feel like a past time hobby. It\'s all worth it at the end of the day to find everyone having as much fun as possible with HEAT™ teams.<br><br>'+
		'A quick reflection on other things that happened this year, we got a whole new generation of Pokemon! We took over the world with Pokemon GO!!! Finally, we got a new Star Wars!!! (GO SEE IT IF YOU HAVEN\'T)<br>'+
		'<center><img src="http://i.imgur.com/pzs0IOZ.jpg" width="500"></center><br>'+
		'I\'ve also attached 10 Bucks for everyone here for sitting through my mind piece. Did someone here on Sora make your year in 2016? Why are you still sitting there then? Send them a PM or a /tell to let them know, spread the love cause it\'s Christmas!!!<br><br>'+

	'<center><b>Merry Christmas Everyone, Thanks for sticking with us for another year. Have a lovely holiday, spend some time with your family and also some time with your online one as well. Have an absolute blast of a New Year Eve cause this year is about to be officially fucking over</b></center><br>'+
	'- From Sora Blade and on behalf of the Sora League\'s Administration Team.');
		
	},
		
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
			'<center><a href="http://soraleague.github.io/"><button style="box-shadow: 0px 0px 5px #D43F3A, 0px 0px 10px #D43F3A, 0px 0px 15px #D43F3A; width: 75px; height: 40px; margin: 5px; cursor: pointer; border-radius: 10px; border: 1px solid #d43f3a; font-weight: bold; background: linear-gradient(#ff6060, #d63633, #ff6060); color: white">Our Site</button></a></center>'
		);
	},
	
	discord: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox('Here is a permanent link to The Sora League\'s Discord server:<br />' +
			'- <a href="https://discord.gg/vYV5dxD">Sora Discord</a>'
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
			'- <a href="http://soraleague.github.io/leaders.html">Sora League Gym Leaders</a>'
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
			'- <a href="http://soraleague.github.io/challenge.html">Challenging Rules</a><br />' +
			'<b>Here is a list of Sora League Frontier Brains:</b><br>' +
			'- <a href="http://soraleague.github.io/frontier.html">Sora League Frontier Brains</a>'
		);
	},

	elitefour: 'e4',
	e4: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox('Here is a list of Sora League Elite Four:<br />' +
			'- <a href="http://soraleague.github.io/elite.html">Sora League Elite Four</a>'
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
		        '119.74.153.20 -Dexio/NewEmpire <br/>'+
		        '93.44.60.158 - No woman can beat me guy <br/>'+
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
	},
};

         e4teams: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox('Elite 4 Tour Teams, not viewable without permission:<br />' +
			'- <a href="https://docs.google.com/spreadsheets/d/1SYBIGWpszzgk97IAA5RueL_ABe4F5Vyeo3n8GVO_cEg/edit#gid=1887440986">Sora League Gym Leaders</a>'
		);
	}
