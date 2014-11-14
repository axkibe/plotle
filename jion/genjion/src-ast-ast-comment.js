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


/*
| Imports.
*/
var
	jion,


	jools,


	jion;


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
			v_content // comment content
		)
	{
		this.content = v_content;

		jools.immute( this );
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
var
	astComment;

astComment =
ast.astComment =
module.exports =
	{
		prototype :
			prototype
	};

/*
| Creates a new astComment object.
*/
astComment.create =
prototype.create =
	function(
		// free strings
	)
{
	var
		inherit,

		v_content;

	if( this !== astComment )
	{
		inherit = this;

		v_content = this.content;
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
prototype.reflect = 'ast.astComment';

/*
| Name Reflection.
*/
prototype.reflectName = 'astComment';

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

	return this.content.equals( obj.content );
};

/*
| Node export.
*/
if( SERVER )
{
	module.exports = astComment;
}


}
)( );
