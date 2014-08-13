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

	ast.aComment = require( '../../src/ast/a-comment' );
}


/*
| Constructor.
*/
var Constructor =
	function(
		v_capsule, // the capsule
		v_header, // header comment
		v_preamble // preamble to capsule
	)
	{
		this.capsule = v_capsule;

		this.header = v_header;

		this.preamble = v_preamble;

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
	aFile =
	ast.aFile =
		{
			prototype :
				prototype
		};


/*
| Creates a new aFile object.
*/
aFile.create =
prototype.create =
	function(
		// free strings
	)
{
	var
		inherit,

		v_capsule,

		v_header,

		v_preamble;

	if( this !== aFile )
	{
		inherit = this;

		v_capsule = this.capsule;

		v_header = this.header;

		v_preamble = this.preamble;
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
			case 'capsule' :

				if( arg !== undefined )
				{
					v_capsule = arg;
				}

				break;

			case 'header' :

				if( arg !== undefined )
				{
					v_header = arg;
				}

				break;

			case 'preamble' :

				if( arg !== undefined )
				{
					v_preamble = arg;
				}

				break;

			default :

/**/			if( CHECK )
/**/			{
/**/				throw new Error( 'invalid argument' );
/**/			}
		}
	}

	if( v_capsule === undefined )
	{
		v_capsule = null;
	}

	if( v_header === undefined )
	{
		v_header = null;
	}

	if( v_preamble === undefined )
	{
		v_preamble = null;
	}

/**/if( CHECK )
/**/{
/**/	if( v_capsule === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute capsule' );
/**/	}
/**/
/**/	if( v_capsule !== null )
/**/	{
/**/		if( v_capsule.reflexName !== 'aBlock' )
/**/		{
/**/			throw new Error( 'type mismatch' );
/**/		}
/**/	}
/**/
/**/	if( v_header === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute header' );
/**/	}
/**/
/**/	if( v_header !== null )
/**/	{
/**/		if( v_header.reflexName !== 'aComment' )
/**/		{
/**/			throw new Error( 'type mismatch' );
/**/		}
/**/	}
/**/
/**/	if( v_preamble === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute preamble' );
/**/	}
/**/
/**/	if( v_preamble !== null )
/**/	{
/**/		if( v_preamble.reflexName !== 'aBlock' )
/**/		{
/**/			throw new Error( 'type mismatch' );
/**/		}
/**/	}
/**/}

	if(
		inherit
		&&
		(
			v_capsule === inherit.capsule
			||
			v_capsule && v_capsule.equals( inherit.capsule )
		)
		&&
		(
			v_header === inherit.header
			||
			v_header && v_header.equals( inherit.header )
		)
		&&
		(
			v_preamble === inherit.preamble
			||
			v_preamble && v_preamble.equals( inherit.preamble )
		)
	)
	{
		return inherit;
	}

	return new Constructor( v_capsule, v_header, v_preamble );
};


/*
| Reflection.
*/
prototype.reflect = 'aFile';


/*
| New Reflection.
*/
prototype.reflex = 'ast.aFile';


/*
| Name Reflection.
*/
prototype.reflexName = 'aFile';


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
		(
			this.capsule === obj.capsule
			||
			this.capsule !== null
			&&
			this.capsule.equals
			&&
			this.capsule.equals( obj.capsule )
		)
		&&
		(
			this.header === obj.header
			||
			this.header !== null
			&&
			this.header.equals
			&&
			this.header.equals( obj.header )
		)
		&&
		(
			this.preamble === obj.preamble
			||
			this.preamble !== null
			&&
			this.preamble.equals
			&&
			this.preamble.equals( obj.preamble )
		)
	);
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports = aFile;
}


} )( );
