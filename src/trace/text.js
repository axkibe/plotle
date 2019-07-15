/*
| A trace into a text.
*/
'use strict';


tim.define( module, ( def, trace_text ) => {


def.extend = './base';

if( TIM )
{
	// path of trace back.
	def.list =
	[
		'./doc',
		'./field',
		'./form',
		'./forms',
		'./item',
		'./para',
		'./root',
		'./space',
		'./widget'
	];

	def.json = './base';
}


const trace_base = tim.require( './base' );

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
| Custom JSON converter.
*/
def.lazy.asJSON =
	function( )
{
	return(
		{
			type : 'trace',
			trace : [ '(o)text' ].concat( this.last.asJSON.trace )
		}
	);
};


/*
| The trace step as string (for debugging).
*/
def.lazy.asStringStep = ( ) => 'text';


/*
| Creates one step from the a JSON.
*/
def.static.createFromJSONStep =
	function(
		trace, // the json trace
		pos    // the position in the trace
	)
{
	if( CHECK )
/**/{
/**/	if( trace[ pos ] !== '(o)text' ) throw new Error( );
/**/}

	return trace_base.createFromJSONTrace( trace, pos + 1 ).appendText;
};


/*
| Grafts a new leaf on a tree.
| In case of a root trace returns the leaf.
*/
def.proto.graft =
	function(
		tree,
		text
	)
{
/**/if( CHECK )
/**/{
/**/	if( typeof( text ) !== 'string' ) throw new Error( );
/**/}

	let sub = this.last.pick( tree );

	sub = sub.create( 'text', text );

	return this.last.graft( tree, sub );
};


/*
| Picks the traced leaf.
*/
def.proto.pick =
	function(
		tree
	)
{
	return this.last.pick( tree ).text;
};


/*
| This is the text trace.
*/
def.lazy.traceText = function( ) { return this; };


} );
