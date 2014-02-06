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
				// FIXME deduce from mark
				focusAccent :
					{
						comment :
							'true if the widget got focus',

						type :
							'Boolean'
					},

				// FIXME deduce from hoverPath
				hoverAccent :
					{
						comment :
							'true if the widget is hovered on',

						type :
							'Boolean'
					},

				// FUTURE find a more elegent solution
				icons :
					{
						comment :
							'class used to sketch icons if applicable',

						type :
							'Icons',

						allowNull :
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
						allowNull :
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
							'Path'
					},

				superFrame :
					{
						comment :
							'the frame the widget resides in',

						type :
							'Rect'
					},


				text :
					{
						comment :
							'the text written in the button',

						type :
							'String',

						allowNull :
							true,

						defaultVal :
							'null'
					},

				tree :
					{
						comment :
							'the shellverse tree',

						type :
							'Tree'
					},

				traitSet :
					{
						comment :
							'traits being set',

						type :
							'TraitSet',

						allowNull :
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

						allowNull :
							true,

						// default taken from tree
						defaultVal :
							'null'
					}
			},

		subclass :
			'Widgets.Widget',

		init :
			[
				'inherit',
				'traitSet'
			]

//		FIXME
//		refuse :
//			[
//				'defaultVal === null && text === null'
//			]
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
	this.frame =
		this.tree.twig.frame.compute(
			this.superFrame
		);

	// FUTURE move the whole switch to rect
	switch( this.tree.twig.shape.twig.type )
	{
		case 'Ellipse' :

			this._shape =
				this.frame.zeropnw.computeEllipse(
					this.tree.twig.shape.twig
				);

			break;

		default :

			throw new Error(
				CHECK
				&&
				'unknown model'
			);
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

	if( this.visible === null )
	{
		this.visible =
			Jools.is( this.tree.twig.visible ) ?
				this.tree.twig.visible
				:
				true;
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

			tree =
				this.tree,

			style =
				Widgets.getStyle(
					tree.twig.style,
					accent
				);

		f.paint(
			style,
			this,
			'sketch',
			Euclid.View.proper
		);

		var
			caption =
				tree.twig.caption;

		if( caption )
		{
			var
				text =
					this.text ||
					caption.twig.text,

				newline =
					caption.twig.newline,

				font =
					caption.twig.font,

				pos =
					caption.twig.pos.compute(
						this.frame.zeropnw
					);

			if( !Jools.is( newline ) )
			{
				if( !Jools.is( caption.twig.rotate ) )
					{
					f.paintText(
						'text',
							caption.twig.text,
						'p',
							pos,
						'font',
							font
					);
				}
				else
				{
					f.paintText(
						'text',
							text,
						'p',
							pos,
						'font',
							font,
						'rotate',
							caption.twig.rotate
					);
				}
			}
			else
				{
				var
					x =
						pos.x,

					y =
						pos.y;

				text =
					text.split( '\n' );

				var
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

		var
			icon =
				tree.twig.icon;

		if( icon )
		{
			style =
				Widgets.getStyle(
					tree.twig.iconStyle,
					Accent.NORMA
				);

			f.paint(
				style,
				this.icons,
				icon,
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


} )( );
