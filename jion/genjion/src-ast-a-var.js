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
var Constructor =
	function(
		v_name // the variable name
	)
	{
		this.name = v_name;

		this._init( );

		Jools.immute( this );
	};


/*
| Prototype shortcut
*/
var
	prototype =
		Constructor.prototype;


/*
| Jion
*/
var
	aVar =
	ast.aVar =
		{
			prototype :
				prototype
		};


/*
| Creates a new aVar object.
*/
aVar.create =
prototype.create =
	function(
		// free strings
	)
{
	var
		inherit,

		v_name;

	if( this !== aVar )
	{
		inherit = this;

		v_name = this.name;
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
			case 'name' :

				if( arg !== undefined )
				{
					v_name = arg;
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
/**/	if( v_name === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute name' );
/**/	}
/**/
/**/	if( v_name === null )
/**/	{
/**/		throw new Error( 'attribute name must not be null.' );
/**/	}
/**/
/**/	if(
/**/		typeof( v_name ) !== 'string'
/**/		&&
/**/		!( v_name instanceof String )
/**/	)
/**/	{
/**/		throw new Error( 'type mismatch' );
/**/	}
/**/}

	if( inherit && v_name === inherit.name )
	{
		return inherit;
	}

	return new Constructor( v_name );
};


/*
| Reflection.
*/
prototype.reflect = 'aVar';


/*
| New Reflection.
*/
prototype.reflex = 'ast.aVar';


/*
| Name Reflection.
*/
prototype.reflexName = 'aVar';


/*
| Sets values by path.
*/
prototype.setPath = JoobjProto.setPath;


/*
| Gets values by path
*/
prototype.getPath = JoobjProto.getPath;


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

	return this.name === obj.name;
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports = aVar;
}


} )( );
