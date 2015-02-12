/*
| This is an auto generated file.
|
| DO NOT EDIT!
*/


/*
| Export.
*/
var
	ast_number;


if( SERVER )
{
	ast_number = module.exports;
}
else
{
	ast_number = { };
}


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
		v_number // the number
	)
{
/**/if( CHECK )
/**/{
/**/	if( prototype.__have_lazy )
/**/	{
/**/		this.__lazy = { };
/**/	}
/**/}

	this.number = v_number;

	if( FREEZE )
	{
		Object.freeze( this );
	}
};


/*
| Prototype shortcut
*/
prototype = Constructor.prototype;


ast_number.prototype = prototype;


/*
| Creates a new number object.
*/
ast_number.create =
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
		v_number;

	if( this !== ast_number )
	{
		inherit = this;

		v_number = this.number;
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
prototype.reflect = 'ast_number';


/*
| Name Reflection.
*/
prototype.reflectName = 'number';


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

	if( obj.reflect !== 'ast_number' )
	{
		return false;
	}

	return this.number === obj.number;
};


}
)( );
