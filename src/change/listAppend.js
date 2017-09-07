/*
| Appends to a list.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'change_listAppend',
		attributes :
		{
			val :
			{
				comment : 'value to grow',
				json : true,
				type : require( './typemap-value' )
			}
		}
	};
}


var
	change_generic,
	change_error,
	change_listAppend,
	change_listShorten,
	jion;


/*
| Capsule
*/
( function( ) {
"use strict";


var
	prototype;


/*
| Node includes.
*/
if( NODE )
{
	jion = require( 'jion' );

	change_listAppend = jion.this( module, 'source' );

	change_listShorten = require( './listShorten' );

	change_generic = require( './generic' );

	change_error = require( './error' );
}


prototype = change_listAppend.prototype;


/*
| Performs the list app change on a tree.
*/
prototype.changeTree =
	function(
		list
	)
{
	return list.append( this.val );
};


/*
| Reversivly performs this change on a tree.
*/
prototype.changeTreeReverse = change_generic.changeTreeReverse;


/*
| Returns the inversion to this change.
*/
jion.lazyValue(
	prototype,
	'reverse',
	function( )
{
	var
		inv;

	inv = change_listShorten.create( 'val', this.val );

	jion.aheadValue( inv, 'reverse', this );

	return inv;
}
);


/*
| Returns a change* transformed on this change.
*/
prototype.transform =
	function(
		cx
	)
{
	return cx;
};


/*
| Returns a change list transformed by this change.
*/
prototype._transformChangeList = change_generic.transformChangeList;


/*
| Returns a change wrap transformed by this change.
*/
prototype._transformChangeWrap = change_generic.transformChangeWrap;


/*
| Returns a change wrap list transformed by this change.
*/
prototype._transformChangeWrapList = change_generic.transformChangeWrapList;



}( ) );
