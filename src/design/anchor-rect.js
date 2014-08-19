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

		name :
			'AnchorRect',

		unit :
			'design',

		attributes :
			{
				pnw :
					{
						comment :
							'point in north-west',

						type :
							'AnchorPoint'
					},

				pse :
					{
						comment :
							'point in south-east',

						type :
							'AnchorPoint'
					}
			}
	};
}


var
	AnchorRect;

AnchorRect = design.AnchorRect;


/*
| Computes a rect modelled relative to this rect.
*/
AnchorRect.prototype.compute =
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
