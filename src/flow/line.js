/*
| A flow line of tokens.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// offset in text
		offset : { type : 'integer' },

		// y position of line
		y : { type : 'number' },
	};

	def.list = [ './token' ];
}


} );
