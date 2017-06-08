/*
| The disc panel.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'disc_mainDisc',
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
			show :
			{
				comment : 'currently form/disc shown',
				type : require ( '../show/typemap' )
			},
			size :
			{
				comment : 'designed size',
				type : 'gleam_size'
			},
			spaceRef :
			{
				comment : 'reference to current space',
				type : [ 'undefined', 'fabric_spaceRef' ]
			},
			user :
			{
				comment : 'currently logged in user',
				type : [ 'undefined', 'user_creds' ]
			},
			viewSize :
			{
				comment : 'current view size',
				type : 'gleam_size'
			}
		},
		init : [ 'inherit', 'twigDup' ],
		twig :
		[
			'widget_button',
			'widget_checkbox',
			'widget_input',
			'widget_label'
		]
	};
}


var
	action_select,
	disc_mainDisc,
	change_shrink,
	gleam_glint_border,
	gleam_glint_fill,
	gleam_glint_ray,
	gleam_glint_window,
	gleam_rect,
	gleam_transform,
	jion,
	result_hover,
	root,
	show_create,
	show_form,
	show_normal,
	show_zoom;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	prototype;


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


prototype = disc_mainDisc. prototype;


/*
| Initializes the main disc.
*/
prototype._init =
	function(
		inherit,
		twigDup
	)
{
	var
		action,
		down,
		r,
		rZ,
		show,
		text,
		twig,
		visible,
		wname;

	twig = twigDup ? this._twig : jion.copy( this._twig );

	action = this.action;

	show = this.show;

	for( r = 0, rZ = this.length; r < rZ; r++ )
	{
		wname = this.getKey( r );

		text = pass;

		visible = pass;

		switch( wname )
		{
			case 'create' :

				visible = this.access === 'rw' && this.spaceRef !== undefined;

				down = show.reflect === 'show_create';

				break;

			case 'login' :

				visible = true;

				text =
					!this.user || this.user.isVisitor
					? 'log\nin'
					: 'log\nout';

				down =
					show.reflect === 'show_form'
					&& show.formName === 'login';

				break;

			case 'moveTo' :

				visible = true;

				down =
					show.reflect === 'show_form'
					&& show.formName === 'moveTo';

				break;

			case 'normal' :

				visible = this.spaceRef !== undefined;

				if( show.reflect !== 'show_normal' )
				{
					down = false;
				}
				else
				{
					down =
						action
						? action.normalButtonDown
						: true;
				}

				break;

			case 'remove' :

				visible =
					!!(
						this.access === 'rw'
						&& this.mark
						&& this.mark.itemPaths
					);

				down = false;

				break;

			case 'select' :

				visible =
					this.spaceRef !== undefined
					&& this.access === 'rw';

				down = action && action.reflect === 'action_select';

				break;

			case 'signUp' :

				visible = this.user ? this.user.isVisitor : true;

				down =
					show.reflect === 'show_form'
					&& show.formName === 'signUp';

				break;

			case 'space' :

				if( this.spaceRef )
				{
					text = this.spaceRef.fullname;

					visible = true;
				}
				else
				{
					visible = false;
				}

				down =
					show.reflect === 'show_form'
					&& show.formName === 'space';

				break;

			case 'user' :

				text = this.user ? this.user.name : '';

				visible = true;

				down =
					show.reflect === 'show_form'
					&& show.formName === 'user';

				break;

			case 'zoom' :

				visible = this.spaceRef !== undefined;

				down = show.reflect === 'show_zoom';

				break;

			default :

				visible = true;

				down = false;

				break;
		}

		twig[ wname ] =
			twig[ wname ].create(
				'hover', this.hover,
				'down', down,
				'path',
					twig[ wname ].path
					? pass
					: this.path.append( 'twig' ).append( wname ),
				'text', text,
				'visible', visible,
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
	var
		buttonName,
		changes,
		discname,
		p,
		paths,
		pi,
		pZ,
		rank,
		ranks,
		rc,
		r,
		rZ;        // rank correction

	discname = path.get( 2 );

/**/if( CHECK )
/**/{
/**/	if( discname !== this.reflectName ) throw new Error( );
/**/}

	buttonName = path.get( 4 );

	if(
		buttonName === 'login'
		&& this.user && !this.user.isVisitor
	)
	{
		root.logout( );

		return;
	}

	switch( buttonName )
	{
		case 'normal' :

			root.showHome( );

			break;

		case 'remove' :

			paths = this.mark.itemPaths;

			changes = [ ];

			ranks = [ ];

			for( p = 0, pZ = paths.length; p < pZ; p++ )
			{
				pi = paths.get( p );

				rank = root.spaceFabric.rankOf( pi.get( 2 ) );

				rc = 0;

				for( r = 0, rZ = ranks.length; r < rZ; r++ )
				{
					if( ranks[ r ] <= rank ) rc++;
				}

				ranks.push( rank );

				changes[ p ] =
					change_shrink.create(
						'path', pi.chop,
						'prev', root.spaceFabric.getPath( pi.chop ),
						'rank', rank - rc
					);

			}

			root.alter( changes );

			break;

		case 'select' :

			root.create(
				'action', action_select.create( ),
				'show', show_normal.create( )
			);

			break;

		case 'create' :

			root.create(
				'action', undefined,
				'show', show_create.create( )
			);

			break;

		case 'login' :
		case 'moveTo' :
		case 'signUp' :
		case 'space' :
		case 'user' :

			root.create( 'show', show_form[ buttonName ] );

			break;

		case 'zoom' :

			root.create( 'show', show_zoom.create( ) );

			break;

		default : throw new Error( );
	}
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
			'rect', this.tZone.enlarge1
		)
	);
}
);


/*
| Checks if the user clicked something on the panel
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
		r,
		rZ;

	// shortcut if p is not near the panel
	if( !this.tZone.within( p ) ) return;

	display = this._display;

	pp = p.sub( this.tZone.pos );

	if( !this._tShape.within( pp ) ) return;

	// this is on the disc
	for( r = 0, rZ = this.length; r < rZ; r++ )
	{
		this.atRank( r ).click( pp, shift, ctrl );
	}

	return true;
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
	// shortcut if p is not near the panel
	if( !this.tZone.within( p ) ) return;

	if(
		!this._tShape.within(
			p.sub( this.tZone.pos )
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
| Move during a dragging operation.
*/
prototype.dragMove =
	function(
		// p,
		// shift,
		// ctrl
	)
{
	return;
};


/*
| Stop of a dragging operation.
*/
prototype.dragStop =
	function(
		// p,
		// shift,
		// ctrl
	)
{
	return;
};



/*
| User is inputing text.
*/
prototype.input =
	function(
		// text
	)
{
	// nothing
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
	if( !this.tZone.within( p ) ) return;

	if(
		!this._tShape.within(
			p.sub( this.tZone.pos )
		)
	)
	{
		return;
	}

	return true;
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
		bubble,
		pp,
		r,
		rZ;

	// shortcut if p is not near the panel
	if( !this.tZone.within( p ) ) return;

	pp = p.sub( this.tZone.pos );

	if( !this._tShape.within( pp ) ) return;

	// this is on the disc
	for( r = 0, rZ = this.length; r < rZ; r++ )
	{
		bubble =
			this.atRank( r )
			.pointingHover( pp, shift, ctrl );

		if( bubble ) return bubble;
	}

	return result_hover.create( 'cursor', 'default' );
};


/*
| The pointing device just went down.
| Probes if the system ought to wait if it's
| a click or can initiate a drag right away.
*/
prototype.probeClickDrag =
	function(
		p
		// shift,
		// ctrl
	)
{
	// shortcut if p is not near the panel
	if( !this.tZone.within( p ) ) return;

	if( !this._tShape.within( p.sub( this.tZone.pos ) ) ) return;

	return 'atween';
};


/*
| User is pressing a special key.
*/
prototype.specialKey =
	function(
		// key,
		// shift,
		// ctrl
	)
{
	// nothing
};


/*
| Returns the panel's inner glint.
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
		rZ;

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
	'tZone',
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
			'width', size.width * ctz,
			'height', size.height * ctz
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
