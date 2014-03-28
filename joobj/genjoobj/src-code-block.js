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
		157313200;


/*
| Node includes
*/
if( SERVER )
{
	JoobjProto =
		require( '../../src/joobj/proto' );

	Jools =
		require( '../../src/jools/jools' );
}


/*
| Constructor.
*/
var Block =
Code.Block =
	function(
		tag,
		ranks,  // twig order, set upon change
		twig,   // twig, set upon change
		v_path  // the path
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

	this.path =
		v_path;

	this.twig =
		twig;

	this.ranks =
		ranks;

	Jools.immute( this );
Jools.immute( ranks );
Jools.immute( twig );
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
		ranks,
		twig,
		twigdup,
		v_path;

	if( this !== Block )
	{
		inherit =
			this;

		twig =
			inherit.twig;

		ranks =
			inherit.ranks;

		twigdup =
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
			case 'path' :

				if( arg !== undefined )
				{
					v_path =
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

	if( v_path === undefined )
	{
		v_path =
			null;
	}

/**/if( CHECK )
/**/{
/**/
/**/	if( v_path === undefined )
/**/	{
/**/		throw new Error(
/**/			'undefined attribute path'
/**/		);
/**/	}
/**/
/**/	if( v_path !== null )
/**/	{
/**/		if( v_path.reflect !== 'Path' )
/**/		{
/**/			throw new Error(
/**/				'type mismatch'
/**/			);
/**/		}
/**/	}
/**/}

	if(
		inherit
		&&
		!twigdup
		&&
		(
			v_path === inherit.path
			||
			(
				v_path
				&&
				v_path.equals( inherit.path )
			)
		)
	)
	{
		return inherit;
	}

	return (
		new Block(
			_tag,
			ranks,
			twig,
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
| Gets values by path.
*/
Block.prototype.getPath =
	JoobjProto.getPath;


/*
| .
*/
Block.prototype.atRank =
	JoobjProto.atRank;


/*
| Checks for equal objects.
*/
Block.prototype.equals =
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
		(
			this.path === obj.path ||
			(
				this.path !== null
				&&
				this.path.equals( obj.path )
			)
		)
	);
};


/*
| Node export
*/
if( SERVER )
{
	module.exports =
		Block;
}


} )( );
