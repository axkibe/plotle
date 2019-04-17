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
		// grow at this path
		path : { type : [ 'tim.js/path' ] , json : true },

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

const mark_pat = tim.require( '../mark/pat' );

const mark_range = tim.require( '../mark/range' );

const mark_widget = tim.require( '../mark/widget' );


/*
| Exta checking
*/
def.proto._check =
	function( )
{
	if( this.rank !== undefined && this.rank < 0 ) throw error.make( 'grow.rank invalid' );
};


/*
| Performs the growth change on a tree.
*/
def.proto.changeTree =
	function(
		tree
	)
{
	if( this.path.get( -2 ) !== 'twig' ) throw error.make( 'grow.path( -2 ) not a twig' );

	let pivot = tree.getPath( this.path.shorten.shorten );

	const key = this.path.get( -1 );

	const rank = this.rank;

	if( rank > pivot.length ) throw error.make( 'grow.rank > pivot.length' );

	pivot = pivot.create( 'twig:insert', key, rank, this.val );

	return(
		this.path.length > 2
		? tree.setPath( this.path.shorten.shorten, pivot )
		: pivot
	);
};


/*
| This change reversed.
*/
def.lazy.reversed =
	function( )
{
	const inv =
		change_shrink.create(
			'path', this.path,
			'prev', this.val,
			'rank', this.rank
		);

	tim.aheadValue( inv, 'reversed', this );

	return inv;
};


/*
| Maps transformables to transform functions
*/
def.staticLazy._transformers = ( ) =>
{
	const map = new Map( );

	const tSame           = ( c ) => c;
	const tChangeList     = function( c ) { return this._transformChangeList( c ); };
	const tChangeWrap     = function( c ) { return this._transformChangeWrap( c ); };
	const tChangeWrapList = function( c ) { return this._transformChangeWrapList( c ); };

	map.set( mark_pat,         tSame );
	map.set( mark_caret,       tSame );
	map.set( mark_range,       tSame );
	map.set( mark_items,       tSame );
	map.set( mark_widget,      tSame );

	map.set( change_join,      tSame );
	map.set( change_split,     tSame );
	map.set( change_insert,    tSame );
	map.set( change_remove,    tSame );
	map.set( change_set,       tSame );

	// FUTURE fix ranks
	map.set( change_grow,      tSame );
	map.set( change_shrink,    tSame );

	map.set( change_list,      tChangeList );
	map.set( change_wrap,      tChangeWrap );
	map.set( change_wrapList,  tChangeWrapList );

	return map;
};


} );
