/*
| This is an auto generated file.
|
| DO NOT EDIT!
*/


/*
| Export.
*/
var
	ast_lessThan;


/*
| Imports.
*/
var
	jools,
	jion_proto;


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

	jion_proto = require( '../../src/jion/proto' );
}


/*
| Constructor.
*/
var
	Constructor,
	prototype;


Constructor =
	function(
		v_left, // left expression
		v_right // right expression
	)
{
/**/if( CHECK )
/**/{
/**/	if( prototype.__lazy )
/**/	{
/**/		this.__lazy = { };
/**/	}
/**/}

	this.left = v_left;

	this.right = v_right;

	if( FREEZE )
	{
		Object.freeze( this );
	}
};


/*
| Prototype shortcut
*/
prototype = Constructor.prototype;


/*
| Jion.
*/
ast_lessThan =
	{
		prototype :
			prototype
	};


if( SERVER )
{
	module.exports = ast_lessThan;
}


/*
| Creates a new lessThan object.
*/
ast_lessThan.create =
prototype.create =
	function(
		// free strings
	)
{
	var
		a,
		aZ,
		arg,
		inherit,
		v_left,
		v_right;

	if( this !== ast_lessThan )
	{
		inherit = this;

		v_left = this.left;

		v_right = this.right;
	}

	for(
		a = 0, aZ = arguments.length;
		a < aZ;
		a += 2
	)
	{
		arg = arguments[ a + 1 ];

		switch( arguments[ a ] )
		{
			case 'left' :

				if( arg !== undefined )
				{
					v_left = arg;
				}

				break;

			case 'right' :

				if( arg !== undefined )
				{
					v_right = arg;
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
/**/	if( v_left === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_left === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_right === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_right === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if( inherit && v_left === inherit.left && v_right === inherit.right )
	{
		return inherit;
	}

	return new Constructor( v_left, v_right );
};


/*
| Reflection.
*/
prototype.reflect = 'ast_lessThan';


/*
| Name Reflection.
*/
prototype.reflectName = 'lessThan';


/*
| Sets values by path.
*/
prototype.setPath = jion_proto.setPath;


/*
| Gets values by path
*/
prototype.getPath = jion_proto.getPath;


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

	return this.left === obj.left && this.right === obj.right;
};


}
)( );
