/*
| A text glint for gleam.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// horizonal alignment
		align : { type : 'string', defaultValue : '"left"' },

		// vertical alignment
		base : { type : 'string', defaultValue : '"alphabetic"' },

		// the font family, size and color to display the text in
		fontFace : { type : '../font/face' },

		// where to draw it
		p : { type : '../point' },

		// text to display
		text : { type : 'string' },

		// if defined, rotation in radiant
		rotate : { type : [ 'undefined', 'number' ] },
	};
}

const font_token = tim.require( '../font/token' );


/*
| Returns the font_token
|
| FIXME, actually make it an attribute
*/
def.lazy.token =
	function( )
{
	return(
		font_token.create(
			'size', this.fontFace.size.roundSize,
			'text', this.text
		)
	);
};


} );
