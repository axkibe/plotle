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
	ast_astNull;


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
	function( )
{
/**/if( CHECK )
/**/{
/**/	if( prototype.__lazy )
/**/	{
/**/		this.__lazy = { };
/**/	}
/**/}

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
ast_astNull =
ast.astNull =
	{
		prototype :
			prototype
	};


if( SERVER )
{
	module.exports = ast_astNull;
}


/*
| Singleton
*/
var
	_singleton;


_singleton = null;


/*
| Creates a new astNull object.
*/
ast_astNull.create =
prototype.create =
	function(
		// free strings
	)
{
	var
		inherit;

	if( this !== ast_astNull )
	{
		inherit = this;
	}

/**/if( CHECK )
/**/{
/**/}

	if( inherit )
	{
		return inherit;
	}

	if( !_singleton )
	{
		_singleton = new Constructor( );
	}

	return _singleton;
};


/*
| Reflection.
*/
prototype.reflect = 'ast.astNull';


/*
| Reflection_.
*/
prototype.reflect_ = 'ast_astNull';


/*
| Name Reflection.
*/
prototype.reflectName = 'astNull';


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
	function( obj // object to compare to
) { return this === obj; };


}
)( );
