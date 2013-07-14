/*
| Meshcraft's basic data structure.
|
| Authors: Axel Kittenberger
*/


/*
| Imports
*/
var
	Jools,
	Path;


/*
| Exports
*/
var
	Tree =
		null;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| Node imports
*/
if( typeof( window ) === 'undefined' )
{
	Jools =
		require( './jools' );

	Path =
		require( './path' );
}


/*
| Returns true if the pattern specifier
| allows a value of type.
*/
var allowsType =
	function(
		pattern,
		type
	)
{
	// Integers are also Numbers
	if(
		type === 'Integer' &&
		allowsType( pattern, 'Number' )
	)
	{
		return true;
	}

	return (
		pattern === type ||
		(
			typeof( pattern === 'object' ) &&
			pattern[ type ]
		)
	);
};


Tree =
	function(
		tag,
		type,
		twig,
		ranks,
		verse
	)
{
	if( tag !== 'XOXO' )
	{
		throw new Error(
			'use grow instead of new'
		);
	}

	this.type =
		type;

	this.twig =
		twig;

	if( ranks )
	{
		this.ranks =
			ranks;
	}

	this.verse =
		verse;

	// marks this to be grown
	// data structure
	this._grown =
		true;

	Jools.immute( this );
};


/*
| Creates new (sub) trees.
*/
Tree.grow =
	function(
		model, // the model to copy
		verse
		//
		// additional arguments:
		//
		//    'key', value        sets [key] = value
		//    '+', key, value     inserts a key if this an array
		//    '-', key            removes a key if this an array
	)
{
	var
		a,
		aZ =
			arguments.length;

	// nothing to do?
	if( model._grown && aZ === 1 )
	{
		return model;
	}

	var
		twig =
			null,

		ranks =
			null,

		type =
			Tree.getType( model ),

		k,
		k1,
		k2,
		val;

	Jools.log(
		'tree',
		type,
		arguments
	);

	var
		pattern =
			verse[ type ];

	if( !pattern )
	{
		throw Jools.reject(
			'cannot create tree of type: ' + type
		);
	}

	twig =
		Jools.copy(
			model.twig ? model.twig : model,
			{ }
		);

	if( pattern.ranks )
	{
		ranks =
			model.ranks ?
				model.ranks.slice( ) :
				[ ];
	}

	// applies changes specified by the arguments
	a = 2;

	while( a < aZ )
	{
		k =
			arguments[ a ];

		k1 =
			arguments[ a + 1 ];

		switch( k )
		{
			case '+' :

				if( !pattern.ranks )
				{
					throw Jools.reject(
						'"+": ' + type + ' has no ranks'
					);
				}

				k2 =
					arguments[ a + 2 ];

				if( !Jools.isInteger( k1 ) )
				{
					throw Jools.reject(
						'"+": key must be an Integer'
					);
				}

				if( !Jools.isString( k2 ) )
				{
					throw Jools.reject(
						'"+": value must be a String'
					);
				}

				ranks.splice( k1, 0, k2 );

				a += 3;

				break;

			case '-' :

				if( !pattern.ranks )
				{
					throw Jools.reject(
						'"-": ' + type + ' has no ranks'
					);
				}

				if( !Jools.isInteger( k1 ) )
				{
					throw Jools.reject(
						'"-": key must be an Integer'
					);
				}

				ranks.splice( k1, 1 );

				a += 2;

				break;

			default  :

				if( Jools.isInteger( k ) )
				{
					if( !pattern.ranks )
					{
						throw Jools.reject(
							'"' + k + '": ' +
							type + ' has no ranks'
						);
					}

					ranks[ k ] =
						k1;
				}
				else
				{
					if( !Jools.isString( k ) )
					{
						throw Jools.reject(
							'"' + k +'": ' +
							'is neither String or Integer'
						);
					}

					twig[ k ] =
						k1;
				}

				a += 2;

				break;
		}
	}

	if( a < aZ )
	{
		if( !pattern.ranks )
		{
			throw Jools.reject(
				'"' + arguments[a] + '": ' +
				type + ' has no ranks'
			);
		}

		if(
			arguments[ a ] === '--' ||
			arguments[ a ] === '++'
		)
		{
			throw new Error(
				'++/-- no longer supported'
			);
		}

		if( a < aZ ) // TODO CHECK
		{
			throw new Error(
				'a < aZ should never happen here'
			);
		}
	}

	// grows the subtrees
	var
		klen =
			0;

	for( k in twig )
	{
		if(
			// TODO does not own property ever happen?
			!Object.hasOwnProperty.call( twig, k ) ||
			k === 'type'
		)
		{
			continue;
		}

		if( !Jools.isString( k ) )
		{
			throw Jools.reject(
				'key of twig no String: ' + k
			);
		}

		val =
			twig[ k ];

		if( val === null )
		{
			delete twig[ k ];

			continue;
		}

		klen++;

		var
			vtype =
				Tree.getType( val ),

			ptype =
				pattern.twig ||
				( pattern.must && pattern.must[ k ] )
				||
				( pattern.can && pattern.can[ k ] );

		if( !ptype )
		{
			throw Jools.reject(
				type + ' does not allow key: ' + k
			);
		}

		// TODO fix in getType
		if(
			vtype === 'Number' &&
			Jools.isInteger( val )
		)
		{
			vtype =
				'Integer';
		}

		// grows non basic types

		switch( vtype )
		{
			case 'Boolean' :
			case 'String' :
			case 'Integer' :
			case 'Number' :

				break;

			default :

				if( !val._$grown )
				{
					twig[ k ] =
						Tree.grow(
							twig[ k ],
							verse
						);
				}
		}

		if( !allowsType( ptype, vtype ) )
		{
			throw Jools.reject(
				type + '.' + k + ' must be ' + ptype +
				' but is ' +
				vtype + ' (' + val + ')'
			);
		}
	}

	// tests if all keys that must be there are there
	if( pattern.must )
	{
		for( k in pattern.must )
		{
			if( !Jools.isnon( twig[ k ] ) )
			{
				throw Jools.reject(
					type + ' requires "' + k + '"'
				);
			}
		}
	}

	// tests the ranks
	if( pattern.ranks )
	{
		aZ =
			ranks.length;

		if( aZ !== Object.keys( ranks ).length )
		{
			throw Jools.reject(
				'ranks not a sequence'
			);
		}

		if( aZ !== klen )
		{
			throw Jools.reject(
				'ranks length does not match to twig'
			);
		}

		for( a = 0; a < aZ; a++ )
		{
			k =
				ranks[ a ];

			if( !Jools.is( twig[ k ] ) )
			{
				throw new Error(
					'twig misses ranks value: ' + k
				);
			}
		}
	}

	return (
		new Tree(
			'XOXO',
			type,
			twig,
			ranks,
			verse
		)
	);
};


/*
| Gets the node a path leads to.
*/
Tree.prototype.getPath =
	function(
		path,
		shorten
	)
{
	if( !Path.isPath( path ) ) // TODO CHECK
	{
		throw new Error(
			'not a path.'
		);
	}

	if( shorten < 0 )
	{
		shorten +=
			path.length;
	}

	if( shorten < 0 )
	{
		throw new Error( 'getPath invalid shorten' );
	}

	var
		aZ =
			Jools.is( shorten ) ? shorten : path.length,

		tree =
			this;

	for(
		var a = 0;
		a < aZ;
		a++
	)
	{
		if( !Jools.isnon( tree ) )
		{
			return null;
		}

		tree =
			tree.twig[ path.get( a ) ];
	}

	return tree;
};


/*
| Returns a tree where the node pointed by path is replaced by val.
*/
Tree.prototype.setPath =
	function(
		path,
		val,
		shorten
	)
{
	if( !Path.isPath( path ) )
	{
		throw new Error( 'no path' );
	}

	if( shorten < 0 )
	{
		shorten +=
			path.length;
	}

	if( shorten < 0 )
	{
		throw new Error( 'invalid shorten' );
	}

	var
		aZ =
		Jools.is( shorten ) ? shorten : path.length;

	for(
		var a = aZ - 1;
		a >= 0;
		a--
	)
	{
		var
			tree =
				this.getPath(
					path,
					a
				);

		val =
			Tree.grow(
				tree,
				this.verse,
				path.get( a ),
				val
			);
	}

	return val;
};


/*
| Returns the rank of the key
| That means it returns the index of key in the ranks array.
*/
Tree.prototype.rankOf =
	function(
		key
	)
{
	var
		ranks =
			this.ranks;

	if( !Jools.isArray( ranks ) )
	{
		throw new Error(
			'tree has no ranks'
		);
	}

	if( !Jools.isString( key ) )
	{
		throw new Error(
			'key no string'
		);
	}

	// checks ranking cache
	var rof =
		this._$rof;

	if( !rof )
	{
		Object.defineProperty(
			this,
			'_$rof',
			rof = { }
		);
	}

	var r =
		rof[ key ];

	if( Jools.is( r ) )
	{
		return r;
	}

	var
		rank =
		rof[ key ] =
			Jools.is( this.twig[ key ] ) ?
				ranks.indexOf( key ) :
				-1;

	return rank;
};


/*
| Returns length of the twig
*/
Jools.lazyFixate(
	Tree.prototype,
	'length',
	function( )
	{
		return this.ranks.length;
	}
);


/*
| Creates a new unique identifier
*/
Tree.prototype.newUID =
	function( )
{
	var u =
		Jools.uid( );

	return (
		( !Jools.is( this.twig[ u ] ) ) ?
			u :
			this.newUID( )
	);
};


/*
| Returns the tree type.
*/
Tree.getType =
	function( o )
{
	switch( o.constructor )
	{

		case Array :
			return 'Array';

		case Boolean :
			return 'Boolean';

		case Number :
			return 'Number';

		case String :
			return 'String';

		default :
			return o.type ? o.type : o.twig.type;
	}
};

/*
| Returns the pattern for object o.
*/
Tree.prototype.getPattern =
	function(
		o
	)
{
	return this.verse[ Tree.getType( o ) ];
};

/*
| Node export
*/
if( typeof( window ) === 'undefined')
{
	module.exports =
		Tree;
}

} )( );

