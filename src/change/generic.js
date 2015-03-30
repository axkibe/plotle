/*
| Collection of generic change functions.
*/

var
	change_generic,
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
		case 'change_join' :
		case 'change_remove' :
		case 'change_set' :
		case 'change_split' :

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

		// changes that transformed away are sliced out.
		if( c ) tRay[ tZ++ ] = c;
	}

	return cRay.create( 'ray:init', tRay );
};


/*
| Returns a change wrap transformed by this change.
*/
change_generic.transformChangeWrap =
	function(
		cw
	)
{
	return cw.create( 'changeRay', this._transformChangeRay( cw.changeRay ) );
};


/*
| Returns a change wrap transformed by this change.
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


/*
| Transforms a range mark by this change.
*/
change_generic.transformRangeMark =
	function(
		mark
	)
{
	return(
		mark.create(
			'begin', this._transformTextMark( mark.begin ),
			'end', this._transformTextMark( mark.end )
		)
	);
};


}( ) );
