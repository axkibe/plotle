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
		v_string // the literal
	)
	{
		this.string = v_string;

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
	aStringLiteral =
		Code.aStringLiteral =
			{
				prototype :
					prototype
			};


/*
| Creates a new aStringLiteral object.
*/
aStringLiteral.create =
	prototype.create =
		function(
			// free strings
		)
	{
		var
			inherit,
			v_string;

		if( this !== aStringLiteral )
		{
			inherit = this;

			v_string = this.string;
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
				case 'string' :

					if( arg !== undefined )
					{
						v_string = arg;
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
/**/		if( v_string === undefined )
/**/		{
/**/			throw new Error( 'undefined attribute string' );
/**/		}
/**/
/**/		if( v_string === null )
/**/		{
/**/			throw new Error( 'attribute string must not be null.' );
/**/		}
/**/
/**/		if(
/**/			typeof( v_string ) !== 'string'
/**/			&&
/**/			!( v_string instanceof String )
/**/		)
/**/		{
/**/			throw new Error( 'type mismatch' );
/**/		}
/**/	}

		if( inherit && v_string === inherit.string )
		{
			return inherit;
		}

		return new Constructor( v_string );
	};


/*
| Reflection.
*/
prototype.reflect = 'aStringLiteral';


/*
| New Reflection.
*/
prototype.reflex = 'code.aStringLiteral';


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

	return this.string === obj.string;
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports = aStringLiteral;
}


} )( );