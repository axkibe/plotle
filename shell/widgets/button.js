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
	shell,
	system;


/*
| Capsule
*/
( function( ) {
'use strict';

/**/if( CHECK && typeof( window ) === 'undefined' )
/**/{
/**/	throw new Error(
/**/		'this code needs a browser!'
/**/	);
/**/}


var
	_tag =
		'BUTTON-WIDGET-52212713';


/*
| Constructor.
*/
var Button =
Widgets.Button =
	function(
		tag,
		inherit,
		tree,
		path,
		frame,
		focusAccent,
		hoverAccent,
		icons,
		text,
		visible
		// mark
	)
{
	if( CHECK )
	{
		if( tag !== _tag )
		{
			throw new Error(
				'tag mismatch'
			);
		}

		if( frame === null )
		{
			throw new Error(
				'frame missing'
			);
		}

		if( path === null )
		{
			throw new Error(
				'path missing'
			);
		}

		if( tree === null )
		{
			throw new Error(
				'tree missing'
			);
		}

		if( typeof( focusAccent ) !== 'boolean' )
		{
			throw new Error(
				'invalid focusAccent'
			);
		}

		if( typeof( hoverAccent ) !== 'boolean' )
		{
			throw new Error(
				'invalid hoverAccent'
			);
		}
	}

	// class used to sketch icons if applicable
	this.icons =
		icons;

	this.focusAccent =
		focusAccent;

	this.hoverAccent =
		hoverAccent;

	this.path =
		path;

	this.text =
		text;

	this.tree =
		tree;

	this.visible =
		visible;

	this.frame =
		frame;

	this._shape =
		Euclid.Shape.create(
			tree.twig.shape.twig,
			this.frame.zeropnw
		);

	// if true repeats the push action if held down
	this.repeating =
		false;

	this._$retimer =
		null;

	this._$fabric =
		null;
};


/*
| Creates a button.
*/
Button.create =
	function(
		// free strings
	)
{
	var
		focusAccent =
			null,

		frame =
			null,

		hoverAccent =
			null,

		icons =
			null,

		inherit =
			null,

		mark =
			null,

		path =
			null,

		superFrame =
			null,

		text =
			null,

		traitSet =
			null,

		tree =
			null,

		visible =
			null;

	for(
		var a = 0, aZ = arguments.length;
		a < aZ;
		a += 2
	)
	{
		switch( arguments[ a ] )
		{
			case 'focusAccent' :

				focusAccent =
					arguments[ a + 1 ];

				break;

			case 'hoverAccent' :

				hoverAccent =
					arguments[ a + 1 ];

				break;

			case 'icons' :

				icons =
					arguments[ a + 1 ];

				break;

			case 'inherit' :

				inherit =
					arguments[ a + 1 ];

				break;

			case 'mark' :

				mark =
					arguments[ a + 1 ];

				break;

			case 'path' :

				path =
					arguments[ a + 1 ];

				break;

			case 'superFrame' :

				superFrame =
					arguments[ a + 1 ];

				break;

			case 'text' :

				text =
					arguments[ a + 1 ];

				break;

			case 'traitSet' :

				traitSet =
					arguments[ a + 1 ];

				break;

			case 'tree' :

				tree =
					arguments[ a + 1 ];

				break;

			case 'visible' :

				visible =
					arguments[ a + 1 ];

				break;

			default :

				throw new Error(
					'invalid argument: ' + arguments[ a ]
				);
		}
	}

	// TODO use concernsMark

	if( traitSet )
	{
/**/	if( CHECK )
/**/	{
/**/		if( !path )
/**/		{
/**/			throw new Error(
/**/				'traitSet needs path'
/**/			);
/**/		}
/**/	}

		for(
			a = 0, aZ = traitSet.length;
			a < aZ;
			a++
		)
		{
			var
				t =
					traitSet.get( a );

			if(
				t.path.equals( path )
			)
			{
				switch( t.key )
				{
					case 'text' :

						text =
							t.val;

						break;

					case 'visible' :

						visible =
							t.val;

						break;

					default :

						throw new Error(
							'unknown trait: ' + t.key
						);
				}
			}
		}
	}

	if( inherit )
	{
		if( focusAccent === null )
		{
			focusAccent =
				inherit.focusAccent;
		}

		if( hoverAccent === null )
		{
			hoverAccent =
				inherit.hoverAccent;
		}

		if( frame === null && superFrame === null )
		{
			frame =
				inherit.frame;
		}

		if( icons === null )
		{
			icons =
				inherit.icons;
		}

		if( path === null )
		{
			path =
				inherit.path;
		}

		if( text === null )
		{
			text =
				inherit.text;
		}

		if( tree === null )
		{
			tree =
				inherit.tree;
		}

		if( visible === null )
		{
			visible =
				inherit.visible;
		}
	}

	if( focusAccent === null )
	{
		focusAccent =
			false;
	}

	if( hoverAccent === null )
	{
		hoverAccent =
			false;
	}

	if( visible === null )
	{
		visible =
			Jools.is( tree.visible ) ?
				tree.visible :
				true;
	}

	if( frame === null )
	{
		if( superFrame === null )
		{
			throw new Error(
				'superFrame and frame === null'
			);
		}

		frame =
			superFrame.computeRect(
				tree.twig.frame.twig
			);
	}

	// FIXME inherit cache

	return new Button(
		_tag,
		inherit,
		tree,
		path,
		frame,
		focusAccent,
		hoverAccent,
		icons,
		text,
		visible,
		mark
	);
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
| Returns the fabric for the button.
*/
Button.prototype._weave =
	function( )
{
	var
		fabric =
			this._$fabric,

		accent =
			Accent.state(
				this.hoverAccent,
				this.focusAccent
			);

	if( fabric )
	{
		return fabric;
	}

	fabric =
	this._$fabric =
		new Euclid.Fabric( this.frame.zeropnw );

	var
		tree =
			this.tree,

		style =
			Widgets.getStyle(
				tree.twig.style,
				accent
			);

	fabric.paint(
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
				this.frame.zeropnw.computePoint(
					caption.twig.pos
				);

		if( !Jools.is( newline ) )
		{
			if( !Jools.is( caption.twig.rotate ) )
			{
				fabric.paintText(
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
				fabric.paintText(
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
				fabric.paintText(
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

		fabric.paint(
			style,
			this.icons,
			icon,
			Euclid.View.proper
		);
	}

	return fabric;
};


/*
| Mouse hover.
*/
Button.prototype.pointingHover =
	function( p )
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
		fabric =
			this._weave( ),

		pp =
			p.sub( this.frame.pnw );

	if(
		!fabric.withinSketch(
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
| User is starting to point something ( mouse down, touch start )
*/
Button.prototype.pointingStart =
	function(
		p
		// shift,
		// ctrl
	)
{
	if(
		!this.visible ||
		!this.frame.within(
			Euclid.View.proper,
			p
		)
	)
	{
		return null;
	}

	var
		fabric =
			this._weave( ),

		pp =
			p.sub( this.frame.pnw );

	if(!
		fabric.withinSketch(
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
		key
	)
{
	switch( key )
	{
		case 'down' :

			shell.cycleFormFocus(
				this.path.get( 0 ),
				1
			);

			return;

		case 'up' :

			shell.cycleFormFocus(
				this.path.get( 0 ),
				-1
			);

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
			this._weave( ),
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
	system.cancelTimer(
		this._$retimer
	);

	this._$retimer =
		null;

	shell.setAction( null );
};


} )( );
