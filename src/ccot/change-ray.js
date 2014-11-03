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
| transformed by this change-ray.
|
| The result can be a change or a change-ray.
*/
changeRay.prototype.transformChange =
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
/**/	if( c.reflect !== 'ccot.change' )
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
		cx = this.get( a ).transformChange( cx );
	}

	return cx;
};


/*
| Returns the result of a changeray
| transformed by this change-ray.
|
| The result is a change-ray.
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
		cray = this.get( a ).transformChangeRay( cray );
	}

	return cray;
};


/*
| Return a change wrap transformed by this change.
*/
changeRay.prototype.transformChangeWrap =
	function(
		cw
	)
{
	return cw.create( 'chgX', this.transform( cw.chgX ) );
};


/*
| Return a change wrap transformed by this change.
*/
changeRay.prototype.transformChangeWrapRay =
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
		tray[ r ] = this.transformChangeWrap( cwr.get( r ) );
	}


	return cwr.create( 'ray:init', tray );
};


/*
| Returns the result of a
| change, changeRay, changeWrap or changeWrapRay
| transformed by this change ray.
*/
changeRay.prototype.transform =
	function(
		co
	)
{
	switch( co.reflect )
	{
		case 'ccot.change' :

			return this.transformChange( co );

		case 'ccot.changeRay' :

			return this.transformChangeRay( co );

		case 'ccot.changeWrap' :

			return this.transformChangeWrap( co );

		case 'ccot.changeWrapRay' :

			return this.transformChangeWrapRay( co );

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
