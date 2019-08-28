/*
| Default font of the theme.
*/
'use strict';


tim.define( module, ( def, gruga_fontFace ) => {


def.abstract = true;


const gleam_color = tim.require( '../gleam/color' );

const gleam_font_root = tim.require( '../gleam/font/root' );


/*
| The standard font family
*/
def.staticLazy.standardFamily = ( ) => gleam_font_root.get( 'DejaVuSans-Regular' );


/*
| The creates a font by size of the standard family.
*/
def.static.standard =
	( size ) =>
	(
		gruga_fontFace.standardFamily
		.createSize( size )
		.createFace( gleam_color.black )
	);


/*
| The creates a font by size of the standard family in red
*/
def.static.standardRed =
	( size ) =>
	(
		gruga_fontFace.standardFamily
		.createSize( size )
		.createFace( gleam_color.red )
	);

} );
