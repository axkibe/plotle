/*
| An array of changes to a tree.
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
			'ChangeRay',
		unit :
			'Jion',
		attributes :
			{
				'array' :
				{
					comment :
						'the ajax path',
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
			Change :
				require( '../jion/change' ),
			ChangeRay :
				require( '../jion/this' )( module )
		};
}


var
	ChangeRay;

ChangeRay = Jion.ChangeRay;

/*
| Initializer.
*/
ChangeRay.prototype._init =
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
| Returns a change ray with inverted changes.
|
| FIXME use lazyValue
*/
ChangeRay.prototype.invert =
	function( )
{
	var
		a,
		aZ,
		inv,
		rc;

	if( this._$invert )
	{
		return this._$invert;
	}

	rc = [ ];

	for(
		a = 0, aZ = this.length;
		a < aZ;
		a++
	)
	{
		rc[ a ] =
			this._ray[ a ].invert( );
	}

	inv =
		ChangeRay.Create(
			'array',
				rc,
			'_sliced',
				true
		);

	Jools.innumerable(
		this,
		'_$invert',
		inv
	);

	Jools.innumerable(
		inv,
		'_$invert',
		this
	);

	return inv;
};


/*
| Appends a change to the change ray.
*/
ChangeRay.prototype.Append =
	function(
		chg
	)
{
	var
		rc;

	rc = this._ray.slice( );

	rc.push( chg );

	return (
		ChangeRay.Create(
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
	ChangeRay.prototype,
	'length',
	function( )
	{
		return this._ray.length;
	}
);


/*
| Gets one change.
*/
ChangeRay.prototype.get =
	function(
		idx
	)
{
	return this._ray[ idx ];
};


/*
| Returns a ChangeRay with one element altered.
*/
ChangeRay.prototype.Set =
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
		ChangeRay.Create(
			'array',
				rc,
			'_sliced',
				true
		)
	);
};



/*
| Performes this change-ray on a tree.
|
| FIXME trace if a signle change has changed and create
| a new array only then
*/
ChangeRay.prototype.changeTree =
	function(
		tree,
		universe
	)
{
	// the ray with the changes applied
	var
		chg,
		cray,
		cr;

	cray = [ ];

	// iterates through the change ray
	for(
		var a = 0, aZ = this.length;
		a < aZ;
		a++
	)
	{
		chg = this.get( a ),

		cr =
			chg.changeTree(
				tree,
				universe
			);

		// the tree returned by op-handler is the new tree
		tree = cr.tree;

		cray.push( cr.chg );
	}

	// FUTURE make a "changeResult" jion.
	return Jools.immute(
		{
			tree :
				tree,
			chgX :
				ChangeRay.Create(
					'array',
						cray,
					'_sliced',
						true
				)
		}
	);
};


/*
| Exports
*/
if( SERVER )
{
	module.exports = ChangeRay;
}

}( ) );
