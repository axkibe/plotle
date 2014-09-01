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
		id :
			'jion.signRay',
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
			sign :
				require( '../jion/sign' ),
			signRay :
				require( '../jion/this' )( module )
		};
}


var
	signRay;

signRay = jion.signRay;


/*
| Initializer.
*/
signRay.prototype._init =
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
signRay.prototype.append =
	function(
		chg
	)
{
	var
		rc;

	rc = this._ray.slice( );

	rc.push( chg );

	return (
		signRay.create(
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
	signRay.prototype,
	'length',
	function( )
	{
		return this._ray.length;
	}
);


/*
| Gets one change.
*/
signRay.prototype.get =
	function(
		idx
	)
{
	return this._ray[ idx ];
};


/*
| Returns a signRay with one element altered.
*/
signRay.prototype.set =
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
		signRay.create(
			'array',
				rc,
			'_sliced',
				true
		)
	);
};


/*
| Returns a signRay with one element removed.
| TODO rename
*/
signRay.prototype.Remove =
	function(
		idx
	)
{
	var
		rc;

	rc = this._ray.slice( );

	rc.splice( idx, 1 );

	return (
		signRay.create(
			'array',
				rc,
			'_sliced',
				true
		)
	);
};


/*
| Returns a signRay with one element inserted.
| TODO rename
*/
signRay.prototype.Insert =
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
		signRay.create(
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
	module.exports = signRay;
}

}( ) );
