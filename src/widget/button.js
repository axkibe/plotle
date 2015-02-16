/*
| A button.
*/


var
	euclid_display,
	euclid_view,
	icon_moveto,
	icon_normal,
	icon_remove,
	jools,
	result_hover,
	root,
	shell_accent,
	widget_button,
	widget_style;


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
			'widget_button',
		attributes :
			{
				designFrame :
					{
						comment :
							'designed frame (using anchors',
						type :
							'design_anchorRect'
					},
				// FIXME deduce from mark
				focusAccent :
					{
						comment :
							'true if the widget got focus',
						type :
							'boolean',
						defaultValue :
							'false'
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
				hover :
					{
						comment :
							'component hovered upon',
						type :
							'jion_path',
						defaultValue :
							'null',
						concerns :
							{
								type :
									'widget_widget',
								func :
									'concernsHover',
								args :
									[ 'hover', 'path' ]
							}
					},
				icon :
					{
						comment :
							'icon to display',
						type :
							'string',
						defaultValue :
							'undefined'
					},
				iconStyle :
					{
						comment :
							'icon style to display',
						type :
							'string',
						defaultValue :
							'null'
					},
				mark :
					{
						comment :
							'the users mark',
						type :
							'->mark',
						defaultValue :
							'null',
						assign :
							null
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
				shape :
					{
						comment :
							'shape of the button',
						type :
							// FUTURE allow other types
							'design_anchorEllipse'
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
				style :
					{
						// FIXME put in a real object instead
						comment :
							'name of the style used',
						type :
							'string'
					},
				text :
					{
						comment :
							'the text written in the button',
						type :
							'string',
						defaultValue :
							'null'
					},
				textDesignPos :
					{
						comment :
							'designed position of the text',
						type :
							'design_anchorPoint',
						defaultValue :
							'null'
					},
				textNewline :
					{
						comment :
							'vertical distance of newline',
						type :
							'number',
						defaultValue :
							'null'
					},
				textRotation :
					{
						comment :
							'rotation of the text',
						type :
							'number',
						defaultValue :
							'null'
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
widget_button.prototype._init =
	function( )
{
	if( this.superFrame )
	{
		this.frame = this.designFrame.compute( this.superFrame );

		this._shape = this.shape.compute( this.frame.zeropnw );
	}
	else
	{
		this.frame = null;

		this._shape = null;
	}

	if( this.icon )
	{
		switch( this.icon )
		{
			case 'moveto' : this._icon = icon_moveto.create( ); break;

			case 'normal' : this._icon = icon_normal.create( ); break;

			case 'remove' : this._icon = icon_remove.create( ); break;

			default : throw new Error( );
		}
	}

	// if true repeats the push action if held down
	// FUTURE
	this.repeating = false;
};


/*
| Buttons are focusable.
*/
widget_button.prototype.focusable = true;


/*
| The button's display.
*/
jools.lazyValue(
	widget_button.prototype,
	'_display',
	function( )
	{
		var
			accent,
			f,
			font,
			newline,
			style,
			textPos;

		accent =
			shell_accent.state(
				this.hover
				&& this.hover.equals( this.path ),
				this.focusAccent
			);

		f =
			euclid_display.create(
				'width', this.frame.width,
				'height', this.frame.height
			);

		style = widget_style.get( this.style, accent );

		f.paint( style, this._shape, euclid_view.proper );

		if( this.text )
		{
			newline = this.textNewline;

			font = this.font;

			// FIXME put into _init
			textPos =
				this.textDesignPos.compute(
					this.frame.zeropnw
				);

			if( newline === null )
			{
				f.paintText(
					'text', this.text,
					'p', textPos,
					'font', font,
					'rotate', this.textRotation
				);
			}
			else
				{
				var
					x =
						textPos.x,
					y =
						textPos.y,
					text =
						this.text.split( '\n' ),
					tZ =
						text.length;

				y -=
					Math.round( ( tZ - 1 ) / 2 * newline );

				for(
					var a = 0;
					a < tZ;
					a++, y += newline
				)
				{
					f.paintText(
						'text', text[ a ],
						'xy', x, y,
						'font', font
					);
				}
			}
		}

		if( this._icon )
		{
			this._icon.draw(
				f,
				widget_style.get( this.iconStyle, shell_accent.NORMA ),
				euclid_view.proper
			);
		}

		return f;
	}
);


/*
| Mouse hover.
*/
widget_button.prototype.pointingHover =
	function(
		p
	)
{
	var
		pp;

	if(
		!this.visible
		||
		!this.frame.within( euclid_view.proper, p )
	)
	{
		return null;
	}

	pp = p.sub( this.frame.pnw );

	if(
		!this._display.withinSketch(
			this._shape,
			euclid_view.proper,
			pp
		)
	)
	{
		return null;
	}

	return(
		result_hover.create(
			'path', this.path,
			'cursor', 'default'
		)
	);
};


/*
| User clicked.
*/
widget_button.prototype.click =
	function(
		p
		// shift,
		// ctrl
	)
{
	var
		pp;

	if(
		!this.visible
		||
		!this.frame.within( euclid_view.proper, p )
	)
	{
		return null;
	}

	pp = p.sub( this.frame.pnw );

	if(!
		this._display.withinSketch(
			this._shape,
			euclid_view.proper,
			pp
		)
	)
	{
		return null;
	}

	root.pushButton( this.path );

	return this.repeating ? 'drag' : false;
};


/*
| Special keys for buttons having focus
*/
widget_button.prototype.specialKey =
	function(
		key,
		owner
		// shift
		// ctrl
	)
{
	switch( key )
	{
		case 'down' :

			owner.cycleFocus( 1 );

			return;

		case 'up' :

			owner.cycleFocus( -1 );

			return;

		case 'enter' :

			root.pushButton( this.path );

			return;
	}
};


/*
| Any normal key for a button having focus triggers a push.
*/
widget_button.prototype.input =
	function(
		// text
	)
{
	root.pushButton( this.path );

	return true;
};


/*
| Draws the button.
*/
widget_button.prototype.draw =
	function(
		display
	)
{
	if( !this.visible )
	{
		return;
	}

	display.drawImage(
		'image', this._display,
		'pnw', this.frame.pnw
	);
};


/*
| Stops a ReButton action.
|
| FIXME refix
*/
widget_button.prototype.dragStop =
	function( )
{
	root.create( 'action', null );
};


} )( );
