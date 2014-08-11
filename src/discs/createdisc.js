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
	Jion,
	Jools,
	shell;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
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
						defaultValue :
							null
					},
				action :
					{
						comment :
							'currently active action',
						type :
							'Action',
						defaultValue :
							null
					},
				hover :
					{
						comment :
							'the widget hovered upon',
						type :
							'Path',
						defaultValue :
							null
					},
				mark :
					{
						comment :
							'the users mark',
						type :
							'Mark',
						defaultValue :
							null
					},
				mode :
					{
						comment :
							'current mode the UI is in',
						type :
							'String',
						defaultValue :
							null
					},
				path :
					{
						comment :
							'path of the disc',
						type :
							'Path',
						defaultValue :
							undefined
					},
				spaceUser :
					{
						comment :
							'owner of currently loaded space',
						type :
							'String',
						defaultValue :
							null,
						assign :
							null
					},
				spaceTag :
					{
						comment :
							'name of currently loaded space',
						type :
							'String',
						defaultValue :
							null,
						assign :
							null
					},
				username :
					{
						comment :
							'currently logged in user',
						type :
							'String',
						defaultValue :
							null,
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
						defaultValue :
							null
					}
			},
		subclass :
			'Discs.Disc',
		init :
			[
				'inherit',
				'twigDup'
			],
		twig :
			'form-widgets'
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
		inherit,
		twigDup
	)
{
	var
		twig,
		ranks;

	if( !this.path )
	{
		return;
	}

	Discs.Disc._init.call(
		this,
		inherit
	);

	twig =
		twigDup
			?  this.twig
			: Jools.copy( this.twig );

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
			path,
			focusAccent =
				CreateDisc._isActiveButton(
					this.action,
					wname
				);

		if( twig[ wname ].path )
		{
			path =
				undefined;
		}
		else
		{
			path =
				this.path
				.Append( 'twig' )
				.Append( wname );
		}

		twig[ wname ] =
			twig[ wname ].create(
				'path',
					path,
				'superFrame',
					this.frame.zeropnw,
				'hover',
					this.hover,
				'focusAccent',
					focusAccent
			);
	}

	this.twig =
		twig;
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

		for(
			var r = 0, rZ = this.ranks.length;
			r < rZ;
			r++
		)
		{
			this.atRank( r )
				.draw( fabric );
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
/**/	if( path.get( 2 ) !== this.reflexName )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	var
		buttonName =
			path.get( 4 );

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
						Jion.Path.empty,
					'relationState',
						'start',
					'toItemPath',
						Jion.Path.empty
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

	// FUTURE optimize by reusing the latest path of this.$fabric
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
	for(
		var r = 0, rZ = this.ranks.length;
		r < rZ;
		r++
	)
	{
		var
			reply =
				this.atRank( r )
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
	for(
		var r = 0, rZ = this.ranks.length;
		r < rZ;
		r++
	)
	{
		var
			reply =
				this.atRank( r )
					.click(
						pp,
						shift,
						ctrl
					);

		if( reply )
		{
			return reply;
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
| Start of a dragging operation.
*/
CreateDisc.prototype.dragStart =
	function(
		p
		// shift,
		// ctrl
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

	if(
		!this._fabric.withinSketch(
			this.silhoutte,
			'sketch',
			Euclid.View.proper,
			p.sub( this.frame.pnw )
		)
	)
	{
		return null;
	}

	return true;
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
	switch( action.reflex )
	{
		case 'action.createGeneric' :

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

		case 'action.createRelation' :

			return wname === 'CreateRelation';

		default :

			return false;
	}
};


} )( );
