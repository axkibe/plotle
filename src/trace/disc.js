/*
| A trace into a disc
*/
'use strict';


tim.define( module, ( def ) => {


def.extend = './bare';


if( TIM )
{
	def.attributes =
	{
		// key of the disc
		key : { type : 'string' },
	};

	// path of trace back.
	def.list = [ './root', './discs' ];
}


const trace_widget = tim.require( './widget' );


/*
| Returns a trace with a widget appended.
*/
def.lazyFuncStr.appendWidget =
	function(
		key // key of the widget
	)
{
	return trace_widget.create( 'list:init', this, 'list:append', this, 'key', key );
};


} );