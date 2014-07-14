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
	JoobjProto = require( '../../src/jion/proto' );

	Jools = require( '../../src/jools/jools' );
}


/*
| Constructor.
*/
Gen =
	function(
		tag, // magic cookie
		v_jion // the jion definition
	)
{
/**/if( CHECK )
/**/{
/**/	if( tag !== 8833 )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	this.jion = v_jion;

	this._init( );

	Jools.immute( this );
};


/*
| Creates a new Gen object.
*/
Gen.Create =
Gen.prototype.Create =
	function(
		// free strings
	)
{
	var
		inherit,
		v_jion;

	if( this !== Gen )
	{
		inherit = this;

		v_jion = this.jion;
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
			case 'jion' :

				if( arg !== undefined )
				{
					v_jion = arg;
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
/**/	if( v_jion === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute jion' );
/**/	}
/**/
/**/	if( v_jion === null )
/**/	{
/**/		throw new Error( 'attribute jion must not be null.' );
/**/	}
/**/}

	if( inherit && v_jion === inherit.jion )
	{
		return inherit;
	}

	return new Gen( 8833, v_jion );
};


/*
| Reflection.
*/
Gen.prototype.reflect = 'Gen';


/*
| Sets values by path.
*/
Gen.prototype.setPath = JoobjProto.setPath;


/*
| Gets values by path
*/
Gen.prototype.getPath = JoobjProto.getPath;


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

	return this.jion === obj.jion;
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports = Gen;
}


} )( );
