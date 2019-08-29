/*
| Removes a tree node.
*/
'use strict';


tim.define( module, ( def, change_shrink ) => {


def.extend = './generic';


if( TIM )
{
	def.attributes =
	{
		// shrinks at this trace
		trace : { type : [ '< ../trace/change-types' ], json : true },

		// value the tree had
		prev : { type : [ '< ./value-types' ], json : true },

		// rank of new node
		rank : { type : 'integer', json : true },
	};

	def.json = 'change_shrink';
}


const change_grow = tim.require( './grow' );
const change_insert = tim.require( './insert' );
const change_join = tim.require( './join' );
const change_list = tim.require( './list' );
const change_remove = tim.require( './remove' );
const change_set = tim.require( './set' );
const change_split = tim.require( './split' );
const change_wrap = tim.require( './wrap' );
const change_wrapList = tim.require( './wrapList' );
const error = tim.require( './error' );
const mark_caret = tim.require( '../mark/caret' );
const mark_items = tim.require( '../mark/items' );
const mark_range = tim.require( '../mark/range' );
const mark_widget = tim.require( '../mark/widget' );
const trace_offset = tim.require( '../trace/offset' );


/*
| Exta checking
*/
def.proto._check =
	function( )
{
	if( this.rank !== undefined && this.rank < 0 ) throw error.make( 'set.rank negative' );

	// changes need to use space as fake root
	if( this.trace.traceRoot ) throw error.make( 'trace has wrong root' );
};


/*
| Returns the inversion to this change.
*/
def.lazy.reversed =
	function( )
{
	const inv =
		change_grow.create(
			'trace', this.trace,
			'val', this.prev,
			'rank', this.rank
		);

	tim.aheadValue( inv, 'reversed', this );

	return inv;
};


/*
| Performs the insertion change on a tree.
*/
def.proto.changeTree =
	function(
		tree
	)
{
	// Stores the old value for history tracking.
	const prev = this.trace.pick( tree );

	if( prev !== this.prev && !prev.equalsJSON( this.prev ) )
	{
		throw error.make( 'shrink.prev doesn\'t match' );
	}

	let pivot = this.trace.last.pick( tree );

	const key = this.trace.key;

	const rank = pivot.rankOf( key );

	if( rank !== this.rank ) throw error.make( 'shrink.rank doesn\'t match' );

	pivot = pivot.create( 'twig:remove', key );

	return this.trace.last.graft( tree, pivot );
};


/*
| Maps transformables to transform functions
*/
def.staticLazy._transformers = ( ) =>
{
	const map = new Map( );

	map.set( mark_caret,  '_transformMarkCaret' );
	map.set( mark_range,  '_transformMarkRange' );
	map.set( mark_items,  '_transformMarkItems' );
	map.set( mark_widget, '_transformSame' );

	map.set( change_grow,   '_transformGrowShrink' );
	map.set( change_shrink, '_transformGrowShrink' );

	map.set( change_join,   '_transformJIRS' );
	map.set( change_split,  '_transformJIRS' );
	map.set( change_insert, '_transformJIRS' );
	map.set( change_remove, '_transformJIRS' );
	map.set( change_set,    '_transformJIRS' );

	map.set( change_list,     '_transformChangeList' );
	map.set( change_wrap,     '_transformChangeWrap' );
	map.set( change_wrapList, '_transformChangeWrapList' );

	return map;
};


/*
| Transforms a shrink by this shrink.
*/
def.proto._transformGrowShrink =
	function(
		c
	)
{
	if( !this.trace.last.equals( c.trace.last ) ) return c;

	if( this.rank > c.rank ) return c;

	return c.create( 'rank', c.rank - 1 );
};


/*
| Transforms a insert/remove/set/split changes
| by this shrink
*/
def.proto._transformJIRS =
	function(
		cx
	)
{
	if( !this.trace.hasTrace( cx.trace ) ) return cx;

	// otherwise it is gone!
};


/*
| Transforms an offset by this set.
*/
def.proto._transformOffset =
	function(
		offset
	)
{
/**/if( CHECK )
/**/{
/**/	if( offset.timtype !== trace_offset ) throw new Error( );
/**/}

	// is the offset trace on another paragraph?
	// since the offset stores para key there is no change
	// needed even it is below the split
	if( !this.trace.equals( offset.traceItem.chopRoot ) ) return offset;
};


/*
| Transforms a mark by this set.
*/
def.proto._transformMarkItems =
	function(
		mark
	)
{
/**/if( CHECK )
/**/{
/**/	if( mark.timtype !== mark_items ) throw new Error( );
/**/}

	let any = false;

	for( let itemTrace of mark )
	{
		if( this.trace.traceItem.equals( itemTrace.chopRoot ) ) { any = true; break; }
	}

	if( !any ) return mark;

	const set = new Set( );

	for( let itemTrace of mark )
	{
		if( !this.trace.traceItem.equals( itemTrace.chopRoot ) ) { set.add( itemTrace ); }
	}

	return mark_items.create( 'set:init', set );
};


} );
