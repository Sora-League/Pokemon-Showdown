/*Hangman script, blah blah blah. Hope you guys like it. :)
~ SilverTactic (Siiilver)*/
 
var hangman = exports.hangman = {};
 
function hasGuessedWord (user, object) {
        for (var i in object)
                if ((object[i] === Users.get(user).userid || !Users.get(user).getAlts().map(toId).indexOf(object[i]) > -1) && i.length > 1) return true;
        return false;
}
 
var Hangman = (function () {
        function Hangman(room, starter, word, hint) {
                this.answer = toId(word);
                this.hint = hint;
                this.room = room;
                this.starter = Users.get(starter).name;
                this.guessed = {};
                this.chances = 6;
                this.letters = {};
                this.correctguesses = 0;
 
                word = toId(word);
                var blanks = '';
                for (var i = 0; i < word.length; i++) {
                        if (!this.letters[word[i]]) this.letters[word[i]] = {};
                        if (!this.letters[word[i]].position) this.letters[word[i]].position = [];
                        this.letters[word[i]].position.push(i + 1);
                        if (word[i] === 'a' || word[i] === 'e' || word[i] === 'i' || word[i] === 'o' || word[i] === 'u') blanks += '<font color = "red"> _ </font>';
                        else blanks += ' _ ';
                }
                Rooms.rooms[room.id].add('|html|<div class = "infobox"><center><b><font size = 2>' + Users.get(starter).name + ' has started a game of hangman!</b></font><br/><br/>' +
                        'The word has <b>' + word.length + '</b> letters.<br/><br/><font size = 2>' + blanks + '</font><br/><br/>' +
                        '<b>Hint:</b> ' + this.hint);
        }
 
        Hangman.prototype.guessword = function (user, word) {
                user = Users.get(user);
                if (this.guessed[word]) return user.sendTo(this.room, 'That word has already been guessed!');
                if (hasGuessedWord(user, this.guessed)) return user.sendTo(this.room, 'You can only guess the entire word once per game.');
                if (this.answer !== word) {
                        this.chances--;
                        if (this.chances === 0) {
                                this.room.add('|html|<b>' + user.name + '</b> guessed the word <b>\'' + word + '\'</b> but was not the correct answer. The man has been hanged for failing to guess the word.');
                                delete hangman[this.room.id];
                        } else {
                                this.room.add('|html|<b>' + user.name + '</b> guessed the word <b>\'' + word + '\'</b> but was not the correct answer...');
                                this.guessed[word] = toId(user);
                        }
                } else {
                        this.room.add('|html|<b>' + user.name + '</b> guessed the word <b>\'' + word + '\'</b> which is the correct answer! Congratulations!');
                        delete hangman[this.room.id];
                }
        };
 
        Hangman.prototype.guess = function (user, target) {
                user = Users.get(user);
                if (this.guessed[target]) return user.sendTo(this.room, 'That letter has already been guessed!');
                var count = 0;
                /*for (var i in this.guessed)
                        if (this.guessed[i] === user.userid || user.getAlts().indexOf(this.guessed[i]) > -1) count++;
                if (count == 3) return user.sendTo(this.room, 'You may only guess 3 times per game. Better luck next time!');*/
                //The above statement can be re-enabled if you want to limit the number of times a user can guess.
 
                if (!this.letters[target]) {
                        this.chances--;
                        if (this.chances == 0) {
                                this.room.add('|html|<b>' + user.name + '</b> guessed the letter <b>\'' + target + '\'</b> but was not in the word. The man has been hanged for failing to guess the word.');
                                delete hangman[this.room.id];
                        } else {
                                this.room.add('|html|<b>' + user.name + '</b> guessed the letter <b>\'' + target + '\'</b> but was not in the word...');
                                this.guessed[target] = user.userid;
                        }
                } else {
                        this.room.add('|html|<b>' + user.name + '</b> guessed the letter <b>\'' + target + '\'</b>, which was letter <b>' + this.letters[target].position.join("<b>, </b>") + '</b> of the word.');
                        this.guessed[target] = user.userid;
                        this.correctguesses++;
                        if (this.correctguesses === Object.keys(this.letters).length) {
                                this.room.add('|html|The word has been found! The answer is <b>\'' + this.answer + '\'</b>. Congratulations!');
                                delete hangman[this.room.id];
                        }
                }
        };
 
        Hangman.prototype.details = function () {
                        var word = '',
                                guessedletters = [];
                        for (var i = 0; i < this.answer.length; i++) {
                                if (this.guessed[this.answer[i]]) word += ' <u>' + this.answer[i] + '</u> ';
                                else if (this.answer[i] == 'a' || this.answer[i] == 'e' || this.answer[i] == 'i' || this.answer[i] == 'o' || this.answer[i] == 'u')
                                        word += '<font color = "red"> _ </font>';
                                else word += ' _ ';
                        }
                        for (var i in this.guessed)
                                guessedletters.push(i);
 
                        guessedletters = (guessedletters.length < 1) ? 'None' : guessedletters.join(', ');
                        return '<font size = 2>' + word + '</font><br/>' +
                                '<b>Guessed letters</b>: ' + guessedletters + '<br/>' +
                                '<b>Chances Left:</b> ' + this.chances + '<br/>' +
                                '<b>Hint:</b> ' + this.hint;
                },
 
                Hangman.prototype.end = function (user) {
                        this.room.add('|html|<b>The game of hangman has been ended by ' + Users.get(user).name);
                        delete hangman[this.room.id];
                };
        return Hangman;
})();
 
var commands = {
        '': 'help',
        help: function (target, room, user, connection, cmd) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox(
                        'All commands are in the format \'/hangman <i>command</i>\', that is, prefixed with /hangman.<br />' +
                        '<b>Starter/Staff commands-</b><br />' +
                        '- start <font size = 1>or</font> new <i>word, hint</i> - Starts a game of hangman in the room with the specified word as the answer along with a hint. All vowels use a red blank when displayed. (Alternate command - /starthangman) (Requires +, %, @, #)<br />' +
                        '- answer <font size = 1>or</font> word - Allows game starter to view the answer.<br />' +
                        '- end <font size = 1>or</font> delete - Ends the game of hangman in the room. (Alternate command - /endhangman) (Requires %, @, #)<br /><br />' +
                        '<b>Player commands-</b><br />' +
                        '- guess <i>letter</i> - Guesses a letter. Non-English characters cannot be guessed. (Alternate command - /guessletter)<br />' +
                        '- guessword <i>word</i> - Guesses the entire word. Can only be used by the user once per game. The answer cannot contain non-English characters. (Alternate command - /guessword)<br />' +
                        '- view <font size = 1>or</font> details - Allows you to view the details of the current game. These include the progress, the letters guessed, and the number of tries remaining. (Alternate command - /viewhangman)<br />'
                );
        },
 
        'new': 'start',
        start: function (target, room, user, connection, cmd) {
                if (!this.can('broadcast', null, room)) return this.sendReply('You must be ranked + or higher to start a game of hangman.');
                if (hangman[room.id]) return this.sendReply('There is already a game of hangman going on in this room.');
                if (!target) return this.sendReply('|html|/ ' + cmd + ' <i>word, hint</i> - Starts a game of hangman in the room with the specified word as the along with a hint.');
                var targets = target.split(',');
                var word = targets[0];
                var hint = targets[1];
                if (!toId(word)) return this.sendReply("Seriously, don't bother trying to start a game of hangman without a word.");
                if (word.match(/[^a-zA-Z]+/ig)) return this.sendReply('The word can only contain letters. Spaces, special characters, and numbers cannot be used.');
                if (toId(word).length > 15 || toId(word).length < 5) return this.sendReply('The word needs to be 5 to 15 letters long.');
                if (!hint || !hint.trim()) return this.sendReply('You need to give a hint to the answer!');
 
                hangman[room.id] = new Hangman(room, user.userid, toId(word), hint);
        },
 
        guess: function (target, room, user) {
                if (!hangman[room.id]) return this.sendReply('There is no game of hangman going on in this room.');
                if (Users.get(hangman[room.id].starter).userid === user.userid/* || Users.get(hangman[room.id].starter).getAlts().map(toId).indexOf(user.userid) > -1*/) return this.sendReply('You cannot guess if you\'re the one who started the game.');
                target = target.trim();
                if (target.length > 1) return this.sendReply('You can only guess one letter at a time.');
                if (target.match(/[^a-zA-Z]+/g)) return this.sendReply('You may only guess letters. You cannot guess numbers or special characters.');
                target = target.trim().toLowerCase();
                if (!target) return this.sendReply("|html|/hangman guess <i>letter</i> - Guesses a letter in a game of hangman.");
                if (!toId(target) || Number(target)) return this.sendReply("'" + target + "' is not a valid letter (You may only guess english letters).");
 
                hangman[room.id].guess(user.userid, toId(target));
 
        },
 
        guessword: function (target, room, user) {
                if (!hangman[room.id]) return this.sendReply('There is no game of hangman going on in this room.');
                if (Users.get(hangman[room.id].starter).userid === user.userid/* || Users.get(hangman[room.id].starter).getAlts().map(toId).indexOf(user.userid) > -1*/) return this.sendReply('You cannot guess the word if you\'re the one who started the game.');
                if (target.length < 5 || target.length > 15) return this.sendReply('Words in hangman contain a minimum of 5 letters and a maximum of 15 letters.');
                target = target.trim().toLowerCase();
                if (!target) return this.sendReply("|html|/hangman guessword <i>word</i> - Guesses the word in a game of hangman.");
                if ((toId(target) !== target) || parseInt(target)) return this.sendReply("You cannot include any special characters, spaces, or numbers in your answer.");
 
                hangman[room.id].guessword(user.userid, toId(target));
        },
 
        view: 'details',
        data: 'details',
        details: function (target, room, user) {
                if (!hangman[room.id]) return this.sendReply('There is no game of hangman going on in this room.');
                if (!this.canBroadcast()) return;
                this.sendReplyBox(hangman[room.id].details());
        },
 
        word: 'answer',
        answer: function (target, room, user) {
                if (!hangman[room.id]) return this.sendReply('There is no game of hangman going on in this room.');
                if (toId(hangman[room.id].starter) !== user.userid) return this.sendReply("Only the starter of the game can view the answer.");
                if (Users.get(hangman[room.id].starter).getAlts().map(toId).indexOf(user.userid) > -1) return this.sendReply("The game of hangman was started by your alt, " + hangman[room.id].starter + ". Use that alt/account to view the answer.");
                return this.sendReply("|html|The answer is <b>'" + hangman[room.id].answer);
        },
 
        'delete': 'end',
        finish: 'end',
        end: function (target, room, user) {
                if (!hangman[room.id]) return this.sendReply('There is no game of hangman going on in this room.');
                hangman[room.id].end(user.name);
        }
};
 
exports.commands = {
        'hangman': commands,
        starthangman: commands.start,
        guessletter: commands.guess,
        guessword: commands.guessword,
        viewhangman: commands.details,
        endhangman: commands.end
};
