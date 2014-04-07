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
var ObjLiteral =
Code.ObjLiteral =
	function(
		tag, // magic cookie
		twig, // twig
		ranks, // twig ranks
		v_path // the path
	)
{
/**/if( CHECK )
/**/{
/**/	if( tag !== 34024298 )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	this.path =
		v_path;

	this.twig =
		twig;

	this.ranks =
		ranks;

	Jools.immute( this );

	Jools.immute( twig );

	Jools.immute( ranks );
};


/*
| Creates a new ObjLiteral object.
*/
ObjLiteral.create =
ObjLiteral.prototype.create =
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
		v_path;

	if( this !== ObjLiteral )
	{
		inherit =
			this;

		twig =
			inherit.twig;

		ranks =
			inherit.ranks;

		twigDup =
			false;

		v_path =
			this.path;
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
			case 'path' :

				if( arg !== undefined )
				{
					v_path =
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

	if( v_path === undefined )
	{
		v_path =
			null;
	}

/**/if( CHECK )
/**/{
/**/	if( v_path === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute path' );
/**/	}
/**/
/**/	if( v_path !== null )
/**/	{
/**/		if( v_path.reflect !== 'Path' )
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
		(v_path === inherit.path||(v_path&&v_path.equals( inherit.path)))
	)
	{
		return inherit;
	}

	return (
		new ObjLiteral(
			34024298,
			twig,
			ranks,
			v_path
		)
	);
};


/*
| Reflection.
*/
ObjLiteral.prototype.reflect =
	'ObjLiteral';


/*
| Sets values by path.
*/
ObjLiteral.prototype.setPath =
	JoobjProto.setPath;


/*
| Gets values by path
*/
ObjLiteral.prototype.getPath =
	JoobjProto.getPath;


/*
| Returns a twig by rank.
*/
ObjLiteral.prototype.atRank =
	JoobjProto.atRank;


/*
| Tests equality of object.
*/
ObjLiteral.prototype.equals =
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

	return (this.path === obj.path ||(this.path !== null && this.path.equals( obj.path )));
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports =
		ObjLiteral;
}


} )( );
