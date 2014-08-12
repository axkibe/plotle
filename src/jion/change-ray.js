/*
| An array of changes to a tree.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	jion;

jion = jion || { };


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
		name :
			'ChangeRay',
		unit :
			'jion',
		attributes :
			{
				'array' :
				{
					comment :
						'the array',
					type :
						'Object',
					assign :
						null,
					defaultValue :
						undefined
				},

				'_sliced' :
				{
					comment :
						'true if the array is already sliced',
					type :
						'Boolean',
					assign :
						null,
					defaultValue :
						undefined
				}
			},
		init :
			[ 'array', '_sliced' ],
		node :
			true,
		equals :
			false
	};
}


/*
| Node includes.
*/
if( SERVER )
{
	jools =
		require( '../jools/jools'  );

	jion =
		{
			Change :
				require( '../jion/change' ),
			ChangeRay :
				require( '../jion/this' )( module )
		};
}


var
	ChangeRay;

ChangeRay = jion.ChangeRay;


/*
| Initializer.
*/
ChangeRay.prototype._init =
	function(
		array,
		_sliced
	)
{
	if( array === undefined )
	{
		array = [ ];
	}

/**/if( CHECK )
/**/{
/**/	if(
/**/		( !(array instanceof Array ) )
/**/	)
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if( _sliced !== true )
	{
		array = array.slice( );
	}

/**/if( CHECK )
/**/{
/**/	array = Object.freeze( array );
/**/}

	this._ray = array;
};


/*
| Returns a change ray with inverted changes.
*/
jools.lazyValue(
	ChangeRay.prototype,
	'Invert',
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
			rc[ a ] = this._ray[ a ].Invert;
		}

		inv =
			ChangeRay.create(
				'array',
					rc,
				'_sliced',
					true
			);

		// TODO aheadValue on inv.

		return inv;
	}
);


/*
| Appends a change to the change ray.
*/
ChangeRay.prototype.Append =
	function(
		chg
	)
{
	var
		rc;

	rc = this._ray.slice( );

	rc.push( chg );

	return (
		ChangeRay.create(
			'array',
				rc,
			'_sliced',
				true
		)
	);
};


/*
| Returns the length of the changeray
*/
jools.lazyValue(
	ChangeRay.prototype,
	'length',
	function( )
	{
		return this._ray.length;
	}
);


/*
| Gets one change.
*/
ChangeRay.prototype.get =
	function(
		idx
	)
{
	return this._ray[ idx ];
};


/*
| Returns a ChangeRay with one element altered.
*/
ChangeRay.prototype.Set =
	function(
		idx,
		chg
	)
{
	var
		rc;

	rc = this._ray.slice( );

	rc[ idx ] = chg;

	return (
		ChangeRay.create(
			'array',
				rc,
			'_sliced',
				true
		)
	);
};


/*
| Returns the result of a change
| transformed by this change ray.
*/
ChangeRay.prototype.transformChange =
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
ChangeRay.prototype.transformChangeRay =
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

	return (
		ChangeRay.create(
			'array',
				y,
			'_sliced',
				true
		)
	);
};


/*
| Returns the result of a change or change ray
| transformed by this change ray.
*/
ChangeRay.prototype.transformChangeX =
	function(
		chgX
	)
{
	switch( chgX.reflex )
	{
		case 'jion.change' :

			return this.transformChange( chgX );

		case 'jion.changeRay' :

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
ChangeRay.prototype.ChangeTree =
	function(
		tree,
		universe
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
		chg = this.get( a ),

		cr =
			chg.ChangeTree(
				tree,
				universe
			);

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
				ChangeRay.create(
					'array',
						cray,
					'_sliced',
						true
				)
		}
	);
};


/*
| Returns a sign transformed on this change ray.
|
| If the signature is a span, it can transform to a sign-ray.
*/
ChangeRay.prototype.transformSign =
	function(
		sign
	)
{

/**/if( CHECK )
/**/{
/**/	if( sign.reflex !== 'jion.sign' )
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
	module.exports = ChangeRay;
}

}( ) );
