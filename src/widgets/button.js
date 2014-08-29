/*
| A button.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	widgets;

widgets = widgets || { };


/*
| Imports
*/
var
	Accent,
	euclid,
	icons,
	jools,
	reply,
	root;


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
			'button',
		unit :
			'widgets',
		attributes :
			{
				designFrame :
					{
						comment :
							'designed frame (using anchors',
						type :
							'design.anchorRect'
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
							'euclid.font',
						defaultValue :
							null
					},
				hover :
					{
						comment :
							'component hovered upon',
						type :
							'jion.path',
						defaultValue :
							null,
						concerns :
							{
								type :
									'widgets.widget',
								func :
									'concernsHover',
								args :
									[
										'hover',
										'path'
									]
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
							'jion.path',
						defaultValue :
							null
					},
				shape :
					{
						comment :
							'shape of the button',
						type :
							// FUTURE allow other types
							'design.anchorEllipse'
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
							'design.anchorPoint',
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


var
	button;

button = widgets.button;


/*
| Initializes the widget.
*/
button.prototype._init =
	function( )
{
	if( this.superFrame )
	{
		this.frame =
			this.designFrame.compute(
				this.superFrame
			);

		this._shape =
			this.shape.compute(
				this.frame.zeropnw
			);
	}
	else
	{
		this.frame = null;

		this._shape = null;
	}

	// if true repeats the push action if held down
	// FIXME
	this.repeating = false;
};


/*
| Buttons are focusable.
*/
button.prototype.focusable = true;


/*
| Sketches the button.
*/
button.prototype.sketch =
	function(
		fabric,
		border,
		twist
	)
{
	this._shape.sketch(
		fabric,
		border,
		twist,
		euclid.view.proper
	);
};


/*
| The button's fabric.
*/
jools.lazyValue(
	button.prototype,
	'_fabric',
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
			euclid.fabric.create(
				'width',
					this.frame.width,
				'height',
					this.frame.height
			);

		style =
			widgets.getStyle(
				this.style,
				accent
			);

		f.paint(
			style,
			this,
			euclid.view.proper
		);

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
					'text',
						this.text,
					'p',
						textPos,
					'font',
						font,
					'rotate',
						this.textRotation
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
						'text',
							text[ a ],
						'xy',
							x,
							y,
						'font',
							font
					);
				}
			}
		}

		if( this.icon )
		{
			style =
				widgets.getStyle(
					this.iconStyle,
					Accent.NORMA
				);

			f.paint(
				style,
				icons[ this.icon ],
				euclid.view.proper
			);
		}

		return f;
	}
);


/*
| Mouse hover.
*/
button.prototype.pointingHover =
	function(
		p
	)
{
	if(
		!this.visible
		||
		!this.frame.within(
			euclid.view.proper,
			p
		)
	)
	{
		return null;
	}

	var
		pp =
			p.sub( this.frame.pnw );

	if(
		!this._fabric.withinSketch(
			this,
			euclid.view.proper,
			pp
		)
	)
	{
		return null;
	}

	return (
		reply.hover.create(
			'path',
				this.path,
			'cursor',
				'default'
		)
	);
};


/*
| User clicked.
*/
button.prototype.click =
	function(
		p
		// shift,
		// ctrl
	)
{
	if(
		!this.visible
		||
		!this.frame.within(
			euclid.view.proper,
			p
		)
	)
	{
		return null;
	}

	var
		pp =
			p.sub( this.frame.pnw );

	if(!
		this._fabric.withinSketch(
			this,
			euclid.view.proper,
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
button.prototype.specialKey =
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
button.prototype.input =
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
button.prototype.draw =
	function(
		fabric
	)
{
	if( !this.visible )
	{
		return;
	}

	fabric.drawImage(
		'image',
			this._fabric,
		'pnw',
			this.frame.pnw
	);
};


/*
| Stops a ReButton action.
|
| FIXME refix
*/
button.prototype.dragStop =
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
