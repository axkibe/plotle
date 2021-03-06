/*
| Manages all fonts (on server and shell)
*/
'use strict';


tim.define( module, ( def, font_root ) => {


if( TIM )
{
	def.group = [ './family' ];
}


const font_family = tim.require( './family' );


/*
| The cache pool
*/
let pool;


/*
| Factor to add to the bottom of font height.
| TODO remove
*/
def.static.bottomBox = 0.25;



if( NODE )
{
	const opentype = require( 'opentype.js' );

	/*
	| Loads a font (node version)
	*/
	def.static.load =
		function(
			name,      // the name of the font to load
			callback   // the callback when done so
		)
	{
		opentype.load(
			'./font/' + name + '.ttf',
			( err, otFont ) =>
			{
				if( err )
				{
					// TODO make proper error presentation
					console.log( 'Font "' + name + '" could not be loaded: ' + err );

					callback( err );

					return;
				}

				otFont.glyphCache = { };

				const fontFamily = font_family.create( 'name', name, 'opentype', otFont );

				pool = ( pool || font_root ).create( 'group:set', name, fontFamily );

				callback( undefined, fontFamily );
			}
		);
	};
}
else
{
	/*
	| Loads a font (browser version)
	*/
	def.static.load =
		function(
			name,      // the name of the font to load
			callback   // the callback when done so
		)
	{
		opentype.load(
			'font-' + name + '.ttf',
			( err, otFont ) =>
			{
				if( err )
				{
					// TODO make proper error presentation
					console.log( 'Font "' + name + '" could not be loaded: ' + err );

					return;
				}

				otFont.glyphCache = { };

				const fontFamily = font_family.create( 'name', name, 'opentype', otFont );

				pool = ( pool || font_root ).create( 'group:set', name, fontFamily );

				callback( fontFamily );
			}
		);
	};
}


/*
| Gets a font
*/
def.static.get = ( name ) => pool && pool.get( name );


} );
