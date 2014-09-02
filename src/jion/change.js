/*
| A change to a tree.
|
| Authors: Axel Kittenberger
*/


/*
| Export.
*/
var
	jion;


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
			'jion.change',
		attributes :
			{
				src :
					{
						comment :
							'source signature',
						json :
							'true',
						type :
							'jion.sign'
					},
				trg :
					{
						comment :
							'source signature',
						json :
							'true',
						type :
							'jion.sign'
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
	jools =
		require( '../jools/jools' );
	jion =
		{
			change :
				require( '../jion/this' )( module ),
			changeRay :
				require( '../jion/change-ray' ),
			path :
				require( '../jion/path'  ),
			sign :
				require( '../jion/sign'  ),
			signRay :
				require( '../jion/sign'  )
		};
}


var
	change;

change = jion.change;


/*
| The type of this change.
*/
jools.lazyValue(
	change.prototype,
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

			if( jools.prissy )
			{
				throw new Error( 'invalid type' );
			}
		}

		return type;
	}
);


/*
| Returns the inversion to this change.
*/
jools.lazyValue(
	change.prototype,
	'invert',
	function( )
	{
		var
			r;

		r =
			change.create(
				'src',
				this.trg,
				'trg',
					this.src
			);

		// TODO aheadValue

		return r;
	}
);


/*
| Performes this change on a tree.
*/
change.prototype.changeTree =
	function(
		tree
	)
{
	var
		r;

	jools.log(
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

	return jools.immute(
		{
			tree :
				r.tree,
			chgX :
				r.chg
		}
	);
};



/*
| Change emulates a changeRay with the length of 1.
| FIXME check if needed
*/
change.prototype.length = 1;


/*
| change emulates a changeRay with the length of 1.
| FIXME check if needed
*/
change.prototype.get =
	function(
		idx
	)
{

/**/if( CHECK )
/**/{
/**/	if( idx !== 0 )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return this;
};


/*
| Returns a change transformed on this change.
*/
change.prototype.transformChange =
	function(
		chg
	)
{
	var
		a,
		aZ,
		srcA,
		srcX,
		trgA,
		trgX,
		y;

/**/if( CHECK )
/**/{
/**/	if( chg.reflect !== 'jion.change' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	srcX = this.transformSign( chg.src );

	trgX = this.transformSign( chg.trg );

	if(
		srcX === null
		||
		trgX === null
	)
	{
		return null;
	}

	srcA = srcX.reflect === 'jion.signRay';

	trgA = trgX.reflect === 'jion.signRay';

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
			console.log( 'splice transformed to equalness' ); // FIXME
			// splice transformed to equalness

			return null;
		}


		return (
			change.create(
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
				change.create(
					'src',
						srcX,
					'trg',
						trgX.get( a )
				);
		}

		return (
			jion.changeRay.create(
				'array',
					y,
				'_sliced',
					true
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
			y[ a ] =
				change.create(
					'src',
						srcX.get( a ),
					'trg',
						trgX
				);
		}

		return (
			jion.changeRay.create(
				'array',
					y,
				'_sliced',
					true
			)
		);
	}
	else
	{
		throw new Error( );
	}
};


/*
| Returns a change ray transformed on this change.
*/
change.prototype.transformChangeRay =
	function(
	//	chgX
	)
{
	throw new Error( );
	// TODO
};


/*
| Returns a change or a changeRay transformed on this change.
*/
change.prototype.transformChangeX =
	function(
		chgX
	)
{
	switch( chgX.reflect )
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
| Change Operation: set
|
| A new item is inserted or replaces an existing.
*/
change.prototype._changeTreeSet =
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

	jools.check(
		trg.at1 === undefined,
		cm,
		'trg.at1 must not exist.'
	);

	jools.check(
		src.val !== undefined,
		cm,
		'src.val missing'
	);

	// if $new is given, replaces it with a unique ID
	if( trg.path.get( -1 ) === '$new' )
	{
		pivot = tree.getPath( trg.path.shorten( 2 ) );

		key = pivot.newUID( );

		trg =
			trg.create(
				'path',
					trg.path.set( -1, key )
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
			jools.is,
			cm,
			'trg',
			'val',
				save
		);

	src =
		src.affix(
			jools.is,
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
			tree.getPath( trg.path.shorten( 2 ) );

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
				pivot.create(
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
				trg.create(
					'rank',
						orank
				);

			pivot =
				pivot.create(
					'twig:remove',
					key
				);
		}

		if( trg.path.length > 2 )
		{
			tree =
				tree.setPath(
					trg.path.shorten( 2 ),
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
			this.create(
				'src',
					src,
				'trg',
					trg
			)
	};
};


/*
| change Operation: insert
|
| A string is inserted into a string item.
*/
change.prototype._changeTreeInsert =
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

	jools.check(
		trg.path.reflect === 'jion.path',
		cm,
		'trg.path missing'
	);

	str = tree.getPath( trg.path );

	jools.check(
		jools.isString( str ),
		cm,
		'trg.path signates no string'
	);

	// where trg span should end
	tat2 = trg.at1 + src.val.length;

	trg =
		trg.affix(
			jools.is,
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
			this.create(
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
change.prototype._changeTreeRemove =
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

	jools.check(
		src.path.reflect === 'jion.path',
		cm,
		'src.path missing'
	);

	str = tree.getPath( src.path );

	if( !jools.isString( str ) )
	{
		jools.log(
			'change',
			'src.path signates no string'
		);

		return null;
	}

	if( src.at1 === src.at2 )
	{
		jools.log(
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
			jools.isnon,
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
			this.create(
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
change.prototype._changeTreeJoin =
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

	jools.check(
		at1 !== undefined,
		cm,
		'trg.at1 missing'
	);

	text =
		tree.getPath( path );

	jools.check(
		jools.isString( text ),
		cm,
		'trg signates no text'
	);

	key = path.get( -2 );

	pivot = tree.getPath( path.shorten( 3 ) );

	jools.check( pivot.ranks, cm, 'pivot has no ranks' );

	kn = pivot.rankOf( key );

	jools.check( kn >= 0, cm, 'invalid line key (1)' );

	jools.check(
		kn < pivot.ranks.length,
		cm,
		'cannot join last line'
	);

	key2 = pivot.ranks[ kn + 1 ];

	path2 = path.set( -2, key2 );

	src =
		src.affix(
			jools.is,
			cm,
			'src', 'path',
			path2
		);

	para1 = pivot.twig[ key  ];

	para2 = pivot.twig[ key2 ];

	// FIXME check other keys to be equal

	para1 =
		para1.create(
			'text',
				para1.text + para2.text
		);

	pivot =
		pivot.create(
			'twig:set',
				key,
				para1,
			'twig:remove',
				key2
		);

	tree =
		tree.setPath(
			path.shorten( 3 ),
			pivot
		);

	// FIXME make a JION
	return {
		tree :
			tree,
		chg :
			this.create(
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
change.prototype._changeTreeSplit =
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

	cm = 'change.split';

	src = this.src;

	trg = this.trg;

	path = src.path;

	at1 = src.at1;

	text = tree.getPath( path );

	pivot =
		tree.getPath(
			path.shorten( 3 )
		);

	jools.check( jools.isString( text ), cm, 'src signates no text' );

	jools.check( pivot.ranks, cm, 'pivot has no ranks' );

	if( trg.path !== undefined )
	{
		vKey = trg.path.get( -2 );
	}
	else
	{
		vKey = pivot.newUID( );

		trg =
			trg.create(
				'path',
					src.path.set( -2, vKey )
			);
	}

	jools.check(
		!jools.isnon( pivot.twig[ vKey ] ),
		cm,
		'newUID not vacant: ',
		vKey
	);

	key = path.get( -2 ),

	kn = pivot.rankOf( key );

	jools.check( kn >= 0, cm, 'invalid line key ( 2 )' );

	para1 = pivot.twig[ key ];

	para2 =
		para1.create(
			'text',
				text.substring( at1, text.length )
		);

	para1 =
		para1.create(
			'text',
				text.substring( 0, at1 )
		);

	pivot =
		pivot.create(
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
			path.shorten( 3 ),
			pivot
		);

	// FIXME make a proper jion
	return {
		tree :
			tree,
		chg :
			this.create(
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
change.prototype._changeTreeRank =
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

	jools.check(
		src.path !== undefined,
		cm,
		'src.path not present'
	);

	jools.check(
		trg.rank !== undefined,
		cm,
		'trg.rank not present'
	);

	pivot = tree.getPath( src.path.shorten( 2 ) );

	jools.check(
		pivot.ranks !== undefined,
		cm,
		'pivot has no ranks'
	);

	key = src.path.get( -1 );

	orank = pivot.rankOf( key );

	if ( orank < 0 )
	{
		throw jools.reject(
			'invalid key :' + key
		);
	}

	// FIXME if (orank === trg.rank) return null;

	src =
		src.affix(
			jools.is,
			cm,
			'src',
			'rank',
				orank
		);

	trg =
		trg.affix(
			jools.is,
			cm,
			'trg',
			'path',
				src.path
		);

	// FUTURE make a twig:rerank
	pivot =
		pivot.create(
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
				src.path.shorten( 2 ),
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
			this.create(
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
change.prototype.transformSign =
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

			return this._transformSignSplit( sign );

		case 'join' :

			return this._transformSignJoin( sign );

		case 'rank' :

			return this._transformSignRank( sign );

		case 'set' :

			return this._transformSignSet( sign );

		case 'insert' :

			return this._transformSignInsert( sign );

		case 'remove' :

			return this._transformSignRemove( sign );

		default :

			throw new Error( );
	}
};


/*
| Returns a transformed signRay on this change.
*/
change.prototype.transformSignRay =
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
		cx = this.transformSign( signray.get( a ) );

		if( cx === null )
		{
			signray = signray.Remove( a-- );

			continue;
		}

		switch( cx.reflect )
		{
			case 'jion.sign' :

				signray = signray.set( a, cx );

				break;

			case 'jion.signRay' :

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
| Returns a transformed sign or signRay on this change.
|
| Can possibly transform a sign to a signRay.
*/
change.prototype.transformSignX =
	function(
		signX
	)
{
	switch( signX.reflect )
	{

		case 'jion.sign' :

			return this.transformSign( signX );

		case 'jion.signRay' :

			return this.transformSignRay( signX );

		default :

			throw new Error( );
	}
};


/*
| Transforms a signature on one a split.
*/
change.prototype._transformSignSplit =
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
			sign.create(
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
			sign.create(
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
		jion.signRay.create(
			'array',
				[
					sign.create(
						'at2',
							src.at1
					),
					sign.create(
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
change.prototype._transformSignJoin =
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

	// FUTURE? transform ranks

	if( sign.at2 === undefined )
	{
		return (
			sign.create(
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
			sign.create(
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
change.prototype._transformSignRank =
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
			sign.create(
				'rank',
					sign.rank - 1
			)
		);
	}
	else if( src.rank > sign.rank && trg.rank <= sign.rank )
	{
		return (
			sign.create(
				'rank',
					sign.rank + 1
			)
		);
	}
};



/*
| Transforms a signature on a join.
*/
change.prototype._transformSignSet =
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
				sign.create(
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
				sign.create(
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
				sign.create(
					'rank',
						sign.rank - 1
				);
		}
		else if( src.rank > sign.rank && trg.rank <= sign.rank )
		{
			sign =
				sign.create(
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
change.prototype._transformSignInsert =
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
			sign.create(
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
			sign.create(
				'at1',
					sign.at1 + len
			)
		);
	}
};


/*
| Transforms a signature on a remove
*/
change.prototype._transformSignRemove =
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
				sign.create(
					'at1',
						src.at1
				)
			);
		}

		return (
			sign.create(
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
			sign.create(
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
			sign.create(
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
			sign.create(
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
			sign.create(
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
	module.exports = change;
}


}( ) );
