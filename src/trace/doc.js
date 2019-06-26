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
}


const trace_para = tim.require( './para' );


/*
| Returns a trace with a para appended.
*/
def.lazyFuncStr.appendPara =
	function(
		key // key of the para
	)
{
	return trace_para.create( 'list:init', this, 'list:append', this, 'key', key );
};


/*
| The trace step as string (for debugging).
*/
def.lazy.asStringStep = ( ) => 'doc';


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
| FIXME remove.
*/
def.lazy.toPath =
	function( )
{
	return this.get( this.length - 1 ).toPath.append( 'doc' );
};


/*
| This is the space trace.
*/
def.lazy.traceDoc = function( ) { return this; };


} );
