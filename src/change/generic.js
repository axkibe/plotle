/*
| Collection of generic change functions.
*/

var
	change_generic,
	result_changeTree,
	jools;


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
	change_generic = module.exports;

	jools = require( '../jools/jools' );

	result_changeTree = require( '../result/changeTree' );
}
else
{
	change_generic = { };
}


/*
| Returns true when 'o' is a change.
*/
change_generic.isChange =
	function(
		o
	)
{
	switch( o.reflect )
	{
		case 'change_insert' :
		case 'change_remove' :

			return true;

		default :

			return false;
	}
};


/*
| Returns a change ray transformed by this change.
*/
change_generic.transformChangeRay =
	function(
		cRay
	)
{
	var
		c,
		r,
		rZ,
		tZ,
		tRay;

/**/if( CHECK )
/**/{
/**/	if( cRay.reflect !== 'change_ray' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	tRay = [ ];

	for(
		r = 0, rZ = cRay.length, tZ = 0;
		r < rZ;
		r++
	)
	{
		// FIXME in case this returns a change_ray this fails
		c = this.transform( cRay.get( r ) );

		if( c !== null )
		{
			// nulled changes are sliced out.

			tRay[ tZ++ ] = c;
		}
	}

	return cRay.create( 'ray:init', tRay );
};


/*
| Return a change wrap transformed by this change.
*/
change_generic.transformChangeWrap =
	function(
		cw
	)
{
	// FIXME call the correct subroutine right away.
	return cw.create( 'changeRay', this.transform( cw.changeRay ) );
};


/*
| Return a change wrap transformed by this change.
*/
change_generic.transformChangeWrapRay =
	function(
		cwRay
	)
{
	var
		r,
		rZ,
		tRay;

	tRay = [ ];

	for(
		r = 0, rZ = cwRay.length;
		r < rZ;
		r++
	)
	{
		tRay[ r ] = this._transformChangeWrap( cwRay.get( r ) );
	}


	return cwRay.create( 'ray:init', tRay );
};


}( ) );
