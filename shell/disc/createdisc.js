/*
| The creation disc.
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
	shell,
	Tree,
	Widgets;


/*
| Capsule
*/
( function( ) {
'use strict';


if( CHECK && typeof( window ) === 'undefined')
{
	throw new Error(
		'this code needs a browser!'
	);
}


/*
| Constructor
*/
var CreateDisc =
Disc.CreateDisc =
	function(
		screensize,
		inherit
	)
{
	Disc.Disc.call(
		this,
		'name',
			'create',
		'inherit',
			inherit,
		'screensize',
			screensize
	);

	this.$active =
		inherit && inherit.$active;
};

/*
| All important design variables for convenience
*/
var design = {

	generic :
	{
		width :
			70,

		height :
			70,

		font :
			fontPool.get( 16, 'cm' )
	},

	note :
	{
		x :
			62,

		y :
			216
	},

	label :
	{
		x :
			81,

		y :
			284
	},

	relation :
	{
		x :
			94,

		y :
			354
	},

	portal :
	{
		x :
			101,

		y :
			425
	}
};

CreateDisc.prototype.layout =
{
	type :
		'Layout',

	twig :
	{
		'createNote' :
		{
			type :
				'ButtonWidget',

			style :
				'createButton',

			caption :
			{
				type :
					'LabelWidget',

				text :
					'Note',

				font :
					design.generic.font,

				pos :
				{
					type :
						'AnchorPoint',

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
						'AnchorPoint',

					anchor :
						'nw',

					x :
						design.note.x,

					y :
						design.note.y
				},

				pse :
				{
					type :
						'AnchorPoint',

					anchor :
						'nw',

					x :
						design.note.x +
							design.generic.width,

					y :
						design.note.y +
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
						'AnchorPoint',

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
						'AnchorPoint',

					anchor:
						'se',

					x :
						-1,

					y :
						-1
				}
			}
		},

		'createLabel' :
		{
			type :
				'ButtonWidget',

			style :
				'createButton',

			caption :
			{
				type :
					'LabelWidget',

				text :
					'Label',

				font :
					design.generic.font,

				pos :
				{
					type :
						'AnchorPoint',

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
						'AnchorPoint',

					anchor :
						'nw',

					x :
						design.label.x,

					y :
						design.label.y
				},

				pse :
				{
					type :
						'AnchorPoint',

					anchor :
						'nw',

					x :
						design.label.x +
							design.generic.width,

					y :
						design.label.y +
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
						'AnchorPoint',

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
						'AnchorPoint',

					anchor:
						'se',

					x :
						-1,

					y :
						-1
				}
			}
		},

		'createRelation' :
		{
			type :
				'ButtonWidget',

			style :
				'createButton',

			caption :
			{
				type :
					'LabelWidget',

				text :
					'Rela-\ntion',

				newline :
					20,

				font :
					design.generic.font,

				pos :
				{
					type :
						'AnchorPoint',

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
						'AnchorPoint',

					anchor :
						'nw',

					x :
						design.relation.x,

					y :
						design.relation.y
				},

				pse :
				{
					type :
						'AnchorPoint',

					anchor :
						'nw',

					x :
						design.relation.x +
							design.generic.width,

					y :
						design.relation.y +
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
						'AnchorPoint',

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
						'AnchorPoint',

					anchor:
						'se',

					x :
						-1,

					y :
						-1
				}
			}
		},

		'createPortal' :
		{
			type :
				'ButtonWidget',

			style :
				'createButton',

			caption :
			{
				type :
					'LabelWidget',

				text :
					'Portal',

				font :
					design.generic.font,

				pos :
				{
					type :
						'AnchorPoint',

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
						'AnchorPoint',

					anchor :
						'nw',

					x :
						design.portal.x,

					y :
						design.portal.y
				},

				pse :
				{
					type :
						'AnchorPoint',

					anchor :
						'nw',

					x :
						design.portal.x +
							design.generic.width,

					y :
						design.portal.y +
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
						'AnchorPoint',

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
						'AnchorPoint',

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
		'createNote',
		'createLabel',
		'createRelation',
		'createPortal'
	]
};


/*
| Prepares the disc panels contents.
*/
CreateDisc.prototype._weave =
	function( )
{
	var fabric =
	this.$fabric =
		new Euclid.Fabric(
			this.style.width,
			this.style.height
		);

	fabric.fill(
		this.style,
		this.silhoutte,
		'sketch',
		Euclid.View.proper
	);

	var
		buttons =
			this.buttons,

		action =
			shell.bridge.action( );

	for( var name in this.buttons )
	{
		buttons[ name ].draw( fabric );
	}

	fabric.edge(
		this.style,
		this.silhoutte,
		'sketch',
		Euclid.View.proper
	);

	return fabric;
};


/*
| A button of the main disc has been pushed.
*/
CreateDisc.prototype.pushButton =
	function(
		buttonName
	)
{
	var action =
		shell.bridge.action( );

	if( action && action.type === buttonName )
	{
		// already in this action
		return;
	}

	shell.redraw = true;

	if( action )
	{
		shell.bridge.stopAction( );
	}

	switch( buttonName )
	{
		case 'createLabel' :
		case 'createNote' :
		case 'createPortal' :

			shell.bridge.startAction(
				buttonName,
				'space'
			);

			return;

		case 'createRelation' :

			shell.bridge.startAction(
				'createRelation',
				'space',
				'relationState', 'start'
			);

			return;

		default :

			throw new Error(
				'unknown button:' + buttonName
			);
	}

};


/*
| Draws the disc panel.
*/
CreateDisc.prototype.draw =
	function(
		fabric
	)
{
	fabric.drawImage(
		'image',
			this._weave( ),
		'x',
			0,
		'y',
			Jools.half(
				this.screensize.y - this.style.height
			)
	);
};


/*
| Returns true if point is on the disc panel.
*/
CreateDisc.prototype.pointingHover =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		pnw =
			this.oframe.pnw,

		pse =
			this.oframe.pse;

	// shortcut if p is not near the panel
	if(
		p === null ||
		p.y < pnw.y || // TODO
		p.y > pse.y ||
		p.x < pnw.x ||
		p.x > pse.x
	)
	{
		return this.setHover( null );
	}

	var
		fabric =
			this._weave(),

		pp =
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
		return this.setHover( null );
	}

	// this is on the disc
	var
		buttons =
			this.buttons,

		cursor =
			null;

	for( var name in buttons )
	{
		cursor =
			buttons[ name ]
				.pointingHover(
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
CreateDisc.prototype.pointingStart =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		pnw =
			this.oframe.pnw,

		pse =
			this.oframe.pse;

	// shortcut if p is not near the panel
	if(
		p.y < pnw.y || // TODO
		p.y > pse.y ||
		p.x < pnw.x ||
		p.x > pse.x
	)
	{
		return null;
	}

	var
		fabric =
			this._weave(),

		pp =
			p.sub(pnw);

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
		return null;
	}

	// this is on the disc
	var buttons =
		this.buttons;

	for( var name in buttons )
	{
		var r =
			buttons[ name ]
				.pointingStart(
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
CreateDisc.prototype.input =
	function(
		// text
	)
{
	return;
};


/*
| Cycles the focus
*/
CreateDisc.prototype.cycleFocus =
	function(
		// dir
	)
{
	throw new Error(
		'not implemented'
	);
};


/*
| User is pressing a special key.
*/
CreateDisc.prototype.specialKey =
	function(
	//	key,
	//	shift,
	//	ctrl
	)
{
	// not implemented
};


/*
| Clears caches.
*/
CreateDisc.prototype.poke =
	function( )
{
	this.$fabric =
		null;

	shell.redraw =
		true;
};


/*
| Sets the hovered component.
*/
CreateDisc.prototype.setHover =
	function(
		name
	)
{
	if( this.$hover === name )
	{
		return;
	}

	this.$fabric =
		null;

	if( this.$hover )
	{
		this.buttons[ this.$hover ] =
			Widgets.Button.create(
				'inherit',
					this.buttons[ this.$hover ],
				'hoverAccent',
					false
			);
	}

	this.$hover =
		name;

	if( name )
	{
		this.buttons[ name ] =
			Widgets.Button.create(
				'inherit',
					this.buttons[ name ],
				'hoverAccent',
					true
			);
	}

	shell.redraw =
		true;
};

CreateDisc.prototype.setActive =
	function(
		active
	)
{
	if( this.$active === active )
	{
		return;
	}

	this.$fabric =
		null;

	if( this.buttons[ this.$active ] )
	{
		this.buttons[ this.$active ] =
			Widgets.Button.create(
				'inherit',
					this.buttons[ this.$active ],
				'focusAccent',
					false
			);
	}

	this.$active =
		active;

	if( this.buttons[ active ] )
	{
		this.buttons[ active ] =
			Widgets.Button.create(
				'inherit',
					this.buttons[ active ],
				'focusAccent',
					true
			);
	}

	shell.redraw =
		true;
};


} )( );
