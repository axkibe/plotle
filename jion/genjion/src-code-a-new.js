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
	function(
		v_call // the constrcutor call
	)
	{
		this.call = v_call;

		Jools.immute( this );
	};


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
	aNew =
		Code.aNew =
			{
				prototype :
					prototype
			};


/*
| Creates a new aNew object.
*/
aNew.create =
	prototype.create =
		function(
			// free strings
		)
	{
		var
			inherit,
			v_call;

		if( this !== aNew )
		{
			inherit = this;

			v_call = this.call;
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
				case 'call' :

					if( arg !== undefined )
					{
						v_call = arg;
					}

					break;

				default :

/**/				if( CHECK )
/**/				{
/**/					throw new Error( 'invalid argument' );
/**/				}
			}
		}

/**/	if( CHECK )
/**/	{
/**/		if( v_call === undefined )
/**/		{
/**/			throw new Error( 'undefined attribute call' );
/**/		}
/**/
/**/		if( v_call === null )
/**/		{
/**/			throw new Error( 'attribute call must not be null.' );
/**/		}
/**/
/**/		if( v_call.reflect !== 'aCall' )
/**/		{
/**/			throw new Error( 'type mismatch' );
/**/		}
/**/	}

		if( inherit && v_call.equals( inherit.call ) )
		{
			return inherit;
		}

		return new Constructor( v_call );
	};


/*
| Reflection.
*/
prototype.reflect = 'aNew';


/*
| New Reflection.
*/
prototype.reflex = 'code.aNew';


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

	return this.call === obj.call;
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports = aNew;
}


} )( );
