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

	const tSame           = ( c ) => c;
	const tMarkPat        = function( c ) { return this._transformMarkPat( c ); };
	const tMarkCaret      = function( c ) { return this._transformMarkCaret( c ); };
	const tMarkRange      = function( c ) { return this._transformMarkRange( c ); };
	const tMarkItems      = function( c ) { return this._transformMarkItems( c ); };
	const tJIRS           = function( c ) { return this._transformJIRS( c ); };
	const tChangeList     = function( c ) { return this._transformChangeList( c ); };
	const tChangeWrap     = function( c ) { return this._transformChangeWrap( c ); };
	const tChangeWrapList = function( c ) { return this._transformChangeWrapList( c ); };

	map.set( mark_pat,    tMarkPat );
	map.set( mark_caret,  tMarkCaret );
	map.set( mark_range,  tMarkRange );
	map.set( mark_items,  tMarkItems );
	map.set( mark_widget, tSame );

	// FUTURE fix ranks
	map.set( change_grow,      tSame );
	map.set( change_shrink,    tSame );

	map.set( change_join,      tJIRS );
	map.set( change_split,     tJIRS );
	map.set( change_insert,    tJIRS );
	map.set( change_remove,    tJIRS );
	map.set( change_set,       tJIRS );

	map.set( change_list,      tChangeList );
	map.set( change_wrap,      tChangeWrap );
	map.set( change_wrapList,  tChangeWrapList );

	return map;
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
