/*
| Opentype.js interface
| including glyph caching.
*/


var
	font_default,
	gleam_intern_opentype,
	shell_settings;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	getWidth,
	opentypeOptions,
	opentypeOptionsHinting,
	round;


opentypeOptions =
	{
	  	kerning: true,
	    features: {
	   	    liga: true,
			rlig: true
	   	},
		script: 'latn'
	};

opentypeOptionsHinting =
	{
		hinting: true,
		kerning: true,
	    features: {
	   	    liga: true,
			rlig: true
	   	},
		script: 'latn'
	};


round = Math.round;


/**/if( FREEZE )
/**/{
/**/	Object.freeze( opentypeOptions );
/**/	Object.freeze( opentypeOptionsHinting );
/**/}


gleam_intern_opentype = { };



/*
| Gets the cap height for a font.
*/
function getCapHeight( font )
{
	var
		a,
		aZ,
		chars,
		idx;

	chars = 'HIKLEFJMNTZBDPRAGOQSUVWXY';

	for( a = 0, aZ = chars.length; a < aZ; a++ )
	{
		idx = font.charToGlyphIndex( chars[ a ] );

		if( idx <= 0 ) continue;

		return font.glyphs.get( idx ).getMetrics( ).yMax;
	}
}


/*
| Returns the width of a glyph array.
*/
getWidth =
	function(
		glyphs,     // glyph array
		font,       // font
		fontScale   // font scale
	)
{
	var
		a,
		aZ,
		glyph,
		w;

	w = 0;

	for( a = 0, aZ = glyphs.length; a < aZ; a++ )
	{
		glyph = glyphs[ a ];

	    if( glyph.advanceWidth )
		{
	        w += glyph.advanceWidth * fontScale;
	    }

		if( a + 1 < aZ )
		{
		    w +=
				font.getKerningValue(
					glyph,
					glyphs[ a + 1 ]
				) * fontScale;
		}
	}

	return w;
};


/*
| Draws text.
*/
gleam_intern_opentype.drawText =
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
		a,
		aZ,
		bb,
		canvas,
		capheight,
		cg,
		cvx,
		fontScale,
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

	glyphCache = font_default.glyphCache;

	glyphCacheSet = glyphCache[ size ];

	if( !glyphCacheSet )
	{
		glyphCacheSet = glyphCache[ size ] = { };
	}

	fontScale = 1 / font_default.unitsPerEm * size;

	options = size >= 8 ? opentypeOptionsHinting : opentypeOptions;

	glyphs = font_default.stringToGlyphs( text, options );

	switch( font.align )
	{
		case 'center' :

			x -= getWidth( glyphs, font_default, fontScale ) / 2;

			break;

		case 'end' :

			x -= getWidth( glyphs, font_default, fontScale );

			break;
	}

	switch( font.base )
	{
		case 'middle' :

			capheight = font_default.capheight;

			if( !capheight )
			{
				font_default.capheight =
				capheight =
					getCapHeight( font_default );
			}

			y += capheight * fontScale / 2 - 0.5;

			break;
	}

	for( a = 0, aZ = glyphs.length; a < aZ; a++ )
	{
		if( glyph )
		{
	        if( glyph.advanceWidth )
			{
		   	    x += glyph.advanceWidth * fontScale;
		   	}

			x +=
				font_default.getKerningValue(
					glyph,
					glyphs[ a ]
				) * fontScale;
		}

	   	glyph = glyphs[ a ];

		if( size >= shell_settings.glyphCacheLimit )
		{
		      	path =
				glyph.getPath(
					round( x ),
					round( y ),
					size,
					options,
					font_default
				);

			path.draw( cx );

			continue;
		}

		index = glyph.index;

		cg = glyphCacheSet[ index ];

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

		path = glyph.getPath( 0, 0, size, options, font_default );

		bb = path.getBoundingBox( );

		x1 = Math.floor( bb.x1 );

		y1 = Math.floor( bb.y1 );

		x2 = Math.ceil( bb.x2 );

		y2 = Math.ceil( bb.y2 );

		if( x2 - x1 > 0 && y2 - y1 > 0 )
		{
			canvas = document.createElement( 'canvas' );

			canvas.width = x2 - x1;

			canvas.height = y2 - y1;

			cvx = canvas.getContext( '2d' );

			cvx.translate( -x1, -y1 );

			path.draw( cvx );

			cx.drawImage( canvas, round( x + x1 ), round( y + y1 ) );
		}
		else
		{
			canvas = undefined;

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


} )( );
