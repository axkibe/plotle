/*
| A text ( para ) is splited.
*/
'use strict';


// FIXME
var
	change_generic,
	change_error,
	change_join,
	change_list;


if( NODE )
{
	change_generic = require( './generic' );
	change_error = require( './error' );
	change_list = require( './list' );
	change_join = require( './remove' );
}


tim.define( module, 'change_split', ( def, change_split ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		path :
		{
			// split at this path
			type : 'tim$path',
			json : true,
		},
		at1 :
		{
			// insert at this place begin
			type : 'integer',
			json : true,
		},
		path2 :
		{
			// split created this new/next path
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
	function ( )
{
	if( this.at1 < 0 ) throw change_error( 'split.at1 negative' );
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
		change_join.create(
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

	if( typeof( text ) !== 'string' )
	{
		throw change_error( 'split.path signates no string' );
	}

	let pivot = tree.getPath( path.shorten.shorten.shorten );

	if( !pivot.getKey )
	{
		throw change_error( 'split.pivot not ranked' );
	}

	if( at1 > text.length )
	{
		throw change_error( 'split.at1 > text.length' );
	}

	if( !path2.shorten.shorten.subPathOf( path ) )
	{
		throw change_error( 'split.path2 not a subPath' );
	}

	const key = path.get( -2 );

	const key2 = path2.get( -2 );

	if( pivot.get( key2 ) )
	{
		throw change_error( 'split.path2 already exists' );
	}

	let para1 = pivot.get( key );

	const rank1 = pivot.rankOf( key );

	if( rank1 < 0 )
	{
		throw change_error( 'split has no rank' );
	}

	para1 = para1.create( 'text', text.substring( 0, at1 ) );

	const para2 = para1.create( 'text', text.substring( at1 ) );

	pivot =
		pivot.create(
			'twig:set', key, para1,
			'twig:insert', key2, rank1 + 1, para2
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

		case 'change_grow' :
		case 'change_shrink' :

			// FUTURE change ranks
			// but right now this can never happen
			// since for text split/join is excl. used
			// and grow/shrink excl. for items
			return cx;

		case 'change_set' :
		case 'change_mark_node' :

			return cx;

		case 'change_join' :
		case 'change_split' :

			return this._transformJoinSplit( cx );

		case 'change_insert' :

			return this._transformInsert( cx );

		case 'change_list' :

			return this._transformChangeList( cx );

		case 'change_remove' :

			return this._transformRemove( cx );

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
| Transforms an insert change
| considering this split actually came first.
*/
def.func._transformInsert =
	function(
		cx
	)
{
	//console.log( 'transform insert by split' );

/**/if( CHECK )
/**/{
/**/	if( cx.reflect !== 'change_insert' ) throw new Error( );
/**/}

	if( !this.path.equals( cx.path ) ) return cx;

	if( cx.at1 <= this.at1 ) return cx;

	// insert is changed to happen
	// in the splitted line
	return(
		cx.create(
			'path', this.path2,
			'at1', cx.at1 - this.at1,
			'at2', cx.at2 - this.at1
		)
	);
};


/*
| Transforms a join/split change
| considering this split actually came first.
*/
def.func._transformJoinSplit =
	function(
		cx
	)
{
	//console.log( 'transform join by split' );

/**/if( CHECK )
/**/{
/**/	if( cx.reflect !== 'change_join' && cx.reflect !== 'change_split' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if( !this.path.equals( cx.path ) ) return cx;

	if( cx.at1 <= this.at1 ) return cx;

	// join/split is changed to happen
	// in the splitted line
	return(
		cx.create(
			'path', this.path2,
			'at1', cx.at1 - this.at1
		)
	);
};


/*
| Transforms a text mark by this split.
*/
def.func._transformTextMark =
	function(
		mark
	)
{
	if( !this.path.equals( mark.path ) ) return mark;

	if( mark.at < this.at1 ) return mark;

	return(
		mark.create(
			'path', this.path2,
			'at', mark.at - this.at1
		)
	);
};


/*
| Transforms a remove change
| considering this split actually came first.
*/
def.func._transformRemove =
	function(
		cx
	)
{
	//console.log( 'transform remove by split' );

/**/if( CHECK )
/**/{
/**/	if( cx.reflect !== 'change_remove' ) throw new Error( );
/**/}

	// text    ttttttttttttt
	// split         ^
	// case 0    xxx '          remove left
	// case 1      xxxxx        remove is split
	// case 2        ' xxxx     remove right

	if( !this.path.equals( cx.path ) ) return cx;

	if( cx.at2 <= this.at1 )
	{
		// case 0, the remove is not affect

		return cx;
	}
	else if( cx.at1 >= this.at1 )
	{
		// case 2, the remove happend in splited line

		return cx.create(
			'path', this.path2,
			'at1', cx.at1 - this.at1,
			'at2', cx.at2 - this.at1
		);
	}
	else
	{
		// case 1, the remove is split into two removes
		return(
			change_list.create(
				'list:init',
				[
					cx.create(
						'at2', this.at1,
						'val', cx.val.substring( 0, this.at1 - cx.at1 )
					),
					cx.create(
						'at1', 0,
						'at2', cx.at2 - this.at1,
						'path', this.path2,
						'val', cx.val.substring( this.at1 - cx.at1 )
					)
				]
			)
		);
	}
};


} );
