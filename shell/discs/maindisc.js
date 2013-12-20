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
		screensize,
		hover
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

	this.$mode =
		inherit ?
			inherit.$mode :
			null;

	Discs.Disc.call(
		this,
		inherit,
		screensize,
		hover
	);

	this.$user =
		null;

	this._$loggedIn =
		inherit ?
			inherit._$loggedIn :
			false;
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
| Returns the mode associated with a button
|
| TODO remove
*/
MainDisc.prototype.getModeOfButton =
	function(
		buttonName
	)
{
	switch( buttonName )
	{
		case 'create' :
			return 'Create';

		case 'moveto' :
			return 'MoveTo';

		case 'help' :
			return 'Help';

		case 'login' :
			return 'Login';

		case 'normal' :
			return 'Normal';

		case 'remove' :
			return 'Remove';

		case 'signup' :
			return 'SignUp';

		case 'space' :
			return 'Space';

		case 'user' :
			return 'User';

		default :
			throw new Error(
				'unknown button:' + buttonName
			);
	}
};


/*
| Returns the mode associated with a button
|
| TODO remove
*/
MainDisc.prototype.getButtonOfMode =
	function(
		mode
	)
{
	switch( mode )
	{
		case 'Create' :
			return 'create';

		case 'MoveTo' :
			return 'moveto';

		case 'Help' :
			return 'help';

		case 'Login' :
			return 'login';

		case 'Normal' :
			return 'normal';

		case 'Remove' :
			return 'remove';

		case 'SignUp' :
			return 'signup';

		case 'Space' :
			return 'space';

		case 'User' :
			return 'user';

		case 'NoAccessToSpace' :
		case 'NonExistingSpace' :
		case 'Welcome' :
		case null :
			return null;

		default :

			throw new Error(
				'unknown mode:' + mode
			);
	}
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
			path.get( 0 );

	if( discname !== this.reflect )
	{
		throw new Error(
			'invalid discname: ' + discname
		);
	}

	var
		buttonName =
			path.get( 1 );

	if(
		buttonName === 'login' &&
		this._$loggedIn
	)
	{
		shell.logout( );

		return;
	}

	bridge.changeMode(
		this.getModeOfButton(
			buttonName
		)
	);

	var
		action =
			bridge.action( );

	if( buttonName === 'remove' )
	{
		if( action )
		{
			bridge.stopAction( );
		}

		bridge.startAction(
			'Remove',
			'space'
		);
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
		p === null ||
		!this.frame.within(
			null,
			p
		)
	)
	{
		shell.setHover(
			'disc',
			this.path
		);

		return null;
	}

	var
		fabric =
			this._weave( ),

		pp =
			p.sub( this.frame.pnw );

	// FIXME Optimize by reusing the latest path of this.$fabric

	if( !fabric.withinSketch(
			this.silhoutte,
			'sketch',
			Euclid.View.proper,
			pp
		)
	)
	{
		shell.setHover(
			'disc',
			this.path
		);

		return null;
	}

	// this is on the disc
	var
		buttons =
			this.buttons,

		cursor =
			null;

	for( var name in buttons )
	{
		cursor =
			buttons[ name ].pointingHover(
				pp,
				shift,
				ctrl
			);

		if ( cursor )
		{
			break;
		}
	}

	if ( cursor === null )
	{
		shell.setHover(
			'disc',
			this.path
		);
	}

	return cursor || 'default';
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
		shell.setHover(
			'disc',
			this.path
		);

		return null;
	}

	var
		fabric =
			this._weave( ),

		pp =
			p.sub( this.frame.pnw );

	// FIXME Optimize by reusing the latest path of this.$fabric
	if(
		!fabric.withinSketch(
			this.silhoutte,
			'sketch',
			Euclid.View.proper,
			pp
		)
	)
	{
		shell.setHover(
			'disc',
			this.path
		);

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
MainDisc.prototype.setMode =
	function(
		mode
	)
{
	if( this.$mode === mode )
	{
		return;
	}

	this.$fabric =
		null;

	var
		buttonName =
			this.getButtonOfMode( this.$mode );

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
		this.getButtonOfMode( mode );

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

	buttons.space =
		Widgets.Button.create(
			'inherit',
				buttons.space,
			'text',
				spaceUser + ':' + spaceTag
		);

	buttons.create =
		Widgets.Button.create(
			'inherit',
				buttons.create,
			'visible',
				access === 'rw'
		);

	buttons.remove =
		Widgets.Button.create(
			'inherit',
				buttons.remove,
			'visible',
				access === 'rw'
		);
};


/*
| Displays the current user
| Adapts login/logout/signup button
*/
MainDisc.prototype.setUser =
	function(
		user
	)
{
	this.$user =
		user;

	var
		buttons =
			this.buttons,

		isGuest =
			user.substr( 0, 5 ) === 'visit';

	buttons.user =
		Widgets.Button.create(
			'inherit',
				buttons.user,
			'text',
				user,
			'visible',
				true
		);

	this._$loggedIn =
		!isGuest;

	buttons.signup =
		Widgets.Button.create(
			'inherit',
				buttons.signup,
			'visible',
				isGuest
		);

	buttons.login =
		Widgets.Button.create(
			'inherit',
				buttons.login,
			'text',
				isGuest ?
					'log\nin' :
					'log\nout'
		);

	shell.bridge.changeMode(
		'Normal'
	);

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
