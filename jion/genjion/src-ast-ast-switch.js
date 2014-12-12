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
	ast_astSwitch;


/*
| Imports.
*/
var
	jools,
	ast_astBlock,
	ast_astCase,
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

	ast_astCase = require( '../../src/ast/ast-case' );

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
		v_defaultCase, // the default block
		v_statement // the statement expression
	)
{
/**/if( CHECK )
/**/{
/**/	if( prototype.__lazy )
/**/	{
/**/		this.__lazy = { };
/**/	}
/**/}

	this.defaultCase = v_defaultCase;

	this.statement = v_statement;

	this.ray = ray;

/**/if( CHECK )
/**/{
/**/	Object.freeze( ray );
/**/
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
ast_astSwitch =
ast.astSwitch =
	{
		prototype :
			prototype
	};


if( SERVER )
{
	module.exports = ast_astSwitch;
}


/*
| Creates a new astSwitch object.
*/
ast_astSwitch.create =
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
		v_defaultCase,
		v_statement;

	if( this !== ast_astSwitch )
	{
		inherit = this;

		ray = inherit.ray;

		rayDup = false;

		v_defaultCase = this.defaultCase;

		v_statement = this.statement;
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
			case 'defaultCase' :

				if( arg !== undefined )
				{
					v_defaultCase = arg;
				}

				break;

			case 'statement' :

				if( arg !== undefined )
				{
					v_statement = arg;
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

	if( v_defaultCase === undefined )
	{
		v_defaultCase = null;
	}

/**/if( CHECK )
/**/{
/**/	if( v_defaultCase === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_defaultCase !== null )
/**/	{
/**/		if( v_defaultCase.reflect !== 'ast_astBlock' )
/**/		{
/**/			throw new Error( );
/**/		}
/**/	}
/**/
/**/	if( v_statement === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_statement === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if(
		inherit
		&&
		!rayDup
		&&
		(
			v_defaultCase === inherit.defaultCase
			||
			v_defaultCase && v_defaultCase.equals( inherit.defaultCase )
		)
		&&
		v_statement === inherit.statement
	)
	{
		return inherit;
	}

	return new Constructor( ray, v_defaultCase, v_statement );
};


/*
| Reflection.
*/
prototype.reflect = 'ast_astSwitch';


/*
| Reflection_.
*/
prototype.reflect = 'ast_astSwitch';


/*
| Name Reflection.
*/
prototype.reflectName = 'astSwitch';


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

	return (
		(
			this.defaultCase === obj.defaultCase
			||
			this.defaultCase !== null
			&&
			this.defaultCase.equals( obj.defaultCase )
		)
		&&
		this.statement === obj.statement
	);
};


}
)( );
