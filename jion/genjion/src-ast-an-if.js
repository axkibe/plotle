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

	ast = { };

	ast.aBlock = require( '../../src/ast/a-block' );
}


/*
| Constructor.
*/
var Constructor =
	function(
		v_condition, // the if condition
		v_elsewise, // the else wise
		v_then // the then code
	)
	{
		this.condition = v_condition;

		this.elsewise = v_elsewise;

		this.then = v_then;

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
	anIf =
	ast.anIf =
		{
			prototype :
				prototype
		};


/*
| Creates a new anIf object.
*/
anIf.create =
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

	if( this !== anIf )
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
/**/		if( v_elsewise.reflectName !== 'aBlock' )
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
/**/	if( v_then.reflectName !== 'aBlock' )
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

	return new Constructor( v_condition, v_elsewise, v_then );
};


/*
| Reflection.
*/
prototype.reflect = 'ast.anIf';


/*
| Name Reflection.
*/
prototype.reflectName = 'anIf';


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
	module.exports = anIf;
}


} )( );
