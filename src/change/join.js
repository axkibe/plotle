/*
| A text ( para ) is joined.
*/
'use strict';


tim.define( module, ( def, change_join ) => {


def.extend = './generic';


if( TIM )
{
	def.attributes =
	{
		// join at this path
		path : { type : 'tim.js/path', json : true },

		// join at this place
		// must be length of text
		at1 : { type : 'integer', json : true },

		// join this
		// must be after path
		path2 : { type : 'tim.js/path', json : true },
	};

	def.json = 'change_join';
}


const change_grow = tim.require( './grow' );

const change_insert = tim.require( './insert' );

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
	if( this.at1 < 0 ) throw error.make( 'join.at1 negative' );
};


/*
| Returns the inversion to this change.
*/
def.lazy.reversed =
	function( )
{
	const inv =
		change_split.create(
			'path', this.path,
			'at1', this.at1,
			'path2', this.path2
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
	const at1 = this.at1;

	const path = this.path;

	const path2 = this.path2;

	const text = tree.getPath( path );

	const text2 = tree.getPath( path2 );

	if( typeof( text ) !== 'string' ) throw error.make( 'join.path signates no string' );

	if( typeof( text2 ) !== 'string' ) throw error.make( 'join.path2 signates no string' );

	let pivot = tree.getPath( path.shorten.shorten.shorten );

	if( !pivot.getKey ) throw error.make( 'join.pivot not ranked' );

	if( at1 !== text.length ) throw error.make( 'join.at1 !== text.length' );

	if( !path2.shorten.shorten.subPathOf( path ) ) throw error.make( 'join.path2 not a subPath' );

	const key = path.get( -2 );

	const key2 = path2.get( -2 );

	let para1 = pivot.get( key );

	const para2 = pivot.get( key2 );

	const rank1 = pivot.rankOf( key );

	const rank2 = pivot.rankOf( key2 );

	if( rank1 < 0 ) throw error.make( 'join.path has no rank' );

	if( rank2 < 0 ) throw error.make( 'join.path2 has no rank' );

	if( rank1 + 1 !== rank2 ) throw error.make( 'join ranks not sequential' );

	para1 = para1.create( 'text', para1.text + para2.text );

	pivot =
		pivot.create(
			'twig:set', key, para1,
			'twig:remove', key2
		);

	return tree.setPath( path.shorten.shorten.shorten, pivot );
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
	map.set( mark_items,  '_transformSame' );
	map.set( mark_widget, '_transformSame' );

	// FUTURE might be para
	map.set( change_set,  '_transformSame' );

	// FUTURE change ranks
	// but right now this can never happen
	// since for text split/join is excl. used
	// and grow/shrink excl. for items
	map.set( change_grow,   '_transformSame' );
	map.set( change_shrink, '_transformSame' );

	map.set( change_join,  '_transformJoinSplit' );
	map.set( change_split, '_transformJoinSplit' );

	map.set( change_insert, '_transformInsertRemove' );
	map.set( change_remove, '_transformInsertRemove' );


	map.set( change_list,     '_transformChangeList' );
	map.set( change_wrap,     '_transformChangeWrap' );
	map.set( change_wrapList, '_transformChangeWrapList' );

	return map;
};


/*
| Transforms an insert/remove change
| considering this join actually came first.
*/
def.proto._transformInsertRemove =
	function(
		cx
	)
{
/**/if( CHECK )
/**/{
/**/	if( cx.timtype !== change_insert && cx.timtype !== change_remove ) throw new Error( );
/**/}

	if( !this.path2.equals( cx.path ) ) return cx;

	return(
		cx.create(
			'path', this.path,
			'at1', cx.at1 + this.at1,
			'at2', cx.at2 + this.at1
		)
	);
};


/*
| Transforms an join/split change
| considering this join actually came first.
*/
def.proto._transformJoinSplit =
	function(
		cx
	)
{
/**/if( CHECK )
/**/{
/**/	if( cx.timtype !== change_join && cx.timtype !== change_split ) throw new Error( );
/**/}

	if( !this.path2.equals( cx.path ) ) return cx;

	return(
		cx.create(
			'path', this.path,
			'at1', cx.at1 + this.at1
		)
	);
};


/*
| Transforms a mark by this join.
*/
def.proto._transformMarkPat =
	function(
		mark
	)
{
	if( !this.path2.equals( mark.path.chop ) ) return mark;

	return(
		mark.create(
			'path', this.path.prepend( mark.path.get( 0 ) ),
			'at', mark.at + this.at1
		)
	);
};


} );
