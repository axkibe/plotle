/*
| The disc panel.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Discs;

Discs =
	Discs || { };


/*
| Imports
*/
var
	Euclid,
	Jools,
	shell,
	Widgets;

/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The joobj definition.
*/
if( JOOBJ )
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
							'String'
					},

				action :
					{
						comment :
							'currently active action',

						type :
							'Action'
					},

				hover :
					{
						comment :
							'the widget hovered upon',

						type :
							'Path'
					},

				mark :
					{
						comment :
							'the users mark',

						type :
							'Mark'
					},

				mode :
					{
						comment :
							'current mode the UI is in',

						type :
							'String'
					},

				path :
					{
						comment :
							'path of the disc',

						type :
							'Path'
					},

				view :
					{
						comment :
							'the current view',

						type :
							'View',

						concerns :
							{
								func :
									'view.sizeOnly',

								args :
									null
							}
					},

				spaceUser :
					{
						comment :
							'owner of currently loaded space',

						type :
							'String',

						allowNull :
							true,

						defaultVal :
							'null'
					},

				spaceTag :
					{
						comment :
							'name of currently loaded space',

						type :
							'String',

						allowNull :
							true,

						defaultVal :
							'null'
					},

				username :
					{
						comment :
							'currently logged in user',

						type :
							'String',

						allowNull :
							true,

						defaultVal :
							'null'
					}
			},

		subclass :
			'Discs.Disc',

		init :
			[
				'inherit'
			]
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
	Discs.Disc._init.call(
		this,
		inherit
	);

	var
		buttons =
			{ },

		twig =
			this._tree.twig,

		ranks =
			this._tree.ranks,

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
				ranks[ r ],

			tree =
				twig[ wname ],

			path =
				this.path.append( wname );

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

		switch( tree.twig.type )
		{
			case 'ButtonWidget' :

				buttons[ wname ] =
					Widgets.Button.create(
						'path',
							path,
						'superFrame',
							this.frame.zeropnw,
						'inherit',
							inherit && inherit.buttons[ wname ],
						'hoverAccent',
							path.equals( this.hover ),
						'focusAccent',
							this.mode === wname,
						'text',
							text,
						'tree',
							tree,
						'icons',
							this._icons,
						'visible',
							visible
					);

					break;

			default :

				throw new Error(
					CHECK
					&&
					(
						'Cannot create widget of type: ' +
							tree.twig.type
					)
				);
		}
	}

	this.buttons =
		Jools.immute( buttons );
};


/*
| Returns true if current user is a guest.
|
| MAYBE make User an own object.
*/
Jools.lazyFixate(
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
| Prepares the disc panels contents.
*/
Jools.lazyFixate(
	MainDisc.prototype,
	'_fabric',
	function( )
	{
		var
			fabric =
				Euclid.Fabric.create(
					'width',
						this.style.width,
					'height',
						this.style.height
				);

		fabric.fill(
			this.style,
			this.silhoutte,
			'sketch',
			Euclid.View.proper
		);

		var
			buttons =
				this.buttons;

		for( var name in this.buttons )
		{
			buttons[ name ].draw( fabric );
		}

		fabric.edge(
			this.style,
			this.silhoutte,
			'sketch',
			Euclid.View.proper
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
		discname =
			path.get( 1 );

	if( discname !== this.reflect )
	{
		throw new Error(
			'invalid discname: ' + discname
		);
	}

	var
		buttonName =
			path.get( 2 );

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
		shell.peer.removeItem( this.mark.itemPath );
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
			Euclid.View.proper,
			pp
		)
	)
	{
		return null;
	}

	// this is on the disc
	var
		buttons =
			this.buttons;

	for( var name in buttons )
	{
		var
			reply =
				buttons[ name ].pointingHover(
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
| Returns true if point is on this panel.
*/
MainDisc.prototype.pointingStart =
	function(
		p,
		shift,
		ctrl
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

	var
		fabric =
			this._fabric,

		pp =
			p.sub( this.frame.pnw );

	if(
		!fabric.withinSketch(
			this.silhoutte,
			'sketch',
			Euclid.View.proper,
			pp
		)
	)
	{
		return null;
	}

	// this is on the disc
	var
		buttons =
			this.buttons;

	for( var name in buttons )
	{
		var r =
			buttons[ name ]
				.pointingStart(
					pp,
					shift,
					ctrl
				);

		if( r )
		{
			return r;
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
		// p,
		// shift,
		// ctrl
	)
{
	return null;
};


} )( );
