/*
| A change to a tree.
|
| Authors: Axel Kittenberger
*/


/*
| Imports
*/
var
	Jion,
	Jools;


/*
| Exports
*/
var
	Change;


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
			Path :
				require( '../jion/path'  ),
			Sign :
				require( '../jion/sign'  )
		};
}


/*
| Constructor
*/
Change =
	function(
		src,
		trg
	)
{

/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 2 )
/**/	{
/**/		throw new Error(
/**/			'argFail'
/**/		);
/**/	}
/**/}

	if( src.constructor === Jion.Sign )
	{
		this.src =
			src;
	}
	else
	{
		this.src = Jion.Sign.CreateFromJSON( src );
	}

	if( trg.constructor === Jion.Sign )
	{
		this.trg =
			trg;
	}
	else
	{
		this.trg = Jion.Sign.CreateFromJSON( trg );
	}

	Jools.immute( this );
};


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
| FIXME use lazyValue
| FIXME call it Invert
*/
Change.prototype.invert =
	function( )
{
	var
		r;

	// checks if the inversion is cached.
	if( this._invert !== undefined )
	{
		return this._invert;
	}

	r =
		new Change(
			this.trg,
			this.src
		);

	// caches the inversion for both changies

	Jools.innumerable(
		this,
		'_invert',
		r
	);

	Jools.innumerable(
		r,
		'_invert',
		this
	);

	return r;
};


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
	r =
		this[ this.type ]( tree );

	Jools.log(
		'change',
		'result',
			r
	);

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
Change.prototype.set =
	function(
		tree
	)
{
	var
		chg,
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

	if(
		src === this.src
		&&
		trg === this.trg
	)
	{
		chg =
			this;
	}
	else
	{
		chg =
			new Change(
				src,
				trg
			);
	}

	return {
		tree :
			tree,
		chg :
			chg
	};
};


/*
| Change Operation: insert
|
| A string is inserted into a string item.
*/
Change.prototype.insert =
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

	var
		chg;

	// FIXME use equals
	if( src === this.src && trg === this.trg )
	{
		chg =
			this;
	}
	else
	{
		// FIXME create
		chg =
			new Change(
				src,
				trg
			);
	}

	return {
		tree :
			tree,
		chg :
			chg
	};
};


/*
| Change Operation: remove
|
| A part of a string item is removed.
*/
Change.prototype.remove =
	function(
		tree
	)
{
	var
		chg,
		cm,
		nstr,
		str,
		src,
		trg,
		val;

	cm =
		'change.remove';
	src =
		this.src;
	trg =
		this.trg;

	Jools.check(
		src.path.reflect === 'Path',
		cm,
		'src.path missing'
	);

	str =
		tree.getPath( src.path );

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

	if(
		src === this.src &&
		trg === this.trg
	)
	{
		chg =
			this;
	}
	else
	{
		chg =
			new Change(
				src,
				trg
			);
	}

	return {
		tree :
			tree,
		chg :
			chg
	};
};


/*
| Change Operation: join
|
| Two texts are joined into one.
*/
Change.prototype.join =
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

	var chg;

	// FIXME make a JION
	if(
		src === this.src &&
		trg === this.trg
	)
	{
		chg =
			this;
	}
	else
	{
		chg =
			new Change(
				src,
				trg
			);
	}

	// FIXME make a JION
	return {
		tree :
			tree,
		chg :
			chg
	};
};


/*
| Change Operation: split
|
| A text is split into two.
*/
Change.prototype.split =
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

	var
		chg;

	// FIXME make a proper jion
	if( src === this.src && trg === this.trg )
	{
		chg =
			this;
	}
	else
	{
		chg =
			new Change(
				src,
				trg
			);
	}

	// FIXME make a proper jion
	return {
		tree :
			tree,
		chg :
			chg
	};
};


/*
| Change Operation: rank
|
| A tree's rank is changed.
*/
Change.prototype.rank =
	function(
		tree
	)
{
	var
		chg,
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

		tree =
			pivot;
	}

	if( src === this.src && trg === this.trg )
	{
		chg =
			this;
	}
	else
	{
		chg =
			new Change(
				src,
				trg
			);
	}

	return {
		tree :
			tree,
		chg :
			chg
	};
};


/*
| Exports
*/
if( SERVER )
{
	module.exports =
		Change;
}


}( ) );
