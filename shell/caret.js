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

                                         ,--.             .
                                        | `-' ,-. ,-. ,-. |-
                                        |   . ,-| |   |-' |
                                        `--'  `-^ '   `-' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 The virtual caret.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


/*
| Exports
*/
var Caret = null;


/*
| Imports
*/
var Jools;
var shell;
var system;


/*
| Capsule
*/
(function() {

'use strict';

if (typeof(window) === 'undefined')
	{ throw new Error('this code needs a browser!'); }


/**
| Constructor.
*/
Caret = function(section, sign, retainx, shown) {
	// the section the caret is in
	//   space or board.
	this.section = section;

	// when section is
	// space: a signature pointing to the item the caret is in
	// board: the panel and the component
	this.sign = sign;

	// x position to retain when using up/down keys.
	this.retainx = retainx;

	Jools.immute(this);

	// position cache
	this.$pos = null;

	// true if visible
	this.$shown = !!shown;

	// true when just blinked away
	this.$blinked = false;
};


/**
| If true uses getImageData() to cache the image without the caret to achieve blinking.
| Without it uses drawImage() for the whole canvas. On firefox this is paradoxically way
| faster.
*/
Caret.useGetImageData = true;

/**
| Shows the caret or resets the blink timer if already shown
*/
Caret.prototype.show = function() {
	this.$shown = true;
	this.$blinked = false;
	system.restartBlinker();
};

/**
| Hides the caret.
*/
Caret.prototype.hide = function() {
	this.$shown = false;
};

/**
| Draws or erases the caret.
*/
Caret.prototype.display = function() {
	// erases the old caret
	if (shell.$caret.$save) {
		if (Caret.useGetImageData) {
			shell.fabric.putImageData(shell.$caret.$save, shell.$caret.$screenPos);
		} else {
			shell.fabric.drawImage(shell.$caret.$save, 0, 0);
		}
		shell.$caret.$save = shell.$caret.$screenPos = null;
	}

	// draws new
	if (this.$shown && !this.$blinked && this.sign) {
		switch(this.section) {
		case 'space' : shell.$space.drawCaret();  break;
		case 'board' : shell.$board.drawCaret(); break;
		default : throw new Error('invalid section');
		}
	}
};

/**
| Switches caret visibility state.
*/
Caret.prototype.blink = function() {
	if (this.$shown) {
		this.$blinked = !this.$blinked;
		this.display();
	}
};

})();
