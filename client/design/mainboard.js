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

var sideButtonWidth = 170;

/**
| switch control
*/
var switchBCW  = 180;
var switchBCH  =  35;

/**
| help control
*/
var helpBCW  = 150;
var helpBCH  =  23;

var MainBoard = Design.MainBoard = { type : 'Design' };

var consts = innumerable(MainBoard, 'consts', immute({
	C1X : 200,
	C1Y : -60,
	C2X : 300,
	C2Y :   0
}));

var sideButtonC1X   = ro(consts.C1X / 1.4);
var sideButtonC1Y   = ro(consts.C1Y / 1.4);
var sideButtonC2X   =  15;
var sideButtonC2Y   =  50;

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
			fontStyle : fontStyle(14, 'ca'),
			pos       : { type: 'Point', anchor: 'sw', x:  125, y:  -9 }
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
			text      : 'help',
			fontStyle : fontStyle(14, 'ca'),
			pos       : { type: 'Point', anchor: 'se', x:  -125, y:  -9 }
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
			pnw    : { type: 'Point', anchor: 'n', x: -half(switchBCW), y:         0 },
			pse    : { type: 'Point', anchor: 'n', x:  half(switchBCW), y: switchBCH }
		},
		caption       : {
			type      : 'Label',
			text      : 'switch',
			fontStyle : fontStyle(16, 'cm'),
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
	
	'greet'       : {
		type      : 'Label',
		text      : 'Hello',
		fontStyle : fontStyle(12, 'ca'),
		pos       : { type: 'Point', anchor: 'sw', x:  260, y: -34 }
	},

	'username'    : {
		type      : 'Label',
		text      : '',
		fontStyle : fontStyle(18, 'ca'),
		pos       : { type: 'Point', anchor: 'sw', x:  260, y: -11 }
	},


	'saycurrent'  : {
		type      : 'Label',
		text      : 'current space',
		fontStyle : fontStyle(12, 'ca'),
		pos       : { type: 'Point', anchor:  's', x: -130, y: -34 }
	},

	'cspace'      : {
		type      : 'Label',
		text      : 'welcome',
		fontStyle : fontStyle(22, 'cab'),
		pos       : { type: 'Point', anchor:  's', x: -130, y: -11 }
	},

	'message'     : {
		type      : 'Label',
		text      : 'This is a message just for testing.',
		fontStyle : fontStyle(12, 'la'),
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
};


})();
