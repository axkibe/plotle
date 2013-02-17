/*
| A button on a DiscPanel
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var Disc;
Disc =
	Disc || { };


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

	this._$visible =
		true;

	this._$text =
		null;

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

			case 'visibility' :

				this._$visible =
					!!arguments[ a + 1 ];

				a += 2;

				break;

			case 'text' :

				this._$text =
					arguments[ a + 1 ];

				a += 2;

				break;

			case 'icons' :

				this.icons =
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

	if( this._$text === null )
	{
		this._$text =
			style.text;
	}

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
| Gets the buttons text.
*/
DiscButton.prototype.getText =
	function( )
{
	return this._$text;
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
			this.icons,
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
| Button is being pushed.
*/
DiscButton.prototype.push =
	function( )
{
	this.disc.pushButton( this.name );
};


} )( );
