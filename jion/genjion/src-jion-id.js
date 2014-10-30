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
		v_type, // the type part of the id if applicable
		v_unit // the unit part of the id if applicable
	)
	{
		if( v_type !== undefined )
		{
			this.type = v_type;
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
	prototype =
		Constructor.prototype;


/*
| Jion.
*/
var
	id =
	jion.id =
		{
			prototype :
				prototype
		};


/*
| Creates a new id object.
*/
id.create =
prototype.create =
	function(
		// free strings
	)
{
	var
		inherit,

		v_type,

		v_unit;

	if( this !== id )
	{
		inherit = this;

		v_type = this.type;

		v_unit = this.unit;
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
			case 'type' :

				if( arg !== undefined )
				{
					v_type = arg;
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

	if( v_type === undefined )
	{
		v_type = undefined;
	}

	if( v_unit === undefined )
	{
		v_unit = undefined;
	}

/**/if( CHECK )
/**/{
/**/	if( v_type === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_type !== undefined )
/**/	{
/**/		if(
/**/			typeof( v_type ) !== 'string'
/**/			&&
/**/			!( v_type instanceof String )
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

	if( inherit && v_type === inherit.type && v_unit === inherit.unit )
	{
		return inherit;
	}

	return new Constructor( v_type, v_unit );
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

	return this.type === obj.type && this.unit === obj.unit;
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports = id;
}


} )( );
