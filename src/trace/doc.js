/*
| A trace into a document.
*/
'use strict';


tim.define( module, ( def, trace_doc ) => {


def.extend = './base';

if( TIM )
{
	// path of trace back.
	def.list = [ './root', './space', './item' ];

	def.json = './base';
}

const trace_base = tim.require( './base' );
const trace_para = tim.require( './para' );


/*
| Returns a trace with a para appended.
*/
def.lazyFunc.appendPara =
	function(
		key // key of the para
	)
{
	return trace_para.create( 'list:init', this, 'list:append', this, 'key', key );
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
			trace : [ '(o)doc' ].concat( this.last.asJSON.trace )
		}
	);
};


/*
| The trace step as string (for debugging).
*/
def.lazy.asStringStep = ( ) => 'doc';


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
/**/	if( trace[ pos ] !== '(o)doc' ) throw new Error( );
/**/}

	return trace_base.createFromJSONTrace( trace, pos + 1 ).appendDoc;
};


/*
| Grafts a new leaf on a tree.
| In case of a root trace returns the leaf.
*/
def.proto.graft =
	function(
		tree,
		leaf
	)
{
	let sub = this.last.pick( tree );

	sub = sub.create( 'doc', leaf );

	if( this.length === 0 ) return sub;

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
	if( this.length === 0 ) return tree;

	return this.last.pick( tree ).doc;
};


/*
| This is the space trace.
*/
def.lazy.traceDoc = function( ) { return this; };


} );
