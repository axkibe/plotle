/*
| A text ( para ) is joined.
*/
'use strict';


// FIXME
var
	change_generic,
	change_error,
	change_split;


if( NODE )
{
	change_generic = require( './generic' );
	change_error = require( './error' );
	change_split = require( './remove' );
}


tim.define( module, 'change_join', ( def, change_join ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		path :
		{
			// join at this path
			type : 'tim$path',
			json : true,
		},
		at1 :
		{
			// join at this place
			// must be length of text
			type : 'integer',
			json : true,
		},
		path2 :
		{
			comment : 'join this',
			// must be after path
			type : 'tim$path',
			json : true,
		}
	};

	def.init = [ ];
}


/*
| Initializer.
*/
def.func._init =
	function( )
{
	if( this.at1 < 0 )
	{
		throw change_error( 'join.at1 negative' );
	}
};


/*:::::::::::::.
:: Lazy values
'::::::::::::::*/


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


/*:::::::::::.
:: Functions
'::::::::::::*/


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
		throw change_error( 'join.path signates no string' );
	}

	if( typeof( text2 ) !== 'string' )
	{
		throw change_error( 'join.path2 signates no string' );
	}

	let pivot = tree.getPath( path.shorten.shorten.shorten );

	if( !pivot.getKey ) throw change_error( 'join.pivot not ranked' );

	if( at1 !== text.length )
	{
		throw change_error( 'join.at1 !== text.length' );
	}

	if( !path2.shorten.shorten.subPathOf( path ) )
	{
		throw change_error( 'join.path2 not a subPath' );
	}

	const key = path.get( -2 );

	const key2 = path2.get( -2 );

	let para1 = pivot.get( key );

	const para2 = pivot.get( key2 );

	const rank1 = pivot.rankOf( key );

	const rank2 = pivot.rankOf( key2 );

	if( rank1 < 0 )
	{
		throw change_error( 'join.path has no rank' );
	}

	if( rank2 < 0 )
	{
		throw change_error( 'join.path2 has no rank' );
	}

	if( rank1 + 1 !== rank2 )
	{
		throw change_error( 'join ranks not sequential' );
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

	switch( cx.reflect )
	{
		case 'change_mark_text' :

			return this._transformTextMark( cx );

		case 'change_mark_node' : // FUTURE might be para
		case 'change_set' :

			return cx;

		case 'change_grow' :
		case 'change_shrink' :

			// FUTURE change ranks
			// but right now this can never happen
			// since for text split/join is excl. used
			// and grow/shrink excl. for items
			return cx;

		case 'change_join' :
		case 'change_split' :

			return this._transformJoinSplit( cx );

		case 'change_insert' :
		case 'change_remove' :

			return this._transformInsertRemove( cx );

		case 'change_list' :

			return this._transformChangeList( cx );

		case 'change_wrap' :

			return this._transformChangeWrap( cx );

		case 'change_wrapList' :

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
/**/	if( cx.reflect !== 'change_insert' && cx.reflect !== 'change_remove' )
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
/**/	if( cx.reflect !== 'change_join' && cx.reflect !== 'change_split' )
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
