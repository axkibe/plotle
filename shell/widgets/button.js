/*
| A button.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var Widgets;

Widgets =
	Widgets || { };


/*
| Imports
*/
var
	Accent,
	config,
	Curve,
	Euclid,
	Jools,
	Path,
	shell,
	system,
	theme;


/*
| Capsule
*/
( function( ) {
'use strict';

if( CHECK && typeof( window ) === 'undefined' )
{
	throw new Error(
		'this code needs a browser!'
	);
}


/*
| Constructor.
*/
var Button =
Widgets.Button =
	function(
		tag,
		inherit,
		tree,
		parent,
		name,
		focusAccent,
		hoverAccent,
		icons,
		text,
		visible
	)
{
	if( CHECK )
	{
		if( tag !== 'XOXO' )
		{
			throw new Error(
				'tag mismatch'
			);
		}

		if( parent === null )
		{
			throw new Error(
				'parent missing'
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

	this.name =
		name;

	// TODO inherit.
	this.path =
		new Path(
			[
				parent.name,
				name
			]
		);

	this.parent =
		parent;

	this.text =
		text;

	this.tree =
		tree;

	this.visible =
		visible;

	// TODO compute a rect
	var
		pnw =
		this.pnw =
			parent.iframe.computePoint(
				tree.twig.frame.twig.pnw
			),

		pse =
		this.pse =
			parent.iframe.computePoint(
				tree.twig.frame.twig.pse
			),

		iframe =
		this.iframe =
			new Euclid.Rect(
				'pse',
				pse.sub( pnw )
			),

		// TODO move this to Shape
		tshape =
			tree.twig.shape;

	switch( tshape.twig.type )
	{
		case 'Curve' :

			// TODO _shape
			this.shape =
				new Curve(
					tshape.twig,
					iframe
				);

			break;

		case 'Ellipse' :

			this.shape =
				new Euclid.Ellipse(
					iframe.computePoint( tshape.twig.pnw ),
					iframe.computePoint( tshape.twig.pse )
				);

			break;

		default :

			throw new Error(
				'unknown shape: ' + tshape.twig.type
			);
	}

	// if true repeats the push action if held down
	this.repeating =
		false;

	this._$retimer =
		null;

	this._$fabric =
		null;

	this.visible =
		visible;
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

		hoverAccent =
			null,

		icons =
			null,

		inherit =
			null,

		name =
			null,

		parent =
			null,

		text =
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
			case 'inherit' :

				inherit =
					arguments[ a + 1 ];

				break;

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

			case 'name' :

				name =
					arguments[ a + 1 ];

				break;

			case 'parent' :

				parent =
					arguments[ a + 1 ];

				break;

			case 'text' :

				text =
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

		if( icons === null )
		{
			icons =
				inherit.icons;
		}

		if( name === null )
		{
			name =
				inherit.name;
		}

		if( parent === null )
		{
			parent =
				inherit.parent;
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

	return new Button(
		'XOXO',
		inherit,
		tree,
		parent,
		name,
		focusAccent,
		hoverAccent,
		icons,
		text,
		visible
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
	this.shape.sketch(
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
		new Euclid.Fabric( this.iframe );

	var
		tree =
			this.tree,

		style =
			Widgets.getStyle(
				tree.twig.style,
				accent
			);

	// TODO throw in getStyle

	if( !Jools.isnon( style ) )
	{
		throw new Error(
			'Invalid style: ' + tree.twig.style
		);
	}

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
				this.iframe.computePoint(
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
		!this.visible ||
		p === null ||
		p.x < this.pnw.x || // TODO within
		p.y < this.pnw.y ||
		p.x > this.pse.x ||
		p.y > this.pse.y
	)
	{
		return null;
	}

	var fabric =
		this._weave( );

	var pp =
		p.sub( this.pnw );

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

	this.parent.setHover(
		this.name
	);

	return 'default';
};


/*
| User is starting to point something ( mouse down, touch start )
*/
Button.prototype.pointingStart =
	function(
		p,
		shift,
		ctrl
	)
{
	var self =
		this;

	if(
		!this.visible ||
		p.x < this.pnw.x ||
		p.y < this.pnw.y ||
		p.x > this.pse.x ||
		p.y > this.pse.y
	)
	{
		return null;
	}

	var
		fabric =
			this._weave( ),

		pp =
			p.sub( this.pnw );

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

	var parent =
		this.parent;

	if(
		this.repeating &&
		!this._$retimer
	)
	{
		shell.bridge.startAction(
			'ReButton',
			'board',
			'itemPath',
				this.path
		);

		var repeatFunc;

		repeatFunc =
			function( )
			{
				parent.pushButton(
					self.name,
					false,
					false
				);

				self._$retimer =
					system.setTimer(
						theme.zoom.repeatTimer,
						repeatFunc
					);

				shell.poke( );
			};

		this._$retimer =
			system.setTimer(
				theme.zoom.firstTimer,
				repeatFunc
			);
	}

	parent.pushButton(
		this.name,
		shift,
		ctrl
	);

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

			this.parent.cycleFocus( +1 );

			return;

		case 'up' :

			this.parent.cycleFocus( -1 );

			return;

		case 'enter' :

			this.parent.pushButton(
				this.name,
				false,
				false
			);

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
	this.parent.pushButton(
		this.name,
		false,
		false
	);

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
			this.pnw
	);
};


/*
| Clears all caches.
*/
Button.prototype.poke =
	function( )
{
	// TODO remove
};


/*
| Force clears all caches.
*/
Button.prototype.knock =
	function( )
{
	// TODO remove
};


/*
| Sets the buttons text.
*/
Button.prototype.getText =
	function( )
{
	throw new Error( 'TODO' );
};


/*
| Control takes focus.
| TODO remove
*/
Button.prototype.grepFocus =
	function( )
{
	if(
		!this.focusable ||
		!this.visible ||
		this.parent.getFocus( ) === this
	)
	{
		return false;
	}

	this.parent.setCaret(
		{
			path :
				this.path,

			at1 :
				0
		}
	);

	return true;
};



/*
| Sets the buttons text.
*/
Button.prototype.setText =
	function( text )
{
	throw new Error( 'TODO' );
};


/*
| Stops a ReButton action.
*/
Button.prototype.dragStop =
	function( )
{
	system.cancelTimer(
		this._$retimer
	);

	this._$retimer =
		null;

	shell.bridge.stopAction( );
};


} )( );
