/*
| This is an auto generated file.
|
| DO NOT EDIT!
*/


/*
| Export.
*/
var
	ast_astFuncArg;


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
		v_comment, // argument comment
		v_name // argument name
	)
{
/**/if( CHECK )
/**/{
/**/	if( prototype.__lazy )
/**/	{
/**/		this.__lazy = { };
/**/	}
/**/}

	this.comment = v_comment;

	this.name = v_name;

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
ast_astFuncArg =
	{
		prototype :
			prototype
	};


if( SERVER )
{
	module.exports = ast_astFuncArg;
}


/*
| Creates a new astFuncArg object.
*/
ast_astFuncArg.create =
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
		v_comment,
		v_name;

	if( this !== ast_astFuncArg )
	{
		inherit = this;

		v_comment = this.comment;

		v_name = this.name;
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
			case 'comment' :

				if( arg !== undefined )
				{
					v_comment = arg;
				}

				break;

			case 'name' :

				if( arg !== undefined )
				{
					v_name = arg;
				}

				break;

			default :

/**/			if( CHECK )
/**/			{
/**/				throw new Error( );
/**/			}
		}
	}

	if( v_comment === undefined )
	{
		v_comment = null;
	}

/**/if( CHECK )
/**/{
/**/	if( v_comment === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_comment !== null )
/**/	{
/**/		if(
/**/			typeof( v_comment ) !== 'string'
/**/			&&
/**/			!( v_comment instanceof String )
/**/		)
/**/		{
/**/			throw new Error( );
/**/		}
/**/	}
/**/
/**/	if( v_name === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_name !== null )
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
/**/}

	if(
		inherit
		&&
		v_comment === inherit.comment
		&&
		v_name === inherit.name
	)
	{
		return inherit;
	}

	return new Constructor( v_comment, v_name );
};


/*
| Reflection.
*/
prototype.reflect = 'ast_astFuncArg';


/*
| Name Reflection.
*/
prototype.reflectName = 'astFuncArg';


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

	return this.comment === obj.comment && this.name === obj.name;
};


}
)( );
