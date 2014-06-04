/*
|
| An array of changes to a tree.
|
| Authors: Axel Kittenberger
|
*/


/*
| Export
*/
var
	ChangeRay;


/*
| Imports
*/
var
	Jools,
	Change;


/*
| Capsule
*/
( function( ) {
"use strict";


/*
| Node includes.
*/
if( SERVER )
{
	Jools =
		require( '../jools/jools'  );

	Change =
		require( './change' );
}


/*
| Constructor
|
| model is optional and if given the ray is filled with it
*/
ChangeRay =
	function( model )
{
	var
		ray =
		this._$ray = [ ];

	// no model -> nothing to do
	if( model === undefined )
	{
		return;
	}

	if( !( model instanceof Array ) )
	{
		throw new Error(
			'ChangeRay model must be an Array'
		);
	}

	for(
		var a = 0, aZ = model.length;
		a < aZ;
		a++
	)
	{
		var c = model[ a ];

		if( !(c instanceof Change ) )
		{
			c =
				new Change(
					a.src,
					a.trg
				);
		}

		ray[ a ] = c;
	}
};


/*
| Returns a change ray with inverted changes.
*/
ChangeRay.prototype.invert =
	function( )
{
	if( this._$invert )
	{
		return this._$invert;
	}

	var
		inv =
			new ChangeRay( );

	for(
		var a = 0, aZ = this.length;
		a < aZ;
		a++
	)
	{
		inv._$ray[ a ] =
			this._$ray[ a ].invert( );
	}

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
ChangeRay.prototype.append =
	function(
		chg
	)
{
	var
		ray =
			this._$ray.slice( );

	ray.push( chg );

	return new ChangeRay( ray );
};


/*
| Returns the length of the changeray
| FIXME once ChangeRay is immutable this can be fixed as well
*/
Object.defineProperty (
	ChangeRay.prototype,
	'length',
	{
		get : function( )
		{
			return this._$ray.length;
		}
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
	return this._$ray[ idx ];
};


/*
| Sets one change.
*/
ChangeRay.prototype.set =
	function(
		idx,
		chg
	)
{
	if( this._$invert )
	{
		this._$invert =
			null;
	}

	this._$ray[ idx ] =
		chg;

	return chg;
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
		cray =
			new ChangeRay( );

	// iterates through the change ray
	for(
		var a = 0, aZ = this.length;
		a < aZ;
		a++
	)
	{
		var
			chg =
				this.get( a ),

			r =
				chg.changeTree(
					tree,
					universe
				);

		// the tree returned by op-handler is the new tree
		tree =
			r.tree;

		cray.push( r.chg );
	}

	return Jools.immute(
		{
			tree :
				tree,

			chgX :
				Jools.immute( cray )
		}
	);
};


/*
| Exports
*/
if( SERVER )
{
	module.exports =
		ChangeRay;
}

}( ) );
