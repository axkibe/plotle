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
			'disc_mainDisc',
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
							'null'
					},
				// FIXME give user_creds object
				username :
					{
						comment :
							'currently logged in user',
						type :
							'string',
						defaultValue :
							'null'
					},
				view :
					{
						comment :
							'the current view',
						type :
							'euclid_view',
						concerns :
							{
								member : 'sizeOnly'
							},
						defaultValue :
							'null'
					}
			},
		subclass :
			'disc_disc',
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


/*
| Initializes the main disc.
*/
disc_mainDisc.prototype._init =
	function(
		inherit,
		twigDup
	)
{
	var
		path,
		r,
		rZ,
		text,
		twig,
		visible,
		wname;

	if( !this.path )
	{
		return;
	}

	disc_disc._init.call( this, inherit );

	if( !twigDup )
	{
		twig = jools.copy( this.twig );
	}

	for(
		r = 0, rZ = this.length;
		r < rZ;
		r++
	)
	{
		wname = this.getKey( r );

		text = undefined;

		visible = undefined;

		switch( wname )
		{
			case 'login' :

				visible = true;

				text =
					this._userIsGuest
					? 'log\nin'
					: 'log\nout';

				break;

			// FIXME lowercase
			case 'Remove' :

				visible =
					this.access === 'rw'
					&& this.mark !== null
					&& this.mark.itemPath.length > 0;

				break;

			case 'create' :

				visible = this.access === 'rw';

				break;

			case 'signUp' :

				visible = this._userIsGuest;

				break;

			case 'space' :

				if( this.spaceRef )
				{
					text = this.spaceRef.fullname;
				}

				visible = true;

				break;

			case 'user' :

				text = this.username;

				visible = true;

				break;

			default :

				visible = true;

				break;
		}

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
				'hover', this.hover,
				'focusAccent', this.mode === wname,
				'path', path,
				'superFrame', this.frame.zeropnw,
				'text', text,
				'visible', visible
			);
	}

	this.twig = twig;

/**/if( FREEZE )
/**/{
/**/	Object.freeze( twig );
/**/}
};


/*
| True if current user is a guest.
|
| FUTURE make user an own object.
*/
jools.lazyValue(
	disc_mainDisc.prototype,
	'_userIsGuest',
	function( )
	{
		if( this.username === null )
		{
			return true;
		}

		return this.username.substr( 0, 5 ) === 'visit';
	}
);


/*
| The disc panel's display.
*/
jools.lazyValue(
	disc_mainDisc.prototype,
	'_display',
	function( )
	{
		var
			display,
			r,
			rZ;

		display =
			euclid_display.create(
				'width', this.style.width,
				'height', this.style.height
			);

		display.fill(
			this.style,
			this.silhoutte,
			euclid_view.proper
		);

		for(
			r = 0, rZ = this.length;
			r < rZ;
			r++
		)
		{
			this.atRank( r ).draw( display );
		}

		display.edge(
			this.style,
			this.silhoutte,
			euclid_view.proper
		);

		return display;
	}
);


/*
| A button of the main disc has been pushed.
*/
disc_mainDisc.prototype.pushButton =
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

	if( buttonName === 'login' && !this._userIsGuest )
	{
		root.logout( );

		return;
	}

	if( buttonName === 'Remove' )
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
		root.create( 'mode', buttonName, 'action', null );
	}
};


/*
| Draws the disc panel.
*/
disc_mainDisc.prototype.draw =
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
disc_mainDisc.prototype.pointingHover =
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
	if( !this.frame.within( null, p ) )
	{
		return null;
	}

	display = this._display,

	pp = p.sub( this.frame.pnw );

	if(
		!display.withinSketch( this.silhoutte, euclid_view.proper, pp )
	)
	{
		return null;
	}

	// this is on the disc
	for(
		r = 0, rZ = this.ranks.length;
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
| Checks if the user clicked something on the panel
*/
disc_mainDisc.prototype.click =
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

	if(
		!display.withinSketch( this.silhoutte, euclid_view.proper, pp )
	)
	{
		return null;
	}

	// this is on the disc
	for(
		r = 0, rZ = this.ranks.length;
		r < rZ;
		r++
	)
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
disc_mainDisc.prototype.input =
	function(
		// text
	)
{
	// nothing
};


/*
| User is pressing a special key.
*/
disc_mainDisc.prototype.specialKey =
	function(
		// key,
		// shift,
		// ctrl
	)
{

};


/*
| Start of a dragging operation.
*/
disc_mainDisc.prototype.dragStart =
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


} )( );
