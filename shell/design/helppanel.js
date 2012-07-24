/**_____
\  ___ `'.        .....             .--.             _..._
 ' |--.\  \    .''     ''.          |__|  .--./)   .'     '.
 | |    \  '  /   .-''-.  \         .--. /.''\\   .   .-.   .
 | |     |  ',   /______\  '        |  || |  | |  |  '   '  |
 | |     |  ||             |    _   |  | \`-' /   |  |   |  |
 | |     ' .''  .----------'  .' |  |  | /("'`    |  |   |  |
 | |___.' /'  \  '-.__...--. .   | /|  | \ '---.  |  |   |  |
/_______.'/    `.        .'.'.'| |//|__|  /'""'.\ |  |   |  |
\_______|/       '-....-'.'.'.-'  /      ||     |||  |   |  |
                         .'   \_.'       \'. __// |  |   |  |
                                          `'---'  '--'   '--
            ,-_/,.     .     .-,--.             .
            ' |_|/ ,-. |  ,-. '|__/ ,-. ,-. ,-. |
             /| |  |-' |  | | ,|    ,-| | | |-' |
             `' `' `-' `' |-' `'    `-^ ' ' `-' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ | ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                        '
 the help panel.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
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

var immute      = Jools.immute;
var innumerable = Jools.innumerable;
var ro          = Math.round;
var getFont     = Design.getFont;
var HelpPanel   = Design.HelpPanel = { type : 'Design' };

HelpPanel.style = 'help';

HelpPanel.frame = {
	type  : 'Frame',
	pnw   : { type: 'Point', anchor: 'ne',  x: -200, y:    0 },
	pse   : { type: 'Point', anchor: 'ne',  x:    0, y:  400 }
};

HelpPanel.curve = {
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

HelpPanel.layout = {
	type  : 'Layout',
	copse : {
	'help'  : {
		type      : 'Label',
		text      : 'Help',
		font      : getFont(16, 'lahb'),
		pos       : { type: 'Point', anchor: 'nw', x: 10 , y:  20 }
	},

	'getstarted'  : {
		type      : 'Label',
		text      : 'getting started',
		font      : getFont(16, 'lahb'),
		pos       : { type: 'Point', anchor: 'nw', x: 18 , y:  40 }
	},

	'pan'  : {
		type      : 'Label',
		text      : 'to pan, drag the background',
		font      : getFont(13, 'lah'),
		pos       : { type: 'Point', anchor: 'nw', x: 18 , y:  65 }
	},

	'move'  : {
		type      : 'Label',
		text      : 'to move items, drag them',
		font      : getFont(13, 'lah'),
		pos       : { type: 'Point', anchor: 'nw', x: 18 , y:  85 }
	},

	'new'  : {
		type      : 'Label',
		text      : 'to create new items,',
		font      : getFont(13, 'lah'),
		pos       : { type: 'Point', anchor: 'nw', x: 18 , y: 105 }
	},

	'new2'  : {
		type      : 'Label',
		text      : 'click the background',
		font      : getFont(13, 'lah'),
		pos       : { type: 'Point', anchor: 'nw', x: 25 , y: 120 }
	},

	'edit'  : {
		type      : 'Label',
		text      : 'to edit an item, click it',
		font      : getFont(13, 'lah'),
		pos       : { type: 'Point', anchor: 'nw', x: 18 , y: 140 }
	},

	'delete1'  : {
		type      : 'Label',
		text      : 'to remove an item',
		font      : getFont(13, 'lah'),
		pos       : { type: 'Point', anchor: 'nw', x: 18 , y: 160 }
	},

	'delete2'  : {
		type      : 'Label',
		text      : 'click it\'s oval',
		font      : getFont(13, 'lah'),
		pos       : { type: 'Point', anchor: 'nw', x: 25 , y: 175 }
	},

	'relate1'  : {
		type      : 'Label',
		text      : 'to create a relation',
		font      : getFont(13, 'lah'),
		pos       : { type: 'Point', anchor: 'nw', x: 18 , y: 195 }
	},

	'relate2'  : {
		type      : 'Label',
		text      : 'drag an items oval',
		font      : getFont(13, 'lah'),
		pos       : { type: 'Point', anchor: 'nw', x: 25 , y: 210 }
	},

	'relate3'  : {
		type      : 'Label',
		text      : 'or hold ctrl and drag it',
		font      : getFont(13, 'lah'),
		pos       : { type: 'Point', anchor: 'nw', x: 25 , y: 225 }
	},

	'readonly'  : {
		type      : 'Label',
		//text      : 'This page is read-only!',
		text      : '',
		font      : getFont(13, 'lahr'),
		pos       : { type: 'Point', anchor: 'nw', x: 28 , y: 255 }
	},

	'readonly2'  : {
		type      : 'Label',
		//text      : 'Click "switch" and select',
		text      : '',
		font      : getFont(13, 'lahr'),
		pos       : { type: 'Point', anchor: 'nw', x: 28 , y: 275 }
	},

	'readonly3'  : {
		type      : 'Label',
		//text      : '"Sandbox" to play around',
		text      : '',
		font      : getFont(13, 'lahr'),
		pos       : { type: 'Point', anchor: 'nw', x: 28 , y: 295 }
	},

	'hideB' : {
		type       : 'Button',
		code       : 'HelpHideButton',

		normaStyle : 'button',
		hoverStyle : 'buttonHover',
		focusStyle : 'buttonFocus',
		hofocStyle : 'buttonHofoc',

		frame : {
			type  : 'Frame',
			pnw   : { type: 'Point', anchor: 'se', x: -170, y: -45 },
			pse   : { type: 'Point', anchor: 'se', x:    0, y:  -3 }
		},
		caption : {
			type      : 'Label',
			text      : 'hide',
			font      : getFont(13, 'cm'),
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
