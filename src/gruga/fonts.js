/*
| Shortcuts for fonts.
*/
'use strict';


tim.define( module, ( def ) => {


const gleam_font_root = require( '../gleam/font/root' );

const defaultSize = 12;


// FIXME
def.staticLazy.a = ( ) =>
	gleam_font_root.get( 'DejaVuSans-Regular' ).get( defaultSize );


} );
