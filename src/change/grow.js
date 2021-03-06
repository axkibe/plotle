/*
| Adds a new entry to a twig.
*/
'use strict';


tim.define( module, ( def, change_grow ) => {


def.extend = './generic';


if( TIM )
{
	def.attributes =
	{
		// grow at this trace
		trace : { type : [ '< ../trace/change-types' ], json : true },

		// value to grow
		val : { type : [ '< ./value-types' ], json : true },

		// rank of new node
		rank : { type : 'integer', json : true }
	};

	def.json = 'change_grow';
}


const change_insert = tim.require( './insert' );
const change_join = tim.require( './join' );
const change_list = tim.require( './list' );
const change_remove = tim.require( './remove' );
const change_set = tim.require( './set' );
const change_shrink = tim.require( './shrink' );
const change_split = tim.require( './split' );
const change_wrap = tim.require( './wrap' );
const change_wrapList = tim.require( './wrapList' );
const error = tim.require( './error' );
const mark_caret = tim.require( '../mark/caret' );
const mark_items = tim.require( '../mark/items' );
const mark_range = tim.require( '../mark/range' );
const mark_widget = tim.require( '../mark/widget' );


/*
| Exta checking
*/
def.proto._check =
	function( )
{
	if( this.rank !== undefined && this.rank < 0 ) throw error.make( 'grow.rank invalid' );

	// changes need to use space as fake root
	if( this.trace.traceRoot ) throw error.make( 'trace has wrong root' );
};


/*
| Performs the growth change on a tree.
*/
def.proto.changeTree =
	function(
		tree
	)
{
	let pivot = this.trace.last.pick( tree );

	const key = this.trace.key;

	const rank = this.rank;

	if( rank > pivot.length ) throw error.make( 'grow.rank > pivot.length' );

	pivot = pivot.create( 'twig:insert', key, rank, this.val );

	return this.trace.last.graft( tree, pivot );
};


/*
| This change reversed.
*/
def.lazy.reversed =
	function( )
{
	const inv =
		change_shrink.create(
			'trace', this.trace,
			'prev', this.val,
			'rank', this.rank
		);

	tim.aheadValue( inv, 'reversed', this );

	return inv;
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

	return c.create( 'rank', c.rank + 1 );
};


/*
| Maps transformables to transform functions
*/
def.staticLazy._transformers = ( ) =>
{
	const map = new Map( );

	map.set( mark_caret,  '_transformSame' );
	map.set( mark_range,  '_transformSame' );
	map.set( mark_items,  '_transformSame' );
	map.set( mark_widget, '_transformSame' );

	map.set( change_join,   '_transformSame' );
	map.set( change_split,  '_transformSame' );
	map.set( change_insert, '_transformSame' );
	map.set( change_remove, '_transformSame' );
	map.set( change_set,    '_transformSame' );

	map.set( change_grow,   '_transformGrowShrink' );
	map.set( change_shrink, '_transformGrowShrink' );

	map.set( change_list,     '_transformChangeList' );
	map.set( change_wrap,     '_transformChangeWrap' );
	map.set( change_wrapList, '_transformChangeWrapList' );

	return map;
};


} );
