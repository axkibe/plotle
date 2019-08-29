/*
| A trace into a disc
*/
'use strict';


tim.define( module, ( def ) => {


def.extend = './baseTwigKey';

if( TIM )
{
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


/*
| The trace step as string (for debugging).
*/
def.lazy.asStringStep =
	function( )
{
	return 'disc(' + this.key + ')';
};


/*
| This is the disc trace.
*/
def.lazy.traceDisc = function( ) { return this; };


} );
