/*
| The disc panel.
*/


/*
| Export
*/
var
	discs,
	euclid_display,
	euclid_view,
	peer,
	jools,
	root;

discs = discs || { }; // FIXME

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
			'discs.mainDisc',
		attributes :
			{
				access :
					{
						comment :
							'users access to current space',
						type :
							'String',
						defaultValue :
							null
					},
				action :
					{
						comment :
							'currently active action',
						type :
							'Object', // FUTURE 'actions_*',
						defaultValue :
							null
					},
				hover :
					{
						comment :
							'the widget hovered upon',
						type :
							'jion_path',
						defaultValue :
							null
					},
				mark :
					{
						comment :
							'the users mark',
						type :
							'Object', // FUTURE 'marks.*',
						defaultValue :
							null
					},
				mode :
					{
						comment :
							'current mode the UI is in',
						type :
							'String',
						defaultValue :
							null
					},
				path :
					{
						comment :
							'path of the disc',
						type :
							'jion_path',
						defaultValue :
							undefined
					},
				spaceUser :
					{
						comment :
							'owner of currently loaded space',
						type :
							'String',
						defaultValue :
							null
					},
				spaceTag :
					{
						comment :
							'name of currently loaded space',
						type :
							'String',
						defaultValue :
							null
					},
				username :
					{
						comment :
							'currently logged in user',
						type :
							'String',
						defaultValue :
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
								member : 'sizeOnly'
							},
						defaultValue :
							null
					}
			},
		subclass :
			'discs.disc',
		init :
			[
				'inherit'
			],
		twig :
			[
				'widgets_button',
				'widgets_checkbox',
				'widgets_input',
				'widgets_label'
			]
	};
}


var
	mainDisc;

mainDisc = discs.mainDisc;


/*
| Initializes the main disc.
*/
mainDisc.prototype._init =
	function(
		inherit
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

	discs.disc._init.call(
		this,
		inherit
	);

	twig = jools.copy( this.twig ); // FIXME only if needed

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
						?
						'log\nin'
						:
						'log\nout';

				break;

			case 'Remove' :

				visible =
					this.access === 'rw'
					&&
					this.mark !== null
					&&
					this.mark.itemPath.length > 0;

				break;

			case 'Create' :

				visible = this.access === 'rw';

				break;

			case 'signUp' :

				visible = this._userIsGuest;

				break;

			case 'space' :

				text = this.spaceUser + ':' + this.spaceTag;

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
};


/*
| True if current user is a guest.
|
| FUTURE make user an own object.
*/
jools.lazyValue(
	mainDisc.prototype,
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
	mainDisc.prototype,
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
mainDisc.prototype.pushButton =
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
		&&
		!this._userIsGuest
	)
	{
		root.logout( );

		return;
	}

	if( buttonName === 'Remove' )
	{
		peer.removeItem( this.mark.itemPath );
	}
	else
	{
		root.setMode( buttonName );
	}
};


/*
| Draws the disc panel.
*/
mainDisc.prototype.draw =
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
mainDisc.prototype.pointingHover =
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
mainDisc.prototype.click =
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
mainDisc.prototype.input =
	function(
		// text
	)
{
	// nothing
};


/*
| User is pressing a special key.
*/
mainDisc.prototype.specialKey =
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
mainDisc.prototype.dragStart =
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
