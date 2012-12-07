/*
| The label button on the creation disc.
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
var DiscButtonCreateLabel = Disc.DiscButtonCreateLabel =
	function( disc )
{
	Disc.DiscButton.call(
		this,
		disc,
		'label',
		'CREATE', 'LABEL'
	);
};


Jools.subclass(
	DiscButtonCreateLabel,
	Disc.DiscButton
);


/*
| Draws the buttons icon
*/
DiscButtonCreateLabel.prototype.drawIcon =
	function(
		fabric
	)
{
	fabric.fillText(
		'Label',
		this.myStyle.textAnchor,
		this.myStyle.font
	);
};

} )( );
