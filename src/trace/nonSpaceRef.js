/*
| A trace into the "nonSpaceRef" field of a form.
*/
'use strict';


tim.define( module, ( def, trace_nonSpaceRef ) => {


def.extend = './base';

if( TIM )
{
	// path of trace back.
	def.list = [ './form', './forms', './root' ];
}

const ref_space = tim.require( '../ref/space' );


/*
| The trace step as string (for debugging).
*/
def.lazy.asStringStep = ( ) => 'nonSpaceRef';


/*
| Grafts a new leaf on a tree.
| In case of a root trace returns the leaf.
*/
def.proto.graft =
	function(
		tree,
		ref
	)
{
/**/if( CHECK )
/**/{
/**/	if( ref.timtype !== ref_space ) throw new Error( );
/**/}

	let sub = this.last.pick( tree );

	sub = sub.create( 'nonSpaceRef', ref );

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
	return this.last.pick( tree ).nonSpaceRef;
};


} );
