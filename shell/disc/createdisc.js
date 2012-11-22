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
	this.screensize = screensize;
	this.name = 'create';

	var style = this._style = theme.disc.create;

	var width  = this.width  = style.width;
	var height = this.height = style.height;

	var ew = style.ellipse.width;
	var eh = style.ellipse.height;

	this.pnw = new Euclid.Point(
		0,
		Jools.half( this.screensize.y - this.height )
	);

	this.pse = this.pnw.add(
		width,
		height
	);


	var silhoutte = this.silhoutte = new Euclid.Ellipse(
		new Euclid.Point(
			width - 1 - ew,
			0 - Jools.half( eh - height )
		),
		new Euclid.Point(
			width - 1,
			height + Jools.half( eh - height )
		),
		'gradientPC', new Euclid.Point(
			-600,
			Jools.half( height )
		),
		'gradientR0',  0,
		'gradientR1',  650
	);

	var buttons = this.buttons =
	{
		note     : new Disc.DiscButtonCreateNote     ( this ),
		label    : new Disc.DiscButtonCreateLabel    ( this ),
		relation : new Disc.DiscButtonCreateRelation ( this ),
		portal   : new Disc.DiscButtonCreatePortal   ( this )
	};

	this.$hover  = null;
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
	var fabric = this.$fabric = new Euclid.Fabric(
		this.width,
		this.height
	);

	fabric.fill(
		this._style.fill,
		this.silhoutte,
		'sketch',
		Euclid.View.proper
	);

	var buttons = this.buttons;
	var buttonsStyle = theme.disc.buttons;

	for( var name in this.buttons )
	{
		var button = buttons[ name ];

		button.draw(
			fabric,
			shell.bridge.inCreate( button.pushValue ),
			this.$hover  === name
		);
	}

	fabric.edge(
		this._style.edge,
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
	fabric.drawImage(
		this._weave( ),
		0,
		Jools.half( this.screensize.y - this.height )
	);
};


/*
| Returns true if point is on the disc panel.
*/
CreateDisc.prototype.pointingHover = function( p, shift, ctrl )
{
	var pnw = this.pnw;
	var pse = this.pse;
	var a, aZ;

	// shortcut if p is not near the panel
	if(
		p === null ||
		p.y < pnw.y ||
		p.y > pse.y ||
		p.x < pnw.x ||
		p.x > pse.x
	)
	{
		return this.setHover( null );
	}

	var fabric = this._weave();

	var pp = p.sub(pnw);

	// FIXME Optimize by reusing the latest path of this.$fabric
	if( !fabric.withinSketch(
			this.silhoutte,
			'sketch',
			Euclid.View.proper,
			pp
		)
	)
	{
		return this.setHover( null );
	}

	// this is on the disc
	var buttons = this.buttons;

	var cursor = null;
	for( var name in buttons )
	{
		cursor = buttons[ name ].
			pointingHover( pp, shift, ctrl );

		if ( cursor )
			{ break; }
	}

	if ( cursor === null )
	{
		this.setHover( null );
	}

	return cursor || 'default';
};


/*
| Returns true if point is on this panel.
*/
CreateDisc.prototype.pointingStart = function( p, shift, ctrl )
{
	var pnw = this.pnw;
	var pse = this.pse;
	var a, aZ;

	// shortcut if p is not near the panel
	if(
		p.y < pnw.y ||
		p.y > pse.y ||
		p.x < pnw.x ||
		p.x > pse.x
	)
	{
		return null;
	}

	var fabric = this._weave();

	var pp = p.sub(pnw);

	// FIXME Optimize by reusing the latest path of this.$fabric
	if(
		!fabric.withinSketch(
			this.silhoutte,
			'sketch',
			Euclid.View.proper,
			pp
		)
	)
	{
		return null;
	}

	// this is on the disc
	var buttons = this.buttons;

	var cursor = null;
	for( var name in buttons )
	{
		var r = buttons[ name ].
			pointingStart( pp, shift, ctrl );

		if ( r )
			{ return r; }
	}

	return false;
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

/*
| Sets the hovered component.
*/
CreateDisc.prototype.setHover = function( name )
{
	if( this.$hover === name )
	{
		return null;
	}

	this.$fabric = null;
	this.$hover  = name;

	shell.redraw = true;
};


} )( );
