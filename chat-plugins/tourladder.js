var Ladder = require('../ladders.js');
var tourLadder = Ladders('tournaments');

exports.commands = {
	tourelo: 'tourladder',
	tourladder: function (target, room, user) {
		if (!this.canBroadcast()) return;
		var self = this;
		if (!target || !target.trim()) {
			tourLadder.load().then(function (users) {
				if (!users.length) return self.sendReplyBox('No rated tournaments have been played yet.');
				users.sort(function (a, b) { 
					return b[1] - a[1];
				});
				var table = '<center><b><u>Tournament Ladder</u></b><br>' +
					'<table border = "1" cellspacing = "0" cellpadding = "5"><tr><th>No.</th><th>User</th><th>Elo</th>';
				for (var i = 0; i < 10; i++) {
					if (!users[i] || users[i][1] <= 1000) break;
					var user = (Users.getExact(users[i][0]) ? Users.getExact(users[i][0]).name : users[i][0]);
					table += '<tr><td><center>' + (i + 1) + '</center></td><td style = "text-align: center">' + user + '</td><td style = "text-align: center">' + Math.round(users[i][1]) + '</td></tr>';
				}
				self.sendReplyBox(table + '</table>');
			});
			return;
		}

		target = (Users.getExact(target) ? Users.getExact(target).name : target);
		if (tourLadder.indexOfUser(target) === -1) return this.sendReplyBox(target + ' has not played any rated tournaments yet.');
		tourLadder.load().then(function (users) {
			var elo = users[tourLadder.indexOfUser(target)][1];
			self.sendReplyBox(target + '\'s Tournament Elo is <b>' + Math.round(elo) + '</b>.');
		});
	},

	/*fulltourladder: function (target, room, user) {
		var self = this;
		tourLadder.load().then(function (users) {
			if (!users.length) return self.sendReplyBox('No rated tournaments have been played yet.');
			users.sort(function (a, b) { 
				return b[1] - a[1];
			});
			var table = '|html|<center><b><u>Tournament Ladder</u></b><br>' +
				'<table border = "1" cellspacing = "0" cellpadding = "5" style = "font-size: 12pt"><tr><th>No.</th><th>User</th><th>Elo</th>';
			for (var i = 0; i < users.length; i++) {
				if (!users[i] || users[i][1] <= 1000) break;
				var user = (Users.getExact(users[i][0]) ? Users.getExact(users[i][0]).name : users[i][0]);
				table += '<tr><td><center>' + (i + 1) + '</center></td><td style = "text-align: center">' + user + '</td><td style = "text-align: center">' + Math.round(users[i][1]) + '</td></tr>';
			}
			self.popupReply(table + '</table><br>' + button);
		});
	}*/
}