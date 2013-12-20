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
	Bridge,
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
	shellverse,
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

	this._$formJockey =
		Forms.Jockey.create(
			'screensize',
				screensize,
			'mark',
				Mark.Vacant.create( ),
			'hover',
				Path.empty
		);

	this._$discJockey =
		Discs.Jockey.create(
			'screensize',
				screensize,
			'hover',
				Path.empty
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
				tree.twig[ mark.path.get( 0 ) ];

			// tests if the owning item was removed
			if (
				!Jools.is( mItemTree )
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
							new Sign(
								{
									path :
										mark.path,

									at1 :
										mark.at
								}
							),
							chgX
						);

				// TODO keeping retainx might not be correct
				//      in some cases
				mark =
					Mark.Caret.create(
						sign.path,
						sign.at1,
						mark.retainx
					);
			}

			break;

		case 'Range' :

			mItemTree =
				tree.twig[ mark.bPath.get( 0 ) ];

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
										mark.bPath,

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
										mark.ePath,

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
								bSign.path,
								bSign.at1,
								mark.retainx
							);
					}
					else
					{
						mark =
							Mark.Range.create(
								mItemTree.twig.doc,
								bSign.path,
								bSign.at1,
								eSign.path,
								eSign.at1,
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
			this._$haveSystemFocus
		);
	}

	if( display && display.showDisc )
	{
		this._$discJockey.draw(
			fabric,
			this._$haveSystemFocus
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
			this._$discJockey.pointingHover(
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
				this._$discJockey.dragMove(
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

			this._$discJockey.dragStop(
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
		at =
			null,

		bAt =
			null,

		bPath =
			null,

		eAt =
			null,

		ePath =
			null,

		mark =
			null,

		path =
			null,

		section =
			null,

		setnull =
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
			case 'at' :

				at =
					arguments[ ++a ];

				break;

			case 'bAt' :

				bAt =
					arguments[ ++a ];

				break;

			case 'bPath' :

				bPath =
					arguments[ ++a ];

				break;

			case 'eAt' :

				eAt =
					arguments[ ++a ];

				break;

			case 'ePath' :

				ePath =
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
					( path === null || at === null )
				)
				{
					throw new Error(
						'set caret, path/at === null'
					);
				}

				if(
					bAt  !== null ||
					bPath !== null ||
					eAt  !== null ||
					ePath !== null
				)
				{
					throw new Error(
						'set caret, but with range signature'
					);
				}
			}

			mark =
				Mark.Caret.create(
					path,
					at,
					retainx
				);

			system.restartBlinker( );

			break;

		case 'range' :

			if( CHECK )
			{
				if(
					at  !== null ||
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
					shell.space.tree.twig[ bPath.get( 0 ) ].twig.doc,
					bPath,
					bAt,
					ePath,
					eAt,
					retainx
				);

			break;

		case 'item' :

			// TODO mark should not be a caret;
			mark =
				Mark.Caret.create(
					path,
					null,
					null
				);

			break;

		case 'vacant' :

			mark =
				Mark.Vacant.create( );

			break;

		default :

			throw new Error(
				'invalid mark'
			);
	}


	// FIXME integrate section into paths of the mark

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

			this._$formJockey =
				Forms.Jockey.create(
					'inherit',
						this._$formJockey,
					'mark',
						Mark.Vacant.create( )
				);

			break;

		case 'forms' :

			this.$space =
				Visual.Space.create(
					'inherit',
						this.$space,
					'mark',
						Mark.Vacant.create( )
				);

			this._$formJockey =
				Forms.Jockey.create(
					'inherit',
						this._$formJockey,
					'mark',
						mark
				);

			break;
	}

	this.redraw =
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
	function(
		section,
		path
	)
{
	switch( section )
	{
		case 'disc' :

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

			throw new Error(
				'section must be form'
			);
	}
};


/*
| Sets a hovered component.
*/
Shell.prototype.setHover =
	function(
		section, // TODO remove
		path
	)
{
	switch( section )
	{
		case 'disc' :

			this._$discJockey =
				Discs.Jockey.create(
					'inherit',
						this._$discJockey,
					'hover',
						path
				);

			break;

		case 'forms' :

			this._$formJockey =
				Forms.Jockey.create(
					'inherit',
						this._$formJockey,
					'hover',
						path
				);

			break;

		default :

			throw new Error(
				'invalid section'
			);
	}

	shell.redraw =
		true;
};


/*
| Sets the trait(s) of item(s).
*/
Shell.prototype.setTraits =
	function(
		section,
		traitSet
	)
{
	switch( section )
	{
		case 'forms' :

			this._$formJockey =
				Forms.Jockey.create(
					'inherit',
						this._$formJockey,
					'traitSet',
						traitSet
				);

			break;

		case 'space' :

			this.$space =
				Visual.Space.create(
					'inherit',
						this.$space,
					'traitSet',
						traitSet
				);

			break;

		default :

			throw new Error(
				'invalid section'
			);
	}

	shell.redraw =
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

	this._$discJockey.setUser( user );

	this._$formJockey =
		Forms.Jockey.create(
			'inherit',
				this._$formJockey,
			'traitSet',
				TraitSet.create(
					'trait',
						this._$formJockey.get( 'User' ).path,
						'user',
						user,
					'trait',
						this._$formJockey.get( 'Welcome' ).path,
						'user',
						user,
					'trait',
						this._$formJockey.get( 'MoveTo' ).path,
						'user',
						user
				)
		);
};


/*
| Sets the space zoom factor.
*/
Shell.prototype.setSpaceZoom =
	function(
		zf
	)
{
	this._$discJockey.setSpaceZoom( zf );
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

			shell.bridge.changeMode( 'NonExistingSpace' );

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

			shell.bridge.changeMode( 'NoAccessToSpace' );

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
			'mark',
				Mark.Vacant.create( )
		);

	this.arrivedAtSpace(
		spaceUser,
		spaceTag,
		access
	);

	this._$discJockey.setSpaceZoom( 0 );

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
	// TODO
	this._$discJockey.arrivedAtSpace(
		spaceUser,
		spaceTag,
		access
	);

	var
		spaceFormPath =
			this._$formJockey.get( 'Space' ).path; // TODO

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

	this.bridge.changeMode( 'Normal' );
};


/*
| Removes the selection including its contents.
*/
Shell.prototype.removeRange =
	function(
		range
	)
{
	this.redraw =
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
