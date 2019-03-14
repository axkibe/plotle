/*
| Starts up the shell.
*/
'use strict';


tim.define( module, ( def ) => {


// FUTURE, hack for loading depencencies
tim.require( '../visual/base/posfs' );
tim.require( '../visual/base/stroke' );
tim.require( '../visual/base/zone' );


const gleam_font_root = tim.require( '../gleam/font/root' );

const shell_system = tim.require( './system' );


if( !NODE )
{
	window.onload = ( ) =>
		gleam_font_root.load(
			'DejaVuSans-Regular',
			( font ) => shell_system.startup( )
		);
}


} );
