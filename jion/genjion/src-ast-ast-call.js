/*
| This is an auto generated file.
|
| DO NOT EDIT!
*/


/*
| Export.
*/
var
	ast;


ast = ast || { };


var
	ast_astCall;


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
		ray, // ray
		v_func // the function to call
	)
{
/**/if( CHECK )
/**/{
/**/	if( prototype.__lazy )
/**/	{
/**/		this.__lazy = { };
/**/	}
/**/}

	this.func = v_func;

	this.ray = ray;

	jools.immute( this );

/**/if( CHECK )
/**/{
/**/	Object.freeze( ray );
/**/}
};


/*
| Prototype shortcut
*/
prototype = Constructor.prototype;


/*
| Jion.
*/
ast_astCall =
ast.astCall =
	{
		prototype :
			prototype
	};


if( SERVER )
{
	module.exports = ast_astCall;
}


/*
| Creates a new astCall object.
*/
ast_astCall.create =
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
		ray,
		rayDup,
		v_func;

	if( this !== ast_astCall )
	{
		inherit = this;

		ray = inherit.ray;

		rayDup = false;

		v_func = this.func;
	}
	else
	{
		ray = [ ];

		rayDup = true;
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
			case 'func' :

				if( arg !== undefined )
				{
					v_func = arg;
				}

				break;

			case 'ray:init' :

				ray = arg;

				rayDup = 'init';

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
/**/	if( v_func === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_func === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if( inherit && !rayDup && v_func === inherit.func )
	{
		return inherit;
	}

	return new Constructor( ray, v_func );
};


/*
| Reflection.
*/
prototype.reflect = 'ast.astCall';


/*
| Reflection_.
*/
prototype.reflect_ = 'ast_astCall';


/*
| Name Reflection.
*/
prototype.reflectName = 'astCall';


/*
| Sets values by path.
*/
prototype.setPath = jion_proto.setPath;


/*
| Gets values by path
*/
prototype.getPath = jion_proto.getPath;


/*
| Appends an entry to the ray.
*/
prototype.append = jion_proto.rayAppend;


/*
| Appends an entry to the ray.
*/
prototype.appendRay = jion_proto.rayAppendRay;


/*
| Returns the length of the ray.
*/
jools.lazyValue( prototype, 'length', jion_proto.rayLength );


/*
| Gets one entry from the ray.
*/
prototype.get = jion_proto.rayGet;


/*
| Returns a jion with one entry inserted to the ray.
*/
prototype.insert = jion_proto.rayInsert;


/*
| Returns the jion with one entry of the ray set.
*/
prototype.set = jion_proto.raySet;


/*
| Returns a jion with one entry from the ray removed.
*/
prototype.remove = jion_proto.rayRemove;


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

	return this.func === obj.func;
};


}
)( );
