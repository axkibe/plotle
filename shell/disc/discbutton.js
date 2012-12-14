/*
| A button on a DiscPanel
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
		disc, // the disc the button belongs to
		name  // the name of the button (FIXME, needed?)
	)
{
	this.disc = disc;

	this.name = name;

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
		'image', this._weave( active, hover ),
		'pnw', this.pnw
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

		y -= Math.round( ( tZ - 1 ) / 2 * sepy );

		for( var a = 0; a < tZ; a++, y += sepy )
		{
			fabric.fillText(
				text[ a ],
				x,
				y,
				style.font
			);
		}
	}
	else if( style.icon )
	{
		fabric.paint(
			style.icon,
			this,
			style.icon.sketch,
			Euclid.View.proper
		);
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
| Sketches the normal button's icon.
*/
DiscButton.prototype.sketchNormalIcon =
	function(
		fabric
		// border,
		// twist
	)
{
	var wx = 19;
	var ny = 13;

	//
	//
	//  A
	//  **
	//  ***
	//  ****
	//  *****
	//  ******
	//  *******
	//  **F**C*B
	//  G   **
	//       **
	//        ED

	fabric.moveTo( wx +  0, ny +  0 );  // A
	fabric.lineTo( wx + 11, ny + 10 );  // B
	fabric.lineTo( wx +  6, ny + 11 );  // C
	fabric.lineTo( wx +  9, ny + 17 );  // D
	fabric.lineTo( wx +  7, ny + 18 );  // E
	fabric.lineTo( wx +  4, ny + 12 );  // F
	fabric.lineTo( wx +  0, ny + 15 );  // G
	fabric.lineTo( wx +  0, ny +  0 );  // A
};


/*
| Sketches the remove button's icon.
*/
DiscButton.prototype.sketchRemoveIcon =
	function(
		fabric
		// border,
		// twist
	)
{
	var w = 11;
	var h = 11;

	// zone
	var wx = 17;
	var ny = 16;
	var ex = wx + w;
	var sy = ny + h;

	var cx = Jools.half( wx + ex );
	var cy = Jools.half( ny + sy );

	// arm with and height
	var aw = 2;
	var ah = 2;

	// center point width/height
	var cw = 2;
	var ch = 2;

	//
	// A**B   D**E
	// P***   ***F
	//   ***C***
	//    O***G
	//   ***K***
	// N***   ***H
	// M**L   J**I
	//

	fabric.moveTo( wx      , ny      );  // A
	fabric.lineTo( wx + aw , ny      );  // B
	fabric.lineTo( cx      , cy - ch );  // C
	fabric.lineTo( ex - aw , ny      );  // D
	fabric.lineTo( ex      , ny      );  // E
	fabric.lineTo( ex      , ny + ah );  // F
	fabric.lineTo( cx + cw , cy      );  // G
	fabric.lineTo( ex      , sy - ah );  // H
	fabric.lineTo( ex      , sy      );  // I
	fabric.lineTo( ex - aw , sy      );  // J
	fabric.lineTo( cx      , cy + ch );  // K
	fabric.lineTo( wx + aw , sy      );  // L
	fabric.lineTo( wx      , sy      );  // M
	fabric.lineTo( wx      , sy - ah );  // N
	fabric.lineTo( cx - cw , cy      );  // O
	fabric.lineTo( wx      , ny + ah );  // P
	fabric.lineTo( wx      , ny      );  // A

};


/*
| Button is being pushed.
*/
DiscButton.prototype.push =
	function( )
{
	this.disc.pushButton( this.name );
	/*
	switch( this.pushChange )
	{
		case 'Mode' :
			shell.bridge.changeMode( this.pushValue );
			break;

		case 'Create' :
			shell.bridge.changeCreate( this.pushValue );
			break;
	}
	*/
};


} )( );
