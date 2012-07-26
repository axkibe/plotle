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
                 .-,--.     .  .
                  '|__/ ,-. |- |- ,-. ,-. ,-.
                  ,|    ,-| |  |  |-' |   | |
                  `'    `-^ `' `' `-' '   ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 dashboard design patterns.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Export
*/
var Design;
Design = Design || { };

/**
| Imports
*/
var Euclid;

/**
| Capsule
*/
(function () {
"use strict";

/**
| Designs (for the dashboard)
*/
Design.Pattern = {
	'Design' : {
		must : {
			'frame'      : 'Frame',
			'curve'      : 'Curve',
			'style'      : 'String',
			'layout'     : 'Layout'
		}
	},

	'Frame'  : {
		must : {
			pnw          : 'Point',
			pse          : 'Point'
		}
	},

	'MoveTo' : {
		must : {
			to           : 'Point',
			bx           : 'Number',
			by           : 'Number'
		}
	},

	'LineTo' : {
		must : {
			to           : 'Point',
			bx           : 'Number',
			by           : 'Number'
		}
	},

	'BeziTo' : {
		must : {
			to           : 'Point',
			bx           : 'Number',
			by           : 'Number',
			// FIXME Maybe replace with "Tangent"
			c1x          : 'Number',
			c1y          : 'Number',
			c2x          : 'Number',
			c2y          : 'Number'
		}
	},

	'Curve'   : {
		copse : {
			'MoveTo'     : true,
			'LineTo'     : true,
			'BeziTo'     : true
		}
	},

	'Button' : {
		must : {
			'caption'    : 'Label',
			'code'       : 'String',
			'curve'      : 'Curve',
			'frame'      : 'Frame',
			'normaStyle' : 'String',
			'hoverStyle' : 'String',
			'focusStyle' : 'String',
			'hofocStyle' : 'String'
		}
	},

	'Input'  : {
		must : {
			'code'       : 'String',
			'frame'      : 'Frame',
			'password'   : 'Boolean',
			'normaStyle' : 'String',
			'hoverStyle' : 'String',
			'focusStyle' : 'String',
			'hofocStyle' : 'String',
			'font'       : 'Font',
			'maxlen'     : 'Number'
		}
	},

	'Layout'  : {
		copse : {
			'Chat'       : true,
			'Button'     : true,
			'Input'      : true,
			'Label'      : true
		},
		ranks : true
	},

	'Font' : {
		creator : function(t) {
			return new Euclid.Font(t);
		},

		must    : {
			'size'       : 'Number',
			'family'     : 'String',
			'align'      : 'String',
			'fill'       : 'String',
			'base'       : 'String'
		}
	},

	'Chat'  : {
		must : {
			'frame'      : 'Frame',
			'font'       : 'Font'
		}
	},

	'Label'  : {
		must : {
			'text'       : 'String',
			'pos'        : 'Point',
			'font'       : 'Font'
		}
	},

	'Point'  : {
		must : {
			'anchor'     : 'String',
			'x'          : 'Number',
			'y'          : 'Number'
		}
	}
};

})();

