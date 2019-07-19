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


/*
| Measures the advance width.
*/
def.lazy.advanceWidth =
	function( )
{
	return this.size.family.opentype.getAdvanceWidth( this.text, this.size.size );
};


/*
| Returns the width of the token.
*/
def.lazy.width =
	function( )
{
	let w = 0;

	const otFont = this.size.family.opentype;

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
