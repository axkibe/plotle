/*
| A ccot change to a tree.
*/

var
	ccot_change,
	ccot_changeRay,
	ccot_signRay,
	result_changeTree,
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
			'ccot_change',
		attributes :
			{
				src :
					{
						comment :
							'source signature',
						json :
							'true',
						type :
							'ccot_sign'
					},
				trg :
					{
						comment :
							'target signature',
						json :
							'true',
						type :
							'ccot_sign'
					}
			}
	};
}


/*
| Node includes.
*/
if( SERVER )
{
	ccot_change = require( '../jion/this' )( module );

	jools = require( '../jools/jools' );

	ccot_changeRay = require( '../ccot/changeRay' );

	ccot_signRay = require( '../ccot/signRay' );

	result_changeTree = require( '../result/changeTree' );
}


var
	check;

/*
| Comfort routine, fails if condition is false.
|
| The error is marked non fatal for the server,
| since a faulty client can raise it and is not necessarily
| a coding error on the server.
*/
check =
	function(
		condition, // condition to check
		place,     // place where check happens
		message    // message to throw when it fails
	)
{
	var
		err;

	if( condition )
	{
		return;
	}

	err = new Error( place + ' ' + message );

	err.nonFatal = true;

	throw err;
};


/*
| The type of this change.
*/
jools.lazyValue(
	ccot_change.prototype,
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
	ccot_change.prototype,
	'invert',
	function( )
	{
		var
			r;

		r =
			ccot_change.create(
				'src', this.trg,
				'trg', this.src
			);

		// TODO aheadValue

		return r;
	}
);


/*
| Performes this change on a tree.
*/
ccot_change.prototype.changeTree =
	function(
		tree
	)
{
	// executes the op-handler
	switch( this.type )
	{
		case 'split' : return this._changeTreeSplit( tree );

		case 'join' : return this._changeTreeJoin( tree );

		case 'set' : return this._changeTreeSet( tree );

		case 'insert' : return this._changeTreeInsert( tree );

		case 'remove' : return this._changeTreeRemove( tree );

		case 'rank' : return this._changeTreeRank( tree );

		default : throw new Error( );
	}
};



/*
| Change emulates a changeRay with the length of 1.
| FIXME check if needed
*/
ccot_change.prototype.length = 1;


/*
| change emulates a changeRay with the length of 1.
| FIXME check if needed
*/
ccot_change.prototype.get =
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
| Returns a change transformed by this change.
*/
ccot_change.prototype._transformChange =
	function(
		c
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
/**/	if( c.reflect !== 'ccot_change' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	srcX = this._transformSign( c.src );

	trgX = this._transformSign( c.trg );

	if( srcX === null || trgX === null )
	{
		return null;
	}

	switch( srcX.reflect )
	{
		case 'ccot_sign' :

			srcA = false;

			break;

		case 'ccot_signRay' :

			srcA = true;

			break;

		default :

			throw new Error( );
	}

	switch( trgX.reflect )
	{
		case 'ccot_sign' :

			trgA = false;

			break;

		case 'ccot_signRay' :

			trgA = true;

			break;

		default :

			throw new Error( );
	}

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
			// splice transformed to equalness

			return null;
		}

		return(
			ccot_change.create(
				'src', srcX,
				'trg', trgX
			)
		);
	}
	else if( !srcA && trgA )
	{
		y = [ ]; // FIXME call it 'ray'

		for(
			a = 0, aZ = trgX.length;
			a < aZ;
			a++
		)
		{
			y[ a ] =
				ccot_change.create(
					'src', srcX,
					'trg', trgX.get( a )
				);
		}

		return ccot_changeRay.create( 'ray:init', y );
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
				ccot_change.create(
					'src', srcX.get( a ),
					'trg', trgX
				);
		}

		return ccot_changeRay.create( 'ray:init', y );
	}
	else
	{
		throw new Error( );
	}
};


/*
| Returns a change ray transformed by this change.
*/
ccot_change.prototype._transformChangeRay =
	function(
		cray
	)
{
	var
		change,
		r,
		rZ,
		tr,
		tray;

/**/if( CHECK )
/**/{
/**/	if( cray.reflect !== 'ccot_changeRay' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	tray = [ ];

	for(
		r = 0, rZ = cray.length, tr = 0;
		r < rZ;
		r++
	)
	{
		change = this._transformChange( cray.get( r ) );

		if( change !== null )
		{
			// nulled changes are sliced out.

			tray[ tr++ ] = change;
		}
	}

	return cray.create( 'ray:init', tray );
};


/*
| Return a change wrap transformed by this change.
*/
ccot_change.prototype._transformChangeWrap =
	function(
		cw
	)
{
	return cw.create( 'changeRay', this.transform( cw.changeRay ) );
};


/*
| Return a change wrap transformed by this change.
*/
ccot_change.prototype._transformChangeWrapRay =
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
| Returns a change, changeRay, changeWrap or changeWrapRay
| transformed on this change.
*/
ccot_change.prototype.transform =
	function(
		cx
	)
{
	if( cx === null )
	{
		return null;
	}

	switch( cx.reflect )
	{
		case 'ccot_change' :

			return this._transformChange( cx );

		case 'ccot_changeRay' :

			return this._transformChangeRay( cx );

		case 'ccot_changeWrap' :

			return this._transformChangeWrap( cx );

		case 'ccot_changeWrapRay' :

			return this._transformChangeWrapRay( cx );

		case 'ccot_sign' :

			return this._transformSign( cx );

		case 'ccot_signRay' :

			return this._transformSignRay( cx );

		default :

			throw new Error( );
	}
};


/*
| Change Operation: set
|
| A new item is inserted or replaces an existing.
*/
ccot_change.prototype._changeTreeSet =
	function(
		tree
	)
{
	var
		cm,
		key,
		orank,
		pivot,
		save,
		src,
		trg;

	cm = 'change.set';

	src = this.src;

	trg = this.trg;

	pivot = null;

	key = null;

	check( trg.at1 === undefined, cm, 'trg.at1 must not exist.' );

	check( src.val !== undefined, cm, 'src.val missing' );

	// if $new is given, replaces it with a unique ID
	if( trg.path.get( -1 ) === '$new' )
	{
		pivot = tree.getPath( trg.path.shorten( 2 ) );

		key = pivot.newUID( );

		trg = trg.create( 'path', trg.path.set( -1, key ) );
	}

	// Stores the old value for history tracking.
	save = tree.getPath( trg.path );

	if( save === undefined )
	{
		save = null;
	}

	trg = trg.affix( 'val', save );

	src = src.affix( 'path', trg.path );

	// FIXME simplify
	if( trg.rank === undefined )
	{
		tree = tree.setPath( trg.path, src.val );
	}
	else
	{
		pivot =
			pivot
			||
			tree.getPath( trg.path.shorten( 2 ) );

		if( key === null )
		{
			key = trg.path.get( -1 );
		}

		if( src.val !== null )
		{
			pivot = pivot.create( 'twig:insert', key, trg.rank, src.val );
		}
		else
		{
			orank = pivot.rankOf( key );

			trg = trg.create( 'rank', orank );

			pivot = pivot.create( 'twig:remove', key );
		}

		if( trg.path.length > 2 )
		{
			tree = tree.setPath( trg.path.shorten( 2 ), pivot );
		}
		else
		{
			tree = pivot;
		}
	}

	return(
		result_changeTree.create(
			'tree', tree,
			'reaction', this.create( 'src', src, 'trg', trg )
		)
	);
};


/*
| Change Operation: insert
|
| A string is inserted into a string item.
*/
ccot_change.prototype._changeTreeInsert =
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

	check( trg.path.reflect === 'jion_path', cm, 'trg.path missing' );

	str = tree.getPath( trg.path );

	check( jools.isString( str ), cm, 'trg.path signates no string' );

	// where trg span should end
	tat2 = trg.at1 + src.val.length;

	trg = trg.affix( 'at2', tat2 );

/**/if( CHECK )
/**/{
/**/	if( trg.at1 > str.length )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	nstr =
		str.substring( 0, trg.at1 )
		+ src.val
		+ str.substring( trg.at1 );

	tree = tree.setPath( trg.path, nstr );

	return(
		result_changeTree.create(
			'tree', tree,
			'reaction', this.create( 'src', src, 'trg', trg )
		)
	);
};


/*
| Change Operation: remove
|
| A part of a string item is removed.
*/
ccot_change.prototype._changeTreeRemove =
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

	check( src.path.reflect === 'jion_path', cm, 'src.path missing' );

	str = tree.getPath( src.path );

	if( !jools.isString( str ) )
	{
		jools.log( 'change', 'src.path signates no string' );

		return null;
	}

	if( src.at1 === src.at2 )
	{
		jools.log( 'change', 'removed nothing' );

		return null;
	}

	val = str.substring( src.at1, src.at2 );

	trg = trg.affix( 'val', val );

	nstr = str.substring( 0, src.at1 ) + str.substring( src.at2 );

	tree = tree.setPath( src.path, nstr );

	return(
		result_changeTree.create(
			'tree', tree,
			'reaction', this.create( 'src', src, 'trg', trg )
		)
	);
};


/*
| Change Operation: join
|
| Two texts are joined into one.
*/
ccot_change.prototype._changeTreeJoin =
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

	check( at1 !== undefined, cm, 'trg.at1 missing' );

	text = tree.getPath( path );

	check( jools.isString( text ), cm, 'trg signates no text' );

	key = path.get( -2 );

	pivot = tree.getPath( path.shorten( 3 ) );

	check( pivot.ranks, cm, 'pivot has no ranks' );

	kn = pivot.rankOf( key );

	check( kn >= 0, cm, 'invalid line key (1)' );

	check( kn < pivot.ranks.length, cm, 'cannot join last line' );

	key2 = pivot.ranks[ kn + 1 ];

	path2 = path.set( -2, key2 );

	src = src.affix( 'path', path2 );

	para1 = pivot.twig[ key  ];

	para2 = pivot.twig[ key2 ];

	// FIXME check other keys to be equal

	para1 = para1.create( 'text', para1.text + para2.text );

	pivot = pivot.create( 'twig:set', key, para1, 'twig:remove', key2 );

	tree = tree.setPath( path.shorten( 3 ), pivot );

	return(
		result_changeTree.create(
			'tree', tree,
			'reaction', this.create( 'src', src, 'trg', trg )
		)
	);
};


/*
| Change Operation: split
|
| A text is split into two.
*/
ccot_change.prototype._changeTreeSplit =
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

	pivot = tree.getPath( path.shorten( 3 ) );

	check( jools.isString( text ), cm, 'src signates no text' );

	check( pivot.ranks, cm, 'pivot has no ranks' );

	if( trg.path !== undefined )
	{
		vKey = trg.path.get( -2 );
	}
	else
	{
		vKey = pivot.newUID( );

		trg = trg.create( 'path', src.path.set( -2, vKey ) );
	}

/**/if( CHECK )
/**/{
/**/	if( pivot.twig[ vKey ] !== null && pivot.twig[ vKey ] !== undefined )
/**/	{
/**/		// newUID not vacant
/**/		throw new Error( );
/**/	}
/**/}

	key = path.get( -2 );

	kn = pivot.rankOf( key );

	check( kn >= 0, cm, 'invalid line key ( 2 )' );

	para1 = pivot.twig[ key ];

	para2 = para1.create( 'text', text.substring( at1, text.length ) );

	para1 = para1.create( 'text', text.substring( 0, at1 ) );

	pivot =
		pivot.create(
			'twig:set', key, para1,
			'twig:insert', vKey, kn + 1, para2
		);

	tree = tree.setPath( path.shorten( 3 ), pivot );

	return(
		result_changeTree.create(
			'tree', tree,
			'reaction', this.create( 'src', src, 'trg', trg )
		)
	);
};


/*
| Change Operation: rank
|
| A tree's rank is changed.
*/
ccot_change.prototype._changeTreeRank =
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

	check( src.path !== undefined, cm, 'src.path not present' );

	check( trg.rank !== undefined, cm, 'trg.rank not present' );

	pivot = tree.getPath( src.path.shorten( 2 ) );

	check( pivot.ranks !== undefined, cm, 'pivot has no ranks' );

	key = src.path.get( -1 );

	orank = pivot.rankOf( key );

	check( orank >= 0, cm, 'invalid key' );

	// FIXME if (orank === trg.rank) return null;

	src = src.affix( 'rank', orank );

	trg = trg.affix( 'path', src.path );

	// FUTURE make a twig:rerank
	pivot =
		pivot.create(
			'twig:remove', key,
			'twig:insert', key, trg.rank, pivot.twig[ key ]
		);

	if( src.path.length > 2 )
	{
		tree = tree.setPath( src.path.shorten( 2 ), pivot );
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

	return(
		result_changeTree.create(
			'tree', tree,
			'reaction', this.create( 'src', src, 'trg', trg )
		)
	);
};


/****************************************************************************
*****************************************************************************
****************************************************************************/


/*
| Transforms a signature by this change
|
| This can possibly return a sign ray.
*/
ccot_change.prototype._transformSign =
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
ccot_change.prototype._transformSignRay =
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
		cx = this._transformSign( signray.get( a ) );

		if( cx === null )
		{
			signray = signray.remove( a-- );

			continue;
		}

		switch( cx.reflect )
		{
			case 'ccot_sign' :

				signray = signray.set( a, cx );

				break;

			case 'ccot_signRay' :

				for(
					b = 0, bZ = cx.length;
					b < bZ;
					b++
				)
				{
					signray = signray.insert( a++, cx.get( b ) );
				}

				break;

			default :

				throw new Error( );
		}
	}
};


/*
| Transforms a signature on one a split.
*/
ccot_change.prototype._transformSignSplit =
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

		return(
			sign.create(
				'path', trg.path,
				'at1', sign.at1 - src.at1
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
		return(
			sign.create(
				'path', trg.path,
				'at1', sign.at1 - src.at1,
				'at2', sign.at2 - src.at1
			)
		);
	}

	// the signature is splited into a part that stays
	// and one that goes to next line.

	return(
		ccot_signRay.create(
			'ray:init',
				[
					sign.create( 'at2', src.at1 ),
					sign.create(
						'path', trg.path,
						'at1', 0,
						'at2', sign.at2 - src.at1
					)
				]
		)
	);
};

/*
| Transforms a signature on a join.
*/
ccot_change.prototype._transformSignJoin =
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
		return(
			sign.create(
				'path', trg.path,
				'at1', sign.at1 + trg.at1
			)
		);
	}
	else
	{
		return(
			sign.create(
				'path', trg.path,
				'at1', sign.at1 + trg.at1,
				'at2', sign.at2 + trg.at1
			)
		);
	}
};

/*
| Transforms a signature on a rank
*/
ccot_change.prototype._transformSignRank =
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
		return sign.create( 'rank', sign.rank - 1 );
	}
	else if( src.rank > sign.rank && trg.rank <= sign.rank )
	{
		return sign.create( 'rank', sign.rank + 1 );
	}
};



/*
| Transforms a signature on a join.
*/
ccot_change.prototype._transformSignSet =
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
		|| trg.rank === undefined
		|| !trg.path
		|| !trg.path.subPathOf( sign.path, - 1 )
	)
	{
		return sign;
	}

	if( trg.rank === null )
	{
		if( sign.rank >= trg.rank )
		{
			sign = sign.create( 'rank', sign.rank - 1 );
		}
	}
	else if( src.rank === null )
	{
		if( sign.rank >= src.rank )
		{
			sign = sign.create( 'rank', sign.rank + 1 );
		}
	}
	else
	{
		if( src.rank <= sign.rank && trg.rank > sign.rank )
		{
			sign = sign.create( 'rank', sign.rank - 1 );
		}
		else if( src.rank > sign.rank && trg.rank <= sign.rank )
		{
			sign = sign.create( 'rank', sign.rank + 1 );
		}
	}

	return sign;
};


/*
| Transforms a sign on an insert.
*/
ccot_change.prototype._transformSignInsert =
	function(
		sign
	)
{
	var
		len,
		src,
		trg;

	src = this.src;

	trg = this.trg;

	if(
		!trg.path
		|| !trg.path.equals( sign.path )
	)
	{
		return sign;
	}

/**/if( CHECK )
/**/{
/**/	if( trg.at1 === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if( sign.at1 < trg.at1 )
	{
		return sign;
	}

	len = src.val.length;

	if( sign.at2 !== undefined )
	{
		return(
			sign.create(
				'at1', sign.at1 + len,
				'at2', sign.at2 + len
			)
		);
	}
	else
	{
		return sign.create( 'at1', sign.at1 + len );
	}
};


/*
| Transforms a signature on a remove
*/
ccot_change.prototype._transformSignRemove =
	function(
		sign
	)
{
	var
		len,
		src;

	src = this.src;

	if(
		!src.path
		||
		!src.path.equals( sign.path )
	)
	{
		return sign;
	}

/**/if( CHECK )
/**/{
/**/	if(
/**/		src.at1 === undefined
/**/		||
/**/		src.at2 === undefined
/**/	)
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	len = src.at2 - src.at1;

	// simpler case signature is only one point
	if( sign.at2 === undefined )
	{
		if( sign.at1 === undefined )
		{
			return sign;
		}

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
			return sign.create( 'at1', src.at1 );
		}

		return sign.create( 'at1', sign.at1 - len );
	}

	// More complicated signature is affected.
	// Supposedly ;its a remove as well.
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
		return(
			sign.create(
				'at1', sign.at1 - len,
				'at2', sign.at2 - len
			)
		);
	}
	else if(
		sign.at1 < src.at1
		&&
		sign.at2 > src.at2
	)
	{
		return sign.create( 'at2', sign.at2 - len );
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
		return sign.create( 'at2', src.at1 );
	}
	else if(
		sign.at1 <= src.at2
		&&
		sign.at2 > src.at2
	)
	{
		return sign.create( 'at2', src.at2 );
	}
	else
	{
		throw new Error( );
	}
};


}( ) );
