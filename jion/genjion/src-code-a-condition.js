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
		v_condition, // the condition
		v_elsewise, // the else condition
		v_then // the then expression
	)
	{
		this.condition = v_condition;

		this.elsewise = v_elsewise;

		this.then = v_then;

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
	aCondition =
	Code.aCondition =
		{
			prototype :
				prototype
		};


/*
| Creates a new aCondition object.
*/
aCondition.create =
prototype.create =
	function(
		// free strings
	)
{
	var
		inherit,

		v_condition,

		v_elsewise,

		v_then;

	if( this !== aCondition )
	{
		inherit = this;

		v_condition = this.condition;

		v_elsewise = this.elsewise;

		v_then = this.then;
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
			case 'condition' :

				if( arg !== undefined )
				{
					v_condition = arg;
				}

				break;

			case 'elsewise' :

				if( arg !== undefined )
				{
					v_elsewise = arg;
				}

				break;

			case 'then' :

				if( arg !== undefined )
				{
					v_then = arg;
				}

				break;

			default :

/**/			if( CHECK )
/**/			{
/**/				throw new Error( 'invalid argument' );
/**/			}
		}
	}

/**/if( CHECK )
/**/{
/**/	if( v_condition === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute condition' );
/**/	}
/**/
/**/	if( v_condition === null )
/**/	{
/**/		throw new Error( 'attribute condition must not be null.' );
/**/	}
/**/
/**/	if( v_elsewise === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute elsewise' );
/**/	}
/**/
/**/	if( v_elsewise === null )
/**/	{
/**/		throw new Error( 'attribute elsewise must not be null.' );
/**/	}
/**/
/**/	if( v_then === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute then' );
/**/	}
/**/
/**/	if( v_then === null )
/**/	{
/**/		throw new Error( 'attribute then must not be null.' );
/**/	}
/**/}

	if(
		inherit
		&&
		v_condition === inherit.condition
		&&
		v_elsewise === inherit.elsewise
		&&
		v_then === inherit.then
	)
	{
		return inherit;
	}

	return new Constructor( v_condition, v_elsewise, v_then );
};


/*
| Reflection.
*/
prototype.reflect = 'aCondition';


/*
| New Reflection.
*/
prototype.reflex = 'code.aCondition';


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

	return (
		this.condition === obj.condition
		&&
		this.elsewise === obj.elsewise
		&&
		this.then === obj.then
	);
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports = aCondition;
}


} )( );
