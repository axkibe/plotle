/**                                                      _.._
                                                      .-'_.._''.
 __  __   ___       _....._              .          .' .'     '.\
|  |/  `.'   `.   .'       '.          .'|         / .'                                _.._
|   .-.  .-.   ' /   .-'"'.  \        (  |        . '            .-,.-~.             .' .._|    .|
|  |  |  |  |  |/   /______\  |        | |        | |            |  .-. |    __      | '      .' |_
|  |  |  |  |  ||   __________|    _   | | .'''-. | |            | |  | | .:-`.'.  __| |__  .'     |
|  |  |  |  |  |\  (          '  .' |  | |/.'''. \. '            | |  | |/ |   \ ||__   __|'-..  .-'
|  |  |  |  |  | \  '-.___..-~. .   | /|  /    | | \ '.         .| |  '- `" __ | |   | |      |  |
|__|  |__|  |__|  `         .'.'.'| |//| |     | |  '. `.____.-'/| |      .'.''| |   | |      |  |
                   `'-.....-.'.'.-'  / | |     | |    `-._____ / | |     / /   | |_  | |      |  '.'
                                 \_.'  | '.    | '.           `  |_|     \ \._,\ '/  | |      |   /
                                       '___)   '___)                      `~~'  `"   |_|      `--'

                                       ,-.  .   .    .
                                         |  |   |- . |
                                         |  | . |  | |
                                         `--^-' `' ' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Common utilties for component code.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var Jools;
var Path;
var peer;
var shell;

/**
| Exports
*/
var CCode;
CCode = CCode || {};

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }

var debug         = Jools.debug;
var immute        = Jools.immute;
var is            = Jools.is;
var isnon         = Jools.isnon;
var isArray       = Jools.isArray;
var limit         = Jools.limit;
var log           = Jools.log;
var subclass      = Jools.subclass;


var Util = CCode.Util = {};

/**
| Logins the user
*/
Util.login = function(board) {
	board.cc.errL.text = '';
	board.cc.errL.poke();

	var user   = board.cc.userI.value;
	var pass   = board.cc.passI.value;

	if (user.length < 4) {
		board.cc.errL.text = 'Username too short, min. 4 characters';
		board.cc.errL.poke();
		shell.setCaret('cockpit', {
			path : new Path(['LoginBoard', 'userI']),
			at1  : user.length
		});
		return;
	}

	if (user.substr(0, 5) === 'visit') {
		board.cc.errL.text = 'Username must not start with "visit"';
		board.cc.errL.poke();
		shell.setCaret('cockpit', {
			path : new Path(['LoginBoard', 'userI']),
			at1  : 0
		});
		return;
	}
	
	if (pass.length < 5) {
		board.cc.errL.text = 'Password too short, min. 5 characters';
		board.cc.errL.poke();
		shell.setCaret('cockpit', {
			path : new Path(['LoginBoard', 'passI']),
			at1  : pass.length
		});
		return;
	}

	var passhash = peer.passhash(pass);

	peer.auth(user, passhash, function(res) {
		if (!res.ok) {
			board.cc.errL.text = res.message;
			board.cc.errL.poke();

			if (res.message.search(/Username/) >= 0) {
				shell.setCaret('cockpit', {
					path : new Path(['LoginBoard', 'userI']),
					at1  : user.length
				});
			} else {
				shell.setCaret('cockpit', {
					path : new Path(['LoginBoard', 'passI']),
					at1  : pass.length
				});
			}

			shell.poke();
			return;
		}

		shell.setUser(user, passhash);
		board.cockpit.setCurBoard('MainBoard');
		Util.clearLogin(board);
		shell.moveToSpace(null);
		shell.poke();
	});
};

/**
| Logouts the user
*/
Util.logout = function(board) {
	peer.logout(function(res) {
		if (!res.ok) {
			shell.greenscreen('Cannot logout: ' + res.message);
			return;
		}

		shell.setUser(res.user, res.pass);
		board.cockpit.setCurBoard('MainBoard');
		shell.moveToSpace(null);
		shell.poke();
	});
};

/**
| Registers the user
*/
Util.register = function(board) {
	board.cc.errL.text = '';
	board.cc.errL.poke();

	var user   = board.cc.userI.value;
	var email  = board.cc.emailI.value;
	var pass   = board.cc.passI.value;
	var pass2  = board.cc.pass2I.value;
	var code   = board.cc.codeI.value;

	if (user.length < 4) {
		board.cc.errL.text = 'Username too short, min. 4 characters';
		board.cc.errL.poke();
		shell.setCaret('cockpit', {
			path : new Path(['RegBoard', 'userI']),
			at1  : user.length
		});
		return;
	}

	if (user.substr(0, 5) === 'visit') {
		board.cc.errL.text = 'Username must not start with "visit"';
		board.cc.errL.poke();
		shell.setCaret('cockpit', {
			path : new Path(['RegBoard', 'userI']),
			at1  : 0
		});
		return;
	}
	
	if (pass.length < 5) {
		board.cc.errL.text = 'Password too short, min. 5 characters';
		board.cc.errL.poke();
		shell.setCaret('cockpit', {
			path : new Path(['RegBoard', 'passI']),
			at1  : pass.length
		});
		return;
	}

	if (pass !== pass2) {
		board.cc.errL.text = 'Passwords to not match';
		board.cc.errL.poke();
		shell.setCaret('cockpit', {
			path : new Path(['RegBoard', 'pass2I']),
			at1  : pass2.length
		});
		return;
	}

	if (code.length === 0) {
		board.cc.errL.text = 'Invitation code missing';
		board.cc.errL.poke();
		shell.setCaret('cockpit', {
			path : new Path(['RegBoard', 'codeI']),
			at1  : pass2.length
		});
		return;
	}

	pass = peer.passhash(pass);

	peer.register(user, email, pass, code, function(res) {
		if (!res.ok) {
			board.cc.errL.text = res.message;
			board.cc.errL.poke();

			if (res.message.search(/Username/) >= 0) {
				shell.setCaret('cockpit', {
					path : new Path(['RegBoard', 'userI']),
					at1  : pass2.length
				});
			} else if (res.message.search(/code/) >= 0) {
				shell.setCaret('cockpit', {
					path : new Path(['RegBoard', 'codeI']),
					at1  : pass2.length
				});
			}
			shell.poke();
			return;
		}

		shell.setUser(user, pass);
		board.cockpit.setCurBoard('MainBoard');
		Util.clearRegister(board);
		shell.moveToSpace(null);
		shell.poke();
	});
};

/**
| Clears all fields on the login board
*/
Util.clearLogin = function(board) {
	board.cc.userI.value  = '';
	board.cc.passI.value  = '';
	board.cc.userI.poke();
	board.cc.passI.poke();
};

/**
| Clears all fields on the register board
*/
Util.clearRegister = function(board) {
	board.cc.userI. value = '';
	board.cc.emailI.value = '';
	board.cc.passI. value = '';
	board.cc.pass2I.value = '';
	board.cc.codeI. value = '';
	board.cc.userI. poke();
	board.cc.emailI.poke();
	board.cc.passI. poke();
	board.cc.pass2I.poke();
	board.cc.codeI. poke();
};

})();
