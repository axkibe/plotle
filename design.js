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
var Design;

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

var sideButtonWidth = 190;
var mainboardC1X    = 200;
var mainboardC1Y    = -60;
var mainboardC2X    = 300;
var mainboardC2Y    =   0;
var sideButtonC1X   = R(mainboardC1X / 1.4);
var sideButtonC1Y   = R(mainboardC1Y / 1.4);
var sideButtonC2X   =  15;
var sideButtonC2Y   =  50;

var fontStyles = {
	center12  : {
		type  : 'FontStyle',
		font  : '12px ' + theme.defaultFont,
		fill  : 'black',
		align : 'center',
		base  : 'alphabetic'
	},
	center14  : {
		type  : 'FontStyle',
		font  : '14px ' + theme.defaultFont,
		fill  : 'black',
		align : 'center',
		base  : 'alphabetic'
	},
	center18  : {
		type  : 'FontStyle',
		font  : '18px ' + theme.defaultFont,
		fill  : 'black',
		align : 'center',
		base  : 'alphabetic'
	},
	center22b : {
		type  : 'FontStyle',
		font  : '22px bold ' + theme.defaultFont,
		fill  : 'black',
		align : 'center',
		base  : 'alphabetic'
	},
	left12    : {
		type  : 'FontStyle',
		font  : '12px ' + theme.defaultFont,
		fill  : 'black',
		align : 'start',
		base  : 'alphabetic'
	},
	left16    : {
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
			type : 'MoveTo',
			to   : { type: 'Point', anchor: 'sw', x: 0, y: 0 },
			bx   : 1, by   : 0
		},
		'2' : {
			type : 'BeziTo',
			c1x  :  mainboardC1X, c1y  :  mainboardC1Y,
			c2x  : -mainboardC2X, c2y  :  mainboardC2Y,
			to   : { type: 'Point', anchor:  'n', x: 0, y: 0 },
			bx   :  0, by   :  1
		},
		'3' : {
			type : 'BeziTo',
			c1x  :  mainboardC2X, c1y  : -mainboardC2Y,
			c2x  : -mainboardC1X, c2y  :  mainboardC1Y,
			to   : { type: 'Point', anchor: 'se', x: 0, y: 0 },
			bx   : -1, by   :  0
		}},
		ranks : [ '1', '2', '3' ]
	},

	layout :  {
		type  : 'Layout',
		copse : {
		'greet'       : {
			type      : 'Label',
			text      : 'Hello',
			fontStyle : fontStyles.center12,
			pos       : { type: 'Point', anchor: 'sw', x:  240, y: -34 }
		},

		'username'    : {
			type      : 'Label',
			text      : 'Visitor',
			fontStyle : fontStyles.center18,
			pos       : { type: 'Point', anchor: 'sw', x:  240, y: -11 }
		},

		'saycurrent'  : {
			type      : 'Label',
			text      : 'current space',
			fontStyle : fontStyles.center12,
			pos       : { type: 'Point', anchor:  's', x:    0, y: -39 }
		},

		'cspace'      : {
			type      : 'Label',
			text      : 'welcome',
			fontStyle : fontStyles.center22b,
			pos       : { type: 'Point', anchor:  's', x:    0, y: -15 }
		},

		'message'     : {
			type      : 'Label',
			text      : 'This is a message just for testing.',
			fontStyle : fontStyles.left12,
			pos       : { type: 'Point', anchor: 'se', x: -450, y: -20 }
		},

		'loginMC' : {
			type      : 'Custom',
			style     : 'sides',
			highlight : 'highlight',
			frame : {
				type  : 'Frame',
				pnw   : { type: 'Point', anchor: 'sw', x:               0, y: -36 },
				pse   : { type: 'Point', anchor: 'sw', x: sideButtonWidth, y:   0 }
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
					type : 'BeziTo',
					c1x  :  sideButtonC1X, c1y  :  sideButtonC1Y,
					c2x  : -sideButtonC2X, c2y  : -sideButtonC2Y,
					to   : { type: 'Point', anchor: 'se', x: 0, y: 0 },
					bx   : -1, by   :  0
				}
			},
			ranks : [ '1', '2' ]
		}},

		'loginL'      : {
			type      : 'Label',
			text      : 'login',
			fontStyle : fontStyles.center14,
			pos       : { type: 'Point', anchor: 'sw', x:  135, y:  -9 }
		},

		'registerMC' : {
			type      : 'Custom',
			style     : 'sides',
			highlight : 'highlight',
			frame : {
				type  : 'Frame',
				pnw   : { type: 'Point', anchor: 'se', x: -sideButtonWidth, y: -36 },
				pse   : { type: 'Point', anchor: 'se', x: 0,                y:   0 }
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
					type : 'BeziTo',
					c1x  : -sideButtonC1X, c1y  :  sideButtonC1Y,
					c2x  :  sideButtonC2X, c2y  : -sideButtonC2Y,
					to   : { type: 'Point', anchor: 'sw', x : 0, y : 0 },
					bx   : -1, by   :  0
				}
			},
			ranks : [ '1', '2' ]
		}},

		'registerL'   : {
			type      : 'Label',
			text      : 'register',
			fontStyle : fontStyles.center14,
			pos       : { type: 'Point', anchor: 'se', x: -135, y:  -9 }
		},

		'loginBC'     : {
			type      : 'Custom',
			style     : 'sides',
			highlight : 'highlight',
			frame : {
				type  : 'Frame',
				pnw   : { type: 'Point', anchor: 'se', x: -sideButtonWidth, y: -36 },
				pse   : { type: 'Point', anchor: 'se', x: 0,                y: 0   }
			},
			curve :  {
				type : 'Curve',
				copse : {
				'1' : {
					type : 'MoveTo',
					to   : {
						type   : 'Point',
						anchor : 'se',
						x      : 0,
						y      : 0
					},
					bx   : 1,
					by   : 0
				},
				'2' : {
					type : 'BeziTo',
					c1x  : -sideButtonC1X,
					c1y  :  sideButtonC1Y,
					c2x  :  sideButtonC2X,
					c2y  : -sideButtonC2Y,
					to   : {
						type   : 'Point',
						anchor : 'sw',
						x : 0,
						y : 0
					},
					bx   : -1,
					by   :  0
				}},

				ranks : [ '1', '2' ]
			}
		}},

		ranks : [
			'loginBC',
			'loginMC',
			'registerMC',
			'loginL',
			'registerL',
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
		pnw   : { type   : 'Point', anchor : 's', x : -512, y : -100 },
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
			type : 'BeziTo',
			c1x  :  mainboardC1X, c1y  :  mainboardC1Y,
			c2x  : -mainboardC2X, c2y  :  mainboardC2Y,
			to   : { type: 'Point', anchor:  'n', x: 0, y: 0 },
			bx:  0, by :  1
		},
		'3' : {
			type : 'BeziTo',
			c1x  :  mainboardC2X, c1y  : -mainboardC2Y,
			c2x  : -mainboardC1X, c2y  :  mainboardC1Y,
			to   : { type: 'Point', anchor: 'se', x: 0, y: 0 },
			bx   : -1, by :  0
		}},
		ranks : [ '1', '2', '3' ]
	},

	layout :  {
		type  : 'Layout',
		copse : {
		'userL' : {
			type : 'Label',
			text : 'username',
			fontStyle : fontStyles.left16,
			pos: { type: 'Point', anchor: 's', x: -220, y:  -55 }
		},
		'passL' : {
			type : 'Label',
			text : 'password',
			fontStyle : fontStyles.left16,
			pos: { type: 'Point', anchor: 's', x: -220, y:  -20 }
		}},

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
			'userL',
			'passL'
		]
    }
};

})();
