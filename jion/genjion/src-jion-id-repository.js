/*
| This is an auto generated file.
|
| DO NOT EDIT!
*/


/*
| Export.
*/
var
	jion_idRepository;


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
		v_primitives, // set of all primites, that is ids without unit
		v_units // a set of all units with all names
	)
{
/**/if( CHECK )
/**/{
/**/	if( prototype.__lazy )
/**/	{
/**/		this.__lazy = { };
/**/	}
/**/}

	if( v_primitives !== undefined )
	{
		this.primitives = v_primitives;
	}

	if( v_units !== undefined )
	{
		this.units = v_units;
	}

	this._init( );

/**/if( CHECK )
/**/{
/**/	Object.freeze( this );
/**/}
};


/*
| Prototype shortcut
*/
prototype = Constructor.prototype;


/*
| Jion.
*/
jion_idRepository =
	{
		prototype :
			prototype
	};


if( SERVER )
{
	module.exports = jion_idRepository;
}


/*
| Creates a new idRepository object.
*/
jion_idRepository.create =
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
		v_primitives,
		v_units;

	if( this !== jion_idRepository )
	{
		inherit = this;

		v_primitives = this.primitives;

		v_units = this.units;
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
			case 'primitives' :

				if( arg !== undefined )
				{
					v_primitives = arg;
				}

				break;

			case 'units' :

				if( arg !== undefined )
				{
					v_units = arg;
				}

				break;

			default :

/**/			if( CHECK )
/**/			{
/**/				throw new Error( );
/**/			}
		}
	}

	if( v_primitives === undefined )
	{
		v_primitives = undefined;
	}

	if( v_units === undefined )
	{
		v_units = undefined;
	}

/**/if( CHECK )
/**/{
/**/	if( v_primitives === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_units === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if(
		inherit
		&&
		v_primitives === inherit.primitives
		&&
		v_units === inherit.units
	)
	{
		return inherit;
	}

	return new Constructor( v_primitives, v_units );
};


/*
| Reflection.
*/
prototype.reflect = 'jion_idRepository';


/*
| Name Reflection.
*/
prototype.reflectName = 'idRepository';


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

	return this.primitives === obj.primitives && this.units === obj.units;
};


}
)( );
