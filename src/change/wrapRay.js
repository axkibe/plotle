/*
| An array of wraped change(rays).
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'change_wrapRay',
		json : true,
		ray : [ 'change_wrap' ]
	};
}


var
	change_wrapRay;


/*
| Capsule
*/
( function( ) {
"use strict";


var
	prototype;


if( NODE )
{
	change_wrapRay = require( 'jion' ).this( module, 'source' );
}


prototype = change_wrapRay.prototype;


/*
| Creates an invertes changeWrapRay
*/
prototype.createReverse =
	function( )
{
	var
		a,
		aZ,
		iRay;

	iRay = [ ];

	for( a = 0, aZ = this.length; a < aZ; a++ )
	{
		iRay[ a ] = this.get( aZ - 1 - a ).createReverse( );
	}

	return change_wrapRay.create( 'ray:init', iRay );
};


/*
| Performes the wraped-change-(rays) on a tree.
*/
prototype.changeTree =
	function(
		tree
	)
{
	var
		a,
		aZ;

	// iterates through the change ray
	for( a = 0, aZ = this.length; a < aZ; a++ )
	{
		tree = this.get( a ).changeTree( tree );
	}

	return tree;
};

/*
| Performes the reversion of the
| wraped-change-(rays) on a tree.
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
| Transform cx on this ray of wrapped changes.
|
| cx can be a change, changeRay, changeWrap or changeWrapRay, sign
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
