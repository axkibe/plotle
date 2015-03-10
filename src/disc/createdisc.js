/*
| The creation disc.
*/


var
	action_createGeneric,
	action_createRelation,
	disc_createDisc,
	disc_disc,
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
			'disc_createDisc',
		attributes :
			{
				access :
					{
						comment :
							'users access to current space',
						type :
							'string',
						defaultValue :
							'null'
					},
				action :
					{
						comment :
							'currently active action',
						type :
							'->action',
						defaultValue :
							'null'
					},
				hover :
					{
						comment :
							'the widget hovered upon',
						type :
							'jion_path',
						defaultValue :
							'null'
					},
				mark :
					{
						comment :
							'the users mark',
						type :
							'->mark',
						defaultValue :
							'null'
					},
				mode :
					{
						comment :
							'current mode the UI is in',
						type :
							'string',
						defaultValue :
							'null'
					},
				path :
					{
						comment :
							'path of the disc',
						type :
							'jion_path',
						defaultValue :
							'undefined'
					},
				spaceRef :
					{
						comment :
							'reference to current space',
						type :
							'fabric_spaceRef',
						defaultValue :
							'null',
						assign :
							null
					},
				username :
					{
						comment :
							'currently logged in user',
						type :
							'string',
						defaultValue :
							'null',
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
							'null'
					}
			},
		init :
			[ 'inherit', 'twigDup' ],
		twig :
			'->formWidgets'
	};
}


/*
| Initializes the create disc.
*/
disc_createDisc.prototype._init =
	function(
		inherit,
		twigDup
	)
{
	var
		focusAccent,
		path,
		ranks,
		twig,
		wname;

	if( !this.path )
	{
		return;
	}

	disc_disc._init.call( this, inherit );

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
		wname = ranks[ r ];

		focusAccent = disc_createDisc._isActiveButton( this.action, wname );

		if( twig[ wname ].path )
		{
			path = undefined;
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
				'path', path,
				'superFrame', this.frame.zeropnw,
				'hover', this.hover,
				'focusAccent', focusAccent
			);
	}

	this.twig = twig;

/**/if( FREEZE )
/**/{
/**/	Object.freeze( twig );
/**/}
};


/*
| The disc panel's display.
*/
jools.lazyValue(
	disc_createDisc.prototype,
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

		display.border( this.style, this.silhoutte, euclid_view.proper );

		return display;
	}
);


/*
| A button of the main disc has been pushed.
*/
disc_createDisc.prototype.pushButton =
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

			root.create(
				'action',
					action_createGeneric.create(
						'itemType', 'label',
						'model', null,
						'start', null,
						'transItem', null
					)
			);

			return;

		case 'createNote' :

			root.create(
				'action',
					action_createGeneric.create(
						'itemType', 'note',
						'model', null,
						'start', null,
						'transItem', null
					)
			);

			return;

		case 'createPortal' :

			root.create(
				'action',
					action_createGeneric.create(
						'itemType', 'portal',
						'model', null,
						'start', null,
						'transItem', null
					)
			);

			return;

		case 'createRelation' :

			root.create(
				'action',
					action_createRelation.create(
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
disc_createDisc.prototype.draw =
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
disc_createDisc.prototype.pointingHover =
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
	if( !this.frame.within( null, p ) )
	{
		return null;
	}

	display = this._display;

	pp = p.sub( this.frame.pnw );

	// FUTURE optimize by reusing the latest path of this._display
	if( !display.withinSketch( this.silhoutte, euclid_view.proper, pp ) )
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
disc_createDisc.prototype.click =
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

	// FUTURE optimize by reusing the latest path of this._display
	if( !display.withinSketch( this.silhoutte, euclid_view.proper, pp ) )
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
disc_createDisc.prototype.input =
	function(
		// text
	)
{
	return;
};


/*
| Cycles the focus
*/
disc_createDisc.prototype.cycleFocus =
	function(
		// dir
	)
{
	throw new Error( );
};


/*
| User is pressing a special key.
*/
disc_createDisc.prototype.specialKey =
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
disc_createDisc.prototype.dragStart =
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
disc_createDisc._isActiveButton =
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
		case 'action_createGeneric' :

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

		case 'action_createRelation' :

			return wname === 'createRelation';

		default :

			return false;
	}
};


} )( );
