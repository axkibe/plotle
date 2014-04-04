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
var Case =
Code.Case =
	function(
		tag, // magic cookie
		twig, // twig
		ranks, // twig ranks
		v_block // the statement
	)
{
/**/if( CHECK )
/**/{
/**/	if( tag !== 689610842 )
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
| Creates a new Case object.
*/
Case.create =
Case.prototype.create =
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
		v_block;

	if( this !== Case )
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
/**/	if( v_block === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute block' );
/**/	}
/**/
/**/	if( v_block === null )
/**/	{
/**/		throw new Error( 'attribute block must not be null.' );
/**/	}
/**/
/**/	if( v_block.reflect !== 'Block' )
/**/	{
/**/		throw new Error( 'type mismatch' );
/**/	}
/**/}

	if(
		inherit
		&&
		 !twigDup
		&&
		v_block.equals(
			inherit.block
		)
	)
	{
		return inherit;
	}

	return (
		new Case(
			689610842,
			twig,
			ranks,
			v_block
		)
	);
};


/*
| Reflection.
*/
Case.prototype.reflect =
	'Case';


/*
| Sets values by path.
*/
Case.prototype.setPath =
	JoobjProto.setPath;


/*
| Gets values by path
*/
Case.prototype.getPath =
	JoobjProto.getPath;


/*
| Returns a twig by rank.
*/
Case.prototype.atRank =
	JoobjProto.atRank;


/*
| Tests equality of object.
*/
Case.prototype.equals =
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

	return this.block === obj.block;
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports =
		Case;
}


} )( );
