/*
| The note button on the creation disc.
|
| Authors: Axel Kittenberger
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
var DiscButtonCreateNote = Disc.DiscButtonCreateNote =
	function( disc )
{
	Disc.DiscButton.call(
		this,
		disc,
		'note',
		'CREATE', 'NOTE'
	);
};

Jools.subclass( DiscButtonCreateNote, Disc.DiscButton );


/*
| Draws the buttons icon
*/
DiscButtonCreateNote.prototype.drawIcon =
	function(
		fabric
	)
{
	fabric.fillText(
		'Note',
		this.myStyle.textAnchor,
		this.myStyle.font
	);
};


} )( );
