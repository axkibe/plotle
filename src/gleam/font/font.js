/*
| A font style.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// size of the font
		size : { type : 'number' },

		// family of the font
		family : { type : './family' },
	};
}


/*
| Factor to add to the bottom of font height.
| FUTURE remove
*/
def.static.bottomBox = 0.25;


/*
| Measures the advance width of a given text.
*/
def.proto.getAdvanceWidth =
	function(
		text
	)
{
	return this.family.opentype.getAdvanceWidth( text, this.size );
};


/*
| Applies a transformation to this font.
*/
def.proto.transform =
	function(
		transform
	)
{
	return this.family.get( this.size * transform.zoom );
};



/*
| Returns the font with rounded size.
*/
def.lazy.round =
	function( )
{
	const size = this.size;

	const rsize = Math.round( size );

	if( rsize === size ) return this;

	return this.family.get( rsize );
};


} );
