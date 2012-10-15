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
 `-^--'  ' `-' `-' `-^---' `-^ `' `' `-' '

~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A button on the DiscPanel.

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


if( typeof( window ) === 'undefined')
	{ throw new Error( 'this code needs a browser!' ); }


/*
| Constructor
*/
var DiscButton = Disc.DiscButton =
	function(
		style
	)
{
	this.style = style;
	var pnw = this.pnw = style.pnw;

	this.ellipse = new Euclid.Ellipse(
		pnw,
		pnw.add(
			theme.disc.buttons.width,
			theme.disc.buttons.height
		)
	);

	Jools.immute( this );
};

DiscButton.prototype.draw =
	function(
		fabric
	)
{
	fabric.paint(
		theme.disc.buttons,
		this.ellipse,
		'sketch',
		Euclid.View.proper
	);

	fabric.paint(
		this.style.icon,
		this,
		'sketchIcon',
		Euclid.View.proper
	);
};


} )( );
