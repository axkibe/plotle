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
		require(
			'../../src/joobj/proto'
		);

	Jools =
		require( '../../src/jools/jools' );
}


/*
| Constructor.
*/
var Check =
Code.Check =
	function(
		tag, // magic cookie
		v_block // the code block
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

	Jools.immute( this );
};


/*
| Creates a new Check object.
*/
Check.Create =
Check.prototype.Create =
	function(
		// free strings
	)
{
	var
		inherit,
		v_block;

	if( this !== Check )
	{
		inherit =
			this;

		v_block =
			this.block;
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
/**/}

	if(
		inherit
		&&
		v_block.equals(
			inherit.block
		)
	)
	{
		return inherit;
	}

	return new Check( 8833, v_block );
};


/*
| Reflection.
*/
Check.prototype.reflect =
	'Check';


/*
| Sets values by path.
*/
Check.prototype.setPath =
	JoobjProto.setPath;


/*
| Gets values by path
*/
Check.prototype.getPath =
	JoobjProto.getPath;


/*
| Tests equality of object.
*/
Check.prototype.equals =
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

	return this.block === obj.block;
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports =
		Check;
}


} )( );
