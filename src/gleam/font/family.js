/*
| A font family.
*/
'use strict';


tim.define( module, ( def, font_family ) => {


if( TIM )
{
	def.attributes =
	{
		// name of hte family
		name : { type : 'string' },

		// opentype font implementation
		opentype : { type : [ 'undefined', 'protean' ] },

		// the size pool
		_pool : { type : 'protean', defaultValue : 'new Map( )' },
	};
}


const gleam_font_size = tim.require( './size' );


/*
| Returns the font tim.
*/
def.proto.createSize =
	function(
		size
	)
{
	const pool = this._pool;
	let font = pool.get( size  );

	if( font ) return font;

	font = gleam_font_size.create( 'family', this, 'size', size );

	pool.set( size, font );

	return font;
};


/*
| The cap height for a font.
*/
def.lazy.capheight =
	function( )
{
	const opentype = this.opentype;

	const chars = 'HIKLEFJMNTZBDPRAGOQSUVWXY';

	const glyphs = opentype.glyphs;

	for( let c of chars )
	{
		const idx = opentype.charToGlyphIndex( c );

		if( idx <= 0 ) continue;

		return glyphs.get( idx ).getMetrics( ).yMax;
	}

	throw new Error( 'Cannot determine capheigh' );
};


/*
| Applies a transformation to this font.
*/
def.proto.transform =
	function(
		transform
	)
{
	let tp = this._tPool && this._tPool[ transform.zoom ];

	if( tp ) return tp;

	tp =
	this._tPool[ transform.zoom ] =
		this.create( 'size', this.size * transform.zoom );

	// FUTURE clear a too large pool

	return tp;
};


/*
| The transform pool.
| This breaks immutability for caching.
*/
def.lazy._tPool = ( ) => ( { } );


} );
