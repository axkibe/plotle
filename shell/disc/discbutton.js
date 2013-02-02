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
{
	throw new Error( 'this code needs a browser!' );
}


/*
| Constructor.
|
| Free string style arguments:
|
|	disc
|		the disc the button belongs to
|
|	name
|		the name of the label
*/
var DiscButton =
Disc.DiscButton =
	function( )
{
	var a =
		0;

	var aZ =
		arguments.length;

	var disc;
	var name;

	while( a < aZ )
	{
		switch( arguments[ a ] )
		{
			case 'disc' :

				disc =
				this.disc =
					arguments[ a + 1 ];

				a += 2;

				break;

			case 'name' :

				name =
				this.name =
					arguments[ a + 1 ];

				a += 2;

				break;

			default :

				throw new Error(
					'unknown argument: ' + arguments[ a ]
				);
		}
	}

	if( !this.disc )
	{
		throw new Error( 'required argument disc missing' );
	}

	if( !this.name )
	{
		throw new Error( 'required argument name missing' );
	}

	var gstyle =
	this._gstyle =
		theme.disc[ disc.name ].buttons.generic;

	var style =
	this._style =
		theme.disc[ disc.name ].buttons[ name ];

	var offset =
	this._offset =
		style.offset || gstyle.offset;

	var width =
	this.width =
		style.width || gstyle.width;

	var height =
	this.height =
		style.height || gstyle.height;

	var pnw =
	this.pnw =
		style.pnw;

	this.pse =
		pnw.add(
			width,
			height
		);

	if( !offset )
	{
		this.ellipse =
			new Euclid.Ellipse(
				Euclid.Point.zero,
				new Euclid.Point(
					width,
					height
				)
			);
	}
	else
	{
		this.ellipse =
			new Euclid.Ellipse(
				new Euclid.Point(
					offset.x,
					offset.y
				),
				new Euclid.Point(
					width,
					height
				)
			);
	}

	this._$visible =
		true;

	this._$text =
		style.text;

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
	if( !this._$visible ) {
		return;
	}

	fabric.drawImage(
		'image',
			this._weave( active, hover ),
		'pnw',
			this.pnw
	);
};


/*
| Clears caches.
*/
DiscButton.prototype.poke =
	function(
	)
{
	// TODO remove cache

	this.disc.poke( );
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

	var gstyle =
		this._gstyle;

	var style;

	if( active )
	{
		fabricName =
			'$fabricActive';

		style =
			gstyle.active;
	}
	else if( hover )
	{
		fabricName =
			'$fabricHover';

		style =
			gstyle.hover;
	}
	else
	{
		fabricName =
			'$fabricName';

		style =
			gstyle.normal;
	}

	var fabric =
		this[ fabricName ];

	if(
		this.fabric &&
		!config.debug.noCache
	)
	{
		return this.$fabric;
	}

	fabric =
	this[ fabricName ] =
		new Euclid.Fabric(
			this.width  + 1,
			this.height + 1
		);

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
| Sets the button in/visible.
*/
DiscButton.prototype.setVisibility =
	function(
		visible
	)
{
	this._$visible
		= visible;
};

/*
| Returns visibility status.
*/
DiscButton.prototype.isVisible =
	function( )
{
	return this._$visible;
};


/*
| Sets the buttons text.
*/
DiscButton.prototype.setText =
	function(
		text
	)
{
	if( this._$text === text )
	{
		return;
	}

	this._$text
		= text;

	this.poke( );
};


/*
| Draws the buttons icon.
*/
DiscButton.prototype.drawIcon =
	function(
		fabric
	)
{
	var style =
		this._style;

	var text =
		this._$text;

	var textAnchor =
		style.textAnchor;

	var textRotate =
		style.textRotate;

	if( Jools.isString( text ) )
	{
		if( !Jools.is( textRotate ) )
		{
			fabric.paintText(
				'text',
					text,
				'p',
					textAnchor,
				'font',
					style.font
			);
		}
		else
		{
			fabric.paintText(
				'text',
					text,
				'p',
					textAnchor,
				'font',
					style.font,
				'rotate',
					textRotate
			);
		}
	}
	else if( Jools.isArray( text ) )
	{
		var x =
			textAnchor.x;

		var y =
			textAnchor.y;

		var tZ =
			text.length;

		var sepy =
			style.textSepY;

		y -=
			Math.round( ( tZ - 1 ) / 2 * sepy );

		for( var a = 0; a < tZ; a++, y += sepy )
		{
			fabric.paintText(
				'text',
					text[ a ],
				'xy',
					x,
					y,
				'font',
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
	var pnw =
		this.pnw;

	var pse =
		this.pse;

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

	var fabric =
		this._weave( false );

	var pp =
		p.sub( this.pnw );

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
	var w =
		11;

	var h =
		11;

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
};


} )( );
