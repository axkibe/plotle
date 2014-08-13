/*
| The disc panel.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Discs,
	Peer;

Discs =
	Discs || { };


/*
| Imports
*/
var
	euclid,
	jools,
	shell;

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
		name :
			'MainDisc',
		unit :
			'Discs',
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
							'Action',
						defaultValue :
							null
					},
				hover :
					{
						comment :
							'the widget hovered upon',
						type :
							'path',
						defaultValue :
							null
					},
				mark :
					{
						comment :
							'the users mark',
						type :
							'Mark',
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
							'path',
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
							'View',
						concerns :
							{
								member :
									'sizeOnly'
							},
						defaultValue :
							null
					}
			},
		subclass :
			'Discs.Disc',
		init :
			[
				'inherit'
			],
		twig :
			{
				'Button' :
					'Widgets.Button',
				'CheckBox' :
					'Widgets.Checkbox',
				'Input' :
					'Widgets.Input',
				'Label' :
					'Widgets.Label'
			}
	};
}


var
	MainDisc =
		Discs.MainDisc;


/*
| Initializes the main disc.
*/
MainDisc.prototype._init =
	function(
		inherit
	)
{
	if( !this.path )
	{
		return;
	}

	Discs.Disc._init.call(
		this,
		inherit
	);

	var
		twig =
			jools.copy( this.twig ), // FIXME only if needed
		path,
		ranks =
			this.ranks,
		text,
		visible;

	for(
		var r = 0, rZ = ranks.length;
		r < rZ;
		r++
	)
	{
		var
			wname =
				ranks[ r ];

		text =
			undefined;
		visible =
			undefined;

		switch( wname )
		{
			case 'Login' :

				visible =
					true;

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
					this.mark.itemPath.length > 0;

				break;

			case 'Create' :

				visible =
					this.access === 'rw';

				break;

			case 'SignUp' :

				visible =
					this._userIsGuest;

				break;

			case 'Space' :

				text =
					this.spaceUser + ':' + this.spaceTag;

				visible =
					true;

				break;

			case 'User' :

				text =
					this.username;

				visible =
					true;

				break;

			default :

				visible =
					true;

				break;
		}

		if( twig[ wname ].path )
		{
			path =
				undefined;
		}
		else
		{
			path =
				this.path
				.Append( 'twig' )
				.Append( wname );
		}

		twig[ wname ] =
			twig[ wname ].create(
				'hover',
					this.hover,
				'focusAccent',
					this.mode === wname,
				'path',
					path,
				'superFrame',
					this.frame.zeropnw,
				'text',
					text,
				'visible',
					visible
			);
	}

	this.twig =
		twig;
};


/*
| True if current user is a guest.
|
| FUTURE make user an own object.
*/
jools.lazyValue(
	MainDisc.prototype,
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
| The disc panel's fabric.
*/
jools.lazyValue(
	MainDisc.prototype,
	'_fabric',
	function( )
	{
		var
			fabric =
				euclid.fabric.create(
					'width',
						this.style.width,
					'height',
						this.style.height
				);

		fabric.fill(
			this.style,
			this.silhoutte,
			'sketch',
			euclid.View.proper
		);

		for(
			var r = 0, rZ = this.ranks.length;
			r < rZ;
			r++
		)
		{
			this.atRank( r )
				.draw( fabric );
		}

		fabric.edge(
			this.style,
			this.silhoutte,
			'sketch',
			euclid.View.proper
		);

		return fabric;
	}
);


/*
| A button of the main disc has been pushed.
*/
MainDisc.prototype.pushButton =
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
/**/	if( discname !== this.reflexName )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	buttonName = path.get( 4 );

	if(
		buttonName === 'Login' &&
		!this._userIsGuest
	)
	{
		shell.logout( );

		return;
	}

	if( buttonName === 'Remove' )
	{
		Peer.removeItem( this.mark.itemPath );
	}
	else
	{
		shell.setMode( buttonName );
	}
};


/*
| Draws the disc panel.
*/
MainDisc.prototype.draw =
	function(
		fabric
	)
{
	fabric.drawImage(
		'image',
			this._fabric,
		'pnw',
			this.frame.pnw
	);
};


/*
| Returns true if point is on the disc panel.
*/
MainDisc.prototype.pointingHover =
	function(
		p,
		shift,
		ctrl
	)
{
	// shortcut if p is not near the panel
	if(
		!this.frame.within( null, p )
	)
	{
		return null;
	}

	var
		fabric =
			this._fabric,

		pp =
			p.sub( this.frame.pnw );

	if(
		!fabric.withinSketch(
			this.silhoutte,
			'sketch',
			euclid.View.proper,
			pp
		)
	)
	{
		return null;
	}

	// this is on the disc
	for(
		var r = 0, rZ = this.ranks.length;
		r < rZ;
		r++
	)
	{
		var
			reply =
				this.atRank( r )
					.pointingHover(
						pp,
						shift,
						ctrl
					);

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
MainDisc.prototype.click =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		fabric,
		pp;

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

	fabric =
		this._fabric;

	pp =
		p.sub( this.frame.pnw );

	if(
		!fabric.withinSketch(
			this.silhoutte,
			'sketch',
			euclid.View.proper,
			pp
		)
	)
	{
		return null;
	}

	// this is on the disc
	for(
		var r = 0, rZ = this.ranks.length;
		r < rZ;
		r++
	)
	{
		var
			reply =
				this.atRank( r )
					.click(
						pp,
						shift,
						ctrl
					);

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
MainDisc.prototype.input =
	function(
		// text
	)
{
	// nothing
};


/*
| User is pressing a special key.
*/
MainDisc.prototype.specialKey =
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
MainDisc.prototype.dragStart =
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
		!this._fabric.withinSketch(
			this.silhoutte,
			'sketch',
			euclid.View.proper,
			p.sub( this.frame.pnw )
		)
	)
	{
		return null;
	}

	return true;
};


} )( );
