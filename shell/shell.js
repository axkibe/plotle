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
	Discs,
	Euclid,
	fontPool,
	Forms,
	GreenScreen,
	IFace,
	Jools,
	Mark,
	MeshMashine,
	Path,
	Peer,
	Sign,
	system,
	swatch,
	TraitSet,
	Visual;


/*
| Capsule
*/
( function() {
'use strict';


/*
| Valid modes
*/
var
	_modes;

/**/if( CHECK )
/**/{
/**/	_modes =
/**/		Object.freeze( {
/**/
/**/			// Creating a new item.
/**/			'Create' :
/**/				true,
/**/
/**/			// Help.
/**/			'Help' :
/**/				true,
/**/
/**/			// Logging in.
/**/			'Login' :
/**/				true,
/**/
/**/			// Moveing To another space.
/**/			'MoveTo' :
/**/				true,
/**/
/**/			// Standard selection, moving stuff around.
/**/			'Normal' :
/**/				true,
/**/
/**/			// User does not have access to a space.
/**/			'NoAccessToSpace' :
/**/				true,
/**/
/**/			// Space does not exist,
/**/			// but user is allowed to create it.
/**/			'NonExistingSpace' :
/**/				true,
/**/
/**/			// Signing up
/**/			'SignUp' :
/**/				true,
/**/
/**/			// Space view
/**/			'Space' :
/**/				true,
/**/
/**/			// User view
/**/			'User' :
/**/				true,
/**/
/**/			// Welcome view
/**/			'Welcome' :
/**/				true
/**/
/**/		} );
/**/}


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

	this.fabric =
		fabric;

	this.username =
		null;

	this.$space =
		null;

	this.$action =
		Action.None.create( );

	this._$mode =
		'Normal';

	// currently hovered thing
	this._$hover =
		Path.empty;

	var
		screensize =
		this.screensize =
			Euclid.Point.create(
				'x',
					fabric.width,
				'y',
					fabric.height
			);

	this._$formJockey =
		Forms.Jockey.create(
			'hover',
				Path.empty,
			'mark',
				Mark.Vacant.create( ),
			'screensize',
				screensize,
			'path',
				Path.empty.append( 'forms' )
		);

	this._$discJockey =
		Discs.Jockey.create(
			'access',
				'',
			'action',
				Action.None.create( ),
			'hover',
				Path.empty,
			'mark',
				Mark.Vacant.create( ),
			'mode',
				this._$mode,
			'path',
				Path.empty.append( 'discs' ),
			'screensize',
				screensize,
			'username',
				null,
			'spaceUser',
				null,
			'spaceTag',
				null
		);

	// greenscreen display if not null
	this._$greenscreen =
		null;

	this.mark =
		Mark.Vacant.create( );

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
| TODO, workaround until $action is gone
*/
Object.defineProperty(
	Shell.prototype,
	'action',
	{
		get :
			function( )
			{
				return this.$action;
			}
	}
);


/*
| Peer received a message.
*/
Shell.prototype.messageRCV =
	function(
		// space,
		// user,
		// message
	)
{
	/*
	if( user )
	{
		this._$d_isc.message( user + ': ' + message );
	}
	else
	{
		this._$d_isc.message( message );
	}
	*/
};


/*
| Changes the mode.
*/
Shell.prototype.setMode =
	function(
		mode
	)
{
	if( CHECK )
	{
		if( !_modes[ mode ] )
		{
			throw new Error(
				'invalid mode : ' + mode
			);
		}
	}

	this._$mode =
		mode;

	this._$discJockey =
		Discs.Jockey.create(
			'inherit',
				this._$discJockey,
			'mode',
				mode
		);

	this._$redraw =
		true;
};


/*
| Sets the current action.
*/
Shell.prototype.setAction =
	function(
		action
	)
{

/**/if ( CHECK )
/**/{
/**/	if( !action || !Action.isAction( action.reflect ) )
/**/	{
/**/		throw new Error(
/**/			'invalid action'
/**/		);
/**/	}
/**/}

	this.$action =
		action;

	this._$discJockey =
		Discs.Jockey.create(
			'inherit',
				this._$discJockey,
			'action',
				action
		);

	this._$redraw =
		true;
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

		mItemTree;


	switch( mark.reflect )
	{
		case 'Caret' :

			mItemTree =
				tree.twig[ mark.path.get( 1 ) ];

			if (
				!Jools.is( mItemTree )
			)
			{
				// the item holding the caret was removed
				mark =
					Mark.Vacant.create( );
			}
			else
			{
				var
					sign =
						MeshMashine.tfxSign(
							new Sign(
								{
									path :
										mark.path.chop( ),

									at1 :
										mark.at
								}
							),
							chgX
						);

				// FIXME
				//   keeping retainx might not be correct
				//   in some cases
				mark =
					Mark.Caret.create(
						'path',
							sign.path.prepend( 'space' ),
						'at',
							sign.at1,
						'retainx',
							mark.retainx
					);
			}

			break;

		case 'Range' :

			mItemTree =
				tree.twig[ mark.bPath.get( 1 ) ];

			// tests if the owning item was removed
			if(
				!Jools.is( mItemTree )
			)
			{
				mark =
					Mark.Vacant.create( );
			}
			else
			{
				var
					bSign =
						MeshMashine.tfxSign(
							new Sign(
								{
									path :
										mark.bPath.chop( ),

									at1 :
										mark.bAt
								}
							),
							chgX
						),

					eSign =
						MeshMashine.tfxSign(
							new Sign(
								{
									path :
										mark.bPath.chop( ),

									at1 :
										mark.eAt
								}
							),
							chgX
						);

					// tests if the range collapsed to a simple caret.
					if(
						bSign.path.equals( eSign.path ) &&
						bSign.at1 === eSign.at1
					)
					{
						mark =
							Mark.Caret.create(
								'path',
									bSign.path.prepend( 'space' ),
								'at',
									bSign.at1,
								'retainx',
									mark.retainx
							);
					}
					else
					{
						mark =
							Mark.Range.create(
								'docTree',
									mItemTree.twig.doc,
								'bPath',
									bSign.path.prepend( 'space' ),
								'bAt',
									bSign.at1,
								'ePath',
									eSign.path.prepend( 'space' ),
								'eAt',
									eSign.at1,
								'retainx',
									mark.retainx
							);
					}
			}

			break;

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

	this._$discJockey =
		Discs.Jockey.create(
			'inherit',
				this._$discJockey,
			'mark',
				mark
		);

	this._draw( );
};


/*
| The shell got or lost the systems focus.
*/
Shell.prototype.setFocus =
	function(
		focus
	)
{
	switch( this.mark.reflect )
	{
		case 'Caret' :

			this.setMark(
				Mark.Caret.create(
					'inherit',
						this.mark,
					'focus',
						focus
				)
			);

			break;
	}

	if( this._$redraw )
	{
		this._draw( );
	}
};


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
		display.draw( fabric );
	}

	if( display && display.showDisc )
	{
		this._$discJockey.draw( fabric );
	}

	this._$redraw =
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

	if( this._$redraw )
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
			this._$mode;

	if( this._$greenscreen )
	{
		return this._$greenscreen;
	}

	switch( name )
	{
		case 'Create' :
		case 'Normal' :

			return this.$space;

		case 'Login' :
		case 'MoveTo' :
		case 'NoAccessToSpace' :
		case 'NonExistingSpace' :
		case 'SignUp' :
		case 'Space' :
		case 'User' :
		case 'Welcome' :

			return (
				this._$formJockey.get( name )
			);

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
	var
		display =
			this._getCurrentDisplay( ),

		reply =
			null;

	if( display && display.showDisc )
	{
		reply =
			this._$discJockey.pointingHover(
				p,
				shift,
				ctrl
			);

		if( reply )
		{
			if( CHECK )
			{
				if( reply.reflect !== 'HoverReply' )
				{
					throw new Error( 'invalid reply' );
				}
			}

			shell._setHover( reply.path );

			if( this._$redraw )
			{
				this._draw( );
			}

			return reply.cursor;
		}
	}


	if( display )
	{
		reply =
			display.pointingHover(
				p,
				shift,
				ctrl
			);

/**/	if( CHECK )
/**/	{
/**/		if(
/**/			!reply
/**/			||
/**/			reply.reflect !== 'HoverReply'
/**/		)
/**/		{
/**/			throw new Error(
/**/				'invalid reply'
/**/			);
/**/		}
/**/	}

		shell._setHover( reply.path );

		if( this._$redraw )
		{
			this._draw( );
		}

		return reply.cursor;
	}

	if( this._$redraw )
	{
		this._draw( );
	}

	return 'default';
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
			'unknown error';
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
			this._$discJockey.pointingStart(
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

	if( this._$redraw )
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
			this._$discJockey.dragStart(
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

	if( this._$redraw )
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
	var
		action =
			this.action;

	if( !action )
	{
		throw new Error( 'no action on dragMove' );
	}

	var
		cursor =
			null;

	// FIXME dragging for discs / forms

	if( this.$space )
	{
		cursor =
			this.$space.dragMove(
				p,
				shift,
				ctrl
			);
	}

	if( this._$redraw )
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

	var
		action =
			this.action;

	if( !action )
	{
		throw new Error( 'no action on dragStop' );
	}

	// FIXME dragging for discs / forms

	if( this.$space )
	{
		this.$space.dragStop(
			p,
			shift,
			ctrl
		);
	}

	if( this._$redraw )
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

	if( this._$redraw )
	{
		this._draw( );
	}
};


/*
| Sets the user's mark.
*/
Shell.prototype.setMark =
	function(
		mark
	)
{
	system.setInput( mark.clipboard );

	this.mark =
		mark;

	this.$space =
		Visual.Space.create(
			'inherit',
				this.$space,
			'mark',
				mark
		);

	this._$formJockey =
		Forms.Jockey.create(
			'inherit',
				this._$formJockey,
			'mark',
				mark
		);

	this._$discJockey =
		Discs.Jockey.create(
			'inherit',
				this._$discJockey,
			'mark',
				mark
		);

	this._$redraw =
		true;
};


/*
| Cycles focus in a form.
*/
Shell.prototype.cycleFormFocus =
	function(
		name,
		dir
	)
{
	this._$formJockey.cycleFocus(
		name,
		dir
	);
};


/*
| A button has been pushed.
*/
Shell.prototype.pushButton =
	function( path )
{
	switch( path.get( 0 ) )
	{
		case 'discs' :

			return this._$discJockey.pushButton(
				path,
				false,
				false
			);

		case 'forms' :

			return this._$formJockey.pushButton(
				path,
				false,
				false
			);

		default :

			throw new Error( 'invalid path' );
	}
};


/*
| Sets a hovered component.
*/
Shell.prototype._setHover =
	function(
		path
	)
{
	if( this._$hover.equals( path ) )
	{
		return;
	}

	this._$discJockey =
		Discs.Jockey.create(
			'inherit',
				this._$discJockey,
				// FIXME make concernsHover
			'hover',
				path.isEmpty || path.get( 0 ) !== 'discs' ?
					Path.empty
					:
					path
		);

	this._$formJockey =
		Forms.Jockey.create(
			'inherit',
				this._$formJockey,
			'hover',
				// FIXME make a concernsHover
				path.isEmpty || path.get( 0 ) !== 'forms' ?
					Path.empty
					:
					path
		);

	this.$space =
		Visual.Space.create(
			'inherit',
				this.$space,
			'hover',
				path.isEmpty || path.get( 0 ) !== 'space' ?
					Path.empty
					:
					path
		);

	this._$hover =
		path;

	shell._$redraw =
		true;
};


/*
| Sets the trait(s) of item(s).
*/
Shell.prototype.setTraits =
	function(
		traitSet
	)
{
	if( CHECK )
	{
		if( traitSet.reflect !== 'TraitSet' )
		{
			throw new Error(
				'invalid traitSet'
			);
		}
	}

	// TODO precheck which traitSet affect
	this._$formJockey =
		Forms.Jockey.create(
			'inherit',
				this._$formJockey,
			'traitSet',
				traitSet
		);

	this.$space =
		Visual.Space.create(
			'inherit',
				this.$space,
			'traitSet',
				traitSet
		);

	shell._$redraw =
		true;
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

	if( this._$redraw )
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

	if( this._$redraw )
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
			Euclid.Point.create(
				'x',
					width,
				'y',
					height
			);

	this._$discJockey =
		Discs.Jockey.create(
			'inherit',
				this._$discJockey,
			'screensize',
				screensize
		);

	this._$formJockey =
		Forms.Jockey.create(
			'inherit',
				this._$formJockey,
			'screensize',
				screensize
		);

	this._draw( );
};


/*
| Sets the current user
*/
Shell.prototype.setUser =
	function(
		username,
		passhash
	)
{
	this.peer.setUser(
		username,
		passhash
	);

	if( username.substr( 0, 5 ) !== 'visit' )
	{
		window.localStorage.setItem(
			'username',
			username
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
			'username',
			null
		);

		// FIXME remove
		window.localStorage.setItem(
			'user',
			null
		);

		window.localStorage.setItem(
			'passhash',
			null
		);
	}

	// TODO
	this.username =
		username;

	this._$discJockey =
		Discs.Jockey.create(
			'inherit',
				this._$discJockey,
			'username',
				username
		);

	this._$formJockey =
		Forms.Jockey.create(
			'inherit',
				this._$formJockey,
			'traitSet',
				TraitSet.create(
					'trait',
						this._$formJockey.get( 'User' ).path,
						'user',
						username,
					'trait',
						this._$formJockey.get( 'Welcome' ).path,
						'user',
						username,
					'trait',
						this._$formJockey.get( 'MoveTo' ).path,
						'user',
						username
				),
			'username',
				username
		);
};


/*
| Sets the current view ( of the space )
*/
Shell.prototype.setView =
	function(
		view
	)
{
	this.$space =
		Visual.Space.create(
			'inherit',
				this.$space,
			'view',
				view
		);

	this._$redraw =
		true;
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
		username =
			window.localStorage.getItem( 'username' ),

		passhash =
			null;

	if( username )
	{
		passhash =
			window.localStorage.getItem( 'passhash' );
	}
	else
	{
		username =
			'visitor';
	}

	this.peer.auth(
		username,
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
	this._$discJockey.message(
		'Moving to ' + spaceUser + ':' + spaceTag + ' ...'
	);

	this.peer.aquireSpace(
		spaceUser,
		spaceTag,
		create
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
	var
		path;

	switch( asw.status )
	{
		case 'served' :

			break;

		case 'nonexistent' :

			path =
				this._$formJockey.get( 'NonExistingSpace' ).path;

			this._$formJockey =
				Forms.Jockey.create(
					'inherit',
						this._$formJockey,
					'traitSet',
						TraitSet.create(
							'trait',
								path,
								'spaceUser',
								asw.spaceUser,
							'trait',
								path,
								'spaceTag',
								asw.spaceTag
							)
				);

			shell.setMode( 'NonExistingSpace' );

			this._draw( );

			return;

		case 'no access' :

			// TODO remove get
			path =
				this._$formJockey.get( 'NoAccessToSpace' ).path;

			this._$formJockey =
				Forms.Jockey.create(
					'inherit',
						this._$formJockey,
					'traitSet',
						TraitSet.create(
							'trait',
								path,
								'spaceUser',
								asw.spaceUser,
							'trait',
								path,
								'spaceTag',
								asw.spaceTag
						)
				);

			shell.setMode( 'NoAccessToSpace' );

			this._draw( );

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
			'hover',
				Path.empty,
			'mark',
				Mark.Vacant.create( ),
			'view',
				new Euclid.View(
					Euclid.Point.zero,
					0
				)
		);

	this.arrivedAtSpace(
		spaceUser,
		spaceTag,
		access
	);

	this._draw( );
};


/*
| answer to on 'auth' operation.
*/
Shell.prototype.onAuth =
	function(
		username,
		passhash,
		res
	)
{
	if( !res.ok )
	{
		// when logging in with a real user failed
		// takes a visitor instead
		if( username !== 'visitor' )
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
| A space finished loading.
*/
Shell.prototype.arrivedAtSpace =
	function(
		spaceUser,
		spaceTag,
		access
	)
{
	this._$discJockey =
		Discs.Jockey.create(
			'inherit',
				this._$discJockey,
			'access',
				access,
			'spaceUser',
				spaceUser,
			'spaceTag',
				spaceTag
		);

	// FIXME make spaceUser spaceTag normal attributes
	var
		spaceFormPath =
			this._$formJockey.get( 'Space' ).path; // FIXME

	this._$formJockey =
		Forms.Jockey.create(
			'inherit',
				this._$formJockey,
			'traitSet',
				TraitSet.create(
					'trait',
						spaceFormPath,
						'spaceUser',
						spaceUser,
					'trait',
						spaceFormPath,
						'spaceTag',
						spaceTag
				)
		);

	shell.setMode( 'Normal' );
};


/*
| Removes the a (text) range.
|
| TODO hmmm
*/
Shell.prototype.removeRange =
	function(
		range
	)
{
	this._$redraw =
		true;

	if( !range.empty )
	{
		this.peer.removeSpan(
			range.frontPath,
			range.frontAt,

			range.backPath,
			range.backAt
		);
	}

	return;
};


} )( );
