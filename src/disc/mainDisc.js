/*
| The disc panel.
*/


/*
| Export
*/
var
	disc_disc,
	disc_mainDisc,
	change_shrink,
	euclid_display,
	euclid_view,
	jion,
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
	return{
		id : 'disc_mainDisc',
		hasAbstract : true,
		attributes :
		{
			access :
			{
				comment : 'users access to current space',
				type : 'string',
				defaultValue : 'undefined'
			},
			action :
			{
				comment : 'currently active action',
				type : require( '../typemaps/action' ),
				defaultValue : 'undefined'
			},
			border :
			{
				comment : 'display border',
				type : require( '../typemaps/border' )
			},
			fill :
			{
				comment : 'display fill',
				type : require( '../typemaps/fill' )
			},
			hover :
			{
				comment : 'the widget hovered upon',
				type : 'jion$path',
				defaultValue : 'undefined',
				prepare : 'disc_disc.concernsHover( hover, path )'
			},
			mark :
			{
				comment : 'the users mark',
				type : require( '../typemaps/mark' ),
				defaultValue : 'undefined'
			},
			mode :
			{
				comment : 'current mode the UI is in',
				type : 'string',
				defaultValue : 'undefined'
			},
			path :
			{
				comment : 'path of the disc',
				type : 'jion$path',
				defaultValue : 'undefined'
			},
			spaceRef :
			{
				comment : 'reference to current space',
				type : 'fabric_spaceRef',
				defaultValue : 'undefined'
			},
			user :
			{
				comment : 'currently logged in user',
				type : 'user_creds',
				defaultValue : 'undefined'
			},
			view :
			{
				comment : 'the current view',
				type : 'euclid_view',
				// prepare : 'view && view.sizeOnly', FIXME
				prepare : 'view ? view.sizeOnly : undefined',
				defaultValue : 'undefined'
			}
		},
		init :
			[ 'inherit', 'twigDup' ],
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
		r,
		rZ,
		text,
		twig,
		visible,
		wname;

	// FUTURE remove
	if( !this.path ) return;

	disc_disc._init.call( this, inherit );

	twig = twigDup ? this._twig : jion.copy( this._twig );

	for(
		r = 0, rZ = this.length;
		r < rZ;
		r++
	)
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
				'superFrame', this.frame.zeropnw,
				'text', text,
				'visible', visible
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
			// FIXME remove style
			euclid_display.create(
				'width', this.style.width,
				'height', this.style.height
			);

		display.fill( this.fill, this.silhoutte, euclid_view.proper );

		for(
			r = 0, rZ = this.length;
			r < rZ;
			r++
		)
		{
			this.atRank( r ).draw( display );
		}

		display.border( this.border, this.silhoutte, euclid_view.proper );

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
		discname;

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
		root.alter(
			change_shrink.create(
				'path', this.mark.itemPath.chop,
				'prev', root.space.getPath( this.mark.itemPath.chop ),
				'rank', root.space.rankOf( this.mark.itemPath.get( 2 ) )
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
		'pnw', this.frame.pnw
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

	display = this._display,

	pp = p.sub( this.frame.pnw );

	if(
		!display.withinSketch( this.silhoutte, euclid_view.proper, pp )
	)
	{
		return;
	}

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
	if( !this.frame.within( p ) )
	{
		return;
	}

	display = this._display;

	pp = p.sub( this.frame.pnw );

	if(
		!display.withinSketch( this.silhoutte, euclid_view.proper, pp )
	)
	{
		return;
	}

	// this is on the disc
	for( r = 0, rZ = this.length; r < rZ; r++ )
	{
		reply = this.atRank( r ).click( pp, shift, ctrl );

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
	if( !this.frame.within( p ) )
	{
		return;
	}

	if(
		!this._display.withinSketch(
			this.silhoutte,
			euclid_view.proper,
			p.sub( this.frame.pnw )
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
	if( !this.frame.within( p ) )
	{
		return;
	}

	if(
		!this._display.withinSketch(
			this.silhoutte,
			euclid_view.proper,
			p.sub( this.frame.pnw )
		)
	)
	{
		return;
	}

	return true;
};


} )( );
