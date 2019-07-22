/*
| A token(word) in a font with a specific size.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// size of the font
		size : { type : './size' },

		text : { type : 'string' },
	};
}


const gleam_color = tim.require( '../color' );
const shell_settings = tim.require( '../../shell/settings' );
const round = Math.round;


/*
| Measures the advance width.
*/
def.lazy.advanceWidth =
	function( )
{
	return this.size.family.opentype.getAdvanceWidth( this.text, this.size.size );
};


/*
| Draws text.
*/
def.proto.draw =
	function(
		x,         // x
		y,         // y
		color,     // the fontFace to draw with
		align,     // horizontal align
		base,      // vertial align
		cx         // canvas context to draw it on.
	)
{
	const fontSize = this.size;

	const size = fontSize.size;

/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 6 ) throw new Error( );
/**/
/**/	if( color.timtype !== gleam_color ) throw new Error( );
/**/
/**/	if( size !== Math.floor( size ) ) throw new Error( );
/**/}

	const otFont = this._opentype( );

	const glyphCache = otFont.glyphCache;

	let glyphCacheColor = glyphCache[ color.css ];

	if( !glyphCacheColor ) glyphCacheColor = glyphCache[ color.css ] = { };

	let glyphCacheSet = glyphCacheColor[ size ];

	if( !glyphCacheSet ) glyphCacheSet = glyphCacheColor[ size ] = { };

	const fontScale = 1 / otFont.unitsPerEm * size;

	const options = fontSize._options;

	const glyphs = this._glyphs;

	switch( align )
	{
		case 'center' : x -= this.width * fontScale / 2; break;

		case 'left' : break;

		case 'right' : x -= this.width * fontScale; break;

		default : throw new Error( );
	}

	switch( base )
	{
		case 'alphabetic' : break;

		case 'middle' : y += fontSize.family.capheight * fontScale / 2 - 0.5; break;

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



/*
| Returns the width of the token.
*/
def.lazy.width =
	function( )
{
	let w = 0;

	const otFont = this._opentype( );

	const glyphs = this._glyphs;

	for( let a = 0, al = glyphs.length; a < al; a++ )
	{
		const glyph = glyphs[ a ];

		if( glyph.advanceWidth ) w += glyph.advanceWidth;

		if( a + 1 < al ) w += otFont.getKerningValue( glyph, glyphs[ a + 1 ] );
	}

	return w;
};


/*
| The glyphs.
*/
def.lazy._glyphs =
	function( )
{
	return this._opentype( ).stringToGlyphs( this.text, this.size._options );
};


/*
| The opentype implementation.
*/
def.proto._opentype = function( ) { return this.size.family.opentype; };


} );
