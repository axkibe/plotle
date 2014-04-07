/*
| This is an auto generated file.
|
| DO NOT EDIT!
*/


/*
| Export.
*/
var
	Gen;


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
}


/*
| Constructor.
*/
Gen =
	function(
		tag, // magic cookie
		v_joobj // the joobj definition
	)
{
/**/if( CHECK )
/**/{
/**/	if( tag !== 226556860 )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	this.joobj =
		v_joobj;

	this._init( );

	Jools.immute( this );
};


/*
| Creates a new Gen object.
*/
Gen.create =
Gen.prototype.create =
	function(
		// free strings
	)
{
	var
		inherit,
		v_joobj;

	if( this !== Gen )
	{
		inherit =
			this;

		v_joobj =
			this.joobj;
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
			case 'joobj' :

				if( arg !== undefined )
				{
					v_joobj =
						arg;
				}

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
/**/	if( v_joobj === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute joobj' );
/**/	}
/**/
/**/	if( v_joobj === null )
/**/	{
/**/		throw new Error( 'attribute joobj must not be null.' );
/**/	}
/**/}

	if(
		inherit
		&&
		v_joobj === inherit.joobj
	)
	{
		return inherit;
	}

	return (
		new Gen(
			226556860,
			v_joobj
		)
	);
};


/*
| Reflection.
*/
Gen.prototype.reflect =
	'Gen';


/*
| Sets values by path.
*/
Gen.prototype.setPath =
	JoobjProto.setPath;


/*
| Gets values by path
*/
Gen.prototype.getPath =
	JoobjProto.getPath;


/*
| Tests equality of object.
*/
Gen.prototype.equals =
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

	return this.joobj === obj.joobj;
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports =
		Gen;
}


} )( );
