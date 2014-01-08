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
	Jools,
	Mark,
	Path,
	shell,
	shellverse,
	Stubs,
	theme;


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

	Visual.Base.call(
		this,
		tree
	);

	this.spaceUser =
		spaceUser;

	this.spaceTag =
		spaceTag;

	this.access =
		access;

	this.$view =
		inherit ?
			inherit.$view
			:
			new Euclid.View(   // FIXME make this a singleton
				Euclid.Point.zero,
				0
			);

	this.hover =
		hover;

	this.mark =
		mark;

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


Jools.subclass(
	Space,
	Visual.Base
);


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
			null;

	var
		a =
			0,

		aZ =
			arguments.length;

	// TODO change to for loop
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

		default :

			throw new Error(
				'invalid argument: ' + arguments[ a ]
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
			traitSet === null
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
| TODO handle this more gracefully
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
			mark.caretPath; // TODO euhhh

	if( !mark.hasCaret )
	{
		return null;
	}

	if( action )
	{
		switch( action.reflect )
		{
			case 'ItemDrag' :
			case 'ItemResize' :

				if( action.itemPath.subPathOf( path ) )
				{
					return action.item;
				}

				break;
		}
	}

	return (
		this.getSub(
			path,
			'Item'
		)
	);
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

			if( action.itemPath.get( 1 ) === key )
			{
				return action.item;
			}

			break;
	}

	return this.sub[ key ];
};


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
				traitSet
		)
	);
};


/*
| Redraws the complete space.
*/
Space.prototype.draw =
	function(
		fabric
		// haveSystemFocus
	)
{
	var
		tree =
			this.tree,

		view =
			this.$view,

		action =
			shell.action;

	// TODO
	this._center =
		fabric.getCenter( );

	for(
		var r = tree.length - 1;
		r >= 0;
		r--
	)
	{
		// FIXME, maybe overload this.atRank
		this.getItem( this.tree.ranks[ r ] )
			.draw(
				fabric,
				view
			);
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

			if( action.start && action.move )
			{
				action.item.draw(
					fabric,
					view
				);
			}

			break;

		case 'CreateRelation' :

			if( action.fromItemPath )
			{
				var fromItem =
					this.getSub(
						action.fromItemPath,
						'Item'
					);

				fromItem.highlight(
					fabric,
					view
				);

				var toItem = null;

				if( action.toItemPath )
				{
					toItem =
						this.getSub(
							action.toItemPath,
							'Item'
						);

					toItem.highlight(
						fabric,
						view
					);
				}

				var
					fromSilhoutte =
						fromItem.silhoutte,

					toSilhoutte;

				if(
					action.toItemPath &&
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
						view.depoint( action.move );
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
			this.$view,

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
		this.$view =
			this.$view.review(  1, p );
	}
	else
	{
		this.$view =
			this.$view.review( -1, p );
	}

	shell.setSpaceZoom( this.$view.fact );

	shell.redraw =
		true;

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
			this.$view,

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

		/* XXX TODO
		if( cu )
		{
			cursor =
				cu;

			switch( action && action.reflect )
			{

				case 'CreateRelation' :

					if(
						action.relationState === 'start'
						&&
						!item.path.equals( action.fromItemPath )
					)
					{
						action.fromItemPath =
							item.path;

						shell.redraw =
							true;
					}

					break;
			}
		}
		*/
	}

	/*
	if( !cursor )
	{
		switch( action && action.reflect )
		{
			case 'CreateRelation' :

				if( action.fromItemPath )
				{
					action.fromItemPath =
						null;

					shell.redraw =
						true;
				}

				break;
		}
	}
	*/

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
			this.$view,

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
					'itemPath',
						focus.path,
					'start',
						dp,
					'move',
						dp,
					'item',
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
			null;

	// XXX simplify
	if(
		action &&
		action.reflect === 'CreateGeneric' &&
		action.itemType === 'Note'
	)
	{
		item =
			Visual[ action.itemType ].create(
				'zone',
					Euclid.Rect.create(
						'pnw/pse',
						p, //TODO depoint?
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
						'paraSep',
							Jools.half(
								theme.note.fontsize
							),
						'mark',
							Mark.Vacant.create( )
					),
				'mark',
					Mark.Vacant.create( )
			);

		shell.setAction(
			Action.CreateGeneric.create(
				'inherit',
					action,
				'start',
					p,
				'origin',
					item,
				'item',
					item
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
		item =
			Visual[ action.itemType ].create(
				'pnw',
					view.depoint( p ),
				'fontsize',
					theme.note.fontsize, // FIXME
				'doc',
					Visual.Doc.create(
						'tree',
							Stubs.labelDoc,
						'fontsize',
							theme.note.fontsize, // FIXME
						'flowWidth',
							0,
						'paraSep',
							0,
						'mark',
							Mark.Vacant.create( )
					),
				'mark',
					Mark.Vacant.create( )
			);

		shell.setAction(
			Action.CreateGeneric.create(
				'inherit',
					action,
				'start',
					p,
				'origin',
					item,
				'item',
					item
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
		item =
			Visual[ action.itemType ].create(
				'hover',
					Path.empty,
				'mark',
					Mark.Vacant.create( ),
				'zone',
					Euclid.Rect.create(
						'pnw/pse',
						p, //TODO depoint?
						p
					)
			);

		shell.setAction(
			Action.CreateGeneric.create(
				'inherit',
					action,
				'start',
					p,
				'origin',
					item,
				'item',
					item
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

			action.start =
				p;

			action.pan =
				view.pan;

			action.relationState =
				'pan';

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
	var view =
		this.$view;

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

	shell.userMark(
		'set',
		'type',
			'vacant'
	);

	shell.redraw =
		true;

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
			this.$view,

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
									action.item,
								'zone',
									Euclid.Rect.create(
										'arbitrary',
										view.depoint( action.start ),
										view.depoint( action.move )
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

					shell.userMark(
						'set',
						'type',
							'caret',
						'path',
							shell.space.sub[ key ].sub.doc.atRank( 0 ).textPath,
						'at',
							0
					);

					shell.redraw =
						true;

					if( !ctrl )
					{
						shell.setAction(
							Action.None.create( )
						);
					}

					break;

				case 'Label' :

					var
						origin =
							action.origin,

						zone =
							Euclid.Rect.create(
								'arbitrary',
								view.depoint( action.start ),
								view.depoint( action.move ) // TODO why not p?
							),

						oheight =
							origin.zone.height,

						dy =
							zone.height - oheight,

						fs =
							Math.max(
								origin.sub.doc.fontsize * ( oheight + dy ) / oheight,
								theme.label.minSize
						),

						resized =
							action.item.creator.create(
								'inherit',
									origin,
								'fontsize',
									fs
							),

						label =
							resized.creator.create(
								'inherit',
									resized,
								'pnw',
									( p.x > action.start.x ) ?
										zone.pnw
										:
										shellverse.grow(
											'Point',
											'x',
												zone.pse.x - resized.zone.width,
											'y',
												zone.pnw.y
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

					shell.userMark(
						'set',
						'type',
							'caret',
						'path',
							shell.space.sub[ key ].sub.doc.atRank( 0 ).textPath,
						'at',
							0
					);

					shell.redraw =
						true;

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
									action.item,
								'zone',
									Euclid.Rect.create(
										'arbitrary',
										view.depoint( action.start ),
										view.depoint( action.move )
									)
							);

					result =
						shell.peer.newPortal(
							this.spaceUser,
							this.spaceTag,
							portal.zone,
							shell.username, // TODO
							'home'
						);

					key =
						result.chgX.trg.path.get( -1 );

					shell.userMark(
						'set',
						'type',
							'caret',
						'path',
							shell.space.sub[ key ].subPaths.spaceUser,
						'at',
							0
					);

					shell.redraw =
						true;

					if( !ctrl )
					{
						shell.setAction(
							Action.None.create( )
						);
					}

					break;

				default :

					throw new Error(
						'invalid itemtype'
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

				case 'hadSelect' :

					if( action.toItemPath )
					{
						item =
							this.getSub(
								action.toItemPath
							);

						item.dragStop(
							view,
							p
						);
					}

					shell.redraw =
						true;

					shell.setAction(
						Action.None.create( )
					);

					break;

				case 'pan' :

					action.relationState =
						'start';

					break;
			}

			break;

		case 'ItemDrag' :

			if( !action.item.zone.equals( action.origin.zone ) )
			{
				switch( action.item.positioning )
				{
					case 'zone' :

						shell.peer.setZone(
							action.itemPath,
							action.item.zone
						);

						break;

					case 'pnw/fontsize' :

						shell.peer.setPNW(
							action.itemPath,
							action.item.zone.pnw
						);

						break;

					default :

						throw new Error(
							'invalid positioning' +
							action.item.positioning
						);
				}

				shell.redraw =
					true;
			}

			shell.setAction(
				Action.None.create( )
			);

			break;

		case 'ItemResize' :

			if( !action.item.zone.equals( action.origin.zone ) )
			{

				switch( action.item.positioning )
				{
					case 'zone' :

						shell.peer.setZone(
							action.itemPath,
							action.item.zone
						);

						break;

					case 'pnw/fontsize' :

						shell.peer.setPNW(
							action.itemPath,
							action.item.zone.pnw
						);

						shell.peer.setFontSize(
							action.itemPath,
							action.item.sub.doc.fontsize
						);

						break;

					default :

						throw new Error(
							'invalid positioning' +
							action.item.positioning
						);
				}

				shell.redraw =
					true;
			}

			shell.setAction(
				Action.None.create( )
			);

			break;

		case 'ScrollY' :

			this.getSub(
				action.itemPath,
				'dragStop'
			).dragStop(
				view,
				p,
				shift,
				ctrl
			);

			shell.setAction(
				Action.None.create( )
			);

			shell.redraw =
				true;

			break;

		default :

			throw new Error(
				'Do not know how to handle action: ' + action.reflect
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
			this.$view,

		action =
			shell.action,

		item =
			null,

		fs,

		origin,

		oheight,

		pd,

		resized;

	switch( action.reflect )
	{
		case 'CreateGeneric' :

			origin =
				action.origin;

			var
				zone =
					Euclid.Rect.create(
						'arbitrary',
						view.depoint( action.start ),
						view.depoint( p )
					);

			switch( origin.positioning )
			{
				case 'zone' :

					item =
						origin.creator.create(
							'inherit',
								origin,
							'zone',
								zone
						);

					break;

				case 'pnw/fontsize' :

					oheight =
						origin.zone.height;

					fs =
						Math.max(
							origin.sub.doc.fontsize * zone.height / oheight,
							theme.label.minSize
						);

					resized =
						action.item.creator.create(
							'inherit',
								origin,
							'fontsize',
								fs
						);

					item =
						action.item.creator.create(
							'inherit',
								resized,
							'pnw',
								( p.x > action.start.x ) ?
									zone.pnw
									:
									shellverse.grow(
										'Point',
										'x',
											zone.pse.x - resized.zone.width,
										'y',
											zone.pnw.y
									)
						);

					break;

				default :

					throw new Error(
						'invalid positioning'
					);
			}

			shell.setAction(
				Action.CreateGeneric.create(
					'inherit',
						action,
					'move',
						p,
					'item',
						item
				)
			);

			shell.redraw =
				true;

			return 'pointer';

		case 'CreateRelation' :

			// XXX

			if( action.relationState === 'pan' )
			{
				// panning while creating a relation

				pd =
					p.sub( action.start );

				this.$view =
				view =
					new Euclid.View(
						action.pan.add(
							pd.x / view.zoom,
							pd.y / view.zoom
						),
						view.fact
					);

				shell.redraw =
					true;

				return 'pointer';
			}

			action.toItemPath =
				null;

			action.move =
				p;

			for(
				var r = 0, rZ = this.tree.length;
				r < rZ;
				r++
			)
			{
				item =
					this.atRank( r );

				if(
					item.dragMove(
						view,
						p
					)
				)
				{
					return 'pointer';
				}
			}

			shell.redraw =
				true;

			return 'pointer';

		case 'Pan' :

			pd =
				p.sub( action.start );

			view =
			this.$view =
				new Euclid.View(
					action.pan.add(
						Math.round( pd.x / view.zoom ),
						Math.round( pd.y / view.zoom )
					),
					view.fact
				);

			shell.redraw =
				true;

			return 'pointer';

		case 'ItemDrag' :

			origin =
				action.origin;

			switch( origin.positioning )
			{
				case 'zone' :

					item =
						origin.creator.create(
							'inherit',
								origin,
							'zone',
								origin.zone.add(
									action.move.x - action.start.x,
									action.move.y - action.start.y
								)
					);

					break;

				case 'pnw/fontsize' :

					item =
						origin.creator.create(
							'inherit',
								origin,
							'pnw',
								origin.pnw.add(
									action.move.x - action.start.x,
									action.move.y - action.start.y
								)
					);
			}

			shell.setAction(
				Action.ItemDrag.create(
					'inherit',
						action,
					'move',
						view.depoint( p ),
					'item',
						item
				)
			);

			shell.redraw =
				true;

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

					item =
						action.origin.creator.create(
							'inherit',
								origin,
							'zone',
								origin.zone.cardinalResize(
									align,
									action.move.x - action.start.x,
									action.move.y - action.start.y,
									origin.minHeight,
									origin.minWidth
								)
						);

					break;

				case 'pnw/fontsize' :

					oheight =
						origin.zone.height;

					var dy;

					switch( action.align )
					{
						case 'ne' :
						case 'nw' :

							dy =
								action.start.y - action.move.y;

							break;

						case 'se' :
						case 'sw' :

							dy =
								action.move.y - action.start.y;

							break;

						default :

							if( CHECK )
							{
								throw new Error(
									'unknown align'
								);
							}
					}

					fs =
						Math.max(
							origin.sub.doc.fontsize * ( oheight + dy ) / oheight,
							theme.label.minSize
						);

					resized =
						action.item.creator.create(
							'inherit',
								origin,
							'fontsize',
								fs
						);

					item =
						action.item.creator.create(
							'inherit',
								resized,
							'fontsize',
								fs,
							'pnw',
								origin.pnw.add(
									align === 'sw' || align === 'nw' ?
										Math.round( origin.zone.width - resized.zone.width ) :
										0,
									align === 'ne' || align === 'nw' ?
										Math.round( origin.zone.height - resized.zone.height ) :
										0
								)
						);

					break;

/**/				default :
/**/
/**/				if( CHECK )
/**/				{
/**/					throw new Error(
/**/						'invalid positioning'
/**/					);
/**/				}
			}

			shell.setAction(
				Action.ItemResize.create(
					'inherit',
						action,
					'move',
						view.depoint( p ),
					'item',
						item
				)
			);

			shell.redraw =
				true;

			return true;

		default :

			this.getSub(
				action.itemPath,
				'dragMove'
			).dragMove(
				view,
				p
			);

			return 'move';
	}
};

/*
| Pointing device starts pointing ( mouse down, touch start )
*/
Space.prototype.pointingStart =
	function(
		p
		// shift,
		// ctrl
	)
{
	var
		view =
			this.$view;

	/*
	if( this.access == 'ro' )
	{
		return 'drag';
	}
	*/

	var
		action =
			shell.action;

	switch( action && action.reflect )
	{
		case 'CreateRelation' :

			// this is either a pan or creates the relation
			// anyway its a drag.

			return 'drag';
	}


	var
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
			return 'drag';
		}
	}

	return 'atween';
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
Space.prototype.changeZoom =
	function( df )
{
	var
		pm =
			this.$view.depoint( this._center ); // TODO

	this.$view =
		this.$view.review(
			df,
			pm
		);

	shell.setSpaceZoom(
		this.$view.fact
	);

	shell.redraw =
		true;
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
				this.changeZoom(  1 );
				return;

			case '.' :
				this.changeZoom( -1 );
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


/*
| Returns the sub node path points to.
|
| For example 'Item' or having a method like 'specialKey'
|
| FIXME remove
*/
Space.prototype.getSub =
	function(
		path,
		mark   // If mark is not null,
		//     // returns the last node that features the mark
	)
{
	var
		n =
			this,

		m =
			null,

		action =
			shell.action;

	for(
		var a = 1, aZ = path.length;
		a < aZ;
		a++
	)
	{
		if (
			action &&
			action.itemPath &&
			action.itemPath.length === a
		)
		{
			switch( action.relect )
			{
				case 'ItemDrag' :
				case 'ItemResize' :

					if(
						action.itemPath.subPathOf( path )
					)
					{
						n =
							action.item;

						if( mark && n[ mark ] )
						{
							m =
								n;
						}

						continue;
					}

					break;
			}
		}

		if( !n.sub )
		{
			break;
		}

		n =
			n.sub[ path.get( a ) ];

		if( !n )
		{
			break;
		}

		if( mark && n[ mark ] )
		{
			m =
				n;
		}
	}

	if( !mark )
	{
		return n;
	}

	return m;
};


} )( );

