/*
| Shortens a list.
|
| As reversal of append this drops the last element.
|
| FUTURE, path is missing!
*/
'use strict';


// FIXME
var
	change_generic,
	change_error,
	change_listAppend;


if( NODE )
{
	change_listAppend = require( './listAppend' );
	change_generic = require( './generic' );
	change_error = require( './error' );
}


tim.define( module, 'change_listShorten', ( def, change_listShorten ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		val :
		{
			// value been shortened
			json : true,
			type : require( './typemap-value' )
		}
	};
}


/*:::::::::::::.
:: Lazy values
'::::::::::::::*/


/*
| Returns the inversion to this change.
*/
def.lazy.reverse =
	function( )
{
	const inv = change_listShorten.create( 'val', this.val );

	tim.aheadValue( inv, 'reverse', this );

	return inv;
};


/*:::::::::::.
:: Functions
'::::::::::::*/


/*
| Performs the list app change on a tree.
*/
def.func.changeTree =
	function(
		list
	)
{
	const llen = list.length;

	if( llen === 0 )
	{
		throw change_error( 'cannot shorten an empty list' );
	}

	if( list.get( llen - 1 ).equals( this.val ) )
	{
		throw change_error( 'listShorten not shortening correct value' );
	}

	return list.remove( llen - 1 );
};


/*
| Reversivly performs this change on a tree.
*/
def.func.changeTreeReverse = change_generic.changeTreeReverse;


/*
| Returns a change* transformed on this change.
*/
def.func.transform =
	function(
		cx
	)
{
	return cx;
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

} );
