/*
| A flow token.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// x position
		x : { type : 'number' },

		// width of the token
		width : { type : 'number' },

		// offset in text
		offset : { type : 'integer' },

		// token text
		text : { type : 'string' },
	};
}


} );
