/*
| An array of wraped change(rays).
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
			'jion.changeWrapRay',
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
			changeWrapRay :
				require( '../jion/this' )( module )
		};
}


var
	changeWrapRay;

changeWrapRay = jion.changeWrapRay;


/*
| Initializer.
*/
changeWrapRay.prototype._init =
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
changeWrapRay.prototype.append =
	function(
		chg
	)
{
	var
		rc;

	rc = this._ray.slice( );

	rc.push( chg );

	return (
		changeWrapRay.create(
			'array',
				rc,
			'_sliced',
				true
		)
	);
};


/*
| Removes an element.
*/
changeWrapRay.prototype.remove =
	function(
		idx
	)
{
	var
		rc;

	rc = this._ray.slice( );

	rc.splice( idx, 1 );

	return (
		changeWrapRay.create(
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
	changeWrapRay.prototype,
	'length',
	function( )
	{
		return this._ray.length;
	}
);


/*
| Gets one change.
*/
changeWrapRay.prototype.get =
	function(
		idx
	)
{
	return this._ray[ idx ];
};


/*
| Returns a changeWrapRay with one element altered.
*/
changeWrapRay.prototype.set =
	function(
		idx,
		chg
	)
{
	var
		rc;

	rc = this._ray.slice( );

	rc[ idx ] = chg;

	return (
		changeWrapRay.create(
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
	module.exports = changeWrapRay;
}


}( ) );
