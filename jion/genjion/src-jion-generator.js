/*
| This is an auto generated file.
|
| DO NOT EDIT!
*/


/*
| Export.
*/
var
	jion =
		jion || { };


/*
| Imports.
*/
var
	jion,


	jools;


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
	jools = require( '../../src/jools/jools' );

	jion = { };

	jion.proto = require( '../../src/jion/proto' );
}


/*
| Constructor.
*/
var Constructor =
	function(
		v_jion // the jion definition
	)
	{
		this.jion = v_jion;

		this._init( );

		jools.immute( this );
	};


/*
| Prototype shortcut
*/
var
	prototype =
		Constructor.prototype;


/*
| Jion.
*/
var
	generator =
	jion.generator =
		{
			prototype :
				prototype
		};


/*
| Creates a new generator object.
*/
generator.create =
prototype.create =
	function(
		// free strings
	)
{
	var
		inherit,

		v_jion;

	if( this !== generator )
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
/**/				throw new Error( );
/**/			}
		}
	}

/**/if( CHECK )
/**/{
/**/	if( v_jion === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_jion === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if( inherit && v_jion === inherit.jion )
	{
		return inherit;
	}

	return new Constructor( v_jion );
};


/*
| Reflection.
*/
prototype.reflect = 'jion.generator';


/*
| Name Reflection.
*/
prototype.reflectName = 'generator';


/*
| Sets values by path.
*/
prototype.setPath = jion.proto.setPath;


/*
| Gets values by path
*/
prototype.getPath = jion.proto.getPath;


/*
| Tests equality of object.
*/
prototype.equals =
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
	module.exports = generator;
}


} )( );
