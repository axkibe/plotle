/*
| Opentype.js interface
| including glyph caching.
*/
'use strict';


tim.define( module, 'gleam_intern_opentype', ( def, gleam_intern_opentype ) => {


const shell_settings = require( '../../shell/settings' );


const opentypeOptions =
	{
	  	kerning: true,
	    features: {
	   	    liga: true,
			rlig: true
	   	},
		script: 'latn'
	};

const opentypeOptionsHinting =
	{
		hinting: true,
		kerning: true,
	    features: {
	   	    liga: true,
			rlig: true
	   	},
		script: 'latn'
	};


const round = Math.round;


/**/if( FREEZE )
/**/{
/**/	Object.freeze( opentypeOptions );
/**/	Object.freeze( opentypeOptionsHinting );
/**/}


/*
| Gets the cap height for a font.
*/
function getCapHeight( font )
{
	const chars = 'HIKLEFJMNTZBDPRAGOQSUVWXY';

	for( let a = 0, al = chars.length; a < al; a++ )
	{
		const idx = font.charToGlyphIndex( chars[ a ] );

		if( idx <= 0 ) continue;

		return font.glyphs.get( idx ).getMetrics( ).yMax;
	}
}


/*
| Returns the width of a glyph array.
*/
const getWidth =
	function(
		glyphs,     // glyph array
		font,       // font
		fontScale   // font scale
	)
{
	let w = 0;

	for( let a = 0, aZ = glyphs.length; a < aZ; a++ )
	{
		const glyph = glyphs[ a ];

	    if( glyph.advanceWidth ) w += glyph.advanceWidth * fontScale;

		if( a + 1 < aZ )
		{
		    w += font.getKerningValue( glyph, glyphs[ a + 1 ] ) * fontScale;
		}
	}

	return w;
};


/*
| Draws text.
*/
def.static.drawText =
	function(
		text,  // text to draw
		x,     // x
		y,     // y
		font,  // font to draw it in
		size,  // the actual size to draw
		cx     // canvas context to draw it on.
	)
{
	var
		glyph,
		glyphCache,
		glyphCacheSet,
		glyphs,
		index,
		options,
		path,
		x1,
		y1,
		x2,
		y2;

/**/if( CHECK )
/**/{
/**/	if( size !== Math.floor( size ) ) throw new Error();
/**/}

	const otFont = font.opentype;

	glyphCache = otFont.glyphCache;

	glyphCacheSet = glyphCache[ size ];

	if( !glyphCacheSet )
	{
		glyphCacheSet = glyphCache[ size ] = { };
	}

	const fontScale = 1 / otFont.unitsPerEm * size;

	options = size >= 8 ? opentypeOptionsHinting : opentypeOptions;

	glyphs = otFont.stringToGlyphs( text, options );

	switch( font.align )
	{
		case 'center' :

			x -= getWidth( glyphs, otFont, fontScale ) / 2;

			break;

		case 'end' :

			x -= getWidth( glyphs, otFont, fontScale );

			break;
	}

	switch( font.base )
	{
		case 'middle' :

			let capheight = otFont.capheight;

			if( !capheight )
			{
				otFont.capheight = capheight = getCapHeight( otFont );
			}

			y += capheight * fontScale / 2 - 0.5;

			break;
	}

	for( let a = 0, aZ = glyphs.length; a < aZ; a++ )
	{
		if( glyph )
		{
	        if( glyph.advanceWidth )
			{
		   	    x += glyph.advanceWidth * fontScale;
		   	}

			x += otFont.getKerningValue( glyph, glyphs[ a ] ) * fontScale;
		}

	   	glyph = glyphs[ a ];

		if( size >= shell_settings.glyphCacheLimit )
		{
	      	path = glyph.getPath( round( x ), round( y ), size, options, otFont );

			path.draw( cx );

			continue;
		}

		index = glyph.index;

		const cg = glyphCacheSet[ index ];

		if( cg )
		{
			if( cg.canvas )
			{
				cx.drawImage(
					cg.canvas,
					round( x + cg.x1 ),
					round( y + cg.y1 )
				);
			}

			continue;
		}

		path = glyph.getPath( 0, 0, size, options, otFont );

		const bb = path.getBoundingBox( );

		x1 = Math.floor( bb.x1 );

		y1 = Math.floor( bb.y1 );

		x2 = Math.ceil( bb.x2 );

		y2 = Math.ceil( bb.y2 );

		let canvas;

		if( x2 - x1 > 0 && y2 - y1 > 0 )
		{
			canvas = document.createElement( 'canvas' );

			canvas.width = x2 - x1;

			canvas.height = y2 - y1;

			const cvx = canvas.getContext( '2d' );

			cvx.translate( -x1, -y1 );

			path.draw( cvx );

			cx.drawImage( canvas, round( x + x1 ), round( y + y1 ) );
		}
		else
		{
			canvas = undefined; // FIXME remove

			x1 = x2 = y1 = y2 = 0;
		}

		glyphCacheSet[ index ] =
			{
				canvas : canvas,
				x1 : x1,
				y1 : y1
			};
	}
};


} );

