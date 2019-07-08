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

	def.json = './base';
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
| Custom JSON converter.
*/
def.lazy.asJSON =
	function( )
{
	return(
		{
			type : 'trace',
			trace : [ '(o)disc' ].concat( this.last.asJSON.trace )
		}
	);
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
