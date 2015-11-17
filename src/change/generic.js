/*
| Collection of generic change functions.
*/

var
	change_generic;


/*
| Capsule
*/
( function( ) {
"use strict";


/*
| Node includes.
*/
if( NODE )
{
	change_generic = module.exports;
}
else
{
	change_generic = { };
}


/*
| Reversivly performs this change on a tree.
*/
change_generic.changeTreeReverse =
	function(
		tree
	)
{
	return this.reverse.changeTree( tree );
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
		a,
		aZ,
		c,
		r,
		rZ,
		tZ,
		tRay;

/**/if( CHECK )
/**/{
/**/	if( cRay.reflect !== 'change_ray' ) throw new Error( );
/**/}

	tRay = [ ];

	for(
		r = 0, rZ = cRay.length, tZ = 0;
		r < rZ;
		r++
	)
	{
		c = this.transform( cRay.get( r ) );

		// changes that transformed away are sliced out.
		if( !c ) continue;

		if( c.reflect === 'change_ray' )
		{
			for( a = 0, aZ = c.length; a < aZ; a++ )
			{
				tRay[ tZ++ ] = c.get( a );
			}
		}
		else
		{
			tRay[ tZ++ ] = c;
		}
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

	for( r = 0, rZ = cwRay.length; r < rZ; r++ )
	{
		tRay[ r ] = this._transformChangeWrap( cwRay.get( r ) );
	}


	return cwRay.create( 'ray:init', tRay );
};


}( ) );
