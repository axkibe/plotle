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

                                   ,--.,-,-,-.       .  .
                                  | `-'`,| | |   ,-. |- |-.
                                  |   .  | ; | . |-' |  | |
                                  `--'   '   `-' `-' `' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Component methods, behavior definitions.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var CAccent;
var CCustom;
var CLabel;
var CInput;
var Cockpit;
var Curve;
var Jools;
var Fabric;
var Path;
var peer;
var shell;
var system;

/**
| Exports
*/
var CMeth = null;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }


var R   = Math.round;
var abs = Math.abs;
var max = Math.max;
var min = Math.min;

var debug         = Jools.debug;
var immute        = Jools.immute;
var is            = Jools.is;
var isnon         = Jools.isnon;
var isArray       = Jools.isArray;
var limit         = Jools.limit;
var log           = Jools.log;
var subclass      = Jools.subclass;

var computePoint  = Curve.computePoint;
var half          = Fabric.half;
var BeziRect      = Fabric.BeziRect;
var Point         = Fabric.Point;
var Rect          = Fabric.Rect;
var RoundRect     = Fabric.RoundRect;

/**
| Logins the user
*/
var login = function(board) {
	board.cc.errL.text = '';
	board.cc.errL.poke();

	var user   = board.cc.userI.value;
	var pass   = board.cc.passI.value;

	if (user.length < 4) {
		board.cc.errL.text = 'Username too short, min. 4 characters';
		board.cc.errL.poke();
		shell.setCaret('cockpit', {
			path : new Path(['loginboard', 'userI']),
			at1  : user.length
		});
		return;
	}

	if (user.substr(0, 5) === 'visit') {
		board.cc.errL.text = 'Username must not start with "visit"';
		board.cc.errL.poke();
		shell.setCaret('cockpit', {
			path : new Path(['loginboard', 'userI']),
			at1  : 0
		});
		return;
	}
	
	if (pass.length < 5) {
		board.cc.errL.text = 'Password too short, min. 5 characters';
		board.cc.errL.poke();
		shell.setCaret('cockpit', {
			path : new Path(['loginboard', 'passI']),
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
					path : new Path(['loginboard', 'userI']),
					at1  : user.length
				});
			} else {
				shell.setCaret('cockpit', {
					path : new Path(['loginboard', 'passI']),
					at1  : pass.length
				});
			}
			return;
		}

		shell.setUser(user, passhash);
		board.cockpit.setCurBoard('mainboard');
		clearLogin(board);
	});
};

/**
| Registers the user
*/
var register = function(board) {
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
			path : new Path(['regboard', 'userI']),
			at1  : user.length
		});
		return;
	}

	if (user.substr(0, 5) === 'visit') {
		board.cc.errL.text = 'Username must not start with "visit"';
		board.cc.errL.poke();
		shell.setCaret('cockpit', {
			path : new Path(['regboard', 'userI']),
			at1  : 0
		});
		return;
	}
	
	if (pass.length < 5) {
		board.cc.errL.text = 'Password too short, min. 5 characters';
		board.cc.errL.poke();
		shell.setCaret('cockpit', {
			path : new Path(['regboard', 'passI']),
			at1  : pass.length
		});
		return;
	}

	if (pass !== pass2) {
		board.cc.errL.text = 'Passwords to not match';
		board.cc.errL.poke();
		shell.setCaret('cockpit', {
			path : new Path(['regboard', 'pass2I']),
			at1  : pass2.length
		});
		return;
	}

	if (code.length === 0) {
		board.cc.errL.text = 'Invitation code missing';
		board.cc.errL.poke();
		shell.setCaret('cockpit', {
			path : new Path(['regboard', 'codeI']),
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
					path : new Path(['regboard', 'userI']),
					at1  : pass2.length
				});
			} else if (res.message.search(/code/) >= 0) {
				shell.setCaret('cockpit', {
					path : new Path(['regboard', 'codeI']),
					at1  : pass2.length
				});
			}
			return;
		}

		shell.setUser(user, pass);
		board.cockpit.setCurBoard('mainboard');
		clearRegister(board);
	});
};

/**
| Clears all fields on the login board
*/
var clearLogin = function(board) {
	board.cc.userI.value  = '';
	board.cc.passI.value  = '';
	board.cc.userI.poke();
	board.cc.passI.poke();
};

/**
| Clears all fields on the register board
*/
var clearRegister = function(board) {
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

/**
| The container.
*/
CMeth = {};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 +++loginMC+++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~,~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 The side button on the mainboard.
 Switches to the loginboard.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
CMeth.loginMC = {};

CMeth.loginMC.canFocus = function() {
	return true;
};

CMeth.loginMC.mousedown = function(board, ele, p, shift, ctrl) {
	board.cockpit.setCurBoard('loginboard');
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 +++registerMC+++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 The register button on the mainboard.
 Switches to the registerboard.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
CMeth.registerMC = {};

CMeth.registerMC.mousedown = function(board, ele, p, shift, ctrl) {
	board.cockpit.setCurBoard('regboard');
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 +++loginBC+++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 The login button on the loginboard.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
CMeth.loginBC = {};

CMeth.loginBC.canFocus = function() {
	return true;
};

CMeth.loginBC.specialKey = function(board, ele, key) {
	switch (key) {
	case 'down'   : board.cycleFocus(+1); return;
	case 'up'     : board.cycleFocus(-1); return;
	case 'return' : login(board);         return;
	}
};

CMeth.loginBC.mousedown = function(board, ele, p, shift, ctrl) {
	login(board);
};


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 +++regBC+++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 The register button on the regboard.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
CMeth.regBC = {};

CMeth.regBC.canFocus = function() {
	return true;
};

CMeth.regBC.input = function(board, ele, text) {
	register(board);
};

CMeth.regBC.specialKey = function(board, ele, key) {
	switch (key) {
	case 'return' : register(board); return;
	case 'down'   : board.cycleFocus(+1); return;
	case 'up'     : board.cycleFocus(-1); return;
	}
};

CMeth.regBC.mousedown = function(board, ele, p, shift, ctrl) {
	register(board);
};


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 +++cancelBC+++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 The cancel button on the loginboard and regboard.
 Switches back to the mainboard.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

CMeth.cancelBC = {};

CMeth.cancelBC.canFocus = function() {
	return true;
};

CMeth.cancelBC.input = function(board, ele, text) {
	board.cockpit.setCurBoard('mainboard');
};

CMeth.cancelBC.specialKey = function(board, ele, key) {
	switch (key) {
	case 'down' : board.cycleFocus(+1); return;
	case 'up'   : board.cycleFocus(-1); return;
	}
	if (board.name == 'regboard')   { clearRegister(board); }
	if (board.name == 'loginboard') { clearLogin(board);    }
	board.cockpit.setCurBoard('mainboard');
};

CMeth.cancelBC.mousedown = function(board, ele, p, shift, ctrl) {
	if (board.name == 'regboard') { clearRegister(board); }
	board.cockpit.setCurBoard('mainboard');
};

})();
