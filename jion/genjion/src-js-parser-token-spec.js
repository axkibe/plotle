/*
| This is an auto generated file.
|
| DO NOT EDIT!
*/


/*
| Export.
*/
var
	jsParser;


jsParser = jsParser || { };


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


Constructor =
	function(
		v_astCreator, // For some handlers, the ast creator function for it to call
		v_handler, // Handler function to be called
		v_postPrec, // operator precedence in postfix conditions
		v_prePrec // operator precedence in prefix conditions
	)
{
	if( v_astCreator !== undefined )
	{
		this.astCreator = v_astCreator;
	}

	this.handler = v_handler;

	this.postPrec = v_postPrec;

	this.prePrec = v_prePrec;

	jools.immute( this );
};


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
	tokenSpec;


tokenSpec =
jsParser.tokenSpec =
	{
		prototype :
			prototype
	};


if( SERVER )
{
	module.exports = tokenSpec;
}


/*
| Creates a new tokenSpec object.
*/
tokenSpec.create =
prototype.create =
	function(
		// free strings
	)
{
	var
		a,
		aZ,
		arg,
		inherit,
		v_astCreator,
		v_handler,
		v_postPrec,
		v_prePrec;

	if( this !== tokenSpec )
	{
		inherit = this;

		v_astCreator = this.astCreator;

		v_handler = this.handler;

		v_postPrec = this.postPrec;

		v_prePrec = this.prePrec;
	}

	for(
		a = 0, aZ = arguments.length;
		a < aZ;
		a += 2
	)
	{
		arg = arguments[ a + 1 ];

		switch( arguments[ a ] )
		{
			case 'astCreator' :

				if( arg !== undefined )
				{
					v_astCreator = arg;
				}

				break;

			case 'handler' :

				if( arg !== undefined )
				{
					v_handler = arg;
				}

				break;

			case 'postPrec' :

				if( arg !== undefined )
				{
					v_postPrec = arg;
				}

				break;

			case 'prePrec' :

				if( arg !== undefined )
				{
					v_prePrec = arg;
				}

				break;

			default :

/**/			if( CHECK )
/**/			{
/**/				throw new Error( );
/**/			}
		}
	}

	if( v_astCreator === undefined )
	{
		v_astCreator = undefined;
	}

/**/if( CHECK )
/**/{
/**/	if( v_astCreator === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_handler === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_handler === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_postPrec === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_postPrec === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if(
/**/		typeof( v_postPrec ) !== 'number'
/**/		||
/**/		Math.floor( v_postPrec ) !== v_postPrec
/**/	)
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_prePrec === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_prePrec === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if(
/**/		typeof( v_prePrec ) !== 'number'
/**/		||
/**/		Math.floor( v_prePrec ) !== v_prePrec
/**/	)
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if(
		inherit
		&&
		v_astCreator === inherit.astCreator
		&&
		v_handler === inherit.handler
		&&
		v_postPrec === inherit.postPrec
		&&
		v_prePrec === inherit.prePrec
	)
	{
		return inherit;
	}

	return (
		new Constructor(
			v_astCreator,
			v_handler,
			v_postPrec,
			v_prePrec
		)
	);
};


/*
| Reflection.
*/
prototype.reflect = 'jsParser.tokenSpec';


/*
| Name Reflection.
*/
prototype.reflectName = 'tokenSpec';


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

	return (
		this.astCreator === obj.astCreator
		&&
		this.handler === obj.handler
		&&
		this.postPrec === obj.postPrec
		&&
		this.prePrec === obj.prePrec
	);
};


}
)( );
