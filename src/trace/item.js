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

	// path of trace back.
	def.list = [ './root', './space' ];
}


const trace_doc = tim.require( './doc' );

const trace_field = tim.require( './field' );


/*
| Returns a trace with a doc part appended.
*/
def.lazy.appendDoc =
	function( )
{
	return trace_doc.create( 'list:init', this, 'list:append', this );
};


/*
| Returns a trace with a field part appended.
*/
def.lazyFuncStr.appendField =
	function(
		key
	)
{
	return trace_field.create( 'list:init', this, 'list:append', this, 'key', key );
};


} );
