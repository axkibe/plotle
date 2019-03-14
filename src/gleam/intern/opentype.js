/*
| Opentype.js interface including glyph caching.
*/
'use strict';


tim.define( module, ( def ) => {


def.abstract = true;


const gleam_color = tim.require( '../color' );

const shell_settings = tim.require( '../../shell/settings' );


const opentypeOptions =
	Object.freeze( {
		kerning: true,
		features: {
			liga: true,
			rlig: true
		},
		script: 'latn'
	} );

const opentypeOptionsHinting =
	Object.freeze( {
		hinting: true,
		kerning: true,
		features: {
			liga: true,
			rlig: true
		},
		script: 'latn'
	} );


const round = Math.round;


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

	for( let a = 0, al = glyphs.length; a < al; a++ )
	{
		const glyph = glyphs[ a ];

		if( glyph.advanceWidth ) w += glyph.advanceWidth * fontScale;

		if( a + 1 < al )
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
		color, // the color to draw in
		size,  // the actual size to draw
		align, // horizontal align
		base,  // vertial align
		cx     // canvas context to draw it on.
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 9 ) throw new Error( );
/**/
/**/	if( color.timtype !== gleam_color ) throw new Error( );
/**/
/**/	if( size !== Math.floor( size ) ) throw new Error( );
/**/}

	const otFont = font.family.opentype;

	const glyphCache = otFont.glyphCache;

	let glyphCacheColor = glyphCache[ color.css ];

	if( !glyphCacheColor ) glyphCacheColor = glyphCache[ color.css ] = { };

	let glyphCacheSet = glyphCacheColor[ size ];

	if( !glyphCacheSet ) glyphCacheSet = glyphCacheColor[ size ] = { };

	const fontScale = 1 / otFont.unitsPerEm * size;

	const options = size >= 8 ? opentypeOptionsHinting : opentypeOptions;

	const glyphs = otFont.stringToGlyphs( text, options );

	switch( align )
	{
		case 'center' : x -= getWidth( glyphs, otFont, fontScale ) / 2; break;

		case 'left' : break;

		case 'right' : x -= getWidth( glyphs, otFont, fontScale ); break;

		default : throw new Error( );
	}

	switch( base )
	{
		case 'alphabetic' : break;

		case 'middle' :
		{
			let capheight = otFont.capheight;

			if( !capheight )
			{
				otFont.capheight = capheight = getCapHeight( otFont );
			}

			y += capheight * fontScale / 2 - 0.5;

			break;
		}

		default : throw new Error( );
	}

	let glyph;

	for( let a = 0, al = glyphs.length; a < al; a++ )
	{
		if( glyph )
		{
			if( glyph.advanceWidth ) x += glyph.advanceWidth * fontScale;

			x += otFont.getKerningValue( glyph, glyphs[ a ] ) * fontScale;
		}

		glyph = glyphs[ a ];

		if( size >= shell_settings.glyphCacheLimit )
		{
			const path = glyph.getPath( round( x ), round( y ), size, options, otFont );

			path.draw( cx );

			continue;
		}

		const index = glyph.index;

		const cg = glyphCacheSet[ index ];

		if( cg )
		{
			if( cg.canvas )
			{
				cx.drawImage( cg.canvas, round( x + cg.x1 ), round( y + cg.y1 ) );
			}

			continue;
		}

		const path = glyph.getPath( 0, 0, size, options, otFont );

		const bb = path.getBoundingBox( );

		let x1 = Math.floor( bb.x1 );

		let y1 = Math.floor( bb.y1 );

		let x2 = Math.ceil( bb.x2 );

		let y2 = Math.ceil( bb.y2 );

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
