/*
| Starts up the shell.
*/
'use strict';


tim.define( module, ( def ) => {

const gruga_fonts = require( '../gruga/fonts' );

const shell_system = require( './system' );


/*
| Loads open type fonts.
*/
const openTypeLoad =
	function( )
{
	opentype.load(
		//'media-fonts-OpenSans-Regular.ttf',
		//'media-fonts-Roboto-Regular.ttf',
		'media-fonts-DejaVuSans-Regular.ttf',
		//'media-fonts-NotoSans-Regular.ttf',
		//'media-fonts-SourceSansPro-Regular.ttf',
		//'media-dejavusans-webfont.ttf',
		function( err, font )
	{
		if (err)
		{
			console.log( 'Font could not be loaded: ' + err );
		}
		else
		{
			font.glyphCache = {};

			gruga_fonts.setOpenTypeDefault( font );

			shell_system.startup( );
		}
	} );
};


if( !NODE ) window.onload = openTypeLoad;


} );
