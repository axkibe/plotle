/*
| A list of wraped change(lists).
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'change_wrapList',
		json : true,
		list : [ 'change_wrap' ]
	};
}


var
	change_wrapList;


/*
| Capsule
*/
( function( ) {
"use strict";


var
	prototype;


if( NODE )
{
	change_wrapList = require( 'jion' ).this( module, 'source' );
}


prototype = change_wrapList.prototype;


/*
| Creates an invertes changeWrapList
*/
prototype.createReverse =
	function( )
{
	var
		a,
		aZ,
		iList;

	iList = [ ];

	for( a = 0, aZ = this.length; a < aZ; a++ )
	{
		iList[ a ] = this.get( aZ - 1 - a ).createReverse( );
	}

	return change_wrapList.create( 'list:init', iList );
};


/*
| Performes the wrapped change-(lists) on a tree.
*/
prototype.changeTree =
	function(
		tree
	)
{
	var
		a,
		aZ;

	// iterates through the change list
	for( a = 0, aZ = this.length; a < aZ; a++ )
	{
		tree = this.get( a ).changeTree( tree );
	}

	return tree;
};

/*
| Performes the reversion of the
| wrapped-change (lists) on a tree.
*/
prototype.changeTreeReverse =
	function(
		tree
	)
{
	var
		a;

	for( a = this.length - 1; a >= 0; a-- )
	{
		tree = this.get( a ).changeTreeReverse( tree );
	}

	return tree;
};


/*
| Transform cx on this list of wrapped changes.
|
| cx can be a change, changeList, changeWrap or changeWrapList.
*/
prototype.transform =
	function(
		cx
	)
{
	var
		r,
		rZ;

	for( r = 0, rZ = this.length; r < rZ; r++ )
	{
		cx = this.get( r ).transform( cx );
	}

	return cx;
};


}( ) );
