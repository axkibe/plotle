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
	JoobjProto =
		require( '../../src/joobj/proto' );

	Jools =
		require( '../../src/jools/jools' );
}


/*
| Constructor.
*/
var ForIn =
Code.ForIn =
	function(
		tag, // magic cookie
		v_block, // the for block
		v_object, // the object to iterate over
		v_variable // the loop variable
	)
{
/**/if( CHECK )
/**/{
/**/	if( tag !== 8833 )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	this.block =
		v_block;

	this.object =
		v_object;

	this.variable =
		v_variable;

	Jools.immute( this );
};


/*
| Creates a new ForIn object.
*/
ForIn.Create =
ForIn.prototype.Create =
	function(
		// free strings
	)
{
	var
		inherit,
		v_block,
		v_object,
		v_variable;

	if( this !== ForIn )
	{
		inherit =
			this;

		v_block =
			this.block;

		v_object =
			this.object;

		v_variable =
			this.variable;
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
			case 'block' :

				if( arg !== undefined )
				{
					v_block =
						arg;
				}

				break;

			case 'object' :

				if( arg !== undefined )
				{
					v_object =
						arg;
				}

				break;

			case 'variable' :

				if( arg !== undefined )
				{
					v_variable =
						arg;
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
/**/	if( v_block === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute block' );
/**/	}
/**/
/**/	if( v_block === null )
/**/	{
/**/		throw new Error( 'attribute block must not be null.' );
/**/	}
/**/
/**/	if( v_block.reflect !== 'Block' )
/**/	{
/**/		throw new Error( 'type mismatch' );
/**/	}
/**/
/**/	if( v_object === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute object' );
/**/	}
/**/
/**/	if( v_object === null )
/**/	{
/**/		throw new Error( 'attribute object must not be null.' );
/**/	}
/**/
/**/	if( v_object.reflect !== 'Term' )
/**/	{
/**/		throw new Error( 'type mismatch' );
/**/	}
/**/
/**/	if( v_variable === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute variable' );
/**/	}
/**/
/**/	if( v_variable === null )
/**/	{
/**/		throw new Error( 'attribute variable must not be null.' );
/**/	}
/**/
/**/	if(
/**/		typeof( v_variable ) !== 'string'
/**/		&&
/**/		!( v_variable instanceof String )
/**/	)
/**/	{
/**/		throw new Error( 'type mismatch' );
/**/	}
/**/}

	if(
		inherit && v_block.equals( inherit.block )
		&&
		v_object.equals( inherit.object )
		&&
		v_variable === inherit.variable
	)
	{
		return inherit;
	}

	return new ForIn( 8833, v_block, v_object, v_variable );
};


/*
| Reflection.
*/
ForIn.prototype.reflect =
	'ForIn';


/*
| Sets values by path.
*/
ForIn.prototype.setPath =
	JoobjProto.setPath;


/*
| Gets values by path
*/
ForIn.prototype.getPath =
	JoobjProto.getPath;


/*
| Tests equality of object.
*/
ForIn.prototype.equals =
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
		this.block === obj.block && this.object === obj.object
		&&
		this.variable === obj.variable
	);
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports =
		ForIn;
}


} )( );
