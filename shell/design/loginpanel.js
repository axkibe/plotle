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

                            ,                .-,--.             .
                            )   ,-. ,-. . ,-. '|__/ ,-. ,-. ,-. |
                           /    | | | | | | | ,|    ,-| | | |-' |
                           `--' `-' `-| ' ' ' `'    `-^ ' ' `-' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~,| ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                                     `'
 Design of the login panel.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Export
*/
var Design;
Design = Design || {};

/**
| Imports
*/
var Fabric;
var theme;

/**
| Capsule
*/
(function(){
'use strict';

/**
| Shortcuts
*/
var fontStyle = Design.fontStyle;
// 'magic' number to approximate ellipses with beziers
var magic     = Fabric.magic;
var mbConsts   = Design.MainPanel.consts;

/**
| Login control
*/
var loginBW   = 70;
var loginBH   = 70;
var loginBXM  = loginBW * magic / 2;
var loginBYM  = loginBH * magic / 2;

/**
| Close control
*/
var closeBW  = 54;
var closeBH  = 54;
var closeBXM = closeBW * magic / 2;
var closeBYM = closeBH * magic / 2;

/**
| Forgot password control
*/
var forgotBW        = 110;
var forgotBH        = 22;
var forgotBXM       = forgotBW * magic;
var forgotBYM       = forgotBH * magic;

/**
| Login Panel
*/
var LoginPanel = Design.LoginPanel = { type   : 'Design' };

LoginPanel.style = 'cockpit';

LoginPanel.frame = {
	type  : 'Frame',
	pnw   : { type   : 'Point', anchor : 's', x : -512, y : -110 },
	pse   : { type   : 'Point', anchor : 's', x :  512, y :    0 }
};

LoginPanel.curve = {
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

LoginPanel.layout = {
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
			pnw    : { type: 'Point', anchor: 's', x: -135, y:  -74 },
			pse    : { type: 'Point', anchor: 's', x:   95, y:  -48 }
		}
	},
	'passI' : {
		type       : 'Input',
		code       : 'LBPassI',
		password   :  true,
		normaStyle : 'input',
		focusStyle : 'inputFocus',
		hoverStyle : 'input',
		hofocStyle : 'inputFocus',
		fontStyle  : fontStyle(14, 'la'),
		maxlen     : 0,
		frame      : {
			type   : 'Frame',
			pnw    : { type: 'Point', anchor: 's', x: -135, y:  -40 },
			pse    : { type: 'Point', anchor: 's', x:   95, y:  -14 }
		}
	},
	'loginB'       : {
		type       : 'Custom',
		code       : 'LBLoginB',
		normaStyle : 'button',
		hoverStyle : 'buttonHover',
		focusStyle : 'buttonFocus',
		hofocStyle : 'buttonHofoc',
		frame      : {
			type   : 'Frame',
			pnw    : { type: 'Point', anchor: 'se', x: -380,           y: -10 - loginBH },
			pse    : { type: 'Point', anchor: 'se', x: -380 + loginBW, y: -10           }
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
				c1x  :  loginBXM, c1y :         0,
				c2x  :         0, c2y : -loginBYM,
				bx   : -1, by:  0
			},
			'3' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 's', x:  0, y: -1 },
				c1x  :         0, c1y :  loginBYM,
				c2x  :  loginBXM, c2y :         0,
				bx   :  0, by: -1
			},
			'4' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 'w', x:  1, y:  0 },
				c1x  : -loginBXM, c1y :         0,
				c2x  :         0, c2y :  loginBYM,
				bx   :  1, by:  0
			},
			'5' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 'n', x:  0, y:  1 },
				c1x  :         0, c1y : -loginBYM,
				c2x  : -loginBXM, c2y :         0,
				bx   :  0, by:  1
			}},

			ranks : [ '1', '2', '3', '4', '5' ]
		}
	},
	'closeB'       : {
		type       : 'Custom',
		code       : 'LBCloseB',
		normaStyle : 'button',
		hoverStyle : 'buttonHover',
		focusStyle : 'buttonFocus',
		hofocStyle : 'buttonHofoc',
		frame : {
			type  : 'Frame',
			pnw   : { type: 'Point', anchor: 'se', x: -300,           y: -10 - closeBH },
			pse   : { type: 'Point', anchor: 'se', x: -300 + closeBW, y: -10 }
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
				c1x  :  closeBXM, c1y :          0,
				c2x  :          0, c2y : -closeBYM,
				bx   : -1, by:  0
			},
			'3' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 's', x:  0, y: -1 },
				c1x  :         0, c1y :  closeBYM,
				c2x  :  closeBXM, c2y :         0,
				bx   :  0, by: -1
			},
			'4' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 'w', x:  1, y:  0 },
				c1x  : -closeBXM, c1y :        0,
				c2x  :         0, c2y : closeBYM,
				bx   :  1, by:  0
			},
			'5' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 'n', x:  0, y:  1 },
				c1x  :         0, c1y : -closeBYM,
				c2x  : -closeBXM, c2y :         0,
				bx   :  0, by:  1
			}},

			ranks : [ '1', '2', '3', '4', '5' ]
		}
	/* TODO
	'forgotB'     : {
		type       : 'Custom',
		style      : 'zero',
		hoverStyle : 'zhighlight',
		frame : {
			type  : 'Frame',
			pnw   : { type: 'Point', anchor: 'se', x: -240,            y: -10 - forgotBH },
			pse   : { type: 'Point', anchor: 'se', x: -240 + forgotBW, y: -10 }
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
				c1x  :  forgotBXM, c1y :          0,
				c2x  :          0, c2y : -forgotBYM,
				bx   : -1, by:  0
			},
			'3' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 's', x:  0, y: -1 },
				c1x  :          0, c1y :  forgotBYM,
				c2x  :  forgotBXM, c2y :          0,
				bx   :  0, by: -1
			},
			'4' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 'w', x:  1, y:  0 },
				c1x  : -forgotBXM, c1y :         0,
				c2x  :          0, c2y : forgotBYM,
				bx   :  1, by:  0
			},
			'5' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 'n', x:  0, y:  1 },
				c1x  :          0, c1y : -forgotBYM,
				c2x  : -forgotBXM, c2y :          0,
				bx   :  0, by:  1
			}},

			ranks : [ '1', '2', '3', '4', '5' ]
		}
	}*/

	}},

	ranks : [
		'userI',
		'passI',
		'loginB',
		'closeB',
		'loginL',
		'userL',
		'passL',
		'errL'
	]
};

})();
