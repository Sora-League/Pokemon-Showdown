//This file should contain most of the important functions needed for doing stuff. Yeah.
var fs = require('fs');

var Core = exports.Core = {
	write: function (fileName, item, value, options, subItem) {
		//File SHOULD be a .JSON file. This is by far the best kind of file to store data in.
		fileName = 'storage-files/' + fileName + '.json';
		if (!fs.existsSync(fileName)) fs.writeFileSync(fileName, '{}');
		var file = JSON.parse(fs.readFileSync(fileName));
		if (subItem) {
			if (!file[item]) file[item] = {};
			if (!options || !file[item].subItem) file[item][subItem] = value;
			else if (options === '+') file[item][subItem] += value;
			else if (options === '-') file[item][subItem] -= value;
			else file[item][subItem] = value;
		} else {
			if (!options || !file[item]) file[item] = value;
			else if (options === '+') file[item] += value;
			else if (options === '-') file[item] -= value;
			else file[item] = value;
		}
		fs.writeFileSync(fileName, JSON.stringify(file, null, 1));
	},
	read: function (fileName, item, subItem) {
		fileName = 'storage-files/' + fileName + '.json';
		if (!fs.existsSync(fileName)) fs.writeFileSync(fileName, '{}');
		var file = JSON.parse(fs.readFileSync(fileName));
		if (subItem) {
			if (file[item]) return file[item][subItem];
		}
		return file[item] || 0;
	},
	Delete: function (fileName, item, subItem) {
		fileName = 'storage-files/' + fileName + '.json';
		if (!fs.existsSync(fileName)) return;
		var file = JSON.parse(fs.readFileSync(fileName));
		if (subItem) {
			if (file[item]) delete file[item][subItem];
		} else delete file[item];
		fs.writeFileSync(fileName, JSON.stringify(file, null, 1));
	},
	getLastSeen: function (user) {
		user = toId(user);
		var file = JSON.parse(fs.readFileSync('storage-files/lastseen.json'));
		if (!file[user]) return 'never';

		var format = function (target, word) {
			if (Math.floor(target) === 0) return '';
			if (Math.floor(target) !== 1) return target + ' ' + word + "s";
			return target + ' ' + word;
		}
		var rawDate = Date.now() - Number(file[user]);
		var seconds = Math.floor(rawDate / 1000);
		var mins = Math.floor(seconds / 60);
		var hours = Math.floor(mins / 60);
		var days = Math.floor(hours / 24);
		
		var total = [];
		if (format(days, 'day')) total.push(format(days, 'day'));
		if (format(hours % 24, 'hour')) total.push(format(hours % 24, 'hour'));
		if (format(mins % 60, 'minute')) total.push(format(mins % 60, 'minute'));
		if (!format(days, 'day')) total.push(format(seconds % 60, 'second'));
		return total.join(', ');
	},
	color: function (name) {
		function MD5(e) { function t(e, t) { var n, r, i, s, o; i = e & 2147483648; s = t & 2147483648; n = e & 1073741824; r = t & 1073741824; o = (e & 1073741823) + (t & 1073741823); return n & r ? o ^ 2147483648 ^ i ^ s : n | r ? o & 1073741824 ? o ^ 3221225472 ^ i ^ s : o ^ 1073741824 ^ i ^ s : o ^ i ^ s } function n(e, n, r, i, s, o, u) { e = t(e, t(t(n & r | ~n & i, s), u)); return t(e << o | e >>> 32 - o, n) } function r(e, n, r, i, s, o, u) { e = t(e, t(t(n & i | r & ~i, s), u)); return t(e << o | e >>> 32 - o, n) } function i(e, n, r, i, s, o, u) { e = t(e, t(t(n ^ r ^ i, s), u)); return t(e << o | e >>> 32 - o, n) } function s(e, n, r, i, s, o, u) { e = t(e, t(t(r ^ (n | ~i), s), u)); return t(e << o | e >>> 32 - o, n) } function o(e) { var t = "",     n = "",     r; for (r = 0; r <= 3; r++) n = e >>> r * 8 & 255, n = "0" + n.toString(16), t += n.substr(n.length - 2, 2); return t } var u = [], a, f, l, c, h, p, d, v, e = function(e) {     for (var e = e.replace(/\r\n/g, "\n"), t = "", n = 0; n < e.length; n++) {  var r = e.charCodeAt(n);  r < 128 ? t += String.fromCharCode(r) : (r > 127 && r < 2048 ? t += String.fromCharCode(r >> 6 | 192) : (t += String.fromCharCode(r >> 12 | 224), t += String.fromCharCode(r >> 6 & 63 | 128)), t += String.fromCharCode(r & 63 | 128))     }     return t }(e), u = function(e) {     var t, n = e.length;     t = n + 8;     for (var r = ((t - t % 64) / 64 + 1) * 16, i = Array(r - 1), s = 0, o = 0; o < n;) t = (o - o % 4) / 4, s = o % 4 * 8, i[t] |= e.charCodeAt(o) << s, o++;     i[(o - o % 4) / 4] |= 128 << o % 4 * 8;     i[r - 2] = n << 3;     i[r - 1] = n >>> 29;     return i }(e); h = 1732584193; p = 4023233417; d = 2562383102; v = 271733878; for (e = 0; e < u.length; e += 16) a = h, f = p, l = d, c = v, h = n(h, p, d, v, u[e + 0], 7, 3614090360), v = n(v, h, p, d, u[e + 1], 12, 3905402710), d = n(d, v, h, p, u[e + 2], 17, 606105819), p = n(p, d, v, h, u[e + 3], 22, 3250441966), h = n(h, p, d, v, u[e + 4], 7, 4118548399), v = n(v, h, p, d, u[e + 5], 12, 1200080426), d = n(d, v, h, p, u[e + 6], 17, 2821735955), p = n(p, d, v, h, u[e + 7], 22, 4249261313), h = n(h, p, d, v, u[e + 8], 7, 1770035416), v = n(v, h, p, d, u[e + 9], 12, 2336552879), d = n(d, v, h, p, u[e + 10], 17, 4294925233), p = n(p, d, v, h, u[e + 11], 22, 2304563134), h = n(h, p, d, v, u[e + 12], 7, 1804603682), v = n(v, h, p, d, u[e + 13], 12, 4254626195), d = n(d, v, h, p, u[e + 14], 17, 2792965006), p = n(p, d, v, h, u[e + 15], 22, 1236535329), h = r(h, p, d, v, u[e + 1], 5, 4129170786), v = r(v, h, p, d, u[e + 6], 9, 3225465664), d = r(d, v, h, p, u[e + 11], 14, 643717713), p = r(p, d, v, h, u[e + 0], 20, 3921069994), h = r(h, p, d, v, u[e + 5], 5, 3593408605), v = r(v, h, p, d, u[e + 10], 9, 38016083), d = r(d, v, h, p, u[e + 15], 14, 3634488961), p = r(p, d, v, h, u[e + 4], 20, 3889429448), h = r(h, p, d, v, u[e + 9], 5, 568446438), v = r(v, h, p, d, u[e + 14], 9, 3275163606), d = r(d, v, h, p, u[e + 3], 14, 4107603335), p = r(p, d, v, h, u[e + 8], 20, 1163531501), h = r(h, p, d, v, u[e + 13], 5, 2850285829), v = r(v, h, p, d, u[e + 2], 9, 4243563512), d = r(d, v, h, p, u[e + 7], 14, 1735328473), p = r(p, d, v, h, u[e + 12], 20, 2368359562), h = i(h, p, d, v, u[e + 5], 4, 4294588738), v = i(v, h, p, d, u[e + 8], 11, 2272392833), d = i(d, v, h, p, u[e + 11], 16, 1839030562), p = i(p, d, v, h, u[e + 14], 23, 4259657740), h = i(h, p, d, v, u[e + 1], 4, 2763975236), v = i(v, h, p, d, u[e + 4], 11, 1272893353), d = i(d, v, h, p, u[e + 7], 16, 4139469664), p = i(p, d, v, h, u[e + 10], 23, 3200236656), h = i(h, p, d, v, u[e + 13], 4, 681279174), v = i(v, h, p, d, u[e + 0], 11, 3936430074), d = i(d, v, h, p, u[e + 3], 16, 3572445317), p = i(p, d, v, h, u[e + 6], 23, 76029189), h = i(h, p, d, v, u[e + 9], 4, 3654602809), v = i(v, h, p, d, u[e + 12], 11, 3873151461), d = i(d, v, h, p, u[e + 15], 16, 530742520), p = i(p, d, v, h, u[e + 2], 23, 3299628645), h = s(h, p, d, v, u[e + 0], 6, 4096336452), v = s(v, h, p, d, u[e + 7], 10, 1126891415), d = s(d, v, h, p, u[e + 14], 15, 2878612391), p = s(p, d, v, h, u[e + 5], 21, 4237533241), h = s(h, p, d, v, u[e + 12], 6, 1700485571), v = s(v, h, p, d, u[e + 3], 10, 2399980690), d = s(d, v, h, p, u[e + 10], 15, 4293915773), p = s(p, d, v, h, u[e + 1], 21, 2240044497), h = s(h, p, d, v, u[e + 8], 6, 1873313359), v = s(v, h, p, d, u[e + 15], 10, 4264355552), d = s(d, v, h, p, u[e + 6], 15, 2734768916), p = s(p, d, v, h, u[e + 13], 21, 1309151649), h = s(h, p, d, v, u[e + 4], 6, 4149444226), v = s(v, h, p, d, u[e + 11], 10, 3174756917), d = s(d, v, h, p, u[e + 2], 15, 718787259), p = s(p, d, v, h, u[e + 9], 21, 3951481745), h = t(h, a), p = t(p, f), d = t(d, l), v = t(v, c); return (o(h) + o(p) + o(d) + o(v)).toLowerCase() } function hslToRgb(e, t, n) { var r, i, s, o, u, a; if (!isFinite(e)) e = 0; if (!isFinite(t)) t = 0; if (!isFinite(n)) n = 0; e /= 60; if (e < 0) e = 6 - -e % 6; e %= 6; t = Math.max(0, Math.min(1, t / 100)); n = Math.max(0, Math.min(1, n / 100)); u = (1 - Math.abs(2 * n - 1)) * t; a = u * (1 - Math.abs(e % 2 - 1)); if (e < 1) { r = u; i = a; s = 0 } else if (e < 2) { r = a; i = u; s = 0 } else if (e < 3) { r = 0; i = u; s = a } else if (e < 4) { r = 0; i = a; s = u } else if (e < 5) { r = a; i = 0; s = u } else { r = u; i = 0; s = a } o = n - u / 2; r = Math.round((r + o) * 255); i = Math.round((i + o) * 255); s = Math.round((s + o) * 255); return { r: r, g: i, b: s } } function rgbToHex(e, t, n) { return toHex(e) + toHex(t) + toHex(n) } function toHex(e) { if (e == null) return "00"; e = parseInt(e); if (e == 0 || isNaN(e)) return "00"; e = Math.max(0, e); e = Math.min(e, 255); e = Math.round(e); return "0123456789ABCDEF".charAt((e - e % 16) / 16) + "0123456789ABCDEF".charAt(e % 16) } var colorCache = {}; var hashColor = function(e) { if (colorCache[e]) return colorCache[e]; var t = MD5(e); var n = parseInt(t.substr(4, 4), 16) % 360; var r = parseInt(t.substr(0, 4), 16) % 50 + 50; var i = parseInt(t.substr(8, 4), 16) % 20 + 25; var s = hslToRgb(n, r, i); colorCache[e] = "#" + rgbToHex(s.r, s.g, s.b); return colorCache[e] } 
		return hashColor(name);
	}
};

//Extra edits

function getTells (user) {
	var tells = Core.read('tells', user.userid);
	if (!tells || !tells.length) return;
	for (var i = 0; i < tells.length; i++) {
		user.send('|pm| Tells|' + user.getIdentity() + '|/html ' + tells[i]);
	}
	Core.Delete('tells', user.userid);
}
Users.User.prototype.onDisconnect = function (connection) {
	if (this.named) Core.write('lastseen', this.userid, Date.now());
	for (var i = 0; i < this.connections.length; i++) {
		if (this.connections[i] === connection) {
			// console.log('DISCONNECT: ' + this);
			if (this.connections.length <= 1) {
				this.markInactive();
				if (!this.authenticated) {
					this.group = Config.groupsranking[0];
					this.isStaff = false;
				}
			}
			for (var j in connection.rooms) {
				this.leaveRoom(connection.rooms[j], connection, true);
			}
			--this.ips[connection.ip];
			this.connections.splice(i, 1);
			break;
		}
	}
	if (!this.connections.length) {
		for (var i in this.roomCount) {
			if (this.roomCount[i] > 0) {
				console.log('!! room miscount: ' + i + ' not left');
				Rooms.get(i, 'lobby').onLeave(this);
			}
		}
		this.roomCount = {};
		if (!this.named && Object.isEmpty(this.prevNames)) {
			this.destroy();
		}
	}
};

Users.User.prototype.disconnectAll = function () {
	if (this.named) Core.write('lastseen', this.userid, Date.now());
	for (var roomid in this.mutedRooms) {
		clearTimeout(this.mutedRooms[roomid]);
		delete this.mutedRooms[roomid];
	}
	this.clearChatQueue();
	var connection = null;
	this.markInactive();
	for (var i = 0; i < this.connections.length; i++) {
		connection = this.connections[i];
		for (var j in connection.rooms) {
			this.leaveRoom(connection.rooms[j], connection, true);
		}
		connection.destroy();
		--this.ips[connection.ip];
	}
	if (this.connections.length) {
		console.log('!! failed to drop all connections for ' + this);
		this.connections = [];
	}
	for (var i in this.roomCount) {
		if (this.roomCount[i] > 0) {
			console.log('!! room miscount: ' + i + ' not left');
			Rooms.get(i, 'lobby').onLeave(this);
		}
	}
	this.roomCount = {};
};

Rooms.GlobalRoom.prototype.onRename = function (user, oldid, joining) {
	if (user.named && toId(oldid) != toId(user)) {
		Core.write('lastseen', user.userid, Date.now());
		Core.write('lastseen', toId(oldid), Date.now());
	}
	delete this.users[oldid];
	this.users[user.userid] = user;
	getTells(user);
	return user;
};

Rooms.GlobalRoom.prototype.onJoin = function (user, connection, merging) {
	if (!user) return false; // ???
	if (this.users[user.userid]) return user;

	this.users[user.userid] = user;
	if (++this.userCount > this.maxUsers) {
		this.maxUsers = this.userCount;
		this.maxUsersDate = Date.now();
	}

	if (!merging) {
		var initdata = '|updateuser|' + user.name + '|' + (user.named ? '1' : '0') + '|' + user.avatar + '\n';
		connection.send(initdata + this.formatListText);
		if (this.chatRooms.length > 2) connection.send('|queryresponse|rooms|null'); // should display room list
	}
	
	getTells(user);
	return user;
};

Users.User.prototype.hasSysopAccess = function () {
	//go ahead and add in a comma separated list of names in the array below. 
	//Remember, ONLY give Sysop access to people you absolutely trust.
	var systemOperators = ['femalegallade', 'champinnah', 'onyxeagle', 'siiilver', 'frntierblade'];
	if (systemOperators.map(toId).indexOf(this.userid) > -1) {
		return true;
	}
	return false;
};

Users.prototype.chat = function (message, room, connection) {
	var now = new Date().getTime();

	if (message.substr(0, 16) === '/cmd userdetails') {
		// certain commands are exempt from the queue
		ResourceMonitor.activeIp = connection.ip;
		room.chat(this, message, connection);
		ResourceMonitor.activeIp = null;
		return false; // but end the loop here
	}

	if (this.chatQueueTimeout) {
		if (!this.chatQueue) this.chatQueue = []; // this should never happen
		if (this.chatQueue.length >= THROTTLE_BUFFER_LIMIT - 1) {
			connection.sendTo(room, '|raw|' +
				"<strong class=\"message-throttle-notice\">Your message was not sent because you've been typing too quickly.</strong>"
			);
			return false;
		} else {
			this.chatQueue.push([message, room, connection]);
		}
	} else if (now < this.lastChatMessage + THROTTLE_DELAY) {
		this.chatQueue = [
			[message, room, connection]
		];
		this.chatQueueTimeout = setTimeout(
			this.processChatQueue.bind(this), THROTTLE_DELAY);
	} else {
		this.lastChatMessage = now;
		ResourceMonitor.activeIp = connection.ip;
		room.chat(this, message, connection);
		ResourceMonitor.activeIp = null;
	}
};

Users.User.prototype.resetName = function () {
		Core.write('lastseen', this.userid, Date.now());
		var name = 'Guest ' + this.guestNum;
		var userid = toId(name);
		if (this.userid === userid) return;

		var i = 0;
		while (Users.users[userid] && Users.users[userid] !== this) {
			this.guestNum++;
			name = 'Guest ' + this.guestNum;
			userid = toId(name);
			if (i > 1000) return false;
		}

		// MMR is different for each userid
		this.mmrCache = {};
		Rooms.global.cancelSearch(this);

		if (this.named) this.prevNames[this.userid] = this.name;
		delete Users.prevUsers[userid];
		Users.prevUsers[this.userid] = userid;

		this.name = name;
		var oldid = this.userid;
		delete Users.users[oldid];
		this.userid = userid;
		Users.users[this.userid] = this;
		this.registered = false;
		this.group = Config.groupsranking[0];
		this.isStaff = false;
		this.isSysop = false;

		for (var i = 0; i < this.connections.length; i++) {
			// console.log('' + name + ' renaming: connection ' + i + ' of ' + this.connections.length);
			var initdata = '|updateuser|' + this.name + '|' + (false ? '1' : '0') + '|' + this.avatar;
			this.connections[i].send(initdata);
		}
		this.named = false;
		for (var i in this.roomCount) {
			Rooms.get(i, 'lobby').onRename(this, oldid, false);
		}
		return true;
};
