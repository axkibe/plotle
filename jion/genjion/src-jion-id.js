/*
| This is an auto generated file.
|
| DO NOT EDIT!
*/


/*
| Export.
*/
var
	jion;


jion = jion || { };


var
	jion_id;


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
	Constructor;


Constructor =
	function(
		v_name, // the name part of the id if applicable
		v_unit // the unit part of the id if applicable
	)
{
	if( v_name !== undefined )
	{
		this.name = v_name;
	}

	if( v_unit !== undefined )
	{
		this.unit = v_unit;
	}

	this._init( );

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
jion_id =
jion.id =
	{
		prototype :
			prototype
	};


if( SERVER )
{
	module.exports = jion_id;
}


/*
| Creates a new id object.
*/
jion_id.create =
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
		v_name,
		v_unit;

	if( this !== jion_id )
	{
		inherit = this;

		v_name = this.name;

		v_unit = this.unit;
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
			case 'name' :

				if( arg !== undefined )
				{
					v_name = arg;
				}

				break;

			case 'unit' :

				if( arg !== undefined )
				{
					v_unit = arg;
				}

				break;

			default :

/**/			if( CHECK )
/**/			{
/**/				throw new Error( );
/**/			}
		}
	}

	if( v_name === undefined )
	{
		v_name = undefined;
	}

	if( v_unit === undefined )
	{
		v_unit = undefined;
	}

/**/if( CHECK )
/**/{
/**/	if( v_name === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_name !== undefined )
/**/	{
/**/		if(
/**/			typeof( v_name ) !== 'string'
/**/			&&
/**/			!( v_name instanceof String )
/**/		)
/**/		{
/**/			throw new Error( );
/**/		}
/**/	}
/**/
/**/	if( v_unit === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_unit !== undefined )
/**/	{
/**/		if(
/**/			typeof( v_unit ) !== 'string'
/**/			&&
/**/			!( v_unit instanceof String )
/**/		)
/**/		{
/**/			throw new Error( );
/**/		}
/**/	}
/**/}

	if( inherit && v_name === inherit.name && v_unit === inherit.unit )
	{
		return inherit;
	}

	return new Constructor( v_name, v_unit );
};


/*
| Reflection.
*/
prototype.reflect = 'jion.id';


/*
| Name Reflection.
*/
prototype.reflectName = 'id';


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

	return this.name === obj.name && this.unit === obj.unit;
};


}
)( );
