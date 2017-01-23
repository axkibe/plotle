/*
| General controls settings.
*/


var
	gleam_point,
	gleam_rect,
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
	gleam_rect.create(
		'pnw', gleam_point.zero,
		'pse',
			gleam_point.create(
				'x', 1024,  // this is currently ignored
				'y',  768
			)
	);


if( FREEZE ) Object.freeze( gruga_controls );

} )( );
