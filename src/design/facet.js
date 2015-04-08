/*
| A facet of an element.
|
| for example hover, focus or down.
*/


var
	design_facet;

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
		id : 'design_facet',
		attributes :
		{
			border :
			{
				comment : 'border',
				type : require( '../typemaps/border' ),
				defaultValue : 'undefined'
			},
			fill :
			{
				comment : 'fill',
				type : require( '../typemaps/fill' ),
				defaultValue : 'undefined'
			}
		},
		group : [ 'boolean' ]
	};
}


var
	prototype;

prototype = design_facet.prototype;


})( );
