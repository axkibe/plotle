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
		v_content // comment content
	)
	{
		this.content = v_content;

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
	aComment =
	ast.aComment =
		{
			prototype :
				prototype
		};


/*
| Creates a new aComment object.
*/
aComment.create =
prototype.create =
	function(
		// free strings
	)
{
	var
		inherit,

		v_content;

	if( this !== aComment )
	{
		inherit = this;

		v_content = this.content;
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
			case 'content' :

				if( arg !== undefined )
				{
					v_content = arg;
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
/**/	if( v_content === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute content' );
/**/	}
/**/
/**/	if( v_content === null )
/**/	{
/**/		throw new Error( 'attribute content must not be null.' );
/**/	}
/**/}

	if( inherit && v_content === inherit.content )
	{
		return inherit;
	}

	return new Constructor( v_content );
};


/*
| Reflection.
*/
prototype.reflect = 'aComment';


/*
| New Reflection.
*/
prototype.reflex = 'ast.aComment';


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

	return this.content === obj.content;
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports = aComment;
}


} )( );
