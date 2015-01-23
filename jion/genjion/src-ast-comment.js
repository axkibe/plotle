/*
| This is an auto generated file.
|
| DO NOT EDIT!
*/


/*
| Export.
*/
var
	ast_comment;


if( SERVER )
{
	ast_comment = module.exports;
}
else
{
	ast_comment = { };
}


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
		v_content // comment content
	)
{
/**/if( CHECK )
/**/{
/**/	if( prototype.__lazy )
/**/	{
/**/		this.__lazy = { };
/**/	}
/**/}

	this.content = v_content;

	if( FREEZE )
	{
		Object.freeze( this );
	}
};


/*
| Prototype shortcut
*/
prototype = Constructor.prototype;


ast_comment.prototype = prototype;


/*
| Creates a new comment object.
*/
ast_comment.create =
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
		v_content;

	if( this !== ast_comment )
	{
		inherit = this;

		v_content = this.content;
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
			case 'content' :

				if( arg !== undefined )
				{
					v_content = arg;
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
/**/	if( v_content === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_content === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if( inherit && v_content === inherit.content )
	{
		return inherit;
	}

	return new Constructor( v_content );
};


/*
| Reflection.
*/
prototype.reflect = 'ast_comment';


/*
| Name Reflection.
*/
prototype.reflectName = 'comment';


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

	if( obj.reflect !== 'ast_comment' )
	{
		return false;
	}

	return this.content.equals( obj.content );
};


}
)( );
