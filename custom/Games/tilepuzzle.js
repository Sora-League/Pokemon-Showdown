//Tile Puzzle by SilverTactic (Siiilver) and ABootToTheHead
//Thanks to ABootToTheHead for letting me use his artwork for the puzzles. You da real mvp :D

const INACTIVE_KICK_TIME = 3 * 60 * 1000; //3 minutes

if (!global.TilePuzzles) global.TilePuzzles = {};
var TilePuzzles = global.TilePuzzles;

function checkPrevNames (user) {
	for (var i in user.prevNames)
		if (toId(user.prevNames[i]) in TilePuzzles && toId(user.prevNames[i]) !== user.userid) return user.prevNames[i];
	return false;
}

function getTime (ms) {
	var total = [];
	var time = Date.now() - ms;
	var secs = Math.floor(time / 1000);
	var mins = Math.floor(secs / 60);
	if (mins) total.push(mins + ' minute' + (mins === 1 ? '' : 's'));
	if (secs %= 60) total.push(secs + ' second' + (secs === 1 ? '' : 's'));
	return total.join(' and ');
}

var tiles = [
	//froslass
	[
		'http://i.imgur.com/aOWDjKB.png', 'http://i.imgur.com/f3pdEFj.png', 'http://i.imgur.com/PQACa4o.png', 'http://i.imgur.com/cilSfXs.png',
		'http://i.imgur.com/RQAspHT.png', 'http://i.imgur.com/mdJOumj.png', 'http://i.imgur.com/l4dHZ4c.png', 'http://i.imgur.com/HJIrJu3.png',
		'http://i.imgur.com/5ZIx1Ku.png', 'http://i.imgur.com/t2hMBJn.png', 'http://i.imgur.com/1JZkruP.png', 'http://i.imgur.com/AKkFUgV.png',
		'http://i.imgur.com/3U1A9uz.png', 'http://i.imgur.com/BYsVznB.png', 'http://i.imgur.com/6h88DRj.png', 'http://i.imgur.com/zEBK5yf.png'
	],
	//mega ampharos
	[
		'http://i.imgur.com/BUOfuWb.png', 'http://i.imgur.com/GEWEHVI.png', 'http://i.imgur.com/7k8xZev.png', 'http://i.imgur.com/EYePYvD.png',
		'http://i.imgur.com/Ayjoojw.png', 'http://i.imgur.com/zImILQg.png', 'http://i.imgur.com/G2qxSXl.png', 'http://i.imgur.com/6iYbTPr.png',
		'http://i.imgur.com/WeOXhwS.png', 'http://i.imgur.com/pwdOJdo.png', 'http://i.imgur.com/hpRSMJy.png', 'http://i.imgur.com/itCpjGW.png',
		'http://i.imgur.com/ZHKnYYE.png', 'http://i.imgur.com/HkzF7Zf.png', 'http://i.imgur.com/mgA1Jgc.png', 'http://i.imgur.com/k0SHvwc.png'
	],
	//mega gardevoir
	[
		'http://i.imgur.com/FnKhIuw.png', 'http://i.imgur.com/CAhJS9Y.png', 'http://i.imgur.com/vhZcokf.png', 'http://i.imgur.com/Wh6jslP.png',
		'http://i.imgur.com/q6e7d4r.png', 'http://i.imgur.com/ZO8quaM.png', 'http://i.imgur.com/S9XhOVt.png', 'http://i.imgur.com/G656j7T.png',
		'http://i.imgur.com/jvk2WMJ.png', 'http://i.imgur.com/EDYkFTx.png', 'http://i.imgur.com/3HprrDX.png', 'http://i.imgur.com/QbArTOc.png',
		'http://i.imgur.com/pdkBHiy.png', 'http://i.imgur.com/agegAYh.png', 'http://i.imgur.com/N8ylGLP.png', 'http://i.imgur.com/80Xgi0t.png'
	]
];

var TilePuzzle = (function () {
	function TilePuzzle (user) {
		this.user = user;
		this.answer = tiles[Math.floor(Math.random() * tiles.length)];
		this.tiles = Array.create(this.answer);
		var a, b, i = this.tiles.length;
		//randmozing the array
		while (i) {
			a = Math.floor(Math.random() * i);
			b = this.tiles[--i];
			this.tiles[i] = this.tiles[a];
			this.tiles[a] = b;
		}
		
		this.display = [];
		for (var i = 0; i < this.tiles.length; i++) {
			this.display.push('<button name = "send" value = "/tilepuzzle select ' + (i + 1) + '" style = "width: 48px; height: 48px;' +
				'background: url(' + this.tiles[i] + '); vertical-align: top;' +
				'border-top: 1px solid #fff; border-left: 1px solid #fff;' + 
				'border-right: 2px solid rgba(0, 0, 0, 0.4); border-bottom: 2px solid rgba(0, 0, 0, 0.3)"></button>'
			);
		}
		this.startTime = Date.now();
		this.timer = setTimeout(this.end.bind(this, 'inactive'), INACTIVE_KICK_TIME);
	}
	TilePuzzle.prototype.update = function (message) {
		var help = '<br><button name = "send" value = "/tilepuzzle help"><small>How to Play</small></button> <button name = "send" value = "/tilepuzzle end"><small>Leave Game</small></button>';
		this.user.popup('|html|<center><div style = "width: 200px;"><b>Tile Puzzle!<b><br>' + 
			this.display.join('') + '</div>' + (message ? '<br>' + message : '') + help + '</center>'
		);
	};
	TilePuzzle.prototype.resetTimer = function () {
		clearTimeout(this.timer);
		this.timer = setTimeout(this.end.bind(this, 'inactive'), INACTIVE_KICK_TIME);
	};
	TilePuzzle.prototype.isFinished = function () {
		for (var i = 0; i < this.answer.length; i++) if (this.answer[i] !== this.tiles[i]) return false;
		return true;
	};
	TilePuzzle.prototype.getTile = function (num, border) {
		return '<button name = "send" value = "/tilepuzzle select ' + (num + 1) + '" style = "width: 48px; height: 48px;' +
			'background: url(' + this.tiles[num] + '); vertical-align: top;' +
			'border-top: 1px solid #fff; border-left: 1px solid #fff;' + 
			'border-right: 2px solid rgba(0, 0, 0, 0.5); border-bottom: 2px solid rgba(0, 0, 0, 0.4); ' + (border ? 'border:' + border : '') + '"></button>';
	};
	TilePuzzle.prototype.selectTile = function (tileNumber) {
		if (!isNaN(this.selection) && (tileNumber === this.selection)) {
			this.display[tileNumber] = this.getTile(tileNumber);
			delete this.selection;
		} else if (!isNaN(this.selection)) {
			var selectedTile = this.tiles[this.selection];
			this.tiles[this.selection] = this.tiles[tileNumber];
			this.tiles[tileNumber] = selectedTile;

			this.display[this.selection] = this.getTile(this.selection);
			this.display[tileNumber] = this.getTile(tileNumber);
			delete this.selection;
		} else {
			this.selection = tileNumber;
			this.display[tileNumber] = this.getTile(tileNumber, '1px solid red');
		}
		this.resetTimer();
		if (!this.isFinished()) this.update();
		else this.end(true);
	};
	TilePuzzle.prototype.end = function (finished) {
		if (finished === 'inactive') this.user.popup('The game of Tile Puzzle has been ended due to inactivity.');
		else if (finished) this.update('You finished the puzzle in ' + getTime(this.startTime) + '! Good job!');
		else this.user.popup('You have decided to leave the game midway.');
		clearTimeout(this.timer);
		delete TilePuzzles[this.user.userid];
	};
	return TilePuzzle;
})();

var cmds = {
	'': 'start',
	start: function (target, room, user) {
		if (TilePuzzles[user.userid]) return TilePuzzles[user.userid].update();
		if (checkPrevNames(user)) return this.errorReply("You're currently playing a game of Tile Puzzle under the username " + checkPrevNames(user) + ". Continue playing under that name.");

		TilePuzzles[user.userid] = new TilePuzzle(user);
		TilePuzzles[user.userid].update('Tip: If you accidentally close out this popup box, use <b>/tilepuzzle</b> to resume the game.');
	},

	help: function (target, room, user) {
		if (checkPrevNames(user)) return this.errorReply("You're currently playing a game of Tile Puzzle under the name " + checkPrevNames(user) + ". Continue playing under that name.");
		var help = 'Click on a tile to select it. After selecting a tile, clicking on another tile will exchange that tile with the selected tile. ' +
			'Selected tiles will have a red border. You can deselect the selected tile by clicking on it again. Rearrange the tiles to form the correct image!';
		if (TilePuzzles[user.userid]) return TilePuzzles[user.userid].update(help);
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><b>Tile Puzzle</b><br><br>' + help + '<br><button name = "send" value = "/tilepuzzle"><b>Play Now!</b></button>');
	},

	select: function (target, room, user) {
		if (checkPrevNames(user)) return this.popupReply("You're currently playing a game of Tile Puzzle under the name " + checkPrevNames(user) + ". Continue playing under that name.");
		var Game = TilePuzzles[user.userid];
		if (!Game) return this.errorReply("You aren't playing a game of Tile Puzzle right now.");
		if (!Number(target) || target.length > 2 || Number(target) < 1 || Number(target) > 16) return Game.update("Invalid tile number. You may only choose a tile number between 1 to 16.");

		Game.selectTile(Number(target) - 1);
	},

	forfeit: 'end',
	end: function (target, room, user) {
		if (checkPrevNames(user)) return this.popupReply("You're currently playing a game of Tile Puzzle under the name " + checkPrevNames(user) + ". If you want to end the game, do so under that name.");
		var Game = TilePuzzles[user.userid];
		if (!Game) return this.errorReply("You aren't playing a game of Tile Puzzle right now.");

		Game.end();
	}
};

exports.commands = {
	tilepuzzle: cmds,
	selecttile: cmds.select,
	endpuzzle: cmds.end
}
