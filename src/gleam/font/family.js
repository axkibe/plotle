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
		_pool : { type : 'protean', defaultValue : '{ }' },
	};
}


const gleam_font_font = tim.require( './font' );


/*
| Returns the font tim.
| FIXME remove get
*/
def.proto.get =
def.proto.createSize =
	function(
		size
	)
{
	let font = this._pool[ size ];

	if( font ) return font;

	font = this._pool[ size ] = gleam_font_font.create( 'family', this, 'size', size );

	return font;
};


/*
| Measures the advance width of a given text.
*/
def.proto.getAdvanceWidth =
	function(
		text
	)
{
	return this.opentype.getAdvanceWidth( text, this.size );
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
def.lazy._tPool =
	function( )
{
	return { };
};


/*
| Inherits the transform pool if alike.
*/
def.inherit._tPool =
	function(
		inherit
	)
{
	return this.alikeWithoutSize( inherit );
};


} );
