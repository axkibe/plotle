/*
| A font style.
|
| FIXME family is ignored?
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


} );
