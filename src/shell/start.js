/*
| Starts up the shell.
*/
'use strict';


tim.define( module, ( def ) => {

// FUTURE, hack for loading depencencies
require( '../visual/base/posfs' );
require( '../visual/base/stroke' );
require( '../visual/base/zone' );

const gruga_fonts = require( '../gruga/fonts' );

const shell_system = require( './system' );


/*
| Loads open type fonts.
*/
const openTypeLoad =
	function( )
{
	opentype.load(
		'font-DejaVuSans-Regular.ttf',
		function( err, font )
	{
		if (err)
		{
			console.log( 'Font could not be loaded: ' + err );
		}
		else
		{
			font.glyphCache = { };

			gruga_fonts.setOpenTypeDefault( font );

			shell_system.startup( );
		}
	} );
};


if( !NODE ) window.onload = openTypeLoad;


} );
