/*
| The disc panel.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Disc;

Disc =
	Disc || { };


/*
| Imports
*/
var
	Accent,
	config,
	Curve,
	Dash,
	Design,
	Euclid,
	fontPool,
	Jools,
	Proc,
	Tree,
	shell,
	Widgets;

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
| Constructor
|
| XXX change to free string arguments
*/
var MainDisc =
Disc.MainDisc =
	function(
		inherit,
		screensize
	)
{
	Disc.Disc.call(
		this,
		'name',
			'main',
		'inherit',
			inherit,
		'screensize',
			screensize
	);

	this.createDisc =
		new Disc.CreateDisc(
			screensize,
			inherit && inherit.createDisc
		);

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
		inherit ?
			inherit._$loggedIn :
			false;
};


/*
| The MainDisc is a Disc.
*/
Jools.subclass(
	MainDisc,
	Disc.Disc
);


/*
| All important design variables for convenience
*/
var design =
{
	generic :
	{
		width :
			44,

		height :
			44,

		font :
			fontPool.get( 14, 'cm' )
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
			218
	},

	moveto :
	{
		x :
			47,

		y :
			326
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
			170
	},

	user :
	{
		width :
			24,

		height :
			180,

		x :
			0,
		y :
			440
	},

	login :
	{
		x :
			30,

		y :
			535
	},

	signup :
	{
		x :
			19,

		y :
			585
	}

	/*
	help :
	{
		x :
			4,

		y :
			635
	}
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

			style :
				'mainButton',

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

			style :
				'mainButton',

			visible :
				false,

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

			style :
				'mainButton',

			icon :
				'remove',

			iconStyle :
				'iconRemove',

			visible :
				false,

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

		'moveto' :
		{
			type :
				'Button',

			style :
				'mainButton',

			icon :
				'moveto',

			iconStyle :
				'iconNormal',

			visible :
				false,

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
						design.moveto.x,

					y :
						design.moveto.y
				},

				pse :
				{
					type :
						'Point',

					anchor :
						'nw',

					x :
						design.moveto.x +
							design.generic.width,

					y :
						design.moveto.y +
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

			style :
				'mainButton',

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
					- Math.PI / 2
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
		},

		'user' :
		{
			type :
				'Button',

			style :
				'mainButton',

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
						design.user.x,

					y :
						design.user.y
				},

				pse :
				{
					type :
						'Point',

					anchor :
						'nw',

					x :
						design.user.x +
							design.user.width,

					y :
						design.user.y +
							design.user.height
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
					- Math.PI / 2
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
						-70,

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

		'login' :
		{
			type :
				'Button',

			style :
				'mainButton',

			visible :
				false,

			caption :
			{
				type :
					'Label',

				text :
					'log\nin',

				newline :
					14,

				font :
					fontPool.get( 13, 'cm' ),

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
						design.login.x,

					y :
						design.login.y
				},

				pse :
				{
					type :
						'Point',

					anchor :
						'nw',

					x :
						design.login.x +
							design.generic.width,

					y :
						design.login.y +
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

		'signup' :
		{
			type :
				'Button',

			style :
				'mainButton',

			visible :
				false,

			caption :
			{
				type :
					'Label',

				text :
					'sign\nup',

				newline :
					14,

				font :
					fontPool.get( 13, 'cm' ),

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
						design.signup.x,

					y :
						design.signup.y
				},

				pse :
				{
					type :
						'Point',

					anchor :
						'nw',

					x :
						design.signup.x +
							design.generic.width,

					y :
						design.signup.y +
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
		}

		/*
		'help' :
		{
			type :
				'Button',

			style :
				'mainButton',

			caption :
			{
				type :
					'Label',

				text :
					'help',

				font :
					fontPool.get( 13, 'cm' ),

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
						design.help.x,

					y :
						design.help.y
				},

				pse :
				{
					type :
						'Point',

					anchor :
						'nw',

					x :
						design.help.x +
							design.generic.width,

					y :
						design.help.y +
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
		}
		*/
	},

	ranks :
	[
		'normal',
		'create',
		'remove',
		'moveto',
		'space',
		'user',
		'login',
		'signup'
		// 'help'
	]
};


/*
| Design helper is no longer needed, cleanup
*/
design =
	null;


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
		this.style,
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

		button.draw(
			fabric,
			Accent.state(
				name === this.$hover,
				shell.bridge.inMode(
					this.getModeOfButton( button.name )
				)
			)
		);
	}

	fabric.edge(
		this.style,
		this.silhoutte,
		'sketch',
		Euclid.View.proper
	);

	/*
	| TODO fix boxes
	*/
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

		case 'moveto' :
			return 'MoveTo';

		case 'help' :
			return 'Help';

		case 'login' :
			return 'Login';

		case 'normal' :
			return 'Normal';

		case 'remove' :
			return 'Remove';

		case 'signup' :
			return 'SignUp';

		case 'space' :
			return 'Space';

		case 'user' :
			return 'User';

		default :
			throw new Error(
				'unknown button:' + buttonName
			);
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
		!oframe.within(
			null,
			p
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
	// XXX
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
	throw new Error( 'XXX' );
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
	// XXX
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

	this.$fabric =
		null;

	this.$hover =
		name;

	shell.redraw =
		true;
};


/*
| Displays a message
*/
MainDisc.prototype.message =
	function(
		// message
	)
{
	// console.log( 'XXX message():', message );
};


/*
| Displays a current space
*/
MainDisc.prototype.arrivedAtSpace =
	function(
		spaceUser,
		spaceTag,
		access
	)
{
	var buttons =
		this.buttons;

	buttons.space.setText( spaceUser + ':' + spaceTag );

	switch( access )
	{
		case 'ro' :

			buttons.create.setVisible( false );

			buttons.remove.setVisible( false );

			break;

		case 'rw' :

			buttons.create.setVisible( true );

			buttons.remove.setVisible( true );

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
	this.$user =
		user;

	var buttons =
		this.buttons;

	buttons.user.setText( user );

	buttons.login.setVisible( true );

	if( user.substr( 0, 5 ) !== 'visit' )
	{
		this._$loggedIn =
			true;

		buttons.signup.setVisible( false );

		buttons.login.setText(
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

		buttons.signup.setVisible( true );

		buttons.login.setText(
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
		// zf
	)
{
	// console.log( 'XXX setSpaceZoom():', zf );
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
