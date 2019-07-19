/*
| A font with a specific size
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// color of the font
		color : { type : '../color' },

		// size of the font
		size : { type : './size' },
	};
}


/*
| Applies a transformation to this fontFace.
*/
def.proto.transform =
	function(
		transform
	)
{
	return this.size.transform( transform ).createFace( this.color );
};


/*
| Returns the fontFace with rounded size.
*/
def.lazy.roundSize =
	function( )
{
	return this.size.roundSize.createFace( this.color );
};


} );
