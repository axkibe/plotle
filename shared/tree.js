/*
| The tree is Meshcraft's basic data structure.
|
| Authors: Axel Kittenberger
|
| FIXME: integreate tree and twig to be only one thing
*/


/*
| Imports
*/
var
	Jools,
	Path,
	Twig;


/*
| Exports
*/
var Tree =
	null;


/*
| Capsule
*/
( function( ) {
"use strict";


/*
| Node imports
*/
if( typeof( window ) === 'undefined' )
{
	Jools =
		require( './jools' );

	Path =
		require( './path' );

	Twig =
		require( './twig' );
}


/*
| Constructor.
*/
Tree =
	function(
		root,
		pattern
	)
{
	if( !Jools.isnon( pattern ) )
	{
		throw new Error( 'fail' );
	}

	this.pattern =
		pattern;

	this.root =
		this.grow( root );
};


/*
| Returns the pattern for object o.
*/
Tree.prototype.getPattern =
	function( o )
{
	return this.pattern[ Twig.getType( o ) ];
};


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


/*
| Grows new twigs.
|
| The model is copied and extended by additional arguments.
|
| mandatory arguments:
|
*/
Tree.prototype.grow =
	function(
		model // the model to copy
		//
		// additional arguments:
		//
		//    'key', value        sets [key] = value
		//    '+', key, value     inserts a key if this an array
		//    '-', key            removes a key if this an array
		//    '--', count         shortens an array by count.
		//    '++', values...     for an array everything after '++' is extended.
	)
{
	var
		a,
		aZ =
			arguments.length;

	// nothing to do?
	if( model._$grown && aZ === 1 )
	{
		return model;
	}

	var
		twig,
		k,
		k1,
		k2,
		val;

	var
		type =
			Twig.getType( model );

	Jools.log( 'grow', type, arguments );

	var
		pattern =
			this.pattern[ type ];

	if( !pattern )
	{
		throw Jools.reject( 'cannot grow type: ' + type );
	}

	// copies the model
	twig =
		Jools.copy(
			model,
			new Twig( )
		);

	if( pattern.copse )
	{
		twig.copse =
			model.copse ?
				Jools.copy( model.copse, { } ) :
				{ };
	}

	if( pattern.ranks )
	{
		twig.ranks =
			model.ranks ?
				model.ranks.slice( ) :
				[ ];
	}

	// applies changes specified by the arguments
	a = 1;
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
					throw Jools.reject( '"+": ' + type + ' has no ranks' );
				}

				k2 =
					arguments[ a + 2 ];

				if( !Jools.isInteger( k1 ) )
				{
					throw Jools.reject( '"+": key must be an Integer' );
				}

				if( !Jools.isString( k2 ) )
				{
					throw Jools.reject( '"+": value must be a String' );
				}

				twig.ranks.splice( k1, 0, k2 );

				a += 3;

				break;

			case '-' :

				if( !pattern.ranks )
				{
					throw Jools.reject( '"-": '+type+' has no ranks' );
				}

				if( !Jools.isInteger( k1 ) )
				{
					throw Jools.reject( '"-": key must be an Integer' );
				}

				twig.ranks.splice( k1, 1 );

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

					twig.ranks[k] = k1;
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

					if (pattern.copse)
					{
						twig.copse[ k ] = k1;
					}
					else
					{
						twig[ k ] = k1;
					}
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
			arguments[a] === '++'
		{
			throw new Error(
				'++/-- no longer supported'
			);
		}

		if (a < aZ)
		{
			throw Jools.reject( 'a < aZ should never happen here' );
		}
	}

	// grows the subtwigs
	var
		klen =
			0;

	if( pattern.copse )
	{
		for( k in twig.copse )
		{
			if( !Object.hasOwnProperty.call( twig.copse, k ) )
			{
				continue;
			}

			if( !Jools.isString( k ) )
			{
				throw Jools.reject(
					'key of copse no String: ' + k
				);
			}

			val =
				twig.copse[ k ];

			if( val === null )
			{
				delete twig.copse[ k ];

				continue;
			}

			klen++;

			if( !pattern.copse[ Twig.getType( val ) ] )
			{
				throw Jools.reject(
					type + '.copse does not allow ' + val.type
				);
			}

			switch( val.constructor )
			{
				case Boolean :

					throw new Error(
						'.copse does not allow native Boolean'
					);

				case Number :

					throw new Error(
						'.copse does not allow native Number'
					);

				case String :

					throw new Error(
						'.copse does not allow native String'
					);
			}

			if( !val._$grown )
			{
				twig.copse[ k ] =
					this.grow( twig.copse[ k ] );
			}
		}
	}
	else
	{
		for( k in twig )
		{
			if( !Object.hasOwnProperty.call( twig, k ) )
			{
				continue;
			}

			if( !Jools.isString( k ) )
			{
				throw Jools.reject( 'key of twig is no String: ' + k );
			}

			if( k === 'type' )
			{
				continue;
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
					Twig.getType( val );

			var ptype =
				( pattern.must && pattern.must[ k ] )
				||
				( pattern.can && pattern.can[ k ] );

			if( !ptype )
			{
				throw Jools.reject(
					type + ' does not allow key: ' + k
				);
			}

			if(
				vtype === 'Number' &&
				Jools.isInteger( val )
			)
			{
				vtype = 'Integer';
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
						twig[ k ] = this.grow( twig[ k ] );
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
			twig.ranks.length;

		if( aZ !== Object.keys( twig.ranks ).length )
		{
			throw Jools.reject( 'ranks not a sequence' );
		}

		if( aZ !== klen )
		{
			throw Jools.reject( 'ranks length does not match to copse' );
		}

		for (a = 0; a < aZ; a++)
		{
			k = twig.ranks[ a ];

			if( !Jools.is( twig.copse[ k ] ) )
			{
				throw new Error( 'copse misses ranks value: ' + k );
			}
		}
	}

	// marks the object to be fine
	Object.defineProperty(
		twig,
		'_$grown',
		{
			value : true
		}
	);

	return Jools.immute( twig );
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
	if( !Path.isPath( path ) )
	{
		throw new Error( 'getPath not a path.' );
	}

	if( shorten < 0 )
	{
		shorten += path.length;
	}

	if( shorten < 0 )
	{
		throw new Error( 'getPath invalid shorten' );
	}

	var
		aZ =
			Jools.is( shorten ) ? shorten : path.length,

		twig =
			this.root;

	for( var a = 0; a < aZ; a++ )
	{
		if (!Jools.isnon(twig))
			{ return null; }

		if ( this.pattern[ Twig.getType( twig ) ].copse )
		{
			twig =
				twig.copse [ path.get( a ) ];
		}
		else
		{
			twig =
				twig [ path.get( a ) ];
		}
	}

	return twig;
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
		throw new Error( 'Tree.get no path' );
	}

	if( shorten < 0 )
	{
		shorten += path.length;
	}

	if( shorten < 0 )
	{
		throw new Error( 'getPath invalid shorten' );
	}

	var aZ = Jools.is( shorten ) ? shorten : path.length;

	for( var a = aZ - 1; a >= 0; a-- )
	{
		var twig =
			this.getPath( path, a );

		val =
			this.grow(
				twig,
				path.get( a ),
				val
			);
	}

	return new Tree( val, this.pattern );
};


/*
| Node export
*/
if( typeof( window ) === 'undefined' )
{
	module.exports = Tree;
}

})( );

