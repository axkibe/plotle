/*
| A change to a tree.
|
| Authors: Axel Kittenberger
*/


/*
| Export.
*/
var
	Jion;


/*
| Imports
*/
var
	Jools;


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
			'Change',
		unit :
			'Jion',
		attributes :
			{
				src :
					{
						comment :
							'source signature',
						json :
							'true',
						unit :
							'Jion',
						type :
							'Sign'
					},
				trg :
					{
						comment :
							'source signature',
						json :
							'true',
						unit :
							'Jion',
						type :
							'Sign'
					}
			},
		node :
			true
	};
}


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
				require( '../jion/this' )( module ),
			Path :
				require( '../jion/path'  ),
			Sign :
				require( '../jion/sign'  ),
			SignRay :
				require( '../jion/sign'  )
		};
}


var
	Change;

Change =
	Jion.Change;


/*
| The type of this change.
*/
Jools.lazyValue(
	Change.prototype,
	'type',
	function( )
	{
		var
			src,
			trg,
			type;

		src = this.src;

		trg = this.trg;

		if( trg.proc === 'splice' )
		{
			type = 'split';
		}
		else if(
			src.proc === 'splice'
		)
		{
			type = 'join';
		}
		else if(
			src.val !== undefined && trg.at1 === undefined
		)
		{
			type = 'set';
		}
		else if(
			src.val !== undefined && trg.at1 !== undefined
		)
		{
			type = 'insert';
		}
		else if(
			src.at1 !== undefined
			&&
			src.at2 !== undefined
			&&
			trg.at1 === undefined
		)
		{
			type = 'remove';
		}
		else if(
			trg.rank !== undefined
		)
		{
			type = 'rank';
		}
		else
		{
			type = null;

			if( Jools.prissy )
			{
				throw new Error( 'invalid type' );
			}
		}

		return type;
	}
);


/*
| Returns the inversion to this change.
| FIXME call it Invert
*/
Jools.lazyValue(
	Change.prototype,
	'Invert',
	function( )
	{
		var
			r;

		r =
			Change.Create(
				'src',
				this.trg,
				'trg',
					this.src
			);

		// TODO ahreadValue

		return r;
	}
);


/*
| Performes this change on a tree.
| Call it ChangeTree
*/
Change.prototype.changeTree =
	function(
		tree
	)
{
	var
		r;

	Jools.log(
		'change',
		'src:',
			this.src,
		'trg:',
			this.trg,
		'type:',
			this.type
	);

	// executes the op-handler
	// FIXME make a switch call around this
	switch( this.type )
	{
		case 'split' :

			r = this._changeTreeSplit( tree );

			break;

		case 'join' :

			r = this._changeTreeJoin( tree );

			break;

		case 'set' :

			r = this._changeTreeSet( tree );

			break;

		case 'insert' :

			r = this._changeTreeInsert( tree );

			break;

		case 'remove' :

			r = this._changeTreeRemove( tree );

			break;

		case 'rank' :

			r = this._changeTreeRank( tree );

			break;

		default :

			throw new Error( );
	}


	// if answer is null the change has vaporated
	if( r === null )
	{
		return null;
	}

	return Jools.immute(
		{
			tree :
				r.tree,
			chgX :
				r.chg
		}
	);
};



/*
| Change emulates a ChangeRay with the length of 1.
| FIXME check if needed
*/
Change.prototype.length = 1;


/*
| Change emulates a ChangeRay with the length of 1.
| FIXME check if needed
*/
Change.prototype.get =
	function(
		idx
	)
{
	if( idx !== 0 )
	{
		throw new Error(
			'Change.get: out of bonds'
		);
	}

	return this;
};


/*
| Change Operation: set
|
| A new item is inserted or replaces an existing.
*/
Change.prototype._changeTreeSet =
	function(
		tree
	)
{
	var
		cm,
		key,
		pivot,
		save,
		src,
		trg;

	cm = 'change.set';

	src = this.src;

	trg = this.trg;

	pivot = null;

	key = null;

	Jools.check(
		trg.at1 === undefined,
		cm,
		'trg.at1 must not exist.'
	);

	Jools.check(
		src.val !== undefined,
		cm,
		'src.val missing'
	);

	// if $new is given, replaces it with a unique ID
	if( trg.path.get( -1 ) === '$new' )
	{
		pivot = tree.getPath( trg.path.Shorten( 2 ) );

		key = pivot.newUID( );

		trg =
			trg.Create(
				'path',
					trg.path.Set( -1, key )
			);
	}

	// Stores the old value for history tracking.
	save =
		tree.getPath( trg.path );

	if( save === undefined )
	{
		save = null;
	}

	trg =
		trg.affix(
			Jools.is,
			cm,
			'trg',
			'val',
				save
		);

	src =
		src.affix(
			Jools.is,
			cm,
			'src',
			'path',
				trg.path
		);

	// FIXME simplify
	if( trg.rank === undefined )
	{
		tree =
			tree.setPath(
				trg.path,
				src.val
			);
	}
	else
	{
		pivot =
			pivot
			||
			tree.getPath( trg.path.Shorten( 2 ) );

		if( key === null )
		{
			key =
				trg.path.get( -1 );
		}

		var
			orank;

		if( src.val !== null )
		{
			pivot =
				pivot.Create(
					'twig:insert',
					key,
					trg.rank,
					src.val
				);
		}
		else
		{
			orank = pivot.rankOf( key );

			trg =
				trg.Create(
					'rank',
						orank
				);

			pivot =
				pivot.Create(
					'twig:remove',
					key
				);
		}

		if( trg.path.length > 2 )
		{
			tree =
				tree.setPath(
					trg.path.Shorten( 2 ),
					pivot
				);
		}
		else
		{
			tree = pivot;
		}
	}

	return {
		tree :
			tree,
		chg :
			this.Create(
				'src',
					src,
				'trg',
					trg
			)
	};
};


/*
| Change Operation: insert
|
| A string is inserted into a string item.
*/
Change.prototype._changeTreeInsert =
	function(
		tree
	)
{
	var
		cm,
		nstr,
		src,
		str,
		tat2,
		trg;


	cm = 'change.insert';

	src = this.src;

	trg = this.trg;

	Jools.check(
		trg.path.reflect === 'Path',
		cm,
		'trg.path missing'
	);

	str = tree.getPath( trg.path );

	Jools.check(
		Jools.isString( str ),
		cm,
		'trg.path signates no string'
	);

	// where trg span should end
	tat2 = trg.at1 + src.val.length;

	trg =
		trg.affix(
			Jools.is,
			cm, 'trg',
			'at2',
				tat2
		);

	nstr =
		str.substring( 0, trg.at1 ) +
		src.val +
		str.substring( trg.at1 );

	tree =
		tree.setPath(
			trg.path,
			nstr
		);

	return {
		tree :
			tree,
		chg :
			this.Create(
				'src',
					src,
				'trg',
					trg
			)
	};
};


/*
| Change Operation: remove
|
| A part of a string item is removed.
*/
Change.prototype._changeTreeRemove =
	function(
		tree
	)
{
	var
		cm,
		nstr,
		str,
		src,
		trg,
		val;

	cm = 'change.remove';

	src = this.src;

	trg = this.trg;

	Jools.check(
		src.path.reflect === 'Path',
		cm,
		'src.path missing'
	);

	str = tree.getPath( src.path );

	if( !Jools.isString( str ) )
	{
		Jools.log(
			'change',
			'src.path signates no string'
		);

		return null;
	}

	if( src.at1 === src.at2 )
	{
		Jools.log(
			'change',
			'removed nothing'
		);

		return null;
	}

	val =
		str.substring(
			src.at1,
			src.at2
		);

	trg =
		trg.affix(
			Jools.isnon,
			cm,
			'trg',
			'val',
				val
		);

	nstr = (
		str.substring( 0, src.at1 ) +
		str.substring( src.at2 )
	);

	tree =
		tree.setPath(
			src.path,
			nstr
		);

	return {
		tree :
			tree,
		chg :
			this.Create(
				'src',
					src,
				'trg',
					trg
			)
	};
};


/*
| Change Operation: join
|
| Two texts are joined into one.
*/
Change.prototype._changeTreeJoin =
	function(
		tree
	)
{
	var
		cm,
		key,
		key2,
		kn,
		pivot,
		src,
		text,
		trg,
		para1,
		para2,
		path,
		path2,
		at1;

	cm = 'change.join';

	src = this.src;

	trg = this.trg;

	path = trg.path;

	at1 = trg.at1;

	Jools.check(
		at1 !== undefined,
		cm,
		'trg.at1 missing'
	);

	text =
		tree.getPath( path );

	Jools.check(
		Jools.isString( text ),
		cm,
		'trg signates no text'
	);

	key =
		path.get( -2 );

	pivot =
		tree.getPath( path.Shorten( 3 ) );

	Jools.check( pivot.ranks, cm, 'pivot has no ranks' );

	kn = pivot.rankOf( key );

	Jools.check( kn >= 0, cm, 'invalid line key (1)' );

	Jools.check(
		kn < pivot.ranks.length,
		cm,
		'cannot join last line'
	);

	key2 = pivot.ranks[ kn + 1 ];

	path2 = path.Set( -2, key2 );

	src =
		src.affix(
			Jools.is,
			cm,
			'src', 'path',
			path2
		);

	para1 = pivot.twig[ key  ];

	para2 = pivot.twig[ key2 ];

	// FIXME check other keys to be equal

	para1 =
		para1.Create(
			'text',
				para1.text + para2.text
		);

	pivot =
		pivot.Create(
			'twig:set',
				key,
				para1,
			'twig:remove',
				key2
		);

	tree =
		tree.setPath(
			path.Shorten( 3 ),
			pivot
		);

	// FIXME make a JION
	return {
		tree :
			tree,
		chg :
			this.Create(
				'src',
					src,
				'trg',
					trg
			)
	};
};


/*
| Change Operation: split
|
| A text is split into two.
*/
Change.prototype._changeTreeSplit =
	function(
		tree
	)
{
	var
		cm,
		key,
		kn,
		src,
		trg,
		para1,
		para2,
		path,
		at1,
		text,
		pivot,
		vKey;

	cm =
		'change.split';
	src =
		this.src;
	trg =
		this.trg;
	path =
		src.path;
	at1 =
		src.at1;
	text =
		tree.getPath( path );
	pivot =
		tree.getPath( path.Shorten( 3 ) );

	Jools.check( Jools.isString( text ), cm, 'src signates no text' );

	Jools.check( pivot.ranks, cm, 'pivot has no ranks' );

	if( trg.path !== undefined )
	{
		vKey =
			trg.path.get( -2 );
	}
	else
	{
		vKey =
			pivot.newUID( );

		trg =
			trg.Create(
				'path',
					src.path.Set( -2, vKey )
			);
	}

	Jools.check(
		!Jools.isnon( pivot.twig[ vKey ] ),
		cm,
		'newUID not vacant: ',
		vKey
	);

	key =
		path.get( -2 ),
	kn =
		pivot.rankOf( key );

	Jools.check( kn >= 0, cm, 'invalid line key ( 2 )' );

	para1 =
		pivot.twig[ key ];
	para2 =
		para1.Create(
			'text',
				text.substring( at1, text.length )
		);

	para1 =
		para1.Create(
			'text',
				text.substring( 0, at1 )
		);

	pivot =
		pivot.Create(
			'twig:set',
				key,
				para1,
			'twig:insert',
				vKey,
				kn + 1,
				para2
		);

	tree =
		tree.setPath(
			path.Shorten( 3 ),
			pivot
		);

	// FIXME make a proper jion
	return {
		tree :
			tree,
		chg :
			this.Create(
				'src',
					src,
				'trg',
					trg
			)
	};
};


/*
| Change Operation: rank
|
| A tree's rank is changed.
*/
Change.prototype._changeTreeRank =
	function(
		tree
	)
{
	var
		cm,
		key,
		orank,
		pivot,
		src,
		trg;

	cm = 'change.rank';

	src = this.src;

	trg = this.trg;

	Jools.check(
		src.path !== undefined,
		cm,
		'src.path not present'
	);

	Jools.check(
		trg.rank !== undefined,
		cm,
		'trg.rank not present'
	);

	pivot = tree.getPath( src.path.Shorten( 2 ) );

	Jools.check(
		pivot.ranks !== undefined,
		cm,
		'pivot has no ranks'
	);

	key = src.path.get( -1 );

	orank = pivot.rankOf( key );

	if ( orank < 0 )
	{
		throw Jools.reject(
			'invalid key :' + key
		);
	}

	// FIXME if (orank === trg.rank) return null;

	src =
		src.affix(
			Jools.is,
			cm,
			'src',
			'rank',
				orank
		);

	trg =
		trg.affix(
			Jools.is,
			cm,
			'trg',
			'path',
				src.path
		);

	// FUTURE make a twig:rerank
	pivot =
		pivot.Create(
			'twig:remove',
				key,
			'twig:insert',
				key,
				trg.rank,
				pivot.twig[ key ]
		);

	if( src.path.length > 2 )
	{
		tree =
			tree.setPath(
				src.path.Shorten( 2 ),
				pivot
			);
	}
	else
	{
/**/	if( CHECK )
/**/	{
/**/		if( src.path.length !== 2 )
/**/		{
/**/			throw new Error( );
/**/		}
/**/	}

		tree = pivot;
	}

	return {
		tree :
			tree,
		chg :
			this.Create(
				'src',
					src,
				'trg',
					trg
			)
	};
};


/*
| Transforms a signature on a this change
|
| This can possibly return a sign ray.
*/
Change.prototype.TfxSign =
	function(
		sign
	)
{
	if( sign.path === undefined )
	{
		return sign;
	}

	switch( this.type )
	{
		case 'split' :

			return this._TfxSignSplit( sign );

		case 'join' :

			return this._TfxSignJoin( sign );

		case 'rank' :

			return this._TfxSignRank( sign );

		case 'set' :

			return this._TfxSignSet( sign );

		case 'insert' :

			return this._TfxSignInsert( sign );

		case 'remove' :

			return this._TfxSignRemove( sign );

		default :

			throw new Error( );
	}
};


/*
| Returns a transformed SignRay on this change.
*/
Change.prototype.TfxSignRay =
	function(
		signray
	)
{
	var
		a,
		b,
		bZ,
		cx;

	for(
		a = 0;
		a < signray.length; // not using aZ on purpose
		a++
	)
	{
		cx = this.TfxSign( signray.get( a ) );

		if( cx === null )
		{
			signray = signray.Remove( a-- );

			continue;
		}

		switch( cx.reflect )
		{
			case 'Sign' :

				signray = signray.Set( a, cx );

				break;

			case 'SignRay' :

				for(
					b = 0, bZ = cx.length;
					b < bZ;
					b++
				)
				{
					signray = signray.Insert( a++, cx.get( b ) );
				}

				break;

			default :

				throw new Error( );
		}
	}
};


/*
| Returns a transformed Sign or SignRay on this change.
|
| Can possibly transform a Sign to a SignRay.
*/
Change.prototype.TfxSignX =
	function(
		signX
	)
{
	switch( signX.reflect )
	{

		case 'Sign' :

			return this.TfxSign( signX );

		case 'SignRay' :

			return this.TfxSignRay( signX );

		default :

			throw new Error( );
	}
};


/*
| Transforms a signature on one a split.
*/
Change.prototype._TfxSignSplit =
	function(
		sign
	)
{
	var
		src,
		trg;

	src = this.src;

	trg = this.trg;

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
		return sign;
	}

	if( sign.at1 >= src.at1 )
	{
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

	// the signature is splited into a part that stays and one that goes to next line.

	return (
		Jion.SignRay.Create(
			'array',
				[
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
				],
			'_sliced',
				true
		)
	);
};

/*
| Transforms a signature on a join.
*/
Change.prototype._TfxSignJoin =
	function(
		sign
	)
{
	var
		src,
		trg;

	src = this.src;

	trg = this.trg;

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
Change.prototype._TfxSignRank =
	function(
		sign
	)
{
	var
		src,
		trg;

	src = this.src;

	trg = this.trg;

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
		return (
			sign.Create(
				'rank',
					sign.rank - 1
			)
		);
	}
	else if( src.rank > sign.rank && trg.rank <= sign.rank )
	{
		return (
			sign.Create(
				'rank',
					sign.rank + 1
			)
		);
	}
};



/*
| Transforms a signature on a join.
*/
Change.prototype._TfxSignSet =
	function(
		sign
	)
{
	var
		src,
		trg;

	src = this.src;

	trg = this.trg;

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
Change.prototype._TfxSignInsert =
	function(
		sign
	)
{
	var
		src,
		trg;

	src = this.src;

	trg = this.trg;

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
Change.prototype._TfxSignRemove =
	function(
		sign
	)
{
	var
		src;

	src = this.src;

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


/*
| Exports
*/
if( SERVER )
{
	module.exports = Change;
}


}( ) );
