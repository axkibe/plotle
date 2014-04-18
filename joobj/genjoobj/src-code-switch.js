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

	Code.Case =
		require(
			'../../src/code/case'
		);
}


/*
| Constructor.
*/
var Switch =
Code.Switch =
	function(
		tag, // magic cookie
		twig, // twig
		ranks, // twig ranks
		v_defaultCase, // the default block
		v_statement // the statement
	)
{
/**/if( CHECK )
/**/{
/**/	if( tag !== 45583408 )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	this.defaultCase =
		v_defaultCase;

	this.statement =
		v_statement;

	this.twig =
		twig;

	this.ranks =
		ranks;

	Jools.immute( this );

	Jools.immute( twig );

	Jools.immute( ranks );
};


/*
| Creates a new Switch object.
*/
Switch.Create =
Switch.prototype.Create =
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
		v_defaultCase,
		v_statement;

	if( this !== Switch )
	{
		inherit =
			this;

		twig =
			inherit.twig;

		ranks =
			inherit.ranks;

		twigDup =
			false;

		v_defaultCase =
			this.defaultCase;

		v_statement =
			this.statement;
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
			case 'defaultCase' :

				if( arg !== undefined )
				{
					v_defaultCase =
						arg;
				}

				break;

			case 'statement' :

				if( arg !== undefined )
				{
					v_statement =
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

	if( v_defaultCase === undefined )
	{
		v_defaultCase =
			null;
	}

/**/if( CHECK )
/**/{
/**/	if( v_defaultCase === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute defaultCase' );
/**/	}
/**/
/**/	if( v_defaultCase !== null )
/**/	{
/**/		if( v_defaultCase.reflect !== 'Block' )
/**/		{
/**/			throw new Error( 'type mismatch' );
/**/		}
/**/	}
/**/
/**/	if( v_statement === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute statement' );
/**/	}
/**/
/**/	if( v_statement === null )
/**/	{
/**/		throw new Error( 'attribute statement must not be null.' );
/**/	}
/**/
/**/	if( v_statement.reflect !== 'Term' )
/**/	{
/**/		throw new Error( 'type mismatch' );
/**/	}
/**/}

	if(
		inherit
		&&
		!twigDup
		&&
		(v_defaultCase === inherit.defaultCase||(v_defaultCase&&v_defaultCase.equals( inherit.defaultCase)))
		&&
		v_statement.equals(
			inherit.statement
		)
	)
	{
		return inherit;
	}

	return (
		new Switch(
			45583408,
			twig,
			ranks,
			v_defaultCase,
			v_statement
		)
	);
};


/*
| Reflection.
*/
Switch.prototype.reflect =
	'Switch';


/*
| Sets values by path.
*/
Switch.prototype.setPath =
	JoobjProto.setPath;


/*
| Gets values by path
*/
Switch.prototype.getPath =
	JoobjProto.getPath;


/*
| Returns a twig by rank.
*/
Switch.prototype.atRank =
	JoobjProto.atRank;


/*
| Gets the rank of a key.
*/
Switch.prototype.rankOf =
	JoobjProto.rankOf;


/*
| Creates a new unique identifier.
*/
Switch.prototype.newUID =
	JoobjProto.newUID;


/*
| Tests equality of object.
*/
Switch.prototype.equals =
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
		(this.defaultCase === obj.defaultCase ||(this.defaultCase !== null && this.defaultCase.equals( obj.defaultCase )))
		&&
		this.statement === obj.statement
	);
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports =
		Switch;
}


} )( );
