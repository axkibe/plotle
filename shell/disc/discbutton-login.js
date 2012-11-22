/*
|
| The create button on the DiscPanel.
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
var DiscButtonLogin = Disc.DiscButtonLogin =
	function( disc )
{
	Disc.DiscButton.call(
		this,
		disc,
		'login',
		'MODE', 'LOGIN'
	);
};

Jools.subclass( DiscButtonLogin, Disc.DiscButton );


/*
| Draws the buttons icon.
*/
DiscButtonLogin.prototype.drawIcon =
	function(
		fabric
	)
{
	var ax = this.myStyle.textAnchor.x;
	var ay = this.myStyle.textAnchor.x;

	fabric.fillText(
		'log',
		ax,
		ay - 8,
		this.myStyle.font
	);

	fabric.fillText(
		'in',
		ax,
		ay + 8,
		this.myStyle.font
	);
};


} )( );
