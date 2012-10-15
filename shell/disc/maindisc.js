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
  ,-,-,-.             .-,--.
  `,| | |   ,-. . ,-. ' |   \ . ,-. ,-.
    | ; | . ,-| | | | , |   / | `-. |
    '   `-' `-^ ' ' ' `-^--'  ' `-' `-'

~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 The new disc panel.

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
var MainDisc = Disc.MainDisc =
	function(
		name,
		inherit,
		board,
		screensize
	)
{
	this.name  = name;
	this.board = board;

	this.screensize = screensize;
	var width  = this.width  =  90;
	var height = this.height = 600; // 690?

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

	var buttonsWidth  = 44;
	var buttonsHeight = 44;

	var buttons = this.buttons =
	{
		normal :
		{
			pnw : new Euclid.Point(
				4,
				70
			),

			sketchIcon : function( fabric, border, twist )
			{
				var pnw = buttons.normal.pnw;
				var wx = pnw.x + 19;
				var ny = pnw.y + 13;

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
			}
		},

		create :
		{
			pnw : new Euclid.Point(
				20,
				115
			),

			sketchIcon : function( fabric, border, twist )
			{
				var pnw = buttons.create.pnw;
				var wx = pnw.x + 23;
				var ny = pnw.y + 22;
				var myt = theme.disc.buttons.create;

				fabric.fillText(
					'log',
					wx,
					ny,
					myt.font
				);
			}
		}
	};

	for( var name in buttons ) {
		var button = buttons[ name ];
		button.ellipse = new Euclid.Ellipse(
			button.pnw,
			button.pnw.add(
				buttonsWidth,
				buttonsHeight
			)
		);

	}
};



/*
| Force clears all caches.
*/
MainDisc.prototype.knock = function( )
{
	this.$fabric = null;
};


/*
| Prepares the disc panels contents.
*/
MainDisc.prototype._weave = function( )
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
	{
		fabric.paint(
			buttonsStyle,
			buttons[name].ellipse,
			'sketch',
			Euclid.View.proper
		);

/*
		fabric.paint(
			buttonsStyle[name].icon,
			buttons[name],
			'sketchIcon',
			Euclid.View.proper
		);
		*/
	}


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
MainDisc.prototype.draw = function( fabric )
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
MainDisc.prototype.pointingHover = function( p, shift, ctrl )
{
	return 'default';
};


/*
| Returns true if point is on this panel.
*/
MainDisc.prototype.pointingStart = function( p, shift, ctrl )
{
	return null;
};


/*
| User is inputing text.
*/
MainDisc.prototype.input = function( text )
{
	// TODO
	return;
};


/*
| Cycles the focus
*/
MainDisc.prototype.cycleFocus = function( dir )
{
	throw new Error( 'TODO' );
};


/*
| User is pressing a special key.
*/
MainDisc.prototype.specialKey = function( key, shift, ctrl )
{
	// TODO
};


/*
| Clears caches.
*/
MainDisc.prototype.poke = function( )
{
	this.$fabric = null;
	shell.redraw = true;
};


} )( );
