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
	root;


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
							'jion.path',
						defaultValue :
							null
					},
				mark :
					{
						comment :
							'the users mark',
						type :
							'Object', // FUTURE 'marks.*',
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
							'jion.path',
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
			'->form-widgets'
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
				.append( 'twig' )
				.append( wname );
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
/**/	if( path.get( 2 ) !== this.reflectName )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	var
		buttonName =
			path.get( 4 );

	switch( buttonName )
	{
		case 'createLabel' :

			root.setAction(
				actions.createGeneric.create(
					'itemType',
						'label',
					'model',
						null,
					'start',
						null,
					'transItem',
						null
				)
			);

			return;

		case 'createNote' :

			root.setAction(
				actions.createGeneric.create(
					'itemType',
						'note',
					'model',
						null,
					'start',
						null,
					'transItem',
						null
				)
			);

			return;

		case 'createPortal' :

			root.setAction(
				actions.createGeneric.create(
					'itemType',
						'portal',
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

			root.setAction(
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
	var
		fabric,
		pp,
		reply;

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

	fabric = this._fabric;

	pp = p.sub( this.frame.pnw );

	// FUTURE optimize by reusing the latest path of this.$fabric
	if(
		!fabric.withinSketch(
			this.silhoutte,
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
	var
		fabric,
		pp;

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

	fabric = this._fabric,

	pp = p.sub( this.frame.pnw );

	// FIXME Optimize by reusing the latest path of this.$fabric
	if(
		!fabric.withinSketch(
			this.silhoutte,
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
	switch( action.reflect )
	{
		case 'actions.createGeneric' :

			switch( action.itemType )
			{
				case 'note' :

					return wname === 'createNote';

				case 'label' :

					return wname === 'createLabel';

				case 'portal' :

					return wname === 'createPortal';

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
