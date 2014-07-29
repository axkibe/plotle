/*
| An array of signs.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Jion;

Jion = Jion || { };


/*
| Imports
*/
var
	Jools;


/*
| Capsule
*/
( function( ) {
"use strict";


/*
| The jion definition.
*/
if( JION )
{
	return {
		name :
			'SignRay',
		unit :
			'Jion',
		attributes :
			{
				'array' :
				{
					comment :
						'the array',
					type :
						'Object',
					assign :
						null,
					defaultValue :
						undefined
				},

				'_sliced' :
				{
					comment :
						'true if the array is already sliced',
					type :
						'Boolean',
					assign :
						null,
					defaultValue :
						undefined
				}
			},
		init :
			[ 'array', '_sliced' ],
		node :
			true,
		equals :
			false
	};
}


/*
| Node includes.
*/
if( SERVER )
{
	Jools =
		require( '../jools/jools'  );

	Jion =
		{
			Sign :
				require( '../jion/sign' ),
			SignRay :
				require( '../jion/this' )( module )
		};
}


var
	SignRay;

SignRay = Jion.SignRay;


/*
| Initializer.
*/
SignRay.prototype._init =
	function(
		array,
		_sliced
	)
{
	if( array === undefined )
	{
		array = [ ];
	}

/**/if( CHECK )
/**/{
/**/	if(
/**/		( !(array instanceof Array ) )
/**/	)
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if( _sliced !== true )
	{
		array = array.slice( );
	}

/**/if( CHECK )
/**/{
/**/	array = Object.freeze( array );
/**/}

	this._ray = array;
};



/*
| Appends a change to the change ray.
*/
SignRay.prototype.Append =
	function(
		chg
	)
{
	var
		rc;

	rc = this._ray.slice( );

	rc.push( chg );

	return (
		SignRay.Create(
			'array',
				rc,
			'_sliced',
				true
		)
	);
};


/*
| Returns the length of the changeray
*/
Jools.lazyValue(
	SignRay.prototype,
	'length',
	function( )
	{
		return this._ray.length;
	}
);


/*
| Gets one change.
*/
SignRay.prototype.get =
	function(
		idx
	)
{
	return this._ray[ idx ];
};


/*
| Returns a SignRay with one element altered.
*/
SignRay.prototype.Set =
	function(
		idx,
		sign
	)
{
	var
		rc;

	rc = this._ray.slice( );

	rc[ idx ] = sign;

	return (
		SignRay.Create(
			'array',
				rc,
			'_sliced',
				true
		)
	);
};


/*
| Returns a SignRay with one element removed.
*/
SignRay.prototype.Remove =
	function(
		idx
	)
{
	var
		rc;

	rc = this._ray.slice( );

	rc.splice( idx, 1 );

	return (
		SignRay.Create(
			'array',
				rc,
			'_sliced',
				true
		)
	);
};


/*
| Returns a SignRay with one element inserted.
*/
SignRay.prototype.Insert =
	function(
		idx,
		sign
	)
{
	var
		rc;

	rc = this._ray.slice( );

	rc.splice( idx, 0, sign );

	return (
		SignRay.Create(
			'array',
				rc,
			'_sliced',
				true
		)
	);
};


/*
| Exports
*/
if( SERVER )
{
	module.exports = SignRay;
}

}( ) );
