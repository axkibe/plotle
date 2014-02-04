/*
| The visual space.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Visual;


Visual =
	Visual || { };


/*
| Imports
*/
var
	Action,
	Euclid,
	HoverReply,
	Mark,
	meshverse,
	Path,
	shell,
	Stubs,
	theme;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	_tag =
		'SPACE-38170216';

/*
| Constructor
*/
var Space =
Visual.Space =
	function(
		tag,
		tree,
		inherit,
		spaceUser,
		spaceTag,
		access,
		hover,
		mark,
		view,
		traitSet
	)
{
	Jools.logNew(
		this,
		this.path
	);

	if( CHECK )
	{
		if( tag !== _tag )
		{
			throw new Error(
				'tag mismatch'
			);
		}

		if(
			!hover
			||
			hover.reflect !== 'Path'
		)
		{
			throw new Error(
				'invalid hover'
			);
		}

		if( !mark )
		{
			throw new Error(
				'mark must be valid'
			);
		}

		if( !tree )
		{
			throw new Error(
				'tree must be valid'
			);
		}
	}

	this.tree =
		tree;

	this.spaceUser =
		spaceUser;

	this.spaceTag =
		spaceTag;

	this.access =
		access;

	this.hover =
		hover;

	this.mark =
		mark;

	this.view =
		view;

	var
		sub =
			{ };

	for( var k in tree.twig )
	{
		if( k === 'type' )
		{
			continue;
		}

		sub[ k ] =
			this._createItem(
				tree.twig[ k ],
				k,
				inherit && inherit.sub[ k ],
				traitSet
			);
	}

	this.sub =
		sub;

	Jools.immute( this );
};


/*
| Creates a space.
*/
Space.create =
	function
	(
		// free strings
	)
{
	var
		access =
			null,

		hover =
			null,

		inherit =
			null,

		mark =
			null,

		spaceTag =
			null,

		spaceUser =
			null,

		traitSet =
			null,

		tree =
			null,

		view =
			null;

	var
		a =
			0,

		aZ =
			arguments.length;

	// FIXME change to for loop
	while( a < aZ )
	{
		switch( arguments[ a ] )
		{
			case 'access' :

				access =
					arguments[ a + 1 ];

				a += 2;

				break;

			case 'hover' :

				hover =
					arguments[ a + 1 ];

				a += 2;

				break;

			case 'traitSet' :

				// sets a (set of) attributes

				if( CHECK )
				{
					if( arguments[ a + 1 ] )
					{
						if( arguments[ a + 1].reflect !== 'TraitSet' )
						{
							throw new Error(
								'traitSet not a traitSet'
							);
						}

						if( traitSet !== null )
						{
							throw new Error(
								'traitSet already set'
							);
						}
					}
				}

				traitSet =
					arguments[ a + 1 ];

				a += 2;

				break;

			case 'inherit' :

				inherit =
					arguments[ a + 1 ];

				a += 2;

				break;

			case 'mark' :

				mark =
					arguments[ a + 1 ];

				a += 2;

				break;

			case 'spaceTag' :

				spaceTag =
					arguments[ a + 1 ];

				a += 2;

				break;

			case 'spaceUser' :

				spaceUser =
					arguments[ a + 1 ];

				a += 2;

				break;

			case 'tree' :

				tree =
					arguments[ a + 1 ];

				a += 2;

				break;

			case 'view' :

				view =
					arguments[ a + 1 ];

				a += 2;

				break;

			default :

				throw new Error(
					CHECK && (
						'invalid argument: ' + arguments[ a ]
					)
				);
		}
	}

	if( mark )
	{
		mark =
			Space.concernsMark(
				mark
			);
	}

	if( inherit )
	{
		if( access === null )
		{
			access =
				inherit.access;
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

		if( spaceTag === null )
		{
			spaceTag =
				inherit.spaceTag;
		}

		if( spaceUser === null )
		{
			spaceUser =
				inherit.spaceUser;
		}

		if( tree === null )
		{
			tree =
				inherit.tree;
		}

		if( view === null )
		{
			view =
				inherit.view;
		}

		if(
			access === inherit.access
			&&
			hover.equals( inherit.hover )
			&&
			mark.equals( inherit.mark )
			&&
			spaceTag === inherit.spaceTag
			&&
			spaceUser === inherit.spaceUser
			&&
			tree === inherit.tree
			&&
			view.equals( inherit.view )
			&&
			(
				traitSet === null
				||
				!traitSet.containsPath( this.path )
			)
		)
		{
			return inherit;
		}
	}

	return (
		new Space(
			_tag,
			tree,
			inherit,
			spaceUser,
			spaceTag,
			access,
			hover,
			mark,
			view,
			traitSet
		)
	);
};



/*
| The disc is shown while a space is shown.
*/
Space.prototype.showDisc =
	true;


/*
| The spaces path ( in the shell )
*/
Space.path =
Space.prototype.path =
	Path.empty.append( 'space' );


/*
| Reflection.
*/
Space.prototype.reflect =
	'Space';


/*
| Returns the mark if the form jockey concerns a mark.
*/
Space.concernsMark =
	function(
		mark
	)
{
	if(
		mark.containsPath(
			Space.path
		)
	)
	{
		return mark;
	}
	else
	{
		return Mark.Vacant.create( );
	}
};


/*
| Returns the focused item.
|
| FIXME handle this more gracefully
*/
Space.prototype.focusedItem =
	function( )
{
	var
		action =
			shell.action,

		mark =
			this.mark,

		path =
			mark.itemPath;

	if( action )
	{
		switch( action.reflect )
		{
			case 'ItemDrag' :
			case 'ItemResize' :

				if( action.transItem.path.subPathOf( path ) )
				{
					return action.transItem;
				}

				break;
		}
	}

	if( path.length > 1 )
	{
		return this.getItem( path.get( 1 ) );
	}
	else
	{
		return null;
	}
};


/*
| Returns an item by its key
*/
Space.prototype.getItem =
	function(
		key
	)
{
	var
		action =
			shell.action;

	switch( action && action.reflect )
	{
		case 'ItemDrag' :
		case 'ItemResize' :

			if( action.transItem.key === key )
			{
				return action.transItem;
			}

			break;
	}

	return this.sub[ key ];
};


/*
| Returns the visual item by a given tree-rank.
*/
Space.prototype.atRank =
	function(
		rank
	)
{
	return this.getItem( this.tree.ranks[ rank ] );
};


/*
| The attention center.
*/
Jools.lazyValue(
	Space.prototype,
	'attentionCenter',
	function( )
	{
		var
			focus =
				this.focusedItem( );

		if( !focus )
		{
			return null;
		}

		return (
			this.view.y(
				focus.attentionCenter
			)
		);
	}
);


/*
| Creates a new visual representation of an item.
*/
Space.prototype._createItem =
	function(
		tree,
		key,
		inherit,
		traitSet
	)
{
	var
		Proto =
			Visual[ tree.twig.type ];


/**/if( CHECK )
/**/{
/**/	if( !Proto )
/**/	{
/**/		throw new Error(
/**/			'unknown type: ' + tree.twig.type
/**/		);
/**/	}
/**/}

	// FIXME; dont create a new path here
	var
		path =
			this.path.appendNC( key );

	return (
		Proto.create(
			'inherit',
				inherit,
			'tree',
				tree,
			'path',
				path,
			'hover',
				path.subPathOf( this.hover ) ?
					this.hover
					:
					Path.empty,
			'mark',
				this.mark,
			'traitSet',
				traitSet,
			'view',
				this.view
		)
	);
};


/*
| Redraws the complete space.
*/
Space.prototype.draw =
	function(
		fabric
	)
{
	var
		tree =
			this.tree,

		view =
			this.view,

		action =
			shell.action;

	for(
		var r = tree.length - 1;
		r >= 0;
		r--
	)
	{
		this.atRank( r ).draw( fabric );
	}

	var
		focus =
			this.focusedItem( );

	if( focus )
	{
		focus.drawHandles(
			fabric,
			view
		);
	}

	switch( action && action.reflect )
	{
		case 'CreateGeneric' :

			if( action.start )
			{
				action.transItem.draw( fabric );
			}

			break;

		case 'CreateRelation' :

			if( !action.fromItemPath.isEmpty )
			{
				var
					fromItem =
						this.getItem(
							action.fromItemPath.get( -1 )
						);

				fromItem.highlight( fabric );

				var
					toItem =
						null;

				if( !action.toItemPath.isEmpty )
				{
					toItem =
						this.getItem(
							action.toItemPath.get( -1 )
						);

					toItem.highlight( fabric );
				}

				var
					fromSilhoutte =
						fromItem.silhoutte,

					toSilhoutte;

				if(
					!action.toItemPath.isEmpty
					&&
					!action.toItemPath.equals( action.fromItemPath )
				)
				{
					// arrow connects two items
					toSilhoutte =
						toItem.silhoutte;
				}
				else if ( action.relationState === 'hadSelect' )
				{
					// arrow points into nowhere
					toSilhoutte =
						view.depoint( action.toPoint );
				}

				if( toSilhoutte )
				{
					var arrow =
						Euclid.Line.connect(
							fromSilhoutte,
							'normal',
							toSilhoutte,
							'arrow'
						);

					arrow.draw(
						fabric,
						view,
						theme.relation.style
					);
				}
			}
			else
			{
				if( !this.hover.isEmpty )
				{
					this
						.getItem( this.hover.get( 1 ) )
						.highlight( fabric );
				}
			}

			break;
	}
};


/*
| Mouse wheel
*/
Space.prototype.mousewheel =
	function(
		p,
		dir,
		shift,
		ctrl
	)
{
	var
		view =
			this.view,

		tree =
			this.tree;

	for(
		var r = 0, rZ = tree.length;
		r < rZ;
		r++
	)
	{
		var item =
			this.atRank(r);

		if (
			item.mousewheel(
				view,
				p,
				dir,
				shift,
				ctrl
			)
		)
		{
			return true;
		}
	}

	if ( dir > 0 )
	{
		shell.setView(
			this.view.review( 1, p )
		);
	}
	else
	{
		shell.setView(
			this.view.review( -1, p )
		);
	}

	return true;
};


/*
| Mouse hover.
|
| Returns true if the mouse pointer hovers over anything.
*/
Space.prototype.pointingHover =
	function(
		p
		// shift,
		// ctrl
	)
{
	var
		view =
			this.view,

		focus =
			this.focusedItem( );

	if( focus )
	{
		var
			com =
				focus.checkHandles(
					view,
					p
				);

		if( com )
		{
			return (
				HoverReply.create(
					'path',
						Path.empty,
					'cursor',
						com + '-resize'
				)
			);
		}
	}

	for(
		var a = 0, aZ = this.tree.length;
		a < aZ;
		a++
	)
	{
		var
			item =
				this.atRank( a ),

			reply =
				item.pointingHover(
					view,
					p
				);

		if( reply )
		{
			return reply;
		}
	}

	return (
		HoverReply.create(
			'path',
				Path.empty,
			'cursor',
				'pointer'
		)
	);
};


/*
| Starts an operation with the mouse button held down.
*/
Space.prototype.dragStart =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		view =
			this.view,

		focus =
			this.focusedItem( );

	// see if the handles were targeted
	if(
		this.access == 'rw' &&
		focus
	)
	{
		var
			dp,
			com =
				focus.checkHandles(
					view,
					p
				);

		if( com )
		{
			// resizing
			dp =
				view.depoint( p );

			shell.setAction(
				Action.ItemResize.create(
					'start',
						dp,
					'transItem',
						focus,
					'origin',
						focus,
					'align',
						com
				)
			);

			return;
		}
	}

	var
		action =
			shell.action,

		item =
			null,

		transItem =
			null;

	// FIXME simplify
	if(
		action &&
		action.reflect === 'CreateGeneric' &&
		action.itemType === 'Note'
	)
	{
		transItem =
			Visual[ action.itemType ].create(
				'zone',
					Euclid.Rect.create(
						'pnw',
							p,  // FIXME why no depoint?
						'pse',
							p
					),
				'doc',
					Visual.Doc.create(
						'tree',
							Stubs.emptyDoc,
						'fontsize',
							theme.note.fontsize,
						'flowWidth',
							0,
						'mark',
							Mark.Vacant.create( ),
						'paraSep',
							Jools.half(
								theme.note.fontsize
							),
						'path',
							Path.empty,
						'view',
							view
					),
				'mark',
					Mark.Vacant.create( ),
				'path',
					Path.empty,
				'view',
					view
			);

		shell.setAction(
			Action.CreateGeneric.create(
				'inherit',
					action,
				'start',
					p,
				'model',
					transItem,
				'transItem',
					transItem
			)
		);

		return;
	}
	else if
	(
		action &&
		action.reflect === 'CreateGeneric' &&
		action.itemType === 'Label'

	)
	{
		transItem =
			Visual[ action.itemType ].create(
				'tree',
					// FIXME elegance
					Stubs.emptyLabel.setPath(
						Path.empty.append( 'pnw' ),
						view.depoint( p ),
						meshverse
					),
				'mark',
					Mark.Vacant.create( ),
				'path',
					Path.empty,
				'view',
					view
			);

		shell.setAction(
			Action.CreateGeneric.create(
				'inherit',
					action,
				'start',
					p,
				'model',
					transItem,
				'transItem',
					transItem
			)
		);

		return;
	}
	else if
	(
		action &&
		action.reflect === 'CreateGeneric' &&
		action.itemType === 'Portal'

	)
	{
		transItem =
			Visual[ action.itemType ].create(
				'hover',
					Path.empty,
				'mark',
					Mark.Vacant.create( ),
				'path',
					Path.empty,
				'view',
					view,
				'zone',
					Euclid.Rect.create(
						'pnw',
							p, //FIXME depoint?
						'pse',
							p
					)
			);

		shell.setAction(
			Action.CreateGeneric.create(
				'inherit',
					action,
				'start',
					p,
				'model',
					transItem,
				'transItem',
					transItem
			)
		);

		return;
	}

	// see if one item was targeted
	for(
		var a = 0, aZ = this.tree.length;
		a < aZ;
		a++
	)
	{
		item =
			this.atRank( a );

		if(
			item.dragStart(
				view,
				p,
				shift,
				ctrl,
				this.access
			)
		)
		{
			return;
		}
	}

	// starts a panning operation instead

	switch( action && action.reflect )
	{
		case 'CreateRelation' :

			shell.setAction(
				Action.CreateRelation.create(
					'inherit',
						action,
					'pan',
						view.pan,
					'relationState',
						'pan',
					'start',
						p
				)
			);

			return;
	}

	// otherwise panning is initiated
	shell.setAction(
		Action.Pan.create(
			'start',
				p,
			'pan',
				view.pan
		)
	);

	return;
};


/*
| A mouse click.
*/
Space.prototype.click =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		view =
			this.view;

	// clicked some item?
	for(
		var a = 0, aZ = this.tree.length;
		a < aZ;
		a++
	)
	{
		var item =
			this.atRank( a );

		if(
			item.click(
				this,
				view,
				p,
				shift,
				ctrl,
				this.access
			)
		)
		{
			return true;
		}
	}

	// otherwise ...

	shell.setMark(
		Mark.Vacant.create( )
	);

	return true;
};


/*
| Stops an operation with the mouse button held down.
*/
Space.prototype.dragStop =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		action =
			shell.action,

		view =
			this.view,

		key,
		result,
		item;

/**/if( CHECK )
/**/{
/**/	if( !action )
/**/	{
/**/		throw new Error(
/**/			'Dragstop without action'
/**/		);
/**/	}
/**/}

	switch( action.reflect )
	{
		case 'CreateGeneric' :

			switch( action.itemType )
			{
				case 'Note' :

					// FIXME move to Note
					// ( and all others creators )

					var
						note =
							Visual.Note.create(
								'inherit',
									action.transItem,
								'zone',
									Euclid.Rect.createArbitrary(
										view.depoint( action.start ),
										view.depoint( p )
									)
							);

					result =
						shell.peer.newNote(
							this.spaceUser,
							this.spaceTag,
							note.zone
						),

					key =
						result.chgX.trg.path.get( -1 );

					shell.setMark(
						Mark.Caret.create(
							'path',
								shell.
									space.sub[ key ].
									sub.doc.
									atRank( 0 ).textPath,
							'at',
								0
						)
					);

					if( !ctrl )
					{
						shell.setAction(
							Action.None.create( )
						);
					}

					break;

				case 'Label' :

					var
						model =
							action.model,

						zone =
							Euclid.Rect.createArbitrary(
								view.depoint( action.start ),
								view.depoint( p )
							),

						oheight =
							model.zone.height,

						dy =
							zone.height - oheight,

						fs =
							Math.max(
								model.sub.doc.fontsize *
									( oheight + dy ) / oheight,
								theme.label.minSize
						),

						resized =
							Visual[ action.transItem.reflect ].create(
								'inherit',
									model,
								'tree',
									// FIXME elegance
									action.transItem.tree.setPath(
										Path.empty.append( 'fontsize' ),
										fs,
										meshverse
									)
							),

						label =
							Visual[ resized.reflect ].create(
								'inherit',
									resized,
								'tree',
									// FIXME elegance
									resized.tree.setPath(
										Path.empty.append( 'pnw' ),
										( p.x > action.start.x ) ?
											zone.pnw
											:
											Euclid.Point.create(
												'x',
													zone.pse.x - resized.zone.width,
												'y',
													zone.pnw.y
											),
										meshverse
									)
							);

					result =
						shell.peer.newLabel(
							this.spaceUser,
							this.spaceTag,
							label.pnw,
							'Label',
							label.sub.doc.fontsize
						);

					key =
						result.chgX.trg.path.get( -1 );

					shell.setMark(
						Mark.Caret.create(
							'path',
								shell.space
									.sub[ key ]
									.sub.doc.atRank( 0 ).textPath,
							'at',
								0
						)
					);

					if( !ctrl )
					{
						shell.setAction(
							Action.None.create( )
						);
					}

					break;

				case 'Portal' :

					var
						portal =
							Visual.Portal.create(
								'inherit',
									action.transItem,
								'zone',
									Euclid.Rect.createArbitrary(
										view.depoint( action.start ),
										view.depoint( p )
									)
							);

					result =
						shell.peer.newPortal(
							this.spaceUser,
							this.spaceTag,
							portal.zone,
							shell.username, // FIXME
							'home'
						);

					key =
						result.chgX.trg.path.get( -1 );

					shell.setMark(
						Mark.Caret.create(
							'path',
								shell.space
									.sub[ key ]
									.subPaths.spaceUser,
							'at',
								0
						)
					);

					if( !ctrl )
					{
						shell.setAction(
							Action.None.create( )
						);
					}

					break;

				default :

					throw new Error(
						CHECK && 'invalid itemtype'
					);
			}

			break;

		case 'Pan' :

			shell.setAction(
				Action.None.create( )
			);

			break;

		case 'CreateRelation' :

			switch( action.relationState )
			{

				case 'start' :

					shell.setAction(
						Action.None.create( )
					);

					break;

				case 'hadSelect' :

					if( !action.toItemPath.isEmpty )
					{
						item =
							this.getItem(
								action.toItemPath.get( -1 )
							);

						item.dragStop(
							view,
							p
						);
					}

					shell.setAction(
						Action.None.create( )
					);

					break;

				case 'pan' :

					shell.setAction(
						Action.CreateRelation.create(
							'inherit',
								action,
							'relationState',
								'start'
						)
					);

					break;

				default :

					throw new Error(
						CHECK && 'unknown relation state'
					);
			}

			break;

		case 'ItemDrag' :

			if( !action.transItem.zone.equals( action.origin.zone ) )
			{
				switch( action.transItem.positioning )
				{
					case 'zone' :

						shell.peer.setZone(
							action.transItem.path,
							action.transItem.zone
						);

						break;

					case 'pnw/fontsize' :

						shell.peer.setPNW(
							action.transItem.path,
							action.transItem.zone.pnw
						);

						break;

					default :

						throw new Error(
							CHECK &&
							(
								'invalid positioning' +
								action.transItem.positioning
							)
						);
				}
			}

			shell.setAction(
				Action.None.create( )
			);

			break;

		case 'ItemResize' :

			if( !action.transItem.zone.equals( action.origin.zone ) )
			{

				switch( action.transItem.positioning )
				{
					case 'zone' :

						shell.peer.setZone(
							action.transItem.path,
							action.transItem.zone
						);

						break;

					case 'pnw/fontsize' :

						shell.peer.setPNW(
							action.transItem.path,
							action.transItem.zone.pnw
						);

						shell.peer.setFontSize(
							action.transItem.path,
							action.transItem.sub.doc.fontsize
						);

						break;

					default :

						throw new Error(
							CHECK &&
							(
								'invalid positioning' +
									action.transItem.positioning
							)
						);
				}
			}

			shell.setAction(
				Action.None.create( )
			);

			break;

		case 'ScrollY' :

			this.getItem(
				action.itemPath.get( -1 )
			).dragStop(
				view,
				p,
				shift,
				ctrl
			);

			shell.setAction(
				Action.None.create( )
			);

			break;

		default :

			throw new Error(
				CHECK &&
				(
					'Do not know how to handle action: ' + action.reflect
				)
			);
	}

	return true;
};


/*
| Moving during an operation with the mouse button held down.
*/
Space.prototype.dragMove =
	function(
		p
		// shift,
		// ctrl
	)
{
	var
		view =
			this.view,

		action =
			shell.action,

		transItem =
			null,

		fs,

		model,

		origin,

		oheight,

		pd,

		resized;

	switch( action.reflect )
	{
		case 'CreateGeneric' :

			model =
				action.model;

			var
				zone =
					Euclid.Rect.createArbitrary(
						view.depoint( action.start ),
						view.depoint( p )
					);

			switch( model.positioning )
			{
				case 'zone' :

					transItem =
						Visual[ model.reflect ].create(
							'inherit',
								model,
							'zone',
								zone
						);

					break;

				case 'pnw/fontsize' :

					oheight =
						model.zone.height;

					fs =
						Math.max(
							model.sub.doc.fontsize *
								zone.height / oheight,
							theme.label.minSize
						);

					resized =
						Visual[ action.transItem.reflect ].create(
							'inherit',
								model,
							'tree',
								// FIXME elegance
								model.tree.setPath(
									Path.empty.append( 'fontsize' ),
									fs,
									meshverse
								)
						);

					transItem =
						Visual[ action.transItem.reflect ].create(
							'inherit',
								resized,
							'tree',
								// FIXME elegance
								resized.tree.setPath(
									Path.empty.append( 'pnw' ),
									( p.x > action.start.x ) ?
										zone.pnw
										:
										Euclid.Point.create(
											'x',
												zone.pse.x - resized.zone.width,
											'y',
												zone.pnw.y
										),
									meshverse
								)
						);

					break;

				default :

					throw new Error(
						CHECK && 'invalid positioning'
					);
			}

			shell.setAction(
				Action.CreateGeneric.create(
					'inherit',
						action,
					'transItem',
						transItem
				)
			);

			return 'pointer';

		case 'CreateRelation' :

			if( action.relationState === 'pan' )
			{
				// panning while creating a relation

				pd =
					p.sub( action.start );

				shell.setView(
					Euclid.View.create(
						'inherit',
							view,
						'pan',
							action.pan.add(
								pd.x / view.zoom,
								pd.y / view.zoom
							)
					)
				);

				return 'pointer';
			}

			shell.setAction(
				Action.CreateRelation.create(
					'inherit',
						action,
					'toItemPath',
						Path.empty,
					'toPoint',
						p
				)
			);

			// FIXME why is this?
			for(
				var r = 0, rZ = this.tree.length;
				r < rZ;
				r++
			)
			{
				if(
					this.atRank( r ).dragMove(
						view, // FIXME dont
						p
					)
				)
				{
					return 'pointer';
				}
			}

			return 'pointer';

		case 'Pan' :

			pd =
				p.sub( action.start );

			shell.setView(
				Euclid.View.create(
					'inherit',
						view,
					'pan',
						action.pan.add(
							Math.round( pd.x / view.zoom ),
							Math.round( pd.y / view.zoom )
						)
				)
			);

			return 'pointer';

		case 'ItemDrag' :

			origin =
				action.origin;

			switch( origin.positioning )
			{
				case 'zone' :

					transItem =
						Visual[ origin.reflect ].create(
							'inherit',
								origin,
							'zone',
								origin.zone.add(
									view.dex( p.x ) - action.start.x,
									view.dey( p.y ) - action.start.y
								)
					);

					break;

				case 'pnw/fontsize' :

					transItem =
						Visual[ origin.reflect ].create(
							'inherit',
								origin,
							'tree',
								// FUTURE make this more elegant
								origin.tree.setPath(
									Path.empty.append( 'pnw' ),
									origin.pnw.add(
										view.dex( p.x ) - action.start.x,
										view.dey( p.y ) - action.start.y
									),
									meshverse
								)
					);
			}

			shell.setAction(
				Action.ItemDrag.create(
					'inherit',
						action,
					'transItem',
						transItem
				)
			);

			return true;


		case 'ItemResize' :

			origin =
				action.origin;

			var
				align =
					action.align;

			switch( origin.positioning )
			{
				case 'zone' :

					transItem =
						Visual[ action.origin.reflect ].create(
							'inherit',
								origin,
							'zone',
								origin.zone.cardinalResize(
									align,
									view.dex( p.x ) - action.start.x,
									view.dey( p.y ) - action.start.y,
									origin.minHeight,
									origin.minWidth
								)
						);

					break;

				case 'pnw/fontsize' :

					oheight =
						origin.zone.height;

					var
						dy;

					switch( action.align )
					{
						case 'ne' :
						case 'nw' :

							dy =
								action.start.y -
								view.dey( p.y );

							break;

						case 'se' :
						case 'sw' :

							dy =
								view.dey( p.y ) -
								action.start.y;

							break;

						default :

							throw new Error(
								CHECK && 'unknown align'
							);
					}

					fs =
						Math.max(
							origin.sub.doc.fontsize *
								( oheight + dy ) / oheight,
							theme.label.minSize
						);

					resized =
						Visual[ action.origin.reflect ].create(
							'inherit',
								origin,
							'tree',
								// FUTURE do more elegantly
								origin.tree.setPath(
									Path.empty.append( 'fontsize' ),
									fs,
									meshverse
								)
						);

					transItem =
						Visual[ resized.reflect ].create(
							'inherit',
								resized,
							'tree',
								resized.tree.setPath(
									Path.empty.append( 'pnw' ),
									// FUTURE do more elegantly
									resized.pnw.add(
										align === 'sw' || align === 'nw' ?
											Math.round(
												origin.zone.width -
													resized.zone.width
											)
											:
											0,
										align === 'ne' || align === 'nw' ?
											Math.round(
												origin.zone.height -
													resized.zone.height
											)
											:
											0
									),
									meshverse
								)
						);

					break;

				default :

					throw new Error(
						CHECK && 'invalid positioning'
					);
			}

			shell.setAction(
				Action.ItemResize.create(
					'inherit',
						action,
					'transItem',
						transItem
				)
			);

			return true;

		case 'ScrollY' :

			this.getItem(
				action.itemPath.get( -1 )
			).dragMove(
				view, // FIXME dont
				p
			);

			// FIXME let the item decide on the cursor
			return 'move';

		default :

			throw new Error(
				CHECK
				&&
				(
					'unknown action: ' + action.reflect
				)
			);
	}
};


/*
| Text input
*/
Space.prototype.input =
	function(
		text
	)
{
	var
		mark =
			this.mark;

	if( !mark.hasCaret )
	{
		return false;
	}


	var
		path =
			mark.caretPath,

		item =
			this.sub[ path.get( 1 ) ];

	if( item )
	{
		item.input( text );
	}
};


/*
| Changes the zoom factor ( around center )
*/
Space.prototype._changeZoom =
	function( df )
{
	var
		pm =
			this.view.depoint(
				this.view.baseFrame.pc
			);

	shell.setView(
		this.view.review(
			df,
			pm
		)
	);
};


/*
| User pressed a special key.
*/
Space.prototype.specialKey =
	function(
		key,
		shift,
		ctrl
	)
{
	if( ctrl )
	{
		switch( key )
		{
			case 'z' :

				shell.peer.undo( );

				return;

			case 'y' :

				shell.peer.redo( );

				return;

			case ',' :

				this._changeZoom(  1 );

				return;

			case '.' :

				this._changeZoom( -1 );

				return;
		}
	}

	var
		mark =
			this.mark;

	if( !mark.hasCaret )
	{
		return;
	}

	var
		path =
			mark.caretPath,

		item =
			this.sub[ path.get( 1 ) ];

	if( item )
	{
		item.specialKey(
			key,
			shift,
			ctrl
		);
	}
};


} )( );

