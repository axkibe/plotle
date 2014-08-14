/*
| A button.
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
| Imports
*/
var
	Accent,
	Discs,
	euclid,
	jools,
	reply,
	shell;


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
			'Button',
		unit :
			'Widgets',
		attributes :
			{
				designFrame :
					{
						comment :
							'designed frame (using anchors',
						type :
							'AnchorRect'
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
							'path',
						defaultValue :
							null,
						concerns :
							{
								unit :
									'Widgets',
								type :
									'Widget',
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
							'Mark',
						// FIXME do not allow null
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
							'path',
						defaultValue :
							null
					},
				shape :
					{
						comment :
							'shape of the button',
						type :
							// FUTURE allow other types
							'AnchorEllipse'
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
							'AnchorPoint',
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
		subclass :
			'Widgets.Widget',
		init :
			[ ]
	};
}


var
	Button =
		Widgets.Button;


/*
| Initializes the widget.
*/
Button.prototype._init =
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
		this.frame =
			null;

		this._shape =
			null;
	}

	// if true repeats the push action if held down
	// FIXME
	this.repeating =
		false;
};


/*
| Buttons are focusable.
*/
Button.prototype.focusable =
	true;


/*
| Sketches the button.
*/
Button.prototype.sketch =
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
		euclid.View.proper
	);
};


/*
| The button's fabric.
*/
jools.lazyValue(
	Button.prototype,
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
			Widgets.getStyle(
				this.style,
				accent
			);

		f.paint(
			style,
			this,
			'sketch',
			euclid.View.proper
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
				Widgets.getStyle(
					this.iconStyle,
					Accent.NORMA
				);

			f.paint(
				style,
				Discs.icons,
				this.icon,
				euclid.View.proper
			);
		}

		return f;
	}
);


/*
| Mouse hover.
*/
Button.prototype.pointingHover =
	function(
		p
	)
{
	if(
		!this.visible
		||
		!this.frame.within(
			euclid.View.proper,
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
			'sketch',
			euclid.View.proper,
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
Button.prototype.click =
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
			euclid.View.proper,
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
			'sketch',
			euclid.View.proper,
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
		shell.setAction(
			'ReButton',
			'itemPath',
				this.path
		);

		var repeatFunc;

		repeatFunc =
			function( )
			{
				shell.pushButton( this.path );

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

	shell.pushButton( this.path );

	return this.repeating ? 'drag' : false;
};


/*
| Special keys for buttons having focus
*/
Button.prototype.specialKey =
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

			shell.pushButton( this.path );

			return;
	}
};


/*
| Any normal key for a button having focus triggers a push.
*/
Button.prototype.input =
	function(
		// text
	)
{
	shell.pushButton( this.path );

	return true;
};


/*
| Draws the button.
*/
Button.prototype.draw =
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
Button.prototype.dragStop =
	function( )
{
	/*
	system.cancelTimer(
		this._$retimer
	);

	this._$retimer =
		null;
	*/

	shell.setAction( null );
};


} )( );
