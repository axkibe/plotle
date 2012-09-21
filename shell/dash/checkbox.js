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
     ,--. .           .   ,-,---.
     | `-' |-. ,-. ,-. | ,  '|___/ ,-. . ,
     |   . | | |-' |   |<   ,|   \ | |  X
     `--'  ' ' `-' `-' ' ` `-^---' `-' ' `
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A checkbox

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

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
var CheckBox = Dash.CheckBox = function( twig, panel, inherit, name )
{
	if ( twig.type !== 'CheckBox' )
		{ throw new Error('invalid twig type'); }

	this.name        = name;
	this.twig        = twig;
	this.panel       = panel;

	var computePoint = Curve.computePoint;
	var box = this.box = new Euclid.Rect(
		computePoint( twig.box.pnw, panel.iframe ),
		computePoint( twig.box.pse, panel.iframe )
	);

	this.path         = new Path( [ panel.name, name ] );

	this._$checked     = inherit ? inherit._$checked : true;
	//this.$fabric      = null;
	this.$visible     = inherit ? inherit.$visible : true;
	this.$accent      = Dash.Accent.NORMAL;
};


/*
| Returns the current value (text in the box)
*/
CheckBox.prototype.getValue = function()
{
	return this._$checked;
};


/*
| Returns the current value (text in the box)
*/
CheckBox.prototype.setValue = function( value )
{
	if( typeof( value ) !== 'boolean' )
		{ throw new Error( 'Checkbox value not boolean: ' + value ); }

	this._$checked = value;
	this.poke();
	return value;
};


/*
| Control takes focus.
*/
CheckBox.prototype.grepFocus = function( )
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
| Mouse hover.
*/
CheckBox.prototype.pointingHover = function( p )
{
	return null;
};


/*
| Sketches the check
*/
CheckBox.prototype.sketchCheck = function( fabric, border, twist )
{
	var pc  = this.box.pc;
	var pcx = pc.x;
	var pcy = pc.y;

	fabric.moveTo( pcx -  5, pcy -  3 );
	fabric.lineTo( pcx +  2, pcy +  5 );
	fabric.lineTo( pcx + 14, pcy - 12 );
	fabric.lineTo( pcx +  2, pcy -  1 );
	fabric.lineTo( pcx -  5, pcy -  3 );
};


/*
| CheckBox is being changed.
*/
CheckBox.prototype.change = function( shift, ctrl )
{
	// no default
};


/*
| User is starting to point something ( mouse down, touch start )
*/
CheckBox.prototype.pointingStart = function( p, shift, ctrl )
{
	var self = this;

	if( !this.$visible )
		{ return null; }

	if( this.box.within( Euclid.View.proper, p ) )
	{
		this._$checked = !this._$checked;
		this.poke();
		return false;
	}
	else
	{
		return null;
	}
};


/*
| Special keys for buttons having focus
*/
CheckBox.prototype.specialKey = function( key )
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
			this._$checked = !this._$checked;
			this.poke();
			return;
	}
};


/*
| Any normal key for a checkbox triggers it to change
*/
CheckBox.prototype.input = function( text )
{
	this._$checked = !this._$checked;
	this.poke();
	return true;
};


/*
| Draws the checkbox.
*/
CheckBox.prototype.draw = function( fabric, accent )
{
	if( !this.$visible )
		{ return; }

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

	fabric.paint( style, this.box, 'sketch', Euclid.View.proper );

	if( this._$checked ) {
		fabric.paint(
			Dash.getStyle( 'checkboxCheck' ),
			this,
			'sketchCheck',
			Euclid.View.proper
		);
	}

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
| Clears all caches.
*/
CheckBox.prototype.poke = function( )
{
	//this.$fabric = null;
	this.panel.poke( );
};


/*
| Force clears all caches.
*/
CheckBox.prototype.knock = function( )
{
	//this.$fabric = null;
};


} )( );
