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

		// display's device pixel ratio
		devicePixelRatio : { type : 'number' },

		// where to draw it
		p : { type : '../point' },

		// if defined, rotation in radiant
		rotate : { type : [ 'undefined', 'number' ] },

		// the font face to display
		fontFace : { type : '../font/face' },

		// the text to display
		text : { type : 'string' },
	};
}


def.lazy.token =
	function( )
{
	return this.fontFace.roundResize( this.devicePixelRatio ).createToken( this.text );
};


} );
