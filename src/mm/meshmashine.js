/*
| The causal consistency / operation transformation engine for meshcraft.
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
	Jools,
	Path,
	Sign;


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
	Change =
		require( './change' );

	ChangeRay =
		require( './changeray' );

	Jools =
		require( '../jools/jools' );

	Path =
		require( './path' );

	Sign =
		require( './sign' );
}

// FIXME remove
var
	is =
		Jools.is;

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
		throw new Error(
			CHECK && 'tfxSign1 chg.length !== 1'
		);
	}

	if( !Jools.is( sign.path ) )
	{
		return sign;
	}

	var
		op =
			TFXOps[ chg.type ];

	if( !op )
	{
		throw new Error(
			CHECK && 'tfxSign1, no op'
		);
	}

	// FIXME give, chg.
	return op(
		sign,
		chg.src,
		chg.trg
	);
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
			throw new Error(
				CHECK && 'invalid chgX'
			);
	}

	if( arguments.length !== 2 )
	{
		throw new Error(
			CHECK && 'tfxSign argument fail (n)'
		);
	}

	if( sign.constructor !== Sign )
	{
		throw new Error(
			CHECK && 'tfxSign argument fail (1)'
		);
	}

	if(
		!is( sign.path ) ||
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

							throw new Error(
								CHECK && 'Invalid fs'
							);
					}
				}

				break;

			default :

				throw new Error(
					CHECK && 'Invalid signX'
				);
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

//	Jools.log(
//		'tfx',
//		'tfxChg',
//		chg,
//		chgX
//	);

	if( chg.constructor !== Change )
	{
		throw new Error(
			CHECK && 'tfxChg param error'
		);
	}

	var srcX =
		tfxSign(
			chg.src,
			chgX
		);

	var trgX =
		tfxSign(
			chg.trg,
			chgX
		);

	if(
		srcX === null ||
		trgX === null
	)
	{
//		Jools.log(
//			'tfx',
//			'transformed to null'
//		);

		return null;
	}

	var
		a,

		aZ,

		ray,

		srcA =
			Jools.isArray( srcX ),

		trgA =
			Jools.isArray( trgX );

	if( !srcA && !trgA )
	{
		// FIXME check in ray conditions too if this happens
		if(
			( srcX.proc === 'splice' || trgX.proc === 'splice' ) &&
			( srcX.path.equals( trgX.path ) )
		)
		{
//			Jools.log(
//				'tfx',
//				'splice transformed to equalness'
//			);

			return null;
		}


		return new Change( srcX, trgX );
	}
	else if( !srcA && trgA )
	{
		ray =
			new ChangeRay( );

		for(
			a = 0, aZ = trgX.length;
			a < aZ;
			a++
		)
		{
			ray.set(
				a,
				new Change(
					srcX,
					trgX.get( a )
				)
			);
		}

		return ray;
	}
	else if( srcA && !trgA )
	{
		ray =
			new ChangeRay( );

		for(
			a = 0, aZ = srcX.length;
			a < aZ;
			a++
		)
		{
			ray.set(
				a,
				new Change(
					srcX.get( a ),
					trgX
				)
			);
		}

		return ray;
	}
	else
	{
		throw new Error(
			CHECK && 'srcX and trgX arrays :-('
		);
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
	if( chgX1 === null )
	{
		return null;
	}

	switch( chgX1.constructor )
	{
		case Change :

			return tfxChg(
				chgX1,
				chgX2
			);

		case ChangeRay :

			var ray =
				new ChangeRay( );

			for(
				var a = 0, aZ = chgX1.length;
				a < aZ;
				a++
			)
			{
				var rX =
					tfxChg(
						chgX1[ a ],
						chgX2
					);

				for(
					var b = 0, bZ = rX.length;
					b < bZ;
					b++
				)
				{
					ray.push(
						rX.get( b )
					);
				}
			}

			return ray;

		default :

			throw Jools.reject(
				'invalid chgX1'
			);

	}
};


/*
| Transforms a signature on one a split.
*/
TFXOps.split =
	function(
		sign,
		src,
		trg
	)
{
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
		!is( sign.at2 )
	)
	{
//		Jools.log(
//			'tfx',
//			'split (simple)'
//		);

		if( sign.at1 < src.at1 )
		{
			return sign;
		}

		return new Sign(
			sign,
			'path',
				trg.path,
			'at1',
				sign.at1 - src.at1
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
		return new Sign(
			sign,
			'path',
				trg.path,
			'at1',
				sign.at1 - src.at1,
			'at2',
				sign.at2 - src.at1
		);
	}

//	Jools.log(
//		'tfx',
//		'split (span, case 3'
//	);

	// the signature is splited into a part that stays and one that goes to next line.

	return [
		new Sign (
			sign,
			'at2',
				src.at1
		),

		new Sign (
			sign,
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
TFXOps.join =
	function(
		sign,
		src,
		trg
	)
{
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
		throw new Error(
			CHECK && 'join missing trg.path'
		);
	}

	// FIXME tfx ranks

//	Jools.log(
//		'tfx',
//		'join',
//		sign
//	);

	if (!is(sign.at2))
	{
		return new Sign(
			sign,
			'path',
				trg.path,
			'at1',
				sign.at1 + trg.at1
		);
	}
	else
	{
		return new Sign(
			sign,
			'path',
				trg.path,
			'at1',
				sign.at1 + trg.at1,
			'at2',
				sign.at2 + trg.at1
		);
	}
};

/*
| Transforms a signature on a rank
*/
TFXOps.rank =
	function(
		sign,
		src,
		trg
	)
{
	if(
		!src.path ||
		!src.path.equals( sign.path )
	)
	{
		return sign;
	}

	if( !is( sign.rank ) )
	{
		return sign;
	}

//	Jools.log(
//		'tfx',
//		'rank'
//	);

	if(
		src.rank <= sign.rank &&
		trg.rank > sign.rank
	)
	{
		sign =
			new Sign(
				sign,
				'rank',
				sign.rank - 1
			);
	}
	else if( src.rank > sign.rank && trg.rank <= sign.rank )
	{
		sign =
			new Sign(
				sign,
				'rank',
				sign.rank + 1
			);
	}

	return sign;
};



/*
| Transforms a signature on a join.
*/
TFXOps.set =
	function(
		sign,
		src,
		trg
	)
{
	if(
		!is(sign.rank) ||
		!is(trg.rank) ||
		!trg.path ||
		!trg.path.subPathOf( sign.path, - 1 )
	)
	{
		return sign;
	}

//	Jools.log(
//		'tfx',
//		'set'
//	);

	if( trg.rank === null )
	{
		if( sign.rank >= trg.rank )
		{
			sign =
				new Sign(
					sign,
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
				new Sign(
					sign,
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
				new Sign(
					sign,
					'rank',
						sign.rank - 1
				);
		}
		else if( src.rank > sign.rank && trg.rank <= sign.rank )
		{
			sign =
				new Sign(
					sign,
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
TFXOps.insert =
	function(
		sign,
		src,
		trg
	)
{
	if(
		!trg.path ||
		!trg.path.equals( sign.path )
	)
	{
		return sign;
	}

//	Jools.log(
//		'tfx',
//		'insert'
//	);

	if(
		!is( trg.at1 ) ||
		!is( trg.at2 )
	)
	{
		throw new Error(
			CHECK && 'history mangled'
		);
	}

	if( sign.at1 < trg.at1 )
	{
		return sign;
	}

	var len =
		src.val.length;

	if( is( sign.at2 ) )
	{
		return new Sign(
			sign,
			'at1',
				sign.at1 + len,
			'at2',
				sign.at2 + len
		);
	}
	else
	{
		return new Sign(
			sign,
			'at1',
				sign.at1 + len
		);
	}
};


/*
| Transforms a signature on a remove
*/
TFXOps.remove =
	function(
		sign,
		src
		// trg
	)
{
	if(
		!src.path ||
		!src.path.equals(sign.path)
	)
	{
		return sign;
	}

	if(
		!is(src.at1) ||
		!is(src.at2)
	)
	{
		throw new Error(
			CHECK && 'history mangled'
		);
	}

	var len =
		src.at2 - src.at1;

	// simpler case signature is only one point
	if( !is( sign.at2 ) )
	{
		// src (removed span)      ######
		// sign, case0:        +   '    '      (sign to left,  no effect)
		// sign, case1:            ' +  '      (sign in middle, move to left)
		// sign, case2:            '    ' +    (sign to right, substract)

		if( sign.at1 <= src.at1 )
		{
//			Jools.log(
//				'tfx',
//				'remove (case s0)'
//			);

			return sign;
		}

		if( sign.at1 <= src.at2 )
		{
//			Jools.log(
//				'tfx',
//				'remove (case s1)'
//			);

			return new Sign(
				sign,
				'at1',
				src.at1
			);
		}

//		Jools.log(
//			'tfx',
//			'remove (case s2)'
//		);

		return new Sign(
			sign,
			'at1',
			sign.at1 - len
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
//		Jools.log(
//			'tfx',
//			'remove (case 0)'
//		);

		return sign;
	}
	else if( sign.at1 >= src.at2 )
	{
//		Jools.log(
//			'tfx',
//			'remove (case 1)'
//		);

		return new Sign(
			sign,
			'at1',
				sign.at1 - len,
			'at2',
				sign.at2 - len
			);
	}
	else if(
		sign.at1 < src.at1 &&
		sign.at2 > src.at2
	)
	{
//		Jools.log(
//			'tfx',
//			'remove (case 2)'
//		);

		return new Sign(
			sign,
			'at2',
			sign.at2 - len
		);
	}
	else if(
		sign.at1 >= src.at1 &&
		sign.at2 <= src.at2
	)
	{
//		Jools.log(
//			'tfx',
//			'remove (case 3)'
//		);

		return null;
	}
	else if(
		sign.at1 < src.at1 &&
		sign.at2 <= src.at2
	)
	{
//		Jools.log(
//			'tfx',
//			'remove (case 4)'
//		);

		return new Sign(
			sign,
			'at2',
			src.at1
		);
	}
	else if(
		sign.at1 <= src.at2 &&
		sign.at2 > src.at2
	)
	{
//		Jools.log(
//			'tfx',
//			'remove (case 5)'
//		);

		return new Sign(
			sign,
			'at2',
			src.at2
		);
	}
	else
	{
		throw new Error(
			CHECK &&
			(
				'remove, no case fitted! ' +
					sign.at1 + '-' + sign.at2 + ' ' +
					src.at1 + '-' + src.at2
			)
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
