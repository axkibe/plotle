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
		r,
		rZ,
		twig,
		wname;

	twig = twigDup ? this._twig : jion.copy( this._twig );

	for( r = 0, rZ = this.length; r < rZ; r++ )
	{
		wname = this.getKey( r );

		twig[ wname ] =
			twig[ wname ].create(
				'path',
					 twig[ wname ].path
					 ? pass
					 : this.path.append( 'twig' ).append( wname ),
				'hover', this.hover,
				'down',
					disc_createDisc._isActiveButton( this.action, wname ),
				'transform', this.controlTransform
			);
	}

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
		pp,
		r,
		reply,
		rZ,
		tZone;

	tZone = this._tZone;

	// shortcut if p is not near the panel
	if( !tZone.within( p ) ) return;

	pp = p.sub( tZone.pnw );

	if( !this._tShape.within( pp ) ) return;

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
		pp,
		reply,
		r,
		rZ,
		tZone;

	tZone = this._tZone;

	// shortcut if p is not near the panel
	if( !tZone.within( p ) ) return;

	pp = p.sub( tZone.pnw );

	if( !this._tShape.within( pp ) ) return;

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
			'p', this._tZone.pos,
			'size', this._tZone.size.plusOne
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
		tZone;

	tZone = this._tZone;

	// shortcut if p is not near the panel
	if( !tZone.within( p ) ) return;

	if( !this._tShape.within( p.sub( tZone.pnw ) ) ) return;

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
		tZone;

	tZone = this._tZone;

	// shortcut if p is not near the panel
	if( !tZone.within( p ) ) return;

	if( !this._tShape.within( p.sub( tZone.pnw ) ) ) return;

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
		g,
		gLen,
		gRay,
		r,
		rZ,
		tZone;

	tZone = this._tZone;

	gRay =
		[
			gleam_glint_fill.create(
				'facet', this.facet,
				'shape', this._tShape
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
			'shape', this._tShape
		);

	return gleam_glint_ray.create( 'ray:init', gRay );
}
);


/*
| The disc's transformed zone.
*/
jion.lazyValue(
	prototype,
	'_tZone',
	function( )
{
	var
		ctz,
		size,
		vsr;

	ctz = this.controlTransform.zoom;

	size = this.size;

	vsr = this.viewSize.zeroRect;

	return(
		gleam_rect.create(
			'pos', vsr.pw.add( 0, -size.height * ctz / 2 ),
			'width', size.width * ctz + 1,
			'height', size.height * ctz + 1
		)
	);
}
);


/*
| The disc's transformed shape.
*/
jion.lazyValue(
	prototype,
	'_tShape',
	function( )
{
	return(
		this.shape
		.transform(
			gleam_transform.create(
				'offset', this.size.zeroRect.pw,
				'zoom', 1
			)
		)
		.transform( this.controlTransform )
	);
}
);


} )( );
