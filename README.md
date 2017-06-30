THE SORA LEAGUE<br>
DECOMMISSIONED ON FRIDAY 30TH OF JUNE AT 01:00 AEST
=========================================================================
We would like to thank every trainer that has visited Sora over the last 4 years, it has been an amazing ride and would have never been possible without you guys. These codes are now saved as legacy for preserving a small slice of our lives, the Sora legacy has come to an end and so we would like to ask you not to replicate Sora in any manners as a sign of respect for the work achieved here. These codes are available for you to view as you please to gain an insight into the various custom built features for the server and if you wanted to reference your scores. Please visit our website for further information on our closure: [soraleague.github.io][1]

I would like to thank everyone over the years, especially the Admin Team who made this all possible and Silvy the mastermind behind most of our custom features. It has been an incredible journey for me, I will be taking a break from creative design but I will be back with a new project in the future. You can follow me on [Twitter@Blazing360TSL][2] to get updates on what I'll be working on and here is my [extended memo][3] on what the past 4 years have meant for me.

[1]: http://soraleague.github.io/
  [2]: https://twitter.com/Blazing360TSL
  [3]: http://soraleague.github.io/memos/blade.html

It's been an honour<br>
Newton Q [ΔSora BladeΔ]<br>
Lead Development and Sysadmin on The Sora League<br>

Signed: Friday 30th of June at 16:19 AEST

------------------------------------------------------------------------
Pokémon Showdown
========================================================================

Navigation: [Website][4] | **Server repository** | [Client repository][5] | [Dex repository][6]

  [4]: http://pokemonshowdown.com/
  [5]: https://github.com/Zarel/Pokemon-Showdown-Client
  [6]: https://github.com/Zarel/Pokemon-Showdown-Dex

[![Build Status](https://travis-ci.org/Zarel/Pokemon-Showdown.svg)](https://travis-ci.org/Zarel/Pokemon-Showdown)
[![Dependency Status](https://david-dm.org/zarel/Pokemon-Showdown.svg)](https://david-dm.org/zarel/Pokemon-Showdown)
[![devDependency Status](https://david-dm.org/zarel/Pokemon-Showdown/dev-status.svg)](https://david-dm.org/zarel/Pokemon-Showdown#info=devDependencies)

Introduction
------------------------------------------------------------------------

This is the source code for the game server of [Pokémon Showdown][7], a website for Pokémon battling. Pokémon Showdown simulates singles, doubles and triples battles in all the games out so far (Generations 1 through 7).

This repository contains the files needed to set up your own Pokémon Showdown server. Note that to set up a server, you'll also need a server computer.

You can use your own computer as a server, but for other people to connect to your computer, you'll need to expose a port (default is 8000 but you can choose a different one) to connect to, which sometimes requires [port forwarding][8] (note that this isn't possible on certain internet connections).

  [7]: http://pokemonshowdown.com/
  [8]: http://en.wikipedia.org/wiki/Port_forwarding


Installing
------------------------------------------------------------------------

    ./pokemon-showdown

(Requires Node.js 6+)


Detailed installation instructions
------------------------------------------------------------------------

Pokémon Showdown requires you to have [Node.js][9] installed, 6.x or later.

Next, obtain a copy of Pokémon Showdown. If you're reading this outside of GitHub, you've probably already done this. If you're reading this in GitHub, there's a "Clone or download" button near the top right (it's green). I recommend the "Open in Desktop" method - you need to install GitHub Desktop which is more work than "Download ZIP", but it makes it much easier to update in the long run (it lets you use the `/updateserver` command).

Pokémon Showdown is installed and run using a command line. In Mac OS X, open `Terminal` (it's in Utilities). In Windows, open `Command Prompt` (type `cmd` into the Start menu and it should be the first result). Type this into the command line:

    cd LOCATION

Replace `LOCATION` with the location Pokémon Showdown is in (ending up with, for instance, `cd "~/Downloads/Pokemon-Showdown"` or `cd "C:\Users\Bob\Downloads\Pokemon-Showdown\"`).

This will set your command line's location to Pokémon Showdown's folder. You'll have to do this each time you open a command line to run commands for Pokémon Showdown.

Copy `config/config-example.js` into `config/config.js`, and edit as you please.

Congratulations, you're done setting up Pokémon Showdown.

Now, to start Pokémon Showdown, run the command:

    node pokemon-showdown

(If you're not on Windows, we recommend doing `./pokemon-showdown` instead.)

You can also specify a port:

    node pokemon-showdown 8000

Visit your server at `http://SERVER:8000`

Replace `SERVER` with your server domain or IP. Replace `8000` with your port if it's not `8000` (the default port).

Yes, you can test even if you are behind a NAT without port forwarding: `http://localhost:8000` will connect to your local machine. Some browser setups might prevent this sort of connection, however (NoScript, for instance). If you can't get connecting locally to work in Firefox, try Chrome.

You will be redirected to `http://SERVER.psim.us`. The reason your server is visited through `psim.us` is to make it more difficult for servers to see a user's password in any form, by handling logins globally. You can embed this in an `iframe` in your website if the URL is a big deal with you.

If you truly want to host the client yourself, there is [a repository for the Pokémon Showdown Client][10]. It's not recommended for beginners, though.

  [9]: https://nodejs.org/
  [10]: https://github.com/Zarel/Pokemon-Showdown-Client


Setting up an Administrator account
------------------------------------------------------------------------

Once your server is up, you probably want to make yourself an Administrator (~) on it.

### config/usergroups.csv

To become an Administrator, create a file named `config/usergroups.csv` containing

    USER,~

Replace `USER` with the username that you would like to become an Administrator. Do not put a space between the comma and the tilde.

This username must be registered. If you do not have a registered account, you can create one using the Register button in the settings menu (it looks like a gear) in the upper-right of Pokémon Showdown.

Once you're an administrator, you can promote/demote others easily with the `/globaladmin`, `/globalleader`, `/globalmod`, etc commands.


Browser support
------------------------------------------------------------------------

Pokémon Showdown currently supports, in order of preference:

 - Chrome
 - Firefox
 - Opera
 - Safari 5+
 - IE11+
 - Chrome/Firefox/Safari for various mobile devices

Pokémon Showdown is usable, but expect degraded performance and certain features not to work in:

 - Safari 4+
 - IE9+

Pokémon Showdown is mostly developed on Chrome, and Chrome or the desktop client is required for certain features like dragging-and-dropping teams from PS to your computer. However, bugs reported on any supported browser will usually be fixed pretty quickly.


Community
------------------------------------------------------------------------

PS has a built-in chat service. Join our main server to talk to us!

You can also visit the [Pokémon Showdown forums][11] for discussion and help.

  [11]: http://www.smogon.com/forums/forums/pok%C3%A9mon-showdown.209/

If you'd like to contribute to programming and don't know where to start, feel free to check out [Ideas for New Developers][12].

  [12]: https://github.com/Zarel/Pokemon-Showdown/issues/2444


License
------------------------------------------------------------------------

Pokémon Showdown's server is distributed under the terms of the [MIT License][13].

  [13]: https://github.com/Zarel/Pokemon-Showdown/blob/master/LICENSE


Credits
------------------------------------------------------------------------

Owner

- Guangcong Luo [Zarel] - Development, Design, Sysadmin

Staff

- Chris Monsanto [chaos] - Sysadmin
- Leonardo Julca [Slayer95] - Development
- Mathieu Dias-Martins [Marty-D] - Research (game mechanics), Development
- [The Immortal] - Development

Retired Staff

- Bill Meltsner [bmelts] - Development, Sysadmin
- Cathy J. Fitzpatrick [cathyjf] - Development, Sysadmin
- Hugh Gordon [V4] - Research (game mechanics), Development
- Juanma Serrano [Joim] - Development, Sysadmin

Major Contributors

- Kevin Lau [Ascriptmaster] - Development, Art (battle animations)
- Konrad Borowski [xfix] - Development
- Quinton Lee [sirDonovan] - Development

Contributors

- Andrew Goodsell [Zracknel] - Art (battle weather backdrops)
- Bär Halberkamp [bumbadadabum] - Development
- Ben Davies [Morfent] - Development
- Ben Frengley [TalkTakesTime] - Development
- Cody Thompson [Rising_Dusk] - Development
- Ian Clail [Layell] - Art (battle graphics, sprites)
- Jacob Zimmer [SolarisFox] - Development
- Jeremy Piemonte [panpawn] - Development
- Neil Rashbrook [urkerab] - Development
- Robin Vandenbrande [Quinella] - Development
- [Ridaz] - Art (battle animations)

Special thanks

- See http://pokemonshowdown.com/credits
