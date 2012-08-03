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
	var panSub = panel.$sub;

	panSub.errL.setText('');
	var user   = panSub.userI.getValue();
	var pass   = panSub.passI.getValue();

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

	var passhash = Jools.passhash(pass);

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

	var panSub = panel.$sub;

	panSub.errL.setText('');
	var user   = panSub.userI. getValue();
	var email  = panSub.emailI.getValue();
	var pass   = panSub.passI. getValue();
	var pass2  = panSub.pass2I.getValue();

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

	pass = Jools.passhash(pass);

	shell.peer.register(user, email, pass, function(res) {
		if (!res.ok) {
			panel.$sub.errL.setText(res.message);

			if (res.message.search(/Username/) >= 0) {
				shell.setCaret('board', {
					path : new Path(['RegPanel', 'userI']),
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
	var panSub = panel.$sub;
	panSub.userI.setValue('');
	panSub.passI.setValue('');
};

/**
| Clears all fields on the register panel.
*/
Util.clearRegister = function(panel) {
	var panSub = panel.$sub;
	panSub.userI. setValue('');
	panSub.emailI.setValue('');
	panSub.passI. setValue('');
	panSub.pass2I.setValue('');
};

})();
