/*
| This is an auto generated file.
|
| DO NOT EDIT!
*/


/*
| Export.
*/
var
	ast_null;


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

	if( FREEZE )
	{
		Object.freeze( this );
	}
};


/*
| Prototype shortcut
*/
prototype = Constructor.prototype;


/*
| Jion.
*/
ast_null =
	{
		prototype :
			prototype
	};


if( SERVER )
{
	module.exports = ast_null;
}


/*
| Singleton
*/
var
	_singleton;


_singleton = null;


/*
| Creates a new null object.
*/
ast_null.create =
prototype.create =
	function(
		// free strings
	)
{
	var
		inherit;

	if( this !== ast_null )
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
prototype.reflect = 'ast_null';


/*
| Name Reflection.
*/
prototype.reflectName = 'null';


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
