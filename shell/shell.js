/*
| The users shell.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	shell =
		null,

	Shell =
		null;

/*
| Imports
*/
var
	Action,
	Bridge,
	Design,
	Disc,
	Euclid,
	fontPool,
	Forms,
	GreenScreen,
	IFace,
	Jools,
	Mark,
	MeshMashine,
	Peer,
	Range,
	shellverse,
	Sign,
	system,
	swatch,
	Visual;


/*
| Capsule
*/
( function() {

'use strict';

if( CHECK && typeof( window ) === 'undefined' )
{
	throw new Error(
		'this code needs a browser!'
	);
}


/*
| Constructor.
*/
Shell =
	function(
		fabric
	)
{
	if( shell !== null )
	{
		throw new Error(
			'Singleton not single'
		);
	}

	shell =
		this;

	var
		canvas =
			document.createElement( 'canvas' );

	swatch =
		new Euclid.Fabric( canvas );

	Euclid.Measure.init( canvas );

	this._fontWFont =
		fontPool.get( 20, 'la' );

	this._$fontWatch =
		Euclid.Measure.width(
			this._fontWFont,
			'meshcraft$8833'
		);

	this._$haveSystemFocus =
		true;

	this._$caretBlink =
		false;

	this.fabric =
		fabric;

	this.$space =
		null;

	var
		screensize =
		this.screensize =
			shellverse.grow(
				'Point',
				'x',
					fabric.width,
				'y',
					fabric.height
			);

	var forms =
		[
			'Login',
			'MoveTo',
			'NoAccessToSpace',
			'NonExistingSpace',
			'SignUp',
			'Space',
			'User',
			'Welcome'
		];

	this._$forms =
		{ };

	var
		formNames =
		this._formNames =
			{ };

	for( var i in forms )
	{
		var
			name =
				forms[ i ];

		var form =
			this._$forms[ name ] =
				new Forms[ name ](
					'screensize',
						screensize
				);

		formNames[ form.name ] =
			name;
	}

	this._$disc =
		new Disc.MainDisc(
			null,
			Design.MainDisc,
			screensize
		);

	this.bridge =
		new Bridge( );

	// greenscreen display if not null
	this._$greenscreen =
		null;

	this._draw( );
};


/*
| TODO, workaround until $space is gone
*/
Object.defineProperty(
	Shell.prototype,
	'space',
	{
		get :
			function( )
		{
			return this.$space;
		}
	}
);

/*
| Positions the caret.
*/
Shell.prototype.positionCaret =
	function( )
{
	var
		display =
			this._getCurrentDisplay( );

	if( display )
	{
		display.positionCaret( );
	}
};

/*
| Peer received a message.
*/
Shell.prototype.messageRCV =
	function(
		space,
		user,
		message
	)
{
	if( user )
	{
		this._$disc.message( user + ': ' + message );
	}
	else
	{
		this._$disc.message( message );
	}
};


/*
| MeshMashine is reporting updates.
*/
Shell.prototype.update =
	function(
		tree,
		chgX
	)
{
	var
		mark =
			this.space.mark,

		msign =
			mark.sign;

	if( mark.type === 'caret' )
	{
		if ( !Jools.is(
				tree.twig[ mark.sign.path.get( 0 ) ]
			)
		)
		{
			mark =
				Mark.Vacant.create( );
		}
		else
		{
			var
				sign =
					MeshMashine.tfxSign(
						mark.sign,
						chgX
					);

			// TODO keeping retainx might not be correct
			//      in some cases
			mark =
				Mark.Caret.create(
					sign,
					mark.retainx
				);
		}
	}


	this.$space =
		Visual.Space.create(
			'tree',
				tree,
			'inherit',
				this.$space,
			'mark',
				mark
		);


	// TODO move selection to space / forms

	/*
	if( selection )
	{
		this.s_etSelection(
			selection.doc,
			MeshMashine.tfxSign(
				selection.bSign,
				chgX
			),
			MeshMashine.tfxSign(
				selection.eSign,
				chgX
			)
		);
	}
	*/

	// TODO figure out deleted selection
	/*
	if(
		selection &&
		selection.bSign.path.get( -4 ) === csign.path.get( 1 )
	)
	{
		shell.d_eselect( );
	}
	*/

	this._draw( );
};


/*
| The shell got the systems focus.
*/
Shell.prototype.systemFocus =
	function( )
{
	this._$haveSystemFocus =
		true;

	this._draw( );
};


/*
| The shell lost the systems focus.
*/
Shell.prototype.systemBlur =
	function( )
{
	this._$haveSystemFocus =
		false;

	this._draw( );
};


/*
| Blinks the caret ( if shown )
*/
/*
Shell.prototype.blink =
	function( )
{
	this._$caretBlink =
		!this._$caretBlink;

	var
		display =
			this._getCurrentDisplay( );

	if(
		display &&
		display.caret &&
		this._$haveSystemFocus
	)
	{
		display.caret.display(
			this._$caretBlink
		);
	}
};
*/


/*
| Draws everything.
*/
Shell.prototype._draw =
	function( )
{
	var
		fabric =
			this.fabric;

	fabric.reset( );

	var
		display =
			this._getCurrentDisplay( );

	if( display )
	{
		display.draw(
			fabric,
			this._$haveSystemFocus,
			this._$caretBlink
		);
	}

	if( display && display.showDisc )
	{
		this._$disc.draw(
			fabric,
			this._$haveSystemFocus,
			this._$caretBlink
		);
	}

	this.redraw =
		false;
};


/*
| User clicked
*/
Shell.prototype.click =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		display =
			this._getCurrentDisplay( );

	if( display )
	{
		display.click(
			p,
			shift,
			ctrl
		);
	}

	if( this.redraw )
	{
		this._draw( );
	}
};


/*
| Returns current display
|
| This is either a visual space or a form
*/
Shell.prototype._getCurrentDisplay =
	function( )
{
	var
		name =
			this.bridge.mode( );

	if( this._$greenscreen )
	{
		return this._$greenscreen;
	}

	switch( name )
	{
		case 'Create' :
		case 'Normal' :
		case 'Remove' :

			return this.$space;

		case 'Login' :
		case 'MoveTo' :
		case 'NoAccessToSpace' :
		case 'NonExistingSpace' :
		case 'SignUp' :
		case 'Space' :
		case 'User' :
		case 'Welcome' :

			var
				inherit =
					this._$forms[ name ];

			if(
				!this.screensize.equals(
					inherit.screensize
				)
			)
			{
				this._$forms[ name ] =
					new Forms[ name ](
						'inherit',
							inherit,
						'screensize',
							this.screensize
					);
			}

			return this._$forms[ name ];

		default :

			throw new Error( 'unknown mode: ' + name );
	}
};


/*
| User is hovering his/her point ( mouse move )
*/
Shell.prototype.pointingHover =
	function(
		p,
		shift,
		ctrl
	)
{
	this.$hover =
		Jools.immute({
			p :
				p,

			shift :
				shift,

			ctrl :
				ctrl
		});

	var
		display =
			this._getCurrentDisplay( ),

		cursor = null;

	if( display && display.showDisc )
	{
		cursor =
			this._$disc.pointingHover(
				p,
				shift,
				ctrl
			);
	}


	if( display )
	{
		if( cursor )
		{
			display.pointingHover(
				null,
				shift,
				ctrl
			);
		}
		else
		{
			cursor =
				display.pointingHover(
					p,
					shift,
					ctrl
				);
		}
	}

	// FIXME this should be called $redraw

	if( this.redraw )
	{
		this._draw( );
	}

	return cursor;
};


/*
| Switches to a green error screen.
*/
Shell.prototype.greenscreen =
	function( message )
{
	if( !message )
	{
		message =
			'unknown error.';
	}

	if( !this._$greenscreen )
	{
		this._$greenscreen =
			new GreenScreen( message );
	}

	this._draw( );
};


/*
| Pointing device starts pointing
| ( mouse down, touch start )
|
| Returns the pointing state code,
| wheter this is a click/drag or yet undecided.
*/
Shell.prototype.pointingStart =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		pointingState =
			null;

	if( pointingState === null )
	{
		pointingState =
			this._$disc.pointingStart(
				p,
				shift,
				ctrl
			);
	}

	var
		display =
			this._getCurrentDisplay( );

	if(
		pointingState === null &&
		display
	)
	{
		pointingState =
			display.pointingStart(
				p,
				shift,
				ctrl
			);
	}

	if( this.redraw )
	{
		this._draw( );
	}

	return pointingState || false;
};


/*
| Starts an operation with the pointing device active.
|
| Mouse down or finger on screen.
*/
Shell.prototype.dragStart =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		cursor =
			null,

		display =
			this._getCurrentDisplay( );

	if( display && display.showDisc )
	{
		cursor =
			this._$disc.dragStart(
				p,
				shift,
				ctrl
			);
	}

	if( cursor === null )
	{
		if( display )
		{
			cursor =
				display.dragStart(
					p,
					shift,
					ctrl
				);
		}
	}

	if( this.redraw )
	{
		this._draw( );
	}

	return cursor;
};


/*
| Moving during an operation with the mouse button held down.
*/
Shell.prototype.dragMove =
	function(
		p,
		shift,
		ctrl
	)
{
	var action =
		this.bridge.action( );

	if( !action )
	{
		throw new Error( 'no action on dragMove' );
	}

	var cursor =
		null;

	switch( action.section )
	{
		// TODO board???
		case 'board' :

			cursor =
				this._$disc.dragMove(
					p,
					shift,
					ctrl
				);

			break;

		case 'space' :

			if( this.$space )
			{
				cursor =
					this.$space.dragMove(
						p,
						shift,
						ctrl
					);
			}

			break;
	}

	if( this.redraw )
	{
		this._draw( );
	}

	return cursor;
};


/*
| Stops an operation with the mouse button held down.
*/
Shell.prototype.dragStop =
	function(
		p,
		shift,
		ctrl
	)
{
	if( this._$greenscreen )
	{
		return;
	}

	var action =
		this.bridge.action( );

	if( !action )
	{
		throw new Error( 'no action on dragStop' );
	}

	switch( action.section )
	{
		// TODO board???
		case 'board' :

			this._$disc.dragStop(
				p,
				shift,
				ctrl
			);

			break;

		case 'space' :

			if( this.$space )
			{
				this.$space.dragStop(
					p,
					shift,
					ctrl
				);
			}

			break;

		default :

			throw new Error( 'unknown action.section' );
	}

	if( this.redraw )
	{
		this._draw( );
	}
};


/*
| Mouse wheel is being turned.
*/
Shell.prototype.mousewheel =
	function(
		p,
		dir,
		shift,
		ctrl
	)
{
	// FIXME disc?

	var
		display =
			this._getCurrentDisplay( );

	if( display )
	{
		display.mousewheel(
			p,
			dir,
			shift,
			ctrl
		);
	}

	if( this.redraw )
	{
		this._draw( );
	}
};


/*
| Sets the user's mark.
|
| This can be
|     the caret
|     a text selection
|     a widget
|     a single item
|     an iten selection
*/
Shell.prototype.userMark =
	function(
		command
		// ...
	)
{
	var
		at1 =
			null,

		bAt1 =
			null,

		bPath =
			null,

		eAt1 =
			null,

		ePath =
			null,

		form =
			null,

		formname =
			null,

		mark =
			null,

		name =
			null,

		path =
			null,

		section =
			null,

		setnull =
			null,

		sign =
			null,

		retainx =
			null,

		type =
			null;

	for(
		var a = 1, aZ = arguments.length;
		a < aZ;
		a++
	)
	{
		switch( arguments[ a ] )
		{
			case 'at1' :

				at1 =
					arguments[ ++a ];

				break;
			
			case 'bAt1' :

				bAt1 =
					arguments[ ++a ];

				break;

			case 'bPath' :

				bPath =
					arguments[ ++a ];

				break;

			case 'eAt1' :

				eAt1 =
					arguments[ ++a ];

				break;

			case 'ePath' :

				ePath =
					arguments[ ++a ];

				break;

			case 'form' :

				form =
					arguments[ ++a ];

				break;

			case 'null' :

				setnull =
					true;

				break;

			case 'section' :

				section =
					arguments[ ++a ];

				break;

			case 'sign' :

				sign =
					arguments[ ++a ];

				break;

			case 'type' :

				type =
					arguments[ ++a ];

				break;

			case 'path' :

				path =
					arguments[ ++a ];

				break;

			case 'retainx' :

				retainx =
					arguments[ ++a ];

				break;

			default :

				throw new Error(
					'invalid argument: ' + arguments[ a ]
				);

		}
	}

	if( CHECK )
	{
		if( command !== 'set' )
		{
			throw new Error(
				'userMark command not "set"'
			);
		}
	}


	switch( type )
	{
		case 'caret' :

			if( CHECK )
			{
				if(
					( sign === null )
					&&
					( path === null || at1 === null )
				)
				{
					throw new Error(
						'set caret, sign and path/at1 === null'
					);
				}

				if(
					bAt1  !== null ||
					bPath !== null ||
					eAt1  !== null ||
					ePath !== null
				)
				{
					throw new Error(
						'set caret, but with range signature'
					);
				}
			}

			if( sign === null )
			{
				sign =
					new Sign(
						null,
						'path',
							path,
						'at1',
							at1
					);
			}

			mark =
				Mark.Caret.create(
					sign,
					retainx
				);

			this._$caretBlink =
				false;

			system.restartBlinker( );

			break;

		case 'range' :

			if( CHECK )
			{
				if(
					at1  !== null ||
					path !== null
				)
				{
					throw new Error(
						'set range, but with caret signature'
					);
				}
			}

			mark =
				Mark.Range.create(
					shell.space.getSub(
						bPath,
						'Doc'
					),
					new Sign(
						null,
						'path',
							bPath,
						'at1',
							bAt1
					),
					new Sign(
						null,
						'path',
							ePath,
						'at1',
							eAt1
					)
				);

			break;

		case 'item' :

			// TODO mark should not be a caret;
			mark =
				Mark.Caret.create(
					new Sign(
						null,
						'path',
							path
					)
				);

			break;

		default :

			if( !setnull )
			{
				throw new Error(
					'type missing'
				);
			}
			else
			{
				mark =
					Mark.Vacant.create( );
			}
	}


	switch( section )
	{
		case 'space' :

			this.$space =
				Visual.Space.create(
					'inherit',
						this.$space,
					'mark',
						mark
				);

			break;

		case 'forms' :

			name =
				setnull ?
					form :
					mark.sign.path.get( 0 ),

			formname =
				this._formNames[ name ];

			if( CHECK && !formname )
			{
				throw new Error(
					'invalid form: ' + name
				);
			}

			if( CHECK && !this._$forms[ formname ] )
			{
				throw new Error(
					'invalid formname: ' + formname
				);
			}

			this._$forms[ formname ] =
				new Forms[ formname ](
					'screensize',
						this.screensize,
					'inherit',
						this._$forms[ formname ],
					'userMark',
						mark
				);

			break;
	}

	this.redraw =
		true;
};


/*
| Sets the attribute of an item
*/
Shell.prototype.setAttr =
	function(
		key,    // of item
		attr,   // to set
		val     // to set to
	)
{
	this.$space =
		Visual.Space.create(
			'inherit',
				this.$space,
			'alter',
				key,
				attr,
				val
		);
};



/*
| User is pressing a special key.
*/
Shell.prototype.specialKey =
	function(
		key,
		shift,
		ctrl
	)
{
	var
		display =
			this._getCurrentDisplay( );

	if( display )
	{
		display.specialKey(
			key,
			shift,
			ctrl
		);
	}

	if( this.redraw )
	{
		this._draw( );
	}
};


/*
| User entered normal text (one character or more).
*/
Shell.prototype.input =
	function(
		text
	)
{
	var
		display =
			this._getCurrentDisplay( );

	if( display )
	{
		display.input( text );
	}

	if( this.redraw )
	{
		this._draw( );
	}
};


/*
| The window has been resized.
*/
Shell.prototype.resize =
	function(
		width,
		height
	)
{
	var
		screensize =
		this.screensize =
			shellverse.grow(
				'Point',
				'x',
					width,
				'y',
					height
			);

	// TODO only when changed
	this._$disc =
		new Disc.MainDisc(
			this._$disc,
			Design.MainDisc,
			screensize
		);

	this._draw( );
};


/*
| Sets the current user
*/
Shell.prototype.setUser =
	function(
		user,
		passhash
	)
{
	this.$user =
		user;

	this.peer.setUser(
		user,
		passhash
	);

	if( user.substr( 0, 5 ) !== 'visit' )
	{
		window.localStorage.setItem(
			'user',
			user
		);

		window.localStorage.setItem(
			'passhash',
			passhash
		);
	}
	else
	{
		if(
			this.$space &&
			this.$space.spaceUser !== 'meshcraft'
		)
		{
			this.moveToSpace(
				'meshcraft',
				'home',
				false
			);
		}

		window.localStorage.setItem(
			'user',
			null
		);

		window.localStorage.setItem(
			'passhash',
			null
		);
	}

	this.bridge.setUsername( user );

	this._$disc.setUser( user );

	this._$forms.User.setUsername( user );

	this._$forms.Welcome.setUsername( user );

	this._$forms.MoveTo.setUsername( user );
};


/*
| Sets the space zoom factor.
*/
Shell.prototype.setSpaceZoom =
	function(
		zf
	)
{
	this._$disc.setSpaceZoom( zf );
};


/*
| Changes the space zoom factor (around center)
*/
Shell.prototype.changeSpaceZoom =
	function(
		df
	)
{
	if( !this.$space )
	{
		return;
	}

	this.$space.changeZoom( df );
};


/*
| Called when loading the website
*/
Shell.prototype.onload =
	function( )
{
	this.peer =
		new Peer(
			new IFace(
				this,
				this
			)
		);

	var
		user =
			window.localStorage.getItem( 'user' ),

		passhash =
			null;

	if( user )
	{
		passhash =
			window.localStorage.getItem( 'passhash' );
	}
	else
	{
		user =
			'visitor';
	}

	this.peer.auth(
		user,
		passhash,
		this
	);
};


/*
| Moves to space with the name name.
|
| if name is null, reloads current space.
*/
Shell.prototype.moveToSpace =
	function(
		spaceUser,
		spaceTag,
		create
	)
{
	// TODO make message a function of shell
	this._$disc.message(
		'Moving to ' + spaceUser + ':' + spaceTag + ' ...'
	);

	this.peer.aquireSpace(
		spaceUser,
		spaceTag,
		create,
		this
	);
};


/*
| Receiving a moveTo event
*/
Shell.prototype.onAquireSpace =
	function(
		asw
	)
{
	switch( asw.status ) {

		case 'served' :

			break;

		case 'nonexistent' :

			this._$forms.NonExistingSpace.setSpace(
				asw.spaceUser,
				asw.spaceTag
			);

			shell.bridge.changeMode( 'NonExistingSpace' );

			this.redraw =
				true;

			return;

		case 'no access' :

			this._$forms.NoAccessToSpace.setSpace(
				asw.spaceUser,
				asw.spaceTag
			);

			shell.bridge.changeMode( 'NoAccessToSpace' );

			this.redraw =
				true;

			return;

		case 'connection fail' :

			this.greenscreen(
				'Connection failed: ' +
				asw.message
			);

			return;

		default :

			this.greenscreen(
				'Unknown aquireSpace() status: ' +
				asw.status + ': ' + asw.message
			);

			return;
	}

	var
		spaceUser =
			asw.spaceUser,

		spaceTag =
			asw.spaceTag,

		tree =
			asw.tree,

		access =
			asw.access;

	this.$space =
		Visual.Space.create(
			'tree',
				tree,
			'spaceUser',
				spaceUser,
			'spaceTag',
				spaceTag,
			'access',
				access,
			'mark',
				Mark.Vacant.create( )
		);

	this.arrivedAtSpace(
		spaceUser,
		spaceTag,
		access
	);

	this._$disc.setSpaceZoom( 0 );

	this._draw( );
};


/*
| answer to on 'auth' operation.
*/
Shell.prototype.onAuth =
	function(
		user,
		passhash,
		res
	)
{
	if( !res.ok )
	{
		// when logging in with a real user failed
		// takes a visitor instead
		if( user !== 'visitor' )
		{
			this.peer.auth(
				'visitor',
				null,
				this
			);

			return;
		}

		// if even that failed, bailing to greenscreen
		this.greenscreen( res.message );

		return;
	}

	this.setUser(
		res.user,
		res.passhash
	);

	if( !this.$space )
	{
		this.moveToSpace(
			'meshcraft',
			'home',
			false
		);
	}
};


/*
| Gets the current caret.
*/
Shell.prototype.getCaret =
	function( )
{
	var
		display =
			this._getCurrentDisplay( );

	if( display === this.space )
	{
		return display.caret; // TODO XXX
	}

	return display && display.userMark;
};


/*
| Logs out the current user
*/
Shell.prototype.logout =
	function( )
{
	var
		self =
			this;

	this.peer.logout(
		function( res )
		{
			if(! res.ok )
			{
				self.greenscreen(
					'Cannot logout: ' + res.message
				);

				return;
			}

			self.setUser(
				res.user,
				res.passhash
			);

			self.moveToSpace(
				'meshcraft',
				'home',
				false
			);
		}
	);
};


/*
| Sets the selection.
*/
/*
Shell.prototype.s_etSelection =
	function(
		doc,
		bSign,
		eSign
	)
{
	if( CHECK && !bSign )
	{
		throw new Error( 'bSign null' );
	}

	if( CHECK && !eSign )
	{
		throw new Error( 'eSign null' );
	}

	var
		selection =
		this._$s_election =
			new Range(
				doc,
				bSign,
				eSign
			);

	system.setInput(
		selection.innerText(
			this.$space
		)
	);

	return selection;
};
*/

/*
| A space finished loading.
*/
Shell.prototype.arrivedAtSpace =
	function(
		spaceUser,
		spaceTag,
		access
	)
{
	this._$disc.arrivedAtSpace(
		spaceUser,
		spaceTag,
		access
	);

	this._$forms.Space.arrivedAtSpace(
		spaceUser,
		spaceTag,
		access
	);

	this.bridge.changeMode( 'Normal' );
};


/*
| Removes the selection including its contents.
| XXX remove
*/
/*
Shell.prototype.r_emoveSelection =
	function( )
{
	var
		selection =
			this._$s_election;

	if( !selection )
	{
		return;
	}

	selection.normalize( this.$space );

	this.d_eselect( );

	this.redraw =
		true;

	if( !selection.empty )
	{
		this.peer.removeSpan(
			selection.$begin.path,
			selection.$begin.at1,

			selection.$end.path,
			selection.$end.at1
		);
	}

	return;
};
*/

} )( );
