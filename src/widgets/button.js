/*
| A button.
*/


var
	Accent,
	euclid_display,
	euclid_view,
	icons_moveto,
	icons_normal,
	icons_remove,
	jools,
	result,
	root,
	widgets_button,
	widgets_style;


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
			'widgets_button',
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
							'Boolean',
						defaultValue :
							false
					},
				font :
					{
						comment :
							'font of the text',
						type :
							'euclid_font',
						defaultValue :
							null
					},
				hover :
					{
						comment :
							'component hovered upon',
						type :
							'jion_path',
						defaultValue :
							null,
						concerns :
							{
								type :
									'widgets_widget',
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
							'String',
						defaultValue :
							// TODO undefiend
							null
					},
				iconStyle :
					{
						comment :
							'icon style to display',
						type :
							'String',
						defaultValue :
							null
					},
				mark :
					{
						comment :
							'the users mark',
						type :
							'Object', // FUTURE 'marks.*'
						defaultValue :
							null,
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
							null
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
							null
					},
				style :
					{
						// FIXME put in a real object instead
						comment :
							'name of the style used',
						type :
							'String'
					},
				text :
					{
						comment :
							'the text written in the button',
						type :
							'String',
						defaultValue :
							null
					},
				textDesignPos :
					{
						comment :
							'designed position of the text',
						type :
							'design_anchorPoint',
						defaultValue :
							null
					},
				textNewline :
					{
						comment :
							'vertical distance of newline',
						type :
							'Number',
						defaultValue :
							null
					},
				textRotation :
					{
						comment :
							'rotation of the text',
						type :
							'Number',
						defaultValue :
							null
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


/*
| Initializes the widget.
*/
widgets_button.prototype._init =
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
			case 'moveto' : this._icon = icons_moveto.create( ); break;

			case 'normal' : this._icon = icons_normal.create( ); break;

			case 'remove' : this._icon = icons_remove.create( ); break;

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
widgets_button.prototype.focusable = true;


/*
| The button's display.
*/
jools.lazyValue(
	widgets_button.prototype,
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
			Accent.state(
				this.hover
					&&
					this.hover.equals( this.path ),
				this.focusAccent
			);

		f =
			euclid_display.create(
				'width', this.frame.width,
				'height', this.frame.height
			);

		style = widgets_style.get( this.style, accent );

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
				widgets_style.get( this.iconStyle, Accent.NORMA ),
				euclid_view.proper
			);
		}

		return f;
	}
);


/*
| Mouse hover.
*/
widgets_button.prototype.pointingHover =
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
		result.hover.create(
			'path', this.path,
			'cursor', 'default'
		)
	);
};


/*
| User clicked.
*/
widgets_button.prototype.click =
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

	/*
	FIXME repeating buttons
	if(
		this.repeating &&
		!this._$retimer
	)
	{
		root.setAction(
			'ReButton',
			'itemPath',
				this.path
		);

		var repeatFunc;

		repeatFunc =
			function( )
			{
				root.pushButton( this.path );

				self._$retimer =
					system.setTimer(
						theme.zoom.repeatTimer,
						repeatFunc
					);
			};

		this._$retimer =
			system.setTimer(
				theme.zoom.firstTimer,
				repeatFunc
			);
	}
	*/

	root.pushButton( this.path );

	return this.repeating ? 'drag' : false;
};


/*
| Special keys for buttons having focus
*/
widgets_button.prototype.specialKey =
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
widgets_button.prototype.input =
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
widgets_button.prototype.draw =
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
widgets_button.prototype.dragStop =
	function( )
{
	/*
	system.cancelTimer(
		this._$retimer
	);

	this._$retimer =
		null;
	*/

	root.setAction( null );
};


} )( );
