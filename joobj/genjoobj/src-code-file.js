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
var File =
Code.File =
	function(
		tag, // magic cookie
		v_capsule, // the capsule
		v_header, // header comment
		v_preamble // preamble to capsule
	)
{
/**/if( CHECK )
/**/{
/**/	if( tag !== 8833 )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	this.capsule =
		v_capsule;

	this.header =
		v_header;

	this.preamble =
		v_preamble;

	Jools.immute( this );
};


/*
| Creates a new File object.
*/
File.Create =
File.prototype.Create =
	function(
		// free strings
	)
{
	var
		inherit,
		v_capsule,
		v_header,
		v_preamble;

	if( this !== File )
	{
		inherit =
			this;

		v_capsule =
			this.capsule;

		v_header =
			this.header;

		v_preamble =
			this.preamble;
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
					v_capsule =
						arg;
				}

				break;

			case 'header' :

				if( arg !== undefined )
				{
					v_header =
						arg;
				}

				break;

			case 'preamble' :

				if( arg !== undefined )
				{
					v_preamble =
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

	if( v_capsule === undefined )
	{
		v_capsule =
			null;
	}

	if( v_header === undefined )
	{
		v_header =
			null;
	}

	if( v_preamble === undefined )
	{
		v_preamble =
			null;
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
/**/		if( v_capsule.reflect !== 'Block' )
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
/**/		if( v_header.reflect !== 'Comment' )
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
/**/		if( v_preamble.reflect !== 'Block' )
/**/		{
/**/			throw new Error( 'type mismatch' );
/**/		}
/**/	}
/**/}

	if(
		inherit
		&&
		(v_capsule === inherit.capsule||(v_capsule&&v_capsule.equals( inherit.capsule)))
		&&
		(v_header === inherit.header||(v_header&&v_header.equals( inherit.header)))
		&&
		(v_preamble === inherit.preamble||(v_preamble&&v_preamble.equals( inherit.preamble)))
	)
	{
		return inherit;
	}

	return (
		new File(
			8833,
			v_capsule,
			v_header,
			v_preamble
		)
	);
};


/*
| Reflection.
*/
File.prototype.reflect =
	'File';


/*
| Sets values by path.
*/
File.prototype.setPath =
	JoobjProto.setPath;


/*
| Gets values by path
*/
File.prototype.getPath =
	JoobjProto.getPath;


/*
| Tests equality of object.
*/
File.prototype.equals =
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
		(this.capsule === obj.capsule ||(this.capsule !== null && this.capsule.equals( obj.capsule )))
		&&
		(this.header === obj.header ||(this.header !== null && this.header.equals( obj.header )))
		&&
		(this.preamble === obj.preamble ||(this.preamble !== null && this.preamble.equals( obj.preamble )))
	);
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports =
		File;
}


} )( );
