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

                             .-,--.         ,-,---.               . 
                              `|__/ ,-. ,-.  '|___/ ,-. ,-. ,-. ,-| 
                              )| \  |-' | |  ,|   \ | | ,-| |   | | 
                              `'  ` `-' `-| `-^---' `-' `-^ '   `-^ 
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~,| ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                                         `'    
 Design of the register board.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var Fabric;
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
var magic     = Fabric.magic;
var mbConsts   = Design.MainBoard.consts;

/**
| Register control
*/
var regBCW        = 110;
var regBCH        = 110;
var regBCXM       = regBCW * magic / 2;
var regBCYM       = regBCH * magic / 2;

/**
| Cancel control
*/
var canrBCW        = 70;
var canrBCH        = 70;
var canrBCXM       = canrBCW * magic / 2;
var canrBCYM       = canrBCH * magic / 2;

Design.RegBoard = { type   : 'Design' };

Design.RegBoard.frame = {
	type  : 'Frame',
	pnw   : { type   : 'Point', anchor : 's', x : -512, y : -300 },
	pse   : { type   : 'Point', anchor : 's', x :  512, y :    0 }
};

Design.RegBoard.curve = {
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

Design.RegBoard.layout = {
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
	'expL' : {
		type      : 'Label',
		text      : 'meshcraft.net is still testing & developing its scalebility, '+
					'please email axkibe@gmail.com to request a code.',
		fontStyle : fontStyle(12, 'la'),
		pos       : { type: 'Point', anchor: 'sw', x: 380, y:   -15 }
	},
	'userI' : {
		type       : 'Input',
		password   :  false,
		normaStyle : 'input',
		focusStyle : 'inputfocus',
		hoverStyle : 'input',
		hofocStyle : 'inputfocus',
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
		password   :  false,
		normaStyle : 'input',
		focusStyle : 'inputfocus',
		hoverStyle : 'input',
		hofocStyle : 'inputfocus',
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
		password   :  true,
		normaStyle : 'input',
		focusStyle : 'inputfocus',
		hoverStyle : 'input',
		hofocStyle : 'inputfocus',
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
		password   :  true,
		normaStyle : 'input',
		focusStyle : 'inputfocus',
		hoverStyle : 'input',
		hofocStyle : 'inputfocus',
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
		password   :  false,
		normaStyle : 'input',
		focusStyle : 'inputfocus',
		hoverStyle : 'input',
		hofocStyle : 'inputfocus',
		fontStyle  : fontStyle(14, 'la'),
		maxlen     : 8,
		frame      : {
			type   : 'Frame',
			pnw    : { type: 'Point', anchor: 's', x: -135, y:   -78 },
			pse    : { type: 'Point', anchor: 's', x:   95, y:   -52 }
		}
	},
	'regBC'      : {
		type       : 'Custom',
		code       : 'rbRegB',
		normaStyle : 'button',
		hoverStyle : 'buttonHover',
		focusStyle : 'buttonFocus',
		hofocStyle : 'buttonHofoc',
		frame      : {
			type   : 'Frame',
			pnw    : { type: 'Point', anchor: 'se', x: -360,          y: -100 - regBCH   },
			pse    : { type: 'Point', anchor: 'se', x: -360 + regBCW, y: -100            }
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
				c1x  :  regBCXM, c1y :        0,
				c2x  :        0, c2y : -regBCYM,
				bx   : -1, by:  0
			},
			'3' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 's', x:  0, y: -1 },
				c1x  :        0, c1y :  regBCYM,
				c2x  :  regBCXM, c2y :        0,
				bx   :  0, by: -1
			},
			'4' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 'w', x:  1, y:  0 },
				c1x  : -regBCXM, c1y :        0,
				c2x  :        0, c2y :  regBCYM,
				bx   :  1, by:  0
			},
			'5' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 'n', x:  0, y:  1 },
				c1x  :        0, c1y : -regBCYM,
				c2x  : -regBCXM, c2y :        0,
				bx   :  0, by:  1
			}},

			ranks : [ '1', '2', '3', '4', '5' ]
		}
	},
	'cancelBC'     : {
		type       : 'Custom',
		code       : 'rbCancelB',
		normaStyle : 'button',
		hoverStyle : 'buttonHover',
		focusStyle : 'buttonFocus',
		hofocStyle : 'buttonHofoc',
		frame : {
			type  : 'Frame',
			pnw   : { type: 'Point', anchor: 'se', x: -230,           y: -60 - canrBCH },
			pse   : { type: 'Point', anchor: 'se', x: -230 + canrBCW, y: -60 }
		},
		caption : {
			type      : 'Label',
			text      : 'cancel',
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
				c1x  :  canrBCXM, c1y :         0,
				c2x  :         0, c2y : -canrBCYM,
				bx   : -1, by:  0
			},
			'3' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 's', x:  0, y: -1 },
				c1x  :         0, c1y :  canrBCYM,
				c2x  :  canrBCXM, c2y :         0,
				bx   :  0, by: -1
			},
			'4' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 'w', x:  1, y:  0 },
				c1x  : -canrBCXM, c1y :        0,
				c2x  :         0, c2y : canrBCYM,
				bx   :  1, by:  0
			},
			'5' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 'n', x:  0, y:  1 },
				c1x  :         0, c1y : -canrBCYM,
				c2x  : -canrBCXM, c2y :         0,
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
		'regBC',
		'cancelBC',
		//'forgotBC',
		'regL',
		'userL',
		'emailL',
		'passL',
		'pass2L',
		'codeL',
		'expL',
		'errL'
	]
};

})();
