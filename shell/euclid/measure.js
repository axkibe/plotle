/**                            _..._
    _....._                 .-'_..._''. .---.    _______
  .'       '.             .' .'      '.\|   |.--.\  ___ `'.
 /   .-'"'.  \           / .'           |   ||__| ' |--.\  \
/   /______\  |         . '             |   |.--. | |    \  '
|   __________|         | |             |   ||  | | |     |  '
\  (          '  _    _ | |             |   ||  | | |     |  |
 \  '-.___..-~. | '  / |. '             |   ||  | | |     ' .'
  `         .'..' | .' | \ '.          .|   ||  | | |___.' /'
   `'-.....-.'./  | /  |  '. `._____.-'/|   ||__|/_______.'/
              |   `'.  |    `-.______ / '---'    \_______|/
              '   .'|  '/            `
               `-'  `--'
              ,-,-,-.
              `,| | |   ,-. ,-. ,-. . . ,-. ,-.
                | ; | . |-' ,-| `-. | | |   |-'
                '   `-' `-' `-^ `-' `-^ '   `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Measures texts.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Exports
*/
var Euclid;

/**
| Imports
*/
var Jools;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser'); }

/**
| Singleton
*/
var Measure = Euclid.Measure = {

	/**
	| Initialize is called once by shell
	*/
	init : function() {
		if (Measure._$cs) { throw new Error('Measure already initialized'); }

		var canvas = document.createElement('canvas');
		Measure._$cx     = canvas.getContext('2d');
		Measure._$size   = null;
		Measure._$family = null;
	},

	/**
	| Returns the width of text with the specified font.
	*/
	width : function(font, text) {
		var cx   = Measure._$cx;

		if (Measure._$size   !== font.size ||
			Measure._$family !== font.family
		) {
			Measure._$size   = font.size;
			Measure._$family = font.family;
			cx.font = font.size + 'px ' + font.family; // TODO move into the font object
		}

		return cx.measureText(text).width;
	}
};

})();
