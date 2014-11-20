/*
| This is an auto generated file.
|
| DO NOT EDIT!
*/


/*
| Export.
*/
var
	ast;


ast = ast || { };


var
	ast_astFile;


/*
| Imports.
*/
var
	jion,
	jools,
	ast,
	jion;


/*
| Capsule
*/
(
function( ) {
'use strict';


/*
| Node includes.
*/
if( SERVER )
{
	jools = require( '../../src/jools/jools' );

	ast = { };

	jion = { };

	ast.astBlock = require( '../../src/ast/ast-block' );

	ast.astComment = require( '../../src/ast/ast-comment' );

	jion.proto = require( '../../src/jion/proto' );
}


/*
| Constructor.
*/
var
	Constructor;


Constructor =
	function(
		v_capsule, // the capsule
		v_hasJSON, // boolean if the jion supports jsonfying
		v_header, // header comment
		v_jionID, // the id of the jion associated
		v_preamble // preamble to capsule
	)
{
	this.capsule = v_capsule;

	this.hasJSON = v_hasJSON;

	this.header = v_header;

	this.jionID = v_jionID;

	this.preamble = v_preamble;

	jools.immute( this );
};


/*
| Prototype shortcut
*/
var
	prototype;


prototype = Constructor.prototype;


/*
| Jion.
*/
ast_astFile =
ast.astFile =
	{
		prototype :
			prototype
	};


if( SERVER )
{
	module.exports = ast_astFile;
}


/*
| Creates a new astFile object.
*/
ast_astFile.create =
prototype.create =
	function(
		// free strings
	)
{
	var
		a,
		aZ,
		arg,
		inherit,
		v_capsule,
		v_hasJSON,
		v_header,
		v_jionID,
		v_preamble;

	if( this !== ast_astFile )
	{
		inherit = this;

		v_capsule = this.capsule;

		v_hasJSON = this.hasJSON;

		v_header = this.header;

		v_jionID = this.jionID;

		v_preamble = this.preamble;
	}

	for(
		a = 0, aZ = arguments.length;
		a < aZ;
		a += 2
	)
	{
		arg = arguments[ a + 1 ];

		switch( arguments[ a ] )
		{
			case 'capsule' :

				if( arg !== undefined )
				{
					v_capsule = arg;
				}

				break;

			case 'hasJSON' :

				if( arg !== undefined )
				{
					v_hasJSON = arg;
				}

				break;

			case 'header' :

				if( arg !== undefined )
				{
					v_header = arg;
				}

				break;

			case 'jionID' :

				if( arg !== undefined )
				{
					v_jionID = arg;
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
/**/				throw new Error( );
/**/			}
		}
	}

	if( v_capsule === undefined )
	{
		v_capsule = null;
	}

	if( v_hasJSON === undefined )
	{
		v_hasJSON = null;
	}

	if( v_header === undefined )
	{
		v_header = null;
	}

	if( v_jionID === undefined )
	{
		v_jionID = null;
	}

	if( v_preamble === undefined )
	{
		v_preamble = null;
	}

/**/if( CHECK )
/**/{
/**/	if( v_capsule === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_capsule !== null )
/**/	{
/**/		if( v_capsule.reflect !== 'ast.astBlock' )
/**/		{
/**/			throw new Error( );
/**/		}
/**/	}
/**/
/**/	if( v_hasJSON === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_hasJSON !== null )
/**/	{
/**/		if( typeof( v_hasJSON ) !== 'boolean' )
/**/		{
/**/			throw new Error( );
/**/		}
/**/	}
/**/
/**/	if( v_header === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_header !== null )
/**/	{
/**/		if( v_header.reflect !== 'ast.astComment' )
/**/		{
/**/			throw new Error( );
/**/		}
/**/	}
/**/
/**/	if( v_jionID === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_jionID !== null )
/**/	{
/**/		if(
/**/			typeof( v_jionID ) !== 'string'
/**/			&&
/**/			!( v_jionID instanceof String )
/**/		)
/**/		{
/**/			throw new Error( );
/**/		}
/**/	}
/**/
/**/	if( v_preamble === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_preamble !== null )
/**/	{
/**/		if( v_preamble.reflect !== 'ast.astBlock' )
/**/		{
/**/			throw new Error( );
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
		v_hasJSON === inherit.hasJSON
		&&
		(
			v_header === inherit.header
			||
			v_header && v_header.equals( inherit.header )
		)
		&&
		v_jionID === inherit.jionID
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

	return (
		new Constructor(
			v_capsule,
			v_hasJSON,
			v_header,
			v_jionID,
			v_preamble
		)
	);
};


/*
| Reflection.
*/
prototype.reflect = 'ast.astFile';


/*
| Name Reflection.
*/
prototype.reflectName = 'astFile';


/*
| Sets values by path.
*/
prototype.setPath = jion.proto.setPath;


/*
| Gets values by path
*/
prototype.getPath = jion.proto.getPath;


/*
| Tests equality of object.
*/
prototype.equals =
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
			this.capsule !== null && this.capsule.equals( obj.capsule )
		)
		&&
		this.hasJSON === obj.hasJSON
		&&
		(
			this.header === obj.header
			||
			this.header !== null && this.header.equals( obj.header )
		)
		&&
		this.jionID === obj.jionID
		&&
		(
			this.preamble === obj.preamble
			||
			this.preamble !== null && this.preamble.equals( obj.preamble )
		)
	);
};


}
)( );
