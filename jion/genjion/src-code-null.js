/*
| This is an auto generated file.
|
| DO NOT EDIT!
*/


/*
| Export.
*/
var
	Code =
		Code || { };


/*
| Imports.
*/
var
	JoobjProto,
	Jools;


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

	Jools = require( '../../src/jools/jools' );
}


/*
| Constructor.
*/
var Constructor =
	function( ) { Jools.immute( this ); };


/*
| Prototype shortcut
*/
var
	prototype =
		Constructor.prototype;


/*
| Jion
*/
var
	Null =
	Code.Null =
		{
			prototype :
				Constructor.prototype
		};


/*
| Singleton
*/
var
	_singleton =
		null;


/*
| Creates a new Null object.
*/
Null.create =
Constructor.prototype.create =
	function(
		// free strings
	)
{
	var
		inherit;

	if( this !== Null )
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
prototype.reflect = 'Null';


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
	module.exports = Null;
}


} )( );
