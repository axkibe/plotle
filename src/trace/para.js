/*
| A trace into a paragraph from a doc.
*/
'use strict';


tim.define( module, ( def, trace_para ) => {


def.extend = './baseTwigKey';


if( TIM )
{
	// path of trace back.
	def.list = [ './root', './space', './item', './doc' ];

	def.json = 'trace_para';
}


const trace_text = tim.require( './text' );


/*
| Returns a trace with a doc part appended.
*/
def.lazy.appendText =
	function( )
{
	return trace_text.create( 'list:init', this, 'list:append', this );
};


/*
| JSON converter.
*/
def.lazy.asJSON =
	function( )
{
	return(
		{
			type : 'trace_para',
			trace : this.last.asJSON.trace.concat( [ '(o)para', this.key ] )
		}
	);
};


/*
| The trace step as string (for debugging).
*/
def.lazy.asStringStep =
	function( )
{
	return 'para(' + this.key + ')';
};


/*
| This is the para trace.
*/
def.lazy.tracePara = function( ) { return this; };


} );
