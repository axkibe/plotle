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
		303584922;


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
var For =
Code.For =
	function(
		tag,
		v_block,     // the for block
		v_condition, // the continue conditoin
		v_init,      // the initialization
		v_iterate    // the iteration term
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

	this.condition =
		v_condition;

	this.init =
		v_init;

	this.iterate =
		v_iterate;

	Jools.immute( this );
};


/*
| Creates a new For object.
*/
For.create =
For.prototype.create =
	function(
		// free strings
	)
{
	var
		inherit,
		v_block,
		v_condition,
		v_init,
		v_iterate;

	if( this !== For )
	{
		inherit =
			this;

		v_block =
			this.block;

		v_condition =
			this.condition;

		v_init =
			this.init;

		v_iterate =
			this.iterate;
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

			case 'condition' :

				if( arg !== undefined )
				{
					v_condition =
						arg;
				}

				break;

			case 'init' :

				if( arg !== undefined )
				{
					v_init =
						arg;
				}

				break;

			case 'iterate' :

				if( arg !== undefined )
				{
					v_iterate =
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
/**/	if( v_condition === undefined )
/**/	{
/**/		throw new Error(
/**/			'undefined attribute condition'
/**/		);
/**/	}
/**/
/**/	if( v_condition === null )
/**/	{
/**/		throw new Error(
/**/			'condition must not be null'
/**/		);
/**/	}
/**/	if( v_condition.reflect !== 'Term' )
/**/	{
/**/		throw new Error(
/**/			'type mismatch'
/**/		);
/**/	}
/**/
/**/	if( v_init === undefined )
/**/	{
/**/		throw new Error(
/**/			'undefined attribute init'
/**/		);
/**/	}
/**/
/**/	if( v_init === null )
/**/	{
/**/		throw new Error(
/**/			'init must not be null'
/**/		);
/**/	}
/**/
/**/	if( v_iterate === undefined )
/**/	{
/**/		throw new Error(
/**/			'undefined attribute iterate'
/**/		);
/**/	}
/**/
/**/	if( v_iterate === null )
/**/	{
/**/		throw new Error(
/**/			'iterate must not be null'
/**/		);
/**/	}
/**/	if( v_iterate.reflect !== 'Term' )
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
		v_condition.equals( inherit.condition )
		&&
		v_init === inherit.init
		&&
		v_iterate.equals( inherit.iterate )
	)
	{
		return inherit;
	}

	return (
		new For(
			_tag,
			v_block,
			v_condition,
			v_init,
			v_iterate
		)
	);
};


/*
| Reflection.
*/
For.prototype.reflect =
	'For';


/*
| Sets values by path.
*/
For.prototype.setPath =
	JoobjProto.setPath;


/*
| Gets values by path.
*/
For.prototype.getPath =
	JoobjProto.getPath;


/*
| Checks for equal objects.
*/
For.prototype.equals =
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
		this.condition.equals( obj.condition )
		&&
		this.init.equals( obj.init )
		&&
		this.iterate.equals( obj.iterate )
	);
};


/*
| Node export
*/
if( SERVER )
{
	module.exports =
		For;
}


} )( );
