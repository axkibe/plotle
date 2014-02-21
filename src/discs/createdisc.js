/*
| The creation disc.
|
| Authors: Axel Kittenberger
*/

/*
| Export
*/
var
	Discs;

Discs =
	Discs || { };


/*
| Imports
*/
var
	Action,
	Euclid,
	Jools,
	Path,
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
			'CreateDisc',
		unit :
			'Discs',
		attributes :
			{
				access :
					{
						comment :
							'users access to current space',
						type :
							'String',
						allowsNull :
							true,
						defaultVal :
							'null'
					},
				action :
					{
						comment :
							'currently active action',
						type :
							'Action',
						allowsNull :
							true,
						defaultVal :
							'null'
					},
				hover :
					{
						comment :
							'the widget hovered upon',
						type :
							'Path',
						allowsNull :
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
						allowsNull :
							true,
						defaultVal :
							'null'
					},
				mode :
					{
						comment :
							'current mode the UI is in',
						type :
							'String',
						allowsNull :
							true,
						defaultVal :
							'null'
					},
				path :
					{
						comment :
							'path of the disc',
						type :
							'Path',
						allowsNull :
							true,
						defaultVal :
							'null'
					},
				spaceUser :
					{
						comment :
							'owner of currently loaded space',
						type :
							'String',
						allowsNull :
							true,
						defaultVal :
							'null',
						assign :
							null
					},
				spaceTag :
					{
						comment :
							'name of currently loaded space',
						type :
							'String',
						allowsNull :
							true,
						defaultVal :
							'null',
						assign :
							null
					},
				username :
					{
						comment :
							'currently logged in user',
						type :
							'String',
						allowsNull :
							true,
						defaultVal :
							'null',
						assign :
							null
					},
				view :
					{
						comment :
							'the current view',
						type :
							'View',
						concerns :
							{
								member :
									'sizeOnly'
							},
						allowsNull :
							true,
						defaultVal :
							'null'
					}
			},
		subclass :
			'Discs.Disc',
		init :
			[
				'inherit'
			],
		twig :
			{
				'Button' :
					'Widgets.Button',
				'CheckBox' :
					'Widgets.Checkbox',
				'Input' :
					'Widgets.Input',
				'Label' :
					'Widgets.Label'
			}
	};
}


var
	CreateDisc =
		Discs.CreateDisc;


/*
| Initializes the create disc.
*/
CreateDisc.prototype._init =
	function(
		inherit
	)
{
	if( this.view === null )
	{
		// this is an abstract disc in design mode
		return;
	}

	Discs.Disc._init.call(
		this,
		inherit
	);

	var
		buttons =
			{ },

		twig =
			this.twig,

		ranks =
			this.ranks;

	for(
		var r = 0, rZ = ranks.length;
		r < rZ;
		r++
	)
	{
		var
			wname =
				ranks[ r ],

			path =
				this.path.append( wname ),

			focusAccent =
				CreateDisc._isActiveButton(
					this.action,
					wname
				),

			widgetProto =
				inherit
				&&
				inherit.buttons
				&&
				inherit.buttons[ wname ];

		if( !widgetProto )
		{
			widgetProto =
				twig[ wname ];
		}

		buttons[ wname ] =
			widgetProto.create(
				'path',
					path,
				'superFrame',
					this.frame.zeropnw,
				'hoverAccent',
					path.equals( this.hover ),
				'focusAccent',
					focusAccent,
				'icons',
					this._icons
			);
	}

	this.buttons =
		buttons;
};


/*
| The disc panel's fabric.
*/
Jools.lazyValue(
	CreateDisc.prototype,
	'_fabric',
	function( )
	{
		var
			buttons =
				this.buttons,

			fabric =
				Euclid.Fabric.create(
					'width',
						this.style.width,
					'height',
						this.style.height
				);

		fabric.fill(
			this.style,
			this.silhoutte,
			'sketch',
			Euclid.View.proper
		);

		for( var buttonName in this.buttons )
		{
			buttons[ buttonName ].draw( fabric );
		}

		fabric.edge(
			this.style,
			this.silhoutte,
			'sketch',
			Euclid.View.proper
		);

		return fabric;
	}
);


/*
| A button of the main disc has been pushed.
*/
CreateDisc.prototype.pushButton =
	function(
		path
		// shift,
		// ctrl
	)
{

/**/if( CHECK )
/**/{
/**/	var
/**/		discname =
/**/			path.get( 1 );
/**/
/**/	if( discname !== this.reflect )
/**/	{
/**/		throw new Error(
/**/			'invalid discname: ' + discname
/**/		);
/**/	}
/**/}

	var
		buttonName =
			path.get( 2 );

	switch( buttonName )
	{
		case 'CreateLabel' :

			shell.setAction(
				Action.CreateGeneric.create(
					'itemType',
						'Label',
					'model',
						null,
					'start',
						null,
					'transItem',
						null
				)
			);

			return;

		case 'CreateNote' :

			shell.setAction(
				Action.CreateGeneric.create(
					'itemType',
						'Note',
					'model',
						null,
					'start',
						null,
					'transItem',
						null
				)
			);

			return;

		case 'CreatePortal' :

			shell.setAction(
				Action.CreateGeneric.create(
					'itemType',
						'Portal',
					'model',
						null,
					'start',
						null,
					'transItem',
						null
				)
			);

			return;

		case 'CreateRelation' :

			shell.setAction(
				Action.CreateRelation.create(
					'fromItemPath',
						Path.empty,
					'relationState',
						'start',
					'toItemPath',
						Path.empty
				)
			);

			return;

		default :

			throw new Error(
				CHECK &&
				(
					'unknown button:' + buttonName
				)
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
			this._fabric,
		'x',
			0,
		'y',
			Jools.half(
				this.view.height - this.style.height
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
	// shortcut if p is not near the panel
	if(
		!this.frame.within(
			null,
			p
		)
	)
	{
		return null;
	}

	var
		fabric =
			this._fabric,

		pp =
			p.sub( this.frame.pnw );

	// ENHANCE optimize by reusing the latest path of this.$fabric
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

	// it's on the disc
	var
		buttons =
			this.buttons;

	for( var buttonName in buttons )
	{
		var
			reply =
				buttons[ buttonName ]
					.pointingHover(
						pp,
						shift,
						ctrl
					);

		if( reply )
		{
			return reply;
		}
	}

	return null;
};


/*
| Checks if the user clicked something on the panel.
*/
CreateDisc.prototype.click =
	function(
		p,
		shift,
		ctrl
	)
{
	// shortcut if p is not near the panel
	if(
		!this.frame.within(
			null,
			p
		)
	)
	{
		return null;
	}

	var
		fabric =
			this._fabric,

		pp =
			p.sub( this.frame.pnw );

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
	var
		buttons =
			this.buttons;

	for( var buttonName in buttons )
	{
		var r =
			buttons[ buttonName ]
				.click(
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
		CHECK
		&&
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
| Returns true if the button called 'wname'
| should be highlighted for current 'action'
*/
CreateDisc._isActiveButton =
	function(
		action,  // the action
		wname    // the widget name
	)
{
	switch( action.reflect )
	{
		case 'CreateGeneric' :

			switch( action.itemType )
			{
				case 'Note' :

					return wname === 'CreateNote';

				case 'Label' :

					return wname === 'CreateLabel';

				case 'Portal' :

					return wname === 'CreatePortal';

				default :

					return false;
			}

/**/		if( CHECK )
/**/		{
/**/			throw new Error(
/**/				'invalid execution point reached'
/**/			);
/**/		}

			break;

		case 'CreateRelation' :

			return wname === 'CreateRelation';

		default :

			return false;
	}
};


} )( );
