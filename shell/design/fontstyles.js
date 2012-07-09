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
	ca         : {
		type   : 'FontStyle',
		family : theme.defaultFont,
		fill   : 'black',
		align  : 'center',
		base   : 'alphabetic',
	},
	cab        : {
		type   : 'FontStyle',
		family :  theme.defaultFont,
		fill   : 'black',
		align  : 'center',
		base   : 'alphabetic',
	},
	cm         : {
		type   : 'FontStyle',
		family :  theme.defaultFont,
		fill   : 'black',
		align  : 'center',
		base   : 'middle',
	},
	la         : {
		type   : 'FontStyle',
		family :  theme.defaultFont,
		fill   : 'black',
		align  : 'start',
		base   : 'alphabetic',
	},
	lac        : {
		type   : 'FontStyle',
		family :  theme.defaultFont,
		fill   : 'rgb(128, 44, 0)',
		align  : 'start',
		base   : 'alphabetic',
	},
	lah        : {
		type   : 'FontStyle',
		family :  theme.defaultFont,
		fill   : 'rgb(128, 44, 0)',
		align  : 'start',
		base   : 'alphabetic',
	},
	lahb       : {
		type   : 'FontStyle',
		family : theme.boldFont,
		fill   : 'rgb(128, 44, 0)',
		align  : 'start',
		base   : 'alphabetic',
	},
	lahr       : {
		type   : 'FontStyle',
		family :  theme.defaultFont,
		fill   : 'red',
		align  : 'start',
		base   : 'alphabetic',
	},
	lar        : {
		type   : 'FontStyle',
		family :  theme.defaultFont,
		fill   : 'red',
		align  : 'left',
		base   : 'alphabetic',
	},
	cadr       : {
		type   : 'FontStyle',
		family : theme.defaultFont,
		fill   : 'rgb(160, 0, 0)',
		align  : 'center',
		base   : 'alphabetic',
	},
	ra         : {
		type   : 'FontStyle',
		family :  theme.defaultFont,
		fill   : 'black',
		align  : 'end',
		base   : 'alphabetic',
	}
};

/**
| Gets a fontstlye by size and its code
*/
Design.fontStyle = function(size, code) {
	var base = styles[code];
	if (!base) { throw new Error('Invalid font style'); }

	var $c = base.$c;
	if (!$c) { $c = base.$c = {}; }

	var c = $c[size];
	if (c) { return c; }

	c = {};
	for (var k in base) {
        if (k === '$c') { continue; }
        c[k] = base[k];
	}
	c.size = size;

	return $c[size] = c;
};

})();
