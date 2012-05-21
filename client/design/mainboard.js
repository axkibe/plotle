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

                         ,-,-,-.             ,-,---.               .
                         `,| | |   ,-. . ,-.  '|___/ ,-. ,-. ,-. ,-|
                           | ; | . ,-| | | |  ,|   \ | | ,-| |   | |
                           '   `-' `-^ ' ' ' `-^---' `-' `-^ '   `-^

~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Design of the mainboard

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

var half        = Fabric.half;
var immute      = Jools.immute;
var innumerable = Jools.innumerable;
var ro          = Math.round;
var fontStyle   = Design.fontStyle;

var sideBW  = 120;
var sideB2W = 190;

/**
| switch control
*/
var switchBW  = 170;
var switchBH  =  32;

/**
| help control
*/
var helpBW  = 150;
var helpBH  =  23;

var MainBoard = Design.MainBoard = { type : 'Design' };

var consts = innumerable(MainBoard, 'consts', immute({
	C1X : 200,
	C1Y : -60,
	C2X : 300,
	C2Y :   0
}));

var sideButtonC1X   = ro(consts.C1X / 2);
var sideButtonC1Y   = ro(consts.C1Y / 2);
var sideButtonC2X   =  12;
var sideButtonC2Y   =  40;

MainBoard.style = 'cockpit';

MainBoard.frame = {
	type  : 'Frame',
	pnw   : { type: 'Point', anchor: 's', x: -512, y: -60 },
	pse   : { type: 'Point', anchor: 's', x:  512, y:   0 }
};

MainBoard.curve = {
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

MainBoard.layout = {
	type  : 'Layout',
	copse : {
	'leftB' : {  // TODO rename leftB
		type       : 'Custom',
		code       : 'MBLeftB',
		normaStyle : 'sides',
		hoverStyle : 'highlight',
		focusStyle : 'sides',
		hofocStyle : 'highlight',
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
		type       : 'Custom',
		code       : 'MBLeft2B',
		normaStyle : 'sides',
		hoverStyle : 'highlight',
		focusStyle : 'sides',
		hofocStyle : 'highlight',
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
		type       : 'Custom',
		code       : 'MBRightB',
		normaStyle : 'sides',
		hoverStyle : 'highlight',
		focusStyle : 'sides',
		hofocStyle : 'highlight',
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
		type       : 'Custom',
		code       : 'MBSwitchB',
		normaStyle : 'sides',
		hoverStyle : 'highlight',
		focusStyle : 'sides',
		hofocStyle : 'highlight',
		frame      : {
			type   : 'Frame',
			pnw    : { type: 'Point', anchor: 'n', x: -half(switchBW), y:         0 },
			pse    : { type: 'Point', anchor: 'n', x:  half(switchBW), y: switchBH }
		},
		caption       : {
			type      : 'Label',
			text      : 'switch',
			fontStyle : fontStyle(14, 'cm'),
			pos       : { type: 'Point', anchor: 'c', x:  0, y: -3 }
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
	
	'greet'       : {
		type      : 'Label',
		text      : 'Hello',
		fontStyle : fontStyle(12, 'ca'),
		pos       : { type: 'Point', anchor: 'sw', x:  260, y: -36 }
	},

	'username'    : {
		type      : 'Label',
		text      : '',
		fontStyle : fontStyle(18, 'ca'),
		pos       : { type: 'Point', anchor: 'sw', x:  260, y: -13 }
	},


	'saycurrent'  : {
		type      : 'Label',
		text      : 'current space',
		fontStyle : fontStyle(12, 'ca'),
		pos       : { type: 'Point', anchor:  's', x: -130, y: -42 }
	},

	'cspace'      : {
		type      : 'Label',
		text      : '',
		fontStyle : fontStyle(22, 'cab'),
		pos       : { type: 'Point', anchor:  's', x: -130, y: -20 }
	},
	
	'access'      : {
		type      : 'Label',
//		text      : '(readonly)',
//		text      : '(edit)',
		text      : '',
		fontStyle : fontStyle(12, 'cadr'),
		pos       : { type: 'Point', anchor:  's', x: -130, y: -4 }
	}},


	ranks : [
		'leftB',
		'left2B',
		'rightB',
		'switchB',
		'chat',
		'greet',
		'username',
		'saycurrent',
		'cspace',
		'access'
	]
};


})();
