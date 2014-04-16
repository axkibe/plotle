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

	Code.Assign =
		require(
			'../../src/code/assign'
		);

	Code.Check =
		require(
			'../../src/code/check'
		);

	Code.Comment =
		require(
			'../../src/code/comment'
		);
}


/*
| Constructor.
*/
var Block =
Code.Block =
	function(
		tag, // magic cookie
		twig, // twig
		ranks, // twig ranks
		v_path // the path
	)
{
/**/if( CHECK )
/**/{
/**/	if( tag !== 598117823 )
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
| Creates a new Block object.
*/
Block.create =
Block.prototype.create =
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
		v_path;

	if( this !== Block )
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
		new Block(
			598117823,
			twig,
			ranks,
			v_path
		)
	);
};


/*
| Reflection.
*/
Block.prototype.reflect =
	'Block';


/*
| Sets values by path.
*/
Block.prototype.setPath =
	JoobjProto.setPath;


/*
| Gets values by path
*/
Block.prototype.getPath =
	JoobjProto.getPath;


/*
| Returns a twig by rank.
*/
Block.prototype.atRank =
	JoobjProto.atRank;


/*
| Gets the rank of a key.
*/
Block.prototype.rankOf =
	JoobjProto.rankOf;


/*
| Creates a new unique identifier.
*/
Block.prototype.newUID =
	JoobjProto.newUID;


/*
| Tests equality of object.
*/
Block.prototype.equals =
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
		Block;
}


} )( );
