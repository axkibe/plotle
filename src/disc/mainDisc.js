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
			border :
			{
				comment : 'display border',
				type : require( '../typemaps/border' )
			},
			controlView :
			{
				comment : 'the current view of controls',
				type : [ 'undefined', 'euclid_view' ]
			},
			fill :
			{
				comment : 'display fill',
				type : require( '../typemaps/fill' )
			},
			designArea :
			{
				comment : 'designed aera (using anchors)',
				type : 'euclid_anchor_rect'
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
	disc_mainDisc,
	change_shrink,
	euclid_display,
	jion,
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
		area,
		r,
		rZ,
		text,
		twig,
		visible,
		wname;

	cv = this.controlView;

	area =
	this.area =
		this.designArea.compute( cv.baseArea, cv );

	this.silhoutte =
		this.shape.compute( area.zeroPnw, cv );

	twig = twigDup ? this._twig : jion.copy( this._twig );

	for( r = 0, rZ = this.length; r < rZ; r++ )
	{
		wname = this.getKey( r );

		text = pass;

		visible = pass;

		switch( wname )
		{
			case 'login' :

				visible = true;

				text =
					!this.user || this.user.isVisitor
					? 'log\nin'
					: 'log\nout';

				break;

			case 'remove' :

				visible =
					!!(
						this.access === 'rw'
						&& this.mark
						&& this.mark.itemPath
					);

				break;

			case 'create' :

				visible =
					this.access === 'rw'
					&& !!this.spaceRef;

				break;

			case 'signUp' :

				visible = this.user ? this.user.isVisitor : true;

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

				break;

			case 'user' :

				text = this.user ? this.user.name : '';

				visible = true;

				break;

			default :

				visible = true;

				break;
		}

		twig[ wname ] =
			twig[ wname ].create(
				'hover', this.hover,
				'down', this.mode === wname,
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
				'width', this.area.width,
				'height', this.area.height
			);

		display.fill( this.fill, this.silhoutte );

		for(
			r = 0, rZ = this.length;
			r < rZ;
			r++
		)
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
	var
		buttonName,
		discname,
		mip;

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

	if( buttonName === 'normal' )
	{
		root.showHome( );
	}
	else if( buttonName === 'remove' )
	{
		mip = this.mark.itemPath;

		root.alter(
			change_shrink.create(
				'path', mip.chop,
				'prev', root.spaceFabric.getPath( mip.chop ),
				'rank', root.spaceFabric.rankOf( mip.get( 2 ) )
			)
		);
	}
	else
	{
		root.create( 'mode', buttonName, 'action', undefined );
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
		'pnw', this.area.pnw
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

	return;
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
		reply,
		rZ;

	// shortcut if p is not near the panel
	if( !this.area.within( p ) ) return;

	display = this._display;

	pp = p.sub( this.area.pnw );

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


} )( );
