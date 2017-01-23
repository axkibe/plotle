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
					require( '../action/typemap' )
					.concat( [ 'undefined' ] )
			},
			controlTransform :
			{
				comment : 'the current transform of controls',
				type : 'gleam_transform'
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
					require( '../visual/mark/typemap' )
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
				type : 'gleam_ellipse'
			},
			size :
			{
				comment : 'designed size',
				type : 'gleam_size'
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
				type : 'gleam_size'
			}
		},
		init : [ 'inherit', 'twigDup' ],
		twig : require( '../form/typemap-widget' )
	};
}


var
	action_createGeneric,
	action_createRelation,
	disc_createDisc,
	gleam_glint_border,
	gleam_glint_fill,
	gleam_glint_ray,
	gleam_glint_window,
	gleam_rect,
	gleam_transform,
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
		size,
		twig,
		vsr,
		wt,
		wname;

	ct = this.controlTransform;

	vsr = this.viewSize.zeroPnwRect;

	size = this.size;

	wt =
		gleam_transform.create(
			'offset', size.zeroPnwRect.pw,
			'zoom', 1
		);

	area =
	this._area =
		gleam_rect.create(
			'pnw',
				vsr.pw.add(
					0,
					-size.height * ct.zoom / 2
				),
			'pse',
				vsr.pw.add(
					size.width * ct.zoom,
					size.height * ct.zoom / 2
				)
		)
		.align;

	this.silhoutte =
		this.shape
		.transform( wt )
		.transform( ct );

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
		pp,
		r,
		reply,
		rZ;

	area = this._area;

	// shortcut if p is not near the panel
	if( !area.within( p ) ) return;

	pp = p.sub( area.pnw );

	if( !this._glintFillSilhoutte.within( pp ) ) return;

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
		pp,
		reply,
		r,
		rZ;

	area = this._area;

	// shortcut if p is not near the panel
	if( !area.within( p ) ) return;

	pp = p.sub( area.pnw );

	if( !this._glintFillSilhoutte.within( pp ) ) return;

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
		!this._glintFillSilhoutte.within(
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
		!this._glintFillSilhoutte.within(
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
		gLen,
		gRay,
		r,
		rZ;

	area = this._area;

	gRay =
		[
			gleam_glint_fill.create(
				'facet', this.facet,
				'shape', this.silhoutte
			)
		];

	gLen = 1;

	for( r = 0, rZ = this.length; r < rZ; r++ )
	{
		g = this.atRank( r ).glint;

		if( g ) gRay[ gLen++ ] = g;
	}

	gRay[ gLen++ ] =
		gleam_glint_border.create(
			'facet', this.facet,
			'shape', this.silhoutte
		);

	return gleam_glint_ray.create( 'ray:init', gRay );
}
);


/*
| The silhoutte fill.
*/
jion.lazyValue(
	prototype,
	'_glintFillSilhoutte',
	function( )
{
	return(
		gleam_glint_fill.create(
			'facet', this.facet,
			'shape', this.silhoutte
		)
	);
}
);


} )( );
