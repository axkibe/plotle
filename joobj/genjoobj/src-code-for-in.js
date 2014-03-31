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
		307791246;


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
var ForIn =
Code.ForIn =
	function(
		tag,
		v_block,    // the for block
		v_object,   // the object to iterate over
		v_variable  // the loop variable
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
ForIn.create =
ForIn.prototype.create =
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
/**/				throw new Error(
/**/					'invalid argument: ' + arguments[ a ]
/**/				);
/**/			}
		}
	}

/**/if( CHECK )
/**/{
/**/
/**/	if( v_block === undefined )
/**/	{
/**/		throw new Error(
/**/			'undefined attribute block'
/**/		);
/**/	}
/**/
/**/	if( v_block === null )
/**/	{
/**/		throw new Error(
/**/			'block must not be null'
/**/		);
/**/	}
/**/	if( v_block.reflect !== 'Block' )
/**/	{
/**/		throw new Error(
/**/			'type mismatch'
/**/		);
/**/	}
/**/
/**/	if( v_object === undefined )
/**/	{
/**/		throw new Error(
/**/			'undefined attribute object'
/**/		);
/**/	}
/**/
/**/	if( v_object === null )
/**/	{
/**/		throw new Error(
/**/			'object must not be null'
/**/		);
/**/	}
/**/	if( v_object.reflect !== 'Term' )
/**/	{
/**/		throw new Error(
/**/			'type mismatch'
/**/		);
/**/	}
/**/
/**/	if( v_variable === undefined )
/**/	{
/**/		throw new Error(
/**/			'undefined attribute variable'
/**/		);
/**/	}
/**/
/**/	if( v_variable === null )
/**/	{
/**/		throw new Error(
/**/			'variable must not be null'
/**/		);
/**/	}
/**/	if(
/**/		typeof( v_variable ) !== 'string'
/**/		&&
/**/		!( v_variable instanceof String )
/**/	)
/**/	{
/**/		throw new Error(
/**/			'type mismatch'
/**/		);
/**/	}
/**/}

	if(
		inherit
		&&
		v_block.equals( inherit.block )
		&&
		v_object.equals( inherit.object )
		&&
		v_variable === inherit.variable
	)
	{
		return inherit;
	}

	return (
		new ForIn(
			_tag,
			v_block,
			v_object,
			v_variable
		)
	);
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
| Gets values by path.
*/
ForIn.prototype.getPath =
	JoobjProto.getPath;


/*
| Checks for equal objects.
*/
ForIn.prototype.equals =
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
		this.block.equals( obj.block )
		&&
		this.object.equals( obj.object )
		&&
		this.variable === obj.variable
	);
};


/*
| Node export
*/
if( SERVER )
{
	module.exports =
		ForIn;
}


} )( );
