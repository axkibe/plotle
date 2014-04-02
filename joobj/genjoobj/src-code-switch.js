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
/**/	if( tag !== 71619561 )
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
Switch.create =
Switch.prototype.create =
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
/**/	if( v_defaultCase !== null )
/**/	{
/**/		if( v_statement.reflect !== 'Term' )
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
			71619561,
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
