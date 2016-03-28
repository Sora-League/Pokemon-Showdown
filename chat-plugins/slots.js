//Slot Machine by SilverTactic (Siiilver)
/*var slotGames = global.slotGames = {};

//|html|<center><div style = "height: 180px; width: 60px;"><div style = "background: url(http://i.imgur.com/qBhHpI4.png); position: absolute; width: 60px; height: 180px; background-size: cover"></div><img src = "http://i.imgur.com/XjYWRsn.png" style = "display:block"><img src = "http://i.imgur.com/XjYWRsn.png"  style = "display:block"><img src = "http://i.imgur.com/XjYWRsn.png"  style = "display:block"></div></center>
//http://accounts-cdn.9gag.com/media/avatar/20840975_100_10.jpg
var icons = {
	shellder: 'http://i.imgur.com/wlgCfhk.png', pika: 'http://i.imgur.com/bWMYans.png', ball: 'http://imgur.com/UGf8sh7.png', '7': 'http://imgur.com/XjYWRsn.png', 
	magnemite: 'http://i.imgur.com/Fh5oDFH.png', replay: 'http://i.imgur.com/lIjgSSL.png', psyduck: 'http://i.imgur.com/DLUuQK1.png'
};

function getRandomIcon () {
	var rand = Math.floor(Math.random () * 16) + 1;
	if (rand <= 4) return 'replay';
	else if (rand <= 6) return 'shellder';
	else if (rand <= 8) return 'psyduck';
	else if (rand <= 10) return 'magnemite';
	else if (rand <= 12) return 'pika';
	else if (rand <= 15) return 'ball';
	return '7';
}
function get3Random () {
	var arr = [];
	while (arr.length < 3) {
		var icon = getRandomIcon();
		if (!~arr.indexOf(icon)) arr.push(icon);
	};
	return arr;
}

var Slots = (function () {
	function Slots (user) {
		this.user = user;
		this.lands = [];
		this.started = false;
		this.reels = ['<div style = "margin-right: 5px; margin-left: 5px; display: inline-block; width: 60px;"><img src = "http://i.imgur.com/lz23dMY.gif" style = "display: block; border: 2px solid black; border-radius: 5px;"><br><button name = "send" value = "/stopreel">Stop!</button></div>',
			'<div style = "margin-right: 5px; margin-left: 5px; display: inline-block; width: 60px;"><img src = "http://i.imgur.com/lz23dMY.gif" style = "display: block; border: 2px solid black; border-radius: 5px;"><br><button name = "send" value = "/stopreel">Stop!</button></div>',
			'<div style = "margin-right: 5px; margin-left: 5px; display: inline-block; width: 60px;"><img src = "http://i.imgur.com/lz23dMY.gif" style = "display: block; border: 2px solid black; border-radius: 5px;"><br><button name = "send" value = "/stopreel">Stop!</button></div>'
		];
		this.insertedBucks = 1;
		this.user.popupReply(this.view());
	}
	Slots.prototype.insertCoin = function () {
		this.insertedBucks++;
		this.view('You have inserted a buck into the slot machine. You have inserted ' + this.insertedBucks + ' bucks so far.');
	};
	Slots.prototype.view = function (message) {
		var screen = '|html|<button name = "send" value = "hi" style = "margin: 70px 0px 0px 10px; position: absolute" ' + (this.started ? 'disabled' : '') + '>Insert Coin</button><center>';
		for (var i = 0; i < 3; i++) {
			screen += this.reel[i];
		}
		message = (message ? '<br>' + message : '');
		this.user.popupReply(screen + message + '</center>');
	};
	Slots.prototype.spin = function (num) {
		this.lands[num] = get3Random();
		this.reels[num] = '<div style = "width: 60px; margin-right: 5px; margin-left: 5px; display: inline-block">' +
			'<div style = "background: url(http://i.imgur.com/qBhHpI4.png); position: absolute; width: 60px; height: 180px; background-size: cover"></div>' +
			'<img src = "' + icons[this.lands[num][0]] + '" style = "display:block"><img src = "' + icons[this.lands[num][1]] + '"  style = "display:block"><img src = "' + icons[this.lands[num][2]] + '"  style = "display:block">' +
			'<br><button disabled>Stop!</button>';
		this.started = true;
		if (!this.checkResult()) this.view();
		else this.end(this.checkResult());
	};
	Slots.prototype.checkResult = function () {
		if (this.lands.length < 3) return false;
		if ((this.lands[0][0] === this.lands[1][0]) && (this.lands[1][0] === this.lands[2][0]) || (this.lands[0][1] === this.lands[1][1]) && (this.lands[1][1] === this.lands[2][1])
			|| (this.lands[0][2] === this.lands[1][2]) && (this.lands[1][2] === this.lands[2][2])) return "You've landed a horizontal match!";
		if ((this.lands[0][0] === this.lands[1][1]) && (this.lands[1][1] === this.lands[2][2])
			|| (this.lands[0][3] === this.lands[1][1]) && (this.lands[1][1] === this.lands[2][0])) return "You've landed a diagonal match!";
		return "You didn't land any matches... better luck next time!";
	};
	Slots.prototype.end = function (message) {
		this.started = false;
		this.view(message);
		delete slotGames(this.user.userid);
	};
	return Slots;
})();

var cmds = */