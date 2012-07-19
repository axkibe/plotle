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

                                .
                              ,-| ,-. .  , ,-. ,-. ,-. ,-.
                              | | |-' | /  |-' |   `-. |-'
                              `-^ `-' `'   `-' '   `-' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 dashboard design patterns.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

 TODO Remove "deverse"

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Exports
*/
var Design;
Design = Design || { };

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
			// TODO Maybe replace with "Tangent"
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

