/*
| Loads the web fonts Meshcraft uses.
|
| Starts the browser system when finished.
*/


var
	WebFont,
	startup;


/*
| Capsule
*/
( function( ) {
'use strict';


window.onload =
	function( )
{
	WebFont.load(
	{
		custom:
		{
			families:
			[
				'DejaVuSans',
				'DejaVuSansBold'
			]
			//urls: [ '/fonts/dejavu.css' ], already in CSS
		},

		active: function() { startup( ); }
	}
	);
};


} )( );
