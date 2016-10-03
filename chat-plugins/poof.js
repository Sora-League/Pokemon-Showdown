'use strict';

const FILE = 'storage-files/poof.json';
const fs = require('fs');
let poofoff = false;
let poofs = JSON.parse(fs.readFileSync(FILE));

function randomColor() {
	let colors = ['9900f2', '4ca2ff', '4cff55', 'e87f00', 'd30007', '8e8080', 'd8b00d', '01776a', '0c4787', '0c870e', '8e892c',
		'5b5931', '660c60', '9e5a99', 'c43873', '39bf39', '7c5cd6', '76d65c', '38c9c9', '2300af', '1daf00'
	];
	return colors[Math.floor(Math.random() * colors.length)];
}
function savePoofs() {
	fs.writeFileSync(FILE, JSON.stringify(poofs, null, 1));
}

exports.commands = {
	d: 'poof',
	poof: function (target, room, user) {
		if (!this.canTalk()) return this.errorReply("You cannot poof while unable to talk.");
		if (poofoff) return this.sendReply("Poofs are currently disabled.");
		let message = poofs[Math.floor(Math.random() * poofs.length)].replace(/\(user\)/g, Chat.escapeHTML(user.name));
		this.add('|html|<center><span style = "color:#' + randomColor() + '"><b>~~ ' + message + ' ~~</b></span>');
		user.disconnectAll();
	},

	addpoof: function (target, room, user) {
		if (!this.can('hotpatch')) return false;
		if (!target) return this.parse('/help poof');
		if (poofs.map(toId).indexOf(toId(target)) > -1) return this.sendReply('That poof message already exists!');
		if (target.length > 100) return this.sendReply('Poof messages can only contain a maximum of 100 characters.');
		if (!target.match(/\(user\)/)) target = '(user) ' + target;
		poofs.push(target.trim());
		savePoofs();
		return this.sendReply('|html|"' + target + '" has been added to the list of poof messages.');
	},

	switchpoof: 'togglepoof',
	tpoof: 'togglepoof',
	togglepoof: function (target, room, user) {
		if (!this.can('hotpatch')) return false;
		poofoff = !poofoff;
		this.sendReply('Poofs have been ' + (poofoff ? 'disabled' : 'enabled') + '.');
	},

	pooflist: function (target, room, user) {
		let list = '|html|<center><b>Poof message list</b></center><br>';
		poofs.forEach(msg => {
			list += '"' + msg + '"';
			if (user.can('hotpatch')) list += '<button name = "send" value = "/deletepoof ' + msg + '" style = "font-size: 7pt;">Delete</button>';
			list += '<br>';
		});
		this.popupReply(list);
	},

	dpoof: 'deletepoof',
	deletepoof: function (target, room, user) {
		if (!target || !target.trim()) return this.parse('/help poof');
		if (poofs.length === 1) this.popupReply('|html|You cannot delete any poof messages, because there\'s only one left in the list.');
		if (!target.match(/\(user\)/)) target = '(user) ' + target;
		let pos = poofs.map(toId).indexOf(toId(target));
		if (pos === -1) return this.sendReply('That poof message doesn\'t exist.');
		this.popupReply('|html|The poof message "' + poofs[pos] + '" has been deleted.');
		poofs.splice(pos, 1);
		savePoofs();
	},
	poofhelp: [
		'-/poof - Leaves a random message in the chat and disconnects the user from the server.',
		'-/addpoof [message] - Adds a poof message into the list of possible poofs. Adding "(user)" into a poof message replaces "(user)" with a user\'s name, if that poof message is triggered. Requires ~',
		'-/togglepoof or /tpoof - Enables/Disables poofs. Requires ~',
		'-/pooflist - Displays the list of all poof messages.',
		'-/deletepoof or /dpoof [message] - Removes a poof message from the list of poof messages. Requires ~ (Note: This can be done from /pooflist)',
	],
};
