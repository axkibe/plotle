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


if( CHECK && typeof( window ) === 'undefined' )
{
	throw new Error(
		'this code needs a browser!'
	);
}


var
	_tag =
		'DISC-11692648';


/*
| Constructor
*/
var MainDisc =
Discs.MainDisc =
	function(
		tag,
		inherit,
		hover,
		mode,
		screensize
	)
{
	if( CHECK )
	{
		if( tag !== _tag )
		{
			throw new Error(
				'tag mismatch'
			);
		}
	}

	this.mode =
		mode;

	Discs.Disc.call(
		this,
		inherit,
		hover,
		screensize
	);

	var
		buttons =
			{ },

		twig =
			this._tree.twig,

		ranks =
			this._tree.ranks;

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
							path.equals( hover ),
						'focusAccent',
							mode === wname,
						'tree',
							tree,
						'icons',
							this._icons
					);

					break;

			default :

				throw new Error(
					'Cannot create widget of type: ' +
						tree.twig.type
				);
		}
	}

	// TODO remove

	this.buttons =
		buttons;

	this._$loggedIn =
		inherit ?
			inherit._$loggedIn :
			false;

	Jools.immute( this );
};


/*
| The MainDisc is a Disc.
*/
Jools.subclass(
	MainDisc,
	Discs.Disc
);


/*
| Reflection.
*/
MainDisc.prototype.reflect =
	'MainDisc';


/*
| Prepares the disc panels contents.
*/
MainDisc.prototype._weave =
	function( )
{
	var
		fabric =
			this.$fabric;

//  TODO reenable caching once
//       disc recreation is fixed
//
//	if( fabric && !config.debug.noCache )
//	{
//		return fabric;
//	}

	fabric =
	this.$fabric =
		new Euclid.Fabric(
			this.style.width,
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
};


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
		bridge =
			shell.bridge,

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
		this._$loggedIn
	)
	{
		shell.logout( );

		return;
	}

	shell.setMode( buttonName );

	var
		action =
			bridge.action( );

	if( buttonName === 'Remove' )
	{
		if( action )
		{
			bridge.stopAction( );
		}

		bridge.startAction( 'Remove' );
	}
	else
	{
		if( action && action.type === 'Remove' )
		{
			bridge.stopAction( );
		}
	}

	shell.redraw =
		true;
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
			this._weave( ),
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
			this._weave( ),

		pp =
			p.sub( this.frame.pnw );

	if( !fabric.withinSketch(
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
			this._weave( ),

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
| An action started or stoped or changed
*/
/*
XXX remove
MainDisc.prototype.setMode =
	function(
		mode
	)
{
	if( this.mode === mode )
	{
		return;
	}

	this.$fabric =
		null;

	var
		buttonName =
			mode;

	if( this.buttons[ buttonName ] )
	{
		this.buttons[ buttonName ] =
			Widgets.Button.create(
				'inherit',
					this.buttons[ buttonName ],
				'focusAccent',
					false
			);
	}

	this.$mode =
		mode;

	buttonName =
		mode;

	if( this.buttons[ buttonName ] )
	{
		this.buttons[ buttonName ] =
			Widgets.Button.create(
				'inherit',
					this.buttons[ buttonName ],
				'focusAccent',
					true
			);
	}

	shell.redraw =
		true;
};
*/


/*
| Displays a message
*/
MainDisc.prototype.message =
	function(
		// message
	)
{
	// nothing
};


/*
| Displays a current space
*/
MainDisc.prototype.arrivedAtSpace =
	function(
		spaceUser,
		spaceTag,
		access
	)
{
	var buttons =
		this.buttons;

	buttons.Space =
		Widgets.Button.create(
			'inherit',
				buttons.Space,
			'text',
				spaceUser + ':' + spaceTag
		);

	buttons.Create =
		Widgets.Button.create(
			'inherit',
				buttons.Create,
			'visible',
				access === 'rw'
		);

	buttons.Remove =
		Widgets.Button.create(
			'inherit',
				buttons.Remove,
			'visible',
				access === 'rw'
		);
};


/*
| Displays the current user
| Adapts Login/Logout/SignUp button
*/
MainDisc.prototype.setUser =
	function(
		user
	)
{
	var
		buttons =
			this.buttons,

		isGuest =
			user.substr( 0, 5 ) === 'visit';

	buttons.User =
		Widgets.Button.create(
			'inherit',
				buttons.User,
			'text',
				user,
			'visible',
				true
		);

	this._$loggedIn =
		!isGuest;

	buttons.SignUp =
		Widgets.Button.create(
			'inherit',
				buttons.SignUp,
			'visible',
				isGuest
		);

	buttons.Login =
		Widgets.Button.create(
			'inherit',
				buttons.Login,
			'text',
				isGuest ?
					'log\nin' :
					'log\nout'
		);

	shell.setMode( 'Normal' );

	shell.redraw =
		true;
};


/*
| Displays the current space zoom level
*/
MainDisc.prototype.setSpaceZoom =
	function(
		// zf
	)
{
	// nothing
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
