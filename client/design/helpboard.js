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

                          ,-_/,.     .      ,-,---.               .
                          ' |_|/ ,-. |  ,-.  '|___/ ,-. ,-. ,-. ,-|
                           /| |  |-' |  | |  ,|   \ | | ,-| |   | |
                           `' `' `-' `' |-' `-^---' `-' `-^ '   `-^
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ | ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                                        '
 Helpboard for readonly spaces.

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
var HelpBoard   = Design.HelpBoard = { type : 'Design' };

HelpBoard.style = 'help';

HelpBoard.frame = {
	type  : 'Frame',
	pnw   : { type: 'Point', anchor: 'ne',  x: -200, y:    0 },
	pse   : { type: 'Point', anchor: 'ne',  x:    0, y:  400 }
};

HelpBoard.curve = {
	type  : 'Curve',
	copse : {
	'1' : {
		type :  'MoveTo',
		to   :  { type: 'Point', anchor: 'nw', x: 0, y: 0 },
		bx   :  1, by : 0
	},
	'2' : {
		type :  'BeziTo',
		to   :  { type: 'Point', anchor: 'se', x: 2, y: -2 },
		c1x  :    2, c1y :  380,
		c2x  : -200, c2y :  -60,
		bx   :  0, by : -1
	},
	'3' : {
		type :  'LineTo',
		to   :  { type: 'Point', anchor: 'ne', x: 2, y: 0 },
		bx   : -1, by : -1
	}},

	ranks : [ '1', '2', '3' ]
};

HelpBoard.layout = {
	type  : 'Layout',
	copse : {
	'help'  : {
		type      : 'Label',
		text      : 'Help',
		fontStyle : fontStyle(15, 'lahb'),
		pos       : { type: 'Point', anchor: 'nw', x: 10 , y:  20 }
	},
	
	'getstarted'  : {
		type      : 'Label',
		text      : 'getting started',
		fontStyle : fontStyle(15, 'lahb'),
		pos       : { type: 'Point', anchor: 'nw', x: 18 , y:  35 }
	},
	
	'pan'  : {
		type      : 'Label',
		text      : 'to pan, drag the background',
		fontStyle : fontStyle(13, 'lah'),
		pos       : { type: 'Point', anchor: 'nw', x: 18 , y:  60 }
	},
	
	'move'  : {
		type      : 'Label',
		text      : 'to move items, drag them',
		fontStyle : fontStyle(13, 'lah'),
		pos       : { type: 'Point', anchor: 'nw', x: 18 , y:  80 }
	},
	
	'new'  : {
		type      : 'Label',
		text      : 'to create new items,',
		fontStyle : fontStyle(13, 'lah'),
		pos       : { type: 'Point', anchor: 'nw', x: 18 , y: 100 }
	},
	
	'new2'  : {
		type      : 'Label',
		text      : 'click the background',
		fontStyle : fontStyle(13, 'lah'),
		pos       : { type: 'Point', anchor: 'nw', x: 25 , y: 115 }
	},
	
	'edit'  : {
		type      : 'Label',
		text      : 'to edit an item, click it',
		fontStyle : fontStyle(13, 'lah'),
		pos       : { type: 'Point', anchor: 'nw', x: 18 , y: 135 }
	},
	
	'delete1'  : {
		type      : 'Label',
		text      : 'to remove an item',
		fontStyle : fontStyle(13, 'lah'),
		pos       : { type: 'Point', anchor: 'nw', x: 18 , y: 155 }
	},
	
	'delete2'  : {
		type      : 'Label',
		text      : 'click it\'s oval',
		fontStyle : fontStyle(13, 'lah'),
		pos       : { type: 'Point', anchor: 'nw', x: 25 , y: 170 }
	},
	
	'relate1'  : {
		type      : 'Label',
		text      : 'to create a relation',
		fontStyle : fontStyle(13, 'lah'),
		pos       : { type: 'Point', anchor: 'nw', x: 18 , y: 190 }
	},
	
	'relate2'  : {
		type      : 'Label',
		text      : 'drag an items oval',
		fontStyle : fontStyle(13, 'lah'),
		pos       : { type: 'Point', anchor: 'nw', x: 25 , y: 205 }
	},

	'relate3'  : {
		type      : 'Label',
		text      : 'or hold ctrl and drag it',
		fontStyle : fontStyle(13, 'lah'),
		pos       : { type: 'Point', anchor: 'nw', x: 25 , y: 220 }
	},
	
	'readonly'  : {
		type      : 'Label',
		//text      : 'This page is read-only!',
		text      : '',
		fontStyle : fontStyle(13, 'lahr'),
		pos       : { type: 'Point', anchor: 'nw', x: 28 , y: 250 }
	},
	
	'readonly2'  : {
		type      : 'Label',
		//text      : 'Click "switch" and select',
		text      : '',
		fontStyle : fontStyle(13, 'lahr'),
		pos       : { type: 'Point', anchor: 'nw', x: 28 , y: 270 }
	},
	
	'readonly3'  : {
		type      : 'Label',
		//text      : '"Sandbox" to play around',
		text      : '',
		fontStyle : fontStyle(13, 'lahr'),
		pos       : { type: 'Point', anchor: 'nw', x: 28 , y: 290 }
	},

	'hideB' : {
		type       : 'Custom',
		code       : 'HBHideB',
		normaStyle : 'sides',
		hoverStyle : 'highlight',
		focusStyle : 'sides',
		hofocStyle : 'highlight',
		frame : {
			type  : 'Frame',
			pnw   : { type: 'Point', anchor: 'se', x: -170, y: -45 },
			pse   : { type: 'Point', anchor: 'se', x:    0, y:  -3 }
		},
		caption : {
			type      : 'Label',
			text      : 'hide',
			fontStyle : fontStyle(13, 'cm'),
			pos       : { type: 'Point', anchor: 'e', x: -25, y: -3 }
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
				to   :  { type: 'Point', anchor: 'ne', x : 0, y : 4 },
				c1x  : -205, c1y : -53,
				c2x  :  -85, c2y :  0,
				bx   : -1, by   :  0
			}},

			ranks : [ '1', '2' ]
		}
	}},


	ranks : [
		'help',
		'getstarted',
		'pan',
		'move',
		'new',
		'new2',
		'edit',
		'delete1',
		'delete2',
		'relate1',
		'relate2',
		'relate3',
		'hideB',
		'readonly',
		'readonly2',
		'readonly3'
	]
};


})();
