/*
| A trace into a text.
*/
'use strict';


tim.define( module, ( def, trace_offset ) => {


def.extend = './bare';


if( TIM )
{
	def.attributes =
	{
		// offset of the trace
		at : { type : 'integer' },
	};

	// path of trace back.
	def.list = [ './root', './space', './item', './doc', './para' ];
}


} );
