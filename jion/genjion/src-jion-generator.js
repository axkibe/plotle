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
	jion_generator;


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
		v_jion // the jion definition
	)
{
/**/if( CHECK )
/**/{
/**/	if( prototype.__lazy )
/**/	{
/**/		this.__lazy = { };
/**/	}
/**/}

	this.jion = v_jion;

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
jion_generator =
jion.generator =
	{
		prototype :
			prototype
	};


if( SERVER )
{
	module.exports = jion_generator;
}


/*
| Creates a new generator object.
*/
jion_generator.create =
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
		v_jion;

	if( this !== jion_generator )
	{
		inherit = this;

		v_jion = this.jion;
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
			case 'jion' :

				if( arg !== undefined )
				{
					v_jion = arg;
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
/**/	if( v_jion === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_jion === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if( inherit && v_jion === inherit.jion )
	{
		return inherit;
	}

	return new Constructor( v_jion );
};


/*
| Reflection.
*/
prototype.reflect = 'jion_generator';


/*
| Name Reflection.
*/
prototype.reflectName = 'generator';


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

	return this.jion === obj.jion;
};


}
)( );
