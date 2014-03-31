/*
| This is an autogenerated file.
|
| DO NOT EDIT!
*/


/*
| Export
*/
var
	Code =
		Code || { };


/*
| Imports
*/
var
	JoobjProto,
	Jools;


/*
| Capsule
*/
(function( ) {
'use strict';


var
	_tag =
		672829465;


/*
| Node includes
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
var Assign =
Code.Assign =
	function(
		tag,
		v_left,  // left-hand side
		v_right  // right-hand side
	)
{

/**/if( CHECK )
/**/{
/**/	if( tag !== _tag )
/**/	{
/**/		throw new Error(
/**/			'tag mismatch'
/**/		);
/**/	}
/**/}

	this.left =
		v_left;

	this.right =
		v_right;

	Jools.immute( this );
};


/*
| Creates a new Assign object.
*/
Assign.create =
Assign.prototype.create =
	function(
		// free strings
	)
{
	var
		inherit,
		v_left,
		v_right;

	if( this !== Assign )
	{
		inherit =
			this;

		v_left =
			this.left;

		v_right =
			this.right;
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
			case 'left' :

				if( arg !== undefined )
				{
					v_left =
						arg;
				}

				break;

			case 'right' :

				if( arg !== undefined )
				{
					v_right =
						arg;
				}

				break;

			default :

/**/			if( CHECK )
/**/			{
/**/				throw new Error(
/**/					'invalid argument: ' + arguments[ a ]
/**/				);
/**/			}
		}
	}

/**/if( CHECK )
/**/{
/**/
/**/	if( v_left === undefined )
/**/	{
/**/		throw new Error(
/**/			'undefined attribute left'
/**/		);
/**/	}
/**/
/**/	if( v_left === null )
/**/	{
/**/		throw new Error(
/**/			'left must not be null'
/**/		);
/**/	}
/**/
/**/	if( v_right === undefined )
/**/	{
/**/		throw new Error(
/**/			'undefined attribute right'
/**/		);
/**/	}
/**/
/**/	if( v_right === null )
/**/	{
/**/		throw new Error(
/**/			'right must not be null'
/**/		);
/**/	}
/**/}

	if(
		inherit
		&&
		v_left === inherit.left
		&&
		v_right === inherit.right
	)
	{
		return inherit;
	}

	return (
		new Assign(
			_tag,
			v_left,
			v_right
		)
	);
};


/*
| Reflection.
*/
Assign.prototype.reflect =
	'Assign';


/*
| Sets values by path.
*/
Assign.prototype.setPath =
	JoobjProto.setPath;


/*
| Gets values by path.
*/
Assign.prototype.getPath =
	JoobjProto.getPath;


/*
| Checks for equal objects.
*/
Assign.prototype.equals =
	function(
		obj
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
		this.left.equals( obj.left )
		&&
		this.right.equals( obj.right )
	);
};


/*
| Node export
*/
if( SERVER )
{
	module.exports =
		Assign;
}


} )( );
