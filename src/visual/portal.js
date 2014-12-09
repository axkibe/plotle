/*
| A portal to another space.
*/


var
	Accent,
	fabric_spaceRef,
	fontPool,
	euclid_display,
	euclid_ellipse,
	euclid_measure,
	euclid_point,
	euclid_rect,
	euclid_roundRect,
	euclid_view,
	jools,
	marks,
	peer,
	result,
	root,
	Style,
	theme,
	visual;


visual = visual || { };


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
		id :
			'visual.portal',
		attributes :
			{
				hover :
					{
						comment :
							'node currently hovered upon',
						type :
							'jion_path',
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
									[ 'mark', 'path' ]
							},
						type :
							'Object', // FUTURE '->marks'
						defaultValue :
							undefined,
						allowsNull :
							true
					},
				path :
					{
						comment :
							'the path of the doc',
						type :
							'jion_path',
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
							'euclid_view',
						defaultValue :
							undefined
					},
				zone :
					{
						comment :
							'the portals zone',
						type :
							'euclid_rect',
						json :
							true
					}
			},
		init :
			[ ],
		subclass :
			'visual.item'
	};
}


var
	portal;

/*
| Node includes.
*/
if( SERVER )
{
	jools = require( '../jools/jools' );

	portal = require( '../jion/this' )( module );
}
else
{
	portal = visual.portal;
}


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

	zone = this.zone;

	minWidth = theme.portal.minWidth;

	minHeight = theme.portal.minHeight;

	if(
		zone.width  < minWidth
		||
		zone.height < minHeight
	)
	{
		zone =
		this.zone =
			euclid_rect.create(
				'pnw', zone.pnw,
				'pse',
					zone.pnw.add(
						Math.max( minWidth, zone.width ),
						Math.max( minHeight, zone.height )
					)
			);
	}
};


/*
| List of all space fields of the portal
*/
var _spaceFields =
	{
		spaceUser :
			'_fieldSpaceUser',
		spaceTag :
				'_fieldSpaceTag'
	};


/**/if( CHECK )
/**/{
/**/	Object.freeze( _spaceFields );
/**/}


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
	};

/**/if( CHECK )
/**/{
/**/	Object.freeze( portal.prototype.handles );
/**/}


/*
| The portal's silhoutte.
*/
jools.lazyValue(
	portal.prototype,
	'silhoutte',
	function( )
	{
		return(
			euclid_ellipse.create(
				'pnw', this.zone.pnw,
				'pse', this.zone.pse
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
		return(
			euclid_ellipse.create(
				'pnw',
					euclid_point.zero,
				'pse',
					euclid_point.create(
						'x', this.zone.width,
						'y', this.zone.height
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

	switch( action.reflect_ )
	{
		case 'actions_itemDrag' :
		case 'actions_itemResize' :

			zone = this.zone;

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

			peer.setZone( this.path, zone );

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
		fieldLazyName,
		mark,
		moveToButton,
		pp,
		sf,
		zone;

	mark = null;

	zone = this.zone;

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

	moveToButton = this._moveToButton;

	pp =
		view
		.depoint( p )
		.sub( zone.pnw );

	if(
		moveToButton.shape
		.within( euclid_view.proper, pp )
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

	for( var field in _spaceFields )
	{
		fieldLazyName = _spaceFields[ field ];

		sf = this[ fieldLazyName ];

		if(
			sf.silhoutte.within( euclid_view.proper, pp )
		)
		{
			mark =
				root.setMark(
					marks.caret.create(
						'path', this.path.append( field  ),
						'at', this._getOffsetAt( field, pp.x )
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
			marks.item.create( 'path', this.path )
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
			descend,
			fieldPNW,
			font,
			fs,
			mark,
			n,
			p,
			s,
			section;

		ac = this.zone.pnw.y,

		mark = this.mark;

		if( !mark.hasCaret )
		{
			return ac;
		}

		section = mark.caretPath.get( -1 );

		if( !this._isSection( section ) )
		{
			return ac;
		}

		if( section === 'moveToButton' )
		{
			return ac + this._moveToButton.shape.pnw.y;
		}

		font = this._fonts[ section ];

		fs = font.size;

		descend = fs * theme.bottombox;

		fieldPNW = this[ _spaceFields[ section ] ].pnw;

		p =
			this._locateOffset(
				section,
				mark.caretAt
			);

		s = Math.round( p.y + descend ) + fieldPNW.y;

		n = s - Math.round( fs + descend );

		return ac + n;
	}
);


/*
| Draws the portal.
*/
portal.prototype.draw =
	function(
		display
	)
{
	display.drawImage(
		'image', this._display,
		'pnw', this.view.point( this.zone.pnw )
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
	return(
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
	function(
		display
	)
{
	display.edge(
		Style.getStyle(
			theme.portal.style,
			'highlight'
		),
		this.silhoutte,
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

	moveToButton = this._moveToButton;

	pp =
		view
		.depoint( p )
		.sub( zone.pnw );

	if(
		moveToButton.shape.within( euclid_view.proper, pp )
	)
	{
		return(
			result.hover.create(
				'path', this.path.append( 'moveToButton' ),
				'cursor', 'default'
			)
		);
	}
	else
	{
		return(
			result.hover.create(
				'path', this.path,
				'cursor', 'default'
			)
		);
	}

};


/*
| Creates the portal's display.
*/
jools.lazyValue(
	portal.prototype,
	'_display',
	function( )
	{
		var
			f,
			hview,
			mark,
			moveToButton,
			section,
			fieldSpaceUser,
			fieldSpaceTag,
			vzone;

		vzone = this.view.rect( this.zone );

		f =
			euclid_display.create(
				'width', vzone.width + 2,
				'height', vzone.height + 2
			),

		hview = this.view.home;

		mark = this.mark;

		section =
			mark
			&& mark.hasCaret
			&& mark.caretPath.get( -1 );

		f.fill(
			Style.getStyle(
				theme.portal.style,
				'normal'
			),
			this.zeroSilhoutte,
			hview
		);

		if( !this.path.isEmpty )
		{
			f.clip( this.zeroSilhoutte, hview, 0 );

			fieldSpaceUser = this._fieldSpaceUser;

			fieldSpaceTag = this._fieldSpaceTag;

			moveToButton = this._moveToButton;

			f.paint(
				Style.getStyle(
					theme.portal.moveTo.style,
					Accent.state(
						this.hover.equals( 
							this.path.append( 'moveToButton' )
						),
						section === 'moveToButton'
					)
				),
				moveToButton.shape,
				hview
			);

			f.paint(
				Style.getStyle(
					theme.portal.input.style,
					'normal'
				),
				fieldSpaceUser.silhoutte,
				hview
			);

			f.paint(
				Style.getStyle(
					theme.portal.input.style,
					'normal'
				),
				fieldSpaceTag.silhoutte,
				hview
			);

			f.scale( hview.zoom );

			f.paintText(
				'text',
					fieldSpaceUser.text,
				'p',
					fieldSpaceUser.pnw,
				'font',
					this._fonts.spaceUser
			);

			f.paintText(
				'text',
					fieldSpaceTag.text,
				'p',
					fieldSpaceTag.pnw,
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
				mark
				&&
				mark.reflect === 'marks.caret'
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
		reg,
		rx,
		mark,
		section;

	reg  = /([^\n]+)(\n?)/g;

	mark = this.mark;

	section = mark.caretPath.get( -1 );

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
		rx = reg.exec(text);
		rx !== null;
		rx = reg.exec( text )
	)
	{
		var line = rx[ 1 ];

		peer.insertText(
			this.path.append( section ),
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
		{
			spaceUser : fontPool.get( 13, 'la' ),

			spaceTag : fontPool.get( 13, 'la' ),

			moveTo : fontPool.get( 13, 'cm' )
		};

/**/if( CHECK )
/**/{
/**/	Object.freeze( portal.prototype._fonts );
/**/}

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
		font = this._fonts[ section ];

		text = this[ section ];

		return euclid_point.create(
			'x',
				Math.round(
					euclid_measure.width(
						font,
						text.substring( 0, offset )
					)
				),
			'y',
				0
		);
	};
}


/*
| Displays the caret.
*/
portal.prototype._drawCaret =
	function(
		display
	)
{
	var
		descend,
		fieldPNW,
		font,
		fs,
		mark,
		n,
		p,
		s,
		section;

	mark = this.mark;

	section = mark.caretPath.get( -1 );

	if(
		!this._isSection( section )
		||
		section === 'moveToButton' )
	{
		return;
	}

	font = this._fonts[ section ];

	fs = font.size;

	descend = fs * theme.bottombox;

	fieldPNW = this[ _spaceFields[ section ] ].pnw;

	p =
		this._locateOffset(
			section,
			mark.caretAt
		);

	s = Math.round( p.y + descend ) + fieldPNW.y;

	n = s - Math.round( fs + descend );

	// displays the caret
	display.fillRect(
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
		at,
		mark,
		section;

	mark = this.mark;

	section = mark.caretPath.get( -1 );

	if( !this._isSection( section ) )
	{
		return;
	}

	at = mark.caretAt;

	if( at <= 0 )
	{
		return;
	}

	peer.removeText(
		this.path.append( section ),
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
								this._fieldSpaceUser.pnw.x
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
								this._fieldSpaceTag.pnw.x
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

	peer.removeText(
		this.path.append( section ),
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
jools.lazyValue(
	portal.prototype,
	'_moveToButton',
	function( )
	{
		var
			height,
			pmtTheme,
			pnw,
			pse,
			result,
			rounding,
			width,
			zone;

		pmtTheme = theme.portal.moveTo;

		zone = this.zone;

		width = pmtTheme.width;

		height = pmtTheme.height;

		rounding = pmtTheme.rounding;

		pnw =
			euclid_point.create(
				'x', jools.half( zone.width - width ),
				'y', jools.half( zone.height ) + 10
			),

		pse = pnw.add( width, height );

		result =
			{
				shape :
					euclid_roundRect.create(
						'pnw', pnw,
						'pse', pse,
						'a', rounding,
						'b', rounding
					),

				textCenter :
					euclid_point.create(
						'x', jools.half( pnw.x + pse.x ),
						'y', jools.half( pnw.y + pse.y )
					)
			};

/**/	if( CHECK )
/**/	{
/**/		Object.freeze( result );
/**/	}

		return result;
	}
);

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
		height,
		pitch,
		pnw,
		rounding,
		silhoutte,
		text,
		width,
		zone;

	zone = this.zone;

	pitch = theme.portal.input.pitch;

	rounding = theme.portal.input.rounding;

	text = this[ section ];

	width =
		euclid_measure.width(
			this._fonts[ section ],
			text
		);

	height = this._fonts[ section ].size + 2;

	pnw =
		basePNW === null
		?
		(
			euclid_point.create(
				'x', jools.half( zone.width - width ),
				'y', Math.round( jools.half( zone.height ) - 30 )
			)
		)
		:
		(
			euclid_point.create(
				'x', jools.half( zone.width - width ),
				'y', basePNW.y + 23
			)
		);

	silhoutte =
		euclid_roundRect.create(
			'pnw', pnw.sub( pitch, height ),
			'pse', pnw.add( Math.round( width ) + pitch, pitch ),
			'a', rounding,
			'b', rounding
		);

	return {
		text : text,
		width : width,
		height : height,
		pnw : pnw,
		silhoutte : silhoutte
	};
};


/*
| Prepares the spaceUser field.
*/
jools.lazyValue(
	portal.prototype,
	'_fieldSpaceUser',
	function( )
	{
		return this._prepareField( 'spaceUser', null );
	}
);


/*
| Prepares the spaceTag field.
*/
jools.lazyValue(
	portal.prototype,
	'_fieldSpaceTag',
	function( )
	{
		return this._prepareField( 'spaceTag', this._fieldSpaceUser.pnw );
	}
);

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
		a,
		aZ,
		dx,
		font,
		value,
		x1,
		x2;

	dx = x - this[ _spaceFields[ section ] ].pnw.x;

	value = this[ section ];

	x1 = 0;

	x2 = 0;

	font = this._fonts[ section ];

	for(
		a = 0, aZ = value.length;
		a < aZ;
		a++
	)
	{
		x1 = x2;

		x2 = euclid_measure.width( font, value.substr( 0, a ) );

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
| The space the portals references as fabric_spaceRef jion.
*/
jools.lazyValue(
	portal.prototype,
	'spaceRef',
	function( )
{
	return(
		fabric_spaceRef.create(
			'username', this.spaceUser,
			'tag', this.spaceTag
		)
	);
}
);


/*
| Issues the moveTo action.
*/
portal.prototype._moveTo =
	function( )
{
	root.moveToSpace( this.spaceRef, false );
};


} )( );
