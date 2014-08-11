/*
| This is an auto generated file.
|
| DO NOT EDIT!
*/


/*
| Export.
*/
var
	Context;


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
		v_check, // true if within optinal CHECK code
		v_indent, // the indentation
		v_inline, // true if to be formated inline
		v_root // true if in root context
	)
	{
		this.check = v_check;

		this.indent = v_indent;

		this.inline = v_inline;

		this.root = v_root;

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
Context =
	{
		prototype :
			prototype
	};


/*
| Creates a new Context object.
*/
Context.create =
prototype.create =
	function(
		// free strings
	)
{
	var
		inherit,

		v_check,

		v_indent,

		v_inline,

		v_root;

	if( this !== Context )
	{
		inherit = this;

		v_check = this.check;

		v_indent = this.indent;

		v_inline = this.inline;

		v_root = this.root;
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
			case 'check' :

				if( arg !== undefined )
				{
					v_check = arg;
				}

				break;

			case 'indent' :

				if( arg !== undefined )
				{
					v_indent = arg;
				}

				break;

			case 'inline' :

				if( arg !== undefined )
				{
					v_inline = arg;
				}

				break;

			case 'root' :

				if( arg !== undefined )
				{
					v_root = arg;
				}

				break;

			default :

/**/			if( CHECK )
/**/			{
/**/				throw new Error( 'invalid argument' );
/**/			}
		}
	}

	if( v_check === undefined )
	{
		v_check = false;
	}

	if( v_indent === undefined )
	{
		v_indent = 0;
	}

	if( v_inline === undefined )
	{
		v_inline = false;
	}

/**/if( CHECK )
/**/{
/**/	if( v_check === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute check' );
/**/	}
/**/
/**/	if( v_check === null )
/**/	{
/**/		throw new Error( 'attribute check must not be null.' );
/**/	}
/**/
/**/	if( typeof( v_check ) !== 'boolean' )
/**/	{
/**/		throw new Error( 'type mismatch' );
/**/	}
/**/
/**/	if( v_indent === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute indent' );
/**/	}
/**/
/**/	if( v_indent === null )
/**/	{
/**/		throw new Error( 'attribute indent must not be null.' );
/**/	}
/**/
/**/	if(
/**/		typeof( v_indent ) !== 'number'
/**/		||
/**/		Math.floor( v_indent ) !== v_indent
/**/	)
/**/	{
/**/		throw new Error( 'type mismatch' );
/**/	}
/**/
/**/	if( v_inline === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute inline' );
/**/	}
/**/
/**/	if( v_inline === null )
/**/	{
/**/		throw new Error( 'attribute inline must not be null.' );
/**/	}
/**/
/**/	if( typeof( v_inline ) !== 'boolean' )
/**/	{
/**/		throw new Error( 'type mismatch' );
/**/	}
/**/
/**/	if( v_root === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute root' );
/**/	}
/**/
/**/	if( v_root === null )
/**/	{
/**/		throw new Error( 'attribute root must not be null.' );
/**/	}
/**/
/**/	if( typeof( v_root ) !== 'boolean' )
/**/	{
/**/		throw new Error( 'type mismatch' );
/**/	}
/**/}

	if(
		inherit
		&&
		v_check === inherit.check
		&&
		v_indent === inherit.indent
		&&
		v_inline === inherit.inline
		&&
		v_root === inherit.root
	)
	{
		return inherit;
	}

	return new Constructor( v_check, v_indent, v_inline, v_root );
};


/*
| Reflection.
*/
prototype.reflect = 'Context';


/*
| New Reflection.
*/
prototype.reflex = 'context';


/*
| Name Reflection.
*/
prototype.reflexName = 'Context';


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
		this.check === obj.check
		&&
		this.indent === obj.indent
		&&
		this.inline === obj.inline
		&&
		this.root === obj.root
	);
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports = Context;
}


} )( );
