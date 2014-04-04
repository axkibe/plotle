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
	Jools,
	Code;


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

	Code.Term =
		require(
			'../../src/code/term'
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
/**/	if( tag !== 129335932 )
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
Call.create =
Call.prototype.create =
	function(
		 // free strings
	)
{
	var
		inherit,
		key,
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
/**/
/**/	if( v_func.reflect !== 'Term' )
/**/	{
/**/		throw new Error( 'type mismatch' );
/**/	}
/**/}

	if(
		inherit
		&&
		 !twigDup
		&&
		v_func.equals(
			inherit.func
		)
	)
	{
		return inherit;
	}

	return (
		new Call(
			129335932,
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
