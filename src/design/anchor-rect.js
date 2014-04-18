/*
| A rectangle (or a frame)
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Design;


Design =
	Design || { };


/*
| Import
*/
var
	Euclid;

/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The joobj definition
*/
if( JOOBJ )
{
	return {

		name :
			'AnchorRect',

		unit :
			'Design',

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
	AnchorRect =
		Design.AnchorRect;


/*
| Computes a rect modelled relative to this rect.
*/
AnchorRect.prototype.compute =
	function(
		frame
	)
{
	return Euclid.Rect.Create(
		'pnw',
			this.pnw.compute( frame ),
		'pse',
			this.pse.compute( frame )
	);
};


})( );
