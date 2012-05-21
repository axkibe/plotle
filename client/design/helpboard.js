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
	pnw   : { type: 'Point', anchor: 'ne',  x: -170, y:    0 },
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
				c2x  :  -55, c2y :  0,
				bx   : -1, by   :  0
			}},

			ranks : [ '1', '2' ]
		}
	}},


	ranks : [
		'hideB'
	]
};


})();
