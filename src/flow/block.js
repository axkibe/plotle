/*
| A flow block consists of flow lines.
*/
'use strict';


tim.define( module, 'flow_block', ( def, flow_block ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		height :
		{
			// height of the flow
			type : 'number'
		},
		width :
		{
			// width of the flow
			type : 'number'
		}
	};

	def.list = [ 'flow_line' ];
}


} );
