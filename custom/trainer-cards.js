function seen (user) {
	user = toId(user);
	if (Users.get(user) && Users.get(user).connected) return '';
	return '<b>Last Seen:</b> ' + Core.getLastSeen(user).split(', ')[0] + ' ago';
}
function getBadges (user) {
	var badgeList = JSON.parse(require('fs').readFileSync('storage-files/badges.json'));
	user = toId(user);
	if (!badgeList[user] || Object.keys(badgeList[user]).length < 3) return '';
	var total = '<details><summary><b>Badges:</b> (Click here to open)</summary>';
	for (var i in badgeList[user]) {
		total += badgeList[user][i];
	};
	return total + '</details>';
}

exports.commands = {
	staff: 'leaguemembers',
	attendance: 'leaguemembers',
	leaguemembers: function (target, room, user) {
		if (!this.canBroadcast()) return;
		var total = '<table><tr><th>User</th><th>Last Seen</th></tr>';
		var list = ['∆Champiön Nöah∆', '∆Chаmpion Bart∆', '∆FrontierHead Risu∆', 'OnyxEagle', 'Blazing360', '∆Coach Abadon∆', 'Bamdee', '∆Frontier Jerattata∆', '∆Frontier Neith∆'];
		for (var i = 0; i < list.length; i++) {
			var Seen = Users.get(list[i]) && Users.get(list[i]).connected ? '<font color = "green">Online</font>' : seen(list[i]).substr(18);
			if (Seen === 'never') Seen = '<font color = "red">Never</font>';

			total += '<tr><td>' + list[i] + '</td><td><center>' + Seen + '</center></td>';
		}
		this.sendReplyBox('<center><b>Admin Team</b><br />' + total + '</table></center>');
		var total = '<table><tr><th>User</th><th>Last Seen</th></tr>';
		var list = ['∆E4 Edge∆', '∆E4 Terror∆', '∆E4 Silvy∆', '∆E4 Barney∆', '∆Frontier Asch∆', '∆Frontier∆ Srewop', '∆Frontier Meows∆'];
		for (var i = 0; i < list.length; i++) {
			var Seen = Users.get(list[i]) && Users.get(list[i]).connected ? '<font color = "green">Online</font>' : seen(list[i]).substr(18);
			if (Seen === 'never') Seen = '<font color = "red">Never</font>';

			total += '<tr><td>' + list[i] + '</td><td><center>' + Seen + '</center></td>';
		}
		this.sendReplyBox('<details><summary><b>Elite 4\'s and Frontiers</b></summary><center>' + total + '</table></details></center>');
		var total = '<table><tr><th>User</th><th>Last Seen</th></tr>';
		var list = ['∆Gym Ldr Float∆', 
			'∆Gym Ldr Mark∆', '∆Gym Ldr Core∆', '∆Gym Ldr Waffles∆', '∆Gym Ldr SolarWolf∆', '∆Gym Ldr You∆',
			'∆Gym Ldr Mitsuka∆', '∆Gym Ldr BK∆', '∆Gym Ldr ArthurZH∆', '∆Gym Ldr Zoro∆', '∆Gym Ldr Bigo∆', '∆Gym Ldr. Elodin∆', '∆Gym Ldr Alcor'
		];
		for (var i = 0; i < list.length; i++) {
			var Seen = Users.get(list[i]) && Users.get(list[i]).connected ? '<font color = "green">Online</font>' : seen(list[i]).substr(18);
			if (Seen === 'never') Seen = '<font color = "red">Never</font>';

			total += '<tr><td>' + list[i] + '</td><td><center>' + Seen + '</center></td>';
		}
		this.sendReplyBox('<details><summary><b>Gym Leaders</b></summary><center>' + total + '</table></details></center>');
	},

	/////////////////////
	//Admin Team
	////////////////////


	bart: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<a><font size= 4><center><b><font color = 07e1ed>∆Champion Bart∆</font></b></center></a><br />' +
			'<center><i>"Sometimes I look at the bright blue sky and say to myself \'I FUCKED UP, I FUCKED UP\' "</i></center> <br />' +
			'<b>Ace:</b> Weavile<br />' +
			'<b>Battle Rules:</b> <br/>' +
			'-Ubers Battle <br/>' +
			'-At least 2 must be tiered lower than OU <br/>' +
			'-No Lowering opponents stats (Unless caused by attack) <br/>' +
			'-No Pokemon with a base stat over 130<br />' +
			'<center><img src="http://sprites.pokecheck.org/i/461.gif"> <img src="http://i1280.photobucket.com/albums/a482/Skarmory11/Misc%20sprites/Bart_zps03ad3a7d.png"><img src="http://play.pokemonshowdown.com/sprites/xyani/torterra.gif"></center>' +
			'<center><img src="http://oi62.tinypic.com/14cfyh0.jpg"></center> <br />');
	},

	noah: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<a><font size= 4><center><b><font color = 430747>∆Champion Noah∆</font></b></center></a><br />' +
			'<center><i>"Need a Champion? I Noah guy."</i></center> <br />' +
			'<center><img src="http://sprites.pokecheck.org/i/134.gif"><img src="http://i.imgur.com/iu4Njdf.png"></center><br />' +
			'<b>Ace:</b> All <br />' +
			'<b>Battle Rules:</b> <br/>' +
			'-Ubers <br/>' +
			'<center><img src="http://oi62.tinypic.com/14cfyh0.jpg"></center> <br />');
	},

	onyx: 'onyxeagle',
	onyxeagle: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<a><font face = forte><font color =  b27300><font size= 5><center>∆OnyxEagle∆</center></font></a><br />' +
			'<center><i>"Heads or Tails? Heads, I Win; Tails, you Lose"</i></center> <br />' +
			'<b>Skilled in:</b> Rock types/ Ubers, Random Battle and OU to a certain degree.<br />' +
			'<b>History:</b> 2nd Champion of New Sora. One of the 2 people who resurrected Sora from the rubbles. <br/>' +
			'<b>Notes:</b> Resident coder of Sora, still conducts tests and registrations, offers advice. <br/>' +
			'<img src="http://play.pokemonshowdown.com/sprites/xyani/kabutops.gif"> <img src="http://play.pokemonshowdown.com/sprites/xyani/landorus.gif"> <img src="http://play.pokemonshowdown.com/sprites/xyani/heracross-mega.gif"> <img src="http://play.pokemonshowdown.com/sprites/xyani/tyranitar.gif"> <img src="http://play.pokemonshowdown.com/sprites/xyani/tyrantrum.gif">' +
			'<center><img src="http://oi62.tinypic.com/14cfyh0.jpg"></center> <br />');
	},

	risu: 'ninjarisu',
	ninjarisu: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<a><font size= 4><center><b>∆Frontierhead Ninjarisu∆</b></center></a><br />' +
			'<i>"I will show you the power of the best of the worst"</i> <br />' +
			'<b>Ace:</b> Pachirisu<br />' +
			'<b>Symbol:</b> Puny Symbol<br />' +
			'<b>Rules:</b> <a href="http://www.smogon.com/forums/threads/oras-fu-winner-of-omotm-machoke-sticky-web-banned.3519286/">FU</a> <br />' +
			'<details><summary><b>Badges: (Click here to open)</b></summary><br />' +
			'<a href="http://soraleague.weebly.com/badges.html#ldr"><img src="http://i.imgur.com/ELFPzW8.png" title="Achieved Gym Leader Status"></a><a href="http://soraleague.weebly.com/badges.html#frontier"><img src="http://i.imgur.com/7jbhEJC.png" title="Achieved Frontier Status"></a><a href="http://soraleague.weebly.com/badges.html#e4"><img src="http://i.imgur.com/QtECCD9.png" title="Achieved Elite 4 Status"></a><a href="http://soraleague.weebly.com/badges.html#starly"><img src="http://i.imgur.com/zaLhq1k.png" title="Starly Badge: One  Year on Sora"></a><a href="http://soraleague.weebly.com/badges.html#staravia"><img src="http://i.imgur.com/2UmjiLt.png" title="Staravia Badge: Two Years on Sora"></a><a href="http://soraleague.weebly.com/badges.html#smeargle"><img src="http://i.imgur.com/A8h3FJN.png" title="Smeargle the Creator: Helped develop Champion\'s Challenge and Inclement Weather Metagames"></a></details><br />' +
			'<img src="http://play.pokemonshowdown.com/sprites/xyani/pachirisu.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/unown-romeo.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/unown-india.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/unown-sierra.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/unown-uniform.gif"><img src="http://play.pokemonshowdown.com/sprites/xyani/pachirisu.gif">' +
			'<center><img src="http://oi62.tinypic.com/14cfyh0.jpg"></center><br />');
	},

	//////////////
	//Elite Four
	//////////////

	silvy: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('∆E4 <b>Silvy</b>∆<br />' +
			'<i>"Silvy-Chan at your service, here to steel the kill. My body is regi. So come at me, if you will~ ;)"</i> <br />' +
			'<b>Type: <font color = 5e6664>Steel</font></b><br />' +
			'<b>Ace:</b> None <br />' +
			'<b>Battle Rules:</b> <br/>' +
			'- None<br />' +
			seen('e4silvy') + 
			getBadges('siiilver'));
	},

	edge: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('∆E4 <b>Edge</b>∆<br />' +
			'<i>"How can you face your problem when your problem is your face?"</i> <br />' +
			'<b>Type: <font color = ff00b6>Psychic</font></b><br />' +
			'<b>Ace:</b> Victini<br />' +
			'<b>Battle Rules:</b><br />' +
			'-No Hazards<br />' + 
			seen('e4edge') +
			getBadges('e4edge'));
	},


	
	terror: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('∆E4 <b>Terror</b>∆<br />' +
			'<i>"Water you talking about? My new type shall be enough to take you down."</i> <br />' +
			'<b>Type: <font color = A64000>Ground</font></b><br />' +
			'<b>Ace:</b> Excadrill<br />' +
			'<b>Battle Rules:</b><br />' +
			'-None<br />' + 
			seen('e4terror') +
			getBadges('e4terror'));
	},
	
	barney: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('∆E4 <b>Barney</b>∆<br />' +
			'<i>"This battle is gonna be Legen...wait for it...dary."</i> <br />' +
			'<b>Type: <font color = 230077>Dragon</font></b><br />' +
			'<b>Ace:</b> Goodra<br />' +
			'<b>Battle Rules:</b><br />' +
			'-No hazards<br />' + 
			seen('e4barney') +
			getBadges('e4barney'));
	},
	/*sube4: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center>Sub E4 Position: <b><font color = FF0000>Offline</font></b></center><br />'+
		'Sub E4 <b>???</b> <br />'+
		'<b>Type:</b> <b><font color = 006b0a>???</font></b><br />'+
		'<b>Battle Rules:</b> <br />'+
		'-??? <br />'+
		'-??? <br />');
        },*/

	/////////////
	//Frontiers
	/////////////
	
	abadon: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><font size = 3><b>∆Coach Abadon∆<b></font><br>' +
			'<i>"SWIGGITY SWOOTY I\'M COMING FOR THAT BOOTY"</i><br><br>' +
			'<b>Achievements:</b>' +
			'<li>Sora\'s best Ghost and Ground E4' + 
			'<li>Sora\'s coach' + 
			'<li>All round top bloke<br>' +
			'<img style = "margin: 5px" src = "http://128.199.160.98:8000/avatars/' + Config.customavatars.coachabadon + '">' +
			'<div style = "display: inline-block; width: 100px; height: 100px; background: url(http://www.pkparaiso.com/imagenes/xy/sprites/animados/gengar-3.gif) no-repeat -50px -70px"></div><br>' +
			'<audio controls src = "https://dl.pushbulletusercontent.com/W9wf3ZGqXSIHvgVbdUtbl9PrWnPTl9SQ/deep.mp3" style = "color: black; width: 100%; border-radius: 0px;"></audio>'
			+ getBadges('coachabadon') +'<br><img src="http://oi62.tinypic.com/14cfyh0.jpg"></center>');
	},

	asch: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('∆Elite Frontier <b>Asch</b>∆<br />' +
			'<i>"Chief Akkie, head of the meme police, serving for 38 years; no meme slips through her cracks."</i> <br />' +
			'<b>Symbol:</b> White Knight Symbol<br />' +
			'<b>Ace:</b> Crawdaunt <br />' +
			'<b>Battle Rules:</b> <br/>' +
			'-Only BL, BL2, BL3 and BL4 Pokemon may be used.<br/>' +
			'-No Mega Evolution<br />' +
			seen('frontierasch') + '<br/>' +
			'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/bulbasaur-3.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/bulbasaur-3.gif">' +getBadges('frontierasch'));
	},

	blade: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<details><summary>This Frontier is currently on leave, Champion Bart is currently substituting this position, please contact him for a battle in "BH NU" with a species clause. P.s click me I have a sexy card</summary><a><center><img src="http://sprites.pokecheck.org/i/494.gif"><b><font color = FF0000 size= 4>∆Fröntier∆Blade☯</font></b><img src="http://sprites.pokecheck.org/i/080.gif"></center></a><br />' +
			'<center><i>"Be Stronger Than Your Strongest Excuse"</i></center> <br />' +
			'<b>Symbol:</b> Yin and Yang <br />' +
			'<b>Ace:</b> Mybro (Slowbro) <br />' +
			'<b>Battle Rules:</b> <br />' +
			'-Ability Shift Tier<br />' +
			'-No Johns<br />' +
			'<a href="http://www.smogon.com/forums/threads/ability-shift.3503100/">How Ability Shift works</a> <br />' +
			'<a href="http://www.psypokes.com/lab/abilities.php">Pokemon Ability List</a> <br />' +
			'<details><summary><b>Champion\'s Challenge Rules:</b></summary> <br />' +
			'-NU Monotype<br />' +
			'-R U Too Strong?</details><br />' +
			'<details><summary><b>Badges: (Click here to open)</b></summary><br />' +
			'<a href="http://soraleague.weebly.com/badges.html#ldr"><img src="http://i.imgur.com/ELFPzW8.png" title="Achieved Gym Leader Status"></a><a href="http://soraleague.weebly.com/badges.html#frontier"><img src="http://i.imgur.com/7jbhEJC.png" title="Achieved Frontier Status"></a><a href="http://soraleague.weebly.com/badges.html#efrontier"><img src="http://i.imgur.com/2iZp7Mi.png" title="Achieved Elite Frontier Status"></a><a href="http://soraleague.weebly.com/badges.html#starly"><img src="http://i.imgur.com/zaLhq1k.png" title="Starly Badge: One  Year on Sora"></a><a href="http://soraleague.weebly.com/badges.html#porygon"><img src="http://i.imgur.com/bJrRxB8.png" title="Broke the server while trying to repair and implement new features, good job mate, now go fix it"></a><a href="http://soraleague.weebly.com/badges.html#smeargle"><img src="http://i.imgur.com/A8h3FJN.png" title="Smeargle the Creator: Creator of the Badge System"></a></details> <br />' +
			'<details><summary><font color = 009900><center><b>Torkoal Shrine</b></center></font></summary><center><img src="http://play.pokemonshowdown.com/sprites/xyani-shiny/torkoal.gif"></center>' +
			'<center><b>R.I.P. War Turtle</b></center> <br />' +
			'<center>1st Apostle of the All Mighty Lord Parasect</center></details><br />' +
			'<center><img src="http://oi62.tinypic.com/14cfyh0.jpg"></center> <br /></details>');
	},

	meows: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('∆Frontier <b>Meows</b>∆<br />' +
			'<i>"Abs=Win"</i> <br />' +
			'<b>Symbol: </b>Patience <br />' +
			'<b>Ace:</b> Quagsire<br />' +
			'<b>Battle rules:</b> <br />' +
			'-OU<br />' +
			'-No Trick/Switcheroo <br />' + seen('frontiermeows') + getBadges('frontiermeows'));
	},

	silver: "siiilver",
	siiilver: function (target, room, user) {
		if (!this.canBroadcast()) return;
		var colorify = function (text) {
			var colors = ['red', 'orange', 'yellow', 'lime', '#007fff', 'cyan', '#9800ff', 'violet'], set = [];
			for (var i = 0, j = 0; i < text.length; i++) {
				set.push(text[i].trim() ? '<span style = "color: ' + colors[j] + '; text-shadow: 0px 0px 10px;">' + text[i] + '</span>' : text[i]);
				if (!text[i].trim()) continue;
				if (j === colors.length - 1) j = 0;
				else j++;
			}
			return set.join('');
		}
		var msg;
		if (Users.get('siiilver') && Users.get('siiilver').connected) {
			msg = '<button name = "send" value = "/me flips cash at Silvy-chan :D" style = "margin: 3px; transform: skewX(-30deg); text-shadow: 0px 0px 5px; border: 1px solid gold; background: black;"><div style = "transform: skewX(30deg)"><b>' + colorify('$$$ Click 2 flip cash at me! $$$') + '</b></span></button><br>' +
				'<button name = "send" value = "/me pets Silvy-chan :3" style = "margin: 3px; color: silver; transform: skewX(-30deg); text-shadow: 0px 0px 5px; border: 1px solid gold; background: black;"><div style = "transform: skewX(30deg)"><b>' + colorify('Pet me') + ' :3</b></span></button>' +
				' <button name = "send" value = "/kick ' + Users.get('siiilver').name + ', 2sexy4us" style = "margin: 3px; color: silver; transform: skewX(-30deg); text-shadow: 0px 0px 5px; border: 1px solid gold; background: black;"><div style = "transform: skewX(30deg)"><b>' + colorify('Kick me') + ' :D</b></span></button>';
		} else msg = '<span style = "color: gold; text-shadow: 0px 0px 5px">Last seen in da hood <b>' + colorify(Core.getLastSeen('siiilver') + ' ago') + '</b></span><br>';
		this.sendReply('|html|<center><div style = "border-radius: 7px; padding: 5px; box-shadow: 2px 2px 5px black; background: radial-gradient(circle, #1c1c1c, #333232, #1c1c1c, #333232, #1c1c1c, #333232);">' +
			'<b style = "font-size: 17pt;">' + colorify('☆☆☆☆☆☆☆☆ S I I I L V E R ☆☆☆☆☆☆☆☆') + '</b><br>' +
			'<i><span style = "color: silver; text-shadow: 0px 0px 5px;">"Not all heroes wear capes... Some like me wear just underwear :D"</span></i><br>' +
			'<br><div style = "display: inline-block; width: 49%"><img style = "max-height: 100%; max-width: 100%;" src = "http://data.whicdn.com/images/56986059/large.gif"></div> ' +
			'<div style = "display: inline-block; width: 49%"><img style = "max-height: 100%; max-width: 100%;" src = "http://i.skyrock.net/1358/86461358/pics/3227855009_1_10_BQlwaOHj.gif"></div><br>' +
			msg + '<br><span style = "text-shadow: 0px 0px 5px"><b>' + colorify('Known 4:') + '</b>' +
			'<span style = "color: silver; text-shadow: 0px 0px 5px"><li>Being a verr verr gud chat presence and being an inspiration to eberywun around~' +
			'<li>Breaking the server. Cuz Server-Kun\'s dense af</span><br>' +
			(user.userid in {'siiilver':1, 'e4silvy':1, 'theh':1} ? '' : '<br><span style = "text-shadow: 0px 0px 5px"><b><span style = "color: lime;">P</span><span style = "color: blue;">.</span><span style = "color: cyan;">S</span><span style = "color: violet;">.</span></b>- <span style = "color: silver">' + user.name + '\'s a n00b</span></span><br>') +
			'<br><span style = "color: gold">' + getBadges('siiilver').replace('<b>Badges:</b> (Click here to open)', '<b> ' + colorify('Badges:') + '</b> ' + colorify('(Click here to open)'))
		);
	},

	srewop: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('∆Elite Frontier <b>Srewop</b>∆<br />' +
			'<i>"You came to the wong place if you wanted a win."</i> <br />' +
			'<b>Symbol:</b> SumTingWong<br />' +
			'<b>Ace:</b> Golbat <br />' +
			'<b>Battle Rules:</b> <br/>' +
			'-RU Monotype <br/>' +
			'-No Hazards <br/>' +
			'-No Knock off<br />' +
			'-No Megas<br />' +
			seen('frontiersrewop') + '<br/>' +
			'<center><img src="http://play.pokemonshowdown.com/sprites/xyani/zubat.gif"><img src="http://play.pokemonshowdown.com/sprites/xyani/golbat.gif"><img src="http://play.pokemonshowdown.com/sprites/xyani/zubat.gif"><img src="http://play.pokemonshowdown.com/sprites/xyani/gengar.gif"></center> <br />');
	},

	jerattata: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('∆Frontier <b>Jerattata</b>∆<br />' +
			'<i>"Decide which of the two options is harder, and do the other. You might enjoy the battle."</i> <br />' +
			'<b>Symbol:</b> Ultimatum <br />' +
			'<b>Ace:</b> All<br />' +
			'<b>Battle rules:</b> <br />' +
			'-Challenger picks either a Tier/Meta <b>or</b> Battle Rule (within reason) <br />' +
			'-Jeratt picks either a Tier/Meta or Battle Rule depending on which the challenger picks. <br />'+
			'-Both the Tier/Meta and Battle rule that are decided upon are combined and are used for the battle.<br />'+
			'-All forms of Monotype battles, Random Battles and Champion\'s Challenge battles are banned. <br />' + seen('frontierjerattata'));
	},

	zachary: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('∆Frontier <b>Zachary</b>∆<br/>' +
			'<i>"Can you do a few things at the same time?"</i><br/>' +
			'<b>Symbol:</b> Multitasking<br/>' +
			'<b>Ace:</b> All<br/>' +
			'<b>Battle Rules:</b><br/>' +
			'-Smogon Doubles<br />' +
			'-No hazards<br />' +
			'<details><summary><b>Champion\'s Challenge Rules:</b></summary> <br />' +
			'-Pikachu Tournamentchu <br />' +
			'-No CAP Pokemon</details> <br />' + seen('frontierzachary') + getBadges('frontierzachary'));
	},

	/*subfrontier: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center>Sub Frontier Position: <b><font color = FF0000>Offline</font></b></center><br />'+
		'Sub Frontier <b>???</b> <br />'+
		'<b>Symbol:</b> ???<br />'+
		'<b>Battle Rules:</b> <br />');
        
        },*/

	//////////////
	//Gym Leaders
	//////////////

	
	bug: function(target, room, user) {
	        if (!this.canBroadcast()) return;
		this.sendReplyBox('∆Gym Ldr <b>???</b>∆<br />'+
			  '<i>"???"</i> <br />'+
			  '<b>Type: <font color = 65b510>Bug</font></b><br />'+
			  '<b>Ace:</b> ??? <br />' + seen('') + getBadges(''));
	},

	
	dark: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('∆Gym Ldr <b>???</b>∆<br />' +
			'<i>"???"</i> <br />' +
			'<b>Type: <font color = 15012b>Dark</font></b><br />' +
			'<b>Ace:</b> ???<br />' +
			seen('') + '<br />'); 
	},

	
	dragon: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('∆Gym Ldr <b>???</b>∆<br />' +
			'<i>"???"</i> <br />' +
			'<b>Type: <font color = 230077>Dragon</font> </b><br />' +
			'<b>Ace:</b> ???<br />' + seen('') + getBadges(''));
	},

	bk: 'electric',
	electric: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('∆Gym Ldr <b>BK</b>∆<br />' +
			'<i>"???"</i><br />' +
			'<b>Type: <font color = d6cc0c>Electric</font></b><br />' +
			'<b>Ace:</b> Eelektross<br />' + seen('gymldrbk') + getBadges('gymldrbk'));
	},

        you: 'fairy',
	fairy: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('∆Gym Ldr <b>You</b>∆<br />' +
			'<i>"A little sparkle should fix that right up, wait no thats a diamond storm."</i> <br />' +
			'<b>Type: <font color = ff42a0>Fairy</font></b><br />' +
			'<b>Ace: </b>Diancie<br />' + seen('gymldryou') + getBadges('gymldryou'));
	},

	pharo: 'ground',
	ground: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('∆Gym Ldr <b>Pharo</b>∆<br>' +
			'<i>"Always hold your ground."</i> <br>' +
			'<b>Type: <font color = A64000>Ground</font></b><br>' +
			'<b>Ace: </b>Excadrill<br>' + 
			seen('gymldrpharo') + getBadges('gymldrpharo')
		);
	},

	elodin: 'fighting',
	fighting: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('∆Gym Ldr <b>Elodin</b>∆<br />'+
			'<i>"How much can you possibly know about yourself if you\'ve never been in a fight?"</i> <br />'+
			'<b>Type: <font color = d83c08>Fighting</font></b><br />'+
			'<b>Ace:</b> Sawk<br />' + seen('gymldrelodin') + getBadges('gymldrelodin')
		);
        },

	fire: 'waffles',
    	waffles: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('∆Gym Ldr <b>Waffles</b>∆<br />'+
		      'Leader Ranking: <font color = FFFF00><b>2nd</font></b> <br />' +
	              '<i>"Don\'t waffle out of the situation."</i> <br />'+
	              '<b>Type: <font color = FF0000>Fire</font></b><br />'+
	              '<b>Ace: Infernape</b> <br />'  + seen('gymldrwaffles') + '<br>' +
	              '<img src = "http://sprites.pokecheck.org/t/010.gif"> <img src = "http://play.pokemonshowdown.com/sprites/xyani/heatran.gif"><br>' + 
	              getBadges('gymldrwaffles'));
	},

	flying: 'float',
	float: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('∆Gym Ldr <b>Float</b>∆<br />' +
			'<i>"flap... flap... flap... bird type...?"</i> <br />' +
			'<b>Type: <font color = 7ab6ff>Flying</font></b><br />' +
			'<b>Ace:</b> Hawlucha (John Cena)<br />' +
			'<img src="http://play.pokemonshowdown.com/sprites/xyani-shiny/beldum.gif"><img src="http://play.pokemonshowdown.com/sprites/xyani-shiny/aron.gif"><img src="http://play.pokemonshowdown.com/sprites/xyani/metagross-mega.gif"><img src="http://play.pokemonshowdown.com/sprites/xyani-shiny/aron.gif"><img src="http://play.pokemonshowdown.com/sprites/xyani-shiny/beldum.gif"><br />' +
			'<audio controls src = "http://picosong.com/cdn/f47cf8120a89402a77ed76e2494d20fb.mp3" style = "border-radius: 0px; background: black;"></audio></br></br>' +
			seen('gymldrfloat') + getBadges('gymldrfloat'));
	},

    
        alcor: 'ghost',    
	ghost: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('∆Gym Ldr <b>Alcor</b>∆<br />' +
			'<i>"Halloween is the spoopiest time of the year the ascher has been fed and no one is safe."</i> <br />' +
			'<b>Type: <font color = 7814e2>Ghost</font></b><br />' +
			'<b>Ace:</b> Cofagrigus<br />'+
		        '<audio src="https://dl.pushbulletusercontent.com/nfP9iY95TAbBnLzJf1cAbLG7qegceAan/Last%20Decision%20%28%20Remastered%20And%20Extended%20%29.mp3" controls="" style="width: 100% ; border: 2px solid #700000 ; background-color: #000000" target="_blank"></audio>' +
			seen('gymldralcor') + getBadges('e4alcor'));
	},


    mitsuka: 'grass',	
    grass: function(target, room, user) {
	if (!this.canBroadcast()) return;
	this.sendReplyBox('∆Gym Ldr <b>Mitsuka</b>∆<br />'+
	                'Leader Ranking: <font color = FF0000><b>1st</font></b> <br />' +
			'<i>"Storm of leaf and Draining root!"</i> <br />'+
			'<b>Type: <font color = 006b0a>Grass</font></b> <br />'+ 
			'<b>Ace:</b> Victreebel <br />' + seen('gymldrmitsuka') + getBadges('gymldrmitsuka'));
	},


	ice: 'mark',
	mark: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('∆Gym Ldr <b>Mark</b>∆<br />' +
			'<i>"Hard work pays off in the end."</i> <br />' +
			'<b>Type: <font color = 00e0ac>Ice</font></b><br />' +
			'<b>Ace:</b> Don\'t Do Drugs (Mega Glalie)<br />' +
			seen('gymldrmark') + '<br>' +
			'<img src = "http://play.pokemonshowdown.com/sprites/xyani-shiny/froslass.gif"> ' +
			'<img src = "http://play.pokemonshowdown.com/sprites/xyani-shiny/glalie-mega.gif"><br>' +
			'<audio controls src = "http://216.227.134.162/ost/rockman-2-megaman-2-complete-works/kbrxwhzvos/2-31-flash-man-stage-smd.mp3" style = "border: 2px solid cyan; border-radius: 3px; background-color: black;"></audio>' +
			getBadges('gymldrmark')
		);
	},

	normal: 'bigo',
        bigo: function(target, room, user) {
	if (!this.canBroadcast()) return;
	this.sendReplyBox('∆Gym Ldr <b>Bigo</b>∆<br />'+
		'<i>"Don\'t underestimate the normal, cause being \'normal\'  doesn\'t mean to be weak"</i> <br />'+
	    '<b>Type: <font color = ffa5d5>Normal</font></b><br />'+
		'<b>Ace:</b> Lopunny<br />' + seen('gymldrbigo') + getBadges('gymldrbigo'));
    },

	zoro: 'poison',     
	poison: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('∆Gym Ldr <b>Zoro</b>∆<br />' +
			'<i>"I don\'t have a quote."</i> <br />'+
			'<b>Type: <font color = aa00ff>Poison</font></b><br />' +
			'<b>Ace:</b> None<br />' + seen('gymldrzoro') + getBadges('gymldrzoro'));
	},
	
	
	psychic: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('∆Gym Ldr <b>???</b>∆<br />' +
		        'Leader Ranking: <font color = 9dff00><b>3rd</font></b> <br />' + 
			'<i>"???"</i> <br />' +
			'<b>Type: <font color = ff00b6>Psychic</font></b><br />' +
			'<b>Ace:</b> ??? <br />' + seen('') + getBadges (''));
	},

	rock: 'core',
	core: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('∆Gym Ldr <b>Core</b>∆<br />' +
			'<i>"There\'s always a chance for a comeback if you leave yourself open"</i> <br />' +
			'<b>Type: <font color = 472e10>Rock</font></b><br />' +
			'<b>Ace:</b> Archeops<br />' + seen('gymldrcore') + getBadges('gymldrcore'));
	},

	
	solarwolf: 'steel',
	steel: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('∆Gym Ldr <b>SolarWolf</b>∆<br />' +
			'<i>"The best steel doesn\'t always shine the brightest, but it will smash your face in."</i> <br />' +
			'<b>Type: <font color = 5e6664>Steel</font></b> <br />' +
			'<b>Ace:</b> Bisharp <br />' +
			seen('gymldrsolarwolf') + getBadges('gymldrsolarwolf'));

	},

       arthurzh: 'water',
	water: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('∆Gym Ldr <b>ArthurZH</b>∆<br />' +
			'<i>"The power of the seas, storms and rivers are mine to hold....and here you dare to stand before me?"</i> <br />' +
			'<b>Type: <font color = 0745ff>Water</font></b><br />' +
			'<b>Ace:</b> Gyarados <br/>' +
			seen('gymldrarthurzh') + getBadges('gymldrarthurzh'));
	},

	/////////////
	//Other Cards
	//////////////////
	
	aboottothehead: 'abtth',
	abtth: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><b><font size="4" color="03b206">ABootToTheHead</font></b></center><br>' +
			'<center><i>"Stardust-weaved ARiA, please keep this melody going."</i></center><br /><br />' +
			'<b>Ace: </b>Scizor and Whimsicott<br />' +
			'<b>Favorite Pokemon: </b>Typhlosion and Scizor<br />' +
			'<b>Preferred tiers: </b>VGC, Ubers, OU <br />' +
			'<b>Known for: </b>VoltTurn and Whimsistall shenanigans<br />' +
			'<b>Achievements: </b>Ex-Elite Frontier, ex-Elite Four<br>' +
			'<b>Affiliation:</b> Gracidea Shaymins<br><br>' +
			'<center><img src="http://sprites.pokecheck.org/i/157.gif"><img src="http://sprites.pokecheck.org/i/530.gif"><img src="http://sprites.pokecheck.org/i/547.gif"><img src="http://sprites.pokecheck.org/t/144.gif"><img src="http://sprites.pokecheck.org/i/205.gif"><img src="http://sprites.pokecheck.org/i/310.gif"><img src="http://sprites.pokecheck.org/i/212.gif"></center><br />' +
			getBadges('aboottothehead') + '<br>' +
			'<center><img src = "http://i.imgur.com/UBIZE34.png" width = "188" height = "125"></center>'
		);
	},

	sorarani: 'arani',
	arani: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><b><font color = "#331D81" size = 3>∆Arani∆</font></b><br>' + 
			'<i>"Rain teams are old school? Well... screw you."</i><br><br>' +
			'<b>Skilled in:</b> Gen 5 OU - was consistently in the Top 10 on the global OU ladder.<br>' +
			'<b>History:</b> First new Champ of Sora - ressurrected it along with Onyx.<br>' +
			'<b>Present:</b> Serving in the defense force - Occasionally comes online.<br>' +
			seen('sorarani') + '<br>' +
			'<img src = "http://play.pokemonshowdown.com/sprites/xyani/keldeo-resolute.gif"><img src = "http://play.pokemonshowdown.com/sprites/xyani/thundurus-therian.gif">');
	},
	
	arjunb: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><input type="image" src="http://i.imgur.com/bnCFCm5.png"><div align="center"><br />' +
			'<div align="center">"<i>Fall seven times, stand up eight. That\'s what I do</i>"</div><br />' +
			'<b>Favorite Types:</b> Fighting, Dark and Poison(with crobat)<br />' +
			'<b> Achievements:</b> Former Elite, got the elite position in his first promo tournaments.<br />' +
			'<b>Favorite Pokemon:</b><br />' +
			'<img src="http://play.pokemonshowdown.com/sprites/xyani/terrakion.gif"><img src="http://play.pokemonshowdown.com/sprites/xyani/weavile.gif"><img src="http://play.pokemonshowdown.com/sprites/xyani/medicham-mega.gif"><img src="http://play.pokemonshowdown.com/sprites/xyani/crobat.gif"><div align="center"><br />' +
		         +getBadges('arjunb'));
	},

	ascher: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><b><font size="4" color="86e755">Ascher</font></b></center><br />' +
			'<center><img src="http://play.pokemonshowdown.com/sprites/xyani/shroomish.gif"></center> <br />' +getBadges('frontierasch'));
	},

	azh: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<div style = "padding: 8px; color: white; background: #000 url(http://www.pageresource.com/wallpapers/wallpaper/pokemon_67267.jpg) no-repeat scroll bottom; background-size: 100%;">' +
			'<center><b><font size= 5>∆ArthurZH∆</font></b></center><br />'+
			 '<center><i>"The power of the seas, storms and rivers are mine to hold....and here you dare to stand before me?"</i></center> <br />'+
			 '<center><b>Favoured Type:</b> Water<br />'+
			 '<b>Favoured Metagame:</b> Smogon Doubles <br />'+
			 '<b>Favourite Pokemon:</b> Gyarados</center><br />'+
			 '<b>Achievements:</b> Ex Water Leader of Sora, Ex Roulette/Champion\'s Challenge/Monotype Frontier of Sora<br />'+
			 '<b>Current Position:</b> Smogon Doubles OU Frontier<br />'+
			 '<center><img src="http://fc00.deviantart.net/fs71/f/2014/082/f/8/manaphy_gif_by_gloomymyth-d7bakkc.gif"><img src="http://play.pokemonshowdown.com/sprites/xyani/keldeo-resolute.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/tentacruel.gif"><img src="http://www.pokemonreborn.com/custom/44203.png?530"> <img src="http://play.pokemonshowdown.com/sprites/xyani/kabutops.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/swampert.gif"><img src="http://play.pokemonshowdown.com/sprites/xyani/gyarados.gif"></center>'+
			 '<center><font size=2 color=#0000FF><b>Battle Theme</b> - <i>Hoenn Oceanic Museum Remix [Credits: GlitchXCity]</i></font><br \><audio src="https://dl.pushbulletusercontent.com/rd0Qhn6drs85cyLNk7XIxGmwLQHQl4q1/Atmosphere-%20Bright.mp3" controls="" style="width: 100% ; border: 2px solid #0000FF ; background-color: #3399FF" target="_blank"></audio></center><br \>' +getBadges('frontierzachary'));
	},

	bamdee: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><span style = "font-size: 15pt; color: #ff00b6;"><b>Bamdee</b></span></center><br>' +
			'<center><img src="http://play.pokemonshowdown.com/sprites/xyani/ditto.gif"></center><br>' +
			'<audio controls src = "https://dl.pushbulletusercontent.com/xFgUAMGfNsNhld0TC7Bf9nehzEiVRkGo/sonic.mp3" style = "border: 2px solid pink; background: black; width: 100%;"></audio><br>' +
			getBadges('bamdee')
		);
	},
	
	darkus: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><span style = "font-size: 11pt; font-weight: bold; color: ' + Core.color('soradarkus') + '">∆SoraDarkus∆</span><br>' +
		'<i>"It\'s all shits and giggles until someone giggles and shits."</i><br><br>' +
		'<b>Aces:</b> Bisharp and Crawdaunt<br>' +
		'<b>Skilled in:</b> Monotype<br>' +
		'<b>Preferred types:</b> Dark, Psychic and Steel<br>' +
		'<b>Achievements:</b> Sora E4, Gym Leader and Side-Mission<br>' +
		'<b>Known for:</b> Being one of the original members of Sora, and having mad Dark mono skills.<br>' +
		seen('soradarkus') + '<br>' +
		'<img src = "http://play.pokemonshowdown.com/sprites/xyani/bisharp.gif"> <img src = "http://play.pokemonshowdown.com/sprites/xyani/crawdaunt.gif" style = "transform: rotateY(180deg)"><br>' +
		getBadges('soradarkus'));
	},

	edgy: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<a><font size= 4><center><b><font color = 00CCFF>Edgy</font></b></center></a><br />' +
			'<center><img src="http://play.pokemonshowdown.com/sprites/xyani/gardevoir-mega.gif"><img src="http://play.pokemonshowdown.com/sprites/xyani/lopunny-mega.gif"><img src="http://play.pokemonshowdown.com/sprites/xyani/charizard-mega-x.gif"><img src="http://play.pokemonshowdown.com/sprites/xyani/lopunny-mega.gif"><img src="http://play.pokemonshowdown.com/sprites/xyani/gardevoir-mega.gif"></center> <br />' +
			'<center><i>"How can you face your problem, if the problem is your face?"</i></center><br />' +
			'<details><summary><font size= 1><b>Badges: (Click here to open)</b></font></summary><br />' +
			'<a href="http://soraleague.weebly.com/badges.html#ldr"><img src="http://i.imgur.com/ELFPzW8.png" title="Achieved Gym Leader Status"></a><a href="http://soraleague.weebly.com/badges.html#e4"><img src="http://i.imgur.com/QtECCD9.png" title="Achieved Elite 4 Status"></a><a href="http://soraleague.weebly.com/badges.html#aegislash"><img src="http://i.imgur.com/aJY3eKg.png" title="Winner of Sora\'s first major Monotype Round Robin Tour"></a></details> <br />');
	},

	gasp: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Trainer <b>gasp</b><br />' +
			'<i>"Lights out."</i> <br />' +
			'<b>Ace:</b> Mega Gengar<br />' +
			'<b>Honours:</b> Sora\'s first challenger to reach Hall of Fame.<br />' +
			'<b>Prefered Tier:</b> Balanced Hackmons' +
			'<img src="http://pldh.net/media/pokemon/gen5/blackwhite_animated_front/302.gif"> <img src="http://media.tumblr.com/tumblr_m6ci5tQsEv1qf6fp2.gif"><br />' +getBadges('gasp'));
	},
	leafy: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('|html|<div style = "padding: 5px; text-align: center; background-image: url(http://i1171.photobucket.com/albums/r545/Brahak/maple_zpsg5sgjduk.jpg) no-repeat scroll bottom; background-size: cover;">' +
			'<font size = 4 color = "white"><b>∆Leaf∆</b></font><br><br>' + 
			'<table align = "center" border = "0px" style = "color: #707c71">' + 
			'<tr><td style = "background: rgba(0, 0, 0, 0.9); width: 200px; height: 120px"><b><u><span style = "font-size: 10pt">Achievements</span></u></b><br>' +
			'<li style = "padding: 3px">Successfully ran two leagues.' +
			'<li style = "padding: 3px">Been a Gym Leader, Elite Four, and Frontier in Sora.</td>' +
			'<td style = "padding: 0px 8px 0px 8px;"><img src = "http://play.pokemonshowdown.com/sprites/xyani/grovyle.gif"></td>' +
			'<td style = "background: rgba(0, 0, 0, 0.9); width: 200px;"><b><u><span style = "font-size: 10pt">Known for</span></u></b><br>' +
			'<li style = "padding: 3px">Scarf Kyurem set.' +
			'<li style = "padding: 3px">Mega Blastoise and Cinccino favourites.' +
			'<li style = "padding: 3px">Resident drunk of Sora.</td></tr></table><br>' +
			'<table align = "center"><tr><td><div style = "display: inline-block; width: 120px; height: 101px; background: url(http://www.pkparaiso.com/imagenes/xy/sprites/animados/leafeon-2.gif) no-repeat 0px -70px"></div></td>' +
			'<td><div style = "transform: rotateY(180deg); display: inline-block; width: 120px; height: 101px; background: url(http://www.pkparaiso.com/imagenes/xy/sprites/animados/leafeon-2.gif) no-repeat 0px -70px"></div></td></tr></table>' +
			'<center><audio controls src = "https://dl.pushbulletusercontent.com/91078HKzh36ORZdMm7EaE2suEdL7iwr1/Devil%20Survivor%202%20-%20Septentrion%20%5Bwww.songmirror.org%5D.mp3" style = "width: 100%; border-radius: 0px; background: linear-gradient(45deg, #011100, #00ad17, #011100, #00ad17, #011100, #00ad17, #011100, #00ad17);"></audio><br>' +
			getBadges('AlcorSeptentrion') + '</div>'
		);
	},
	meowsofsora: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><b><font size = 4 color = "#55dbe8">MeowsofSora</font></b><br />'+
		'<i>"I might be a bitch, but I\'m definitely not a pussy"</i><br />'+
		'<i>"Abs=Win"</i><br /><br />'+
		'<b>Who am I:</b> Resident OU Specialist and OM Lover <br />'+
		'<b>Specialty:</b> OU <br />'+
		'<b>Ace:</b> Latias</center><br>'+
		'<b>Achievements:</b> Peaked top 20 for OU/OU (No Mega), top 500 for Monotype, most symbol defends in Sora<br>'+
		'<b>Current Position:</b> OU Frontier of Sora <br />'+
		'<center><img src="http://play.pokemonshowdown.com/sprites/xyani/gengar.gif"><img src="http://play.pokemonshowdown.com/sprites/xyani/azumarill.gif"><img src="http://play.pokemonshowdown.com/sprites/xyani/raikou.gif"><img src="http://play.pokemonshowdown.com/sprites/xyani/scizor.gif"><img src="http://play.pokemonshowdown.com/sprites/xyani/latias.gif"></center><br />'+
		'<center><font size=2 color=#0000FF><i><b>현아</b> - Because I\'m the Best (Feat. 정일훈)</i></font><br><audio controls src="https://dl.pushbulletusercontent.com/jff9FOcg7fLsplNbywP27oPEry1D7xZg/HYUNA%20-%20%EC%9E%98%EB%82%98%EA%B0%80%EC%84%9C%20%EA%B7%B8%EB%9E%98.mp3" style="width: 100%"></center><br \><br \>'+ getBadges('frontiermeows'));
	},

	jeratt: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('|html|<table style = "box-shadow: 2px 2px 10px black; text-shadow: 0px 0px 10px; padding: 7px; width: 100%; background: radial-gradient(circle, black, #000d70, black, #000d70, black, #000d70); color: #8CC6FB;">' +
			'<tr><td colspan = 2 style = "padding-bottom: 7px"><center><b style = "font-size: 15pt">∆Jerattata∆</b><br>' +
			'<i>"I am not a man who writes, but a man who is written about."<br> - A man of Action</i><br>' +
			'<img src = "http://play.pokemonshowdown.com/sprites/xyani-shiny/rattata.gif"><img src = "http://sprites.pokecheck.org/i/235.gif"><img src = "http://sprites.pokecheck.org/t/033.gif"><img src = "http://play.pokemonshowdown.com/sprites/xyani-shiny/mamoswine.gif"></center>' + 
			'<audio controls src = "https://dl.pushbulletusercontent.com/zvNULWYufM42wsTK3xNPoscIp4UT4m14/sugar.mp3" style = "width: 100%; background: black; border: 1px solid blue; border-radius: 0px;"></td></tr>' +
			
			'<tr><td><center><img src = "http://oi62.tinypic.com/14cfyh0.jpg"></center></td>' +
			'<td style = "box-shadow: 2px 2px 10px black; padding: 5px; margin-right: 3px; width: 220px; background: rgba(33, 37, 38, 0.7)"><center>' +
			'<small><b><u>Highly skilled in</u></b><br><li style = "padding: 2px;">VGC and Monotype<br><br>' +
			'<b><u>Skilled in</u></b>' +
			'<li style = "padding: 2px;">Making quotes' +
			'<li style = "padding: 2px;">Making backgrounds for Sora' +
			'<li style = "padding: 2px;">Creating custom EV sets' +
			'<li style = "padding: 2px;">Strategizing<br><br>' +
			'<b><u>History</u></b>' +
			'<li style = "padding: 2px;">Greatest Ice E4 and <s>undefeated</s> Dragon E4' +
			'<li style = "padding: 2px;">Top 8 VGC 2014 Regionals</small></td></tr>' +
			'<tr><td colspan = 2><center><img src = "http://play.pokemonshowdown.com/sprites/xyani/torkoal.gif" style = "transform: rotateY(180deg)"><img src = "http://play.pokemonshowdown.com/sprites/xyani-shiny/torterra.gif" style = "transform: rotateY(180deg)"><img src = "http://play.pokemonshowdown.com/sprites/xyani-shiny/blastoise.gif" style = "transform: rotateY(180deg)"><img src = "http://play.pokemonshowdown.com/sprites/xyani/aggron-mega.gif"><br>' +
			'<audio controls src = "https://dl.pushbulletusercontent.com/a8L7ZScvc1RPgHylxZemiTqeO1PagA22/shellshocked.mp3" style = "width: 100%; background: black; border: 1px solid blue; border-radius: 0px;"></center></td></tr>' +
			'<tr><td colspan = 2><center>' + getBadges('frontierjerattata') + '</center></td></tr></table>'
		);
	},

	nightanglet: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><i><font color="blue"><h1>Nightanglet</h1></font></center><br>' +
			'<font color = "blue"><b>Ace: Infernape(CR Ace:Rhydon)<br />' +
			'Custom Rules:<br />' +
			'- No poke above the base speed of 40<br />' +
			'- No Hazards<br />' +
			'-Speed should not be increased or decreased<br />' +
			'</b></i><img src="http://play.pokemonshowdown.com/sprites/xyani-shiny/infernape.gif"><img src="http://play.pokemonshowdown.com/sprites/xyani/rhydon.gif">');
	},
	
	swearwip: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('|html|<table style = "color: white; width: 100%; padding: 0px 10px 10px 10px; background: linear-gradient(45deg, #67108c, #3c0654, #67108c, #3c0654, #67108c, #3c0654, #67108c, #3c0654, #67108c, #3c0654);">' +
			'<tr><td colspan = "2"><center><br><font size = 3 style = "margin-top: 10px; font-weight: bold; text-shadow: 3px 3px 10px black;">∆Srewop∆</font><br>' +
			'<i style = "text-shadow: 3px 3px 10px black;">"I think you\'re in Gotham, \'cause the bat is coming for you..."</i><br><br></td></tr>' + 
			'<tr><td><center style = "text-shadow: 3px 3px 10px #000;"><b>Symbol:</b> SumTingWong<br><b>Battle Format:</b> RU Monotype<br>' +
			'<b>Restrictions:</b><br><li>No Hazards<li>No Knock Off<br>' +
			'<b>Ace:</b> Golbat<br>' +
			'<img style = "margin: -5px" src = "http://www.pkparaiso.com/imagenes/xy/sprites/animados/golbat-2.gif"></center></td>' +
			'<td style = "text-shadow: 0px 0px 8px #d87fff; box-shadow: 0px 0px 40px #000; background: rgba(0, 0, 0, 0.7); width: 200px; color: #e6b2ff; text-align: center;">' +
			'<u><b><font size = 2>Achievements</font></b></u>' +
			'<li style = "padding: 5px;">Elite Frontier of Sora' +
			'<li style = "padding: 5px;">Ranked Top 20 on the PU ladder' +
			'<li style = "padding: 5px;">Ranked Top 400 on the RU ladder<br><br>' +
			'<u><b><font size = 2>Known for</font></b></u>' +
			'<li style = "padding: 5px;">Sub/DD Lapras' + 
			'<li style = "padding: 5px;">Doctor of Sora' +
			'<li style = "padding: 5px;">GOLBAT MOTHER FUCKER</tr></center>' + 
			'<tr><td colspan = 2><center><font size = 2 style = "text-shadow: 0px 0px 15px #d170ff;"><i style = "color: rgba(0, 0, 0, 0.8);"><b><font size = 2>Pokémon Reborn:</font></b> Byxbysion Wasteland theme</i></font><audio controls src = "https://dl.pushbulletusercontent.com/U6jcDqHbeUTxoZz8LKB3IgwK8u3970rA/Atmosphere-%20Findmuck.mp3" ' +
			'style = "width: 100%; background: linear-gradient(135deg, black, #b516ff, black, #b516ff, black, #b516ff, black, #b516ff, black, #b516ff); box-shadow: 0px 0px 15px #d170ff;"></td></tr>' +
			'<tr><td colspan = 2 style = "text-shadow: 0px 0px 8px #d170ff; color: rgba(0, 0, 0, 0.8);"><center>' + getBadges('frontiersrewop') + '</center></td></tr></table></div>');
	},

	terror2: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('|html|<div style = "padding: 7px; border: 2px solid black; color: white; background: radial-gradient(circle, #1919c1, #2143ed, #1919c1, #2143ed, #1919c1, #2143ed, #1919c1, #2143ed);"><center><b><font size="4" color="82127a">Terror</font></b></center><br>' +
			'<center><i>"Looking for dank memes"</i> </center><br /><br />' +
			'<b>Ace: </b>Mega Sharpedo/Garchomp<br />' +
			'<b>Skilled at: </b>Being incredibly annoying, Balanced Hackmons, Certain Monotypes.<br />' +
			'<b>Achievements: </b><br />' +
			'<li>Best Ex-Electric & Ground Leader of Sora<br />' +
			'<li>Current Water Leader of Sora<br />' +
			'<li>Ex-Balanced Hackmons Frontier of Yagagadrazeel<br />' +
			'<li>Achieved Top 10 in the Balanced Hackmons ladder<br />' +
			'<li>Achieved Top 25 in the Ubers ladder<br />' +
			'<img src="http://play.pokemonshowdown.com/sprites/xyani-shiny/greninja.gif"><img src="http://play.pokemonshowdown.com/sprites/xyani/ferrothorn.gif"><img src="http://play.pokemonshowdown.com/sprites/xyani-shiny/sharpedo.gif"><img src="http://play.pokemonshowdown.com/sprites/xyani/garchomp.gif">'+
			getBadges('e4terror'));
	},
	
	
	showtier: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/DI9T4Y6.png" width=550></center>');
	},

	////////////
	//Music Cards
	//////////////
	feelingit: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<div class="infobox" style="cursor: url(&quot;http://i.imgur.com/c4qM0iM.gif&quot;) , auto; border: 0px ; background-image: url(&quot;http://files.gamebanana.com/img/ss/wips/4ffc9f6bed5e2.jpg&quot;) ; background-size: cover"><br \>' +
			'<br \><center><b><font color=#FF9900 size=2>You Will Know Our Names</b></font><font color=#FF9900 size=2> \- <i>Xenoblade Chronicles</i></font><br \>' +
			'<audio src="http://www.ssbwiki.com/images/f/f5/Victory%21_%28Shulk%29.ogg" controls="" style="width: 100% ; border: 2px solid #00CC00 ; background-color: #00000a" target="_blank"></audio></center><br \><br \>');
	},

	easymoney: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<div style="background-image: url(&quot;http://i.imgur.com/orlVvMg.jpg&quot;) ; background-size: cover" target="_blank"><br \>' +
			'<br \><center><font size=3 color=#FF9900><b>Easy Money</b> - <i>Bizzaro Flame</i></font><br \>' +
			'<audio src="https://dl.pushbulletusercontent.com/qrAveUFTyNQlmvq3HEtlqSmBiuQeUaaQ/Easy%20Money.mp3" controls="" loop style="width: 100% ; border: 2px solid #00CC00 ; background-color: #00000a" target="_blank"></audio></center><br \><br \><br /><br /><br /><br /><br /><br /><br /><br />');
	},

	afraud: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<div style="background-image: url(&quot;http://i.imgur.com/jBfZq5A.jpg&quot;) ; background-size: cover"><br \><br /><br /><br /><br /><br /><br /><br /><br />' +
			'<br \><center><font size=3 color=#00FF40><b>A Fraud</b> - <i>Izzaro Flame</i></font><br \>' +
			'<audio src="https://dl.pushbulletusercontent.com/Pl3dDtxvFMbdAn6IZQHAF6gxFluLoAhA/A%20Fraud%20-%20%20A%20Big%20Fraud.mp3" controls="" loop style="width: 100% ; border: 2px solid #58FAF4 ; background-color: #00000a" target="_blank"></audio></center><br \><br \>');
	},
	
	getrekt: 'rekt',
	rekt: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src = "https://lh3.googleusercontent.com/-6BDWwnjS9Cs/VajnpfmQumI/AAAAAAAAD7s/u1hZqlM09s0/w500-h200/img-3516109-1-Mc5cCal.gif">' +
			'<audio autoplay controls style = "border: 2px solid red; background: black; width: 100%" src = "http://www.myinstants.com/media/sounds/wombo-combo_2.mp3">' +
			'</audio></center>');
	},
	
	nojohns: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<div style = "background: url(http://i.imgur.com/dTD1J7o.gif); text-align: center; height: 299px; background-size: cover;"><span style = "color: red; font-weight: bold; font-size: 13pt;">No Johns</span><br>' +
			'<audio controls src = "http://s0.vocaroo.com/media/download_temp/Vocaroo_s0JSb5SljS5I.mp3" style = "border: 1px solid yellow; border-radius: 0px; background: black; width: 100%"></audio>'
		);
	},

	lyin: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('|html|<div class = "infobox" style = "background: url(https://thoughtcatalog.files.wordpress.com/2015/09/screen-shot-2015-09-03-at-8-40-19-pm.png?w=786&h=600) no-repeat 0px -30px; background-size: 100%; height: 300px;">' +
			'<audio controls src = "http://b.sc.egghd.com/media/b0/a2/b0a2bf0d5e10ef92fcd8726640fabdb9.mp3?id=223206908&key=eadd7f5398105057d30329e22c595d27e4ce8794" style = "float: right; margin-top: 100px; margin-right: 5px; background: black; border: 2px solid red;"></div>'
		);
	},

	lyinfull: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><span style = "font-size: 12pt; color: red;"><i>Lyin\'</i></span><br>' +
			'<video controls src = "https://dl.pushbulletusercontent.com/PlrszI1cm30CsAtEGVfnefB2w9HVsyh4/lyin.mp4#t=56" style = "width: 100%"></center>'
		);
	},

	ichibannotakaramono: function (target, room, user) {
        	if (!this.canBroadcast()) return;
        	this.sendReplyBox('<div class="infobox" style="border: 0px ; background-image: url(&quot;http://img2.wikia.nocookie.net/__cb20101231031301/angelbeats/images/f/f5/EP10-Yui-and-Hinata-500x281.png&quot;) ; background-size: cover" target="_blank">'+
        	                  '<center><font size=2 color=#0066FF><b>Original Version</b> - <i>Karuta</i></font><br \><audio src="https://dl.pushbulletusercontent.com/NBtI15PWK0EQDXkB8YNqKe6YZYWpLHaO/19%20-%20Ichiban%20no%20Takaramono%20%28Original%20Version%29.mp3" controls="" target="_blank"></audio><br /><br /><br /><br /><br /><br /><br /><br />'+
        	                  '<br \></center><b><font size=2 color=#FF0000>  一番の宝物</b></font><font size=2 color=#FF0000> \- <i>Angel Beats</i></font><br /><font size=1>Ichiban no Takaramono</font><center><br \><br \><br \><br \><br \><br \><font size=2 color=#0099FF><b>Yui\'s Version</b> - <i>Girls Dead Monster, feat. LiSA.</i></font><audio src="https://dl.pushbulletusercontent.com/5CLffau3dUgPCVIPwKyIQUjblB4NgQ5G/09%20-%20Ichiban%20no%20Takaramono%20%20%28Yui%20ver.%29.mp3" controls="" target="_blank"></audio></center>');
	},
	
	//////////
	//Priomons Cards
	/////////////

	incweather: 'incweather',
	incweather: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Here is a detailed explanation of the format Inclement Weather:<br />' +
			'- <a href="http://soraleague.weebly.com/inclement-weather.html">Inclement Weather</a><br />' +
			'</div>');
	},

	nervepulse: 'priomonsnervepulse',
	priomonsnervepulse: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<img src="http://oi58.tinypic.com/ayw0aq.jpg"> <br />');

	},

	tremorshock: 'priomonstremorshock',
	priomonstremorshock: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<img src="http://oi58.tinypic.com/14u8e2s.jpg"> <br />');

	},

	fairywind: 'priomonsfairywind',
	priomonsfairywind: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<img src="http://oi60.tinypic.com/33z7ndf.jpg"> <br />');

	},

	twineedle: 'priomonstwineedle',
	priomonstwineedle: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<img src="http://oi58.tinypic.com/9h6i5z.jpg"> <br />');

	},

	dracocrash: 'priomonsdracocrash',
	priomonsdracocrash: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<img src="http://oi59.tinypic.com/dyvvw2.jpg"> <br />');

	},

	flameshot: 'priomonsflameshot',
	priomonsflameshot: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<img src="http://oi62.tinypic.com/29m6j5e.jpg"> <br />');

	},

	venomstrike: 'priomonsvenomstrike',
	priomonsvenomstrike: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<img src="http://oi60.tinypic.com/2wf761w.jpg"> <br />');

	},

	divingcharge: 'priomonsdivingcharge',
	priomonsdivingcharge: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<img src="http://oi58.tinypic.com/ezj4pl.jpg"> <br />');

	},

	stonespine: 'priomonsstonespine',
	priomonsstonespine: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<img src="http://oi62.tinypic.com/2moy06e.jpg"> <br />');

	},

	sapblast: 'priomonssapblast',
	priomonssapblast: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<img src="http://oi62.tinypic.com/23rk9oz.jpg"> <br />');

	},

	kineticforce: 'priomonskineticforce',
	priomonskineticforce: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<img src="http://oi60.tinypic.com/1ptn36.jpg"> <br />');
	},

	////////////
	//Informative Cards
	//////////////

	leaderranks: 'ranks',
	ranks: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Listed here are the Top 3 Leaders in The Sora League based on performance in our Monthly Promotional Tournament! Please keep in mind, the number of ranked Leaders may change month to month and the ranking methodology may be changed in the future.<br />' +
			'-<b>1st <font color= 006b0a>Mitsuka</font></b> (Grass)<br />' +
			'-<b>2nd <font color= FF0000>Waffles</font></b></b> (Fire)<br />' +
			'-<b>3rd <font color= ff00b6>Connor</font></b> (Psychic)<br />' +
			'</div>');
	},

	donate: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><font size = 2>If you wish to donate to the server, please click on the button below.<br>' +
			'<a href = "https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=Q3B5Z6STF3EA4&lc=AU&item_name=Sora&currency_code=AUD&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted"><img src = "https://www.paypalobjects.com/en_AU/i/btn/btn_donate_SM.gif"></a><br>' +
			'Remember to mention your username when you leave a note with your donation, or we won\'t know who donated. To all of those who\'ve donated or plan on donating, thank you! We really appreciate it!</center></font><br><br>' +
			'<b>Donation benefits:</b><br>' +
			'<strong>$1 or more:</strong>' +
			'<li>Earns you the Server Donator badge, which will be displayed on your trainer card.' +
			'<li>Allows you to set a custom username colour visible in chats, but not the userlist.<br><br>' +
			'<strong>$5 or more:</strong>' +
			'<li>All of the above^' +
			'<li>A red <span style = "background: rgba(255, 26, 26, 0.5);">userlist highlight color</span>, visible on the Lobby\'s userlist');
	},

	ateam: 'adminteam',
	adminteam: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<a><center><b><font color = 075ff7 size=3>The Admin Team</font></b></center></a><br />' +
			'FAQ <br />' +
			'<b>Who are we?</b> The Admin team are a group of senior members who make most of the major league decisions and organize most major league events. <br />' +
			'<b>Who\'s in the Admin Team?</b> <a href="http://sora.cu.cc/ateam.html"><button style="background: #FF4747 ; border: 1px solid #FF0000">Current active members</button></a><br />' +
			'<b>What exactly do you guys do?</b> The Admin Team handle or oversee all matters from disputes in the League, to League Challenge Registration <br />' +
			'<b>How does one join the Admin team?</b> The Admin Team usually invites a select few senior members who\'ve shown to be mature and capable of handling responsibility. <br />' +
			' <br /><br />' +
			'<center><img src="http://sora.cu.cc/img/namelist.png"><br />'+
			'All Admin team Members can be identified by their userlist highlight and by having this symbol on their badges:</center> <br />' +
			'<center><img src="http://oi62.tinypic.com/14cfyh0.jpg"></center> <br />');
	}
};
