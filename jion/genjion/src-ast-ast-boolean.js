/*
| This is an auto generated file.
|
| DO NOT EDIT!
*/


/*
| Export.
*/
var
	ast =
		ast || { };


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
		v_boolean // the boolean
	)
	{
		this.boolean = v_boolean;

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
	astBoolean =
	ast.astBoolean =
		{
			prototype :
				prototype
		};


/*
| Creates a new astBoolean object.
*/
astBoolean.create =
prototype.create =
	function(
		// free strings
	)
{
	var
		inherit,

		v_boolean;

	if( this !== astBoolean )
	{
		inherit = this;

		v_boolean = this.boolean;
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
			case 'boolean' :

				if( arg !== undefined )
				{
					v_boolean = arg;
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
/**/	if( v_boolean === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_boolean === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( typeof( v_boolean ) !== 'boolean' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if( inherit && v_boolean === inherit.boolean )
	{
		return inherit;
	}

	return new Constructor( v_boolean );
};


/*
| Reflection.
*/
prototype.reflect = 'ast.astBoolean';


/*
| Name Reflection.
*/
prototype.reflectName = 'astBoolean';


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

	return this.boolean === obj.boolean;
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports = astBoolean;
}


} )( );