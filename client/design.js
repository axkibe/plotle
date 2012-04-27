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

                               .-,--.
                               ' |   \ ,-. ,-. . ,-. ,-.
                               , |   / |-' `-. | | | | |
                               `-^--'  `-' `-' ' `-| ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ,|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                                                  `'
 Design of the cockpit.

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
var Design = null;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('shell.js needs a browser!'); }

var R   = Math.round;
var abs = Math.abs;
var max = Math.max;
var min = Math.min;

var magic = 0.551784;      // 'magic' number to approximate ellipses with beziers.

var sideButtonWidth = 190;
var mainboardC1X    = 200;
var mainboardC1Y    = -60;
var mainboardC2X    = 300;
var mainboardC2Y    =   0;
var sideButtonC1X   = R(mainboardC1X / 1.4);
var sideButtonC1Y   = R(mainboardC1Y / 1.4);
var sideButtonC2X   =  15;
var sideButtonC2Y   =  50;

/**
| switch control on Mainboard
*/
var switchBCW  = 200;
var switchBCH  =  35;

/**
| Login control on Loginboard width and height
*/
var loginBCW   = 70;
var loginBCH   = 70;
var loginBCXM  = loginBCW * magic / 2;
var loginBCYM  = loginBCH * magic / 2;


/**
| Register control on Regboard width and height
*/
var regBCW        = 110;
var regBCH        = 110;
var regBCXM       = regBCW * magic / 2;
var regBCYM       = regBCH * magic / 2;

/**
| Cancel control on Regboard width and height
*/
var canrBCW        = 70;
var canrBCH        = 70;
var canrBCXM       = canrBCW * magic / 2;
var canrBCYM       = canrBCH * magic / 2;

/**
| Cancel control on Loginboard width and height
*/
var cancelBCW        = 54;
var cancelBCH        = 54;
var cancelBCXM       = cancelBCW * magic / 2;
var cancelBCYM       = cancelBCH * magic / 2;

/**
| Forgot password control on Loginboard width and height
*/
var forgotBCW        = 110;
var forgotBCH        = 22;
var forgotBCXM       = forgotBCW * magic;
var forgotBCYM       = forgotBCH * magic;

/**
| Shortcuts for fontstyles
*/
var fontStyles;
(function(){
	var $styles = {
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

	fontStyles = function(size, code) {
		var base = $styles[code];
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

Design = {};

/**
| Main Board
*/
Design.mainboard = {
	type   : 'Design',

	frame : {
		type  : 'Frame',
		pnw   : { type: 'Point', anchor: 's', x: -512, y: -60 },
		pse   : { type: 'Point', anchor: 's', x:  512, y:   0 }
	},

	curve : {
		type  : 'Curve',
		copse : {
		'1' : {
			type :  'MoveTo',
			to   :  { type: 'Point', anchor: 'sw', x: 0, y: 0 },
			bx   :  1, by : 0
		},
		'2' : {
			type :  'BeziTo',
			to   :  { type: 'Point', anchor:  'n', x: 0, y: 0 },
			c1x  :  mainboardC1X, c1y :  mainboardC1Y,
			c2x  : -mainboardC2X, c2y :  mainboardC2Y,
			bx   :  0, by : 1
		},
		'3' : {
			type :  'BeziTo',
			to   :  { type: 'Point', anchor: 'se', x: 0, y: 0 },
			c1x  :  mainboardC2X, c1y : -mainboardC2Y,
			c2x  : -mainboardC1X, c2y :  mainboardC1Y,
			bx   : -1, by :  0
		}},

		ranks : [ '1', '2', '3' ]
	},

	layout :  {
		type  : 'Layout',
		copse : {
		'leftBC' : {
			type       : 'Custom',
			normaStyle : 'sides',
			hoverStyle : 'highlight',
			focusStyle : 'sides',
			hofocStyle : 'highlight',
			frame : {
				type  : 'Frame',
				pnw   : { type: 'Point', anchor: 'sw', x:               0, y: -36 },
				pse   : { type: 'Point', anchor: 'sw', x: sideButtonWidth, y:   0 }
			},
			caption : {
				type      : 'Label',
				text      : 'login',
				fontStyle : fontStyles(16, 'ca'),
				pos       : { type: 'Point', anchor: 'sw', x:  135, y:  -9 }
			},
			curve     :  {
				type  : 'Curve',
				copse : {
				'1' : {
					type : 'MoveTo',
					to   : { type : 'Point', anchor: 'sw', x: 0, y: 0 },
					bx   : 1, by   : 0
				},
				'2' : {
					type :  'BeziTo',
					to   :  { type: 'Point', anchor: 'se', x: 0, y: 0 },
					c1x  :  sideButtonC1X, c1y :  sideButtonC1Y,
					c2x  : -sideButtonC2X, c2y : -sideButtonC2Y,
					bx   : -1, by   :  0
				}},

				ranks : [ '1', '2' ]
			}
		},

		'rightBC' : {
			type       : 'Custom',
			normaStyle : 'sides',
			hoverStyle : 'highlight',
			focusStyle : 'sides',
			hofocStyle : 'highlight',
			frame : {
				type  : 'Frame',
				pnw   : { type: 'Point', anchor: 'se', x: -sideButtonWidth, y: -36 },
				pse   : { type: 'Point', anchor: 'se', x: 0,                y:   0 }
			},
			caption : {
				type      : 'Label',
				text      : 'register',
				fontStyle : fontStyles(16, 'ca'),
				pos       : { type: 'Point', anchor: 'se', x:  -135, y:  -9 }
			},
			curve :  {
				type : 'Curve',
				copse : {
				'1' : {
					type : 'MoveTo',
					to   : { type: 'Point', anchor: 'se', x: 0, y: 0 },
					bx   : 1, by   : 0
				},
				'2' : {
					type :  'BeziTo',
					to   :  { type: 'Point', anchor: 'sw', x : 0, y : 0 },
					c1x  : -sideButtonC1X, c1y :  sideButtonC1Y,
					c2x  :  sideButtonC2X, c2y : -sideButtonC2Y,
					bx   : -1, by   :  0
				}},

				ranks : [ '1', '2' ]
			}
		},

		'switchBC'     : {
			type       : 'Custom',
			normaStyle : 'sides',
			hoverStyle : 'highlight',
			focusStyle : 'sides',
			hofocStyle : 'highlight',
			frame      : {
				type   : 'Frame',
				pnw    : { type: 'Point', anchor: 'n', x: -100,             y:         0 },
				pse    : { type: 'Point', anchor: 'n', x: -100 + switchBCW, y: switchBCH }
			},
			caption       : {
				type      : 'Label',
				text      : 'switch',
				fontStyle : fontStyles(16, 'cm'),
				pos       : { type: 'Point', anchor: 'c', x:  0, y: -3 }
			},
			curve :  {
				type  : 'Curve',
				copse : {
				'1' : {
					type : 'MoveTo',
					to   : { type: 'Point', anchor:  'nw', x:  0, y:  0 },
					bx   :  0, by : 1
				},
				'2' : {
					type : 'BeziTo',
					to   :  { type: 'Point', anchor: 's', x:  0, y:  -2 },
					c1x  :  30, c1y :  0,
					c2x  : -30, c2y :  0,
					bx   :   0, by  : -1
				},
				'3' : {
					type : 'BeziTo',
					to   :  { type: 'Point', anchor: 'ne', x:  0, y:  0 },
					c1x  :  30, c1y :  0,
					c2x  : -30, c2y :  0,
					bx   : -1, by:  0
				}},

				ranks : [ '1', '2', '3' ]
			}
		},

		'greet'       : {
			type      : 'Label',
			text      : 'Hello',
			fontStyle : fontStyles(12, 'ca'),
			pos       : { type: 'Point', anchor: 'sw', x:  260, y: -34 }
		},

		'username'    : {
			type      : 'Label',
			text      : '',
			fontStyle : fontStyles(18, 'ca'),
			pos       : { type: 'Point', anchor: 'sw', x:  260, y: -11 }
		},


		'saycurrent'  : {
			type      : 'Label',
			text      : 'current space',
			fontStyle : fontStyles(12, 'ca'),
			pos       : { type: 'Point', anchor:  's', x: -130, y: -34 }
		},

		'cspace'      : {
			type      : 'Label',
			text      : 'welcome',
			fontStyle : fontStyles(22, 'cab'),
			pos       : { type: 'Point', anchor:  's', x: -130, y: -11 }
		},

		'message'     : {
			type      : 'Label',
			text      : 'This is a message just for testing.',
			fontStyle : fontStyles(12, 'la'),
			pos       : { type: 'Point', anchor: 'se', x: -450, y: -20 }
		}},

		ranks : [
			'leftBC',
			'rightBC',
			'switchBC',
			'greet',
			'username',
			'saycurrent',
			'cspace',
			'message'
		]
    }
};


/**
| Login Board
*/
Design.loginboard = {
	type   : 'Design',

	frame : {
		type  : 'Frame',
		pnw   : { type   : 'Point', anchor : 's', x : -512, y : -110 },
		pse   : { type   : 'Point', anchor : 's', x :  512, y :    0 }
	},

	curve : {
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
			c1x  :  mainboardC1X, c1y  :  mainboardC1Y,
			c2x  : -mainboardC2X, c2y  :  mainboardC2Y,
			bx:  0, by :  1
		},
		'3' : {
			type :  'BeziTo',
			to   :  { type: 'Point', anchor: 'se', x: 0, y: 0 },
			c1x  :  mainboardC2X, c1y  : -mainboardC2Y,
			c2x  : -mainboardC1X, c2y  :  mainboardC1Y,
			bx   : -1, by :  0
		}},

		ranks : [ '1', '2', '3' ]
	},

	layout :  {
		type  : 'Layout',
		copse : {
		'loginL'      : {
			type      : 'Label',
			text      : 'Login',
			fontStyle : fontStyles(22, 'ca'),
			pos       : { type: 'Point', anchor: 'sw', x: 160, y: -14 }
		},
		'userL' : {
			type      : 'Label',
			text      : 'username',
			fontStyle : fontStyles(16, 'la'),
			pos       : { type: 'Point', anchor: 's', x: -230, y:  -56 }
		},
		'passL'       : {
			type      : 'Label',
			text      : 'password',
			fontStyle : fontStyles(16, 'la'),
			pos       : { type: 'Point', anchor: 's', x: -230, y:  -21 }
		},
		'errL'        : {
			type      : 'Label',
			//text      : 'username/password not accepted',
			text      : '',
			fontStyle : fontStyles(14, 'lar'),
			pos       : { type: 'Point', anchor: 's', x: -135, y:  -81 }

		},
		'userI' : {
			type       : 'Input',
			password   :  false,
			normaStyle : 'input',
			focusStyle : 'inputfocus',
			hoverStyle : 'input',
			hofocStyle : 'inputfocus',
			fontStyle  : fontStyles(14, 'la'),
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
			fontStyle  : fontStyles(14, 'la'),
			maxlen     : 0,
			frame      : {
				type   : 'Frame',
				pnw    : { type: 'Point', anchor: 's', x: -135, y:  -40 },
				pse    : { type: 'Point', anchor: 's', x:   95, y:  -14 }
			}
		},
		'loginBC'      : {
			type       : 'Custom',
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
				fontStyle : fontStyles(14, 'cm'),
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
				fontStyle : fontStyles(14, 'cm'),
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
				fontStyle : fontStyles(12, 'cm'),
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
    }
};

/**
| Register Board
*/
Design.regboard = {
	type   : 'Design',

	frame : {
		type  : 'Frame',
		pnw   : { type   : 'Point', anchor : 's', x : -512, y : -300 },
		pse   : { type   : 'Point', anchor : 's', x :  512, y :    0 }
	},

	curve : {
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
			c1x  :  mainboardC1X * 0.8, c1y  :  mainboardC1Y * 4,
			c2x  : -mainboardC2X * 0.8, c2y  :  mainboardC2Y * 4,
			bx:  0, by :  1
		},
		'3' : {
			type :  'BeziTo',
			to   :  { type: 'Point', anchor: 'se', x: 0, y: 0 },
			c1x  :  mainboardC2X * 0.8, c1y  : -mainboardC2Y * 4,
			c2x  : -mainboardC1X * 0.8, c2y  :  mainboardC1Y * 4,
			bx   : -1, by :  0
		}},

		ranks : [ '1', '2', '3' ]
	},

	layout :  {
		type  : 'Layout',
		copse : {
		'regL'      : {
			type      : 'Label',
			text      : 'Register',
			fontStyle : fontStyles(22, 'ca'),
			pos       : { type: 'Point', anchor: 'se', x: -160, y: -14 }
		},
		'userL' : {
			type      : 'Label',
			text      : 'username',
			fontStyle : fontStyles(16, 'ra'),
			pos       : { type: 'Point', anchor: 's', x: -155, y:  -220 }
		},
		'emailL'       : {
			type      : 'Label',
			text      : 'email',
			fontStyle : fontStyles(16, 'ra'),
			pos       : { type: 'Point', anchor: 's', x: -155, y:  -180 }
		},
		'passL'       : {
			type      : 'Label',
			text      : 'password',
			fontStyle : fontStyles(16, 'ra'),
			pos       : { type: 'Point', anchor: 's', x: -155, y:  -140 }
		},
		'pass2L'       : {
			type      : 'Label',
			text      : 'repeat password',
			fontStyle : fontStyles(16, 'ra'),
			pos       : { type: 'Point', anchor: 's', x: -155, y:  -100 }
		},
		'codeL'       : {
			type      : 'Label',
			text      : 'invitation code',
			fontStyle : fontStyles(16, 'ra'),
			pos       : { type: 'Point', anchor: 's', x: -155, y:   -60 }
		},
		'errL'        : {
			type      : 'Label',
			text      : '',
			fontStyle : fontStyles(14, 'lar'),
			pos       : { type: 'Point', anchor: 's', x: -135, y:  -255 }

		},
		'expL' : {
			type      : 'Label',
			text      : 'meshcraft.net is still testing & developing its scalebility, '+
						'please email axkibe@gmail.com to request a code.',
			fontStyle : fontStyles(12, 'la'),
			pos       : { type: 'Point', anchor: 'sw', x:  80, y:   -15 }
		},
		'userI' : {
			type       : 'Input',
			password   :  false,
			normaStyle : 'input',
			focusStyle : 'inputfocus',
			hoverStyle : 'input',
			hofocStyle : 'inputfocus',
			fontStyle  : fontStyles(14, 'la'),
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
			fontStyle  : fontStyles(14, 'la'),
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
			fontStyle  : fontStyles(14, 'la'),
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
			fontStyle  : fontStyles(14, 'la'),
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
			fontStyle  : fontStyles(14, 'la'),
			maxlen     : 8,
			frame      : {
				type   : 'Frame',
				pnw    : { type: 'Point', anchor: 's', x: -135, y:   -78 },
				pse    : { type: 'Point', anchor: 's', x:   95, y:   -52 }
			}
		},
		'regBC'      : {
			type       : 'Custom',
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
				fontStyle : fontStyles(14, 'cm'),
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
				fontStyle : fontStyles(14, 'cm'),
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
    }
};


})();
