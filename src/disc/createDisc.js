/*
| The creation disc.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
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
			controlTransform :
			{
				comment : 'the current transform of controls',
				type : 'euclid_transform'
			},
			designArea :
			{
				comment : 'designed area (using anchors)',
				type : 'euclid_anchor_rect'
			},
			facet :
			{
				comment : 'facet of the disc',
				type : 'gleam_facet'
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
			viewSize :
			{
				comment : 'current view size',
				type : 'euclid_size'
			}
		},
		init : [ 'inherit', 'twigDup' ],
		twig : require( '../typemaps/formWidgets' )
	};
}


var
	action_createGeneric,
	action_createRelation,
	disc_createDisc,
	gleam_glint_border,
	gleam_glint_fill,
	gleam_glint_twig,
	gleam_glint_window,
	jion,
	root,
	visual_label,
	visual_note,
	visual_portal;


/*
| Capsule
*/
( function( ) {
'use strict';


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
		ct,
		area,
		r,
		ranks,
		rZ,
		twig,
		wname;

	ct = this.controlTransform;

	area =
	this._area =
		this.designArea.compute( this.viewSize.zeroPnwRect.detransform( ct ) )
		.transform( ct )
		.align;

	this.silhoutte =
		this.shape.compute(
			area.zeroPnw.detransform( ct )
		).transform( ct );

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
				'superArea', area.zeroPnw,
				'hover', this.hover,
				'down',
					disc_createDisc._isActiveButton( this.action, wname ),
				'transform', ct
			);
	}

	if( FREEZE ) Object.freeze( twig );

	this._twig = twig;
};



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
		area,
		display,
		pp,
		r,
		reply,
		rZ;

	area = this._area;

	// shortcut if p is not near the panel
	if( !area.within( p ) ) return;

	display = this._display;

	pp = p.sub( area.pnw );

	if( !this.silhoutte.within( pp ) ) return;

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
		area,
		display,
		pp,
		reply,
		r,
		rZ;

	area = this._area;

	// shortcut if p is not near the panel
	if( !area.within( p ) ) return;

	display = this._display,

	pp = p.sub( area.pnw );

	if( !this.silhoutte.within( pp ) ) return;

	// this is on the disc
	for( r = 0, rZ = this.length; r < rZ; r++ )
	{
		reply = this.atRank( r ).click( pp, shift, ctrl );

		if( reply ) return reply;
	}

	return false;
};


/*
| The discs glint.
*/
jion.lazyValue(
	prototype,
	'glint',
	function( )
{
	// FUTURE GLINT inherit
	return(
		gleam_glint_window.create(
			'glint', this._glint,
			'p', this._area.pnw,
			'size', this._area.size
		)
	);
}
);


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
prototype.dragStart =
	function(
		p
		// shift,
		// ctrl
	)
{
	var
		area;

	area = this._area;

	// shortcut if p is not near the panel
	if( !area.within( p ) ) return;

	if(
		!this.silhoutte.within(
			p.sub( area.pnw )
		)
	)
	{
		return;
	}

	// the dragging operation is on the panel
	// but it denies it.
	return false;
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
	var
		area;

	area = this._area;

	// shortcut if p is not near the panel
	if( !area.within( p ) ) return;

	if(
		!this.silhoutte.within(
			p.sub( area.pnw )
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


/*
| The disc's inner glint.
*/
jion.lazyValue(
	prototype,
	'_glint',
	function( )
{
	var
		area,
		g,
		glint,
		r,
		rZ;

	area = this._area,

	// XRX

	glint =
		gleam_glint_twig.create(
			'ray:append',
				gleam_glint_fill.create(
					'facet', this.facet,
					'shape', this.silhoutte
				)
		);

	for( r = 0, rZ = this.length; r < rZ; r++ )
	{
		g = this.atRank( r ).glint;

		if( g )
		{
			glint = glint.create( 'ray:append', g );
		}
	}

	glint =
		glint.create(
			'ray:append',
				gleam_glint_border.create(
					'facet', this.facet,
					'shape', this.silhoutte
				)
		);

	return glint;
}
);


} )( );
