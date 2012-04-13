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
| Login control on Loginboard width and height
*/
var loginBCW        = 70;
var loginBCH        = 70;
var loginBCXM       = loginBCW * magic / 2;
var loginBCYM       = loginBCH * magic / 2;

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
var fontStyles = {
	ca12  : {
		type  : 'FontStyle',
		font  : '12px ' + theme.defaultFont,
		fill  : 'black',
		align : 'center',
		base  : 'alphabetic'
	},
	ca14  : {
		type  : 'FontStyle',
		font  : '14px ' + theme.defaultFont,
		fill  : 'black',
		align : 'center',
		base  : 'alphabetic'
	},
	ca22b : {
		type  : 'FontStyle',
		font  : '22px bold ' + theme.defaultFont,
		fill  : 'black',
		align : 'center',
		base  : 'alphabetic'
	},
	cm12  : {
		type  : 'FontStyle',
		font  : '12px ' + theme.defaultFont,
		fill  : 'black',
		align : 'center',
		base  : 'middle'
	},
	cm14  : {
		type  : 'FontStyle',
		font  : '14px ' + theme.defaultFont,
		fill  : 'black',
		align : 'center',
		base  : 'middle'
	},
	ca18  : {
		type  : 'FontStyle',
		font  : '18px ' + theme.defaultFont,
		fill  : 'black',
		align : 'center',
		base  : 'alphabetic'
	},
	ca22  : {
		type  : 'FontStyle',
		font  : '22px ' + theme.defaultFont,
		fill  : 'black',
		align : 'center',
		base  : 'alphabetic'
	},
	la12    : {
		type  : 'FontStyle',
		font  : '12px ' + theme.defaultFont,
		fill  : 'black',
		align : 'start',
		base  : 'alphabetic'
	},
	la14r : {
		type  : 'FontStyle',
		font  : '14px ' + theme.defaultFont,
		fill  : 'red',
		align : 'left',
		base  : 'alphabetic'
	},
	la16    : {
		type  : 'FontStyle',
		font  : '16px ' + theme.defaultFont,
		fill  : 'black',
		align : 'start',
		base  : 'alphabetic'
	}
};

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
		'greet'       : {
			type      : 'Label',
			text      : 'Hello',
			fontStyle : fontStyles.ca12,
			pos       : { type: 'Point', anchor: 'sw', x:  240, y: -34 }
		},

		'username'    : {
			type      : 'Label',
			text      : 'Visitor',
			fontStyle : fontStyles.ca18,
			pos       : { type: 'Point', anchor: 'sw', x:  240, y: -11 }
		},

		'saycurrent'  : {
			type      : 'Label',
			text      : 'current space',
			fontStyle : fontStyles.ca12,
			pos       : { type: 'Point', anchor:  's', x:    0, y: -39 }
		},

		'cspace'      : {
			type      : 'Label',
			text      : 'welcome',
			fontStyle : fontStyles.ca22b,
			pos       : { type: 'Point', anchor:  's', x:    0, y: -15 }
		},

		'message'     : {
			type      : 'Label',
			text      : 'This is a message just for testing.',
			fontStyle : fontStyles.la12,
			pos       : { type: 'Point', anchor: 'se', x: -450, y: -20 }
		},

		'loginMC' : {
			type       : 'Custom',
			style      : 'sides',
			hoverStyle : 'highlight',
			frame : {
				type  : 'Frame',
				pnw   : { type: 'Point', anchor: 'sw', x:               0, y: -36 },
				pse   : { type: 'Point', anchor: 'sw', x: sideButtonWidth, y:   0 }
			},
			caption : {
				type      : 'Label',
				text      : 'login',
				fontStyle : fontStyles.ca14,
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

		'registerMC' : {
			type       : 'Custom',
			style      : 'sides',
			hoverStyle : 'highlight',
			frame : {
				type  : 'Frame',
				pnw   : { type: 'Point', anchor: 'se', x: -sideButtonWidth, y: -36 },
				pse   : { type: 'Point', anchor: 'se', x: 0,                y:   0 }
			},
			caption : {
				type      : 'Label',
				text      : 'register',
				fontStyle : fontStyles.ca14,
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
		}},

		ranks : [
			'loginMC',
			'registerMC',
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
			fontStyle : fontStyles.ca22,
			pos       : { type: 'Point', anchor: 'sw', x: 160, y: -14 }
		},
		'userL' : {
			type      : 'Label',
			text      : 'username',
			fontStyle : fontStyles.la16,
			pos       : { type: 'Point', anchor: 's', x: -230, y:  -55 }
		},
		'passL'       : {
			type      : 'Label',
			text      : 'password',
			fontStyle : fontStyles.la16,
			pos       : { type: 'Point', anchor: 's', x: -230, y:  -20 }
		},
		'errL'        : {
			type      : 'Label',
			//text      : 'username/password not accepted',
			text      : '',
			fontStyle : fontStyles.la14r,
			pos       : { type: 'Point', anchor: 's', x: -135, y:  -81 }

		},
		'userI' : {
			type       : 'Input',
			normaStyle : 'input',
			focusStyle : 'inputfocus',
			hoverStyle : 'input',
			hovocStyle : 'inputfocus',
			fontStyle  : fontStyles.la16,
			frame      : {
				type   : 'Frame',
				pnw    : { type: 'Point', anchor: 's', x: -135, y:  -73 },
				pse    : { type: 'Point', anchor: 's', x:   95, y:  -49 }
			}
		},
		'passI' : {
			type       : 'Input',
			normaStyle : 'input',
			focusStyle : 'inputfocus',
			hoverStyle : 'input',
			hovocStyle : 'inputfocus',
			fontStyle  : fontStyles.la16,
			frame      : {
				type   : 'Frame',
				pnw    : { type: 'Point', anchor: 's', x: -135, y:  -39 },
				pse    : { type: 'Point', anchor: 's', x:   95, y:  -15 }
			}
		},
		'loginBC'      : {
			type       : 'Custom',
			style      : 'button',
			hoverStyle : 'highlight',
			frame      : {
				type   : 'Frame',
				pnw    : { type: 'Point', anchor: 'se', x: -380,            y: -10 - loginBCH },
				pse    : { type: 'Point', anchor: 'se', x: -380 + loginBCW, y: -10            }
			},
			caption       : {
				type      : 'Label',
				text      : 'login',
				fontStyle : fontStyles.cm14,
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
			style      : 'button',
			hoverStyle : 'highlight',
			frame : {
				type  : 'Frame',
				pnw   : { type: 'Point', anchor: 'se', x: -300,             y: -10 - cancelBCH },
				pse   : { type: 'Point', anchor: 'se', x: -300 + cancelBCW, y: -10 }
			},
			caption : {
				type      : 'Label',
				text      : 'cancel',
				fontStyle : fontStyles.cm14,
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
		}
		/*
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
				fontStyle : fontStyles.cm12,
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
		},

		//{
		//	type : 'Input',
		//	name : 'userinput',
		//	pos : {
		//		pnw : {
		//			x : { anchor : 'm', v : -100},
		//			y : { anchor : 's', v :  -40}
		//		},
		//		pse : {
		//			x : { anchor : 'm', v :  100},
		//			y : { anchor : 's', v :  -20}
		//		}
		//	}
		//}

		ranks : [
			'userI',
			'passI',
			'loginBC',
			'cancelBC',
			//'forgotBC',
			'loginL',
			'userL',
			'passL',
			'errL'
		]
    }
};

})();
