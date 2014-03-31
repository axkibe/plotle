/*
| This is an auto generated file.
|
| DO NOT EDIT!
*/


/*
| Export.
*/
var
	GenV2;


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
GenV2 =
	function(
		tag, // magic cookie
		v_joobj // the joobj definition
	)
{
/**/if( CHECK )
/**/{
/**/	if( tag !== 815202645 )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	this.joobj =
		v_joobj;

	this._init( );

	Jools.immute( this );
};


/*
| Creates a new GenV2 object.
*/
GenV2.create =
GenV2.prototype.create =
	function(
		 // free strings
	)
{
	var
		inherit,
		v_joobj;

	if( this !== GenV2 )
	{
		inherit =
			this;

		v_joobj =
			this.joobj;
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
			case 'joobj' :

				if( arg !== undefined )
				{
					v_joobj =
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
/**/	if( v_joobj === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute joobj' );
/**/	}
/**/
/**/	if( v_joobj === null )
/**/	{
/**/		throw new Error( 'attribute joobj must not be null.' );
/**/	}
/**/}

	if(
		inherit
		&&
		v_joobj === inherit.joobj
	)
	{
		return inherit;
	}

	return (
		new GenV2(
			815202645,
			v_joobj
		)
	);
};


/*
| Reflection.
*/
GenV2.prototype.reflect =
	'GenV2';


/*
| Sets values by path.
*/
GenV2.prototype.setPath =
	JoobjProto.setPath;


/*
| Gets values by path
*/
GenV2.prototype.getPath =
	JoobjProto.getPath;


/*
| Tests equality of object.
*/
GenV2.prototype.equals =
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

	return this.joobj === obj.joobj;
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports =
		GenV2;
}


} )( );
