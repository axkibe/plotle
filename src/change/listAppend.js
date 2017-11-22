/*
| Appends to a list.
*/
'use strict';


// FIXME
var
	change_generic,
	change_error,
	change_listShorten;


if( NODE )
{
	change_listShorten = require( './listShorten' );
	change_generic = require( './generic' );
	change_error = require( './error' );
}



tim.define( module, 'change_listAppend', ( def, change_listAppend ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		val :
		{
			// value to append
			type : require( './typemap-value' ),
			json : true,
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
	return list.append( this.val );
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
