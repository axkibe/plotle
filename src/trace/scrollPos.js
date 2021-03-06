/*
| A trace into a scrollPos.
*/
'use strict';


tim.define( module, ( def, trace_scrollPos ) => {


def.extend = './base';

if( TIM )
{
	// path of trace back.
	def.list = [ './form', './forms', './item', './root', './space', './widget' ];
}

const gleam_point = tim.require( '../gleam/point' );


/*
| The trace step as string (for debugging).
*/
def.lazy.asStringStep = ( ) => 'scrollPos';


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

	sub = sub.create( 'scrollPos', pos );

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
	return this.last.pick( tree ).scrollPos;
};


} );
