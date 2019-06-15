/*
| A trace into the forms root.
*/
'use strict';

tim.define( module, ( def ) => {


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
		key // name of the form
	)
{
	return trace_form.create( 'list:init', this, 'list:append', this, 'key', key );
};


/*
| FIXME remove
*/
def.lazy.toPath = function( ) { return this.get( this.length - 1 ).toPath.append( 'forms' ); };


} );