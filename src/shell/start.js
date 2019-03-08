/*
| Starts up the shell.
*/
'use strict';


tim.define( module, ( def ) => {

// FUTURE, hack for loading depencencies
require( '../visual/base/posfs' );
require( '../visual/base/stroke' );
require( '../visual/base/zone' );


const gleam_font_root = require( '../gleam/font/root' );

const shell_system = require( './system' );


if( !NODE )
{
	window.onload = ( ) =>
		gleam_font_root.load(
			'DejaVuSans-Regular',
			( font ) => shell_system.startup( )
		);
}


} );
