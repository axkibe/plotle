/*
| A collection of facets for a button.
*/


var
	design_facetJockey;

/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The jion definition
*/
if( JION )
{
	return{
		id : 'design_buttonFacetJockey',
		group : [ 'design_facet' ]
	};
}


var
	prototype;

prototype = design_facetJockey.prototype;


/*
| XXX
*/
prototype.addFacet =
	function(
		// ...
	)
{
	var
		a,
		arg,
		aZ,
		down,
		facet,
		focus,
		hover,
		name;

	down = '_';

	focus = '_';

	for( a = 0, aZ = arguments.length; a < aZ; a += 2 )
	{

		arg = arguments[ a + 1 ];

		switch( arguments[ a ] )
		{
			case 'down' : down = arg ? 'd' : '_' ; break;

			case 'facet' : facet = arg; break;

			case 'focus' : focus = arg ? 'f' : '_'; break;

			case 'hover' : hover = arg ? 'h' : '_'; break;

			default : throw new Error( );
		}
	}

	name = down + focus + hover;

	return this.set( name, facet );
};


})( );
