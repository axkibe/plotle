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

/**/if( CHECK )
/**/{
/**/	if( shell !== null )
/**/	{
/**/		throw new Error(
/**/			'Singleton not single'
/**/		);
/**/	}
/**/}

	shell =
		this;

	var
		canvas =
			document.createElement( 'canvas' );

	swatch =
		Euclid.Fabric.create(
			'canvas',
				canvas
		);

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
		view =
		this.$view =
			Euclid.View.create(
				'pan',
					Euclid.Point.zero,
				'fact',
					0,
				'width',
					fabric.width,
				'height',
					fabric.height
			);

	this._$formJockey =
		Forms.Jockey.create(
			'hover',
				Path.empty,
			'mark',
				Mark.Vacant.create( ),
			'path',
				Path.empty.append( 'forms' ),
			'view',
				view
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
			'spaceUser',
				null,
			'spaceTag',
				null,
			'username',
				null,
			'view',
				view
		);

	this.mark =
		Mark.Vacant.create( );

	this._draw( );
};


/*
| FIXME, workaround until $space is gone
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
| FIXME, workaround until $action is gone
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
Shell.prototype.message =
	function(
		// space,
		// user,
		// message
	)
{
	// FIXME
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
		this._$discJockey.create(
			'mode',
				mode
		);

	this._$redraw =
		true;
};


/*
| Returns the attention center.
|
| That is the horiziontal offset of the caret.
|
| Used for example on the iPad so
| the caret is scrolled into view
| when the keyboard is visible.
*/
Object.defineProperty(
	Shell.prototype,
	'attentionCenter',
	{
		get :
			function( )
			{
				return (
					this._getCurrentDisplay( ).attentionCenter
				);
			}
	}
);


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
		this._$discJockey.create(
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

		case 'Item' :

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
										mark.ePath.chop( ),

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
		this.$space.create(
			'tree',
				tree,
			'mark',
				mark
		);

	this._$discJockey =
		this._$discJockey.create(
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
				this.mark.create(
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

	fabric.clear( );

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
| User clicked.
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
			this._getCurrentDisplay( ),

		click =
			this._$discJockey.click(
				p,
				shift,
				ctrl
			);

	if( click === null )
	{
		if( display )
		{
			display.click(
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
		throw new Error(
			CHECK && 'no action on dragMove'
		);
	}

	var
		cursor =
			null,
	
		display =
			this._getCurrentDisplay( );

	if( display )
	{
		cursor =
			display.dragMove(
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
	var
		action =
			this.action;

	if( !action )
	{
		throw new Error(
			CHECK && 'no action on dragStop'
		);
	}

	var
		display =
			this._getCurrentDisplay( );

	if( display )
	{
		display.dragStop(
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
| Returns true if the iPad ought to display
| the virtual keyboard
*/
Shell.prototype.suggestingKeyboard =
	function( )
{
	return this.mark.hasCaret;
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
		this.$space.create(
			'mark',
				mark
		);

	this._$formJockey =
		this._$formJockey.create(
			'mark',
				mark
		);

	this._$discJockey =
		this._$discJockey.create(
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
		this._$discJockey.create(
			// FIXME make concernsHover
			'hover',
				path.isEmpty || path.get( 0 ) !== 'discs' ?
					Path.empty
					:
					path
		);

	this._$formJockey =
		this._$formJockey.create(
			'hover',
				// FIXME make a concernsHover
				path.isEmpty || path.get( 0 ) !== 'forms' ?
					Path.empty
					:
					path
		);

	this.$space =
		this.$space.create(
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

	// FIXME precheck which traitSet affect
	this._$formJockey =
		this._$formJockey.create(
			'traitSet',
				traitSet
		);

	this.$space =
		this.$space.create(
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

	var
		focusItem =
			this.$space.focusedItem( );

	if( focusItem && focusItem.scrollMarkIntoView )
	{
		focusItem.scrollMarkIntoView( );
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

		var
			focusItem =
				this.$space.focusedItem( );

		if( focusItem && focusItem.scrollMarkIntoView )
		{
			focusItem.scrollMarkIntoView( );
		}
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
		fabric
	)
{
	this.fabric =
		fabric;

	this.setView(
		this.$view.create(
			'height',
				fabric.height,
			'width',
				fabric.width
		)
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

	this.username =
		username;

	this._$discJockey =
		this._$discJockey.create(
			'username',
				username
		);

	this._$formJockey =
		this._$formJockey.create(
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
	this.$view =
		view;

	if( this.$space )
	{
		this.$space =
			this.$space.create(
				'view',
					view
			);
	}

	this._$discJockey =
		this._$discJockey.create(
			'view',
				view
		);

	this._$formJockey =
		this._$formJockey.create(
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
		new Peer( new IFace( ) );

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
	/*
	message(
		'Moving to ' + spaceUser + ':' + spaceTag + ' ...'
	);
	*/

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
				this._$formJockey.create(
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

			// FIXME remove get
			path =
				this._$formJockey.get( 'NoAccessToSpace' ).path;

			this._$formJockey =
				this._$formJockey.create(
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

			system.failScreen(
				'Connection failed: ' +
				asw.message
			);

			return;

		default :

			system.failScreen(
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
			'path',
				Path.empty.append( 'space' ),
			'view',
				Euclid.View.create(
					'fact',
						0,
					'height',
						this.fabric.height,
					'pan',
						Euclid.Point.zero,
					'width',
						this.fabric.width
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

		// if even that failed, bailing to failScreen
		system.failScreen( res.message );

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
				system.failScreen(
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
		this._$discJockey.create(
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
		this._$formJockey.create(
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


} )( );
