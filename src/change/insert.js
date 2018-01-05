/*
| A text insertion change.
*/
'use strict';


// FIXME
var
	change_generic,
	change_error,
	change_grow,
	change_insert,
	change_list,
	change_join,
	change_remove,
	change_set,
	change_shrink,
	change_split,
	change_mark_node,
	change_mark_text,
	change_wrap,
	change_wrapList;


/*
| Node includes.
*/
if( NODE )
{
	change_generic = require( './generic' );
	change_error = require( './error' );
	change_grow = require( './grow' );
	change_insert = require( './insert' );
	change_list = require( './list' );
	change_join = require( './join' );
	change_remove = require( './remove' );
	change_set = require( './set' );
	change_shrink = require( './shrink' );
	change_split = require( './split' );
	change_mark_node = require( './mark/node' );
	change_mark_text = require( './mark/text' );
	change_wrap = require( './wrap' );
	change_wrapList = require( './wrapList' );
}


tim.define( module, 'change_insert', ( def, change_insert ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{

	def.attributes =
	{
		path :
		{
			// insert at this path
			type : 'tim$path',
			json : true,
		},
		val :
		{
			// source sign
			type : 'string',
			json : true,
		},
		at1 :
		{
			// insert at this place begin
			type : 'integer',
			json : true,
		},
		at2 :
		{
			// insert ends here
			// must be at1 + val.length
			// FUTURE have this be a lazy
			type : 'integer',
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
	if( this.at1 + this.val.length !== this.at2 )
	{
		throw change_error(
			'insert.at1 + insert.val.length '
			+ '!== insert.at2'
		);
	}

	if( this.at1 < 0 || this.at2 < 0 )
	{
		throw change_error( 'insert.at1|at2 negative' );
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
		change_remove.create(
			'path', this.path,
			'val', this.val,
			'at1', this.at1,
			'at2', this.at2
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
	const text = tree.getPath( this.path );

	if( typeof( text ) !== 'string' )
	{
		throw change_error( 'insert.path signates no string' );
	}

	if( this.at1 > text.length )
	{
		throw change_error( 'insert.at1 invalid' );
	}

	return(
		tree.setPath(
			this.path,
			text.substring( 0, this.at1 )
			+ this.val
			+ text.substring( this.at1 )
		)
	);
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

		case change_grow :
		case change_shrink :
		case change_split :
		case change_set :
		case change_mark_node :

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
| Transforms another insert/remove change
| considering this insert actually came first.
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

	if( !this.path.equals( cx.path ) ) return cx;

	if( cx.at1 < this.at1 ) return cx;

	const len = this.val.length;

	return(
		cx.create(
			'at1', cx.at1 + len,
			'at2', cx.at2 + len
		)
	);
};


/*
| Transforms a range mark by this insert.
*/
def.func._transformRangeMark = change_generic.transformRangeMark;


/*
| Transforms a text mark by this insert.
*/
def.func._transformTextMark =
	function(
		mark
	)
{
	return(
		(
			!this.path.equals( mark.path )
			|| mark.at < this.at1
		)
		? mark
		: mark.create( 'at', mark.at + this.val.length )
	);
};


/*
| Transforms a join or split change.
| considering this insert actually came first.
*/
def.func._transformJoinSplit =
	function(
		cx
	)
{

/**/if( CHECK )
/**/{
/**/	if( cx.timtype !== change_join && cx.timtype !== change_split ) throw new Error( );
/**/}

	if( !this.path.equals( cx.path ) ) return cx;

	if( this.at1 > cx.at1 )
	{
		// this insert is in the line to be splited
		// so no need to change the split

		// for joins this cannot happen anyway

		return cx;
	}

	return cx.create( 'at1', cx.at1 + this.val.length );
};


} );
