/*
| A trace into a form.
*/
'use strict';


tim.define( module, ( def, trace_form ) => {


def.extend = './baseGroupKey';

if( TIM )
{
	def.attributes =
	{
		// key of the form
		key : { type : 'string' },
	};

	// path of trace back.
	def.list = [ './root', './forms' ];

	def.json = './base';
}

const trace_nonSpaceRef = tim.require( './nonSpaceRef' );
const trace_widget = tim.require( './widget' );


/*
| Returns a trace with a nonSpaceRef appended.
*/
def.lazy.appendNonSpaceRef =
	function( )
{
	return trace_nonSpaceRef.create( 'list:init', this, 'list:append', this );
};


/*
| Returns a trace with a widget step appended.
*/
def.lazyFunc.appendWidget =
	function(
		key // key of the widget
	)
{
	return trace_widget.create( 'list:init', this, 'list:append', this, 'key', key );
};


/*
| Custom JSON converter.
*/
def.lazy.asJSON =
	function( )
{
	return(
		{
			type : 'trace',
			trace : [ '(o)form', this.key ].concat( this.last.asJSON.trace )
		}
	);
};


/*
| The trace step as string (for debugging).
*/
def.lazy.asStringStep =
	function( )
{
	return 'form(' + this.key + ')';
};


/*
| This is the form trace.
*/
def.lazy.traceForm = function( ) { return this; };


} );
