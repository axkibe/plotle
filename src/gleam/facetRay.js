/*
| A ray of facets.
|
| Priotiy is from length - 1 to 0.
*/


/*
| The jion definition
*/
if( JION )
{
	throw{
		id : 'gleam_facetRay',
		list : [ 'gleam_facet' ]
	};
}


var
	gleam_facetRay;

/*
| Capsule
*/
( function( ) {
'use strict';


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


var
	prototype;

prototype = gleam_facetRay.prototype;


/*
| Returns the facet with highest index matching
| the specification in arguments given by
|
| 'name', value pairs
*/
prototype.getFacet =
	function(
		// ...
	)
{
	var
		a,
		aZ,
		matches,
		f,
		r;

	aZ = arguments.length;

	for( r = this.length - 1; r >= 0; r-- )
	{
		f = this.get( r );

		matches = 0;

		for( a = 0; a < aZ; a += 2 )
		{
			if( f.get( arguments[ a ] ) === arguments[ a + 1 ] )
			{
				matches++;
			}
		}

		if( matches === f.size )
		{
			return f;
		}
	}
};


})( );
