/*
| An array of signs.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	jion;

jion = jion || { };


/*
| Imports
*/
var
	jools;


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
			'jion',
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
	jools =
		require( '../jools/jools'  );

	jion =
		{
			Sign :
				require( '../jion/sign' ),
			SignRay :
				require( '../jion/this' )( module )
		};
}


var
	SignRay;

SignRay = jion.SignRay;


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
		SignRay.create(
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
jools.lazyValue(
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
		SignRay.create(
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
		SignRay.create(
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
		SignRay.create(
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
