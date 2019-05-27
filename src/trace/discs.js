/*
| A trace into the discs root.
*/
'use strict';

tim.define( module, ( def ) => {


def.extend = './bare';


if( TIM )
{
	// path of trace back.
	def.list = [ './root' ];
}


const trace_disc = tim.require( './disc' );


/*
| Returns a trace with an item part appended.
*/
def.lazyFuncStr.appendDisc =
	function(
		key // key of the dic
	)
{
	return trace_disc.create( 'list:init', this, 'list:append', this, 'key', key );
};


} );
