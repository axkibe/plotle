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
	ast_astCase;


/*
| Imports.
*/
var
	jools,
	ast_astBlock,
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

	ast_astBlock = require( '../../src/ast/ast-block' );

	jion_proto = require( '../../src/jion/proto' );
}


/*
| Constructor.
*/
var
	Constructor;


Constructor =
	function(
		ray, // ray
		v_block // the statement
	)
{
	this.block = v_block;

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
var
	prototype;


prototype = Constructor.prototype;


/*
| Jion.
*/
ast_astCase =
ast.astCase =
	{
		prototype :
			prototype
	};


if( SERVER )
{
	module.exports = ast_astCase;
}


/*
| Creates a new astCase object.
*/
ast_astCase.create =
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
		v_block;

	if( this !== ast_astCase )
	{
		inherit = this;

		ray = inherit.ray;

		rayDup = false;

		v_block = this.block;
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
			case 'block' :

				if( arg !== undefined )
				{
					v_block = arg;
				}

				break;

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
/**/	if( v_block === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_block === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_block.reflect !== 'ast.astBlock' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if( inherit && !rayDup && v_block.equals( inherit.block ) )
	{
		return inherit;
	}

	return new Constructor( ray, v_block );
};


/*
| Reflection.
*/
prototype.reflect = 'ast.astCase';


/*
| Name Reflection.
*/
prototype.reflectName = 'astCase';


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

	return this.block.equals( obj.block );
};


}
)( );
