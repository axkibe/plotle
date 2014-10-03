/*
| An array of changes to a tree.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	ccot;

ccot = ccot || { };


/*
| Imports
*/
var
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
		id :
			'ccot.changeRay',
		node :
			true,
		equals :
			false,
		json :
			true,
		ray :
			[
				'ccot.change'
			]
	};
}


/*
| Node includes.
*/
if( SERVER )
{
	jools =
		require( '../jools/jools'  );

	ccot =
		{
			change :
				require( '../ccot/change' ),
			changeRay :
				require( '../jion/this' )( module )
		};
}


var
	changeRay;

changeRay = ccot.changeRay;


/*
| Returns a change ray with inverted changes.
*/
jools.lazyValue(
	changeRay.prototype,
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

		inv = changeRay.create( 'ray:init', rc );

		// TODO aheadValue on inv.

		return inv;
	}
);


/*
| Returns the result of a change
| transformed by this change ray.
*/
changeRay.prototype.transformChange =
	function(
		chg
	)
{
	var
		a,
		aZ,
		chgX;

	chgX = chg;

	for(
		a = 0, aZ = this.length;
		a < aZ;
		a++)
	{
		chgX = this.get( a ).transformChange( chgX );
	}

	return chgX;
};


/*
| Returns the result of a change ray
| transformed by this change ray.
*/
changeRay.prototype.transformChangeRay =
	function(
		cray
	)
{
	var
		a,
		aZ,
		b,
		bZ,
		rX,
		y;

	y = [ ];

	for(
		a = 0, aZ = this.length;
		a < aZ;
		a++
	)
	{
		rX = this.get( a ).transformChangeRay( cray );

		for(
			b = 0, bZ = rX.length;
			b < bZ;
			b++
		)
		{
			y.push(
				rX.get( b )
			);
		}
	}

	return changeRay.create( 'ray:init', y );
};


/*
| Returns the result of a change or change ray
| transformed by this change ray.
*/
changeRay.prototype.transformChangeX =
	function(
		chgX
	)
{
	switch( chgX.reflect )
	{
		case 'ccot.change' :

			return this.transformChange( chgX );

		case 'ccot.changeRay' :

			return this.transformChangeRay( chgX );

		default :

			throw new Error( );
	}
};


/*
| Performes this change-ray on a tree.
|
| FIXME trace if a signle change has changed and create
| a new array only then
*/
changeRay.prototype.changeTree =
	function(
		tree
	)
{
	// the ray with the changes applied
	var
		chg,
		cray,
		cr;

	cray = [ ];

	// iterates through the change ray
	for(
		var a = 0, aZ = this.length;
		a < aZ;
		a++
	)
	{
		chg = this.get( a );

		cr = chg.changeTree( tree );

		// the tree returned by op-handler is the new tree
		tree = cr.tree;

		cray.push( cr.chg );
	}

	// FUTURE make a "changeResult" jion.
	return jools.immute(
		{
			tree :
				tree,
			chgX :
				changeRay.create( 'ray:init', cray )
		}
	);
};


/*
| Returns a sign transformed on this change ray.
|
| If the signature is a span, it can transform to a sign-ray.
*/
changeRay.prototype.transformSign =
	function(
		sign
	)
{

/**/if( CHECK )
/**/{
/**/	if( sign.reflect !== 'ccot.sign' )
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
		signX = this.get( t ).transformSignX( signX );
	}

	return signX;
};


/*
| Exports
*/
if( SERVER )
{
	module.exports = changeRay;
}

}( ) );
