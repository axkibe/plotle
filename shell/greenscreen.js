/*
| The green screen when something went amiss.
|
| Authors:
|	Axel Kittenberger
*/


/*
| Export
*/
var
	GreenScreen;

/*
| Imports
*/

var
	Euclid,
	fontPool,
	HoverReply,
	Path,
	Jools;


/*
| Capsule
*/
( function() {

'use strict';

if( CHECK && typeof( window ) === 'undefined' )
{
	throw new Error(
		'this code needs a browser!'
	);
}


/*
| Constructor.
*/
GreenScreen =
	function(
		message
	)
{
	this.message =
		message;

	Jools.immute( this );
};


/*
| The disc is not shown with a greenscreen
*/
GreenScreen.prototype.showDisc =
	false;


/*
| Blinks the caret (if shown)
*/
GreenScreen.prototype.blink =
	function( )
{
	return;
};


/*
| Sketches the greenscreen frowny.
*/
GreenScreen.prototype.sketchFrowny =
	function(
		fabric,
		border,
		twist,
		view,
		pos
	)
{
	fabric.moveTo(
		pos.x - 100,
		pos.y
	);

	fabric.lineTo(
		pos.x,
		pos.y - 30
	);

	fabric.lineTo(
		pos.x + 100,
		pos.y
	);

	fabric.moveTo(
		pos.x - 100,
		pos.y - 130
	);

	fabric.lineTo(
		pos.x - 50,
		pos.y - 140
	);

	fabric.moveTo(
		pos.x + 100,
		pos.y - 130
	);

	fabric.lineTo(
		pos.x + 50,
		pos.y - 140
	);
};


/*
| Draws the green screen
*/
GreenScreen.prototype.draw =
	function(
		fabric
	)
{
	var
		ce =
			fabric.getCenter( );

	fabric.fillRect(
		'rgb(170, 255, 170)',
		0,
		0,
		fabric.width,
		fabric.height
	);

	fabric.edge(
		{
			edge :
			[
				{
					border : 0,
					width  : 1,
					color  : 'black'
				}
			]
		},
		this,
		'sketchFrowny',
		Euclid.View.proper,
		ce.add(
			0,
			-80
		)
	);

	fabric.paintText(
		'text',
			this.message,
		'p',
			ce,
		'font',
			fontPool.get(
				26,
				'cm'
			)
	);

	fabric.paintText(
		'text',
			'Please refresh the page to reconnect.',
		'xy',
			ce.x,
			ce.y + 50,
		'font',
			fontPool.get(
				20,
				'cm'
			)
	);
};


/*
| User clicked
*/
GreenScreen.prototype.click =
	function( )
{
	location.reload( );
};


/*
| User is hovering his/her point ( mouse move )
*/
GreenScreen.prototype.pointingHover =
	function( )
{
	return (
		HoverReply.create(
			'path',
				Path.empty,
			'cursor',
				'default'
		)
	);
};


/*
| Pointing device starts pointing
| ( mouse down, touch start )
|
| Returns the pointing state code,
| wheter this is a click/drag or yet undecided.
*/
GreenScreen.prototype.pointingStart =
	function( )
{
	return false;
};


/*
| Starts an operation with the pointing device active.
|
| Mouse down or finger on screen.
*/
GreenScreen.prototype.dragStart =
	function( )
{
	return 'default';
};


/*
| Moving during an operation with the mouse button held down.
*/
GreenScreen.prototype.dragMove =
	function( )
{
	return;
};


/*
| Stops an operation with the mouse button held down.
*/
GreenScreen.prototype.dragStop =
	function( )
{
	return;
};


/*
| Mouse wheel is being turned.
*/
GreenScreen.prototype.mousewheel =
	function( )
{
	return;
};


/*
| User is pressing a special key.
*/
GreenScreen.prototype.specialKey =
	function( )
{
	return;
};


/*
| User entered normal text (one character or more).
*/
GreenScreen.prototype.input =
	function( )
{
	return;
};


} )( );
