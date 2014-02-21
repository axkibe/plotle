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


Widgets =
	Widgets || { };


/*
| Imports
*/
var
	Accent,
	Euclid,
	HoverReply,
	Jools,
	shell;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The joobj definition.
*/
if( JOOBJ )
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
						defaultVal :
							'false'
					},
				font :
					{
						comment :
							'font of the text',
						type :
							'Font',
						allowsNull :
							true,
						defaultVal :
							'null'
					},
				// FIXME deduce from hoverPath
				hoverAccent :
					{
						comment :
							'true if the widget is hovered on',
						type :
							'Boolean',
						defaultVal :
							'false'
					},
				icon :
					{
						comment :
							'icon to display',
						type :
							'String',
						allowsNull :
							true,
						defaultVal :
							'null'
					},
				iconStyle :
					{
						comment :
							'icon style to display',
						type :
							'String',
						allowsNull :
							true,
						defaultVal :
							'null'
					},
				// FUTURE find a more elegent solution
				icons :
					{
						comment :
							'class used to sketch icons if applicable',
						type :
							'Icons',
						allowsNull :
							true,
						defaultVal :
							'null'
					},
				mark :
					{
						comment :
							'the users mark',
						type :
							'Mark',
						// FIXME do not allow null
						allowsNull :
							true,
						defaultVal :
							'null',
						assign :
							null
					},
				path :
					{
						comment :
							'the path of the widget',
						type :
							'Path',
						allowsNull :
							true,
						defaultVal :
							'null'
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
							'Rect',
						allowsNull :
							true,
						defaultVal :
							'null'
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
						allowsNull :
							true,
						defaultVal :
							'null'
					},
				textDesignPos :
					{
						comment :
							'designed position of the text',
						type :
							'AnchorPoint',
						allowsNull :
							true,
						defaultVal :
							'null'
					},
				textNewline :
					{
						comment :
							'vertical distance of newline',
						type :
							'Number',
						allowsNull :
							true,
						defaultVal :
							'null'
					},
				textRotation :
					{
						comment :
							'rotation of the text',
						type :
							'Number',
						allowsNull :
							true,
						defaultVal :
							'null'
					},
				traitSet :
					{
						comment :
							'traits being set',
						type :
							'TraitSet',
						allowsNull :
							true,
						defaultVal :
							'null',
						assign :
							null
					},
				visible :
					{
						comment :
							'if false the button is hidden',
						type :
							'Boolean',
						defaultVal :
							'true'
					}
			},
		subclass :
			'Widgets.Widget',
		init :
			[
				'inherit',
				'traitSet'
			]
	};
}


var
	Button =
		Widgets.Button;


/*
| Initializes the widget.
*/
Button.prototype._init =
	function(
		inherit,
		traitSet
	)
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

	if( traitSet )
	{
		for(
			var a = 0, aZ = traitSet.length;
			a < aZ;
			a++
		)
		{
			var
				t =
					traitSet.get( a );

			if(
				t.path.equals( this.path )
			)
			{
				switch( t.key )
				{
					case 'text' :

						this.text =
							t.val;

						break;

					case 'visible' :

						this.visible =
							t.val;

						break;

					default :

						throw new Error(
							CHECK
							&&
							( 'unknown trait: ' + t.key )
						);
				}
			}
		}
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
		Euclid.View.proper
	);
};


/*
| The button's fabric.
*/
Jools.lazyValue(
	Button.prototype,
	'_fabric',
	function( )
	{
		var
			accent =
				Accent.state(
					this.hoverAccent,
					this.focusAccent
				),

			f =
				Euclid.Fabric.create(
					'width',
						this.frame.width,
					'height',
						this.frame.height
				),

			style =
				Widgets.getStyle(
					this.style,
					accent
				);

		f.paint(
			style,
			this,
			'sketch',
			Euclid.View.proper
		);

		if( this.text )
		{
			var
				newline =
					this.textNewline,

				font =
					this.font,

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
				this.icons,
				this.icon,
				Euclid.View.proper
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
			Euclid.View.proper,
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
			Euclid.View.proper,
			pp
		)
	)
	{
		return null;
	}

	return (
		HoverReply.create(
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
			Euclid.View.proper,
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
			Euclid.View.proper,
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


/*
| FIXME remove
*/
Button.prototype._$grown =
	true;

} )( );
