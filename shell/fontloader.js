/*
|
| Loads the web fonts Meshcraft uses.
| Starts the browser system when finished.
|
| Authors: Axel Kittenberger
|
*/


var WebFont;
var startup;


/*
| Capsule
*/
( function() {
'use strict';


if (typeof(window) === 'undefined')
	{ throw new Error('this code needs a browser!'); }


window.onload = function()
{
	WebFont.load(
		{
			custom:
			{
				families: [ 'DejaVuSans', 'DejaVuSansBold' ]
				//urls: [ '/fonts/dejavu.css' ], already in CSS
			},

			active:
			function()
			{
				startup();
			}
		}
	);
};


} ) ();
