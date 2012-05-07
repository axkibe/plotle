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
var CCode;
var Jools;

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

var debug    = Jools.debug;
var immute   = Jools.immute;
var is       = Jools.is;
var isnon    = Jools.isnon;
var log      = Jools.log;
var subclass = Jools.subclass;
var Util     = CCode.Util;

/**
| The container.
*/
CMeth = {
	LoginBoard : {},
	MainBoard  : {},
	RegBoard   : {}
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
CMeth.LoginBoard.loginB = {

	canFocus :
	function() {
		return true;
	},

	specialKey :
	function(key) {
		switch (key) {
		case 'down'  : this.board.cycleFocus(+1);    return;
		case 'up'    : this.board.cycleFocus(-1);    return;
		case 'enter' : Util.login(this.board); return;
		}
	},
	
	input :
	function(text) {
		this.board.cockpit.setCurBoard('MainBoard');
	},

	mousedown :
	function(p, shift, ctrl) {
		Util.login(this.board);
	}
};


/**
| The cancel button switches back to the MainBoard.
*/
CMeth.LoginBoard.cancelB = {

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
		if (this.board.name == 'RegBoard'  ) { Util.clearRegister(this.board); }
		if (this.board.name == 'LoginBoard') { Util.clearLogin   (this.board); }
		this.board.cockpit.setCurBoard('MainBoard');
	},

	mousedown :
	function(p, shift, ctrl) {
		if (this.board.name == 'RegBoard') { Util.clearRegister(this.board); }
		this.board.cockpit.setCurBoard('MainBoard');
	}
};

/**
| Password input field
*/
CMeth.LoginBoard.passI = {
	keyEnter :
	function() { Util.login(this.board); }
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
CMeth.RegBoard.cancelB = CMeth.LoginBoard.cancelB;

/**
| The register button.
*/
CMeth.RegBoard.regB = {

	canFocus :
	function() { return true; },

	input :
	function(text) { Util.register(this.board); },

	specialKey :
	function(key) {
		switch (key) {
		case 'enter' : Util.register(this.board); return;
		case 'down'  : this.board.cycleFocus(+1); return;
		case 'up'    : this.board.cycleFocus(-1); return;
		}
	},

	mousedown :
	function(p, shift, ctrl) { Util.register(this.board); }
};


})();
