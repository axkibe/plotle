/*
| A flow block consists of flow lines.
*/
'use strict';


tim.define( module, ( def ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		// height of the flow
		height : { type : 'number' },

		// width of the flow
		width : { type : 'number' },
	};

	def.list = [ './line' ];
}


} );
