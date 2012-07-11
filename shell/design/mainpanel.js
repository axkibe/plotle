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

                          ,-,-,-.            .-,--.             .
                          `,| | |   ,-. . ,-. '|__/ ,-. ,-. ,-. |
                            | ; | . ,-| | | | ,|    ,-| | | |-' |
                            '   `-' `-^ ' ' ' `'    `-^ ' ' `-' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Design of the main panel.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var Fabric;
var Jools;
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

var half        = Jools.half;
var immute      = Jools.immute;
var innumerable = Jools.innumerable;
var ro          = Math.round;
var fontStyle   = Design.fontStyle;

// approximates ellipses with beziers
var magic     = Fabric.magic;

var sideBW  = 120;
var sideB2W = 190;

/**
| switch control
*/
var switchBW  = 170;
var switchBH  =  28;

/**
| help control
*/
var helpBW  = 150;
var helpBH  =  23;

/**
| Zooming controls
*/
var zoomX   =   0;
var zoomY   =  -9;
var zoomBW  =  20;
var zoomBH  =  20;
var zoomBYM = Math.round(zoomBH * magic);
var zoomBXM = Math.round(zoomBW * magic);

var MainPanel = Design.MainPanel = { type : 'Design' };

var consts = innumerable(MainPanel, 'consts', immute({
	C1X : 200,
	C1Y : -60,
	C2X : 300,
	C2Y :   0
}));

var sideButtonC1X   = ro(consts.C1X / 2);
var sideButtonC1Y   = ro(consts.C1Y / 2);
var sideButtonC2X   =  12;
var sideButtonC2Y   =  40;

MainPanel.style = 'panel';

MainPanel.frame = {
	type  : 'Frame',
	pnw   : { type: 'Point', anchor: 's', x: -512, y: -60 },
	pse   : { type: 'Point', anchor: 's', x:  512, y:   0 }
};

MainPanel.curve = {
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
		c1x  :  consts.C1X, c1y :  consts.C1Y,
		c2x  : -consts.C2X, c2y :  consts.C2Y,
		bx   :  0, by : 1
	},
	'3' : {
		type :  'BeziTo',
		to   :  { type: 'Point', anchor: 'se', x: 0, y: 0 },
		c1x  :  consts.C2X, c1y : -consts.C2Y,
		c2x  : -consts.C1X, c2y :  consts.C1Y,
		bx   : -1, by :  0
	}},

	ranks : [ '1', '2', '3' ]
};

MainPanel.layout = {
	type  : 'Layout',
	copse : {
	'leftB' : {
		type       : 'Button',
		code       : 'MBLeftB', // TODO rename MP

		normaStyle : 'button',
		hoverStyle : 'buttonHover',
		focusStyle : 'buttonFocus',
		hofocStyle : 'buttonHofoc',

		frame : {
			type  : 'Frame',
			pnw   : { type: 'Point', anchor: 'sw', x:      0, y: -36 },
			pse   : { type: 'Point', anchor: 'sw', x: sideBW, y:   0 }
		},
		caption : {
			type      : 'Label',
			text      : 'log in',
			fontStyle : fontStyle(13, 'ca'),
			pos       : { type: 'Point', anchor: 'sw', x: 90, y:  -7 }
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

	'left2B' : {
		type       : 'Button',
		code       : 'MBLeft2B',

		normaStyle : 'button',
		hoverStyle : 'buttonHover',
		focusStyle : 'buttonFocus',
		hofocStyle : 'buttonHofoc',

		frame : {
			type  : 'Frame',
			pnw   : { type: 'Point', anchor: 'sw', x:       0, y: -45 },
			pse   : { type: 'Point', anchor: 'sw', x: sideB2W, y:   0 }
		},
		caption : {
			type      : 'Label',
			text      : 'register',
			fontStyle : fontStyle(14, 'ca'),
			pos       : { type: 'Point', anchor: 'sw', x: half(sideBW + sideB2W) - 5, y: -14 }
		},
		curve     :  {
			type  : 'Curve',
			copse : {
			'1' : {
				type : 'MoveTo',
				to   : { type : 'Point', anchor: 'sw', x: sideBW, y: 0 },
				bx   : 1, by   : 0
			},
			'2' : {
				type :  'BeziTo',
				to   :  { type: 'Point', anchor: 'sw', x: 90, y: -25},
				c1x  : -sideButtonC2X, c1y : -sideButtonC2Y,
				c2x  :  0, c2y  :  0,
				bx   : -1, by   :  0
			},
			'3' : {
				type :  'BeziTo',
				to   :  { type: 'Point', anchor: 'se', x: 0, y: 0 },
				c1x  :  10, c1y :   0,
				c2x  : -12, c2y : -70,
				bx   : -1, by   :  0
			}},

			ranks : [ '1', '2', '3' ]
		}
	},

	'rightB' : {
		type       : 'Button',
		code       : 'MBRightB',

		normaStyle : 'button',
		hoverStyle : 'buttonHover',
		focusStyle : 'buttonFocus',
		hofocStyle : 'buttonHofoc',

		frame : {
			type  : 'Frame',
			pnw   : { type: 'Point', anchor: 'se', x: -sideBW, y: -36 },
			pse   : { type: 'Point', anchor: 'se', x: 0,           y:   0 }
		},
		caption : {
			type      : 'Label',
			text      : 'help',
			fontStyle : fontStyle(13, 'ca'),
			pos       : { type: 'Point', anchor: 'se', x: -90, y:  -7 }
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

	'switchB'     : {
		type       : 'Button',
		code       : 'MBSwitchB',

		normaStyle : 'button',
		hoverStyle : 'buttonHover',
		focusStyle : 'buttonFocus',
		hofocStyle : 'buttonHofoc',

		frame      : {
			type   : 'Frame',
			pnw    : { type: 'Point', anchor: 'n', x: -half(switchBW), y:        0 },
			pse    : { type: 'Point', anchor: 'n', x:  half(switchBW), y: switchBH }
		},
		caption       : {
			type      : 'Label',
			text      : 'switch',
			fontStyle : fontStyle(14, 'cm'),
			pos       : { type: 'Point', anchor: 'c', x:  0, y: -2 }
		},
		curve :  {
			type  : 'Curve',
			copse : {
			'1' : {
				type : 'MoveTo',
				to   : { type: 'Point', anchor:  'nw', x: 0, y:  0 },
				bx   :  0, by : 1
			},
			'2' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 's',  x: 0, y:  -2 },
				c1x  :  30, c1y :  0,
				c2x  : -30, c2y :  0,
				bx   :   0, by  : -1
			},
			'3' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 'ne', x: 0, y:  0 },
				c1x  :  30, c1y :  0,
				c2x  : -30, c2y :  0,
				bx   : -1, by:  0
			}},

			ranks : [ '1', '2', '3' ]
		}
	},
	
	'chat'        : {
		type      : 'Chat',
		fontStyle : fontStyle(12, 'lac'),
		frame      : {
			type   : 'Frame',
			pnw    : { type: 'Point', anchor: 'se', x: -450, y: -60 },
			pse    : { type: 'Point', anchor: 'se', x: -125, y:   0 }
		}
	},

	'zoomL'       : {
		type      : 'Label',
		text      : 'Zoom: ',
		fontStyle : fontStyle(12, 'ca'),
		pos       : { type: 'Point', anchor: 's', x: -45, y: -12 }
	},

	'zoom'       : {
		type      : 'Label',
		text      : '0',
		fontStyle : fontStyle(12, 'ca'),
		pos       : { type: 'Point', anchor: 's', x:  -13, y: -12 }
	},

	'zoomminusB'       : {
		type       : 'Button',
		code       : 'MBZoomMinusB',

		normaStyle : 'button',
		hoverStyle : 'buttonHover',
		focusStyle : 'buttonFocus',
		hofocStyle : 'buttonHofoc',

		frame : {
			type  : 'Frame',
			pnw   : { type: 'Point', anchor: 's', x: zoomX,          y: zoomY - zoomBH },
			pse   : { type: 'Point', anchor: 's', x: zoomX + zoomBW, y: zoomY          }
		},
		caption : {
			type      : 'Label',
			text      : '-',
			fontStyle : fontStyle(14, 'cm'),
			pos       : { type: 'Point', anchor: 'c', x:  1, y: 1 }
		},
		curve :  {
			type  : 'Curve',
			copse : {
			'1' : {
				type : 'MoveTo',
				to   : { type: 'Point', anchor:  'w', x: 1, y:  0 },
				bx   :  1, by: 0
			},
			'2' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 'e', x: -1, y:  0 },
				c1x  :  0, c1y : -zoomBYM ,
				c2x  :  0, c2y : -zoomBYM,
				bx   : -1, by:  0
			},
			'3' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 'w', x: 1, y:  0 },
				c1x  :  0, c1y :  zoomBYM,
				c2x  :  0, c2y :  zoomBYM,
				bx   :  1, by:  0
			}},

			ranks : [ '1', '2', '3' ]
		}
	},

	'zoomnullB'       : {
		type       : 'Button',
		code       : 'MBZoomNullB',

		normaStyle : 'button',
		hoverStyle : 'buttonHover',
		focusStyle : 'buttonFocus',
		hofocStyle : 'buttonHofoc',

		frame : {
			type  : 'Frame',
			pnw   : { type: 'Point', anchor: 's', x: zoomX + zoomBW     - 2, y: zoomY - zoomBH },
			pse   : { type: 'Point', anchor: 's', x: zoomX + zoomBW * 2 - 2, y: zoomY          }
		},
		caption : {
			type      : 'Label',
			text      : '0',
			fontStyle : fontStyle(14, 'cm'),
			pos       : { type: 'Point', anchor: 'c', x:  1, y: 2 }
		},
		curve :  {
			type  : 'Curve',
			copse : {
			'1' : {
				type : 'MoveTo',
				to   : { type: 'Point', anchor:  'w', x: 1, y:  0 },
				bx   :  1, by: 0
			},
			'2' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 'e', x: -1, y:  0 },
				c1x  :  0, c1y : -zoomBYM ,
				c2x  :  0, c2y : -zoomBYM,
				bx   : -1, by:  0
			},
			'3' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 'w', x: 1, y:  0 },
				c1x  :  0, c1y :  zoomBYM,
				c2x  :  0, c2y :  zoomBYM,
				bx   :  1, by:  0
			}},

			ranks : [ '1', '2', '3' ]
		}
	},

	'zoomplusB'       : {
		type       : 'Button',
		code       : 'MBZoomPlusB',

		normaStyle : 'button',
		hoverStyle : 'buttonHover',
		focusStyle : 'buttonFocus',
		hofocStyle : 'buttonHofoc',

		frame : {
			type  : 'Frame',
			pnw   : { type: 'Point', anchor: 's', x: zoomX + zoomBW * 2 - 4, y: zoomY - zoomBH },
			pse   : { type: 'Point', anchor: 's', x: zoomX + zoomBW * 3 - 4, y: zoomY          }
		},
		caption : {
			type      : 'Label',
			text      : '+',
			fontStyle : fontStyle(14, 'cm'),
			pos       : { type: 'Point', anchor: 'c', x:  1, y: 1 }
		},
		curve :  {
			type  : 'Curve',
			copse : {
			'1' : {
				type : 'MoveTo',
				to   : { type: 'Point', anchor:  'w', x: 1, y:  0 },
				bx   :  1, by: 0
			},
			'2' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 'e', x: -1, y:  0 },
				c1x  :  0, c1y : -zoomBYM ,
				c2x  :  0, c2y : -zoomBYM,
				bx   : -1, by:  0
			},
			'3' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 'w', x: 1, y:  0 },
				c1x  :  0, c1y :  zoomBYM,
				c2x  :  0, c2y :  zoomBYM,
				bx   :  1, by:  0
			}},

			ranks : [ '1', '2', '3' ]
		}
	},
	
	'greet'       : {
		type      : 'Label',
		text      : 'Hello',
		fontStyle : fontStyle(12, 'ca'),
		pos       : { type: 'Point', anchor: 'sw', x:  250, y: -36 }
	},

	'username'    : {
		type      : 'Label',
		text      : '',
		fontStyle : fontStyle(18, 'ca'),
		pos       : { type: 'Point', anchor: 'sw', x:  250, y: -13 }
	},


	'saycurrent'  : {
		type      : 'Label',
		text      : 'current space',
		fontStyle : fontStyle(12, 'ca'),
		pos       : { type: 'Point', anchor:  's', x: -140, y: -42 }
	},

	'cspace'      : {
		type      : 'Label',
		text      : '',
		fontStyle : fontStyle(22, 'cab'),
		pos       : { type: 'Point', anchor:  's', x: -140, y: -20 }
	},
	
	'access'      : {
		type      : 'Label',
		text      : '',
		fontStyle : fontStyle(12, 'cadr'),
		pos       : { type: 'Point', anchor:  's', x: -140, y: -4 }
	}},


	ranks : [
		'leftB',
		'left2B',
		'rightB',
		'switchB',
		'chat',
		'zoomL',
		'zoom',
		'zoomminusB',
		'zoomplusB',
		'zoomnullB',
		'greet',
		'username',
		'saycurrent',
		'cspace',
		'access'
	]
};


})();
