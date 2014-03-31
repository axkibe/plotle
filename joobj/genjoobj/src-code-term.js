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
var Term =
Code.Term =
	function(
		tag, // magic cookie
		v_term // the term
	)
{
/**/if( CHECK )
/**/{
/**/	if( tag !== 595920373 )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	this.term =
		v_term;

	Jools.immute( this );
};


/*
| Creates a new Term object.
*/
Term.create =
Term.prototype.create =
	function(
		 // free strings
	)
{
	var
		inherit,
		v_term;

	if( this !== Term )
	{
		inherit =
			this;

		v_term =
			this.term;
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
			case 'term' :

				if( arg !== undefined )
				{
					v_term =
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
/**/	if( v_term === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute term' );
/**/	}
/**/
/**/	if( v_term === null )
/**/	{
/**/		throw new Error( 'attribute term must not be null.' );
/**/	}
/**/
/**/	if(
/**/		typeof( v_term ) !== 'string'
/**/		&&
/**/		!( v_term instanceof String )
/**/	)
/**/	{
/**/		throw new Error( 'type mismatch' );
/**/	}
/**/}

	if(
		inherit
		&&
		v_term === inherit.term
	)
	{
		return inherit;
	}

	return (
		new Term(
			595920373,
			v_term
		)
	);
};


/*
| Reflection.
*/
Term.prototype.reflect =
	'Term';


/*
| Sets values by path.
*/
Term.prototype.setPath =
	JoobjProto.setPath;


/*
| Gets values by path
*/
Term.prototype.getPath =
	JoobjProto.getPath;


/*
| Tests equality of object.
*/
Term.prototype.equals =
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

	return this.term === obj.term;
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports =
		Term;
}


} )( );
