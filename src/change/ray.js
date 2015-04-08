/*
| An array of changes.
*/


var
	change_generic,
	change_ray,
	jools;


/*
| Capsule
*/
( function( ) {
"use strict";


/*
| The jion definition.
*/
if( JION )
{
	return {
		id : 'change_ray',
		json : true,
		ray :
		[
			'change_grow',
			'change_insert',
			'change_join',
			'change_remove',
			'change_set',
			'change_shrink',
			'change_split'
		]
	};
}


var
	prototype;


if( SERVER )
{
	change_ray = require( 'jion' ).this( module, 'source' );

	change_generic = require( './generic' );

	jools = require( '../jools/jools'  );
}


prototype = change_ray.prototype;


/*
| Returns a change ray with inverted changes.
*/
jools.lazyValue(
	prototype,
	'invert',
	function( )
	{
		var
			a,
			aZ,
			iRay,
			result;

		iRay = [ ];

		for(
			a = 0, aZ = this.length;
			a < aZ;
			a++
		)
		{
			iRay[ a ] = this.ray[ aZ - 1 - a ].invert;
		}

		result = change_ray.create( 'ray:init', iRay );

		jools.aheadValue( result, 'invert', this );

		return result;
	}
);


/*
| Returns the result of a change
| transformed by this change_ray as if it
| actually came first.
|
| The result can be a change or a change_ray.
*/
prototype._transformSingle =
	function(
		c
	)
{
	var
		a,
		aZ,
		cx;

	cx = c;

	for(
		a = 0, aZ = this.length;
		a < aZ;
		a++)
	{
		cx = this.get( a ).transform( cx );
	}

	return cx;
};


/*
| Returns the result of a changeray
| transformed by this change_ray.
|
| The result is a change_ray.
*/
prototype._transformChangeRay =
	function(
		cRay
	)
{
	var
		a,
		aZ,
		y;

	y = [ ];

	for(
		a = 0, aZ = this.length;
		a < aZ;
		a++
	)
	{
		cRay = this.get( a ).transform( cRay );
	}

	return cRay;
};


/*
| Returns a change wrap transformed by this change.
*/
prototype._transformChangeWrap =
	function(
		cw
	)
{
	return cw.create( 'changeRay', this.transform( cw.changeRay ) );
};


/*
| Returns a change wrap transformed by this change.
*/
prototype._transformChangeWrapRay =
	function(
		cwRay
	)
{
	var
		r,
		rZ,
		tRay;

	tRay = [ ];

	for(
		r = 0, rZ = cwRay.length;
		r < rZ;
		r++
	)
	{
		tRay[ r ] = this._transformChangeWrap( cwRay.get( r ) );
	}


	return cwRay.create( 'ray:init', tRay );
};


/*
| Returns the result of a
| change, change_ray, change_wrap or change_wrapRay
| transformed by this change_ray.
*/
prototype.transform =
	function(
		co
	)
{
	switch( co.reflect )
	{
		case 'change_ray' :

			return this._transformChangeRay( co );

		case 'change_wrap' :

			return this._transformChangeWrap( co );

		case 'change_wrapRay' :

			return this._transformChangeWrapRay( co );

		default :

			return this._transformSingle( co );
	}
};


/*
| Performes this change-ray on a tree.
*/
prototype.changeTree =
	function(
		tree
	)
{
	// the ray with the changes applied
	var
		a, aZ;

	// iterates through the change ray
	for(
		a = 0, aZ = this.length;
		a < aZ;
		a++
	)
	{
		// the tree returned by op-handler is the new tree
		tree = this.get( a ).changeTree( tree );
	}

	return tree;
};


}( ) );
