/*
| The creation disc.
*/


var
	actions_createGeneric,
	actions_createRelation,
	discs_createDisc,
	discs_disc,
	euclid_display,
	euclid_view,
	jion_path,
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
		id :
			'discs_createDisc',
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
							'Object',  // FUTURE 'actions_*',
						defaultValue :
							null
					},
				hover :
					{
						comment :
							'the widget hovered upon',
						type :
							'jion_path',
						defaultValue :
							null
					},
				mark :
					{
						comment :
							'the users mark',
						type :
							'Object', // FUTURE '->mark',
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
							'jion_path',
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
							'euclid_view',
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
			'discs_disc',
		init :
			[ 'inherit', 'twigDup' ],
		twig :
			'->formWidgets'
	};
}


/*
| Initializes the create disc.
*/
discs_createDisc.prototype._init =
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

	discs_disc._init.call( this, inherit );

	twig =
		twigDup
		? this.twig
		: jools.copy( this.twig );

	ranks = this.ranks;

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
				discs_createDisc._isActiveButton( this.action, wname );

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
| The disc panel's display.
*/
jools.lazyValue(
	discs_createDisc.prototype,
	'_display',
	function( )
	{
		var
			display;

		display =
			euclid_display.create(
				'width', this.style.width,
				'height', this.style.height
			);

		display.fill( this.style, this.silhoutte, euclid_view.proper );

		for(
			var r = 0, rZ = this.ranks.length;
			r < rZ;
			r++
		)
		{
			this.atRank( r ).draw( display );
		}

		display.edge( this.style, this.silhoutte, euclid_view.proper );

		return display;
	}
);


/*
| A button of the main disc has been pushed.
*/
discs_createDisc.prototype.pushButton =
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
				actions_createGeneric.create(
					'itemType', 'label',
					'model', null,
					'start', null,
					'transItem', null
				)
			);

			return;

		case 'createNote' :

			root.setAction(
				actions_createGeneric.create(
					'itemType', 'note',
					'model', null,
					'start', null,
					'transItem', null
				)
			);

			return;

		case 'createPortal' :

			root.setAction(
				actions_createGeneric.create(
					'itemType', 'portal',
					'model', null,
					'start', null,
					'transItem', null
				)
			);

			return;

		case 'createRelation' :

			root.setAction(
				actions_createRelation.create(
					'fromItemPath', jion_path.empty,
					'relationState', 'start',
					'toItemPath', jion_path.empty
				)
			);

			return;

		default :

			throw new Error( );
	}

};


/*
| Draws the disc panel.
*/
discs_createDisc.prototype.draw =
	function(
		display
	)
{
	display.drawImage(
		'image', this._display,
		'x', 0,
		'y', jools.half( this.view.height - this.style.height )
	);
};


/*
| Returns true if point is on the disc panel.
*/
discs_createDisc.prototype.pointingHover =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		display,
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

	display = this._display;

	pp = p.sub( this.frame.pnw );

	// FUTURE optimize by reusing the latest path of this._display
	if(
		!display.withinSketch( this.silhoutte, euclid_view.proper, pp )
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
			.pointingHover( pp, shift, ctrl );

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
discs_createDisc.prototype.click =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		display,
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

	display = this._display,

	pp = p.sub( this.frame.pnw );

	// FIXME Optimize by reusing the latest path of this._display
	if(
		!display.withinSketch(
			this.silhoutte,
			euclid_view.proper,
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
		reply =
			this.atRank( r )
			.click( pp, shift, ctrl );

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
discs_createDisc.prototype.input =
	function(
		// text
	)
{
	return;
};


/*
| Cycles the focus
*/
discs_createDisc.prototype.cycleFocus =
	function(
		// dir
	)
{
	throw new Error( );
};


/*
| User is pressing a special key.
*/
discs_createDisc.prototype.specialKey =
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
discs_createDisc.prototype.dragStart =
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
		!this._display.withinSketch(
			this.silhoutte,
			euclid_view.proper,
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
discs_createDisc._isActiveButton =
	function(
		action,  // the action
		wname    // the widget name
	)
{
	if( action === null )
	{
		return false;
	}

	switch( action.reflect )
	{
		case 'actions_createGeneric' :

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

		case 'actions_createRelation' :

			return wname === 'createRelation';

		default :

			return false;
	}
};


} )( );
