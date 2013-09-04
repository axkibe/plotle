/*
| A portal to another space
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var Visual;

Visual =
	Visual || { };


/*
| Imports
*/
var
	Accent,
	Action,
	config,
	fontPool,
	Euclid,
	Jools,
	Path,
	Portal,
	shell,
	shellverse,
	Style,
	theme;


/*
| Capsule
*/
( function( ) {
'use strict';


if( typeof( window ) === 'undefined' )
{
	throw new Error(
		'this code needs a browser!'
	);
}


/*
| Constructor.
*/
var Portal =
Visual.Portal =
	function(
		tag,
		tree,
		path,
		zone
	)
{
	Visual.Item.call(
		this,
		tree,
		path
	);

	if( path )
	{
		// paths to spaceUser and spaceTag

		this.subPaths =
			Jools.immute(
				{
					spaceUser :
						new Path(
							this.path,
							'++',
							'spaceUser'
						),

					spaceTag :
						new Path(
							this.path,
							'++',
							'spaceTag'
						)
				}
			);
	}
	else
	{
		this.subPaths =
			null;
	}

	this.zone =
		zone;

	// the prepared space fields
	this._$spaceFields =
		{
			spaceUser :
				null,

			spaceTag :
				null
		};

	this._$hover =
		null;
};


Jools.subclass(
	Portal,
	Visual.Item
);


Portal.create =
	function(
		// free string
	)
{
	var
		tree =
			null,

		path =
			null,

		inherit =
			null,

		zone =
			null,

		fontsize =
			null;

	for(
		var a = 0, aZ = arguments.length;
		a < aZ;
		a += 2
	)
	{

		switch( arguments[ a ] )
		{
			case 'zone' :

				var
					minWidth =
						theme.portal.minWidth,

					minHeight =
						theme.portal.minHeight;

				zone =
					arguments[ a + 1 ];

				if(
					zone.width  < minWidth ||
					zone.height < minHeight
				)
				{
					zone =
						Euclid.Rect.create(
							'pnw/size',
							zone.pnw,
							Math.max( minWidth,  zone.width  ),
							Math.max( minHeight, zone.height )
						);
				}

				break;

			case 'inherit' :

				inherit =
					arguments[ a + 1 ];

				break;

			case 'tree' :

				tree =
					arguments[ a + 1 ];

				break;

			case 'path' :

				path =
					arguments[ a + 1 ];

				break;

		default :

			throw new Error(
				'invalid argument: ' + arguments[ a ]
			);

		}
	}

	if( tree )
	{
		if( !path )
		{
			throw new Error(
				'tree needs path'
			);
		}

		if( !fontsize )
		{
			fontsize =
				theme.note.fontsize;
				// tree.fontsize; FIXME
		}

		if( !zone )
		{
			zone =
				tree.twig.zone;
		}
	}

	if( inherit )
	{
		if( !tree )
		{
			tree =
				inherit.tree;
		}

		if( !fontsize )
		{
			fontsize =
				inherit.fontsize;
		}

		if( !path )
		{
			path =
				inherit.path;
		}

		if(
			(
				inherit.tree === tree
			)
			&&
			(
				inherit.path === path ||
				( inherit.path && inherit.path.equals( path ) )
			)
			&&
			(
				inherit.zone === zone ||
				( inherit.zone && inherit.zone.equals( zone ) )
			)
		)
		{
			return inherit;
		}
	}

	return (
		new Portal(
			'XOXO',
			tree,
			path,
			zone
		)
	);
};


/*
| List of all space fields of the portal
*/
Portal.spaceFields =
	Jools.immute(
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
Portal.prototype.positioning =
	'zone';


/*
| Self referencing creator.
*/
Portal.prototype.creator =
	Portal;


/*
| Minimum height.
*/
Portal.prototype.minHeight =
	theme.portal.minHeight;


/*
| Minimum width.
*/
Portal.prototype.minWidth =
	theme.portal.minWidth;


/*
| Resize handles to show on portals.
*/
Portal.prototype.handles =
	Jools.immute(
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
| Returns the portals silhoutte.
*/
Jools.lazyFixate(
	Portal.prototype,
	'silhoutte',
	function( )
	{
		return (
			new Euclid.Ellipse(
				this.zone.pnw,
				this.zone.pse
			)
		);
	}
);


/*
| Returns the portals silhoutte.
*/
Jools.lazyFixate(
	Portal.prototype,
	'zeroSilhoutte',
	function( )
	{
		return (
			new Euclid.Ellipse(
				Euclid.Point.zero,
				shellverse.grow(
					'Point',
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
Portal.prototype.dragStop =
	function(
		view,
		p
	)
{
	var action =
		shell.bridge.action( );

	switch( action.type )
	{
		case 'ItemDrag' :
		case 'ItemResize' :

			var zone =
				this.zone;

			if(
				zone.width < theme.portal.minWidth ||
				zone.height < theme.portal.minHeight
			)
			{
				throw new Error( 'Portal under minimum size!' );
			}

			if( this.tree.twig.zone.equals( zone ) )
			{
				return;
			}

			shell.peer.setZone(
				this.path,
				zone
			);

			shell.redraw =
				true;

			return true;

		default :

			return Visual.Item.prototype.dragStop.call(
				this,
				view,
				p
			);
	}
};


/*
| Sets the focus to this item.
*/
Portal.prototype.grepFocus =
	function( )
{
	// already have focus?
	if( shell.space.focusedItem( ) === this )
	{
		return;
	}

	shell.setCaret(
		'space',
		this.subPaths.spaceUser,
		0,
		null
	);

	shell.peer.moveToTop(
		this.path
	);
};



/*
| Sees if this portal is being clicked.
*/
Portal.prototype.click =
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

	var
		focus =
			space.focusedItem( ),

		moveToButton =
			this._$moveToButton;

		pp =
			view
				.depoint( p )
				.sub( zone.pnw );

	if(
		moveToButton.shape
			.within(
				Euclid.View.proper,
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

	if( focus !== this )
	{
		this.grepFocus( );

		// TODO double deselect below?
		shell.deselect( );
	}

	shell.redraw =
		true;

	var
		caret =
			null,

		pp =
			view
				.depoint( p )
				.sub( zone.pnw );

	for( var field in Portal.spaceFields )
	{
		var sf =
			this._$spaceFields[ field ];

		if(
			sf.silhoutte
				.within(
					Euclid.View.proper,
					pp
				)
		)
		{
			caret =
				shell.setCaret(
					'space',
					this.subPaths[ field ],
					this._getOffsetAt(
						field,
						pp.x
					)
				);

			break;
		}
	}

	if( caret )
	{
		caret.show( );
	}

	shell.deselect( );

	return true;
};


/*
| Draws the portal.
|
| TODO move draw to visual item.
*/
Portal.prototype.draw =
	function(
		fabric,
		caret,
		view
	)
{
	var
		zone =
			this.zone,

		vzone =
			view.rect( zone ),

		f =
			this.$fabric;

	// no buffer hit?
	if (
		config.debug.noCache ||
		!f ||
		vzone.width !== f.width ||
		vzone.height !== f.height
	)
	{
		f =
			this._weave(
				caret,
				zone,
				vzone,
				view.home( )
			);
	}

	var
		action =
			shell.bridge.action( );

	if(
		action &&
		action.type === 'Remove' &&
		action.removeItemFade &&
		this.path &&
		this.path.equals( action.removeItemPath )
	)
	{
		fabric.drawImage(
			'image',
				f,
			'pnw',
				vzone.pnw,
			'alpha',
				theme.removeAlpha
		);
	}
	else
	{
		fabric.drawImage(
			'image',
				f,
			'pnw',
				vzone.pnw
		);
	}
};


/*
| Mouse wheel turned.
*/
Portal.prototype.mousewheel =
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
Portal.prototype.highlight =
	function(
		fabric,
		view
	)
{
	fabric.edge(
		Style.getStyle(
			theme.portal.style,
			'highlight'
		),
		this.silhoutte,
		'sketch',
		view
	);
};



/*
| Draws the caret if its in this portal.
*/
Portal.prototype.positionCaret =
	function(
		space,
		caret,
		view
	)
{
	var
		section =
			caret.sign.path.get( -1 );

	if(
		!this._isSection( section ) ||
		section === 'moveToButton'
	)
	{
		caret.$screenPos =
		caret.$height =
			null;

		return;
	}

	var
		cpos =
			caret.$pos =
			this._getCaretPos( caret ),

		pnw =
			this.zone.pnw,

		fieldPNW =
			this._$spaceFields[ section ].pnw;

	caret.$screenPos =
		view.point(
			cpos.x + pnw.x + fieldPNW.x,
			cpos.n + pnw.y + fieldPNW.y
		);

	caret.$height =
		Math.round(
			( cpos.s - cpos.n ) * view.zoom
		);
};


/*
| User is hovering his/her pointing device around.
|
| Checks if this item reacts on this.
*/
Portal.prototype.pointingHover =
	function(
		view,
		p
	)
{
	if( p === null )
	{
		return null;
	}

	var
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
		this._setHover( null );

		return false;
	}

	var
		moveToButton =
			this._$moveToButton,

		pp =
			view
				.depoint( p )
				.sub( zone.pnw );

	if(
		moveToButton.shape
			.within(
				Euclid.View.proper,
				pp
			)
	)
	{
		this._setHover( 'moveToButton' );
	}
	else
	{
		this._setHover( null );
	}

	return 'default';
};


/*
| Returns the fabric for the input field.
*/
Portal.prototype._weave =
	function(
		caret,
		zone,
		vzone,
		view
	)
{
	var
		f =
		this.$fabric =
			new Euclid.Fabric(
				vzone.width + 2,
				vzone.height + 2
			),

		section =
			caret.sign && caret.sign.path.get( -1 );

	// TODO only fill here
	f.paint(
		Style.getStyle(
			theme.portal.style,
			'normal'
		),
		this.zeroSilhoutte,
		'sketch',
		view.home( )
	);

	if( this.subPaths )
	{
		f.clip(
			this.zeroSilhoutte,
			'sketch',
			view.home( ),
			0
		);

		var spaceUser =
		this._$spaceFields.spaceUser =
			this._prepareField(
				'spaceUser',
				zone,
				null
			);

		var spaceTag =
		this._$spaceFields.spaceTag =
			this._prepareField(
				'spaceTag',
				zone,
				spaceUser.pnw
			);

		var moveToButton =
		this._$moveToButton =
			this._prepareMoveToButton(
				zone
			);

		f.paint(
			Style.getStyle(
				theme.portal.moveTo.style,
				Accent.state(
					this._$hover === 'moveToButton',
					section === 'moveToButton'
				)
			),
			moveToButton.shape,
			'sketch',
			view
		);

		f.paint(
			Style.getStyle(
				theme.portal.input.style,
				'normal'
			),
			spaceUser.silhoutte,
			'sketch',
			view
		);

		f.paint(
			Style.getStyle(
				theme.portal.input.style,
				'normal'
			),
			spaceTag.silhoutte,
			'sketch',
			view
		);

		f.scale( view.zoom );

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

		f.scale( 1 / view.zoom );

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
		view.home( )
	);

	return f;
};


/*
| Text has been inputed.
*/
Portal.prototype.input =
	function(
		text
	)
{
    var
		reg  =
			/([^\n]+)(\n?)/g,

		caret =
			shell.$space.caret,

		section =
			caret.sign.path.get( -1 );

	if( !this._isSection( section ) )
	{
		return false;
	}

	// ignores newlines
    for(
		var rx = reg.exec(text);
		rx !== null;
		rx = reg.exec( text )
	)
	{
		var line = rx[ 1 ];

		shell.peer.insertText(
			this.subPaths[ section ],
			caret.sign.at1,
			line
		);
	}
};


/*
| Font for spacesUser/Tag
*/
Portal.prototype._fonts =
	Jools.immute( {
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
| Returns the caret position.
*/
Portal.prototype._getCaretPos =
	function(
		caret
	)
{
	var
		section =
			caret.sign.path.get( -1 ),

		fs =
			this._fonts[ section ].size,

		descend =
			fs * theme.bottombox,

		p =
			this._locateOffset(
				section,
				caret.sign.at1
			),

		s =
			Math.round( p.y + descend ),

		n =
			s - Math.round( fs + descend ),

		x =
			p.x - 1;

	return Jools.immute(
		{
			s :
				s,

			n :
				n,

			x :
				x
		}
	);
};


/*
| Returns the point of a given offset.
*/
Portal.prototype._locateOffset =
	function(
		section,   // 'spaceUser' or 'spaceTag'
		offset     // the offset to get the point from.
	)
{
	// FIXME cache position
	var
		font =
			this._fonts[ section ],

		text =
			this.tree.twig[ section ];

	return shellverse.grow(
		'Point',
		'x',
			Math.round(
				Euclid.Measure.width(
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


/*
| User pressed a special key.
*/
Portal.prototype.specialKey =
	function(
		key
		// shift
		// ctrl
	)
{
	var
		show =
			false,

		// TODO remove
		caret =
			shell.$space.caret;

	switch( key )
	{
		case 'backspace' :

			this._keyBackspace( caret );

			break;

		case 'del' :

			this._keyDel( caret );

			break;

		case 'down' :

			this._keyDown( caret );

			break;

		case 'end' :

			this._keyEnd( caret );

			break;

/*
		case 'enter' :

			this.keyEnter( caret );

			break;
*/

		case 'left' :

			this._keyLeft( caret );

			break;

		case 'pos1' :

			this._keyPos1( caret )

			break;

		case 'right' :

			this._keyRight( caret );

			break;

		case 'tab' :

			this._keyTab( caret );

			break;

		case 'up' :

			this._keyUp( caret );

			break;
	}
};

/*
| User pressed right key.
*/
Portal.prototype._keyLeft =
	function(
		caret
	)
{
	var
		csign =
			caret.sign,

		section =
			csign.path.get( -1 );

	if( !this._isSection( section ) )
	{
		return;
	}


	if( csign.at1 === 0 )
	{
		if( section === 'spaceTag' )
		{
			shell.setCaret(
				'space',
				new Path(
					csign.path,
					csign.path.length - 1,
						'spaceUser'
					),
				this.tree.twig.spaceUser.length
			);

			shell.redraw =
				true;
		}

		return;
	}

	shell.setCaret(
		'space',
		csign.path,
		csign.at1 - 1
	);

	shell.redraw =
		true;

	return;
};

/*
| User pressed down key.
*/
Portal.prototype._keyDown =
	function(
		caret
	)
{
	var
		csign =
			caret.sign,

		section =
			csign.path.get( -1 );

	if( !this._isSection( section ) )
	{
		return;
	}

	var
		cpos =
			this._getCaretPos( caret );

	switch( section )
	{
		case 'spaceUser' :

			shell.setCaret(
				'space',
				new Path(
					csign.path,
					csign.path.length - 1,
					'spaceTag'
				),

				this._getOffsetAt(
					'spaceTag',
					cpos.x +
						this._$spaceFields.spaceUser.pnw.x
				)
			);

			break;
	}

	shell.redraw =
		true;
};


/*
| User pressed down key.
*/
Portal.prototype._keyTab =
	function(
		caret
	)
{
	var
		csign =
			caret.sign,

		section =
			csign.path.get( -1 );

	if( !this._isSection( section ) )
	{
		return;
	}

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

	shell.setCaret(
		'space',
		new Path(
			csign.path,
			csign.path.length - 1,
				cycle
		),
		0
	);

	shell.redraw =
		true;
};

/*
| User pressed down key.
*/
Portal.prototype._keyUp =
	function(
		caret
	)
{
	var
		csign =
			caret.sign,

		section =
			csign.path.get( -1 );

	if( !this._isSection( section ) )
	{
		return;
	}

	var
		cpos =
			this._getCaretPos( caret );

	switch( section )
	{
		case 'spaceTag' :

			shell.setCaret(
				'space',
				new Path(
					csign.path,
					csign.path.length - 1,
						'spaceUser'
					),
				this._getOffsetAt(
					'spaceUser',
					cpos.x +
						this._$spaceFields.spaceTag.pnw.x
				)
			);

			break;
	}

	shell.redraw =
		true;
};

/*
| User pressed right key.
*/
Portal.prototype._keyRight =
	function(
		caret
	)
{
	var
		csign =
			caret.sign,

		section =
			csign.path.get( -1 );

	if( !this._isSection( section ) )
	{
		return false;
	}

	var value =
		this.tree.twig[ section ];

	if( csign.at1 >= value.length )
	{
		if( section === 'spaceUser' )
		{
			shell.setCaret(
				'space',
				new Path(
					csign.path,
					csign.path.length - 1,
					'spaceTag'
				),
				0
			);

			shell.redraw =
				true;
		}

		return;
	}

	shell.setCaret(
		'space',
		csign.path,
		csign.at1 + 1
	);

	shell.redraw =
		true;

	return;
};


/*
| User pressed backspace.
*/
Portal.prototype._keyBackspace =
	function(
		caret
	)
{
	var
		csign =
			caret.sign,

		section =
			csign.path.get( -1 );

	if( !this._isSection( section ) )
	{
		return;
	}

	var at1 =
		csign.at1;

	if( at1 <= 0 )
	{
		return;
	}

	shell.peer.removeText(
		this.subPaths[ section ],
		at1 - 1,
		1
	);

	shell.redraw =
		true;
};


/*
| User pressed del.
*/
Portal.prototype._keyDel =
	function(
		caret
	)
{
	var
		csign =
			caret.sign,

		section =
			csign.path.get( -1 ),

		value =
			this.tree.twig[ section ];

	if( !this._isSection( section ) )
	{
		return;
	}

	var at1 =
		csign.at1;

	if( at1 >= value.length )
	{
		return;
	}

	shell.peer.removeText(
		this.subPaths[ section ],
		at1,
		1
	);

	shell.redraw =
		true;
};


/*
| User pressed end key.
*/
Portal.prototype._keyEnd =
	function(
		caret
	)
{
	var
		csign =
			caret.sign,

		section =
			csign.path.get( -1 );

	if( !this._isSection( section ) )
	{
		return;
	}

	var
		at1 =
			csign.at1,

		value =
			this.tree.twig[ section ];

	if( at1 >= value.length )
	{
		return;
	}

	shell.setCaret(
		'space',
		csign.path,
		value.length
	);

	shell.redraw =
		true;
};


/*
| Returns true if section is a section.
*/
Portal.prototype._isSection =
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
| Prepares the moveto button
*/
Portal.prototype._prepareMoveToButton =
	function(
		zone
	)
{
	var
		width =
			theme.portal.moveTo.width,

		height =
			theme.portal.moveTo.height,

		rounding =
			theme.portal.moveTo.rounding,

		pnw =
			shellverse.grow(
				'Point',
				'x',
					Jools.half( zone.width - width ),
				'y',
					Jools.half( zone.height ) + 10
			),

		pse =
			pnw.add(
				width,
				height
			);

	return {
		shape :
			new Euclid.RoundRect(
				pnw,
				pse,
				rounding,
				rounding
			),

		textCenter :
			shellverse.grow(
				'Point',
				'x',
					Jools.half( pnw.x + pse.x ),
				'y',
					Jools.half( pnw.y + pse.y )
			)
	};
};

/*
| Prepares an input field ( user / tag )
*/
Portal.prototype._prepareField =
	function(
		section,
		zone,
		basePNW
	)
{
	var
		pitch =
			theme.portal.input.pitch,

		rounding =
			theme.portal.input.rounding,

		text =
			this.tree.twig[ section ],

		width =
			Euclid.Measure.width(
				this._fonts[ section ],
				text
			),

		height =
			this._fonts[ section ].size + 2,

		pnw =
			basePNW === null
			?
			(
				shellverse.grow(
					'Point',
					'x',
						Jools.half( zone.width - width ),
					'y',
						Math.round(
							Jools.half( zone.height ) - 30
						)
				)
			)
			:
			(
				shellverse.grow(
					'Point',
					'x',
						Jools.half( zone.width - width ),
					'y',
						basePNW.y + 23
				)
			),

		silhoutte =
			new Euclid.RoundRect(
				pnw.sub(
					pitch,
					height
				),
				pnw.add(
					Math.round( width ) + pitch,
					pitch
				),
				rounding,
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
Portal.prototype._keyPos1 =
	function(
		caret
	)
{
	var
		csign =
			caret.sign;

	if( csign.at1 <= 0 )
	{
		return;
	}

	shell.setCaret(
		'space',
		csign.path,
		0
	);

	shell.redraw =
		true;
};


/*
| Sets the hovered element.
*/
Portal.prototype._setHover =
	function(
		hover
	)
{
	if( this._$hover === hover )
	{
		return;
	}

	shell.redraw =
		true;

	this._$hover =
		hover;
};



/*
| Returns the offset nearest to point p.
*/
Portal.prototype._getOffsetAt =
	function(
		section,
		x
	)
{
	var
		dx =
			x - this._$spaceFields[ section ].pnw.x,

		value =
			this.tree.twig[ section ],

		x1 =
			0,

		x2 =
			0,

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
		x1 =
			x2;

		x2 =
			Euclid.Measure.width(
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
Portal.prototype._moveTo =
	function( )
{
	shell.moveToSpace(
		this.tree.twig.spaceUser,
		this.tree.twig.spaceTag,
		false
	);
};

} )( );
