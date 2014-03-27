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
		972776839;


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
var And =
Code.And =
	function(
		tag,
		v_left,  // left expression
		v_right  // right expression
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
| Creates a new And object.
*/
And.create =
And.prototype.create =
	function(
		// free strings
	)
{
	var
		inherit,
		v_left,
		v_right;

	if( this !== And )
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
		new And(
			_tag,
			v_left,
			v_right
		)
	);
};


/*
| Reflection.
*/
And.prototype.reflect =
	'And';


/*
| Sets values by path.
*/
And.prototype.setPath =
	JoobjProto.setPath;


/*
| Gets values by path.
*/
And.prototype.getPath =
	JoobjProto.getPath;


/*
| Checks for equal objects.
*/
And.prototype.equals =
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
		And;
}


} )( );
