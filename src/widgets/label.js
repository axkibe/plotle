/*
| A label.
*/


/*
| Export
*/
var
	widgets;

widgets = widgets || { };


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
			'widgets.label',
		attributes :
			{
				// FIXME deduce from mark
				focusAccent :
					{
						comment :
							'true if the widget got focus',
						type :
							'Boolean',
						defaultValue :
							null,
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
							'jion.path',
						defaultValue :
							null,
						assign :
							null
					},
				font :
					{
						comment :
							'font of the text',
						type :
							'euclid.font',
						defaultValue :
							null
					},
				mark :
					{
						comment :
							'the users mark',
						type :
							'Object', // FUTURE 'marks',
						defaultValue :
							null,
						assign :
							null
					},
				newline :
					{
						comment :
							'vertical distance of newline',
						type :
							'Number',
						defaultValue :
							null
					},
				path :
					{
						comment :
							'the path of the widget',
						type :
							'jion.path',
						defaultValue :
							null
					},
				superFrame :
					{
						comment :
							'the frame the widget resides in',
						type :
							'euclid.rect',
						defaultValue :
							null
					},
				text :
					{
						comment :
							'the label text',
						type :
							'String'
					},
				visible :
					{
						comment :
							'if false the button is hidden',
						type :
							'Boolean',
						defaultValue :
							true
					}
			},
		init :
			[ ]
	};
}


var
	label;

label = widgets.label;


/*
| Initializes the widget.
*/
label.prototype._init =
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
label.prototype.draw =
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
label.prototype.pointingHover =
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
label.prototype.click =
	function(
		// p,
		// shift,
		// ctrl
	)
{
	return null;
};


} ) ( );
