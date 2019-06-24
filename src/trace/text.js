/*
| A trace into a text.
*/
'use strict';


tim.define( module, ( def, trace_text ) => {


def.extend = './base';


if( TIM )
{
	// path of trace back.
	def.list = [ './doc', './field', './item', './para', './root', './space' ];
}


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
| The trace step as string (for debugging).
*/
def.lazy.asStringStep = ( ) => 'text';


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
| FIXME remove.
*/
def.lazy.toPath =
	function( )
{
	return this.get( this.length - 1 ).toPath.append( this.key );
};


/*
| This is the text trace.
*/
def.lazy.traceText = function( ) { return this; };


} );
