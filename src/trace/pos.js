/*
| A trace into a pos.
*/
'use strict';


tim.define( module, ( def, trace_pos ) => {


def.extend = './base';


if( TIM )
{
	// path of trace back.
	def.list = [ './item', './root', './space', './zone' ];
}


const gleam_point = tim.require( '../gleam/point' );


/*
| The trace step as string (for debugging).
*/
def.lazy.asStringStep = ( ) => 'pos';


/*
| Grafts a new leaf on a tree.
| In case of a root trace returns the leaf.
*/
def.proto.graft =
	function(
		tree,
		pos
	)
{
/**/if( CHECK )
/**/{
/**/	if( pos.timtype !== gleam_point ) throw new Error( );
/**/}

	let sub = this.last.pick( tree );

	sub = sub.create( 'pos', pos );

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
	return this.last.pick( tree ).pos;
};


/*
| FIXME remove.
*/
def.lazy.toPath =
	function( )
{
	return this.get( this.length - 1 ).toPath.append( 'pos' );
};


} );
