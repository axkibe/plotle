/**                            .----.          _..._
                              .  _   \      .-'_..._''.
 _____   _..._               /  ' '.  \   .' .'      '.\
\     |.'     '-.           .  '    \  ' / .'
 \     .'```'.   '. .-,.--. |  '     | '' '
  \   |       \   ||  .-. |\   \     ' /| |
   |  |        |  || |  | | `.  ` ..' / | |
   |   \      /  . | |  | |   '-...-'`  . '
   |  |\`'-.-'  .' | |  '-               \ '.          .
   |  | '-....-'   | |                    '. `._____.-'/
  .'  '.           | |                      `-.______./
  '----'           '-'
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
| Export
*/
var Proc;
Proc = Proc || {};

/**
| Imports
*/
var Jools;
var Path;
var shell;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }

/**
| Constructor
*/
var Util = Proc.Util = {};

/**
| Logins the user
*/
Util.login = function(panel) {
	panel.$sub.errL.setText('');

	var user   = panel.$sub.userI.value;
	var pass   = panel.$sub.passI.value;

	if (user.length < 4) {
		panel.$sub.errL.setText('Username too short, min. 4 characters');
		shell.setCaret('board', {
			path : new Path(['LoginPanel', 'userI']),
			at1  : user.length
		});
		return;
	}

	if (user.substr(0, 5) === 'visit') {
		panel.$sub.errL.setText('Username must not start with "visit"');
		shell.setCaret('board', {
			path : new Path(['LoginPanel', 'userI']),
			at1  : 0
		});
		return;
	}

	if (pass.length < 5) {
		panel.$sub.errL.setText('Password too short, min. 5 characters');
		shell.setCaret('board', {
			path : new Path(['LoginPanel', 'passI']),
			at1  : pass.length
		});
		return;
	}

	var passhash = shell.peer.passhash(pass);

	shell.peer.auth(user, passhash, function(res) {
		if (!res.ok) {
			panel.$sub.errL.setText(res.message);

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
	panel.$sub.errL.setText('');

	var user   = panel.$sub.userI.value;
	var email  = panel.$sub.emailI.value;
	var pass   = panel.$sub.passI.value;
	var pass2  = panel.$sub.pass2I.value;
	var code   = panel.$sub.codeI.value;

	if (user.length < 4) {
		panel.$sub.errL.setText('Username too short, min. 4 characters');
		shell.setCaret('board', {
			path : new Path(['RegPanel', 'userI']),
			at1  : user.length
		});
		return;
	}

	if (user.substr(0, 5) === 'visit') {
		panel.$sub.errL.setText('Username must not start with "visit"');
		shell.setCaret('board', {
			path : new Path(['RegPanel', 'userI']),
			at1  : 0
		});
		return;
	}

	if (pass.length < 5) {
		panel.$sub.errL.setText('Password too short, min. 5 characters');
		shell.setCaret('board', {
			path : new Path(['RegPanel', 'passI']),
			at1  : pass.length
		});
		return;
	}

	if (pass !== pass2) {
		panel.$sub.errL.setText('Passwords to not match');
		shell.setCaret('board', {
			path : new Path(['RegPanel', 'pass2I']),
			at1  : pass2.length
		});
		return;
	}

	if (code.length === 0) {
		panel.$sub.errL.setText('Invitation code missing');
		shell.setCaret('board', {
			path : new Path(['RegPanel', 'codeI']),
			at1  : pass2.length
		});
		return;
	}

	pass = shell.peer.passhash(pass);

	shell.peer.register(user, email, pass, code, function(res) {
		if (!res.ok) {
			panel.$sub.errL.setText(res.message);

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
	panel.$sub.userI.value  = '';
	panel.$sub.passI.value  = '';
	panel.$sub.userI.poke();
	panel.$sub.passI.poke();
};

/**
| Clears all fields on the register panel.
*/
Util.clearRegister = function(panel) {
	panel.$sub.userI. value = '';
	panel.$sub.emailI.value = '';
	panel.$sub.passI. value = '';
	panel.$sub.pass2I.value = '';
	panel.$sub.codeI. value = '';
	panel.$sub.userI. poke();
	panel.$sub.emailI.poke();
	panel.$sub.passI. poke();
	panel.$sub.pass2I.poke();
	panel.$sub.codeI. poke();
};

})();
