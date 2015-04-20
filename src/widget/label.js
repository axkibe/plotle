/*
| A label.
*/


var
	widget_label;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		id : 'widget_label',
		attributes :
		{
			// FIXME deduce from mark
			focusAccent :
			{
				comment : 'true if the widget got focus',
				type : [ 'undefined', 'boolean' ],
				assign : ''
			},
			designPos :
			{
				comment : 'designed position of the text',
				type : 'design_anchorPoint'
			},
			hover :
			{
				comment : 'component hovered upon',
				type : [ 'undefined', 'jion$path' ],
				assign : ''
			},
			font :
			{
				comment : 'font of the text',
				type : [ 'undefined', 'euclid_font' ],
			},
			mark :
			{
				comment : 'the users mark',
				type :
					require( '../typemaps/mark' )
					.concat( ['undefined' ] ),
				assign : ''
			},
			newline :
			{
				comment : 'vertical distance of newline',
				type : [ 'undefined', 'number' ]
			},
			path :
			{
				comment : 'the path of the widget',
				type : [ 'undefined', 'jion$path' ]
			},
			superFrame :
			{
				comment : 'the frame the widget resides in',
				type : [ 'undefined', 'euclid_rect' ]
			},
			text :
			{
				comment : 'the label text',
				type : 'string'
			},
			visible :
			{
				comment : 'if false the button is hidden',
				type : 'boolean',
				defaultValue : 'true'
			}
		},
		init : [ ]
	};
}


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


var
	prototype;

prototype = widget_label.prototype;



/*
| Initializes the widget.
*/
prototype._init =
	function( )
{
	this.pos =
		this.superFrame
		? this.designPos.compute( this.superFrame )
		: undefined;
};


/*
| Displays the label.
|
| FIXME use _display
*/
prototype.draw =
	function(
		display
	)
{
	if( !this.visible )
	{
		return;
	}

	display.paintText(
		'text', this.text,
		'p', this.pos,
		'font', this.font
	);
};


/*
| User is hovering his/her pointer ( mouse move )
*/
prototype.pointingHover =
	function(
		// p,
		// shift,
		// ctrl
	)
{
	return undefined;
};


/*
| User clicked.
*/
prototype.click =
	function(
		// p,
		// shift,
		// ctrl
	)
{
	return undefined;
};


} ) ( );
