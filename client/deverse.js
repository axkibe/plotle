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

 (cockpit) design patterns.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Exports
*/
var Deverse;

/**
| Capsule
*/
(function () {
"use strict";

/**
| Designs (for the cockpit)
*/
Deverse = {
	'Design' : {
		must : {
			'frame'      : 'Frame',
			'curve'      : 'Curve',
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
			// @@ Maybe replace with "Tangent"
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

	'Custom' : {
		must : {
			'frame'      : 'Frame',
			'caption'    : 'Label',
			'curve'      : 'Curve',
			'normaStyle' : 'String',
			'hoverStyle' : 'String',
			'focusStyle' : 'String',
			'hofocStyle' : 'String'
		}
	},

	'Input'  : {
		must : {
			'frame'      : 'Frame',
			'password'   : 'Boolean',
			'normaStyle' : 'String',
			'hoverStyle' : 'String',
			'focusStyle' : 'String',
			'hofocStyle' : 'String',
			'fontStyle'  : 'FontStyle',
			'maxlen'     : 'Number'
		}
	},

	'Layout'  : {
		copse : {
			'Custom'     : true,
			'Input'      : true,
			'Label'      : true
		},
		ranks : true
	},

	'FontStyle' : {
		must    : {
			'size'       : 'Number',
			'font'       : 'String',
			'style'      : 'String',
			'align'      : 'String',
			'fill'       : 'String',
			'base'       : 'String'
		}
	},

	'Label'  : {
		must : {
			'text'       : 'String',
			'pos'        : 'Point',
			'fontStyle'  : 'FontStyle'
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

