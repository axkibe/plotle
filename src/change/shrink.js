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
		// shrinks at this path
		path : { type : 'tim.js/path', json : true },

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

const mark_pat = tim.require( '../mark/pat' );

const mark_range = tim.require( '../mark/range' );

const mark_widget = tim.require( '../mark/widget' );

const pathList = tim.require( 'tim.js/pathList' );


/*
| Exta checking
*/
def.proto._check =
	function( )
{
	if( this.rank !== undefined && this.rank < 0 ) throw error.make( 'set.rank negative' );
};


/*
| Returns the inversion to this change.
*/
def.lazy.reversed =
	function( )
{
	const inv =
		change_grow.create(
			'path', this.path,
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
	const prev = tree.getPath( this.path );

	if( prev !== this.prev && !prev.equalsJSON( this.prev ) )
	{
		throw error.make( 'shrink.prev doesn\'t match' );
	}

	if( this.path.get( -2 ) !== 'twig' )
	{
		throw error.make( 'shrink.path( -2 ) with rank not twig' );
	}

	let pivot = tree.getPath( this.path.shorten.shorten );

	const key = this.path.get( -1 );

	const rank = pivot.rankOf( key );

	if( rank !== this.rank ) throw error.make( 'shrink.rank doesn\'t match' );

	pivot = pivot.create( 'twig:remove', key );

	if( this.path.length > 2 ) tree = tree.setPath( this.path.shorten.shorten, pivot );
	else tree = pivot;

	return tree;
};


/*
| Maps transformables to transform functions
*/
def.staticLazy._transformers = ( ) =>
{
	const map = new Map( );

	map.set( mark_pat,    '_transformMarkPat' );
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
	if( !this.path.chop.equals( c.path.chop ) ) return c;

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
	if( !this.path.subPathOf( cx.path ) ) return cx;

	// otherwise it is gone!
};


/*
| Transforms a mark by this set.
*/
def.proto._transformMarkPat =
	function(
		mark
	)
{
	if( !this.path.subPathOf( mark.path.chop ) ) return mark;
};


/*
| Transforms a mark by this set.
*/
def.proto._transformMarkItems =
	function(
		mark
	)
{
	const paths = mark.itemPaths;

	let any = false;

	for( let path of paths )
	{
		if( this.path.subPathOf( path.chop ) ) { any = true; break; }
	}

	if( !any ) return mark;

	const a = [ ];

	for( let path of paths )
	{
		if( !this.path.subPathOf( path.chop ) ) { a.push( path ); }
	}

	return mark_items.create( 'itemPaths', pathList.create( 'list:init', a ) );
};


} );
