/*
| An array of changes to a tree.
*/


var
	ccot_changeRay,
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
			'ccot_changeRay',
		json :
			true,
		ray :
			[ 'ccot_change' ]
	};
}


if( SERVER )
{
	ccot_changeRay = require( '../jion/this' )( module );

	jools = require( '../jools/jools'  );

	result_changeTree = require( '../result/changeTree' );
}


/*
| Returns a change ray with inverted changes.
*/
jools.lazyValue(
	ccot_changeRay.prototype,
	'invert',
	function( )
	{
		var
			a,
			aZ,
			inv,
			rc;

		rc = [ ];

		for(
			a = 0, aZ = this.length;
			a < aZ;
			a++
		)
		{
			rc[ a ] = this.ray[ a ].invert;
		}

		inv = ccot_changeRay.create( 'ray:init', rc );

		// TODO aheadValue on inv.

		return inv;
	}
);


/*
| Returns the result of a change
| transformed by this change-ray.
|
| The result can be a change or a change-ray.
*/
ccot_changeRay.prototype._transformChange =
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
/**/	if( c.reflect !== 'ccot_change' )
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
| transformed by this change-ray.
|
| The result is a change-ray.
*/
ccot_changeRay.prototype._transformChangeRay =
	function(
		cray
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
		cray = this.get( a ).transform( cray );
	}

	return cray;
};


/*
| Return a change wrap transformed by this change.
*/
ccot_changeRay.prototype._transformChangeWrap =
	function(
		cw
	)
{
	return cw.create( 'changeRay', this.transform( cw.changeRay ) );
};


/*
| Return a change wrap transformed by this change.
*/
ccot_changeRay.prototype._transformChangeWrapRay =
	function(
		cwr
	)
{
	var
		r,
		rZ,
		tray;

	tray = [ ];

	for(
		r = 0, rZ = cwr.length;
		r < rZ;
		r++
	)
	{
		tray[ r ] = this._transformChangeWrap( cwr.get( r ) );
	}


	return cwr.create( 'ray:init', tray );
};


/*
| Returns the result of a
| change, changeRay, changeWrap or changeWrapRay
| transformed by this change ray.
*/
ccot_changeRay.prototype.transform =
	function(
		co
	)
{
	switch( co.reflect )
	{
		case 'ccot_change' :

			return this._transformChange( co );

		case 'ccot_changeRay' :

			return this._transformChangeRay( co );

		case 'ccot_changeWrap' :

			return this._transformChangeWrap( co );

		case 'ccot_changeWrapRay' :

			return this._transformChangeWrapRay( co );

		case 'ccot_sign' :

			return this._transformSign( co );

		default :

			throw new Error( );
	}
};


/*
| Performes this change-ray on a tree.
*/
ccot_changeRay.prototype.changeTree =
	function(
		tree,
		resultModality
	)
{
	// the ray with the changes applied
	var
		a, aZ,
		cray,
		cr;

	// FUTURE if resultModality is skip cray
	cray = [ ];

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

		cray.push( cr.reaction );
	}

	switch( resultModality )
	{
		case 'combined' :

			return(
				result_changeTree.create(
					'reaction', ccot_changeRay.create( 'ray:init', cray ),
					'tree', tree
				)
			);

		case 'reaction' :

			return ccot_changeRay.create( 'ray:init', cray );

		case 'tree' :

			return tree;
	}
};


/*
| Returns a sign transformed on this change ray.
|
| If the signature is a span, it can transform to a sign-ray.
*/
ccot_changeRay.prototype._transformSign =
	function(
		sign
	)
{

/**/if( CHECK )
/**/{
/**/	if( sign.reflect !== 'ccot_sign' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if(
		sign.path === undefined
		||
		sign.path.length === 0
	)
	{
		return sign;
	}

	var signX = sign;

	for(
		var t = 0, tZ = this.length;
		t < tZ;
		t++
	)
	{
		signX = this.get( t ).transform( signX );
	}

	return signX;
};


}( ) );