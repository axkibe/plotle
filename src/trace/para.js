/*
| A trace into a paragraph from a doc.
*/
'use strict';


tim.define( module, ( def, trace_offset ) => {


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
