/*
| General controls settings.
*/


var
	gleam_size,
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
	gleam_size.create(
		'width', 1024,  // this is currently ignored
		'height', 768
	);


if( FREEZE ) Object.freeze( gruga_controls );

} )( );
