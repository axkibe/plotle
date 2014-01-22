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
		access,
		action,
		hover,
		mark,
		mode,
		screensize,
		username
	)
{

/**/if( CHECK )
/**/{
/**/	if( tag !== _tag )
/**/	{
/**/		throw new Error(
/**/			'tag mismatch'
/**/		);
/**/	}
/**/}

	this.access =
		access;

	this.action =
		action;

	this.mark =
		mark;

	this.mode =
		mode;

	this.username =
		username;

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
			this._tree.ranks,

		isGuest =
			username.substr( 0, 5 ) === 'visit',

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
					isGuest ?
						'log\nin' :
						'log\nout';

				break;

			case 'Remove' :

				visible =
					access === 'rw'
					&&
					mark.itemPath.length > 0;

				break;

			case 'Create' :

				visible =
					access === 'rw';

				break;

			case 'SignUp' :

				visible =
					isGuest;

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
							path.equals( hover ),
						'focusAccent',
							mode === wname,
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
					'Cannot create widget of type: ' +
						tree.twig.type
				);
		}
	}

	// TODO remove

	this.buttons =
		buttons;

	this._loggedIn =
		!isGuest;

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
| (Re)Creates a new disc.
*/
MainDisc.create =
	function(
		// free strings
	)
{
	var
		a =
			0,

		aZ =
			arguments.length,

		access =
			null,

		action =
			null,

		hover =
			null,

		inherit =
			null,

		mark =
			null,

		mode =
			null,

		screensize =
			null,

		username =
			null;

	while( a < aZ )
	{
		var
			arg =
				arguments[ a++ ];

		switch( arg )
		{
			case 'access' :

				access =
					arguments[ a++ ];

				break;

			case 'action' :

				action =
					arguments[ a++ ];

				break;

			case 'hover' :

				hover =
					arguments[ a++ ];

				break;

			case 'inherit' :

				inherit =
					arguments[ a++ ];

				break;

			case 'mark' :

				mark =
					arguments[ a++ ];

				break;

			case 'mode' :

				mode =
					arguments[ a++ ];

				break;

			case 'screensize' :

				screensize =
					arguments[ a++ ];

				break;

			case 'username' :

				username =
					arguments[ a++ ];

				break;

			default :

/**/			if( CHECK )
/**/			{
/**/				throw new Error(
/**/					'invalid argument: ' + arguments[ a ]
/**/				);
/**/			}
		}
	}

	if( inherit )
	{
		if( access === null )
		{
			hover =
				inherit.access;
		}

		if( action === null )
		{
			action =
				inherit.action;
		}

		if( hover === null )
		{
			hover =
				inherit.hover;
		}

		if( mark === null )
		{
			mark =
				inherit.mark;
		}

		if( mode === null )
		{
			mode =
				inherit.mode;
		}

		if( screensize === null )
		{
			screensize =
				inherit.screensize;
		}

		if( username === null )
		{
			username =
				inherit.username;
		}

		// TODO use the discs equals mode
	}

	return new MainDisc(
		_tag,
		inherit,
		access,
		action,
		hover,
		mark,
		mode,
		screensize,
		username
	);
};



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
		this._loggedIn
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
|
| TODO remove
*/
MainDisc.prototype.arrivedAtSpace =
	function(
		spaceUser,
		spaceTag
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
