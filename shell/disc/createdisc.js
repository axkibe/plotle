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


if( typeof( window ) === 'undefined')
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

	copse :
	{
		'createNote' :
		{
			type :
				'Button',

			style :
				'createButton',

			caption :
			{
				type :
					'Label',

				text :
					'Note',

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
						design.note.x,

					y :
						design.note.y
				},

				pse :
				{
					type :
						'Point',

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

		'createLabel' :
		{
			type :
				'Button',

			style :
				'createButton',

			caption :
			{
				type :
					'Label',

				text :
					'Label',

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
						design.label.x,

					y :
						design.label.y
				},

				pse :
				{
					type :
						'Point',

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

		'createRelation' :
		{
			type :
				'Button',

			style :
				'createButton',

			caption :
			{
				type :
					'Label',

				text :
					'Rela-\ntion',

				newline :
					20,

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
						design.relation.x,

					y :
						design.relation.y
				},

				pse :
				{
					type :
						'Point',

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

		'createPortal' :
		{
			type :
				'Button',

			style :
				'createButton',

			caption :
			{
				type :
					'Label',

				text :
					'Portal',

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
						design.portal.x,

					y :
						design.portal.y
				},

				pse :
				{
					type :
						'Point',

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

	var action =
		shell.bridge.action( );

	for( var name in this.buttons )
	{
		var button = buttons[ name ];

		switch( name )
		{
			case 'createNote' :
			case 'createLabel' :
			case 'createRelation' :
			case 'createPortal' :

				button.draw(
					fabric,
					Accent.state(
						name === this.$hover,
						action && action.type === button.name
					)
				);
				break;

			default :

				button.draw(
					fabric,
					action && action.type === button.name,
					this.$hover === name
				);
				break;
		}
	}

	fabric.edge(
		this.style,
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
		'image', this._weave( ),
		'x', 0,
		'y', Jools.half( this.screensize.y - this.height )
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
	var pnw =
		this.oframe.pnw;

	var pse =
		this.oframe.pse;

	// shortcut if p is not near the panel
	if(
		p === null ||
		p.y < pnw.y ||
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
		cursor = buttons[ name ].
			pointingHover( pp, shift, ctrl );

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
		p.y < pnw.y ||
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
	throw new Error( 'not implemented' );
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
		return null;
	}

	this.$fabric =
		null;

	this.$hover  =
		name;

	shell.redraw =
		true;
};


} )( );
