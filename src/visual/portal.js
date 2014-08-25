/*
| A portal to another space
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	visual;

visual = visual || { };


/*
| Imports
*/
var
	Accent,
	fontPool,
	euclid,
	jools,
	marks,
	Peer,
	reply,
	root,
	Style,
	theme;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		name :
			'portal',
		unit :
			'visual',
		attributes :
			{
				hover :
					{
						comment :
							'node currently hovered upon',
						type :
							'jion.path',
						// FIXME undefined
						defaultValue :
							null
					},
				mark :
					{
						comment :
							'the users mark',
						concerns :
							{
								type :
									'visual.item',
								func :
									'concernsMark',
								args :
									[
										'mark',
										'path'
									]
							},
						type :
							'Object', // FUTURE 'marks.*'
						defaultValue :
							undefined
					},
				path :
					{
						comment :
							'the path of the doc',
						type :
							'jion.path',
						defaultValue :
							undefined
					},
				spaceUser :
					{
						comment :
							'owner of the space the portal goes to',
						type :
							'String',
						json :
							true
					},
				spaceTag :
					{
						comment :
							'tag of the space the portal goes to',
						type :
							'String',
						json :
							true
					},
				view :
					{
						comment :
							'the current view',
						type :
							'euclid.view',
						defaultValue :
							undefined
					},
				zone :
					{
						comment :
							'the portals zone',
						type :
							'euclid.rect',
						json :
							true
					}
			},
		init :
			[ ],
		node :
			true,
		subclass :
			'visual.item'
	};
}

/*
| Node includes.
*/
if( SERVER )
{
	jools = require( '../jools/jools' );

	visual =
		{
			portal :
				require( '../jion/this' )( module )
		};
}


var
	portal =
		visual.portal;


/*
| Initializer.
*/
portal.prototype._init =
	function( )
{
	var
		minHeight,
		minWidth,
		zone;

	if( !this.view )
	{
		// abstract
		return;
	}

	zone =
		this.zone;

	minWidth =
		theme.portal.minWidth,

	minHeight =
		theme.portal.minHeight;

	if(
		zone.width  < minWidth
		||
		zone.height < minHeight
	)
	{
		zone =
		this.zone =
			euclid.rect.create(
				'pnw',
					zone.pnw,
				'pse',
					zone.pnw.add(
						Math.max(
							minWidth,
							zone.width
						),
						Math.max(
							minHeight,
							zone.height
						)
					)
			);
	}

	// the prepared space fields
	// FIXME lazy evaluate
	this._$spaceFields =
		{
			spaceUser :
				null,

			spaceTag :
				null
		};

	// FIXME once path caching is here this can go
	if( !this.path.isEmpty )
	{
		// paths to spaceUser and spaceTag

		this.subPaths =
			jools.immute(
				{
					moveToButton :
						this.path.Append( 'moveToButton' ),

					spaceUser :
						this.path.Append( 'spaceUser' ),

					spaceTag :
						this.path.Append( 'spaceTag' )
				}
			);
	}
	else
	{
		this.subPaths =
			null;
	}
};


/*
| List of all space fields of the portal
*/
portal.spaceFields =
	jools.immute(
		{
			spaceUser :
				true,
			spaceTag :
				true
		}
	);


/*
| Portals are positioned by their zone.
*/
portal.prototype.positioning = 'zone';


if( SHELL )
{
	/*
	| Minimum height.
	*/
	portal.prototype.minHeight =
		theme.portal.minHeight;


	/*
	| Minimum width.
	*/
	portal.prototype.minWidth =
		theme.portal.minWidth;
}


/*
| Resize handles to show on portals.
*/
portal.prototype.handles =
	jools.immute(
		{
			n :
				true,
			ne :
				true,
			e :
				true,
			se :
				true,
			s :
				true,
			sw :
				true,
			w :
				true,
			nw :
				true
		}
	);


/*
| The portal's silhoutte.
*/
jools.lazyValue(
	portal.prototype,
	'silhoutte',
	function( )
	{
		return (
			euclid.ellipse.create(
				'pnw',
					this.zone.pnw,
				'pse',
					this.zone.pse
			)
		);
	}
);


/*
| The portal's silhoutte at zero.
*/
jools.lazyValue(
	portal.prototype,
	'zeroSilhoutte',
	function( )
	{
		return (
			euclid.ellipse.create(
				'pnw',
					euclid.point.zero,
				'pse',
					euclid.point.create(
						'x',
							this.zone.width,
						'y',
							this.zone.height
				)
			)
		);
	}
);


/*
| Sets the items position and size after an action.
*/
portal.prototype.dragStop =
	function(
		view,
		p
	)
{
	var
		action,
		zone;

	action = root.action;

	switch( action.reflex )
	{
		case 'actions.itemDrag' :
		case 'actions.itemResize' :

			zone =
				this.zone;

			if(
				zone.width < theme.portal.minWidth ||
				zone.height < theme.portal.minHeight
			)
			{
				// portal under minimum size!
				throw new Error( );
			}

			if( this.zone.equals( zone ) )
			{
				return;
			}

			Peer.setZone(
				this.path,
				zone
			);

			return true;

		default :

			return(
				visual.item.prototype.dragStop.call(
					this,
					view,
					p
				)
			);
	}
};


/*
| Sees if this portal is being clicked.
*/
portal.prototype.click =
	function(
		space,
		view,
		p,
		shift,
		ctrl,
		access
	)
{
	var
		mark,
		moveToButton,
		pp,
		zone;

	mark =
		null;

	zone =
		this.zone;

	// not clicked on the portal?
	if(
		!this.silhoutte
			.within(
				view,
				p
			)
		)
	{
		return false;
	}

	moveToButton =
		this._$moveToButton;

	pp =
		view
		.depoint( p )
		.sub( zone.pnw );

	if(
		moveToButton.shape
		.within(
			euclid.view.proper,
			pp
		)
	)
	{
		this._moveTo( );

		return true;
	}

	if( access != 'rw' )
	{
		return false;
	}

	pp =
		view
		.depoint( p )
		.sub( zone.pnw );

	for( var field in portal.spaceFields )
	{
		var
			sf =
				this._$spaceFields[ field ];

		if(
			sf.silhoutte
				.within(
					euclid.view.proper,
					pp
				)
		)
		{
			mark =
				root.setMark(
					marks.caret.create(
						'path',
							this.subPaths[ field ],
						'at',
							this._getOffsetAt(
								field,
								pp.x
							)
					)
				);

			break;
		}
	}

	// if non of the field were clicked
	// just focus the portal itself
	if(
		mark === null &&
		root.space.focusedItem( ) !== this
	)
	{
		root.setMark(
			marks.item.create(
				'path',
					this.path
			)
		);
	}

	return true;
};


/*
| Returns the attention center.
*/
jools.lazyValue(
	portal.prototype,
	'attentionCenter',
	function( )
	{
		var
			ac,
			font,
			fs,
			mark,
			section;

		ac =
			this.zone.pnw.y,

		mark =
			this.mark;

		if( !mark.hasCaret )
		{
			return ac;
		}

		section =
			mark.caretPath.get( -1 );

		if( !this._isSection( section ) )
		{
			return ac;
		}

		if( section === 'moveToButton' )
		{
			return ac + this._$moveToButton.shape.pnw.y;
		}

		font =
			this._fonts[ section ];

		fs =
			font.size;

		var
			descend =
				fs * theme.bottombox,

			fieldPNW =
				this._$spaceFields[ section ].pnw,

			p =
				this._locateOffset(
					section,
					mark.caretAt
				),

			s =
				Math.round( p.y + descend ) + fieldPNW.y,

			n =
				s - Math.round( fs + descend );

			return ac + n;
	}
);


/*
| Draws the portal.
*/
portal.prototype.draw =
	function(
		fabric
	)
{
	fabric.drawImage(
		'image',
			this._fabric,
		'pnw',
			this.view.point( this.zone.pnw )
	);
};


/*
| Mouse wheel turned.
*/
portal.prototype.mousewheel =
	function(
		view,
		p
		// dir,
		// shift,
		// ctrl
	)
{
	return (
		this.silhoutte.within(
			view,
			p
		)
	);
};


/*
| Highlights the portal.
*/
portal.prototype.highlight =
	function( fabric )
{
	fabric.edge(
		Style.getStyle(
			theme.portal.style,
			'highlight'
		),
		this.silhoutte,
		'sketch',
		this.view
	);
};


/*
| User is hovering his/her pointing device around.
|
| Checks if this item reacts on this.
*/
portal.prototype.pointingHover =
	function(
		view,
		p
	)
{
	var
		moveToButton,
		pp,
		zone;

	zone =
		this.zone;

	// not clicked on the portal?
	if(
		!this.silhoutte
			.within(
				view,
				p
			)
		)
	{
		return null;
	}

	moveToButton =
		this._$moveToButton;

	pp =
		view
		.depoint( p )
		.sub( zone.pnw );

	if(
		moveToButton.shape
			.within(
				euclid.view.proper,
				pp
			)
	)
	{
		return (
			reply.hover.create(
				'path',
					this.subPaths.moveToButton,
				'cursor',
					'default'
			)
		);
	}
	else
	{
		return (
			reply.hover.create(
				'path',
					this.path,
				'cursor',
					'default'
			)
		);
	}

};


/*
| The protal's fabric.
*/
jools.lazyValue(
	portal.prototype,
	'_fabric',
	function( )
	{
		var
			vzone =
				this.view.rect( this.zone ),

			f =
				euclid.fabric.create(
					'width',
						vzone.width + 2,
					'height',
						vzone.height + 2
				),

			hview =
				this.view.home,

			mark =
				this.mark,

			section =
				mark &&
				mark.hasCaret &&
				mark.caretPath.get( -1 );

		f.fill(
			Style.getStyle(
				theme.portal.style,
				'normal'
			),
			this.zeroSilhoutte,
			'sketch',
			hview
		);

		if( this.subPaths )
		{
			f.clip(
				this.zeroSilhoutte,
				'sketch',
				hview,
				0
			);

			var
				spaceUser =
				this._$spaceFields.spaceUser =
					this._prepareField(
						'spaceUser',
						null
					),

				spaceTag =
				this._$spaceFields.spaceTag =
					this._prepareField(
						'spaceTag',
						spaceUser.pnw
					),

				moveToButton =
				this._$moveToButton =
					this._prepareMoveToButton( );

			f.paint(
				Style.getStyle(
					theme.portal.moveTo.style,
					Accent.state(
						this.hover.equals(  this.subPaths.moveToButton ),
						section === 'moveToButton'
					)
				),
				moveToButton.shape,
				'sketch',
				hview
			);

			f.paint(
				Style.getStyle(
					theme.portal.input.style,
					'normal'
				),
				spaceUser.silhoutte,
				'sketch',
				hview
			);

			f.paint(
				Style.getStyle(
					theme.portal.input.style,
					'normal'
				),
				spaceTag.silhoutte,
				'sketch',
				hview
			);

			f.scale( hview.zoom );

			f.paintText(
				'text',
					spaceUser.text,
				'p',
					spaceUser.pnw,
				'font',
					this._fonts.spaceUser
			);

			f.paintText(
				'text',
					spaceTag.text,
				'p',
					spaceTag.pnw,
				'font',
					this._fonts.spaceTag
			);

			f.paintText(
				'text',
					'move to',
				'p',
					moveToButton.textCenter,
				'font',
					this._fonts.moveTo
			);


			if(
				mark.reflex === 'marks.caret'
				&&
				mark.focus
			)
			{
				this._drawCaret( f );
			}

			f.scale( 1 / hview.zoom );

			f.deClip( );
		}

		// redraws the edge on the end to top
		// everything else

		f.edge(
			Style.getStyle(
				theme.portal.style,
				'normal'
			),
			this.zeroSilhoutte,
			'sketch',
			hview
		);

		return f;
	}
);


/*
| Text has been inputed.
*/
portal.prototype.input =
	function(
		text
	)
{
	var
		reg  =
			/([^\n]+)(\n?)/g,

		mark =
			this.mark,

		section =
			mark.caretPath.get( -1 );

	if( !this._isSection( section ) )
	{
		return false;
	}

	if( section === 'moveToButton' )
	{
		this._moveTo( );

		return;
	}

	// ignores newlines
	for(
		var rx = reg.exec(text);
		rx !== null;
		rx = reg.exec( text )
	)
	{
		var line = rx[ 1 ];

		Peer.insertText(
			this.subPaths[ section ],
			mark.caretAt,
			line
		);
	}
};


if( SHELL )
{
	/*
	| Font for spacesUser/Tag
	*/
	portal.prototype._fonts =
		jools.immute( {
			spaceUser :
				fontPool.get(
					13,
					'la'
				),

			spaceTag :
				fontPool.get(
					13,
					'la'
				),

			moveTo :
				fontPool.get(
					13,
					'cm'
				)
		} );


	/*
	| Returns the point of a given offset.
	*/
	portal.prototype._locateOffset =
		function(
			section,   // 'spaceUser' or 'spaceTag'
			offset     // the offset to get the point from.
		)
	{
		var
			font,
			text;

		// FIXME cache position
		font =
			this._fonts[ section ];

		text =
			this[ section ];

		return euclid.point.create(
			'x',
				Math.round(
					euclid.measure.width(
						font,
						text.substring(
							0,
							offset
						)
					)
				),
			'y',
				0
		);
	};
}


/*
| Draws the caret
*/
portal.prototype._drawCaret =
	function(
		fabric
	)
{
	var
		mark =
			this.mark,

		section =
			mark.caretPath.get( -1 );

	if(
		!this._isSection( section )
		||
		section === 'moveToButton' )
	{
		return;
	}

	var
		font =
			this._fonts[ section ],

		fs =
			font.size,

		descend =
			fs * theme.bottombox,

		fieldPNW =
			this._$spaceFields[ section ].pnw,

		p =
			this._locateOffset(
				section,
				mark.caretAt
			),

		s =
			Math.round( p.y + descend ) + fieldPNW.y,

		n =
			s - Math.round( fs + descend );

	// draws the caret
	fabric.fillRect(
		'black',
		p.x + fieldPNW.x,
		n,
		1,
		s - n
	);
};


/*
| User pressed a special key.
*/
portal.prototype.specialKey =
	function(
		key
		// shift
		// ctrl
	)
{
	switch( key )
	{
		case 'backspace' :

			this._keyBackspace( );

			break;

		case 'del' :

			this._keyDel( );

			break;

		case 'down' :

			this._keyDown( );

			break;

		case 'end' :

			this._keyEnd( );

			break;

		case 'enter' :

			this._keyEnter( );

			break;

		case 'left' :

			this._keyLeft( );

			break;

		case 'pos1' :

			this._keyPos1( );

			break;

		case 'right' :

			this._keyRight( );

			break;

		case 'tab' :

			this._keyTab( );

			break;

		case 'up' :

			this._keyUp( );

			break;
	}
};


/*
| User pressed backspace.
*/
portal.prototype._keyBackspace =
	function( )
{
	var
		mark =
			this.mark,

		section =
			mark.caretPath.get( -1 );

	if( !this._isSection( section ) )
	{
		return;
	}

	var
		at =
			mark.caretAt;

	if( at <= 0 )
	{
		return;
	}

	Peer.removeText(
		this.subPaths[ section ],
		at - 1,
		1
	);
};



/*
| User pressed down key.
*/
portal.prototype._keyDown =
	function( )
{
	var
		mark =
			this.mark,

		section =
			mark.caretPath.get( -1 );

	if(
		!this._isSection( section )
	)
	{
		return;
	}

	var
		cpos;

	switch( section )
	{
		case 'spaceUser' :

			cpos =
				this._locateOffset(
					section,
					mark.caretAt
				);

			root.setMark(
				marks.caret.create(
					'path',
						// FIXME use this paths
						mark.caretPath.set(
							mark.caretPath.length - 1,
							'spaceTag'
						),
					'at',
						this._getOffsetAt(
							'spaceTag',
							cpos.x +
								this._$spaceFields.spaceUser.pnw.x
						)
				)
			);

			break;

		case 'spaceTag' :

			root.setMark(
				marks.caret.create(
					'path',
						// FIXME use this paths
						mark.caretPath.set(
							mark.caretPath.length - 1,
							'moveToButton'
						),
					'at',
						0
				)
			);

			break;

		case 'moveToButton' :

			root.setMark(
				marks.caret.create(
					'path',
						// FIXME use this paths
						mark.caretPath.set(
							mark.caretPath.length - 1,
							'spaceUser'
						),
					'at',
						0
				)
			);

			break;
	}
};



/*
| User pressed right key.
*/
portal.prototype._keyLeft =
	function( )
{
	var
		mark =
			this.mark,

		section =
			mark.caretPath.get( -1 );

	if( !this._isSection( section ) )
	{
		return;
	}

	if( mark.caretAt === 0 )
	{
		var
			cycle =
				null;

		switch( section )
		{
			case 'spaceUser' :

				cycle =
					'moveToButton';

				break;

			case 'spaceTag' :

				cycle =
					'spaceUser';

				break;

			case 'moveToButton' :

				cycle =
					'spaceTag';

				break;
		}

		root.setMark(
			marks.caret.create(
				'path',
					// FIXME rather user this.path
					mark.caretPath.set(
						mark.caretPath.length - 1,
						cycle
					),
				'at',
					cycle === 'moveToButton' ?
						0
						:
						this[ cycle ].length
			)
		);

		return;
	}

	root.setMark(
		marks.caret.create(
			'path',
				mark.caretPath,
			'at',
				mark.caretAt - 1
		)
	);

	return;
};

/*
| User pressed down key.
*/
portal.prototype._keyTab =
	function( )
{
	var
		cycle,
		mark,
		section;

	mark = this.mark;

	section = mark.caretPath.get( -1 );

	if( !this._isSection( section ) )
	{
		return;
	}

	cycle = null;

	switch( section )
	{
		case 'spaceUser' :

			cycle = 'spaceTag';

			break;

		case 'spaceTag' :

			cycle = 'moveToButton';

			break;

		case 'moveToButton' :

			cycle = 'spaceUser';

			break;
	}

	root.setMark(
		marks.caret.create(
			'path',
				mark.caretPath.set(
					mark.caretPath.length - 1,
					cycle
				),
			'at',
				0
		)
	);
};

/*
| User pressed down key.
*/
portal.prototype._keyUp =
	function( )
{
	var
		cpos,
		mark,
		section;

	mark = this.mark;

	section = mark.caretPath.get( -1 );

	if(
		!this._isSection( section )
	)
	{
		return;
	}

	switch( section )
	{
		case 'spaceUser' :

			root.setMark(
				marks.caret.create(
					'path', // FIXME this.paths
						mark.caretPath.set(
							mark.caretPath.length - 1,
							'moveToButton'
						),
					'at',
						0
				)
			);

			break;

		case 'spaceTag' :

			cpos =
				this._locateOffset(
					section,
					mark.caretAt
				);

			root.setMark(
				marks.caret.create(
					'path', // FIXME this.paths
						mark.caretPath.set(
							mark.caretPath.length - 1,
							'spaceUser'
						),
					'at',
						this._getOffsetAt(
							'spaceUser',
							cpos.x +
								this._$spaceFields.spaceTag.pnw.x
						)
				)
			);

			break;

		case 'moveToButton' :

			root.setMark(
				marks.caret.create(
					'path', // FIXME this.paths
						mark.caretPath.set(
							mark.caretPath.length - 1,
							'spaceTag'
						),
					'at',
						0
				)
			);

			break;
	}
};

/*
| User pressed right key.
*/
portal.prototype._keyRight =
	function( )
{
	var
		mark,
		section,
		value;

	mark =
		this.mark;

	section =
		mark.caretPath.get( -1 );

	if( !this._isSection( section ) )
	{
		return false;
	}

	value =
		this[ section ];

	// FIXME make true circulation
	if(
		section === 'moveToButton'
		||
		( value && mark.caretAt >= value.length )
	)
	{
		var
			cycle =
				null;

		switch( section )
		{
			case 'spaceUser' :

				cycle =
					'spaceTag';

				break;

			case 'spaceTag' :

				cycle =
					'moveToButton';

				break;

			case 'moveToButton' :

				cycle =
					'spaceUser';

				break;
		}

		root.setMark(
			marks.caret.create(
				'path', // FIXME this.paths
					mark.caretPath.set(
						mark.caretPath.length - 1,
						cycle
					),
				'at',
					0
			)
		);

		return;
	}

	root.setMark(
		marks.caret.create(
			'path',
				mark.caretPath,
			'at',
				mark.caretAt + 1
		)
	);

	return;
};


/*
| User pressed del.
*/
portal.prototype._keyDel =
	function( )
{
	var
		at,
		mark,
		section,
		value;

	mark = this.mark;

	section = mark.caretPath.get( -1 );

	value = this[ section ];

	if(
		!this._isSection( section ) ||
		section === 'moveToButton'
	)
	{
		return;
	}

	at = mark.caretAt;

	if( at >= value.length )
	{
		return;
	}

	Peer.removeText(
		this.subPaths[ section ],
		at,
		1
	);
};


/*
| User pressed end key.
*/
portal.prototype._keyEnd =
	function( )
{
	var
		at,
		mark,
		section,
		value;

	mark = this.mark;

	section = mark.caretPath.get( -1 );

	if(
		!this._isSection( section ) ||
		section === 'moveToButton'
	)
	{
		return;
	}

	at = mark.caretAt,

	value = this[ section ];

	if( at >= value.length )
	{
		return;
	}

	root.setMark(
		marks.caret.create(
			'path',
				mark.caretPath,
			'at',
				value.length
		)
	);
};


/*
| User pressed enter key.
*/
portal.prototype._keyEnter =
	function( )
{
	var
		cycle,
		mark,
		section;

	mark = this.mark;

	section = mark.caretPath.get( -1 );

	if( !this._isSection( section ) )
	{
		return;
	}

	cycle = null;

	switch( section )
	{
		case 'spaceUser' :

			cycle = 'spaceTag';

			break;

		case 'spaceTag' :

			cycle = 'moveToButton';

			break;
	}

	if( cycle )
	{
		root.setMark(
			marks.caret.create(
				'path',
					mark.caretPath.set(
						mark.caretPath.length - 1,
						cycle
					),
				'at',
					0
			)
		);
	}
	else
	{
		if( CHECK )
		{
			if( section !== 'moveToButton' )
			{
				throw new Error( );
			}
		}

		this._moveTo( );
	}
};


/*
| Returns true if section is a section.
*/
portal.prototype._isSection =
	function(
		section
	)
{
	switch( section )
	{
		case 'spaceUser' :
		case 'spaceTag' :
		case 'moveToButton' :

			return true;

		default :

			return false;

	}
};


/*
| Prepares the moveTo button.
*/
portal.prototype._prepareMoveToButton =
	function( )
{
	var
		zone =
			this.zone,

		width =
			theme.portal.moveTo.width,

		height =
			theme.portal.moveTo.height,

		rounding =
			theme.portal.moveTo.rounding,

		pnw =
			euclid.point.create(
				'x',
					jools.half( zone.width - width ),
				'y',
					jools.half( zone.height ) + 10
			),

		pse =
			pnw.add(
				width,
				height
			);

	return {
		shape :
			euclid.roundRect.create(
				'pnw',
					pnw,
				'pse',
					pse,
				'a',
					rounding,
				'b',
					rounding
			),

		textCenter :
			euclid.point.create(
				'x',
					jools.half( pnw.x + pse.x ),
				'y',
					jools.half( pnw.y + pse.y )
			)
	};
};

/*
| Prepares an input field ( user / tag )
*/
portal.prototype._prepareField =
	function(
		section,
		basePNW
	)
{
	var
		zone =
			this.zone,

		pitch =
			theme.portal.input.pitch,

		rounding =
			theme.portal.input.rounding,

		text =
			this[ section ],

		width =
			euclid.measure.width(
				this._fonts[ section ],
				text
			),

		height =
			this._fonts[ section ].size + 2,

		pnw =
			basePNW === null
			?
			(
				euclid.point.create(
					'x',
						jools.half( zone.width - width ),
					'y',
						Math.round(
							jools.half( zone.height ) - 30
						)
				)
			)
			:
			(
				euclid.point.create(
					'x',
						jools.half( zone.width - width ),
					'y',
						basePNW.y + 23
				)
			),

		silhoutte =
			euclid.roundRect.create(
				'pnw',
					pnw.sub(
						pitch,
						height
					),
				'pse',
					pnw.add(
						Math.round( width ) + pitch,
						pitch
					),
				'a',
					rounding,
				'b',
					rounding
			);

	return {
		text :
			text,

		width :
			width,

		height :
			height,

		pnw :
			pnw,

		silhoutte :
			silhoutte
	};
};


/*
| User pressed pos1 key,
*/
portal.prototype._keyPos1 =
	function( )
{
	root.setMark(
		this.mark.create(
			'at',
				0
		)
	);
};


/*
| Returns the offset nearest to point p.
*/
portal.prototype._getOffsetAt =
	function(
		section,
		x
	)
{
	var
		dx = x - this._$spaceFields[ section ].pnw.x,

		value = this[ section ],

		x1 = 0,

		x2 = 0,

		a,

		aZ,

		font =
			this._fonts[ section ];

	for(
		a = 0, aZ = value.length;
		a < aZ;
		a++
	)
	{
		x1 = x2;

		x2 =
			euclid.measure.width(
				font,
				value.substr( 0, a )
			);

		if( x2 >= dx )
		{
			break;
		}
	}

	if(
		dx - x1 < x2 - dx &&
		a > 0
	)
	{
		a--;
	}

	return a;
};


/*
| Issues the moveTo action.
*/
portal.prototype._moveTo =
	function( )
{
	root.moveToSpace(
		this.spaceUser,
		this.spaceTag,
		false
	);
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports = portal;
}


} )( );
