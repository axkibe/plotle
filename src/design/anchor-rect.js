/*
| A rectangle (or a frame)
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	design;


design =
	design || { };


/*
| Import
*/
var
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
			'design.anchorRect',
		attributes :
			{
				pnw :
					{
						comment :
							'point in north-west',
						type :
							'design.anchorPoint'
					},

				pse :
					{
						comment :
							'point in south-east',
						type :
							'design.anchorPoint'
					}
			}
	};
}


var
	anchorRect;

anchorRect = design.anchorRect;


/*
| Computes a rect modelled relative to this rect.
*/
anchorRect.prototype.compute =
	function(
		frame
	)
{
	return euclid.rect.create(
		'pnw',
			this.pnw.compute( frame ),
		'pse',
			this.pse.compute( frame )
	);
};


})( );
