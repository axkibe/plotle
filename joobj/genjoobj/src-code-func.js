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

	Code.FuncArg =
		require( '../../src/code/func-arg' );
}


/*
| Constructor.
*/
var Func =
Code.Func =
	function(
		tag, // magic cookie
		twig, // twig
		ranks, // twig ranks
		v_block // function code
	)
{
/**/if( CHECK )
/**/{
/**/	if( tag !== 8833 )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	this.block =
		v_block;

	this.twig =
		twig;

	this.ranks =
		ranks;

	Jools.immute( this );

	Jools.immute( twig );

	Jools.immute( ranks );
};


/*
| Creates a new Func object.
*/
Func.Create =
Func.prototype.Create =
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
		v_block;

	if( this !== Func )
	{
		inherit =
			this;

		twig =
			inherit.twig;

		ranks =
			inherit.ranks;

		twigDup =
			false;

		v_block =
			this.block;
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
			case 'block' :

				if( arg !== undefined )
				{
					v_block =
						arg;
				}

				break;

			case 'twig:add' :

				if( !twigDup )
				{
					twig =
						Jools.copy( twig );

					ranks =
						ranks.slice( );

					twigDup =
						true;
				}

				key =
					arg;

				arg =
					arguments[ ++a + 1 ];

				if( twig[ key ] !== undefined )
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
						Jools.copy( twig );

					ranks =
						ranks.slice( );

					twigDup =
						true;
				}

				key =
					arg;

				arg =
					arguments[ ++a + 1 ];

				if( twig[ key ] === undefined )
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
						Jools.copy( twig );

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

				a =
					a + 2;

				if( twig[ key ] !== undefined )
				{
					throw new Error( 'key "' + key + '" already in use' );
				}

				if( rank < 0 || rank > ranks.length )
				{
					throw new Error( 'invalid rank' );
				}

				twig[ key ] =
					arg;

				ranks.splice( rank, 0, key );

				break;

			case 'twig:remove' :

				if( !twigDup )
				{
					twig =
						Jools.copy( twig );

					ranks =
						ranks.slice( );

					twigDup =
						true;
				}

				if( twig[ arg ] === undefined )
				{
					throw new Error( 'key "' + arg + '" not in use' );
				}

				delete twig[ arg ];

				ranks.splice( ranks.indexOf( arg ), 1 );

				break;

			default :

/**/			if( CHECK )
/**/			{
/**/				throw new Error( 'invalid argument' );
/**/			}
		}
	}

	if( v_block === undefined )
	{
		v_block =
			null;
	}

/**/if( CHECK )
/**/{
/**/	if( v_block === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute block' );
/**/	}
/**/
/**/	if( v_block !== null )
/**/	{
/**/		if( v_block.reflect !== 'Block' )
/**/		{
/**/			throw new Error( 'type mismatch' );
/**/		}
/**/	}
/**/}

	if(
		inherit
		&&
		!twigDup
		&&
		(
			v_block === inherit.block
			||
			v_block && v_block.equals( inherit.block )
		)
	)
	{
		return inherit;
	}

	return new Func( 8833, twig, ranks, v_block );
};


/*
| Reflection.
*/
Func.prototype.reflect =
	'Func';


/*
| Sets values by path.
*/
Func.prototype.setPath =
	JoobjProto.setPath;


/*
| Gets values by path
*/
Func.prototype.getPath =
	JoobjProto.getPath;


/*
| Returns a twig by rank.
*/
Func.prototype.atRank =
	JoobjProto.atRank;


/*
| Gets the rank of a key.
*/
Func.prototype.rankOf =
	JoobjProto.rankOf;


/*
| Creates a new unique identifier.
*/
Func.prototype.newUID =
	JoobjProto.newUID;


/*
| Tests equality of object.
*/
Func.prototype.equals =
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

	return (
		this.block === obj.block
		||
		this.block !== null && this.block.equals( obj.block )
	);
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports =
		Func;
}


} )( );
