/*
| A trace into a paragraph from a doc.
*/
'use strict';


tim.define( module, ( def, trace_para ) => {


def.extend = './base';


if( TIM )
{
	def.attributes =
	{
		// key of the paragraph
		key : { type : 'string' },
	};


	// path of trace back.
	def.list = [ './root', './space', './item', './doc' ];
}


const fabric_para = tim.require( '../fabric/para' );

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
| The trace step as string (for debugging).
*/
def.lazy.asStringStep =
	function( )
{
	return 'para(' + this.key + ')';
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
	let sub = this.pick( tree );

	console.log( this );

/**/if( CHECK )
/**/{
/**/	if( sub !== fabric_para ) throw new Error( );
/**/}

	sub = sub.create( 'twig:set', this.key, leaf );

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

	return this.last.pick( tree ).get( this.key );
};


/*
| FIXME remove.
*/
def.lazy.toPath =
	function( )
{
	return this.get( this.length - 1 ).toPath.append( 'twig' ).append( this.key );
};


/*
| This is the para trace.
*/
def.lazy.tracePara = function( ) { return this; };


} );
