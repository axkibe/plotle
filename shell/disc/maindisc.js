/*
| The disc panel.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var Disc;

Disc =
	Disc || { };


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
var Tree;
var shell;
var theme;
var Widgets;


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
var MainDisc =
Disc.MainDisc =
	function(
		inherit,
		screensize
	)
{
	this.name =
		'main';

	this.createDisc =
		new Disc.CreateDisc(
			screensize
		);

	this.screensize =
		screensize;

	var style =
		theme.disc.main;


	// TODO remove this.width/height vars
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

	this.oframe =
		new Euclid.Rect(
			'pnw/size',
			new Euclid.Point(
				0,
				Jools.half( this.screensize.y - this.height )
			),
			width,
			height
		);

	this.iframe =
		new Euclid.Rect(
			'pnw/size',
			Euclid.Point.zero,
			width,
			height
		);

	// TODO inherit, make private
	var tree =
	this._tree =
		new Tree(
			this.layout,
			Disc.LayoutPattern
		);

	this.silhoutte =
		new Euclid.Ellipse(
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

	// the buttons
	//
	// true/false determines their startup visibility
	//
	this.buttons =
		{
			normal :
				true,

			create :
				false,

			remove :
				false,

			space :
				true,

			user :
				true,

			login :
				false,

			signup :
				false,

			help :
				true
		};

	var icons =
	this._icons =
		inherit ?
			inherit._icons :
			new Disc.Icons( );

	for( var name in this.buttons )
	{
		// TODO XXX remove switch
		switch( name ) {
		case 'normal' :
		case 'create' :
		case 'remove' :
		case 'space' :
		this.buttons[ name ] =
			new Widgets.Button(
				'parent',
					this,
				'name',
					name,
				'twig',
					tree.root.copse[ name ],
				'visibility',
					inherit ?
						inherit.buttons[ name ].isVisible( ) :
						this.buttons[ name ],
				'inherit',
					inherit ?
						inherit && inherit.buttons[ name ] :
						null,
				'icons',
					icons
			);
		break;
		default :
		this.buttons[ name ] =
			new Disc.DiscButton(
				'disc',
					this,
				'name',
					name,
				'visibility',
					inherit ?
						inherit.buttons[ name ].isVisible( ) :
						this.buttons[ name ],
				'text',
					(
						inherit && inherit.buttons[ name ].getText( )
					)
					||
					null,
				'icons',
					icons
			);
		break;
		}
	}

	if( inherit )
	{

		this.buttons.login.setText(
			inherit.buttons.login.getText( )
		);
	}

	this.$hover =
		inherit ?
			inherit.$hover :
			null;

	this.$user =
		null;

	this._$loggedIn =
		inherit ? inherit._$loggedIn : false;
};


/*
| All important design variables for convenience
*/
var design = {

	generic :
	{
		width :
			44,

		height :
			44,

		font :
			fontPool.get( 14, 'cm' ),
	},

	normal :
	{
		x :
			4,

		y :
			120
	},

	create :
	{
		x :
			20,

		y :
			169
	},

	remove :
	{
		x :
			32,

		y :
			218,
	},

	space :
	{
		width :
			28,

		height :
			290,

		x :
			0,

		y :
			170,
	},

	/*
		textAnchor :
			new Euclid.Point(
				11,
				145
			),
	*/
};

MainDisc.prototype.layout =
	{
		type :
			'Layout',

		copse :
		{
			'normal' :
			{
				type :
					'Button',

				normaStyle :
					'discButtonGeneric',

				hoverStyle :
					'discButtonGenericHover',

				focusStyle :
					'discButtonGenericFocus',

				hofocStyle :
					'discButtonGenericHofoc',

				icon :
					'normal',

				iconStyle :
					'iconNormal',

				frame :
				{
					type :
						'Frame',

					pnw :
					{
						type :
							'Point',

						anchor :
							'nw',

						x :
							design.normal.x,

						y :
							design.normal.y
					},

					pse :
					{
						type :
							'Point',

						anchor :
							'nw',

						x :
							design.normal.x +
								design.generic.width,

						y :
							design.normal.y +
								design.generic.height
					}
				},

				shape :
				{
					type :
						'Ellipse',

					pnw :
					{
						type:
							'Point',

						anchor:
							'nw',

						x :
							0,

						y :
							0
					},

					pse :
					{
						type:
							'Point',

						anchor:
							'se',

						x :
							-1,

						y :
							-1
					}
				}
			},

			'create' :
			{
				type :
					'Button',

				normaStyle :
					'discButtonGeneric',

				hoverStyle :
					'discButtonGenericHover',

				focusStyle :
					'discButtonGenericFocus',

				hofocStyle :
					'discButtonGenericHofoc',

				caption :
				{
					type :
						'Label',

					text :
						'new',

					font :
						design.generic.font,

					pos :
					{
						type :
							'Point',

						anchor :
							'c',

						x :
							0,

						y :
							0
					}
				},

				frame :
				{
					type :
						'Frame',

					pnw :
					{
						type :
							'Point',

						anchor :
							'nw',

						x :
							design.create.x,

						y :
							design.create.y
					},

					pse :
					{
						type :
							'Point',

						anchor :
							'nw',

						x :
							design.create.x +
								design.generic.width,

						y :
							design.create.y +
								design.generic.height
					}
				},

				shape :
				{
					type :
						'Ellipse',

					pnw :
					{
						type:
							'Point',

						anchor:
							'nw',

						x :
							0,

						y :
							0
					},

					pse :
					{
						type:
							'Point',

						anchor:
							'se',

						x :
							-1,

						y :
							-1
					}
				}
			},

			'remove' :
			{
				type :
					'Button',

				normaStyle :
					'discButtonGeneric',

				hoverStyle :
					'discButtonGenericHover',

				focusStyle :
					'discButtonGenericFocus',

				hofocStyle :
					'discButtonGenericHofoc',

				icon :
					'remove',

				iconStyle :
					'iconRemove',

				frame :
				{
					type :
						'Frame',

					pnw :
					{
						type :
							'Point',

						anchor :
							'nw',

						x :
							design.remove.x,

						y :
							design.remove.y
					},

					pse :
					{
						type :
							'Point',

						anchor :
							'nw',

						x :
							design.remove.x +
								design.generic.width,

						y :
							design.remove.y +
								design.generic.height
					}
				},

				shape :
				{
					type :
						'Ellipse',

					pnw :
					{
						type:
							'Point',

						anchor:
							'nw',

						x :
							0,

						y :
							0
					},

					pse :
					{
						type:
							'Point',

						anchor:
							'se',

						x :
							-1,

						y :
							-1
					}
				}
			},

			'space' :
			{
				type :
					'Button',

				normaStyle :
					'discButtonGeneric',

				hoverStyle :
					'discButtonGenericHover',

				focusStyle :
					'discButtonGenericFocus',

				hofocStyle :
					'discButtonGenericHofoc',

				frame :
				{
					type :
						'Frame',

					pnw :
					{
						type :
							'Point',

						anchor :
							'nw',

						x :
							design.space.x,

						y :
							design.space.y
					},

					pse :
					{
						type :
							'Point',

						anchor :
							'nw',

						x :
							design.space.x +
								design.space.width,

						y :
							design.space.y +
								design.space.height
					}
				},

				caption :
				{
					type :
						'Label',

					text :
						'',

					font :
						fontPool.get( 12, 'cm' ),

					pos :
					{
						type :
							'Point',

						anchor :
							'c',

						x :
							0,

						y :
							0
					},

					rotate :
						- Math.PI / 2,
				},

				shape :
				{
					type :
						'Ellipse',

					pnw :
					{
						type:
							'Point',

						anchor:
							'nw',

						x :
							-60,

						y :
							0
					},

					pse :
					{
						type:
							'Point',

						anchor:
							'se',

						x :
							-1,

						y :
							-1
					}
				}
			}
		},

		ranks :
		[
			'normal',
			'create',
			'remove',
			'space'
		]
	};


/*
| Design helper is no longer needed, cleanup
*/
design =
	null;

/*
| Force clears all caches.
*/
MainDisc.prototype.knock =
	function( )
{
	this.$fabric =
		null;
};


/*
| Prepares the disc panels contents.
*/
MainDisc.prototype._weave =
	function( )
{
	var fabric =
		this.$fabric;

	if( fabric && !config.debug.noCache )
	{
		return fabric;
	}

	fabric =
	this.$fabric =
		new Euclid.Fabric(
			this.width,
			this.height
		);

	fabric.fill(
		theme.disc.main.fill,
		this.silhoutte,
		'sketch',
		Euclid.View.proper
	);

	var buttons =
		this.buttons;

	for( var name in this.buttons )
	{
		var button =
			buttons[ name ];

		// TODO XXX remove switch
		switch( name ) {
		case 'normal' :
		case 'create' :
		case 'remove' :
		case 'space' :
		button.draw(
			fabric,
			Widgets.Accent.state(
				name === this.$hover,
				shell.bridge.inMode(
					this.getModeOfButton( button.name )
				)
			)
		);
		break;

		default :
		button.draw(
			fabric,
			shell.bridge.inMode(
				this.getModeOfButton( button.name )
			),
			this.$hover  === name
		);
		break;
		}
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
				new Euclid.Point(
					this.width - 1,
					this.height - 1
				)
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
	var bridge =
		shell.bridge;

	if(
		buttonName === 'login' &&
		this._$loggedIn
	)
	{
		shell.logout( );

		return;
	}

	bridge.changeMode(
		this.getModeOfButton(
			buttonName
		)
	);

	var action =
		bridge.action( );

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
		'image',
			this._weave( ),
		'pnw',
			this.oframe.pnw
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
	var oframe =
		this.oframe;

	var pnw =
		oframe.pnw;

	var pse =
		oframe.pse;

	// shortcut if p is not near the panel
	// TODO replace with oframe.within
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
		p.sub( pnw );

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
		{
			break;
		}
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
	var oframe =
		this.oframe;

	var pnw =
		oframe.pnw;

	var pse =
		oframe.pse;

	// shortcut if p is not near the panel
	// TODO replace with oframe.within
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
		{
			return r;
		}
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
	this.buttons.space.setText( space );

	switch( access )
	{
		case 'ro' :

			this.buttons.create.setVisibility( false );

			this.buttons.remove.setVisibility( false );

			break;

		case 'rw' :

			this.buttons.create.setVisibility( true );

			this.buttons.remove.setVisibility( true );

			break;

		default :

			throw new Error(
				'access neither ro or rw: ' + access
			);
	}
};


/*
| Displays the current user
| Adapts login/logout/signup button
*/
MainDisc.prototype.setUser =
	function(
		user
	)
{
	this.$user
		= user;

	this.buttons.user.setText( user );

	this.buttons.login.setVisibility( true );

	if( user.substr( 0, 5 ) !== 'visit' )
	{
		this._$loggedIn =
			true;

		this.buttons.signup.setVisibility( false );

		this.buttons.login.setText(
			[
				'log',
				'out'
			]
		);
	}
	else
	{
		this._$loggedIn =
			false;

		this.buttons.signup.setVisibility( true );

		this.buttons.login.setText(
			[
				'log',
				'in'
			]
		);
	}

	shell.bridge.changeMode( 'Normal' );

	this.poke( );
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
