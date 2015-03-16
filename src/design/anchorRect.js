/*
| A rectangle (or a frame)
*/


var
	design_anchorRect,
	euclid_rect;

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
	return {
		id : 'design_anchorRect',
		attributes :
			{
				pnw :
					{
						comment : 'point in north-west',
						type : 'design_anchorPoint'
					},

				pse :
					{
						comment : 'point in south-east',
						type : 'design_anchorPoint'
					}
			}
	};
}

var
	prototype;

prototype = design_anchorRect.prototype;


/*
| Computes a rect modelled relative to this rect.
*/
prototype.compute =
	function(
		frame
	)
{
	return euclid_rect.create(
		'pnw', this.pnw.compute( frame ),
		'pse', this.pse.compute( frame )
	);
};


})( );
