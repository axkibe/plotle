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
	jion,


	jools;


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
			v_string // the literal
		)
	{
		this.string = v_string;

		jools.immute( this );
	};

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
	astString =
	ast.astString =
		{
			prototype :
				prototype
		};

/*
| Creates a new astString object.
*/
astString.create =
prototype.create =
	function(
		// free strings
	)
{
	var
		inherit,

		v_string;

	if( this !== astString )
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

/**/			if( CHECK )
/**/			{
/**/				throw new Error( );
/**/			}
		}
	}

/**/if( CHECK )
/**/{
/**/	if( v_string === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_string === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if(
/**/		typeof( v_string ) !== 'string'
/**/		&&
/**/		!( v_string instanceof String )
/**/	)
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if( inherit && v_string === inherit.string )
	{
		return inherit;
	}

	return new Constructor( v_string );
};

/*
| Reflection.
*/
prototype.reflect = 'ast.astString';

/*
| Name Reflection.
*/
prototype.reflectName = 'astString';

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

	return this.string === obj.string;
};

/*
| Node export.
*/
if( SERVER )
{
	module.exports = astString;
}


}
)( );
