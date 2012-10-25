/*                               _..._
 _______                      .-'_..._''.
 \  ___ `'.   .--.          .' .'      '.\
  ' |--.\  \  |__|         / .'
  | |    \  ' .--.        . '
  | |     |  '|  |        | |
  | |     |  ||  |     _  | |
  | |     ' .'|  |   .' | . '
  | |___.' /' |  |  .   | /\ '.          .
 /_______.'/  |__|.'.'| |// '. `._____.-'/
 \_______|/     .'.'.-'  /    `-.______ /
                .'   \_.'              `
 .-,--.            ,-,---.     .  .
 ' |   \ . ,-. ,-.  '|___/ . . |- |- ,-. ,-.
 , |   / | `-. |    ,|   \ | | |  |  | | | |
 `-^--'  ' `-' `-' `-^---' `-^ `' `' `-' ' '
          .---.         ,-.  .
          \___  . ,-. ,-. |  |   ,-.
              \ | | | | | |  | . | |
          `---' ' `-| ' ' `--^-' |-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~,| ~ ~ ~ ~ ~ ~|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                   `'            '
 The signup button on the DiscPanel.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


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
var DiscButtonSignup = Disc.DiscButtonSignup =
	function( disc )
{
	Disc.DiscButton.call(
		this,
		disc,
		'signup',
		'MODE', 'SIGNUP'
	);
};

Jools.subclass( DiscButtonSignup, Disc.DiscButton );


/*
| Draws the buttons icon.
*/
DiscButtonSignup.prototype.drawIcon =
	function(
		fabric
	)
{
	var ax = this.myStyle.textAnchor.x;
	var ay = this.myStyle.textAnchor.x;

	fabric.fillText(
		'sign',
		ax,
		ay - 8,
		this.myStyle.font
	);

	fabric.fillText(
		'up',
		ax,
		ay + 8,
		this.myStyle.font
	);
};


} )( );
