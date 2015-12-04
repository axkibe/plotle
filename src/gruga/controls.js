/*
| General controls settings.
*/


var
	euclid_point,
	euclid_rect,
	gruga_controls;


/*
| Capsule
*/
( function( ) {
'use strict';


gruga_controls = { };


/*
| The size the controls user interface is designed for
| and will resize to current screenSize.
*/
gruga_controls.designSize =
	euclid_rect.create(
		'pnw', euclid_point.zero,
		'pse',
			euclid_point.create(
				'x', 1024,  // this is currently ignored
				'y',  768
			)
	);


if( FREEZE ) Object.freeze( gruga_controls );

} )( );
