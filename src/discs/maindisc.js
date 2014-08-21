/*
| The disc panel.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	discs,
	Peer;

discs = discs || { };


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
			'mainDisc',
		unit :
			'discs',
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
							'Object', // FUTURE 'actions.*',
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
							'euclid.view',
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
			'discs.disc',
		init :
			[
				'inherit'
			],
		twig :
			{
				'Button' :
					'widgets.Button',
				'CheckBox' :
					'widgets.Checkbox',
				'Input' :
					'widgets.Input',
				'Label' :
					'widgets.Label'
			}
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
		wname;

	if( !this.path )
	{
		return;
	}

	discs.disc._init.call(
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
		wname = ranks[ r ];

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
| The disc panel's fabric.
*/
jools.lazyValue(
	mainDisc.prototype,
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
			euclid.view.proper
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
			euclid.view.proper
		);

		return fabric;
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
/**/	if( discname !== this.reflexName )
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
mainDisc.prototype.draw =
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
mainDisc.prototype.pointingHover =
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
			euclid.view.proper,
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
mainDisc.prototype.click =
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
			euclid.view.proper,
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
		!this._fabric.withinSketch(
			this.silhoutte,
			'sketch',
			euclid.view.proper,
			p.sub( this.frame.pnw )
		)
	)
	{
		return null;
	}

	return true;
};


} )( );
