/*
| A button on a form.
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
var config;
var Curve;
var Euclid;
var Jools;
var Path;
var shell;
var system;
var theme;


/*
| Capsule
*/
( function( ) {
'use strict';

if( typeof( window ) === 'undefined' )
{
	throw new Error( 'this code needs a browser!' );
}


/*
| Constructor.
*/
var Button =
Widgets.Button =
	function(
		name,
		twig,
		form,
		inherit
	)
{
	if ( twig.type !== 'Button' )
	{
		throw new Error('invalid twig type');
	}

	this.name =
		name;

	this.twig =
		twig;

	this.form =
		form;

	var pnw =
	this.pnw =
		form.iframe.computePoint( twig.frame.pnw );

	var pse =
	this.pse =
		form.iframe.computePoint( twig.frame.pse );

	var iframe =
	this.iframe =
		new Euclid.Rect(
			'pse',
			pse.sub( pnw )
		);

	// TODO move this to Shape

	var tshape = twig.shape;

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

			throw new Error( 'unknown shape: ' + tshape.type );
	}

	this.captionPos =
		iframe.computePoint( twig.caption.pos );

	this.path = new Path(
		[
			form.name,
			name
		]
	);

	// if true repeats the push action if held down
	this.repeating =
		false;

	this.$retimer =
		null;

	this.$fabric =
		null;

	this.$visible =
		inherit ? inherit.$visible : true;

	this.$captionText =
		inherit ? inherit.$captionText : twig.caption.text;

	this.$accent =
		Widgets.Accent.NORMAL;
};



/*
| Control takes focus.
*/
Button.prototype.grepFocus =
	function( )
{
	if( !this.$visible )
	{
		return false;
	}

	if( this.form.getFocus( ) === this )
	{
		return false;
	}

	this.form.setCaret(
		{
			path :
				new Path(
					[
						this.form.name,
						this.name
					]
				),

			at1 :
				0
		}
	);

	this.poke( );

	return true;
};


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

	var sname;

	var Accent =
		Widgets.Accent;

	switch( accent )
	{
		case Accent.NORMA :

			sname =
				twig.normaStyle;

			break;

		case Accent.HOVER :

			sname =
				twig.hoverStyle;

			break;

		case Accent.FOCUS :

			sname =
				twig.focusStyle;

			break;

		case Accent.HOFOC :

			sname =
				twig.hofocStyle;

			break;

		default :

			throw new Error(
				'Invalid accent: ' + accent
			);
	}

	var style =
		Widgets.getStyle( sname );

	if( !Jools.isnon( style ) )
	{
		throw new Error('Invalid style: ' + sname);
	}

	fabric.paint(
		style,
		this,
		'sketch',
		Euclid.View.proper
	);

	fabric.paintText(
		'text',
			this.$captionText,
		'p',
			this.captionPos,
		'font',
			twig.caption.font
	);

	if( config.debug.drawBoxes )
	{
		fabric.paint(
			Widgets.getStyle( 'boxes' ),
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
		!this.$visible ||
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
		this._weave( Widgets.Accent.NORMA );

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

	this.form.setHover(
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
		!this.$visible ||
		p.x < this.pnw.x ||
		p.y < this.pnw.y ||
		p.x > this.pse.x ||
		p.y > this.pse.y
	)
	{
		return null;
	}

	var fabric =
		this._weave( Widgets.Accent.NORMA );

	var pp =
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

	var form =
		this.form;

	if(
		this.repeating &&
		!this.retimer
	)
	{
		shell.bridge.startAction(
			'ReButton',
			'board',
			'itemPath', this.path
		);

		var repeatFunc;

		repeatFunc =
			function( )
			{
				form.pushButton(
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

	form.pushButton(
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

			this.form.cycleFocus( +1 );

			return;

		case 'up' :

			this.form.cycleFocus( -1 );

			return;

		case 'enter' :

			this.form.pushButton(
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
	this.form.pushButton(
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
	if( !this.$visible )
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
	this.$fabric = null;

	this.form.poke( );
};


/*
| Force clears all caches.
*/
Button.prototype.knock =
	function( )
{
	this.$fabric = null;
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

	this.$retimer = null;

	shell.bridge.stopAction( );
};


} )( );
