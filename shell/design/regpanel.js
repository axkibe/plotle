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
             .-,--.        .-,--.             .
              `|__/ ,-. ,-. '|__/ ,-. ,-. ,-. |
              )| \  |-' | | ,|    ,-| | | |-' |
              `'  ` `-' `-| `'    `-^ ' ' `-' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~,| ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                         `'
 Design of the register panel.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var Euclid;

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

var getFont    = Design.getFont;

// 'magic' number to approximate ellipses with beziers
var magic      = Euclid.magic;
var mbConsts   = Design.MainPanel.consts;

/**
| Register control
*/
var regBW        = 110;
var regBH        = 110;
var regBXM       = regBW * magic / 2;
var regBYM       = regBH * magic / 2;

/**
| Close control
*/
var canrBW        = 70;
var canrBH        = 70;
var canrBXM       = canrBW * magic / 2;
var canrBYM       = canrBH * magic / 2;

var RegPanel = Design.RegPanel = { type   : 'Design' };

RegPanel.style = 'panel';

RegPanel.frame = {
	type  : 'Frame',
	pnw   : { type   : 'Point', anchor : 's', x : -512, y : -300 },
	pse   : { type   : 'Point', anchor : 's', x :  512, y :    0 }
};

RegPanel.curve = {
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
		c1x  :  mbConsts.C1X * 0.8, c1y  :  mbConsts.C1Y * 4,
		c2x  : -mbConsts.C2X * 0.8, c2y  :  mbConsts.C2Y * 4,
		bx:  0, by :  1
	},
	'3' : {
		type :  'BeziTo',
		to   :  { type: 'Point', anchor: 'se', x: 0, y: 0 },
		c1x  :  mbConsts.C2X * 0.8, c1y  : -mbConsts.C2Y * 4,
		c2x  : -mbConsts.C1X * 0.8, c2y  :  mbConsts.C1Y * 4,
		bx   : -1, by :  0
	}},

	ranks : [ '1', '2', '3' ]
};

RegPanel.layout = {
	type  : 'Layout',
	copse : {
	'regL'      : {
		type    : 'Label',
		text    : 'Register',
		font    : getFont(22, 'ca'),
		pos     : { type: 'Point', anchor: 'sw', x: 120, y: -14 }
	},
	'userL'     : {
		type    : 'Label',
		text    : 'username',
		font    : getFont(16, 'ra'),
		pos     : { type: 'Point', anchor: 's', x: -155, y:  -220 }
	},
	'emailL'    : {
		type    : 'Label',
		text    : 'email',
		font    : getFont(16, 'ra'),
		pos     : { type: 'Point', anchor: 's', x: -155, y:  -180 }
	},
	'passL'     : {
		type    : 'Label',
		text    : 'password',
		font    : getFont(16, 'ra'),
		pos     : { type: 'Point', anchor: 's', x: -155, y:  -140 }
	},
	'pass2L'    : {
		type    : 'Label',
		text    : 'repeat password',
		font    : getFont(16, 'ra'),
		pos     : { type: 'Point', anchor: 's', x: -155, y:  -100 }
	},
	'errL'      : {
		type    : 'Label',
		text    : '',
		font    : getFont(14, 'lar'),
		pos     : { type: 'Point', anchor: 's', x: -135, y:  -255 }

	},
	'userI' : {
		type       : 'Input',
		code       : '',
		password   :  false,
		normaStyle : 'input',
		focusStyle : 'inputFocus',
		hoverStyle : 'input',
		hofocStyle : 'inputFocus',
		font       : getFont(14, 'la'),
		maxlen     : 100,
		frame      : {
			type   : 'Frame',
			pnw    : { type: 'Point', anchor: 's', x: -135, y:  -238 },
			pse    : { type: 'Point', anchor: 's', x:   95, y:  -212 }
		}
	},
	'emailI' : {
		type       : 'Input',
		code       : '',
		password   :  false,
		normaStyle : 'input',
		focusStyle : 'inputFocus',
		hoverStyle : 'input',
		hofocStyle : 'inputFocus',
		font       : getFont(14, 'la'),
		maxlen     : 0,
		frame      : {
			type   : 'Frame',
			pnw    : { type: 'Point', anchor: 's', x: -135, y:  -198 },
			pse    : { type: 'Point', anchor: 's', x:   95, y:  -172 }
		}
	},
	'passI' : {
		type       : 'Input',
		code       : '',
		password   :  true,
		normaStyle : 'input',
		focusStyle : 'inputFocus',
		hoverStyle : 'input',
		hofocStyle : 'inputFocus',
		font       : getFont(14, 'la'),
		maxlen     : 0,
		frame      : {
			type   : 'Frame',
			pnw    : { type: 'Point', anchor: 's', x: -135, y:  -158 },
			pse    : { type: 'Point', anchor: 's', x:   95, y:  -132 }
		}
	},
	'pass2I' : {
		type       : 'Input',
		code       : '',
		password   :  true,
		normaStyle : 'input',
		focusStyle : 'inputFocus',
		hoverStyle : 'input',
		hofocStyle : 'inputFocus',
		font       : getFont(14, 'la'),
		maxlen     : 0,
		frame      : {
			type   : 'Frame',
			pnw    : { type: 'Point', anchor: 's', x: -135, y:  -118 },
			pse    : { type: 'Point', anchor: 's', x:   95, y:   -92 }
		}
	},
	'regB'      : {
		type       : 'Button',
		code       : 'RegRegisterButton',
		normaStyle : 'button',
		hoverStyle : 'buttonHover',
		focusStyle : 'buttonFocus',
		hofocStyle : 'buttonHofoc',
		frame      : {
			type   : 'Frame',
			pnw    : { type: 'Point', anchor: 'se', x: -360,         y: -100 - regBH },
			pse    : { type: 'Point', anchor: 'se', x: -360 + regBW, y: -100         }
		},
		caption       : {
			type      : 'Label',
			text      : 'register',
			font      : getFont(14, 'cm'),
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
				c1x  :  regBXM, c1y :       0,
				c2x  :       0, c2y : -regBYM,
				bx   : -1, by:  0
			},
			'3' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 's', x:  0, y: -1 },
				c1x  :       0, c1y :  regBYM,
				c2x  :  regBXM, c2y :       0,
				bx   :  0, by: -1
			},
			'4' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 'w', x:  1, y:  0 },
				c1x  : -regBXM, c1y :       0,
				c2x  :       0, c2y :  regBYM,
				bx   :  1, by:  0
			},
			'5' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 'n', x:  0, y:  1 },
				c1x  :       0, c1y : -regBYM,
				c2x  : -regBXM, c2y :       0,
				bx   :  0, by:  1
			}},

			ranks : [ '1', '2', '3', '4', '5' ]
		}
	},
	'closeB'      : {
		type       : 'Button',
		code       : 'RegCloseButton',
		normaStyle : 'button',
		hoverStyle : 'buttonHover',
		focusStyle : 'buttonFocus',
		hofocStyle : 'buttonHofoc',
		frame : {
			type  : 'Frame',
			pnw   : { type: 'Point', anchor: 'se', x: -230,          y: -60 - canrBH },
			pse   : { type: 'Point', anchor: 'se', x: -230 + canrBW, y: -60 }
		},
		caption : {
			type  : 'Label',
			text  : 'close',
			font  : getFont(14, 'cm'),
			pos   : { type: 'Point', anchor: 'c', x:  0, y: 0 }
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
				c1x  :  canrBXM, c1y :        0,
				c2x  :        0, c2y : -canrBYM,
				bx   : -1, by:  0
			},
			'3' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 's', x:  0, y: -1 },
				c1x  :        0, c1y :  canrBYM,
				c2x  :  canrBXM, c2y :        0,
				bx   :  0, by: -1
			},
			'4' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 'w', x:  1, y:  0 },
				c1x  : -canrBXM, c1y :       0,
				c2x  :        0, c2y : canrBYM,
				bx   :  1, by:  0
			},
			'5' : {
				type : 'BeziTo',
				to   :  { type: 'Point', anchor: 'n', x:  0, y:  1 },
				c1x  :        0, c1y : -canrBYM,
				c2x  : -canrBXM, c2y :        0,
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
		'regB',
		'closeB',
		//'forgotB',
		'regL',
		'userL',
		'emailL',
		'passL',
		'pass2L',
		'errL'
	]
};

})();
