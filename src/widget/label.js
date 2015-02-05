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
		id :
			'widget_label',
		attributes :
			{
				// FIXME deduce from mark
				focusAccent :
					{
						comment :
							'true if the widget got focus',
						type :
							'boolean',
						defaultValue :
							'null',
						assign :
							null
					},
				designPos :
					{
						comment :
							'designed position of the text',
						type :
							'design_anchorPoint'
					},
				hover :
					{
						comment :
							'component hovered upon',
						type :
							'jion_path',
						defaultValue :
							'null',
						assign :
							null
					},
				font :
					{
						comment :
							'font of the text',
						type :
							'euclid_font',
						defaultValue :
							'null'
					},
				mark :
					{
						comment :
							'the users mark',
						type :
							'Object', // FUTURE '->mark',
						defaultValue :
							'null',
						assign :
							null
					},
				newline :
					{
						comment :
							'vertical distance of newline',
						type :
							'number',
						defaultValue :
							'null'
					},
				path :
					{
						comment :
							'the path of the widget',
						type :
							'jion_path',
						defaultValue :
							'null'
					},
				superFrame :
					{
						comment :
							'the frame the widget resides in',
						type :
							'euclid_rect',
						defaultValue :
							'null'
					},
				text :
					{
						comment :
							'the label text',
						type :
							'string'
					},
				visible :
					{
						comment :
							'if false the button is hidden',
						type :
							'boolean',
						defaultValue :
							'true'
					}
			},
		init :
			[ ]
	};
}


/*
| Initializes the widget.
*/
widget_label.prototype._init =
	function( )
{
	if( this.superFrame )
	{
		this.pos =
			this.designPos.compute(
				this.superFrame
			);
	}
	else
	{
		this.pos =
			null;
	}
};


/*
| Displays the label.
|
| FUTURE use _display
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
	return null;
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
	return null;
};


} ) ( );
