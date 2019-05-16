/*
| A trace into an item on a space.
*/
'use strict';


tim.define( module, ( def, trace_item ) => {


def.extend = './bare';


if( TIM )
{
	def.attributes =
	{
		// key of the paragraph
		key : { type : 'string' },
	};
}


} );
