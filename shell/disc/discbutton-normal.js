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
       ,-,-.                     .
       ` | |   ,-. ,-. ,-,-. ,-. |
         | |-. | | |   | | | ,-| |
        ,' `-' `-' '   ' ' ' `-^ `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A button on the DiscPanel.

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


if( typeof( window ) === 'undefined')
	{ throw new Error( 'this code needs a browser!' ); }

/*
| Constructor
*/
var DiscButtonNormal = Disc.DiscButtonNormal = function(
	disc
)
{
	Disc.DiscButton.call(
		this,
		disc,
		'normal',
		'MODE', 'DEFAULT'
	);
};

Jools.subclass( DiscButtonNormal, Disc.DiscButton );


/*
| Sketches the button's icon.
*/
DiscButtonNormal.prototype.sketchIcon =
	function(
		fabric,
		border,
		twist
	)
{
	var wx = 19;
	var ny = 13;

	//
	//
	//  A
	//  **
	//  ***
	//  ****
	//  *****
	//  ******
	//  *******
	//  **F**C*B
	//  G   **
	//       **
	//        ED

	fabric.moveTo( wx +  0, ny +  0 );  // A
	fabric.lineTo( wx + 11, ny + 10 );  // B
	fabric.lineTo( wx +  6, ny + 11 );  // C
	fabric.lineTo( wx +  9, ny + 17 );  // D
	fabric.lineTo( wx +  7, ny + 18 );  // E
	fabric.lineTo( wx +  4, ny + 12 );  // F
	fabric.lineTo( wx +  0, ny + 15 );  // G
	fabric.lineTo( wx +  0, ny +  0 );  // A
};


/*
| Draws the buttons icon
*/
DiscButtonNormal.prototype.drawIcon =
	function(
		fabric
	)
{
	fabric.paint(
		this.myStyle.icon,
		this,
		'sketchIcon',
		Euclid.View.proper
	);
};


} )( );
