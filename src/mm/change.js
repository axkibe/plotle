/*
| A change to a tree.
|
| Authors: Axel Kittenberger
*/


/*
| Imports
*/
var
	Jools,
	Path,
	Sign,
	Tree;


/*
| Exports
*/
var
	Change =
		null;


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

	Path =
		require( './path'  );

	Sign =
		require( './sign'  );

	Tree =
		require( './tree' );
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

	if( src.constructor === Sign )
	{
		this.src =
			src;
	}
	else
	{
		// FIXME do not change callee object
		if( src.path && src.path.reflect !== 'Path' )
		{
			src.path =
				Path.create(
					'array',
					src.path
				);
		}

		this.src =
			new Sign( src );
	}

	if( trg.constructor === Sign )
	{
		this.trg =
			trg;
	}
	else
	{
		// FIXME do not change callee object
		if( trg.path && trg.path.reflect !== 'Path' )
		{
			trg.path =
				Path.create(
					'array',
					trg.path
				);
		}

		this.trg =
			new Sign( trg );
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
			is =
				Jools.is,

			src =
				this.src,

			trg =
				this.trg,

			type;

		if( trg.proc === 'splice' )
		{
			type =
				'split';
		}
		else if( src.proc === 'splice' )
		{
			type =
				'join';
		}
		else if( is( src.val ) && !is( trg.at1 ) )
		{
			type =
				'set';
		}
		else if( is( src.val ) && is( trg.at1 ) )
		{
			type =
				'insert';
		}
		else if( is( src.at1 ) && is( src.at2 ) && !is( trg.at1 ) )
		{
			type =
				'remove';
		}
		else if( is( trg.rank ) )
		{
			type =
				'rank';
		}
		else
		{
			type =
				null;

			if( Jools.prissy )
			{
				Jools.log( 'fail', this );
				throw new Error( 'invalid type' );
			}
		}

		return type;
	}
);


/*
| Returns the inversion to this change.
| FIXME use lazy fixate
*/
Change.prototype.invert =
	function( )
{
	// checks if the inversion is cached.
	if( Jools.is( this._invert ) )
	{
		return this._invert;
	}

	var
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
*/
Change.prototype.changeTree =
	function(
		tree,
		universe
	)
{
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
	var
		r =
			this[ this.type ]( tree, universe );

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
Change.prototype.length =
	1;


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
		tree,
		universe
	)
{
	var
		cm =
			'change.set',

		src =
			this.src,

		trg =
			this.trg,

		pivot =
			null,

		key =
			null;

	Jools.check(
		!Jools.is( trg.at1 ),
		cm,
		'trg.at1 must not exist.'
	);

	Jools.check(
		Jools.is( src.val ),
		cm,
		'src.val missing'
	);

	// if $new is given, replaces it with a unique ID
	if( trg.path.get( -1 ) === '$new' )
	{
		pivot =
			tree.getPath( trg.path, -1 );

		key =
			pivot.newUID( );

		trg =
			new Sign(
				trg,
				'path',
					trg.path.set( -1, key )
			);
	}

	// Stores the old value for history tracking.
	var
		save =
			tree.getPath( trg.path );

	if( !Jools.is( save ) )
	{
		save =
			null;
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
	if( !Jools.is( trg.rank ) )
	{
		tree =
			tree.setPath(
				trg.path,
				src.val,
				universe
			);
	}
	else
	{
		pivot =
			pivot || tree.getPath( trg.path, -1 );

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
				universe.grow(
					pivot,
					key,
						src.val,
					'+',
						trg.rank, key
				);
		}
		else
		{
			orank =
				pivot.rankOf( key );

			trg =
				new Sign(
					trg,
					'rank',
						orank
				);

			pivot =
				universe.grow(
					pivot,
					key,
						src.val,
					'-',
						orank
				);
		}

		tree =
			tree.setPath(
				trg.path,
				pivot,
				universe,
				-1
			);
	}

	var chg;
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
| Change Operation: insert
|
| A string is inserted into a string item.
*/
Change.prototype.insert =
	function(
		tree,
		universe
	)
{
	var
		cm = 'change.insert',

		src =
			this.src,

		trg =
			this.trg;

	Jools.check(
		trg.path.reflect === 'Path',
		cm,
		'trg.path missing'
	);

	var
		str =
			tree.getPath( trg.path );

	Jools.check(
		Jools.isString( str ),
		cm,
		'trg.path signates no string'
	);

	// where trg span should end
	var tat2 =
		trg.at1 + src.val.length;

	trg =
		trg.affix(
			Jools.is,
			cm, 'trg',
			'at2',
				tat2
		);

	var nstr = (
		str.substring( 0, trg.at1 ) +
		src.val +
		str.substring( trg.at1 )
	);

	tree = tree.setPath(
		trg.path,
		nstr,
		universe
	);

	var chg;
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
| Change Operation: remove
|
| A part of a string item is removed.
*/
Change.prototype.remove =
	function(
		tree,
		universe
	)
{
	var
		cm =
			'change.remove',

		src =
			this.src,

		trg =
			this.trg;

	Jools.check(
		src.path.reflect === 'Path',
		cm,
		'src.path missing'
	);

	var str =
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

	var val =
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

	var nstr = (
		str.substring( 0, src.at1 ) +
		str.substring( src.at2 )
	);

	tree =
		tree.setPath(
			src.path,
			nstr,
			universe
		);

	var chg;
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
		tree,
		universe
	)
{
	var
		cm =
			'change.join',

		src =
			this.src,

		trg =
			this.trg,

		path =
			trg.path,

		at1 =
			trg.at1;

	Jools.check(
		Jools.is( at1 ),
		cm,
		'trg.at1 missing'
	);

	var
		text =
			tree.getPath( path );

	Jools.check(
		Jools.isString( text ),
		cm,
		'trg signates no text'
	);

	var
		key =
			path.get( -2 ),

		pivot =
			tree.getPath( path, -2 ),

		pattern =
			universe[ pivot.type ];

	Jools.check(
		pattern.ranks,
		cm,
		'pivot has no ranks'
	);

	var kn =
		pivot.rankOf( key );

	Jools.check(
		kn >= 0,
		cm,
		'invalid line key'
	);

	Jools.check(
		kn < pivot.ranks.length,
		cm,
		'cannot join last line'
	);

	var
		key2 =
			pivot.ranks[ kn + 1 ];

	var
		path2 =
			path.set( -2, key2 );

	src =
		src.affix(
			Jools.is,
			cm,
			'src', 'path',
			path2
		);

	var
		para1 =
			pivot.twig[ key  ],

		para2 =
			pivot.twig[ key2 ];

	// FIXME check other keys to be equal

	para1 =
		universe.grow(
			para1,
			'text',
				para1.twig.text +
				para2.twig.text
		);

	pivot =
		universe.grow(
			pivot,
			key,
				para1,
			key2,
				null,
			'-',
				kn + 1
		);

	tree =
		tree.setPath(
			path,
			pivot,
			universe,
			-2
		);

	var chg;

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
| Change Operation: split
|
| A text is split into two.
*/
Change.prototype.split =
	function(
		tree,
		universe
	)
{
	var
		cm =
			'change.split',

		src =
			this.src,

		trg =
			this.trg,

		path =
			src.path,

		at1 =
			src.at1,

		text =
			tree.getPath( path ),

		pivot =
			tree.getPath( path, -2 ),

		pattern =
			universe[ pivot.type ],

		vKey;

	Jools.check(
		Jools.isString( text ),
		cm,
		'src signates no text'
	);

	Jools.check(
		pattern.ranks,
		cm, 'pivot has no ranks'
	);

	if( Jools.is( trg.path ) )
	{
		vKey =
			trg.path.get( -2 );
	}
	else
	{
		vKey =
			pivot.newUID( );

		trg =
			new Sign(
				trg,
				'path',
					src.path.set( -2, vKey )
			);
	}

	Jools.check(
		!Jools.isnon( pivot.twig[ vKey ] ),
		cm,
		'newUID not vacant: ',
		vKey
	);

	var
		key =
			path.get( -2 ),

		kn =
			pivot.rankOf( key );

	Jools.check(
		kn >= 0,
		cm,
		'invalid line key'
	);

	var
		para1 =
			pivot.twig[ key ],

		para2 =
			universe.grow(
				para1,
				'text',
					text.substring( at1, text.length )
			);

	para1 =
		universe.grow(
			para1,
			'text',
				text.substring( 0, at1 )
		);

	pivot =
		universe.grow(
			pivot,
			key,
				para1,
			vKey,
				para2,
			'+',
				kn + 1, vKey
		);

	tree =
		tree.setPath(
			path,
			pivot,
			universe,
			-2
		);

	var
		chg;

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
| Change Operation: rank
|
| A tree's rank is changed.
*/
Change.prototype.rank =
	function(
		tree,
		universe
	)
{
	var cm  = 'change.rank';
	var src = this.src;
	var trg = this.trg;

	Jools.check(
		Jools.is(src.path),
		cm, 'src.path not present'
	);

	Jools.check(
		Jools.is(trg.rank),
		cm, 'trg.rank not present'
	);

	var
		pivot =
			tree.getPath(
				src.path,
				-1
			);

	Jools.check(
		Jools.is( pivot.ranks ),
		cm, 'pivot not an ranks'
	);

	var key = src.path.get( -1 );
	var orank = pivot.rankOf( key );

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
			cm, 'src',
			'rank', orank
		);

	trg =
		trg.affix(
			Jools.is,
			cm, 'trg',
			'path', src.path
		);

	pivot =
		universe.grow(
			pivot,
			'-',
				orank,
			'+',
				trg.rank, key
		);

	tree =
		tree.setPath(
			src.path,
			pivot,
			universe,
			-1
		);

	var chg;
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
