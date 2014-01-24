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
	shell,
	Widgets;


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
							'String'
					},

				action :
					{
						comment :
							'currently active action',

						type :
							'Action'
					},

				hover :
					{
						comment :
							'the widget hovered upon',

						type :
							'Path'
					},

				mark :
					{
						comment :
							'the users mark',

						type :
							'Mark'
					},

				mode :
					{
						comment :
							'current mode the UI is in',

						type :
							'String'
					},

				path :
					{
						comment :
							'path of the disc',

						type :
							'Path'
					},

				screensize :
					{
						comment :
							'the current screensize',

						type :
							'Point'
					},

				spaceUser :
					{
						comment :
							'owner of currently loaded space',

						type :
							'String',

						allowNull :
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

						allowNull :
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

						allowNull :
							true,

						assign :
							null
					}
			},

		subclass :
			'Discs.Disc',

		init :
			[
				'inherit'
			]
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
	Discs.Disc._init.call(
		this,
		inherit
	);

	var
		buttons =
			{ },

		twig =
			this._tree.twig,

		ranks =
			this._tree.ranks;

	for(
		var r = 0, rZ = ranks.length;
		r < rZ;
		r++
	)
	{
		var
			wname =
				ranks[ r ],

			tree =
				twig[ wname ],

			path =
				this.path.append( wname ),

			focusAccent =
				CreateDisc._isActiveButton(
					this.action,
					wname
				);

		switch( tree.twig.type )
		{
			case 'ButtonWidget' :

				buttons[ wname ] =
					Widgets.Button.create(
						'path',
							path,
						'superFrame',
							this.frame.zeropnw,
						'inherit',
							inherit && inherit.buttons[ wname ],
						'hoverAccent',
							path.equals( this.hover ),
						'focusAccent',
							focusAccent,
						'tree',
							tree,
						'icons',
							this._icons
					);

					break;

			default :

				throw new Error(
					'Cannot create widget of type: ' +
						tree.twig.type
				);
		}
	}

	this.buttons =
		buttons;
};


/*
| Prepares the disc panels contents.
|
| TODO make _fabric
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
			this.buttons;

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
};


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
			this._weave( ),

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
| Returns true if point is on this panel.
*/
CreateDisc.prototype.pointingStart =
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
			this._weave( ),

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
