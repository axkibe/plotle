/*
| A gradient step (color stop)
*/


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
			'gradient_step',
		attributes :
			{
				step :
					{
						comment :
							'gradient step position 0-1',
						type :
							'number'
					},
				color :
					{
						comment :
							'the color for the step',
						type :
							'euclid_color'
					}
			}
	};
}


})( );
