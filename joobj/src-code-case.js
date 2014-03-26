/*
| This is an autogenerated file.
|
| DO NOT EDIT!
*/


/*
| Export
*/
var
	Code =
		Code || { };


/*
| Imports
*/
var
	JoobjProto,
	Jools;


/*
| Capsule
*/
(function( ) {
'use strict';


var
	_tag =
		391067085;


/*
| Node includes
*/
if( SERVER )
{
	JoobjProto =
		require( '../src/joobj/proto' );

	Jools =
		require( '../src/jools/jools' );
}


/*
| Constructor.
*/
var Case =
Code.Case =
	function(
		tag,
		ranks,   // twig order, set upon change
		twig,    // twig, set upon change
		v_block  // the statement
	)
{

/**/if( CHECK )
/**/{
/**/	if( tag !== _tag )
/**/	{
/**/		throw new Error(
/**/			'tag mismatch'
/**/		);
/**/	}
/**/}

	this.block =
		v_block;

	this.twig =
		twig;

	this.ranks =
		ranks;

	Jools.immute( this );
Jools.immute( ranks );
Jools.immute( twig );
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
		twigdup,
		v_block;

	if( this !== Case )
	{
		inherit =
			this;

		twig =
			inherit.twig;

		ranks =
			inherit.ranks;

		twigdup =
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

		twigdup =
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

				if( !twigdup )
				{
					twig =
						Jools.copy( twig );

					ranks =
						ranks.slice( );

					twigdup =
						true;
				}

				key =
					arg;

				arg =
					arguments[ ++a + 1 ];

				if( twig[ key ] !== undefined )
				{
					throw new Error(
						'key "' + key + '" already in use'
					);
				}

				twig[ key ] =
					arg;

				ranks.push( key );

				break;

			case 'twig:set' :

				if( !twigdup )
				{
					twig =
						Jools.copy( twig );

					ranks =
						ranks.slice( );

					twigdup =
						true;
				}

				key =
					arg;

				arg =
					arguments[ ++a + 1 ];

				if( twig[ key ] === undefined )
				{
					throw new Error(
						'key "' + key + '" not in use'
					);
				}

				twig[ key ] =
					arg;

				break;

			default :

/**/			if( CHECK )
/**/			{
/**/				throw new Error(
/**/					'invalid argument: ' + arguments[ a ]
/**/				);
/**/			}
		}
	}

/**/if( CHECK )
/**/{
/**/
/**/	if( v_block === undefined )
/**/	{
/**/		throw new Error(
/**/			'undefined attribute block'
/**/		);
/**/	}
/**/
/**/	if( v_block === null )
/**/	{
/**/		throw new Error(
/**/			'block must not be null'
/**/		);
/**/	}
/**/	if( v_block.reflect !== 'Block' )
/**/	{
/**/		throw new Error(
/**/			'type mismatch'
/**/		);
/**/	}
/**/}

	if(
		inherit
		&&
		!twigdup
		&&
		v_block.equals( inherit.block )
	)
	{
		return inherit;
	}

	return (
		new Case(
			_tag,
			ranks,
			twig,
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
| Gets values by path.
*/
Case.prototype.getPath =
	JoobjProto.getPath;


/*
| .
*/
Case.prototype.atRank =
	JoobjProto.atRank;


/*
| Checks for equal objects.
*/
Case.prototype.equals =
	function(
		obj
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
		this.twig === obj.twig
		&&
		this.block.equals( obj.block )
	);
};


/*
| Node export
*/
if( SERVER )
{
	module.exports =
		Case;
}


} )( );
