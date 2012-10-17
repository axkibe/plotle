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
		disc,
		name
	)
{
	this.disc    = disc;
	this.name    = name;
	var gStyle  = this.gStyle  = theme.disc.main.buttons.generic;
	var myStyle = this.myStyle = theme.disc.main.buttons[ name ];

	var width  = gStyle.width;
	var height = gStyle.height;

	var pnw = this.pnw = myStyle.pnw;
	var pse = this.pse = pnw.add(
		width,
		height
	);

	this.ellipse = new Euclid.Ellipse(
		Euclid.Point.zero,
		new Euclid.Point(
			width,
			height
		)
	);

	Jools.immute( this );
};


/*
| Draws the button.
*/
DiscButton.prototype.draw =
	function(
		fabric,
		hover,
		active
	)
{
	fabric.drawImage(
		this._weave( hover, active ),
		this.pnw
	);
};


DiscButton.prototype._weave =
	function( hover, active )
{
	var fabricName;
	var gStyle = this.gStyle;
	var style;

	if( active )
	{
		fabricName = '$fabricActive';
		style = gStyle.active;
	}
	else if( hover )
	{
		fabricName = '$fabricHover';
		style = gStyle.hover;
	}
	else
	{
		fabricName = '$fabricName';
		style = gStyle.normal;
	}

	var fabric = this[ fabricName ];

	/* TODO
	if( this.$fabric && !config.debug.noCache )
	{
		return this.$fabric;
	}
	*/

	fabric = new Euclid.Fabric(
		gStyle.width  + 1,
		gStyle.height + 1
	);

	this[ fabricName ] = fabric;

	fabric.paint(
		style,
		this.ellipse,
		'sketch',
		Euclid.View.proper
	);

	this.drawIcon( fabric );

	return fabric;
};


/*
| Users pointing device may be hovering above the button
*/
DiscButton.prototype.pointingHover =
	function(
		p
	)
{
	var pnw = this.pnw;
	var pse = this.pse;

	if(
		p === null  ||
		p.x < pnw.x ||
		p.y < pnw.y ||
		p.x > pse.x ||
		p.y > pse.y
	)
	{
		return null;
	}

	var fabric = this._weave( false );
	var pp = p.sub( this.pnw );

	if(
		!fabric.withinSketch(
			this.ellipse,
			'sketch',
			Euclid.View.proper,
			pp
		)
	)
	{
		return null;
	}

	this.disc.setHover( this.name );

	return 'default';
};


/*
| The users might point his/her pointing device ( touch or mouse )
| on this button.
*/
DiscButton.prototype.pointingStart =
	function(
		p
	)
{
	var pnw = this.pnw;
	var pse = this.pse;

	if(
		p === null  ||
		p.x < pnw.x ||
		p.y < pnw.y ||
		p.x > pse.x ||
		p.y > pse.y
	)
	{
		return null;
	}

	var fabric = this._weave( false );
	var pp = p.sub( this.pnw );

	if(
		!fabric.withinSketch(
			this.ellipse,
			'sketch',
			Euclid.View.proper,
			pp
		)
	)
	{
		return null;
	}

	this.disc.setActive( this.name );

	return  false;
};

} )( );
