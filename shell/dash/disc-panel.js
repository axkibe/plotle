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
     .-,--.           .-,--.             .
     ' |   \ . ,-. ,-. '|__/ ,-. ,-. ,-. |
     , |   / | `-. |   ,|    ,-| | | |-' |
     `-^--'  ' `-' `-' `'    `-^ ' ' `-' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 The new disc panel.

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
var config;
var Curve;
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
var DiscPanel = Dash.DiscPanel =
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

	var buttonsWidth  = 40;
	var buttonsHeight = 40;

	var buttons = this.buttons =
	{
		normal :
		{
			pnw : new Euclid.Point(
				6,
				70
			),

			sketchIcon : function( fabric, border, twist ) {
				var pnw = buttons.normal.pnw;
				var wx = pnw.x + 16;
				var ny = pnw.y + 11;

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
				fabric.lineTo( wx + 12, ny + 11 );  // B
				fabric.lineTo( wx +  7, ny + 11 );  // C
				fabric.lineTo( wx + 11, ny + 18 );  // D
				fabric.lineTo( wx +  8, ny + 18 );  // E
				fabric.lineTo( wx +  4, ny + 12 );  // F
				fabric.lineTo( wx +  0, ny + 15 );  // G
				fabric.lineTo( wx +  0, ny +  0 );  // A
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
DiscPanel.prototype.knock = function( )
{
	this.$fabric = null;
};


/*
| Prepares the disc panels contents.
*/
DiscPanel.prototype._weave = function( )
{
	/* TODO
	if( this.$fabric && !config.debug.noCache )
		{ return this.$fabric; }
	*/

	var fabric = this.$fabric = new Euclid.Fabric(
		this.width,
		this.height
	);

	var panelStyle = theme.dash.discPanel;

	if( !panelStyle )
		{ throw new Error('no style!'); }

	fabric.fill(
		panelStyle.fill,
		this.silhoutte,
		'sketch',
		Euclid.View.proper
	);

	var buttonsStyle = theme.dash.discPanel.buttons;

	fabric.paint(
		buttonsStyle,
		this.buttons.normal.ellipse,
		'sketch',
		Euclid.View.proper
	);


	fabric.paint(
		theme.dash.discPanel.buttons.normal.icon,
		this.buttons.normal,
		'sketchIcon',
		Euclid.View.proper
	);


	fabric.edge(
		panelStyle.edge,
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
DiscPanel.prototype.draw = function( fabric )
{
	fabric.drawImage(
		this._weave( ),
		0,
		Jools.half( this.screensize.y - this.height)
	);
};


/*
| Returns true if point is on the disc panel.
*/
DiscPanel.prototype.pointingHover = function( p, shift, ctrl )
{
	return 'default';
};


/*
| Returns true if point is on this panel.
*/
DiscPanel.prototype.pointingStart = function( p, shift, ctrl )
{
	return null;
};


/*
| User is inputing text.
*/
DiscPanel.prototype.input = function( text )
{
	// TODO
	return;
};


/*
| Cycles the focus
*/
DiscPanel.prototype.cycleFocus = function( dir )
{
	throw new Error( 'TODO' );
};


/*
| User is pressing a special key.
*/
DiscPanel.prototype.specialKey = function( key, shift, ctrl )
{
	// TODO
};


/*
| Clears caches.
*/
DiscPanel.prototype.poke = function( )
{
	this.$fabric = null;
	shell.redraw = true;
};


} )( );
