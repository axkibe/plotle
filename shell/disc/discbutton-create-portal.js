/*
|
| The portal button on the creation disc.
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
var DiscButtonCreatePortal = Disc.DiscButtonCreatePortal =
	function( disc )
{
	Disc.DiscButton.call(
		this,
		disc,
		'portal',
		'CREATE', 'PORTAL'
	);
};

Jools.subclass( DiscButtonCreatePortal, Disc.DiscButton );


/*
| Draws the buttons icon
*/
DiscButtonCreatePortal.prototype.drawIcon =
	function(
		fabric
	)
{
	fabric.fillText(
		'Portal',
		this.myStyle.textAnchor,
		this.myStyle.font
	);
};


} )( );
