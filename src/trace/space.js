/*
| A trace into a space.
*/
'use strict';


tim.define( module, ( def, trace_space ) => {


def.extend = './base';


if( TIM )
{
	// path of trace back
	def.list = [ './root' ];

	def.json = 'trace_space';
}


const tim_path = tim.require( 'tim.js/path' );

const trace_item = tim.require( './item' );

const trace_hasGrid = tim.require( './hasGrid' );

const trace_hasSnapping = tim.require( './hasSnapping' );


/*
| Returns a trace with a 'hasGrid' part appended.
*/
def.lazy.appendHasGrid =
	function( )
{
	return trace_hasGrid.create( 'list:init', this, 'list:append', this );
};


/*
| Returns a trace with an 'hasSnapping' part appended.
*/
def.lazy.appendHasSnapping =
	function( )
{
	return trace_hasSnapping.create( 'list:init', this, 'list:append', this );
};


/*
| Returns a trace with an item part appended.
*/
def.lazyFuncStr.appendItem =
	function(
		key // key of the item
	)
{
	return trace_item.create( 'list:init', this, 'list:append', this, 'key', key );
};


/*
| The trace step as string (for debugging).
*/
def.lazy.asStringStep = ( ) => 'space';


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

	return tree.create( 'space', leaf );
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

	return this.last.pick( tree ).space;
};


/*
| FIXME remove
*/
def.lazy.toPath =
	function( )
{
	if( this.length === 0 ) return tim_path.empty;

	return this.get( this.length - 1 ).toPath.append( 'space' );
};


/*
| This is the space trace.
*/
def.lazy.traceSpace = function( ) { return this; };


/*
| JSON converter.
*/
def.lazy.asJSON =
	function( )
{
	return(
		{
			type : 'trace_space',
			trace :
				this.length > 0
				? this.last.asJSON.trace.concat( [ '(o)space' ] )
				: [ ]
		}
	);
};


} );
