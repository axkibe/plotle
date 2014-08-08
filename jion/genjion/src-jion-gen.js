/*
| This is an auto generated file.
|
| DO NOT EDIT!
*/


/*
| Export.
*/
var
	Gen;


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
		v_jion // the jion definition
	)
	{
		this.jion = v_jion;

		this._init( );

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
Gen =
	{
		prototype :
			prototype
	};


/*
| Creates a new Gen object.
*/
Gen.create =
	prototype.create =
		function(
			// free strings
		)
	{
		var
			inherit,

			v_jion;

		if( this !== Gen )
		{
			inherit = this;

			v_jion = this.jion;
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
				case 'jion' :

					if( arg !== undefined )
					{
						v_jion = arg;
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
/**/		if( v_jion === undefined )
/**/		{
/**/			throw new Error( 'undefined attribute jion' );
/**/		}
/**/
/**/		if( v_jion === null )
/**/		{
/**/			throw new Error( 'attribute jion must not be null.' );
/**/		}
/**/	}

		if( inherit && v_jion === inherit.jion )
		{
			return inherit;
		}

		return new Constructor( v_jion );
	};


/*
| Reflection.
*/
prototype.reflect = 'Gen';


/*
| New Reflection.
*/
prototype.reflex = 'gen';


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

	return this.jion === obj.jion;
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports = Gen;
}


} )( );
