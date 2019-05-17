/*
| Starts up the shell.
*/
'use strict';


tim.define( module, ( def ) => {


def.abstract = true;


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
