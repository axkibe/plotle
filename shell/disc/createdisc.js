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
 ,--.             .      .-,--.
 | `-' ,-. ,-. ,-. |- ,-. ' |   \ . ,-. ,-.
 |   . |   |-' ,-| |  |-' , |   / | `-. |
 `--'  '   `-' `-^ `' `-' `-^--'  ' `-' `-'

~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 The creation disc.

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
var CreateDisc = Disc.CreateDisc =
	function(
		screensize
	)
{
	this.$screensize = screensize;

	var width  = this.width  = 150;
	var height = this.height = 710; // 690?

	var overshootX = 70;
	var overshootY = 10;

	var silhoutte = this.silhoutte = new Euclid.Ellipse(
		new Euclid.Point(
			-width - overshootX,
			-overshootY
		),
		new Euclid.Point(
			width - 1,
			height + overshootY
		),
		'gradientPC', new Euclid.Point(
			-600,
			Jools.half( height )
		),
		'gradientR0',  0,
		'gradientR1',  650
	);

	/*
	var buttons = this.buttons =
	{
		normal : new Disc.DiscButtonNormal( ),
		create : new Disc.DiscButtonCreate( )
	};*/
};



/*
| Force clears all caches.
*/
CreateDisc.prototype.knock = function( )
{
	this.$fabric = null;
};


/*
| Prepares the disc panels contents.
*/
CreateDisc.prototype._weave = function( )
{
	/* TODO
	if( this.$fabric && !config.debug.noCache )
		{ return this.$fabric; }
	*/

	var fabric = this.$fabric = new Euclid.Fabric(
		this.width,
		this.height
	);

	fabric.fill(
		theme.disc.fill,
		this.silhoutte,
		'sketch',
		Euclid.View.proper
	);

	var buttons = this.buttons;
	var buttonsStyle = theme.disc.buttons;

	for( var name in this.buttons )
		{ buttons[ name ].draw( fabric ); }


	fabric.edge(
		theme.disc.edge,
		this.silhoutte,
		'sketch',
		Euclid.View.proper
	);

	if( config.debug.drawBoxes )
	{
		fabric.paint(
			Dash.getStyle( 'boxes' ),
			new Euclid.Rect(
				Euclid.Point.zero,
				new Euclid.Point( this.width - 1, this.height - 1)
			),
			'sketch',
			Euclid.View.proper
		);
	}

	return fabric;
};


/*
| Draws the disc panel.
*/
CreateDisc.prototype.draw = function( fabric )
{
	return;

	fabric.drawImage(
		this._weave( ),
		0,
		Jools.half( this.$screensize.y - this.height )
	);
};


/*
| Returns true if point is on the disc panel.
*/
CreateDisc.prototype.pointingHover = function( p, shift, ctrl )
{
	return 'default';
};


/*
| Returns true if point is on this panel.
*/
CreateDisc.prototype.pointingStart = function( p, shift, ctrl )
{
	return null;
};


/*
| User is inputing text.
*/
CreateDisc.prototype.input = function( text )
{
	// TODO
	return;
};


/*
| Cycles the focus
*/
CreateDisc.prototype.cycleFocus = function( dir )
{
	throw new Error( 'TODO' );
};


/*
| User is pressing a special key.
*/
CreateDisc.prototype.specialKey = function( key, shift, ctrl )
{
	// TODO
};


/*
| Clears caches.
*/
CreateDisc.prototype.poke = function( )
{
	this.$fabric = null;
	shell.redraw = true;
};


} )( );
