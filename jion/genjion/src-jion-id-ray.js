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
			ray // ray
		)
	{
		this.ray = ray;

		jools.immute( this );

/**/	if( CHECK )
/**/	{
/**/		Object.freeze( ray );
/**/	}
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
	idRay =
	jion.idRay =
		{
			prototype :
				prototype
		};

/*
| Creates a new idRay object.
*/
idRay.create =
prototype.create =
	function(
		// free strings
	)
{
	var
		inherit,

		ray,

		rayDup;

	if( this !== idRay )
	{
		inherit = this;

		ray = inherit.ray;

		rayDup = false;
	}
	else
	{
		ray = [ ];

		rayDup = true;
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
			case 'ray:init' :

				ray = arg;

				rayDup = false;

				break;

			case 'ray:append' :

				if( !rayDup )
				{
					ray = ray.slice( );

					rayDup = true;
				}

				ray.push( arg );

				break;

			case 'ray:insert' :

				if( !rayDup )
				{
					ray = ray.slice( );

					rayDup = true;
				}

				ray.splice( arg, 0, arguments[ ++a + 1 ] );

				break;

			case 'ray:remove' :

				if( !rayDup )
				{
					ray = ray.slice( );

					rayDup = true;
				}

				ray.splice( arg, 1 );

				break;

			case 'ray:set' :

				if( !rayDup )
				{
					ray = ray.slice( );

					rayDup = true;
				}

				ray[ arg ] = arguments[ ++a + 1 ];

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
/**/}

	if( inherit && !rayDup )
	{
		return inherit;
	}

	return new Constructor( ray );
};

/*
| Reflection.
*/
prototype.reflect = 'jion.idRay';

/*
| Name Reflection.
*/
prototype.reflectName = 'idRay';

/*
| Sets values by path.
*/
prototype.setPath = jion.proto.setPath;

/*
| Gets values by path
*/
prototype.getPath = jion.proto.getPath;

/*
| Appends an entry to the ray.
*/
prototype.append = jion.proto.rayAppend;

/*
| Returns the length of the ray.
*/
jools.lazyValue( prototype, 'length', jion.proto.rayLength );

/*
| Gets one entry from the ray.
*/
prototype.get = jion.proto.rayGet;

/*
| Returns a jion with one entry inserted to the ray.
*/
prototype.insert = jion.proto.rayInsert;

/*
| Returns the jion with one entry of the ray set.
*/
prototype.set = jion.proto.raySet;

/*
| Returns a jion with one entry from the ray removed.
*/
prototype.remove = jion.proto.rayRemove;

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

	return true;
};

/*
| Node export.
*/
if( SERVER )
{
	module.exports = idRay;
}


}
)( );
