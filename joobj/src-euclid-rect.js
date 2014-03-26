/*
| This is an autogenerated file.
|
| DO NOT EDIT!
*/


/*
| Export
*/
var
	Euclid =
		Euclid || { };


/*
| Imports
*/
var
	JoobjProto,
	Jools,
	Euclid;


/*
| Capsule
*/
(function( ) {
'use strict';


var
	_tag =
		417046867;


/*
| Node includes
*/
if( SERVER )
{
	JoobjProto =
		require( '../src/joobj/proto' );

	Jools =
		require( '../src/jools/jools' );

	Euclid =
		{ };

	Euclid.Point =
		require( '../src/euclid/point' );
}


/*
| Constructor.
*/
var Rect =
Euclid.Rect =
	function(
		tag,
		v_pnw, // point in north west
		v_pse  // point in south east
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

	this.pnw =
		v_pnw;

	this.pse =
		v_pse;

	Jools.immute( this );
};


/*
| Creates a new Rect object.
*/
Rect.create =
Rect.prototype.create =
	function(
		// free strings
	)
{
	var
		inherit,
		v_pnw,
		v_pse;

	if( this !== Rect )
	{
		inherit =
			this;

		v_pnw =
			this.pnw;

		v_pse =
			this.pse;
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
			case 'pnw' :

				if( arg !== undefined )
				{
					v_pnw =
						arg;
				}

				break;

			case 'pse' :

				if( arg !== undefined )
				{
					v_pse =
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
/**/	if( v_pnw === undefined )
/**/	{
/**/		throw new Error(
/**/			'undefined attribute pnw'
/**/		);
/**/	}
/**/
/**/	if( v_pnw === null )
/**/	{
/**/		throw new Error(
/**/			'pnw must not be null'
/**/		);
/**/	}
/**/	if( v_pnw.reflect !== 'Point' )
/**/	{
/**/		throw new Error(
/**/			'type mismatch'
/**/		);
/**/	}
/**/
/**/	if( v_pse === undefined )
/**/	{
/**/		throw new Error(
/**/			'undefined attribute pse'
/**/		);
/**/	}
/**/
/**/	if( v_pse === null )
/**/	{
/**/		throw new Error(
/**/			'pse must not be null'
/**/		);
/**/	}
/**/	if( v_pse.reflect !== 'Point' )
/**/	{
/**/		throw new Error(
/**/			'type mismatch'
/**/		);
/**/	}
/**/}

	if(
		inherit
		&&
		v_pnw.equals( inherit.pnw )
		&&
		v_pse.equals( inherit.pse )
	)
	{
		return inherit;
	}

	return (
		new Rect(
			_tag,
			v_pnw,
			v_pse
		)
	);
};


/*
| Creates a new Rect object from JSON
*/
Rect.createFromJSON =
	function(
		json // the json object
	)
{
	if( json._$grown ) return json;

	var
		v_pnw,
		v_pse;

	for( var aName in json )
	{
		var
			arg =
				json[ aName ];

		switch( aName )
		{
			case 'type' :

				if( arg !== 'Rect')
				{
					throw new Error(
						'invalid JSON'
					);
				}

				break;

			case 'pnw' :

				v_pnw =
					Euclid.Point.createFromJSON(
						arg
					);

				break;


			case 'pse' :

				v_pse =
					Euclid.Point.createFromJSON(
						arg
					);

				break;

			default :

				throw new Error(
					'invalid JSON: ' + aName
				);
		}
	}


/**/if( CHECK )
/**/{
/**/
/**/	if( v_pnw === undefined )
/**/	{
/**/		throw new Error(
/**/			'undefined attribute pnw'
/**/		);
/**/	}
/**/
/**/	if( v_pnw === null )
/**/	{
/**/		throw new Error(
/**/			'pnw must not be null'
/**/		);
/**/	}
/**/	if( v_pnw.reflect !== 'Point' )
/**/	{
/**/		throw new Error(
/**/			'type mismatch'
/**/		);
/**/	}
/**/
/**/	if( v_pse === undefined )
/**/	{
/**/		throw new Error(
/**/			'undefined attribute pse'
/**/		);
/**/	}
/**/
/**/	if( v_pse === null )
/**/	{
/**/		throw new Error(
/**/			'pse must not be null'
/**/		);
/**/	}
/**/	if( v_pse.reflect !== 'Point' )
/**/	{
/**/		throw new Error(
/**/			'type mismatch'
/**/		);
/**/	}
/**/}
	return (
		new Rect(
			_tag,
			v_pnw,
			v_pse
		)
	);
};


/*
| Reflection.
*/
Rect.prototype.reflect =
	'Rect';


/*
| Workaround meshverse growing
*/
Rect.prototype._$grown =
	true;


/*
| Sets values by path.
*/
Rect.prototype.setPath =
	JoobjProto.setPath;


/*
| Gets values by path.
*/
Rect.prototype.getPath =
	JoobjProto.getPath;


/*
| Convers the object into a JSON.
*/
Jools.lazyValue(
	Rect.prototype,
	'toJSON',
	function( )
	{
		var
			json;

		json =
			Object.freeze( {
				type :
					'Rect',
				'pnw' :
					this.pnw,
				'pse' :
					this.pse
		} );

		return function( ) { return json; };
	}
);


/*
| Checks for equal objects.
*/
Rect.prototype.equals =
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
		this.pnw.equals( obj.pnw )
		&&
		this.pse.equals( obj.pse )
	);
};


/*
| Node export
*/
if( SERVER )
{
	module.exports =
		Rect;
}


} )( );
