/*
| The disc panel.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var Disc;

Disc = Disc || { };


/*
| Imports
*/
var config;
var Curve;
var Dash;
var Design;
var Euclid;
var Jools;
var Proc;
var shell;
var theme;


/*
| Capsule
*/
( function( ) {
'use strict';


if( typeof( window ) === 'undefined' )
	{ throw new Error( 'this code needs a browser!' ); }


/*
| Constructor
|
| TODO change to free string arguments
*/
var MainDisc = Disc.MainDisc =
	function(
		inherit,
		screensize
	)
{
	this.name  = 'main';

	this.createDisc = new Disc.CreateDisc(
		screensize
	);

	this.screensize = screensize;

	var style = theme.disc.main;

	var width =
		this.width =
		style.width;

	var height =
		this.height =
		style.height;

	var ew =
		style.ellipse.width;

	var eh =
		style.ellipse.height;

	this.pnw = new Euclid.Point(
		0,
		Jools.half( this.screensize.y - this.height )
	);

	this.pse = this.pnw.add(
		width,
		height
	);

	this.silhoutte = new Euclid.Ellipse(
		new Euclid.Point(
			width - 1 - ew,
			0 - Jools.half( eh - height )
		),
		new Euclid.Point(
			width - 1,
			height + Jools.half( eh - height )
		),
		'gradientPC',
			new Euclid.Point(
				-600,
				Jools.half( height )
			),
		'gradientR0',
			0,
		'gradientR1',
			650
	);


	this.buttons =
		Jools.immute(
			{
				normal :
					new Disc.DiscButton(
						'disc',
							this,
						'name',
							'normal'
					),

				create :
					new Disc.DiscButton(
						'disc',
							this,
						'name',
							'create'
					),

				remove :
					new Disc.DiscButton(
						'disc',
							this,
						'name',
							'remove'
					),

				space :
					new Disc.DiscButton(
						'disc',
							this,
						'name',
							'space'
					),

				user :
					new Disc.DiscButton(
						'disc',
							this,
						'name',
							'user'
					),

				login :
					new Disc.DiscButton(
						'disc',
							this,
						'name',
							'login'
					),

				signup :
					new Disc.DiscButton(
						'disc',
							this,
						'name',
							'signup'
					),

				help :
					new Disc.DiscButton(
						'disc',
							this,
						'name',
							'help'
					)
			}
		);

	this.$hover = inherit ?
		inherit.$hover :
		null;
};



/*
| Force clears all caches.
*/
MainDisc.prototype.knock =
	function( )
{
	this.$fabric = null;
};


/*
| Prepares the disc panels contents.
*/
MainDisc.prototype._weave =
	function( )
{
	var fabric = this.$fabric;

	if( fabric && !config.debug.noCache )
	{
		return fabric;
	}

	fabric = this.$fabric = new Euclid.Fabric(
		this.width,
		this.height
	);

	fabric.fill(
		theme.disc.main.fill,
		this.silhoutte,
		'sketch',
		Euclid.View.proper
	);

	var buttons = this.buttons;

	for( var name in this.buttons )
	{
		var button = buttons[ name ];

		button.draw(
			fabric,
			shell.bridge.inMode(
				this.getModeOfButton( button.name )
			),
			this.$hover  === name
		);
	}

	fabric.edge(
		theme.disc.main.edge,
		this.silhoutte,
		'sketch',
		Euclid.View.proper
	);

	if( config.debug.drawBoxes )
	{
		fabric.paint(
			Dash.getStyle( 'boxes' ),
			new Euclid.Rect(
				'pse',
				new Euclid.Point( this.width - 1, this.height - 1)
			),
			'sketch',
			Euclid.View.proper
		);
	}

	return fabric;
};


/*
| Returns the mode associated with a button
*/
MainDisc.prototype.getModeOfButton =
	function(
		buttonName
	)
{
	switch( buttonName )
	{
		case 'create' :
			return 'Create';

		case 'help' :
			return 'Help';

		case 'login' :
			return 'Login';

		case 'remove' :
			return 'Remove';

		case 'space' :
			return 'Space';

		case 'user' :
			return 'User';

		case 'signup' :
			return 'SignUp';

		case 'normal' :
			return 'Normal';

		default :
			throw new Error( 'unknown button:' + buttonName );
	}
};


/*
| A button of the main disc has been pushed.
*/
MainDisc.prototype.pushButton =
	function(
		buttonName
	)
{
	var bridge = shell.bridge;

	bridge.changeMode(
		this.getModeOfButton(
			buttonName
		)
	);

	var action = bridge.action( );

	if( buttonName === 'remove' )
	{
		if( action )
		{
			bridge.stopAction( );
		}

		bridge.startAction(
			'Remove',
			'space'
		);
	}
	else
	{
		if( action && action.type === 'Remove' )
		{
			bridge.stopAction( );
		}
	}
};


/*
| Draws the disc panel.
*/
MainDisc.prototype.draw =
	function(
		fabric
	)
{
	if( shell.bridge.inMode( 'Create' ) )
	{
		this.createDisc.draw( fabric );
	}

	fabric.drawImage(
		'image', this._weave( ),
		'pnw', this.pnw
	);
};


/*
| Returns true if point is on the disc panel.
*/
MainDisc.prototype.pointingHover =
	function(
		p,
		shift,
		ctrl
	)
{
	var pnw =
		this.pnw;

	var pse =
		this.pse;

	// shortcut if p is not near the panel
	if(
		p === null ||
		p.y < pnw.y ||
		p.y > pse.y ||
		p.x < pnw.x ||
		p.x > pse.x
	)
	{
		this.setHover( null );

		if( shell.bridge.inMode( 'Create' ) )
		{
			return (
				this.createDisc.pointingHover(
					p,
					shift,
					ctrl
				)
			);
		}

		return null;
	}

	var fabric =
		this._weave( );

	var pp =
		p.sub(pnw);

	// FIXME Optimize by reusing the latest path of this.$fabric

	if( !fabric.withinSketch(
			this.silhoutte,
			'sketch',
			Euclid.View.proper,
			pp
		)
	)
	{
		this.setHover( null );

		if( shell.bridge.inMode( 'Create' ) )
		{
			return (
				this.createDisc.pointingHover(
					p,
					shift,
					ctrl
				)
			);
		}

		return null;
	}

	// this is on the disc
	var buttons =
		this.buttons;

	var cursor =
		null;

	for( var name in buttons )
	{
		cursor =
			buttons[ name ].pointingHover(
				pp,
				shift,
				ctrl
			);

		if ( cursor )
			{ break; }
	}

	if ( cursor === null )
	{
		this.setHover( null );
	}

	return cursor || 'default';
};


/*
| Returns true if point is on this panel.
*/
MainDisc.prototype.pointingStart =
	function(
		p,
		shift,
		ctrl
	)
{
	var pnw =
		this.pnw;

	var pse =
		this.pse;

	// shortcut if p is not near the panel
	if(
		p.y < pnw.y ||
		p.y > pse.y ||
		p.x < pnw.x ||
		p.x > pse.x
	)
	{
		this.setHover( null );

		if( shell.bridge.inMode( 'Create' ) )
		{
			return this.createDisc.pointingStart(
				p,
				shift,
				ctrl
			);
		}

		return null;
	}

	var fabric = this._weave();

	var pp = p.sub(pnw);

	// FIXME Optimize by reusing the latest path of this.$fabric
	if(
		!fabric.withinSketch(
			this.silhoutte,
			'sketch',
			Euclid.View.proper,
			pp
		)
	)
	{
		this.setHover( null );

		if( shell.bridge.inMode( 'Create' ) )
		{
			return this.createDisc.pointingStart(
				p,
				shift,
				ctrl
			);
		}

		return null;
	}

	// this is on the disc
	var buttons = this.buttons;

	for( var name in buttons )
	{
		var r =
			buttons[ name ].
			pointingStart(
				pp,
				shift,
				ctrl
			);

		if( r )
			{ return r; }
	}

	return false;
};


/*
| User is inputing text.
*/
MainDisc.prototype.input =
	function(
		// text
	)
{
	// TODO
	return;
};


/*
| Cycles the focus
*/
MainDisc.prototype.cycleFocus =
	function(
		// dir
	)
{
	throw new Error( 'TODO' );
};


/*
| User is pressing a special key.
*/
MainDisc.prototype.specialKey =
	function(
		// key,
		// shift,
		// ctrl
	)
{
	// TODO
};


/*
| Clears caches.
*/
MainDisc.prototype.poke =
	function( )
{
	this.$fabric = null;

	shell.redraw = true;
};


/*
| Sets the hovered component.
*/
MainDisc.prototype.setHover =
	function(
		name
	)
{
	if( this.$hover === name )
	{
		return null;
	}

	this.$fabric = null;

	this.$hover  = name;

	shell.redraw = true;
};


/*
| Displays a message
*/
MainDisc.prototype.message =
	function(
		message
	)
{
	console.log( 'TODO message():', message );
};


/*
| Displays a current space
*/
MainDisc.prototype.setCurSpace =
	function(
		space,
		access
	)
{
	console.log( 'TODO setCurSpace():', space, access );
};


/*
| Displays the current space zoom level
*/
MainDisc.prototype.setSpaceZoom =
	function(
		zf
	)
{
	console.log( 'TODO setSpaceZoom():', zf );
};

/*
| Start of a dragging operation.
*/
MainDisc.prototype.dragStart =
	function(
		// p,
		// shift,
		// ctrl
	)
{
	return null;
};

} )( );
