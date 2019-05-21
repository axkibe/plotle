/*
| A trace into a form.
*/
'use strict';


tim.define( module, ( def, trace_form ) => {


def.extend = './bare';


if( TIM )
{
	def.attributes =
	{
		// name of the form
		name : { type : 'string' },
	};

	// path of trace back.
	def.list = [ './root', './forms' ];
}


const trace_widget = tim.require( './widget' );


/*
| Returns a trace with a widget appended.
*/
def.lazyFuncStr.appendPara =
	function(
		key // key of the widget
	)
{
	return trace_widget.create( 'list:init', this, 'list:append', this, 'key', key );
};


} );
