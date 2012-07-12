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
Util.login = function(panel) {
	panel.cc.errL.text = '';
	panel.cc.errL.poke();

	var user   = panel.cc.userI.value;
	var pass   = panel.cc.passI.value;

	if (user.length < 4) {
		panel.cc.errL.text = 'Username too short, min. 4 characters';
		panel.cc.errL.poke();
		shell.setCaret('board', {
			path : new Path(['LoginPanel', 'userI']),
			at1  : user.length
		});
		return;
	}

	if (user.substr(0, 5) === 'visit') {
		panel.cc.errL.text = 'Username must not start with "visit"';
		panel.cc.errL.poke();
		shell.setCaret('board', {
			path : new Path(['LoginPanel', 'userI']),
			at1  : 0
		});
		return;
	}

	if (pass.length < 5) {
		panel.cc.errL.text = 'Password too short, min. 5 characters';
		panel.cc.errL.poke();
		shell.setCaret('board', {
			path : new Path(['LoginPanel', 'passI']),
			at1  : pass.length
		});
		return;
	}

	var passhash = shell.peer.passhash(pass);

	shell.peer.auth(user, passhash, function(res) {
		if (!res.ok) {
			panel.cc.errL.text = res.message;
			panel.cc.errL.poke();

			if (res.message.search(/Username/) >= 0) {
				shell.setCaret('board', {
					path : new Path(['LoginPanel', 'userI']),
					at1  : user.length
				});
			} else {
				shell.setCaret('board', {
					path : new Path(['LoginPanel', 'passI']),
					at1  : pass.length
				});
			}

			shell.poke();
			return;
		}

		shell.setUser(user, passhash);
		panel.board.setCurPanel('MainPanel');
		Util.clearLogin(panel);
		shell.moveToSpace(null);
		shell.poke();
	});
};

/**
| Logouts the user
*/
Util.logout = function(panel) {
	shell.peer.logout(function(res) {
		if (!res.ok) {
			shell.greenscreen('Cannot logout: ' + res.message);
			return;
		}

		shell.setUser(res.user, res.pass);
		panel.board.setCurPanel('MainPanel');
		shell.moveToSpace(null);
		shell.poke();
	});
};

/**
| Registers the user
*/
Util.register = function(panel) {
	panel.cc.errL.text = '';
	panel.cc.errL.poke();

	var user   = panel.cc.userI.value;
	var email  = panel.cc.emailI.value;
	var pass   = panel.cc.passI.value;
	var pass2  = panel.cc.pass2I.value;
	var code   = panel.cc.codeI.value;

	if (user.length < 4) {
		panel.cc.errL.text = 'Username too short, min. 4 characters';
		panel.cc.errL.poke();
		shell.setCaret('board', {
			path : new Path(['RegPanel', 'userI']),
			at1  : user.length
		});
		return;
	}

	if (user.substr(0, 5) === 'visit') {
		panel.cc.errL.text = 'Username must not start with "visit"';
		panel.cc.errL.poke();
		shell.setCaret('board', {
			path : new Path(['RegPanel', 'userI']),
			at1  : 0
		});
		return;
	}

	if (pass.length < 5) {
		panel.cc.errL.text = 'Password too short, min. 5 characters';
		panel.cc.errL.poke();
		shell.setCaret('board', {
			path : new Path(['RegPanel', 'passI']),
			at1  : pass.length
		});
		return;
	}

	if (pass !== pass2) {
		panel.cc.errL.text = 'Passwords to not match';
		panel.cc.errL.poke();
		shell.setCaret('board', {
			path : new Path(['RegPanel', 'pass2I']),
			at1  : pass2.length
		});
		return;
	}

	if (code.length === 0) {
		panel.cc.errL.text = 'Invitation code missing';
		panel.cc.errL.poke();
		shell.setCaret('board', {
			path : new Path(['RegPanel', 'codeI']),
			at1  : pass2.length
		});
		return;
	}

	pass = shell.peer.passhash(pass);

	shell.peer.register(user, email, pass, code, function(res) {
		if (!res.ok) {
			panel.cc.errL.text = res.message;
			panel.cc.errL.poke();

			if (res.message.search(/Username/) >= 0) {
				shell.setCaret('board', {
					path : new Path(['RegPanel', 'userI']),
					at1  : pass2.length
				});
			} else if (res.message.search(/code/) >= 0) {
				shell.setCaret('board', {
					path : new Path(['RegPanel', 'codeI']),
					at1  : pass2.length
				});
			}
			shell.poke();
			return;
		}

		shell.setUser(user, pass);
		panel.board.setCurPanel('MainPanel');
		Util.clearRegister(panel);
		shell.moveToSpace(null);
		shell.poke();
	});
};

/**
| Clears all fields on the login panel.
*/
Util.clearLogin = function(panel) {
	panel.cc.userI.value  = '';
	panel.cc.passI.value  = '';
	panel.cc.userI.poke();
	panel.cc.passI.poke();
};

/**
| Clears all fields on the register panel.
*/
Util.clearRegister = function(panel) {
	panel.cc.userI. value = '';
	panel.cc.emailI.value = '';
	panel.cc.passI. value = '';
	panel.cc.pass2I.value = '';
	panel.cc.codeI. value = '';
	panel.cc.userI. poke();
	panel.cc.emailI.poke();
	panel.cc.passI. poke();
	panel.cc.pass2I.poke();
	panel.cc.codeI. poke();
};

})();
