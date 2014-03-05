/*
| Meshcraft tree patterns.
|
| Authors: Axel Kittenberger
*/


/*
| Imports
*/
var
	Euclid,
	Jools,
	Tree,
	Visual;


/*
| Exports
*/
var
	Meshverse,
	meshverse;


/*
| Capsule
*/
( function( ) {
"use strict";


/*
| Node imports.
*/
if( SERVER )
{
	Jools =
		require( '../jools/jools' );

	Tree =
		require( './tree' );

	Euclid =
		{
			Point :
				require( '../euclid/point' ),

			Rect :
				require( '../euclid/rect' )
		};

	Visual =
		{
			Para :
				require( '../visual/para' )
		};
}


/*
| The meshcraft universe
*/
Meshverse =
	function( )
{

};


/*
| Returns true if the pattern specifier
| allows a value of type.
*/
var
allowsType =
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
| Creates new (sub) trees.
*/
Meshverse.prototype.grow =
	function(
		model // the model to copy
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
	if(
		( model instanceof Tree ) &&
		aZ === 1
	)
	{
		return model;
	}

	var
		twig =
			null,

		ranks =
			null,

		type,
		k,
		k1,
		k2,
		val;

	if( Jools.isString( model ) )
	{
		type =
			model;
	}
	else
	{
		type =
			Tree.getType( model );
	}

	Jools.log(
		'tree',
		type,
		arguments
	);

	var
		pattern =
			this[ type ];

	if( !pattern )
	{
		throw new Error(
			'cannot create tree of type: ' + type
		);
	}

	if( Jools.isString( model ) )
	{
		twig =
			{ };
	}
	else if( model.twig )
	{
		twig =
			Jools.copy( model.twig );
	}
	else
	{
		twig =
			Jools.copy( model );
	}

	// new style creation
	if(
		pattern.create
		&&
		pattern.prototype.reflect === type
	)
	{
		if( !model.create )
		{
			model =
				pattern.createFromJSON( model );
		}

		if( arguments.length > 1 )
		{
			var
				args =
					Array.prototype.slice.call( arguments );

			args.splice( 0, 1 );

			model =
				model.create.apply(
					model,
					args
				);
		}

		return model;
	}

	if( pattern.ranks )
	{
		ranks =
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
					throw new Error(
						'"+": ' + type + ' has no ranks'
					);
				}

				k2 =
					arguments[ a + 2 ];

				if( !Jools.isInteger( k1 ) )
				{
					throw new Error(
						'"+": key must be an Integer'
					);
				}

				if( !Jools.isString( k2 ) )
				{
					throw new Error(
						'"+": value must be a String'
					);
				}

				ranks.splice( k1, 0, k2 );

				a += 3;

				break;

			case '-' :

				if( !pattern.ranks )
				{
					throw new Error(
						'"-": ' + type + ' has no ranks'
					);
				}

				if( !Jools.isInteger( k1 ) )
				{
					throw new Error(
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
						throw new Error(
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
						throw new Error(
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
			throw new Error(
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

		if( CHECK )
		{
			if( a < aZ )
			{
				throw new Error(
					'a < aZ should never happen here'
				);
			}
		}
	}

	// grows the subtrees
	var
		klen =
			0;

	for( k in twig )
	{
		if(
			// FIXME does not own property ever happen?
			!Object.hasOwnProperty.call( twig, k ) ||
			k === 'type'
		)
		{
			continue;
		}

		if( !Jools.isString( k ) )
		{
			throw new Error(
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
				pattern.twig
				||
				( pattern.must && pattern.must[ k ] )
				||
				( pattern.can && pattern.can[ k ] );

		if( !ptype )
		{
			throw new Error(
				type + ' does not allow key: ' + k
			);
		}

		// FIXME fix in getType
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
						this.grow( twig[ k ] );
				}
		}

		/*
		TODO
		if( !allowsType( ptype, vtype ) )
		{
			throw new Error(
				type + '.' + k + ' must be ' + ptype +
				' but is ' +
				vtype + ' (' + val + ')'
			);
		}
		*/
	}

	// tests if all keys that must be there are there
	if( pattern.must )
	{
		for( k in pattern.must )
		{
			if( !Jools.isnon( twig[ k ] ) )
			{
				throw new Error(
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
			throw new Error(
				'ranks not a sequence'
			);
		}

		if( aZ !== klen )
		{
			throw new Error(
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
			'TREE',
			type,
			twig,
			ranks
		)
	);
};


Meshverse.prototype.Space =
	Jools.immute( {
		twig :
			Jools.immute ( {
				'Label' :
					true,
				'Note' :
					true,
				'Portal' :
					true,
				'Relation' :
					true
		} ),
		ranks :
			true
	} );


Meshverse.prototype.Note =
	Jools.immute( {
		must :
			Jools.immute( {
				'doc' :
					'Doc',
				'zone' :
					'Rect',
				'fontsize' :
					'Number'
			} )
	} );

Meshverse.prototype.Portal =
	Jools.immute( {
		must :
			Jools.immute( {
				'zone' :
					'Rect',
				'spaceUser' :
					'String',
				'spaceTag' :
					'String'
			} )
	} );


Meshverse.prototype.Label =
	Jools.immute( {

		must :
			Jools.immute( {

				'doc' :
					'Doc',

				'pnw' :
					'Point',

				'fontsize' :
					'Number'

			} )

	} );


Meshverse.prototype.Relation =
	Jools.immute( {
		must :
			Jools.immute( {
				'doc' :
					'Doc',
				'pnw' :
					'Point',
				'item1key' :
					// 'Key', FIXME
					'String',
				'item2key' :
					// 'Key', FIXME
					'String',
				'fontsize' :
					'Number'
			} )
	} );


Meshverse.prototype.Doc =
	Jools.immute( {
		twig :
			Jools.immute( {
				'Para' :
					true
			} ),
		ranks :
			true
	} );


Meshverse.prototype.Para =
	Visual.Para;
	/*
	Jools.immute( {
		must :
			Jools.immute( {
				'text' :
					'String'
			} )
	} );
	*/

Meshverse.prototype.Rect =
	Euclid.Rect;


Meshverse.prototype.Point =
	Euclid.Point;


meshverse =
	new Meshverse( );


/*
| Node export
*/
if( SERVER )
{
	module.exports =
		meshverse;
}

} )( );

