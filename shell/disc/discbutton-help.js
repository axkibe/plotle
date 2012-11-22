/*
|
| The help button on the DiscPanel.
|
| Authors: Axel Kittenberger
|
*/


/*
| Export
*/
var Disc;
Disc = Disc || { };


/*
| Imports
*/
var config;
var Curve;
var Dash;
var Design;
var Euclid;
var Jools;
var Proc;
var shell;
var theme;
var Tree;


/*
| Capsule
*/
( function( ) {
'use strict';


if( typeof( window ) === 'undefined' )
	{ throw new Error( 'this code needs a browser!' ); }

/*
| Constructor
*/
var DiscButtonHelp = Disc.DiscButtonHelp =
	function( disc )
{
	Disc.DiscButton.call(
		this,
		disc,
		'help',
		'MODE', 'HELP'
	);
};

Jools.subclass( DiscButtonHelp, Disc.DiscButton );


/*
| Draws the buttons icon.
*/
DiscButtonHelp.prototype.drawIcon =
	function(
		fabric
	)
{
	fabric.fillText(
		'?',
		this.myStyle.textAnchor,
		this.myStyle.font
	);
};


} )( );
