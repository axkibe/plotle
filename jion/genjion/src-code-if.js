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
var If =
Code.If =
	function(
		tag, // magic cookie
		v_condition, // the if condition
		v_elsewise, // the else wise
		v_then // the then code
	)
{
/**/if( CHECK )
/**/{
/**/	if( tag !== 8833 )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	this.condition = v_condition;

	this.elsewise = v_elsewise;

	this.then = v_then;

	Jools.immute( this );
};


/*
| Creates a new If object.
*/
If.Create =
If.prototype.Create =
	function(
		// free strings
	)
{
	var
		inherit,
		v_condition,
		v_elsewise,
		v_then;

	if( this !== If )
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

	if( v_elsewise === undefined )
	{
		v_elsewise = null;
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
/**/	if( v_elsewise !== null )
/**/	{
/**/		if( v_elsewise.reflect !== 'Block' )
/**/		{
/**/			throw new Error( 'type mismatch' );
/**/		}
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
/**/
/**/	if( v_then.reflect !== 'Block' )
/**/	{
/**/		throw new Error( 'type mismatch' );
/**/	}
/**/}

	if(
		inherit
		&&
		v_condition === inherit.condition
		&&
		(
			v_elsewise === inherit.elsewise
			||
			v_elsewise && v_elsewise.equals( inherit.elsewise )
		)
		&&
		v_then.equals( inherit.then )
	)
	{
		return inherit;
	}

	return new If( 8833, v_condition, v_elsewise, v_then );
};


/*
| Reflection.
*/
If.prototype.reflect = 'If';


/*
| Sets values by path.
*/
If.prototype.setPath = JoobjProto.setPath;


/*
| Gets values by path
*/
If.prototype.getPath = JoobjProto.getPath;


/*
| Tests equality of object.
*/
If.prototype.equals =
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
		(
			this.elsewise === obj.elsewise
			||
			this.elsewise !== null
			&&
			this.elsewise.equals
			&&
			this.elsewise.equals( obj.elsewise )
		)
		&&
		this.then === obj.then
	);
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports = If;
}


} )( );
