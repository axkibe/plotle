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

                            ,                 ,-,---.               .
                            )   ,-. ,-. . ,-.  '|___/ ,-. ,-. ,-. ,-|
                           /    | | | | | | |  ,|   \ | | ,-| |   | |
                           `--' `-' `-| ' ' ' `-^---' `-' `-^ '   `-^
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~,| ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                                     `'
 Design of the loginboard.

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
| Login control
*/
var loginBCW   = 70;
var loginBCH   = 70;
var loginBCXM  = loginBCW * magic / 2;
var loginBCYM  = loginBCH * magic / 2;

/**
| Cancel control
*/
var cancelBCW        = 54;
var cancelBCH        = 54;
var cancelBCXM       = cancelBCW * magic / 2;
var cancelBCYM       = cancelBCH * magic / 2;

/**
| Forgot password control
*/
var forgotBCW        = 110;
var forgotBCH        = 22;
var forgotBCXM       = forgotBCW * magic;
var forgotBCYM       = forgotBCH * magic;

/**
| Login Board
*/
var LoginBoard = Design.LoginBoard = { type   : 'Design' };

LoginBoard.frame = {
	type  : 'Frame',
	pnw   : { type   : 'Point', anchor : 's', x : -512, y : -110 },
	pse   : { type   : 'Point', anchor : 's', x :  512, y :    0 }
};

LoginBoard.curve = {
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
		c1x  :  mbConsts.C1X, c1y  :  mbConsts.C1Y,
		c2x  : -mbConsts.C2X, c2y  :  mbConsts.C2Y,
		bx:  0, by :  1
	},
	'3' : {
		type :  'BeziTo',
		to   :  { type: 'Point', anchor: 'se', x: 0, y: 0 },
		c1x  :  mbConsts.C2X, c1y  : -mbConsts.C2Y,
		c2x  : -mbConsts.C1X, c2y  :  mbConsts.C1Y,
		bx   : -1, by :  0
	}},

	ranks : [ '1', '2', '3' ]
};

LoginBoard.layout = {
	type  : 'Layout',
	copse : {
	'loginL'      : {
		type      : 'Label',
		text      : 'Log In',
		fontStyle : fontStyle(22, 'ca'),
		pos       : { type: 'Point', anchor: 'sw', x: 160, y: -14 }
	},
	'userL' : {
		type      : 'Label',
		text      : 'username',
		fontStyle : fontStyle(16, 'la'),
		pos       : { type: 'Point', anchor: 's', x: -230, y:  -56 }
	},
	'passL'       : {
		type      : 'Label',
		text      : 'password',
		fontStyle : fontStyle(16, 'la'),
		pos       : { type: 'Point', anchor: 's', x: -230, y:  -21 }
	},
	'errL'        : {
		type      : 'Label',
		//text      : 'username/password not accepted',
		text      : '',
		fontStyle : fontStyle(14, 'lar'),
		pos       : { type: 'Point', anchor: 's', x: -135, y:  -81 }

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
			pnw    : { type: 'Point', anchor: 's', x: -135, y:  -74 },
			pse    : { type: 'Point', anchor: 's', x:   95, y:  -48 }
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
			pnw    : { type: 'Point', anchor: 's', x: -135, y:  -40 },
			pse    : { type: 'Point', anchor: 's', x:   95, y:  -14 }
		}
	},
	'loginBC'      : {
		type       : 'Custom',
		code       : 'lbLoginB',
		normaStyle : 'button',
		hoverStyle : 'buttonHover',
		focusStyle : 'buttonFocus',
		hofocStyle : 'buttonHofoc',
		frame      : {
			type   : 'Frame',
			pnw    : { type: 'Point', anchor: 'se', x: -380,            y: -10 - loginBCH },
			pse    : { type: 'Point', anchor: 'se', x: -380 + loginBCW, y: -10            }
		},
		caption       : {
			type      : 'Label',
			text      : 'login',
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
				c1x  :  loginBCXM, c1y :          0,
				c2x  :          0, c2y : -loginBCYM,
				bx   : -1, by:  0
			},
			'3' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 's', x:  0, y: -1 },
				c1x  :          0, c1y :  loginBCYM,
				c2x  :  loginBCXM, c2y :          0,
				bx   :  0, by: -1
			},
			'4' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 'w', x:  1, y:  0 },
				c1x  : -loginBCXM, c1y :          0,
				c2x  :          0, c2y :  loginBCYM,
				bx   :  1, by:  0
			},
			'5' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 'n', x:  0, y:  1 },
				c1x  :          0, c1y : -loginBCYM,
				c2x  : -loginBCXM, c2y :          0,
				bx   :  0, by:  1
			}},

			ranks : [ '1', '2', '3', '4', '5' ]
		}
	},
	'cancelBC'     : {
		type       : 'Custom',
		code       : 'lbCancelB',
		normaStyle : 'button',
		hoverStyle : 'buttonHover',
		focusStyle : 'buttonFocus',
		hofocStyle : 'buttonHofoc',
		frame : {
			type  : 'Frame',
			pnw   : { type: 'Point', anchor: 'se', x: -300,             y: -10 - cancelBCH },
			pse   : { type: 'Point', anchor: 'se', x: -300 + cancelBCW, y: -10 }
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
				c1x  :  cancelBCXM, c1y :           0,
				c2x  :           0, c2y : -cancelBCYM,
				bx   : -1, by:  0
			},
			'3' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 's', x:  0, y: -1 },
				c1x  :           0, c1y :  cancelBCYM,
				c2x  :  cancelBCXM, c2y :           0,
				bx   :  0, by: -1
			},
			'4' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 'w', x:  1, y:  0 },
				c1x  : -cancelBCXM, c1y :          0,
				c2x  :           0, c2y : cancelBCYM,
				bx   :  1, by:  0
			},
			'5' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 'n', x:  0, y:  1 },
				c1x  :           0, c1y : -cancelBCYM,
				c2x  : -cancelBCXM, c2y :           0,
				bx   :  0, by:  1
			}},

			ranks : [ '1', '2', '3', '4', '5' ]
		}
	/* @@
	'forgotBC'     : {
		type       : 'Custom',
		style      : 'zero',
		hoverStyle : 'zhighlight',
		frame : {
			type  : 'Frame',
			pnw   : { type: 'Point', anchor: 'se', x: -240,             y: -10 - forgotBCH },
			pse   : { type: 'Point', anchor: 'se', x: -240 + forgotBCW, y: -10 }
		},
		caption : {
			type      : 'Label',
			text      : 'forgot password?',
			fontStyle : fontStyle(12, 'cm'),
			pos       : { type: 'Point', anchor: 'c', x:  0, y: 0 }
		},
		curve :  {
			type : 'Curve',
			copse : {
			'1' : {
				type : 'MoveTo',
				to   : { type: 'Point', anchor:  'n', x:  0, y:  1 },
				bx   :  0, by : 1
			},
			'2' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 'e', x: -1, y:  0 },
				c1x  :  forgotBCXM, c1y :           0,
				c2x  :           0, c2y : -forgotBCYM,
				bx   : -1, by:  0
			},
			'3' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 's', x:  0, y: -1 },
				c1x  :           0, c1y :  forgotBCYM,
				c2x  :  forgotBCXM, c2y :           0,
				bx   :  0, by: -1
			},
			'4' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 'w', x:  1, y:  0 },
				c1x  : -forgotBCXM, c1y :          0,
				c2x  :           0, c2y : forgotBCYM,
				bx   :  1, by:  0
			},
			'5' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 'n', x:  0, y:  1 },
				c1x  :           0, c1y : -forgotBCYM,
				c2x  : -forgotBCXM, c2y :           0,
				bx   :  0, by:  1
			}},

			ranks : [ '1', '2', '3', '4', '5' ]
		}
	}*/

	}},
	
	ranks : [
		'userI',
		'passI',
		'loginBC',
		'cancelBC',
		'loginL',
		'userL',
		'passL',
		'errL'
	]
};

})();
