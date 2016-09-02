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
					require( '../typemaps/action' )
					.concat( [ 'undefined' ] )
			},
			controlView :
			{
				comment : 'the current view of controls',
				type : [ 'undefined', 'euclid_view' ]
			},
			designArea :
			{
				comment : 'designed aera (using anchors)',
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
				type : [ 'undefined', 'fabric_spaceRef' ]
			},
			spaceView :
			{
				comment : 'the current view for space',
				type : [ 'undefined', 'euclid_view' ],
				prepare : 'spaceView && spaceView.sizeOnly'
			},
			user :
			{
				comment : 'currently logged in user',
				type : [ 'undefined', 'user_creds' ]
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
	action_create,
	action_form,
	action_select,
	disc_mainDisc,
	change_shrink,
	gleam_display_canvas,
	gleam_glint_border,
	gleam_glint_fill,
	gleam_glint_twig,
	gleam_glint_disWindow,
	jion,
	result_hover,
	root;

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
		cv,
		action,
		area,
		down,
		r,
		rZ,
		text,
		twig,
		visible,
		wname;

	cv = this.controlView;

	// FIXME XXX remove
	area =
	this.area =
		this.designArea.compute( cv ).align;

	// FIXME XXX remove
	this.silhoutte =
		this.shape.compute(
			cv.create(
				'height', this.area.height,
				'width', this.area.width
			)
		);

	twig = twigDup ? this._twig : jion.copy( this._twig );

	action = this.action;

	for( r = 0, rZ = this.length; r < rZ; r++ )
	{
		wname = this.getKey( r );

		text = pass;

		visible = pass;

		switch( wname )
		{
			case 'create' :

				visible = this.access === 'rw' && this.spaceRef !== undefined;

				down = action && action.isCreate;

				break;

			case 'login' :

				visible = true;

				text =
					!this.user || this.user.isVisitor
					? 'log\nin'
					: 'log\nout';

				down =
					action
					&& action.reflect === 'action_form'
					&& action.formName === 'login';

				break;

			case 'moveTo' :

				visible = true;

				down =
					action
					&& action.reflect === 'action_form'
					&& action.formName === 'moveTo';

				break;

			case 'normal' :

				visible = this.spaceRef !== undefined;

				down = action === undefined || action.isHand;

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

				visible = this.spaceRef !== undefined;

				down = action && action.reflect === 'action_select';

				break;

			case 'signUp' :

				visible = this.user ? this.user.isVisitor : true;

				down =
					action
					&& action.reflect === 'action_form'
					&& action.formName === 'signUp';

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
					action
					&& action.reflect === 'action_form'
					&& action.formName === 'space';

				break;

			case 'user' :

				text = this.user ? this.user.name : '';

				visible = true;

				down =
					action
					&& action.reflect === 'action_form'
					&& action.formName === 'user';

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
				'superArea', this.area.zeroPnw,
				'text', text,
				'visible', visible,
				'view', cv
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
/**/	if( discname !== this.reflectName )
/**/	{
/**/		throw new Error( );
/**/	}
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

			root.create( 'action', action_select.create( ) );

			break;

		case 'create' :

			root.create( 'action', action_create.create( ) );

			break;

		case 'login' :
		case 'moveTo' :
		case 'signUp' :
		case 'space' :
		case 'user' :

			root.create( 'action', action_form[ buttonName ] );

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
		gleam_glint_disWindow.create(
			'display', this._display,
			'key', 'mainDisc',
			'p', this.designArea.pnw
		)
	);
}
);


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
		rZ;

	// shortcut if p is not near the panel
	if( !this.area.within( p ) ) return;

	pp = p.sub( this.area.pnw );

	if( !this._display.withinSketch( this.silhoutte, pp ) ) return;

	// this is on the disc
	for( r = 0, rZ = this.length; r < rZ; r++ )
	{
		reply =
			this.atRank( r )
			.pointingHover( pp, shift, ctrl );

		if( reply )
		{
			return reply;
		}
	}

	return result_hover.create( 'cursor', 'default' );
};


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
	if( !this.area.within( p ) ) return;

	display = this._display;

	pp = p.sub( this.area.pnw );

	if( !display.withinSketch( this.silhoutte, pp ) ) return;

	// this is on the disc
	for( r = 0, rZ = this.length; r < rZ; r++ )
	{
		this.atRank( r ).click( pp, shift, ctrl );
	}

	return true;
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
	if( !this.area.within( p ) ) return;

	if(
		!this._display.withinSketch(
			this.silhoutte,
			p.sub( this.area.pnw )
		)
	)
	{
		return;
	}

	return true;
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
	if( !this.area.within( p ) ) return;

	if(
		!this._display.withinSketch(
			this.silhoutte,
			p.sub( this.area.pnw )
		)
	)
	{
		return;
	}

	return true;
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
		g,
		glint,
		r,
		rZ,
		view;

	view =
		this.controlView.create(
			'height', this.area.height,
			'width', this.area.width
		);

	glint =
		gleam_glint_twig.create(
			'key', 'root',
			'twine:set+',
				gleam_glint_fill.create(
					'facet', this.facet,
					'key', ':fill',
					'shape', this.shape
				)
		);

	for( r = 0, rZ = this.length; r < rZ; r++ )
	{
		g = this.atRank( r ).glint;

		if( g )
		{
			glint = glint.create( 'twine:set+', g );
		}
	}

	glint =
		glint.create(
			'twine:set+',
				gleam_glint_border.create(
					'facet', this.facet,
					'key', ':border',
					'shape', this.shape
				)
		);

	return(
		gleam_display_canvas.create(
			'glint', glint,
			'view', view
		)
	);
}
);


} )( );
