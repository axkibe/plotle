/*
| A trace into a space.
*/
'use strict';

tim.define( module, ( def, trace_space ) => {


def.extend = './bare';


if( TIM )
{
	// path of trace back.
	def.list = [ './root' ];
}


const trace_form = tim.require( './form' );


/*
| Returns a trace with an item part appended.
*/
def.lazyFuncStr.appendForm =
	function(
		name // name of the form
	)
{
	return trace_form.create( 'list:init', this, 'list:append', this, 'name', name );
};


} );
