/*
| The base of all meshcraft twigs.
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
	Twig =
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


/*
| Constructor
*/
Twig =
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

	// marks the object to be fine
	// FIXME this isnt so nice
	Object.defineProperty(
		this,
		'verse',
		{
			value :
				verse
		}
	);

	// nothing to do?
	if( model._$grown && aZ === 1 )
	{
		return model;
	}

	var
		copse =
			null,

		ranks =
			null,

		type =
			Twig.getType( model ),
		k,
		k1,
		k2,
		val;

	Jools.log(
		'grow',
		type,
		arguments
	);

	var
		pattern =
			verse[ type ];

	if( !pattern )
	{
		throw Jools.reject(
			'cannot create twig of type: ' + type
		);
	}

	// copies the model
	Jools.copy(
		model,
		this
	);

	if( pattern.copse )
	{
		copse =
		this.copse =
			model.copse ?
				Jools.copy( model.copse, { } ) :
				{ };
	}

	if( pattern.ranks )
	{
		ranks =
		this.ranks =
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

				this.ranks.splice( k1, 0, k2 );

				a += 3;

				break;

			case '-' :

				if( !pattern.ranks )
				{
					throw Jools.reject(
						'"-": '+type+' has no ranks'
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

					if( pattern.copse )
					{
						copse[ k ] =
							k1;
					}
					else
					{
						this[ k ] =
							k1;
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

	// grows the subtwigs
	var
		klen =
			0;

	if( pattern.copse )
	{
		for( k in copse )
		{
			if( !Object.hasOwnProperty.call( copse, k ) )
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
				copse[ k ];

			if( val === null )
			{
				delete copse[ k ];

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
				copse[ k ] =
					new Twig(
						copse[ k ],
						verse
					);
			}
		}
	}
	else
	{
		for( k in this )
		{
			if( !Object.hasOwnProperty.call( this, k ) )
			{
				continue;
			}

			if( k === 'type' || k === 'verse' )
			{
				continue;
			}

			val =
				this[ k ];

			if( val === null )
			{
				delete this[ k ];

				continue;
			}

			klen++;

			var
				vtype =
					Twig.getType( val ),

				ptype =
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
						this[ k ] =
							new Twig(
								this[ k ],
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
	}

	// tests if all keys that must be there are there

	if( pattern.must )
	{
		for( k in pattern.must )
		{
			if( !Jools.isnon( this[ k ] ) )
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
				'ranks length does not match to copse'
			);
		}

		for( a = 0; a < aZ; a++ )
		{
			k =
				ranks[ a ];

			if( !Jools.is( copse[ k ] ) )
			{
				throw new Error(
					'copse misses ranks value: ' + k
				);
			}
		}
	}

	// marks the object to be fine
	Object.defineProperty(
		this,
		'_$grown',
		{
			value : true
		}
	);

	Jools.immute( this );
};


/*
| Gets the node a path leads to.
*/
Twig.prototype.getPath =
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

		twig =
			this;

	for(
		var a = 0;
		a < aZ;
		a++
	)
	{
		if( !Jools.isnon( twig ) )
		{
			return null;
		}

		if( this.verse[ Twig.getType( twig ) ].copse )
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
Twig.prototype.setPath =
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
			twig =
				this.getPath(
					path,
					a
				);

		val =
			new Twig(
				twig,
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
Twig.prototype.rankOf =
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
			'twig has no ranks'
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

	var rank =
	rof[ key ] =
		Jools.is( this.copse[ key ] ) ?
			ranks.indexOf( key ) :
			-1;

	return rank;
};


/*
| Returns length of a copse
*/
Jools.lazyFixate(
	Twig.prototype,
	'length',
	function( )
	{
		return this.ranks.length;
	}
);


/*
| Creates a new unique identifier
*/
Twig.prototype.newUID =
	function( )
{
	var u =
		Jools.uid( );

	return (
		( !Jools.is( this.copse[ u ] ) ) ?
			u :
			this.newUID( )
	);
};


/*
| Returns the twig type.
*/
Twig.getType =
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

		return o.type;
	}
};

/*
| Returns the pattern for object o.
*/
Twig.prototype.getPattern =
	function(
		o
	)
{
	return this.verse[ Twig.getType( o ) ];
};

/*
| Node export
*/
if( typeof( window ) === 'undefined')
{
	module.exports =
		Twig;
}

} )( );

