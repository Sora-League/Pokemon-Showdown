'use strict'

const FILE = 'storage-files/delet.json';
const fs = require('fs');
let deletoff = false;
let delets = JSON.parse(fs.readFileSync(FILE));

function saveDelets() {
	fs.writeFileSync(File, JSON.stringify(delets, null, 1));
}

exports.commands = {
	
deletthis: function (target, room, user) {
			if (!this.canTalk()) return this.errorReply("You cannot use this command");
			if (deletoff) return this.sendReply("'Delet This' are currently disabled.");
		let message = delets[Math.floor(Math.random() * delets.length)];
		this.add('|html|<center><b><img src=" ' + message + ' "></b>');
	},
	
};