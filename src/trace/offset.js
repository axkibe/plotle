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
	def.list =
	[
		'./doc',
		'./field',
		'./form',
		'./forms',
		'./item',
		'./para',
		'./root',
		'./space',
		'./widget'
	];
}


/*
| Returns a trace with a changed offset
*/
def.proto.changeTo =
	function(
		at  // offset
	)
{
	return this.get( this.length - 1 ).appendOffset( at );
};


} );
