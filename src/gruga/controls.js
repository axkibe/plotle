/*
| General controls settings.
*/
'use strict';


tim.define( module, ( def ) => {


const gleam_size = require( '../gleam/size' );


/*
| The size the controls user interface is designed for
| and will resize to current screenSize.
*/
def.staticLazy.designSize = ( ) =>
	gleam_size.create(
		'width', 1024,  // this is currently ignored
		'height', 768
	);


} );

