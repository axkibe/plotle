/*
| A rectangle (or a frame)
*/


var
	design_anchorRect,
	euclid;

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
		id :
			'design_anchorRect',
		attributes :
			{
				pnw :
					{
						comment :
							'point in north-west',
						type :
							'design_anchorPoint'
					},

				pse :
					{
						comment :
							'point in south-east',
						type :
							'design_anchorPoint'
					}
			}
	};
}


/*
| Computes a rect modelled relative to this rect.
*/
design_anchorRect.prototype.compute =
	function(
		frame
	)
{
	return euclid.rect.create(
		'pnw', this.pnw.compute( frame ),
		'pse', this.pse.compute( frame )
	);
};


})( );
