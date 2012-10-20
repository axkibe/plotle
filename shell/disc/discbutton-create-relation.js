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
 ,--.             .     .-,--.     .      .
 | `-' ,-. ,-. ,-. |- ,-. `|__/ ,-. |  ,-. |- . ,-. ,-.
 |   . |   |-' ,-| |  |-' )| \  |-' |  ,-| |  | | | | |
 `--'  '   `-' `-^ `' `-' `'  ` `-' `' `-^ `' ' `-' ' '

~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 The relation button on the creation disc.

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
var DiscButtonCreateRelation = Disc.DiscButtonCreateRelation =
	function( disc )
{
	Disc.DiscButton.call(
		this,
		disc,
		'relation'
	);
};

Jools.subclass( DiscButtonCreateRelation, Disc.DiscButton );


/*
| Draws the buttons icon
*/
DiscButtonCreateRelation.prototype.drawIcon =
	function(
		fabric
	)
{
	var ax = this.myStyle.textAnchor.x;
	var ay = this.myStyle.textAnchor.x;

	fabric.fillText(
		'Rela-',
		ax,
		ay - 10,
		this.myStyle.font
	);

	fabric.fillText(
		'tion',
		ax,
		ay + 10,
		this.myStyle.font
	);
};


/*
| Button is being pushed.
*/
DiscButtonCreateRelation.prototype.push =
	function( )
{
	shell.bridge.changeCreate( this.name );
};


} )( );
