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
		680985780;


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
var Call =
Code.Call =
	function(
		tag,
		ranks,  // twig order, set upon change
		twig,   // twig, set upon change
		v_func  // the function to call
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

	this.func =
		v_func;

	this.twig =
		twig;

	this.ranks =
		ranks;

	Jools.immute( this );
Jools.immute( ranks );
Jools.immute( twig );
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
		twigdup,
		v_func;

	if( this !== Call )
	{
		inherit =
			this;

		twig =
			inherit.twig;

		ranks =
			inherit.ranks;

		twigdup =
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
			case 'func' :

				if( arg !== undefined )
				{
					v_func =
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
/**/	if( v_func === undefined )
/**/	{
/**/		throw new Error(
/**/			'undefined attribute func'
/**/		);
/**/	}
/**/
/**/	if( v_func === null )
/**/	{
/**/		throw new Error(
/**/			'func must not be null'
/**/		);
/**/	}
/**/	if( v_func.reflect !== 'Term' )
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
		v_func.equals( inherit.func )
	)
	{
		return inherit;
	}

	return (
		new Call(
			_tag,
			ranks,
			twig,
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
| Gets values by path.
*/
Call.prototype.getPath =
	JoobjProto.getPath;


/*
| .
*/
Call.prototype.atRank =
	JoobjProto.atRank;


/*
| Checks for equal objects.
*/
Call.prototype.equals =
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
		this.func.equals( obj.func )
	);
};


/*
| Node export
*/
if( SERVER )
{
	module.exports =
		Call;
}


} )( );
