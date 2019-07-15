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

	def.json = './base';
}


const tim_path = tim.require( 'tim.js/path' );

const trace_base = tim.require( './base' );

const trace_item = tim.require( './item' );

const trace_hasGrid = tim.require( './hasGrid' );

const trace_hasSnapping = tim.require( './hasSnapping' );

const trace_root = tim.require( './root' );


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
| Custom JSON converter.
*/
def.lazy.asJSON =
	function( )
{
	return(
		{
			type : 'trace',
			trace :
				this.length > 0
				? [ '(o)space' ].concat( this.last.asJSON.trace )
				: [ ]
		}
	);
};


/*
| The trace step as string (for debugging).
*/
def.lazy.asStringStep = ( ) => 'space';


/*
| Creates one step from the a JSON.
*/
def.static.createFromJSONStep =
	function(
		trace, // the json trace
		pos    // the position in the trace
	)
{
/**/if( CHECK )
/**/{
/**/	if( trace[ pos ] !== '(o)space' ) throw new Error( );
/**/}

	return(
		trace_base.createFromJSONTrace( trace, pos + 1, trace_root.singleton )
		.appendSpace
	);
};


/*
| If the trace starts with space as "fake root"
| instead of tracing to root.space
*/
def.staticLazy.fakeRoot = ( ) => trace_space.create( );


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
| This is the space trace.
*/
def.lazy.traceSpace = function( ) { return this; };


} );
