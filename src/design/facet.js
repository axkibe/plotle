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
						type : 'euclid_border',
						defaultValue : 'undefined'
					},
				fill :
					{
						comment : 'fill',
						type : 'euclid_color',
						defaultValue : 'undefined'
					}
			}
	};
}


var
	prototype;

prototype = design_facet.prototype;


})( );
