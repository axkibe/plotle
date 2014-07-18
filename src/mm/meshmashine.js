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
| Transformation.
| FIXME move elsewhere.
|
| Action Transformation. Changes signatures due to past alternations.
*/


/*
| List of formation action on different alternation types
*/
var TFXOps = { };


/*
| Transforms a signature on a single change
|
| If the signature is a span,
|
| it can return an array of signs.
*/
var tfxSign1 =
	function(
		sign,
		chg
	)
{
	if( chg.length !== 1 )
	{
		throw new Error( );
	}

	if( sign.path === undefined )
	{
		return sign;
	}

	switch( chg.type )
	{
		case 'split' :

			return TFXOps._tfxSignSplit( sign, chg );

		case 'join' :

			return TFXOps._tfxSignJoin( sign, chg );

		case 'rank' :

			return TFXOps._tfxSignRank( sign, chg );

		case 'set' :

			return TFXOps._tfxSignSet( sign, chg );

		case 'insert' :

			return TFXOps._tfxSignInsert( sign, chg );

		case 'remove' :

			return TFXOps._tfxSignRemove( sign, chg );

		default :

			throw new Error( );
	}
};


/*
| Transforms a signature on a list of alternations.
| If the signature is a span, it can return an array of signs.
*/
var tfxSign =
	function(
		sign,
		chgX
	)
{
//	Jools.log(
//		'tfx',
//		'tfxSign',
//		sign,
//		chgX
//	);

	switch( chgX.constructor )
	{
		case Change  :
		case ChangeRay :

			break;

		default :

			throw new Error( );
	}

	if( arguments.length !== 2 )
	{
		throw new Error( );
	}

	if( sign.constructor !== Sign )
	{
		throw new Error( );
	}

	if(
		sign.path === undefined
		||
		sign.path.length === 0
	)
	{
//		Jools.log(
//			'tfx',
//			'out',
//			sign
//		);

		return sign;
	}

	var signX =
		sign;

	for(
		var t = 0, tZ = chgX.length;
		t < tZ;
		t++
	)
	{
		var chg =
			chgX.get( t );

		switch( signX.constructor )
		{

			case Sign :

				signX =
					tfxSign1( signX, chg );

				break;

			case Array :

				for(
					var a = 0, aZ = signX.length;
					a < aZ;
					a++
				)
				{
					var fs =
						tfxSign1( sign[ a ], chg );

					if( fs === null )
					{
						sign.splice(
							a--,
							1
						);

						continue;
					}

					switch( fs.constructor )
					{
						case Sign :

							signX[ a ] =
								fs;

							break;

						case Array :

							for(
								var b = 0, bZ = fs.length;
								b < bZ;
								b++
							)
							{
								signX.splice(
									a++,
									0,
									fs[ b ]
								);
							}

							break;

						default :

							throw new Error( );
					}
				}

				break;

			default :

				throw new Error( );
		}
	}

//	Jools.log(
//		'tfx',
//		'out',
//		signX
//	);

	return signX;
};

/*
| Transforms a change on an a change(ray).
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

	srcX =
		tfxSign(
			chg.src,
			chgX
		);

	trgX =
		tfxSign(
			chg.trg,
			chgX
		);

	if(
		srcX === null
		||
		trgX === null
	)
	{
		return null;
	}

	srcA = Jools.isArray( srcX );

	trgA = Jools.isArray( trgX );

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


/*
| Transforms a signature on one a split.
*/
TFXOps._tfxSignSplit =
	function(
		sign,
		chg
	)
{
	var
		src,
		trg;

	src = chg.src;
	trg = chg.trg;

	// src.path -- the line splitted
	// trg.path -- the new line

	if(
		!src.path ||
		!src.path.equals( sign.path )
	)
	{
		return sign;
	}

	// FIXME form ranks
	// simpler case signature is only one point
	if(
		sign.at2 === undefined
	)
	{

		if( sign.at1 < src.at1 )
		{
			return sign;
		}

		return (
			sign.Create(
				'path',
					trg.path,
				'at1',
					sign.at1 - src.at1
			)
		);
	}

	// A more complicated signature is affected.
	//                   ............
	// Span                  mmmmm
	// Splits cases:      1    2    3

	if( sign.at2 <= src.at1 )
	{
//		Jools.log(
//			'tfx',
//			'split (span, case 1)'
//		);

		return sign;
	}

	if( sign.at1 >= src.at1 )
	{
//		Jools.log(
//			'tfx',
//			'split (span, case 2)'
//		);

		// signature goes into splitted line instead
		return (
			sign.Create(
				'path',
					trg.path,
				'at1',
					sign.at1 - src.at1,
				'at2',
					sign.at2 - src.at1
			)
		);
	}

//	Jools.log(
//		'tfx',
//		'split (span, case 3'
//	);

	// the signature is splited into a part that stays and one that goes to next line.

	return [
		sign.Create(
			'at2',
				src.at1
		),

		sign.Create(
			'path',
				trg.path,
			'at1',
				0,
			'at2',
				sign.at2 - src.at1
		)
	];
};

/*
| Transforms a signature on a join.
*/
TFXOps._tfxSignJoin =
	function(
		sign,
		chg
	)
{
	var
		src,
		trg;

	src = chg.src;
	trg = chg.trg;

	// trg.path is the line that got the join
	// src.path is the line that was removed

	if(
		!src.path ||
		!sign.path.equals( src.path )
	)
	{
		return sign;
	}

	if( !trg.path )
	{
		throw new Error( );
	}

	// FIXME tfx ranks

//	Jools.log(
//		'tfx',
//		'join',
//		sign
//	);

	if( sign.at2 === undefined )
	{
		return (
			sign.Create(
				'path',
					trg.path,
				'at1',
					sign.at1 + trg.at1
			)
		);
	}
	else
	{
		return (
			sign.Create(
				'path',
					trg.path,
				'at1',
					sign.at1 + trg.at1,
				'at2',
					sign.at2 + trg.at1
			)
		);
	}
};

/*
| Transforms a signature on a rank
*/
TFXOps._tfxSignRank =
	function(
		sign,
		chg
	)
{
	var
		src,
		trg;

	src = chg.src;

	trg = chg.trg;

	if(
		!src.path ||
		!src.path.equals( sign.path )
	)
	{
		return sign;
	}

	if( sign.rank === undefined )
	{
		return sign;
	}

	if(
		src.rank <= sign.rank &&
		trg.rank > sign.rank
	)
	{
		sign =
			sign.Create(
				'rank',
					sign.rank - 1
			);
	}
	else if( src.rank > sign.rank && trg.rank <= sign.rank )
	{
		sign =
			sign.Create(
				'rank',
					sign.rank + 1
			);
	}

	return sign;
};



/*
| Transforms a signature on a join.
*/
TFXOps._tfxSignSet =
	function(
		sign,
		chg
	)
{
	var
		src,
		trg;

	src = chg.src;

	trg = chg.trg;

	if(
		sign.rank === undefined
		||
		trg.rank === undefined
		||
		!trg.path
		||
		!trg.path.subPathOf( sign.path, - 1 )
	)
	{
		return sign;
	}

	if( trg.rank === null )
	{
		if( sign.rank >= trg.rank )
		{
			sign =
				sign.Create(
					'rank',
						sign.rank - 1
				);
		}
	}
	else if( src.rank === null )
	{
		if( sign.rank >= src.rank )
		{
			sign =
				sign.Create(
					'rank',
						sign.rank + 1
				);
		}
	}
	else
	{
		if( src.rank <= sign.rank && trg.rank > sign.rank )
		{
			sign =
				sign.Create(
					'rank',
						sign.rank - 1
				);
		}
		else if( src.rank > sign.rank && trg.rank <= sign.rank )
		{
			sign =
				sign.Create(
					'rank',
						sign.rank + 1
				);
		}
	}

	return sign;
};


/*
| Transforms a signature on an insert.
*/
TFXOps._tfxSignInsert =
	function(
		sign,
		chg
	)
{
	var
		src,
		trg;

	src = chg.src;

	trg = chg.trg;

	if(
		!trg.path ||
		!trg.path.equals( sign.path )
	)
	{
		return sign;
	}

	if(
		trg.at1 === undefined
		||
		trg.at2 === undefined
	)
	{
		throw new Error( );
	}

	if( sign.at1 < trg.at1 )
	{
		return sign;
	}

	var len =
		src.val.length;

	if( sign.at2 !== undefined )
	{
		return (
			sign.Create(
				'at1',
					sign.at1 + len,
				'at2',
					sign.at2 + len
			)
		);
	}
	else
	{
		return (
			sign.Create(
				'at1',
					sign.at1 + len
			)
		);
	}
};


/*
| Transforms a signature on a remove
*/
TFXOps._tfxSignRemove =
	function(
		sign,
		chg
	)
{
	var
		src;

	src = chg.src;

	if(
		!src.path ||
		!src.path.equals(sign.path)
	)
	{
		return sign;
	}

	if(
		src.at1 === undefined
		||
		src.at2 === undefined
	)
	{
		throw new Error( );
	}

	var len = src.at2 - src.at1;

	// simpler case signature is only one point
	if( sign.at2 === undefined )
	{
		// src (removed span)      ######
		// sign, case0:        +   '    '      (sign to left,  no effect)
		// sign, case1:            ' +  '      (sign in middle, move to left)
		// sign, case2:            '    ' +    (sign to right, substract)

		if( sign.at1 <= src.at1 )
		{
			return sign;
		}

		if( sign.at1 <= src.at2 )
		{
			return (
				sign.Create(
					'at1',
						src.at1
				)
			);
		}

		return (
			sign.Create(
				'at1',
				sign.at1 - len
			)
		);
	}

	// More complicated signature is affected.
	// Supposedly its a remove as well.
	//
	//                     ............
	// src (removed span)      ######
	// sign, case0:        +++ '    '      (sign to left,  no effect)
	// sign, case1:            '    ' +++  (sign to right, move to left)
	// sign, case2:          +++++++++     (sign splitted into two)
	// sign, case3:            ' ++ '      (sign completely removed)
	// sign, case4:          ++++   '      (part of sign removed)
	// sign, case5:            '   ++++    (part of sign removed)

	if( sign.at2 <= src.at1 )
	{
		return sign;
	}
	else if( sign.at1 >= src.at2 )
	{
		return (
			sign.Create(
				'at1',
					sign.at1 - len,
				'at2',
					sign.at2 - len
				)
		);
	}
	else if(
		sign.at1 < src.at1 &&
		sign.at2 > src.at2
	)
	{
		return (
			sign.Create(
				'at2',
					sign.at2 - len
			)
		);
	}
	else if(
		sign.at1 >= src.at1
		&&
		sign.at2 <= src.at2
	)
	{
		return null;
	}
	else if(
		sign.at1 < src.at1
		&&
		sign.at2 <= src.at2
	)
	{
		return (
			sign.Create(
				'at2',
					src.at1
			)
		);
	}
	else if(
		sign.at1 <= src.at2 &&
		sign.at2 > src.at2
	)
	{
		return (
			sign.Create(
				'at2',
				src.at2
			)
		);
	}
	else
	{
		throw new Error( );
	}
};

MeshMashine =
{
	Change :
		Change,
	tfxChg :
		tfxChg,
	tfxChgX :
		tfxChgX,
	tfxSign :
		tfxSign
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
