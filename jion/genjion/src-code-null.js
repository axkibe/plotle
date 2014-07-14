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
var Null =
Code.Null =
	function(
		tag // magic cookie
	)
{
/**/if( CHECK )
/**/{
/**/	if( tag !== 8833 )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	Jools.immute( this );
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
Null.Create =
Null.prototype.Create =
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
		_singleton = new Null( 8833 );
	}

	return _singleton;
};


/*
| Reflection.
*/
Null.prototype.reflect = 'Null';


/*
| Sets values by path.
*/
Null.prototype.setPath = JoobjProto.setPath;


/*
| Gets values by path
*/
Null.prototype.getPath = JoobjProto.getPath;


/*
| Tests equality of object.
*/
Null.prototype.equals =
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
