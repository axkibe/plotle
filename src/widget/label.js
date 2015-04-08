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
				type : 'boolean',
				defaultValue : 'undefined',
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
				type : 'jion_path',
				defaultValue : 'undefined',
				assign : ''
			},
			font :
			{
				comment : 'font of the text',
				type : 'euclid_font',
				defaultValue : 'undefined'
			},
			mark :
			{
				comment : 'the users mark',
				type : require( '../typemaps/mark' ),
				defaultValue : 'undefined',
				assign : ''
			},
			newline :
			{
				comment : 'vertical distance of newline',
				type : 'number',
				defaultValue : 'undefined'
			},
			path :
			{
				comment : 'the path of the widget',
				type : 'jion_path',
				defaultValue : 'undefined'
			},
			superFrame :
			{
				comment : 'the frame the widget resides in',
				type : 'euclid_rect',
				defaultValue : 'undefined'
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


/*
| Initializes the widget.
*/
widget_label.prototype._init =
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
widget_label.prototype.draw =
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
widget_label.prototype.pointingHover =
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
widget_label.prototype.click =
	function(
		// p,
		// shift,
		// ctrl
	)
{
	return undefined;
};


} ) ( );
