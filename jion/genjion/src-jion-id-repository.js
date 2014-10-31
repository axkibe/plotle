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

	jion = { };

	jion.proto = require( '../../src/jion/proto' );
}

/*
| Constructor.
*/
var
	Constructor =
		function(
			v_units // a set of all units with all names
		)
	{
		if( v_units !== undefined )
		{
			this.units = v_units;
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
	idRepository =
	jion.idRepository =
		{
			prototype :
				prototype
		};

/*
| Creates a new idRepository object.
*/
idRepository.create =
prototype.create =
	function(
		// free strings
	)
{
	var
		inherit,

		v_units;

	if( this !== idRepository )
	{
		inherit = this;

		v_units = this.units;
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

	if( v_units === undefined )
	{
		v_units = undefined;
	}

/**/if( CHECK )
/**/{
/**/	if( v_units === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if( inherit && v_units === inherit.units )
	{
		return inherit;
	}

	return new Constructor( v_units );
};

/*
| Reflection.
*/
prototype.reflect = 'jion.idRepository';

/*
| Name Reflection.
*/
prototype.reflectName = 'idRepository';

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

	return this.units === obj.units;
};

/*
| Node export.
*/
if( SERVER )
{
	module.exports = idRepository;
}


}
)( );
