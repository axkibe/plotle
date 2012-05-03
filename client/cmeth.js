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

var debug         = Jools.debug;
var immute        = Jools.immute;
var is            = Jools.is;
var isnon         = Jools.isnon;
var isArray       = Jools.isArray;
var limit         = Jools.limit;
var log           = Jools.log;
var subclass      = Jools.subclass;

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
		clearLogin(board);
		shell.poke();
	});
};

/**
| Logouts the user
*/
var logout = function(board) {
	peer.logout(function(res) {
		if (!res.ok) {
			shell.greenscreen('Cannot logout: ' + res.message);
			return;
		}

		shell.setUser(res.user, res.pass);
		board.cockpit.setCurBoard('MainBoard');
		shell.poke();
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
			return;
		}

		shell.setUser(user, pass);
		board.cockpit.setCurBoard('MainBoard');
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
CMeth = {
	LoginBoard : {},
	MainBoard  : {},
	RegBoard   : {}
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                 .                 .
 ,-,-. ,-. . ,-. |-. ,-. ,-. ,-. ,-|
 | | | ,-| | | | | | | | ,-| |   | |
 ' ' ' `-^ ' ' ' ^-' `-' `-^ '   `-^
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~,~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Left button control.
| Login/Logout
*/
CMeth.MainBoard.leftBC = {
	mousedown :
	function(p, shift, ctrl) {
		switch (this.$captionText) {
		case 'log in'  : this.board.cockpit.setCurBoard('LoginBoard'); break;
		case 'log out' : logout(this.board); break;
		default : throw new Error('unknown state of leftBC');
		}
	}

};

/**
| Switch push button
*/
CMeth.MainBoard.switchBC = {
	mousedown :
	function(p, shift, ctrl) {
		this.board.cockpit.toggleSwitch(); 
	}
}

/**
| Second left button control.
| Register
*/
CMeth.MainBoard.left2BC = {

	mousedown :
	function(p, shift, ctrl) {
		this.board.cockpit.setCurBoard('RegBoard');
	}
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 .                .                 .
 |  ,-. ,-. . ,-. |-. ,-. ,-. ,-. ,-|
 |  | | | | | | | | | | | ,-| |   | |
 `' `-' `-| ' ' ' ^-' `-' `-^ '   `-^
~ ~ ~ ~ ~,| ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
~~~~~~~~~`'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| The login button
*/
CMeth.LoginBoard.loginBC = {

	canFocus :
	function() {
		return true;
	},

	specialKey :
	function(key) {
		switch (key) {
		case 'down'  : this.board.cycleFocus(+1); return;
		case 'up'    : this.board.cycleFocus(-1); return;
		case 'enter' : login(this.board);         return;
		}
	},
	
	input :
	function(text) {
		this.board.cockpit.setCurBoard('MainBoard');
	},

	mousedown :
	function(p, shift, ctrl) {
		login(this.board);
	}
};


/**
| The cancel button switches back to the MainBoard.
*/
CMeth.LoginBoard.cancelBC = {

	canFocus :
	function() { return true; },

	input :
	function(text) {
		this.board.cockpit.setCurBoard('MainBoard');
	},

	specialKey :
	function(key) {
		switch (key) {
		case 'down' : this.board.cycleFocus(+1); return;
		case 'up'   : this.board.cycleFocus(-1); return;
		}
		if (this.board.name == 'RegBoard'  ) { clearRegister(this.board); }
		if (this.board.name == 'LoginBoard') { clearLogin   (this.board); }
		this.board.cockpit.setCurBoard('MainBoard');
	},

	mousedown :
	function(p, shift, ctrl) {
		if (this.board.name == 'RegBoard') { clearRegister(this.board); }
		this.board.cockpit.setCurBoard('MainBoard');
	}
};

/**
| Password input field
*/
CMeth.LoginBoard.passI = {
	keyEnter :
	function() { login(this.board); }
};


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 .-,--.         ,-,---.               . 
  `|__/ ,-. ,-.  '|___/ ,-. ,-. ,-. ,-| 
  )| \  |-' | |  ,|   \ | | ,-| |   | | 
  `'  ` `-' `-| `-^---' `-' `-^ '   `-^ 
~ ~ ~ ~ ~ ~ ~,| ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
~~~~~~~~~~~~~`'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| The cancel button switches back to the MainBoard.
*/
CMeth.RegBoard.cancelBC = CMeth.LoginBoard.cancelBC;

/**
| The register button.
*/
CMeth.RegBoard.regBC = {

	canFocus :
	function() { return true; },

	input :
	function(text) { register(this.board); },

	specialKey :
	function(key) {
		switch (key) {
		case 'enter' : register(this.board); return;
		case 'down'  : this.board.cycleFocus(+1); return;
		case 'up'    : this.board.cycleFocus(-1); return;
		}
	},

	mousedown :
	function(p, shift, ctrl) { register(this.board); }
};


})();
