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
	Constructor;


Constructor = function( ) { jools.immute( this ); };


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
	astNull;


astNull =
ast_astNull =
ast.astNull =
	{
		prototype :
			prototype
	};


if( SERVER )
{
	module.exports = astNull;
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
astNull.create =
prototype.create =
	function(
		// free strings
	)
{
	var
		inherit;

	if( this !== astNull )
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
| Name Reflection.
*/
prototype.reflectName = 'astNull';


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
	function( obj // object to compare to
) { return this === obj; };


}
)( );
