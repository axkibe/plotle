/*
| A trace into a field (on an item).
*/
'use strict';


tim.define( module, ( def, trace_field ) => {


def.extend = './base';


if( TIM )
{
	def.attributes =
	{
		// key of the field
		key : { type : 'string' },
	};


	// path of trace back.
	def.list = [ './root', './space', './item' ];
}


const trace_offset = tim.require( './offset' );


/*
| Returns a trace with an offset appended.
*/
def.lazyFuncInt.appendOffset =
	function(
		at // offset
	)
{
	return trace_offset.create( 'list:init', this, 'list:append', this, 'at', at );
};


/*
| FIXME remove.
*/
def.lazy.toPath =
	function( )
{
	return this.get( this.length - 1 ).toPath.append( this.key );
};


} );
