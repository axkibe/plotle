/*
| The creation disc.
*/


var
	action_createGeneric,
	action_createRelation,
	disc_createDisc,
	disc_disc,
	euclid_display,
	jion,
	math_half,
	root,
	visual_label,
	visual_note,
	visual_portal;


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
	return{
		id : 'disc_createDisc',
		hasAbstract : true,
		attributes :
		{
			access :
			{
				comment : 'users access to current space',
				type : [ 'undefined', 'string' ]
			},
			action :
			{
				comment : 'currently active action',
				type :
					require( '../typemaps/action' )
					.concat( [ 'undefined' ] )
			},
			border :
			{
				comment : 'display border',
				type : require( '../typemaps/border' )
			},
			designFrame :
			{
				comment : 'designed frame (using anchors)',
				type : 'euclid_anchor_rect'
			},
			fill :
			{
				comment : 'display fill',
				type : require( '../typemaps/fill' )
			},
			hover :
			{
				comment : 'the widget hovered upon',
				type : [ 'undefined', 'jion$path' ],
				prepare : 'disc_disc.concernsHover( hover, path )'
			},
			mark :
			{
				comment : 'the users mark',
				type :
					require( '../typemaps/visualMark' )
					.concat( [ 'undefined' ] )
			},
			mode :
			{
				comment : 'current mode the UI is in',
				type : [ 'undefined', 'string' ]
			},
			path :
			{
				comment : 'path of the disc',
				type : 'jion$path'
			},
			shape :
			{
				comment : 'shape of the disc',
				type : 'euclid_anchor_ellipse'
			},
			spaceRef :
			{
				comment : 'reference to current space',
				type : [ 'undefined', 'fabric_spaceRef' ],
				assign : ''
			},
			user :
			{
				comment : 'currently logged in user',
				type : [ 'undefined', 'user_creds' ],
				assign : ''
			},
			view :
			{
				comment : 'the current view',
				type : [ 'undefined', 'euclid_view' ],
				prepare : 'view && view.sizeOnly'
			}
		},
		init : [ 'inherit', 'twigDup' ],
		twig : require( '../typemaps/formWidgets' )
	};
}


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


var
	prototype;

prototype = disc_createDisc.prototype;


/*
| Initializes the create disc.
*/
prototype._init =
	function(
		inherit,
		twigDup
	)
{
	var
		r,
		rZ,
		ranks,
		twig,
		wname;

	disc_disc._init.call( this, inherit );

	twig =
		twigDup
		? this._twig
		: jion.copy( this._twig );

	ranks = this._ranks;

	for( r = 0, rZ = ranks.length; r < rZ; r++ )
	{
		wname = ranks[ r ];

		twig[ wname ] =
			twig[ wname ].create(
				'path',
					 twig[ wname ].path
					 ? pass
					 : this.path.append( 'twig' ).append( wname ),
				'superFrame', this.frame.zeroPnw,
				'hover', this.hover,
				'down',
					disc_createDisc._isActiveButton( this.action, wname )
			);
	}

	if( FREEZE ) Object.freeze( twig );

	this._twig = twig;
};


/*
| The disc panel's display.
*/
jion.lazyValue(
	prototype,
	'_display',
	function( )
	{
		var
			display,
			r,
			rZ;

		display =
			euclid_display.create(
				'width', this.frame.width,
				'height', this.frame.height
			);

		display.fill( this.fill, this.silhoutte );

		for( r = 0, rZ = this.length; r < rZ; r++ )
		{
			this.atRank( r ).draw( display );
		}

		display.border( this.border, this.silhoutte );

		return display;
	}
);


/*
| A button of the main disc has been pushed.
*/
prototype.pushButton =
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
						'itemType', visual_label
					)
			);

			return;

		case 'createNote' :

			root.create(
				'action',
					action_createGeneric.create(
						'itemType', visual_note
					)
			);

			return;

		case 'createPortal' :

			root.create(
				'action',
					action_createGeneric.create(
						'itemType', visual_portal
					)
			);

			return;

		case 'createRelation' :

			root.create(
				'action',
					action_createRelation.create(
						'relationState', 'start'
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
prototype.draw =
	function(
		display
	)
{
	display.drawImage(
		'image', this._display,
		'x', 0,
		'y', math_half( this.view.height - this.frame.height )
	);
};


/*
| Returns true if point is on the disc panel.
*/
prototype.pointingHover =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		display,
		pp,
		r,
		reply,
		rZ;

	// shortcut if p is not near the panel
	if( !this.frame.within( p ) )
	{
		return;
	}

	display = this._display;

	pp = p.sub( this.frame.pnw );

	// FUTURE optimize by reusing the latest path of this._display
	if( !display.withinSketch( this.silhoutte, pp ) ) return;

	// it's on the disc
	for( r = 0, rZ = this.length; r < rZ; r++ )
	{
		reply = this.atRank( r ).pointingHover( pp, shift, ctrl );

		if( reply ) return reply;
	}
};


/*
| Checks if the user clicked something on the panel.
*/
prototype.click =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		display,
		pp,
		reply,
		r,
		rZ;

	// shortcut if p is not near the panel
	if( !this.frame.within( p ) )
	{
		return;
	}

	display = this._display,

	pp = p.sub( this.frame.pnw );

	// FUTURE optimize by reusing the latest path of this._display
	if( !display.withinSketch( this.silhoutte, pp ) ) return;

	// this is on the disc
	for( r = 0, rZ = this.length; r < rZ; r++ )
	{
		reply = this.atRank( r ).click( pp, shift, ctrl );

		if( reply ) return reply;
	}

	return false;
};


/*
| User is inputing text.
*/
prototype.input =
	function(
		// text
	)
{
	return;
};


/*
| Cycles the focus
*/
prototype.cycleFocus =
	function(
		// dir
	)
{
	throw new Error( );
};


/*
| User is pressing a special key.
*/
prototype.specialKey =
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
	if( !this.frame.within( p ) )
	{
		return;
	}

	if(
		!this._display.withinSketch(
			this.silhoutte,
			p.sub( this.frame.pnw )
		)
	)
	{
		return;
	}

	return true;
};


/*
| Mouse wheel.
*/
prototype.mousewheel =
	function(
		p
		// dir,
		// shift,
		// ctrl
	)
{
	// shortcut if p is not near the panel
	if( !this.frame.within( p ) )
	{
		return;
	}

	if(
		!this._display.withinSketch(
			this.silhoutte,
			p.sub( this.frame.pnw )
		)
	)
	{
		return;
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
	if( !action )
	{
		return false;
	}

	switch( action.reflect )
	{
		case 'action_createGeneric' :

			switch( action.itemType )
			{
				case visual_note   : return wname === 'createNote';

				case visual_label  : return wname === 'createLabel';

				case visual_portal : return wname === 'createPortal';

				default : return false;
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
