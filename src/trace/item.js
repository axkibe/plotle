/*
| A trace into an item on a space.
*/
'use strict';


tim.define( module, ( def, trace_item ) => {


def.extend = './base';


if( TIM )
{
	def.attributes =
	{
		// key of the paragraph
		key : { type : 'string' },
	};

	// path of trace back.
	def.list = [ './root', './space' ];
}


const trace_doc = tim.require( './doc' );

const trace_field = tim.require( './field' );

const trace_widget = tim.require( './widget' );


/*
| Returns a trace with a doc part appended.
*/
def.lazy.appendDoc =
	function( )
{
	return trace_doc.create( 'list:init', this, 'list:append', this );
};


/*
| Returns a trace with a field part appended.
*/
def.lazyFuncStr.appendField =
	function(
		key
	)
{
	return trace_field.create( 'list:init', this, 'list:append', this, 'key', key );
};


/*
| Returns a trace with a widget part appended.
*/
def.lazyFuncStr.appendWidget =
	function(
		key
	)
{
	return trace_widget.create( 'list:init', this, 'list:append', this, 'key', key );
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
| This is the item trace.
*/
def.lazy.traceItem = function( ) { return this; };


} );
