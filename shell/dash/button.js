 /**____
 \  ___ `'.                          .
  ' |--.\  \                       .'|
  | |    \  '                     <  |
  | |     |  '    __               | |
  | |     |  | .:--.'.         _   | | .'''-.
  | |     ' .'/ |   \ |      .' |  | |/.'''. \
  | |___.' /' `" __ | |     .   | /|  /    | |
 /_______.'/   .'.''| |   .'.'| |//| |     | |
 \_______|/   / /   | |_.'.'.-'  / | |     | |
              \ \._,\ '/.'   \_.'  | '.    | '.
               `--'  `"            '---'   '---'
           ,-,---.     .  .
            '|___/ . . |- |- ,-. ,-.
            ,|   \ | | |  |  | | | |
           `-^---' `-^ `' `' `-' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A button on a panel.

 Authors: Axel Kittenberger

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


/*
| Export
*/
var Dash;
Dash = Dash || {};


/*
| Imports
*/
var Action;
var config;
var Curve;
var Euclid;
var Jools;
var Path;
var shell;
var system;
var theme;


/*
| Capsule
*/
( function( ) {
'use strict';

if( typeof( window ) === 'undefined' )
	{ throw new Error( 'this code needs a browser!' ); }


/*
| Constructor.
*/
var Button = Dash.Button = function( twig, panel, inherit, name )
{
	if ( twig.type !== 'Button' )
		{ throw new Error('invalid twig type'); }

	this.name        = name;
	this.twig        = twig;
	this.panel       = panel;

	var computePoint = Curve.computePoint;
	var pnw          = this.pnw    = computePoint( twig.frame.pnw, panel.iframe );
	var pse          = this.pse    = computePoint( twig.frame.pse, panel.iframe );
	var iframe       = this.iframe =
		new Euclid.Rect(
			Euclid.Point.zero,
			pse.sub( pnw )
		);

	this.curve        = new Curve( twig.curve, iframe );
	this.captionPos   = computePoint( twig.caption.pos, iframe );
	this.path         = new Path( [ panel.name, name ] );

	// if true repeats the push action if held down
	this.repeating    = false;

	this.$retimer     = null;
	this.$active      = inherit ? inherit.$active : false;
	this.$fabric      = null;
	this.$visible     = inherit ? inherit.$visible : true;
	this.$captionText = inherit ? inherit.$captionText : twig.caption.text;
	this.$accent      = Dash.Accent.NORMAL;
};



/*
| Control takes focus.
*/
Button.prototype.grepFocus = function( )
{
	if( !this.$visible )
		{ return false; }

	if( this.panel.focusedControl() === this )
		{ return false; }

	shell.setCaret(
		'board',
		{
			path : new Path( [ this.panel.name, this.name ] ),
			at1  : 0
		}
	);

	this.poke( );

	return true;
};


/*
| Sketches the button.
*/
Button.prototype.sketch = function( fabric, border, twist )
{
	this.curve.sketch( fabric, border, twist );
};


/*
| Returns the fabric for the button.
*/
Button.prototype._weave = function( accent )
{
	var fabric = this.$fabric;

	if( fabric &&
		this.$accent === accent &&
		!config.debug.noCache
	)
		{ return fabric; }

	fabric   = this.$fabric = new Euclid.Fabric( this.iframe );
	var twig = this.twig;

	var sname;
	switch( accent )
	{
		case Dash.Accent.NORMA :
			sname = twig.normaStyle;
			break;

		case Dash.Accent.HOVER :
			sname = twig.hoverStyle;
			break;

		case Dash.Accent.FOCUS :
			sname = twig.focusStyle;
			break;

		case Dash.Accent.HOFOC :
			sname = twig.hofocStyle;
			break;

		default :
			throw new Error( 'Invalid accent: ' + accent );
	}

	var style = Dash.getStyle( sname );

	if( !Jools.isnon( style ) )
		{ throw new Error('Invalid style: ' + sname); }

	fabric.paint( style, this, 'sketch', Euclid.View.proper );

	fabric.fillText(
		this.$captionText,
		this.captionPos,
		twig.caption.font
	);

	if( config.debug.drawBoxes )
	{
		fabric.paint(
			Dash.getStyle( 'boxes' ),
			new Euclid.Rect(
				this.iframe.pnw,
				this.iframe.pse.sub( 1, 1 )
			),
			'sketch',
			Euclid.View.proper
		);
	}

	return fabric;
};


/*
| Mouse hover.
*/
Button.prototype.pointingHover = function( p )
{
	if( !this.$visible )
		{ return null; }

	if( p === null )
		{ return null; }

	if( p.x < this.pnw.x ||
		p.y < this.pnw.y ||
		p.x > this.pse.x ||
		p.y > this.pse.y
	)
		{ return null; }

	var fabric = this._weave( Dash.Accent.NORMA );
	var pp = p.sub( this.pnw );

	if( !fabric.withinSketch(this, 'sketch', Euclid.View.proper, pp ) )
		{ return null; }

	this.panel.setHover( this.name );

	return 'default';
};


/*
| Button has been pushed
*/
Button.prototype.push = function( shift, ctrl )
{
	// no default
};


/*
| User is starting to point something ( mouse down, touch start )
*/
Button.prototype.pointingStart = function( p, shift, ctrl )
{
	var self = this;

	if(
		!this.$visible ||
		p.x < this.pnw.x ||
		p.y < this.pnw.y ||
		p.x > this.pse.x ||
		p.y > this.pse.y
	)
	{
		return null;
	}

	var fabric = this._weave( Dash.Accent.NORMA );
	var pp = p.sub( this.pnw );

	if(!
		fabric.withinSketch(
			this,
			'sketch',
			Euclid.View.proper,
			pp
		)
	)
	{
		return null;
	}

	if( this.repeating && !this.retimer )
	{
		shell.bridge.startAction(
			'REBUTTON',
			'board',
			'itemPath', this.path
		);

		var repeatFunc;
		repeatFunc =
			function( )
			{
				self.push( false, false );
				self.$retimer = system.setTimer( theme.zoom.repeatTimer, repeatFunc );
				shell.poke( );
			};

		this.$retimer = system.setTimer( theme.zoom.firstTimer, repeatFunc );
	}

	this.push( shift, ctrl );

	return this.repeating ? 'drag' : false;
};


/*
| Special keys for buttons having focus
*/
Button.prototype.specialKey = function( key )
{
	switch( key )
	{
		case 'down' :
			this.panel.cycleFocus( +1 );
			return;

		case 'up' :
			this.panel.cycleFocus( -1 );
			return;

		case 'enter' :
			this.push( false, false );
			return;
	}
};


/*
| Any normal key for a button having focus triggers a push.
*/
Button.prototype.input = function( text )
{
	this.push( false, false );
	return true;
};


/*
| Draws the button.
*/
Button.prototype.draw = function( fabric, accent )
{
	if( !this.$visible )
		{ return; }

	fabric.drawImage( this._weave( accent ), this.pnw );
};


/*
| Clears all caches.
*/
Button.prototype.poke = function( )
{
	this.$fabric = null;
	this.panel.poke( );
};


/*
| Force clears all caches.
*/
Button.prototype.knock = function( )
{
	this.$fabric = null;
};



/*
| Stops a REBUTTON action.
*/
Button.prototype.actionstop = function( )
{
	system.cancelTimer( this.$retimer );
	this.$retimer = null;

	shell.bridge.stopAction( );
};


} )( );
