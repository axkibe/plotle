/*
| A trace into the forms root.
*/
'use strict';


tim.define( module, ( def ) => {


def.extend = './base';

if( TIM )
{
	// path of trace back.
	def.list = [ './root' ];
}

const trace_form = tim.require( './form' );


/*
| Returns a trace with an item part appended.
*/
def.lazyFuncStr.appendForm =
	function(
		key // name of the form
	)
{
	return trace_form.create( 'list:init', this, 'list:append', this, 'key', key );
};


/*
| The trace step as string (for debugging).
*/
def.lazy.asStringStep = ( ) => 'forms';


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
	if( this.length === 0 ) return leaf;

	return tree.create( 'forms', leaf );
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

	return this.last.pick( tree ).forms;
};


/*
| This is the forms trace.
*/
def.lazy.traceForms = function( ) { return this; };


} );
