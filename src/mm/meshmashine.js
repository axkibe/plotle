/*
| The causal consistency / operation transformation engine for meshcraft.
|
| FIXME move the tfxs to Sign/Change
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	MeshMashine;


/*
| Imports
*/
var
	Change,
	ChangeRay,
	Jion,
	Jools;


/*
| Capsule
*/
( function( ) {
"use strict";


/*
| Node includes.
*/
if( SERVER )
{
	Jools =
		require( '../jools/jools' );
	Jion =
		{
			Change :
				require( '../jion/change' ),
			ChangeRay :
				require( '../jion/change-ray' ),
			Sign :
				require( '../jion/sign' )
		};
}

var
	Sign;

Change = Jion.Change;

Sign = Jion.Sign;



/*
| Transforms a change on an a change(ray).
|
| TODO remove
*/
var tfxChg =
	function(
		chg,
		chgX
	)
{
	var
		a,
		aZ,
		ray,
		srcA,
		srcX,
		trgA,
		trgX,
		y;

	if( chg.constructor !== Change )
	{
		throw new Error( );
	}

	srcX = chgX.TfxSign( chg.src );

	trgX = chgX.TfxSign( chg.trg );

	if(
		srcX === null
		||
		trgX === null
	)
	{
		return null;
	}

	srcA = srcX.reflect === 'SignRay';

	trgA = trgX.reflect === 'SignRay';

	if( !srcA && !trgA )
	{
		// FIXME check in ray conditions too if this happens
		if(
			(
				srcX.proc === 'splice'
				||
				trgX.proc === 'splice'
			)
			&&
			(
				srcX.path.equals( trgX.path )
			)
		)
		{
			// splice transformed to equalness'

			return null;
		}


		return (
			Change.Create(
				'src',
					srcX,
				'trg',
					trgX
			)
		);
	}
	else if( !srcA && trgA )
	{
		y = [ ];

		for(
			a = 0, aZ = trgX.length;
			a < aZ;
			a++
		)
		{
			y[ a ] =
				Change.Create(
					'src',
						srcX,
					'trg',
						trgX.get( a )
				);
		}

		return (
			ChangeRay.Create(
				'array',
					y
			)
		);
	}
	else if( srcA && !trgA )
	{
		y = [ ];

		for(
			a = 0, aZ = srcX.length;
			a < aZ;
			a++
		)
		{
			ray.set(
				a,
				Change.Create(
					'src',
						srcX.get( a ),
					'trg',
						trgX
				)
			);
		}

		return (
			ChangeRay.Create(
				'array',
					y
			)
		);
	}
	else
	{
		throw new Error( );
	}
};


/*
| Transforms a change(ray) upon a change(ray).
*/
var tfxChgX =
	function(
		chgX1,
		chgX2
	)
{
	var
		a,
		aZ,
		b,
		bZ,
		rX,
		y;

	if( chgX1 === null )
	{
		return null;
	}

	switch( chgX1.constructor )
	{
		case Change :

			return (
				tfxChg(
					chgX1,
					chgX2
				)
			);

		case ChangeRay :

			y = [ ];

			for(
				a = 0, aZ = chgX1.length;
				a < aZ;
				a++
			)
			{
				rX =
					tfxChg(
						chgX1[ a ],
						chgX2
					);

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
						y
				)
			);

		default :

			throw Jools.reject(
				'invalid chgX1'
			);

	}
};



MeshMashine =
{
	Change :
		Change,
	tfxChg :
		tfxChg,
	tfxChgX :
		tfxChgX
};


/*
| Node export
*/
if( SERVER )
{
	module.exports =
		MeshMashine;
}

}( ) );
