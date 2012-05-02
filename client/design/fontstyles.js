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

                            .-,--'        .  .---. .      .
                             \|__ ,-. ,-. |- \___  |- . . |  ,-. ,-.
                              |   | | | | |      \ |  | | |  |-' `-.
                             `'   `-' ' ' `' `---' `' `-| `' `-' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~/| ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                                                      `-'
 Shortcuts for fontstyles

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var theme;

/**
| Exports
*/
var Design;
Design = Design || { };

/**
| Capsule
*/
(function(){
'use strict';

var styles = {
	ca        : {
		type  : 'FontStyle',
		font  : theme.defaultFont,
		fill  : 'black',
		align : 'center',
		base  : 'alphabetic',
		$c    : {}
	},
	cab       : {
		type  : 'FontStyle',
		font  : 'bold ' + theme.defaultFont,
		fill  : 'black',
		align : 'center',
		base  : 'alphabetic',
		$c    : {}
	},
	cm        : {
		type  : 'FontStyle',
		font  :  theme.defaultFont,
		fill  : 'black',
		align : 'center',
		base  : 'middle',
		$c    : {}
	},
	la        : {
		type  : 'FontStyle',
		font  :  theme.defaultFont,
		fill  : 'black',
		align : 'start',
		base  : 'alphabetic',
		$c    : {}
	},
	lar       : {
		type  : 'FontStyle',
		font  :  theme.defaultFont,
		fill  : 'red',
		align : 'left',
		base  : 'alphabetic',
		$c    : {}
	},
	ra        : {
		type  : 'FontStyle',
		font  :  theme.defaultFont,
		fill  : 'black',
		align : 'end',
		base  : 'alphabetic',
		$c    : {}
	}
};

Design.fontStyle = function(size, code) {
	var base = styles[code];
	if (!base) { throw new Error('Invalid font style'); }
	if (base.$c[size]) { return base.$c[size]; }
	var c = {};
	for (var k in base) {
		if (k === '$c') continue;
		c[k] = base[k];
	}
	c.size = size;
	c.style = size + 'px ' + c.font;
	return base.$c[size] = c;
};

})();
