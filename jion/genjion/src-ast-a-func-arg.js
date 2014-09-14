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
	JionProto,


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
	JionProto = require( '../../src/jion/proto' );

	jools = require( '../../src/jools/jools' );
}


/*
| Constructor.
*/
var Constructor =
	function(
		v_comment, // argument comment
		v_name // argument name
	)
	{
		this.comment = v_comment;

		this.name = v_name;

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
	aFuncArg =
	ast.aFuncArg =
		{
			prototype :
				prototype
		};


/*
| Creates a new aFuncArg object.
*/
aFuncArg.create =
prototype.create =
	function(
		// free strings
	)
{
	var
		inherit,

		v_comment,

		v_name;

	if( this !== aFuncArg )
	{
		inherit = this;

		v_comment = this.comment;

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
			case 'comment' :

				if( arg !== undefined )
				{
					v_comment = arg;
				}

				break;

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

	if( v_comment === undefined )
	{
		v_comment = null;
	}

/**/if( CHECK )
/**/{
/**/	if( v_comment === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute comment' );
/**/	}
/**/
/**/	if( v_comment !== null )
/**/	{
/**/		if(
/**/			typeof( v_comment ) !== 'string'
/**/			&&
/**/			!( v_comment instanceof String )
/**/		)
/**/		{
/**/			throw new Error( 'type mismatch' );
/**/		}
/**/	}
/**/
/**/	if( v_name === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute name' );
/**/	}
/**/
/**/	if( v_name !== null )
/**/	{
/**/		if(
/**/			typeof( v_name ) !== 'string'
/**/			&&
/**/			!( v_name instanceof String )
/**/		)
/**/		{
/**/			throw new Error( 'type mismatch' );
/**/		}
/**/	}
/**/}

	if(
		inherit
		&&
		v_comment === inherit.comment
		&&
		v_name === inherit.name
	)
	{
		return inherit;
	}

	return new Constructor( v_comment, v_name );
};


/*
| Reflection.
*/
prototype.reflect = 'ast.aFuncArg';


/*
| Name Reflection.
*/
prototype.reflectName = 'aFuncArg';


/*
| Sets values by path.
*/
prototype.setPath = JionProto.setPath;


/*
| Gets values by path
*/
prototype.getPath = JionProto.getPath;


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

	return this.comment === obj.comment && this.name === obj.name;
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports = aFuncArg;
}


} )( );
