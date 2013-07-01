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

if( typeof( window ) === 'undefined' )
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
		// ... free strings ...
	)
{
	// class used to sketch icons if applicable
	this.icons =
		null;

	Widgets.Widget.call(
		this,
		'Button',
		arguments,
		{
			'icons' :
			{
				type :
					'param'
			}
		}
	);

	var
		twig =
			this.twig,

		parent =
			this.parent,

		inherit =
			this.inherit,

		pnw =
		this.pnw =
			parent.iframe.computePoint( twig.frame.pnw ),

		pse =
		this.pse =
			parent.iframe.computePoint( twig.frame.pse ),

		iframe =
		this.iframe =
			new Euclid.Rect(
				'pse',
				pse.sub( pnw )
			),

		// TODO move this to Shape
		tshape =
			twig.shape;

	switch( tshape.type )
	{
		case 'Curve' :

			this.shape =
				new Curve(
					tshape,
					iframe
				);

			break;

		case 'Ellipse' :

			this.shape =
				new Euclid.Ellipse(
					iframe.computePoint( tshape.pnw ),
					iframe.computePoint( tshape.pse )
				);

			break;

		default :

			throw new Error(
				'unknown shape: ' + tshape.type
			);
	}

	if( twig.caption )
	{
		var caption =
		this._$caption =
			{
				pos :
					iframe.computePoint( twig.caption.pos ),

				$text :
					inherit ?
						inherit._$caption.$text :
						twig.caption.text
			};

		if( twig.caption.rotate )
		{
			caption.rotate =
				twig.caption.rotate;
		}

		if( twig.caption.newline )
		{
			caption.newline =
				twig.caption.newline;

			if( Jools.isString( caption.$text ) )
			{
				caption.$text =
					caption.$text.split( '\n' );
			}
		}

	}
	else if( twig.icon )
	{
		this._icon =
		{
			sketch :
				twig.icon,

			style :
				twig.iconStyle
		};
	}

	// if true repeats the push action if held down
	this.repeating =
		false;

	this.$retimer =
		null;

	this.$fabric =
		null;

	this._$visible =
		this._$visible ||
		( inherit ? inherit._$visible : true );

	this.$accent =
		Accent.NORMAL;

	// TODO dont store it into this from startago
	this.inherit =
		null;
};


/*
| Buttons are Widgets
*/
Jools.subclass(
	Button,
	Widgets.Widget
);


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
	function(
		accent
	)
{
	var fabric =
		this.$fabric;

	if(
		fabric &&
		this.$accent === accent &&
		!config.debug.noCache
	)
	{
		return fabric;
	}

	fabric =
	this.$fabric =
		new Euclid.Fabric( this.iframe );

	var twig =
		this.twig;

	var style =
		Widgets.getStyle(
			twig.style,
			accent
		);

	// TODO throw in getStyle

	if( !Jools.isnon( style ) )
	{
		throw new Error('Invalid style: ' + twig.style);
	}

	fabric.paint(
		style,
		this,
		'sketch',
		Euclid.View.proper
	);

	var
		caption =
			this._$caption;

	if( caption )
	{
		var
			text =
				caption.$text,

			newline =
				caption.newline,

			// TODO twig creator
			font =
				new Euclid.Font(
					twig.caption.font
				);


		if( !Jools.is( newline ) )
		{
			if( !Jools.is( caption.rotate ) )
			{
				fabric.paintText(
					'text',
						caption.$text,
					'p',
						caption.pos,
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
						caption.pos,
					'font',
						font,
					'rotate',
						caption.rotate
				);
			}
		}
		else
		{
			var pos =
				caption.pos;

			var x =
				pos.x;

			var y =
				pos.y;

			var tZ =
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
			this._icon;

	if( icon )
	{
		style =
			Widgets.getStyle(
				icon.style,
				Accent.NORMA
			);

		fabric.paint(
			style,
			this.icons,
			icon.sketch,
			Euclid.View.proper
		);
	}

	if( config.debug.drawBoxes )
	{
		fabric.paint(
			Widgets.getStyle(
				'boxes',
				Accent.NORMA
			),
			new Euclid.Rect(
				'pnw/pse',
				this.iframe.pnw,
				this.iframe.pse.sub( 1, 1 )
			),
			'sketch',
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
		!this._$visible ||
		p === null ||
		p.x < this.pnw.x ||
		p.y < this.pnw.y ||
		p.x > this.pse.x ||
		p.y > this.pse.y
	)
	{
		return null;
	}

	var fabric =
		this._weave( Accent.NORMA );

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
		!this._$visible ||
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
			this._weave( Accent.NORMA ),

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
		!this.retimer
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

				self.$retimer =
					system.setTimer(
						theme.zoom.repeatTimer,
						repeatFunc
					);

				shell.poke( );
			};

		this.$retimer =
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
		fabric,
		accent
	)
{
	if( !this._$visible )
	{
		return;
	}

	fabric.drawImage(
		'image', this._weave( accent ),
		'pnw',   this.pnw
	);
};


/*
| Clears all caches.
*/
Button.prototype.poke =
	function( )
{
	this.$fabric =
		null;

	this.parent.poke( );
};


/*
| Force clears all caches.
*/
Button.prototype.knock =
	function( )
{
	this.$fabric =
		null;
};


/*
| Sets the buttons text.
*/
Button.prototype.getText =
	function( )
{
	return this._$caption && this._$caption.$text;
};


/*
| Sets the buttons text.
*/
Button.prototype.setText =
	function(
		text
	)
{
	if( this._$caption.$text === text )
	{
		return;
	}

	this._$caption.$text
		= text;

	this.poke( );
};


/*
| Stops a ReButton action.
*/
Button.prototype.dragStop =
	function( )
{
	system.cancelTimer(
		this.$retimer
	);

	this.$retimer =
		null;

	shell.bridge.stopAction( );
};


} )( );
