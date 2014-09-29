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

	ast = { };

	jion = { };

	ast.aCall = require( '../../src/ast/a-call' );

	jion.proto = require( '../../src/jion/proto' );
}


/*
| Constructor.
*/
var Constructor =
	function(
		v_call // the constrcutor call
	)
	{
		this.call = v_call;

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
	aNew =
	ast.aNew =
		{
			prototype :
				prototype
		};


/*
| Creates a new aNew object.
*/
aNew.create =
prototype.create =
	function(
		// free strings
	)
{
	var
		inherit,

		v_call;

	if( this !== aNew )
	{
		inherit = this;

		v_call = this.call;
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
			case 'call' :

				if( arg !== undefined )
				{
					v_call = arg;
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
/**/	if( v_call === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_call === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_call.reflectName !== 'aCall' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if( inherit && v_call.equals( inherit.call ) )
	{
		return inherit;
	}

	return new Constructor( v_call );
};


/*
| Reflection.
*/
prototype.reflect = 'ast.aNew';


/*
| Name Reflection.
*/
prototype.reflectName = 'aNew';


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
Constructor.prototype.equals =
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

	return this.call.equals( obj.call );
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports = aNew;
}


} )( );
