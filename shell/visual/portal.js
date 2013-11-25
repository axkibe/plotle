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


if( CHECK && typeof( window ) === 'undefined' )
{
	throw new Error(
		'this code needs a browser!'
	);
}


var
	_tag =
		'X9357879';

/*
| Constructor.
*/
var Portal =
Visual.Portal =
	function(
		tag,
		tree,
		path,
		zone,
		mark
	)
{
	if( CHECK && tag !== _tag )
	{
		throw new Error(
			'tag mismatch'
		);
	}

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

	this.mark =
		mark;

	// the prepared space fields
	// FIXME lazy evaluate
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
		// free strings
	)
{
	var
		fontsize =
			null,

		inherit =
			null,

		mark =
			null,

		path =
			null,

		tree =
			null,

		zone =
			null;

	for(
		var a = 0, aZ = arguments.length;
		a < aZ;
		a += 2
	)
	{

		switch( arguments[ a ] )
		{
			case 'alter' :

				if( arguments[ a + 1] )
				{
					throw new Error(
						'alter not supported'
					);
				}

				break;

			case 'inherit' :

				inherit =
					arguments[ a + 1 ];

				break;

			case 'mark' :

				mark =
					arguments[ a + 1 ];

				break;

			case 'path' :

				path =
					arguments[ a + 1 ];

				break;

			case 'tree' :

				tree =
					arguments[ a + 1 ];

				break;

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

		if( !tree )
		{
			tree =
				inherit.tree;
		}

		if(
			(
				inherit.tree === tree
			)
			&&
			(
				inherit.path && inherit.path.equals( path )
			)
			&&
			(
				inherit.zone && inherit.zone.equals( zone )
			)
			&&
			(
				inherit.mark && inherit.mark.equals( mark )
			)
		)
		{
			return inherit;
		}
	}

	return (
		new Portal(
			_tag,
			tree,
			path,
			zone,
			mark
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
			this.zone,

		mark =
			null;

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

	shell.redraw =
		true;

	var
		pp =
			view
				.depoint( p )
				.sub( zone.pnw );

	for( var field in Portal.spaceFields )
	{
		var
			sf =
				this._$spaceFields[ field ];

		if(
			sf.silhoutte
				.within(
					Euclid.View.proper,
					pp
				)
		)
		{
			mark =
				shell.userMark(
					'set',
					'type',
						'caret',
					'section',
						'space',
					'path',
						this.subPaths[ field ],
					'at1',
						this._getOffsetAt(
							field,
							pp.x
						)
				);

			break;
		}
	}

	// if non of the field were clicked
	// just focus the portal itself
	if(
		mark === null &&
		shell.space.focusedItem( ) !== this
	)
	{
		shell.userMark(
			'set',
			'type',
				'item',
			'section',
				'space',
			'path',
				this.path
		);
	}

	// shell.d_eselect( ); TODO

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
/*
Portal.prototype.p_ositionCaret = TODO
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
		// TODO
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
*/


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

		mark =
			this.mark,

		section =
			mark &&
			mark.sign &&
			mark.sign.path.get( -1 );

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


		if(
			mark &&
			mark.type === 'caret' &&
			mark.concerns( this.path )
		)
		{
			this._drawCaret(
				f,
				view,
				mark
			);
		}

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
	// TODO make moveToButton react.
    var
		reg  =
			/([^\n]+)(\n?)/g,

		mark =
			this.mark,

		section =
			mark.sign.path.get( -1 );

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
			mark.sign.at1,
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
| Returns the mark position.
*/
/*
Portal.prototype._getCaretPos =
	function( )
{
	var
		mark =
			this.mark,

		section =
			mark.sign.path.get( -1 ),

		fs =
			this._fonts[ section ].size,

		descend =
			fs * theme.bottombox,

		p =
			this._locateOffset(
				section,
				mark.sign.at1
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
*/

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
| Draws the caret
*/
Portal.prototype._drawCaret =
	function(
		fabric,
		view,
		mark
	)
{
	var
		space =
			shell.space,

		item =
			shell.space.getSub(
				this.path,
				'Item'
			),

		section =
			mark.sign.path.get( -1 );

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
			font.twig.size,

		descend =
			fs * theme.bottombox,

		fieldPNW =
			this._$spaceFields[ section ].pnw,
		
		p =
			this._locateOffset(
				section,
				mark.sign.at1
			),

		s =
			Math.round( p.y + descend ) + fieldPNW.y,

		n =
			s - Math.round( fs + descend );

	// TODO
	/*
	system.focusCenter(
		'p',
			view.point(
				cx + zone.pnw.x,
				cn + zone.pnw.y
			)
	);
	*/

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
Portal.prototype.specialKey =
	function(
		key
		// shift
		// ctrl
	)
{
	var
		show =
			false;

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

/*
		case 'enter' :

			this.keyEnter( );

			break;
*/

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
Portal.prototype._keyBackspace =
	function( )
{
	var
		sign =
			this.mark.sign,

		section =
			sign.path.get( -1 );

	if( !this._isSection( section ) )
	{
		return;
	}

	var
		at1 =
			sign.at1;

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
| User pressed down key.
*/
Portal.prototype._keyDown =
	function( )
{
	var
		sign =
			this.mark.sign,

		section =
			sign.path.get( -1 );

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
					sign.at1
				);

			shell.userMark(
				'set',
				'type',
					'caret',
				'section',
					'space',
				'path',
					// FIXME use this paths
					new Path(
						sign.path,
						sign.path.length - 1,
						'spaceTag'
					),
				'at1',
					this._getOffsetAt(
						'spaceTag',
						cpos.x +
							this._$spaceFields.spaceUser.pnw.x
					)
			);
		
			break;

		case 'spaceTag' :
			
			shell.userMark(
				'set',
				'type',
					'caret',
				'section',
					'space',
				'path',
					// FIXME use this paths
					new Path(
						sign.path,
						sign.path.length - 1,
						'moveToButton'
					),
				'at1',
					0
			);

			break;

		case 'moveToButton' :
	
			shell.userMark(
				'set',
				'type',
					'caret',
				'section',
					'space',
				'path',
					// FIXME use this paths
					new Path(
						sign.path,
						sign.path.length - 1,
						'spaceUser'
					),
				'at1',
					0
			);

			break;
	}

	shell.redraw =
		true;
};



/*
| User pressed right key.
*/
Portal.prototype._keyLeft =
	function( )
{
	var
		// TODO call msign
		sign =
			this.mark.sign,

		section =
			sign.path.get( -1 );

	if( !this._isSection( section ) )
	{
		return;
	}

	if( sign.at1 === 0 )
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

		shell.userMark(
			'set',
			'type',
				'caret',
			'section',
				'space',
			'path',
				// FIXME rather user this.path
				new Path(
					sign.path,
					sign.path.length - 1,
						cycle
					),
			'at1',
				cycle === 'moveToButton' ?
					0
					:
					this.tree.twig[ cycle ].length
		);

		shell.redraw =
			true;

		return;
	}

	shell.userMark(
		'set',
		'type',
			'caret',
		'section',
			'space',
		'path',
			sign.path,
		'at1',
			sign.at1 - 1
	);

	shell.redraw =
		true;

	return;
};

/*
| User pressed down key.
*/
Portal.prototype._keyTab =
	function( )
{
	var
		sign =
			this.mark.sign,

		section =
			sign.path.get( -1 );

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

	shell.userMark(
		'set',
		'type',
			'caret',
		'section',
			'space',
		'path',
			new Path(
				sign.path,
				sign.path.length - 1,
					cycle
			),
		'at1',
			0
	);

	shell.redraw =
		true;
};

/*
| User pressed down key.
*/
Portal.prototype._keyUp =
	function( )
{
	var
		sign =
			this.mark.sign,

		section =
			sign.path.get( -1 );

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

			shell.userMark(
				'set',
				'type',
					'caret',
				'section',
					'space',
				'path', // FIXME this.paths
					new Path(
						sign.path,
						sign.path.length - 1,
							'moveToButton'
						),
				'at1',
					0
			);

			break;

		case 'spaceTag' :

			cpos =
				this._locateOffset(
					section,
					sign.at1
				);

			shell.userMark(
				'set',
				'type',
					'caret',
				'section',
					'space',
				'path', // FIXME this.paths
					new Path(
						sign.path,
						sign.path.length - 1,
							'spaceUser'
						),
				'at1',
					this._getOffsetAt(
						'spaceUser',
						cpos.x +
							this._$spaceFields.spaceTag.pnw.x
					)
			);

			break;

		case 'moveToButton' :

			shell.userMark(
				'set',
				'type',
					'caret',
				'section',
					'space',
				'path', // FIXME this.paths
					new Path(
						sign.path,
						sign.path.length - 1,
							'spaceTag'
						),
				'at1',
					0
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
	function( )
{
	var
		sign =
			this.mark.sign,

		section =
			sign.path.get( -1 );

	if( !this._isSection( section ) )
	{
		return false;
	}

	var
		value =
			this.tree.twig[ section ];

	// FIXME make true circulation
	if(
		section === 'moveToButton'
		||
		( value && sign.at1 >= value.length )
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

		shell.userMark(
			'set',
			'type',
				'caret',
			'section',
				'space',
			'path', // FIXME this.paths
				new Path(
					sign.path,
					sign.path.length - 1,
					cycle
				),
			'at1',
				0
		);

		shell.redraw =
			true;

		return;
	}

	shell.userMark(
		'set',
		'type',
			'caret',
		'section',
			'space',
		'path',
			sign.path,
		'at1',
			sign.at1 + 1
	);

	shell.redraw =
		true;

	return;
};


/*
| User pressed del.
*/
Portal.prototype._keyDel =
	function( )
{
	var
		sign =
			this.mark.sign,

		section =
			sign.path.get( -1 ),

		value =
			this.tree.twig[ section ];

	if( !this._isSection( section ) )
	{
		return;
	}

	var
		at1 =
			sign.at1;

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
	function( )
{
	var
		sign =
			this.mark.sign,

		section =
			sign.path.get( -1 );

	if( !this._isSection( section ) )
	{
		return;
	}

	var
		at1 =
			sign.at1,

		value =
			this.tree.twig[ section ];

	if( at1 >= value.length )
	{
		return;
	}

	shell.userMark(
		'set',
		'type',
			'caret',
		'section',
			'space',
		'path',
			sign.path,
		'at1',
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
	function( )
{
	var
		sign =
			this.mark.sign;

	if( sign.at1 <= 0 )
	{
		return;
	}

	shell.userMark(
		'set',
		'type',
			'caret',
		'section',
			'space',
		'path',
			sign.path,
		'at1',
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
