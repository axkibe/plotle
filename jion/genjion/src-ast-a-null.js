/*
| This is an auto generated file.
|
| DO NOT EDIT!
*/


/*
| Export.
*/
var
	ast =
		ast || { };


/*
| Imports.
*/
var
	JoobjProto,


	jools;


/*
| Capulse.
*/
( function( ) {
'use strict';


/*
| Node includes.
*/
if( SERVER )
{
	JoobjProto = require( '../../src/jion/proto' );

	jools = require( '../../src/jools/jools' );
}


/*
| Constructor.
*/
var Constructor =
	function( ) { jools.immute( this ); };


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
	aNull =
	ast.aNull =
		{
			prototype :
				prototype
		};


/*
| Singleton
*/
var
	_singleton =
		null;


/*
| Creates a new aNull object.
*/
aNull.create =
prototype.create =
	function(
		// free strings
	)
{
	var
		inherit;

	if( this !== aNull )
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
prototype.reflect = 'ast.aNull';


/*
| Name Reflection.
*/
prototype.reflectName = 'aNull';


/*
| Sets values by path.
*/
prototype.setPath = JoobjProto.setPath;


/*
| Gets values by path
*/
prototype.getPath = JoobjProto.getPath;


/*
| Tests equality of object.
*/
Constructor.prototype.equals =
	function( obj // object to compare to
) { return this === obj; };


/*
| Node export.
*/
if( SERVER )
{
	module.exports = aNull;
}


} )( );
