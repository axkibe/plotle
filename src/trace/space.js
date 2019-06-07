/*
| A trace into a space.
*/
'use strict';

tim.define( module, ( def, trace_space ) => {


def.extend = './bare';


if( TIM )
{
	// path of trace back
	def.list = [ './root' ];
}


const trace_item = tim.require( './item' );


/*
| FIXME remove
*/
def.lazy.toPath = function( ) { return this.get( this.length - 1 ).toPath.append( 'space' ); };


/*
| Returns a trace with an item part appended.
*/
def.lazyFuncStr.appendItem =
	function(
		key // key of the item
	)
{
	return trace_item.create( 'list:init', this, 'list:append', this, 'key', key );
};


/*
| This is the space trace.
*/
def.lazy.traceSpace = function( ) { return this; };


} );
