/*
| A trace into a 'hasGrid' setting
*/
'use strict';


tim.define( module, ( def, trace_hasGrid ) => {


def.extend = './base';


if( TIM )
{
	// path of trace back.
	def.list = [ './root', './space' ];
}


/*
| The trace step as string (for debugging).
*/
def.lazy.asStringStep = ( ) => 'hasGrid';


/*
| Grafts a new leaf on a tree.
| In case of a root trace returns the leaf.
*/
def.proto.graft =
	function(
		tree,
		val
	)
{
/**/if( CHECK )
/**/{
/**/	if( typeof( val ) !== 'boolean' ) throw new Error( );
/**/}

	let sub = this.last.pick( tree );

	sub = sub.create( 'hasGrid', val );

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
	return this.last.pick( tree ).hasGrid;
};


/*
| FIXME remove.
*/
def.lazy.toPath =
	function( )
{
	return this.get( this.length - 1 ).toPath.append( 'hasGrid' );
};


} );
