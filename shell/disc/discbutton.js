/*
|
| A button on the DiscPanel.
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
var Euclid;
var Jools;
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
| Constructor.
*/
var DiscButton = Disc.DiscButton =
	function(
		disc,          // the disc the button belongs to
		name,          // the name of the button (FIXME, needed?)
		pushChange,    // if set, which bridge field to change on push
		pushValue      // if set, what to set the bridge field to on push
	)
{
	this.disc = disc;

	this.name = name;

	this.pushChange = pushChange;

	this.pushValue = pushValue;

	var gStyle =
	this.gStyle =
		theme.disc[ disc.name ].buttons.generic;

	var myStyle =
	this.myStyle =
		theme.disc[ disc.name ].buttons[ name ];

	var width  = gStyle.width;
	var height = gStyle.height;

	var pnw =
	this.pnw =
		myStyle.pnw;

	this.pse =
		pnw.add(
			width,
			height
		);

	this.ellipse =
		new Euclid.Ellipse(
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
		active,
		hover
	)
{
	fabric.drawImage(
		this._weave( active, hover ),
		this.pnw
	);
};


/*
| Weaves the buttons fabric
*/
DiscButton.prototype._weave =
	function(
		active, // true if this button is active
		hover   // true if the pointing device is hovering above this
	)
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
| Draws the buttons icon.
*/
DiscButton.prototype.drawIcon =
	function(
		fabric
	)
{
	var style = this.myStyle;

	var text = style.text;

	if( Jools.isString( text ) )
	{
		fabric.fillText(
			text,
			style.textAnchor,
			style.font
		);
	}
	else if( Jools.isArray( text ) )
	{
		var x = style.textAnchor.x;

		var y = style.textAnchor.y;

		var tZ = text.length;

		var sepy = style.textSepY;

		y -= Math.round( ( tZ - 1 ) / 2 * sepy);

		for( var a = 0; a < tZ; a++, y += sep y)
		{
			fabric.fillText(
				text[ a ],
				x,
				y,
				style.font
			);
		}
	}
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

	this.push( );

	return  false;
};


/*
| Button is being pushed.
*/
DiscButton.prototype.push =
	function( )
{
	switch( this.pushChange )
	{
		case 'MODE' :
			shell.bridge.changeMode( this.pushValue );
			break;

		case 'CREATE' :
			shell.bridge.changeCreate( this.pushValue );
			break;
	}
};


} )( );
