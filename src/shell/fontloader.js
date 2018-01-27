/*
| Loads the web fonts Meshcraft uses.
|
| Starts the browser system when finished.
*/


var
	opentype,
	gruga_fonts,
	startup;


/*
| Capsule
*/
( function( ) {
'use strict';

var openTypeLoad;


/*
| Loads open type fonts.
*/
openTypeLoad =
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

			startup( );
		}
	} );
};


window.onload = openTypeLoad;


} )( );

