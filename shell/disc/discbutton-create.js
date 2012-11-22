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
           ,--.             .
           | `-' ,-. ,-. ,-. |- ,-.
           |   . |   |-' ,-| |  |-'
           `--'  '   `-' `-^ `' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 The create button on the DiscPanel.

 Authors: Axel Kittenberger

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
var DiscButtonCreate = Disc.DiscButtonCreate =
	function( disc )
{
	Disc.DiscButton.call(
		this,
		disc,
		'create',
		'MODE', 'CREATE'
	);
};

Jools.subclass( DiscButtonCreate, Disc.DiscButton );


/*
| Draws the buttons icon.
*/
DiscButtonCreate.prototype.drawIcon =
	function(
		fabric
	)
{
	fabric.fillText(
		'new',
		this.myStyle.textAnchor,
		this.myStyle.font
	);
};



} )( );
