/*
| An array of changes.
*/


var
	change_generic,
	change_ray,
	jools,
	result_changeTree;


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
		id :
			'change_ray',
		json :
			true,
		ray :
			[ 'change_insert' ]
	};
}


if( SERVER )
{
	change_ray = require( '../jion/this' )( module );

	change_generic = require( './generic' );

	jools = require( '../jools/jools'  );

	result_changeTree = require( '../result/changeTree' );
}


/*
| Returns a change ray with inverted changes.
*/
jools.lazyValue(
	change_ray.prototype,
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
			iRay[ a ] = this.ray[ a ].invert;
		}

		result = change_ray.create( 'ray:init', iRay );

		// FIXME aheadValue on result.

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
change_ray.prototype._transformChange =
	function(
		c
	)
{
	var
		a,
		aZ,
		cx;

/**/if( CHECK )
/**/{
/**/	if( !change_generic.isChange( c ) )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

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
change_ray.prototype._transformChangeRay =
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
| Return a change wrap transformed by this change.
*/
change_ray.prototype._transformChangeWrap =
	function(
		cw
	)
{
	return cw.create( 'changeRay', this.transform( cw.changeRay ) );
};


/*
| Return a change wrap transformed by this change.
*/
change_ray.prototype._transformChangeWrapRay =
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
change_ray.prototype.transform =
	function(
		co
	)
{
	if( change_generic.isChange( co ) )
	{
		return this._transformChange( co );
	}

	switch( co.reflect )
	{
		case 'ccot_changeRay' :

			return this._transformChangeRay( co );

		case 'ccot_changeWrap' :

			return this._transformChangeWrap( co );

		case 'ccot_changeWrapRay' :

			return this._transformChangeWrapRay( co );

		default :

			throw new Error( );
	}
};


/*
| Performes this change-ray on a tree.
*/
change_ray.prototype.changeTree =
	function(
		tree,
		resultModality
	)
{
	// the ray with the changes applied
	var
		a, aZ,
		cRay,
		cr;

	// FUTURE if resultModality is skip cRay
	cRay = [ ];

	// iterates through the change ray
	for(
		a = 0, aZ = this.length;
		a < aZ;
		a++
	)
	{
		cr = this.get( a ).changeTree( tree, 'combined' );

		// the tree returned by op-handler is the new tree
		tree = cr.tree;

		cRay.push( cr.reaction );
	}

	switch( resultModality )
	{
		case 'combined' :

			return(
				result_changeTree.create(
					'reaction', change_ray.create( 'ray:init', cRay ),
					'tree', tree
				)
			);

		case 'reaction' :

			return change_ray.create( 'ray:init', cRay );

		case 'tree' :

			return tree;
	}
};


}( ) );
