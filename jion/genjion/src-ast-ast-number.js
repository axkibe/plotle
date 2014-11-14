/*
| This is an auto generated file.
|
| DO NOT EDIT!
*/
/*
| Export.
*/
var
	ast;


ast = ast || { };


/*
| Imports.
*/
var
	jion,


	jools,


	jion;


/*
| Capsule
*/
(
function( ) {
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
var
	Constructor;

Constructor =
	function(
		v_number // the number
	)
{
	this.number = v_number;

	jools.immute( this );
};

/*
| Prototype shortcut
*/
var
	prototype;

prototype = Constructor.prototype;

/*
| Jion.
*/
var
	astNumber;

astNumber =
ast.astNumber =
	{
		prototype :
			prototype
	};

if( SERVER )
{
	module.exports = astNumber;
}

/*
| Creates a new astNumber object.
*/
astNumber.create =
prototype.create =
	function(
		// free strings
	)
{
	var
		arg,

		inherit,

		v_number;

	if( this !== astNumber )
	{
		inherit = this;

		v_number = this.number;
	}

	for(
		var a = 0, aZ = arguments.length;
		a < aZ;
		a += 2
	)
	{
		arg = arguments[ a + 1 ];

		switch( arguments[ a ] )
		{
			case 'number' :

				if( arg !== undefined )
				{
					v_number = arg;
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
/**/	if( v_number === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_number === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( typeof( v_number ) !== 'number' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if( inherit && v_number === inherit.number )
	{
		return inherit;
	}

	return new Constructor( v_number );
};

/*
| Reflection.
*/
prototype.reflect = 'ast.astNumber';

/*
| Name Reflection.
*/
prototype.reflectName = 'astNumber';

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

	return this.number === obj.number;
};


}
)( );
