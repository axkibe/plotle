/*
| A checkbox
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var Widgets;
Widgets =
	Widgets || { };


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
{
	throw new Error( 'this code needs a browser!' );
}


/*
| Constructor.
*/
var CheckBox =
Widgets.CheckBox =
	function(
		// ... free strings ...
	)
{
	Widgets.Widget.call(
		this,
		'CheckBox',
		arguments
	);

	var twig =
		this.twig;

	var parent =
		this.parent;

	var inherit =
		this.inherit;

	this.box =
		new Euclid.Rect(
			'pnw/pse',
			parent.iframe.computePoint( twig.box.pnw ),
			parent.iframe.computePoint( twig.box.pse )
		);

	this._$checked =
		inherit ? inherit._$checked : true;

	this.$visible =
		inherit ? inherit.$visible : true;

	this.$accent =
		Widgets.Accent.NORMAL;
};


/*
| CheckBoxes are Widgets
*/
Jools.subclass(
	CheckBox,
	Widgets.Widget
);


/*
| CheckBoxes are focusable.
*/
CheckBox.prototype.focusable =
	true;


/*
| True when checked.
*/
CheckBox.prototype.isChecked =
	function( )
{
	return this._$checked;
};


/*
| Sets the current checked state
*/
CheckBox.prototype.setChecked =
	function(
		checked
	)
{
	if( typeof( checked ) !== 'boolean' )
	{
		throw new Error(
			'CheckBox setChecked not boolean: ' + checked
		);
	}

	this._$checked =
		checked;

	this.poke( );

	return checked;
};


/*
| Mouse hover.
*/
CheckBox.prototype.pointingHover =
	function(
		// p
	)
{
	return null;
};


/*
| Sketches the check
*/
CheckBox.prototype.sketchCheck =
	function(
		fabric
		// border,
		// twist
	)
{
	var pc =
		this.box.pc;

	var pcx =
		pc.x;

	var pcy =
		pc.y;

	fabric.moveTo(
		pcx -  5,
		pcy -  3
	);

	fabric.lineTo(
		pcx +  2,
		pcy +  5
	);

	fabric.lineTo(
		pcx + 14,
		pcy - 12
	);

	fabric.lineTo(
		pcx +  2,
		pcy -  1
	);

	fabric.lineTo(
		pcx -  5,
		pcy -  3
	);
};


/*
| CheckBox is being changed.
*/
CheckBox.prototype.change =
	function(
		// shift,
		// ctrl
	)
{
	// no default
};


/*
| User is starting to point something ( mouse down, touch start )
*/
CheckBox.prototype.pointingStart =
	function(
		p
		// shift,
		// ctrl
	)
{
	if( !this.$visible )
	{
		return null;
	}

	if(
		this.box.within(
			Euclid.View.proper,
			p
		)
	)
	{
		this._$checked =
			!this._$checked;

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
CheckBox.prototype.specialKey =
	function(
		key
	)
{
	switch( key )
	{
		case 'down' :

			this.parent.cycleFocus( +1 );

			return;

		case 'up' :

			this.parent.cycleFocus( -1 );

			return;

		case 'enter' :

			this._$checked =
				!this._$checked;

			this.poke( );

			return;
	}
};


/*
| Any normal key for a checkbox triggers it to flip
*/
CheckBox.prototype.input =
	function(
		// text
	)
{
	this._$checked =
		!this._$checked;

	this.poke( );

	return true;
};


/*
| Draws the checkbox.
*/
CheckBox.prototype.draw =
	function(
		fabric,
		accent
	)
{
	if( !this.$visible )
		{ return; }

	var twig = this.twig;

	var sname;
	switch( accent )
	{
		case Widgets.Accent.NORMA :
			sname = twig.normaStyle;
			break;

		case Widgets.Accent.HOVER :
			sname = twig.hoverStyle;
			break;

		case Widgets.Accent.FOCUS :
			sname = twig.focusStyle;
			break;

		case Widgets.Accent.HOFOC :
			sname = twig.hofocStyle;
			break;

		default :
			throw new Error( 'Invalid accent: ' + accent );
	}

	var style = Widgets.getStyle( sname );

	if( !Jools.isnon( style ) )
		{ throw new Error('Invalid style: ' + sname); }

	fabric.paint(
		style,
		this.box,
		'sketch',
		Euclid.View.proper
	);

	if( this._$checked )
	{
		fabric.paint(
			Widgets.getStyle( 'checkboxCheck' ),
			this,
			'sketchCheck',
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

	this.parent.poke( );
};


/*
| Force clears all caches.
*/
CheckBox.prototype.knock = function( )
{
	//this.$fabric = null;
};


} )( );
