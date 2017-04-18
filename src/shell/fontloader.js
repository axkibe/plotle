/*
| Loads the web fonts Meshcraft uses.
|
| Starts the browser system when finished.
*/


var
	font_default,
	opentype,
	startup,
	WebFont;


/*
| Capsule
*/
( function( ) {
'use strict';

var openTypeLoad;
var	webFontLoad;


/*
| Loads open type fonts.
*/
openTypeLoad =
	function( )
{
	opentype.load(
		'media-fonts-OpenSans-Regular.ttf',
		//'media-fonts-Roboto-Regular.ttf',
		function( err, font )
	{
		if (err)
		{
			console.log( 'Font could not be loaded: ' + err );
		}
		else
		{
			font_default = font;

			startup( );
		}
	}
	);
};



/*
| Loads web fonts.
*/
webFontLoad =
	function( )
{
	WebFont.load(
	{
		custom:
		{
			families:
			[
				'DejaVuSans'
			]
			//urls: [ '/fonts/dejavu.css' ], already in CSS
		},

		active: function() { openTypeLoad( ); }
	}
	);
};


//window.onload = openTypeLoad;
window.onload = webFontLoad;


} )( );
