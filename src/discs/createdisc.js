/*
| The creation disc.
|
| Authors: Axel Kittenberger
*/

/*
| Export
*/
var
	discs;

discs = discs || { };


/*
| Imports
*/
var
	actions,
	euclid,
	jion,
	jools,
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
			'createDisc',
		unit :
			'discs',
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
							'Object',  // FUTURE 'actions.*',
						defaultValue :
							null
					},
				hover :
					{
						comment :
							'the widget hovered upon',
						type :
							'path',
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
							'path',
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
							'euclid.view',
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
			'discs.disc',
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
	createDisc;

createDisc = discs.createDisc;


/*
| Initializes the create disc.
*/
createDisc.prototype._init =
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

	discs.disc._init.call(
		this,
		inherit
	);

	twig =
		twigDup
			?  this.twig
			: jools.copy( this.twig );

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
				createDisc._isActiveButton(
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
jools.lazyValue(
	createDisc.prototype,
	'_fabric',
	function( )
	{
		var
			fabric;

		fabric =
			euclid.fabric.create(
				'width',
					this.style.width,
				'height',
					this.style.height
			);

		fabric.fill(
			this.style,
			this.silhoutte,
			'sketch',
			euclid.view.proper
		);

		for(
			var r = 0, rZ = this.ranks.length;
			r < rZ;
			r++
		)
		{
			this.atRank( r ).draw( fabric );
		}

		fabric.edge(
			this.style,
			this.silhoutte,
			'sketch',
			euclid.view.proper
		);

		return fabric;
	}
);


/*
| A button of the main disc has been pushed.
*/
createDisc.prototype.pushButton =
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
				actions.createGeneric.create(
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
				actions.createGeneric.create(
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
				actions.createGeneric.create(
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

		case 'createRelation' :

			shell.setAction(
				actions.createRelation.create(
					'fromItemPath',
						jion.path.empty,
					'relationState',
						'start',
					'toItemPath',
						jion.path.empty
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
createDisc.prototype.draw =
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
			jools.half(
				this.view.height - this.style.height
			)
	);
};


/*
| Returns true if point is on the disc panel.
*/
createDisc.prototype.pointingHover =
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
			euclid.view.proper,
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
createDisc.prototype.click =
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
			euclid.view.proper,
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
createDisc.prototype.input =
	function(
		// text
	)
{
	return;
};


/*
| Cycles the focus
*/
createDisc.prototype.cycleFocus =
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
createDisc.prototype.specialKey =
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
createDisc.prototype.dragStart =
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
			euclid.view.proper,
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
createDisc._isActiveButton =
	function(
		action,  // the action
		wname    // the widget name
	)
{
	switch( action.reflex )
	{
		case 'actions.createGeneric' :

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

		case 'actions.createRelation' :

			return wname === 'createRelation';

		default :

			return false;
	}
};


} )( );
