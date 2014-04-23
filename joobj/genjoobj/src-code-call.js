/*
| This is an auto generated file.
|
| DO NOT EDIT!
*/


/*
| Export.
*/
var
	Code =
		Code || { };


/*
| Imports.
*/
var
	JoobjProto,
	Jools;


/*
| Capulse.
*/
( function( ) {
'use strict';


/*
| Node includes.
*/
if( SERVER )
{
	JoobjProto =
		require( '../../src/joobj/proto' );

	Jools =
		require( '../../src/jools/jools' );

	Code =
		{ };

	Code.Or =
		require(
			'../../src/code/or'
		);

	Code.Term =
		require(
			'../../src/code/term'
		);

	Code.Var =
		require(
			'../../src/code/var'
		);
}


/*
| Constructor.
*/
var Call =
Code.Call =
	function(
		tag, // magic cookie
		twig, // twig
		ranks, // twig ranks
		v_func // the function to call
	)
{
/**/if( CHECK )
/**/{
/**/	if( tag !== 8833 )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	this.func =
		v_func;

	this.twig =
		twig;

	this.ranks =
		ranks;

	Jools.immute( this );

	Jools.immute( twig );

	Jools.immute( ranks );
};


/*
| Creates a new Call object.
*/
Call.Create =
Call.prototype.Create =
	function(
		// free strings
	)
{
	var
		inherit,
		key,
		rank,
		ranks,
		twig,
		twigDup,
		v_func;

	if( this !== Call )
	{
		inherit =
			this;

		twig =
			inherit.twig;

		ranks =
			inherit.ranks;

		twigDup =
			false;

		v_func =
			this.func;
	}
	else
	{
		twig =
			{ };

		ranks =
			[ ];

		twigDup =
			true;
	}

	for(
		var a = 0, aZ = arguments.length;
		a < aZ;
		a += 2
	)
	{
		var
			arg =
				arguments[ a + 1 ];

		switch( arguments[ a ] )
		{
			case 'func' :

				if( arg !== undefined )
				{
					v_func =
						arg;
				}

				break;

			case 'twig:add' :

				if( !twigDup )
				{
					twig =
						Jools.copy(
							twig
						);

					ranks =
						ranks.slice( );

					twigDup =
						true;
				}

				key =
					arg;

				arg =
					arguments[ ++a + 1 ];

				if( twig[ key ] !== undefined  )
				{
					throw new Error( 'key "' + key + '" already in use' );
				}

				twig[ key ] =
					arg;

				ranks.push( key );

				break;

			case 'twig:set' :

				if( !twigDup )
				{
					twig =
						Jools.copy(
							twig
						);

					ranks =
						ranks.slice( );

					twigDup =
						true;
				}

				key =
					arg;

				arg =
					arguments[ ++a + 1 ];

				if( twig[ key ] === undefined  )
				{
					throw new Error( 'key "' + key + '" not in use' );
				}

				twig[ key ] =
					arg;

				break;

			case 'twig:insert' :

				if( !twigDup )
				{
					twig =
						Jools.copy(
							twig
						);

					ranks =
						ranks.slice( );

					twigDup =
						true;
				}

				key =
					arg;

				rank =
					arguments[ a + 2 ];

				arg =
					arguments[ a + 3 ];

				a += 2;

				if( twig[ key ] !== undefined  )
				{
					throw new Error( 'key "' + key + '" already in use' );
				}

				if( rank < 0 || rank > ranks.length )
				{
					throw new Error( 'invalid rank' );
				}

				twig[ key ] =
					arg;

				ranks.splice(
					rank,
					0,
					key
				);

				break;

			case 'twig:remove' :

				if( !twigDup )
				{
					twig =
						Jools.copy(
							twig
						);

					ranks =
						ranks.slice( );

					twigDup =
						true;
				}

				if( twig[ arg ] === undefined  )
				{
					throw new Error( 'key "' + arg + '" not in use' );
				}

				delete twig[ arg ];

				ranks.splice(
					ranks.indexOf( arg ),
					1
				);

				break;

			default :

/**/			if( CHECK )
/**/			{
/**/				throw new Error( 'invalid argument' );
/**/			}
		}
	}

/**/if( CHECK )
/**/{
/**/	if( v_func === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute func' );
/**/	}
/**/
/**/	if( v_func === null )
/**/	{
/**/		throw new Error( 'attribute func must not be null.' );
/**/	}
/**/}

	if(
		inherit
		&&
		!twigDup
		&&
		v_func === inherit.func
	)
	{
		return inherit;
	}

	return (
		new Call(
			8833,
			twig,
			ranks,
			v_func
		)
	);
};


/*
| Reflection.
*/
Call.prototype.reflect =
	'Call';


/*
| Sets values by path.
*/
Call.prototype.setPath =
	JoobjProto.setPath;


/*
| Gets values by path
*/
Call.prototype.getPath =
	JoobjProto.getPath;


/*
| Returns a twig by rank.
*/
Call.prototype.atRank =
	JoobjProto.atRank;


/*
| Gets the rank of a key.
*/
Call.prototype.rankOf =
	JoobjProto.rankOf;


/*
| Creates a new unique identifier.
*/
Call.prototype.newUID =
	JoobjProto.newUID;


/*
| Tests equality of object.
*/
Call.prototype.equals =
	function(
		obj // object to compare to
	)
{
	if( this === obj )
	{
		return true;
	}

	if( !obj )
	{
		return false;
	}

	return this.func === obj.func;
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports =
		Call;
}


} )( );
