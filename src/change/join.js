/*
| A text ( para ) is joined.
*/
'use strict';


tim.define( module, ( def, change_join ) => {


const change_generic = require( './generic' );

const change_grow = require( './grow' );

const change_insert = require( './insert' );

const change_list = require( './list' );

const change_mark_node = require( './mark/node' );

const change_mark_text = require( './mark/text' );

const change_remove = require( './remove' );

const change_set = require( './set' );

const change_shrink = require( './shrink' );

const change_split = require( './split' );

const change_wrap = require( './wrap' );

const change_wrapList = require( './wrapList' );

const error = require( './error' );


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


/**
*** Exta checking
***/
/**/if( CHECK )
/**/{
/**/	def.func._check =
/**/		function( )
/**/	{
/**/		if( this.at1 < 0 )
/**/		{
/**/			throw error.make( 'join.at1 negative' );
/**/		}
/**/	};
/**/}


/*
| Returns the inversion to this change.
*/
def.lazy.reverse =
	function( )
{
	const inv =
		change_split.create(
			'path', this.path,
			'at1', this.at1,
			'path2', this.path2
		);

	tim.aheadValue( inv, 'reverse', this );

	return inv;
};


/*
| Performs the insertion change on a tree.
*/
def.func.changeTree =
	function(
		tree
	)
{
	const at1 = this.at1;

	const path = this.path;

	const path2 = this.path2;

	const text = tree.getPath( path );

	const text2 = tree.getPath( path2 );

	if( typeof( text ) !== 'string' )
	{
		throw error.make( 'join.path signates no string' );
	}

	if( typeof( text2 ) !== 'string' )
	{
		throw error.make( 'join.path2 signates no string' );
	}

	let pivot = tree.getPath( path.shorten.shorten.shorten );

	if( !pivot.getKey ) throw error.make( 'join.pivot not ranked' );

	if( at1 !== text.length )
	{
		throw error.make( 'join.at1 !== text.length' );
	}

	if( !path2.shorten.shorten.subPathOf( path ) )
	{
		throw error.make( 'join.path2 not a subPath' );
	}

	const key = path.get( -2 );

	const key2 = path2.get( -2 );

	let para1 = pivot.get( key );

	const para2 = pivot.get( key2 );

	const rank1 = pivot.rankOf( key );

	const rank2 = pivot.rankOf( key2 );

	if( rank1 < 0 )
	{
		throw error.make( 'join.path has no rank' );
	}

	if( rank2 < 0 )
	{
		throw error.make( 'join.path2 has no rank' );
	}

	if( rank1 + 1 !== rank2 )
	{
		throw error.make( 'join ranks not sequential' );
	}

	para1 = para1.create( 'text', para1.text + para2.text );

	pivot =
		pivot.create(
			'twig:set', key, para1,
			'twig:remove', key2
		);

	return tree.setPath( path.shorten.shorten.shorten, pivot );
};


/*
| Reversivly performs this change on a tree.
*/
def.func.changeTreeReverse = change_generic.changeTreeReverse;


/*
| Returns a change, changeList, changeWrap or changeWrapList
| transformed on this change.
*/
def.func.transform =
	function(
		cx
	)
{
	if( !cx ) return cx;

	switch( cx.timtype )
	{
		case change_mark_text :

			return this._transformTextMark( cx );

		case change_mark_node : // FUTURE might be para
		case change_set :

			return cx;

		case change_grow :
		case change_shrink :

			// FUTURE change ranks
			// but right now this can never happen
			// since for text split/join is excl. used
			// and grow/shrink excl. for items
			return cx;

		case change_join :
		case change_split :

			return this._transformJoinSplit( cx );

		case change_insert :
		case change_remove :

			return this._transformInsertRemove( cx );

		case change_list :

			return this._transformChangeList( cx );

		case change_wrap :

			return this._transformChangeWrap( cx );

		case change_wrapList :

			return this._transformChangeWrapList( cx );

		default :

			throw new Error( );
	}
};


/*
| Returns a change list transformed by this change.
*/
def.func._transformChangeList = change_generic.transformChangeList;


/*
| Returns a change wrap transformed by this change.
*/
def.func._transformChangeWrap = change_generic.transformChangeWrap;


/*
| Returns a change wrap list transformed by this change.
*/
def.func._transformChangeWrapList = change_generic.transformChangeWrapList;


/*
| Transforms an insert/remove change
| considering this join actually came first.
*/
def.func._transformInsertRemove =
	function(
		cx
	)
{

/**/if( CHECK )
/**/{
/**/	if( cx.timtype !== change_insert && cx.timtype !== change_remove )
/**/	{
/**/		throw new Error( );
/**/	}
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
def.func._transformJoinSplit =
	function(
		cx
	)
{

/**/if( CHECK )
/**/{
/**/	if( cx.timtype !== change_join && cx.timtype !== change_split )
/**/	{
/**/		throw new Error( );
/**/	}
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
def.func._transformTextMark =
	function(
		mark
	)
{
	if( !this.path2.equals( mark.path ) ) return mark;

	return(
		mark.create(
			'path', this.path,
			'at', mark.at + this.at1
		)
	);
};


/*
| Transforms a range mark by this join.
*/
def.func._transformRangeMark = change_generic.transformRangeMark;


} );
