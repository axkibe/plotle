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

                             .-,--.        .-,--.             .
                              `|__/ ,-. ,-. '|__/ ,-. ,-. ,-. |
                              )| \  |-' | | ,|    ,-| | | |-' |
                              `'  ` `-' `-| `'    `-^ ' ' `-' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~,| ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                                         `'
 Design of the register panel.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var Euclid;
var theme;

/**
| Exports
*/
var Design;
Design = Design || {};

/**
| Capsule
*/
(function(){
'use strict';

var fontStyle = Design.fontStyle;

// 'magic' number to approximate ellipses with beziers
var magic      = Euclid.magic;
var mbConsts   = Design.MainPanel.consts;

/**
| Register control
*/
var regBW        = 110;
var regBH        = 110;
var regBXM       = regBW * magic / 2;
var regBYM       = regBH * magic / 2;

/**
| Close control
*/
var canrBW        = 70;
var canrBH        = 70;
var canrBXM       = canrBW * magic / 2;
var canrBYM       = canrBH * magic / 2;

var RegPanel = Design.RegPanel = { type   : 'Design' };

RegPanel.style = 'panel';

RegPanel.frame = {
	type  : 'Frame',
	pnw   : { type   : 'Point', anchor : 's', x : -512, y : -300 },
	pse   : { type   : 'Point', anchor : 's', x :  512, y :    0 }
};

RegPanel.curve = {
	type  : 'Curve',
	copse : {
	'1' : {
		type : 'MoveTo',
		to   : {
			type   : 'Point',
			anchor : 'sw',
			x      : 0,
			y      : 0
		},
		bx   : 1,
		by   : 0
	},
	'2' : {
		type :  'BeziTo',
		to   :  { type: 'Point', anchor:  'n', x: 0, y: 0 },
		c1x  :  mbConsts.C1X * 0.8, c1y  :  mbConsts.C1Y * 4,
		c2x  : -mbConsts.C2X * 0.8, c2y  :  mbConsts.C2Y * 4,
		bx:  0, by :  1
	},
	'3' : {
		type :  'BeziTo',
		to   :  { type: 'Point', anchor: 'se', x: 0, y: 0 },
		c1x  :  mbConsts.C2X * 0.8, c1y  : -mbConsts.C2Y * 4,
		c2x  : -mbConsts.C1X * 0.8, c2y  :  mbConsts.C1Y * 4,
		bx   : -1, by :  0
	}},

	ranks : [ '1', '2', '3' ]
};

RegPanel.layout = {
	type  : 'Layout',
	copse : {
	'regL'      : {
		type      : 'Label',
		text      : 'Register',
		fontStyle : fontStyle(22, 'ca'),
		pos       : { type: 'Point', anchor: 'sw', x: 120, y: -14 }
	},
	'userL' : {
		type      : 'Label',
		text      : 'username',
		fontStyle : fontStyle(16, 'ra'),
		pos       : { type: 'Point', anchor: 's', x: -155, y:  -220 }
	},
	'emailL'       : {
		type      : 'Label',
		text      : 'email',
		fontStyle : fontStyle(16, 'ra'),
		pos       : { type: 'Point', anchor: 's', x: -155, y:  -180 }
	},
	'passL'       : {
		type      : 'Label',
		text      : 'password',
		fontStyle : fontStyle(16, 'ra'),
		pos       : { type: 'Point', anchor: 's', x: -155, y:  -140 }
	},
	'pass2L'       : {
		type      : 'Label',
		text      : 'repeat password',
		fontStyle : fontStyle(16, 'ra'),
		pos       : { type: 'Point', anchor: 's', x: -155, y:  -100 }
	},
	'codeL'       : {
		type      : 'Label',
		text      : 'invitation code',
		fontStyle : fontStyle(16, 'ra'),
		pos       : { type: 'Point', anchor: 's', x: -155, y:   -60 }
	},
	'errL'        : {
		type      : 'Label',
		text      : '',
		fontStyle : fontStyle(14, 'lar'),
		pos       : { type: 'Point', anchor: 's', x: -135, y:  -255 }

	},
	'expL1' : {
		type      : 'Label',
		text      : 'meshcraft.net is still testing & developing its scalebility, ',
		fontStyle : fontStyle(12, 'la'),
		pos       : { type: 'Point', anchor: 'sw', x: 380, y:   -26 }
	},
	'expL2' : {
		type      : 'Label',
		text      : 'please email axkibe@gmail.com to request a code.',
		fontStyle : fontStyle(12, 'la'),
		pos       : { type: 'Point', anchor: 'sw', x: 380, y:   -10 }
	},
	'userI' : {
		type       : 'Input',
		code       : '',
		password   :  false,
		normaStyle : 'input',
		focusStyle : 'inputFocus',
		hoverStyle : 'input',
		hofocStyle : 'inputFocus',
		fontStyle  : fontStyle(14, 'la'),
		maxlen     : 100,
		frame      : {
			type   : 'Frame',
			pnw    : { type: 'Point', anchor: 's', x: -135, y:  -238 },
			pse    : { type: 'Point', anchor: 's', x:   95, y:  -212 }
		}
	},
	'emailI' : {
		type       : 'Input',
		code       : '',
		password   :  false,
		normaStyle : 'input',
		focusStyle : 'inputFocus',
		hoverStyle : 'input',
		hofocStyle : 'inputFocus',
		fontStyle  : fontStyle(14, 'la'),
		maxlen     : 0,
		frame      : {
			type   : 'Frame',
			pnw    : { type: 'Point', anchor: 's', x: -135, y:  -198 },
			pse    : { type: 'Point', anchor: 's', x:   95, y:  -172 }
		}
	},
	'passI' : {
		type       : 'Input',
		code       : '',
		password   :  true,
		normaStyle : 'input',
		focusStyle : 'inputFocus',
		hoverStyle : 'input',
		hofocStyle : 'inputFocus',
		fontStyle  : fontStyle(14, 'la'),
		maxlen     : 0,
		frame      : {
			type   : 'Frame',
			pnw    : { type: 'Point', anchor: 's', x: -135, y:  -158 },
			pse    : { type: 'Point', anchor: 's', x:   95, y:  -132 }
		}
	},
	'pass2I' : {
		type       : 'Input',
		code       : '',
		password   :  true,
		normaStyle : 'input',
		focusStyle : 'inputFocus',
		hoverStyle : 'input',
		hofocStyle : 'inputFocus',
		fontStyle  : fontStyle(14, 'la'),
		maxlen     : 0,
		frame      : {
			type   : 'Frame',
			pnw    : { type: 'Point', anchor: 's', x: -135, y:  -118 },
			pse    : { type: 'Point', anchor: 's', x:   95, y:   -92 }
		}
	},
	'codeI' : {
		type       : 'Input',
		code       : '',
		password   :  false,
		normaStyle : 'input',
		focusStyle : 'inputFocus',
		hoverStyle : 'input',
		hofocStyle : 'inputFocus',
		fontStyle  : fontStyle(14, 'la'),
		maxlen     : 8,
		frame      : {
			type   : 'Frame',
			pnw    : { type: 'Point', anchor: 's', x: -135, y:   -78 },
			pse    : { type: 'Point', anchor: 's', x:   95, y:   -52 }
		}
	},
	'regB'      : {
		type       : 'Button',
		code       : 'RBRegB',
		normaStyle : 'button',
		hoverStyle : 'buttonHover',
		focusStyle : 'buttonFocus',
		hofocStyle : 'buttonHofoc',
		frame      : {
			type   : 'Frame',
			pnw    : { type: 'Point', anchor: 'se', x: -360,         y: -100 - regBH },
			pse    : { type: 'Point', anchor: 'se', x: -360 + regBW, y: -100         }
		},
		caption       : {
			type      : 'Label',
			text      : 'register',
			fontStyle : fontStyle(14, 'cm'),
			pos       : { type: 'Point', anchor: 'c', x:  0, y: 0 }
		},
		curve :  {
			type  : 'Curve',
			copse : {
			'1' : {
				type : 'MoveTo',
				to   : { type: 'Point', anchor:  'n', x:  0, y:  1 },
				bx   :  0, by : 1
			},
			'2' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 'e', x: -1, y:  0 },
				c1x  :  regBXM, c1y :       0,
				c2x  :       0, c2y : -regBYM,
				bx   : -1, by:  0
			},
			'3' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 's', x:  0, y: -1 },
				c1x  :       0, c1y :  regBYM,
				c2x  :  regBXM, c2y :       0,
				bx   :  0, by: -1
			},
			'4' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 'w', x:  1, y:  0 },
				c1x  : -regBXM, c1y :       0,
				c2x  :       0, c2y :  regBYM,
				bx   :  1, by:  0
			},
			'5' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 'n', x:  0, y:  1 },
				c1x  :       0, c1y : -regBYM,
				c2x  : -regBXM, c2y :       0,
				bx   :  0, by:  1
			}},

			ranks : [ '1', '2', '3', '4', '5' ]
		}
	},
	'closeB'      : {
		type       : 'Button',
		code       : 'RBCloseB',
		normaStyle : 'button',
		hoverStyle : 'buttonHover',
		focusStyle : 'buttonFocus',
		hofocStyle : 'buttonHofoc',
		frame : {
			type  : 'Frame',
			pnw   : { type: 'Point', anchor: 'se', x: -230,          y: -60 - canrBH },
			pse   : { type: 'Point', anchor: 'se', x: -230 + canrBW, y: -60 }
		},
		caption : {
			type      : 'Label',
			text      : 'close',
			fontStyle : fontStyle(14, 'cm'),
			pos       : { type: 'Point', anchor: 'c', x:  0, y: 0 }
		},
		curve :  {
			type  : 'Curve',
			copse : {
			'1' : {
				type : 'MoveTo',
				to   : { type: 'Point', anchor:  'n', x:  0, y:  1 },
				bx   :  0, by : 1
			},
			'2' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 'e', x: -1, y:  0 },
				c1x  :  canrBXM, c1y :        0,
				c2x  :        0, c2y : -canrBYM,
				bx   : -1, by:  0
			},
			'3' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 's', x:  0, y: -1 },
				c1x  :        0, c1y :  canrBYM,
				c2x  :  canrBXM, c2y :        0,
				bx   :  0, by: -1
			},
			'4' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 'w', x:  1, y:  0 },
				c1x  : -canrBXM, c1y :       0,
				c2x  :        0, c2y : canrBYM,
				bx   :  1, by:  0
			},
			'5' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 'n', x:  0, y:  1 },
				c1x  :        0, c1y : -canrBYM,
				c2x  : -canrBXM, c2y :        0,
				bx   :  0, by:  1
			}},

			ranks : [ '1', '2', '3', '4', '5' ]
		}
	}},

	ranks : [
		'userI',
		'emailI',
		'passI',
		'pass2I',
		'codeI',
		'regB',
		'closeB',
		//'forgotB',
		'regL',
		'userL',
		'emailL',
		'passL',
		'pass2L',
		'codeL',
		'expL1',
		'expL2',
		'errL'
	]
};

})();
