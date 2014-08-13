/*
| A label.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Widgets;

Widgets = Widgets || { };


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
		name :
			'Label',
		unit :
			'Widgets',
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
							'AnchorPoint'
					},
				hover :
					{
						comment :
							'component hovered upon',
						type :
							'path',
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
							'Font',
						defaultValue :
							null
					},
				mark :
					{
						comment :
							'the users mark',
						type :
							'Mark',
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
							'path',
						defaultValue :
							null
					},
				superFrame :
					{
						comment :
							'the frame the widget resides in',
						type :
							'Rect',
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
		subclass :
			'Widgets.Widget',
		init :
			[ ]
	};
}


var
	Label =
		Widgets.Label;


/*
| Initializes the widget.
*/
Label.prototype._init =
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
| Draws the label on the fabric.
|
| FIXME use _fabric
*/
Label.prototype.draw =
	function(
		fabric
	)
{
	if( !this.visible )
	{
		return;
	}

	fabric.paintText(
		'text',
			this.text,
		'p',
			this.pos,
		'font',
			this.font
	);
};


/*
| User is hovering his/her pointer ( mouse move )
*/
Label.prototype.pointingHover =
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
Label.prototype.click =
	function(
		// p,
		// shift,
		// ctrl
	)
{
	return null;
};


} ) ( );
