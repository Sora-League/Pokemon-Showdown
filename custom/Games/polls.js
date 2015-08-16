var polls = exports.polls = {};

var Poll = (function () {
	function Poll(room, user, question, choices) {
		this.room = room;
		this.starter = user;
		this.question = question;
		this.users = {};
		this.options = {};
		var that = this;
		this.timer = setTimeout(function () {
			that.end();
			that.room.update();
		}, 3 * 60 * 1000); //3 minutes

		for (var i = 1; i < choices.length; i++) {
			this.options[choices[i].toLowerCase().replace(/ /g, '')] = {};
			this.options[choices[i].toLowerCase().replace(/ /g, '')].name = choices[i].trim();
			this.options[choices[i].toLowerCase().replace(/ /g, '')].count = 0;
		}

		var options = '';
		for (var i = 1; i < choices.length; i++) {
			if (!choices[i].replace(/ /g, '')) return self.sendReply('A poll option cannot be blank.');
			options += '<button name = "send" value = "/poll vote ' + choices[i] + '">' + choices[i] + '</button> ';
		}
		this.room.add('|html|<div class = "infobox"><center><font size = 2><b>' + question + '</b></font></center><br/>' +
			'<font color = "gray" size = 1><i><b>Poll started by ' + user.name + '</b></i></font><br/>' +
			'<hr>' + options);
	}

	Poll.prototype.vote = function (user, choice, self) {
		var original = choice;
		choice = choice.toLowerCase().replace(/ /g, '');
		if (!this.options[choice]) return self.sendReply("'" + original + "' is not a valid poll option.");
		for (var i = 0; i < user.getAlts().length; i++) {
			if (this.users[user.getAlts()[i]]) return self.sendReply('Your alt \'' + user.getAlts()[i] + '\' has already voted in this poll.');
		}
		for (i in this.users) {
			if (Users.get(i).getAlts().indexOf(user.userid) > -1) return self.sendReply('Your alt \'' + i + '\' has already voted in this poll.');
		}
		for (i in user.prevNames) {
			if (this.users[i] && i !== user.userid) return self.sendReply('You have already voted in this poll under another name.');
		}
		if (!this.users[user.userid]) {
			this.users[user.userid] = this.options[choice].name;
			this.options[choice].count++;
			return self.sendReply('You are now voting for \'' + this.options[choice].name + '\'');
		} else {
			if (this.users[user.userid] == this.options[choice].name) return self.sendReply("You are already voting for '" + this.options[choice].name + "'.");
			var oldvote = this.users[user.userid];
			this.users[user.userid] = this.options[choice].name;
			this.options[choice].count++;
			this.options[oldvote.toLowerCase().replace(/ /g, '')].count--;
			return self.sendReply('You are now voting for \'' + this.options[choice].name + '\' instead of \'' + oldvote + '\'.');
		}
	};

	Poll.prototype.remind = function (user, broadcasting, self) {
		var options = '';
		for (var i in this.options) {
			options += '<button name = "send" value = "/poll vote ' + this.options[i].name + '">' + this.options[i].name + '</button> ';
		}
		if (broadcasting) {
			self.sendReply('|html|<div class = "infobox"><center><font size = 2><b>' + this.question + '</b></font></center><br/>' +
				'<font color = "gray" size = 1><i><b>Poll reminded by ' + user.name + '</b></i></font><br/>' +
				'<hr>' + options);
		} else {
			self.sendReply('|html|<div class = "infobox"><center><font size = 2><b>' + this.question + '</b></font></center><br/>' +
				'<font color = "gray" size = 1><i><b>Poll started by ' + this.starter + '</b></i></font><br/>' +
				'<hr>' + options);
		}
	};

	Poll.prototype.end = function (user) {
		if (Object.keys(this.users).length < 2) {
			clearTimeout(this.timer);
			delete polls[this.room.id];
			return this.room.add('|html|<b>The poll has been canceled due to the lack of voters.');
		}
		var total = '';
		for (var i in this.options) {
			if (this.options[i].count > 0)
				total += '<li>' + this.options[i].name + ' - ' + this.options[i].count + ' (' + Math.round(((this.options[i].count) / Object.keys(this.users).length) * 100) + '%)';
		}
		var text = '<div class = "infobox"><center><font size = 2><b>Results to "' + this.question + '"</b></font></center><br/>';
		if (user) text += '<font color = "gray" size = 1><i><b>Poll ended by ' + user.name + '</b></i></font><br/>';
		this.room.add('|html|' + text + '<hr>' + total);
		clearTimeout(this.timer);
		delete polls[this.room.id];
	};
	return Poll;
})();

var cmds = {
	help: function (target, room, user) {
		this.sendReplyBox('<b><center>Poll commands</center></font></b><br />' +
			'-/poll start or /newpoll <i>Question</i>, <i>Option 1</i>, <i>Option 2</i>, <i>etc.</i> - Starts a poll in the room. Must be ranked + or higher to use.<br />' +
			'-/poll vote or /vote <i>Option</i> - Votes for one of the poll choices. <br />' +
			'-/poll remind or /prm - Displays the details of the current poll. <br />' +
			'-/poll votes or /votes - Displays the number of votes on the current poll. <br />' +
			'-/poll end or /endpoll - Ends the poll and shows the results, if enough people voted. Automatically happens 3 minutes after creation of the poll. Must be ranked + or higher to use.');
	},

	'': 'start',
	'new': 'start',
	start: function (target, room, user, connection, cmd) {
		if (!this.can('broadcast', null, room)) return this.sendReply('You must be ranked + or higher to start a poll.');
		if (polls[room.id]) return this.sendReply('There is already a poll going on in this room.');
		if (!target) return this.sendReply('/poll ' + cmd + ' [question], [option 1], [option 2], etc. - Starts a poll in the room with the given number of options.');
		target = target.split(',');
		if (target.length < 3) return this.sendReply('You need to have at least 2 different poll options.');

		polls[room.id] = new Poll(room, user, target[0], target);
	},

	end: function (target, room, user) {
		if (!polls[room.id]) return this.sendReply('There is no poll going on in this room.');
		if (!this.can('broadcast', null, room)) return this.sendReply('You must be ranked + or higher to end a poll.');

		polls[room.id].end(user, this);
	},

	vote: function (target, room, user) {
		if (!polls[room.id]) return this.sendReply('There is no poll going on in this room.');

		polls[room.id].vote(user, target, this);
	},

	remind: function (target, room, user) {
		if (!polls[room.id]) return this.sendReply('There is no poll going on in this room.');
		if (!this.canBroadcast()) return;

		polls[room.id].remind(user, this.broadcasting, this);
	},

	votes: function (target, room, user) {
		if (!polls[room.id]) return this.sendReply('There is no poll going on in this room.');
		if (!this.canBroadcast()) return;

		this.sendReplyBox('Number of votes: ' + Object.keys(polls[room.id].users).length);
	}
};

exports.commands = {
	poll: cmds,
	newpoll: 'startpoll',
	startpoll: cmds.start,
	pollhelp: 'pollcommands',
	pollcommands: cmds.help,
	vote: cmds.vote,
	prm: 'pollremind',
	pollremind: cmds.remind,
	votes: cmds.votes,
	endpoll: cmds.end
}