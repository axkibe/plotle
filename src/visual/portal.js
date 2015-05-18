/*
| A portal to another space.
*/


var
	change_insert,
	change_remove,
	euclid_display,
	euclid_ellipse,
	euclid_measure,
	euclid_point,
	euclid_roundRect,
	fabric_spaceRef,
	gruga_portal,
	gruga_portalButtonFacets,
	gruga_portalInputFacets,
	jion,
	math_half,
	visual_mark_caret,
	visual_mark_item,
	result_hover,
	root,
	shell_fontPool,
	theme,
	visual_handlesBezel,
	visual_item,
	visual_portal;



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
	return{
		id : 'visual_portal',
		attributes :
		{
			action :
			{
				comment : 'current action',
				type :
					require( '../typemaps/action' )
					.concat( [ 'undefined' ] ),
				assign : '_action',
				prepare : 'visual_item.concernsAction( action, path )'
			},
			fabric :
			{
				comment : 'portal fabric data',
				type : 'fabric_portal'
			},
			hover :
			{
				comment : 'node currently hovered upon',
				type : [ 'undefined', 'jion$path' ]
			},
			mark :
			{
				comment : 'the users mark',
				prepare : 'visual_item.concernsMark( mark, path )',
				type :
					require( '../typemaps/visualMark' )
					.concat( [ 'undefined' ] )
			},
			path :
			{
				comment : 'the path of the portal',
				type : [ 'undefined', 'jion$path' ]
			},
			view :
			{
				comment : 'the current view',
				type : [ 'euclid_view' ]
			}
		}
	};
}


var
	isSection,
	prototype,
	spaceFields;


/*
| Node includes.
*/
if( NODE )
{
	visual_portal = require( 'jion' ).this( module, 'source' );

	return;
}


prototype = visual_portal.prototype;


/*
| List of all space fields of the portal
*/
spaceFields =
	{
		spaceUser : '_fieldSpaceUser',
		spaceTag : '_fieldSpaceTag'
	};


/**/if( FREEZE )
/**/{
/**/	Object.freeze( spaceFields );
/**/}


/*
| Resize handles to show on portals.
*/
visual_portal.handles =
{
	n : true,
	ne : true,
	e : true,
	se : true,
	s : true,
	sw : true,
	w : true,
	nw : true
};

if( FREEZE )
{
	Object.freeze( visual_portal.handles );
}


/*
| Returns true if section is a section.
*/
isSection =
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
| Gets the previous section in a cycle.
*/
visual_portal.antiCycle =
	function(
		section
	)
{
	switch( section )
	{
		case 'spaceUser' : return 'moveToButton';

		case 'spaceTag' : return 'spaceUser';

		case 'moveToButton' : return 'spaceTag';
	}
};


/*
| Gets the next section in a cycle.
*/
visual_portal.cycle =
	function(
		section
	)
{
	switch( section )
	{
		case 'spaceUser' : return 'spaceTag';

		case 'spaceTag' : return 'moveToButton';

		case 'moveToButton' : return 'spaceUser';
	}
};


/*
| Returns the attention center.
*/
jion.lazyValue(
	prototype,
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

		if( !mark || !mark.hasCaret )
		{
			return ac;
		}

		section = mark.caretPath.get( -1 );

		if( !isSection( section ) ) return ac;

		if( section === 'moveToButton' )
		{
			return ac + this._moveToButton.shape.pnw.y;
		}

		font = this._fonts[ section ];

		fs = font.size;

		descend = fs * theme.bottombox;

		fieldPNW = this[ spaceFields[ section ] ].pnw;

		p = this._locateOffset( section, mark.caretAt );

		s = Math.round( p.y + descend ) + fieldPNW.y;

		n = s - Math.round( fs + descend );

		return ac + n;
	}
);


/*
| Sees if this portal is being clicked.
*/
prototype.click =
	function(
		p,
		shift,
		ctrl,
		access
	)
{
	var
		field,
		fieldLazyName,
		moveToButton,
		pp,
		setMark,
		sf,
		view,
		zone;

	view = this.view;

	zone = this.zone;

	// not clicked on the portal?
	if( !this.vSilhoutte.within( p ) ) return false;

	moveToButton = this._moveToButton;

	pp = p.fromView( view ).sub( zone.pnw );

	if( moveToButton.shape.within( pp ) )
	{
		this._moveTo( );

		return true;
	}

	if( access != 'rw' ) return false;

	pp = p.fromView( view ).sub( zone.pnw );

	for( field in spaceFields )
	{
		fieldLazyName = spaceFields[ field ];

		sf = this[ fieldLazyName ];

		if( sf.silhoutte.within( pp ) )
		{
			setMark =
				visual_mark_caret.create(
					'path', this.path.append( field ),
					'at', this._getOffsetAt( field, pp.x )
				);

			break;
		}
	}

	// if non of the field were clicked
	// just focus the portal itself
	if( !setMark && !this.mark )
	{
		setMark = visual_mark_item.create( 'path', this.path );
	}

	if( setMark )
	{
		root.create( 'mark', setMark );
	}

	return true;
};


/*
| A create relation action ended on this item.
*/
prototype.createRelation = visual_item.createRelation;


/*
| A shorthand to (re)create this note
| with a different zone.
*/
prototype.createWithZone =
	function(
		zone
	)
{
	return this.create( 'fabric', this.fabric.create( 'zone', zone ) );
};


/*
| A move during an action.
*/
prototype.dragMove = visual_item.dragMove;


/*
| Handles a potential dragStart event for this item.
*/
prototype.dragStart = visual_item.dragStart;


/*
| Draws the portal.
*/
prototype.draw =
	function(
		display
	)
{
	display.drawImage(
		'image', this._display,
		'pnw', this.zone.pnw.inView( this.view )
	);
};


/*
| Highlights the portal.
|
| FIXME jionize
*/
prototype.highlight =
	function(
		display
	)
{
	display.border(
		gruga_portal.getFacet( 'highlight', true ).border,
		this.vSilhoutte
	);
};


/*
| Text has been inputed.
*/
prototype.input =
	function(
		text
	)
{
	var
		line,
		reg,
		rx,
		mark,
		section;

	reg  = /([^\n]+)(\n?)/g;

	mark = this.mark;

	section = mark.caretPath.get( -1 );

	if( !isSection( section ) ) return false;

	if( section === 'moveToButton' )
	{
		this._moveTo( );

		return;
	}

	// ignores newlines
	for( rx = reg.exec( text ); rx; rx = reg.exec( text ) )
	{
		line = rx[ 1 ];

		root.alter(
			change_insert.create(
				'val', line,
				'path', this.path.append( section ).chop,
				'at1', mark.caretAt,
				'at2', mark.caretAt + line.length
			)
		);
	}
};



/*
| Returns a handles jion.
*/
jion.lazyValue(
	prototype,
	'handlesBezel',
	function( )
	{
		return(
			visual_handlesBezel.create(
				'handles', visual_portal.handles,
				'silhoutte', this.vSilhoutte,
				'zone', this.vZone
			)
		);
	}
);


/*
| Minimum height.
*/
prototype.minHeight = theme.portal.minHeight;


/*
| Minimum width.
*/
prototype.minWidth = theme.portal.minWidth;


/*
| Mouse wheel turned.
*/
prototype.mousewheel =
	function(
		view,
		p
		// dir,
		// shift,
		// ctrl
	)
{
	return this.vSilhoutte.within( p );
};


/*
| User is hovering his/her pointing device around.
|
| Checks if this item reacts on this.
*/
prototype.pointingHover =
	function(
		p
	)
{
	var
		moveToButton,
		pp,
		view,
		zone;

	view = this.view;

	zone = this.zone;

	// not clicked on the portal?
	if( !this.vSilhoutte.within( p ) )
	{
		return;
	}

	moveToButton = this._moveToButton;


	pp = p.fromView( view ).sub( zone.pnw );

	if( moveToButton.shape.within( pp ) )
	{
		return(
			result_hover.create(
				'path', this.path.append( 'moveToButton' ),
				'cursor', 'default'
			)
		);
	}
	else
	{
		return(
			result_hover.create(
				'path', this.path,
				'cursor', 'default'
			)
		);
	}

};


/*
| Portals are positioned by their zone.
*/
prototype.positioning = 'zone';


/*
| The portal's silhoutte.
*/
jion.lazyValue(
	prototype,
	'silhoutte',
	function( )
{
	var
		zone;

	zone = this.zone;

	return euclid_ellipse.create( 'pnw', zone.pnw, 'pse', zone.pse );
}
);


/*
| The portal's silhoutte at zero.
*/
jion.lazyValue(
	prototype,
	'zeroSilhoutte',
	function( )
{
	var
		zone;

	zone = this.zone;

	return(
		euclid_ellipse.create(
			'pnw', euclid_point.zero,
			'pse', euclid_point.create( 'x', zone.width, 'y', zone.height )
		)
	);
}
);


/*
| The items zone possibly altered by action.
*/
jion.lazyValue(
	prototype,
	'zone',
function( )
{
	var
		action;

	action = this._action;

	switch( action && action.reflect )
	{
		case 'action_itemDrag' : return action.transItem.fabric.zone;

		default : return this.fabric.zone;
	}
}
);


/*
| Font for spacesUser/Tag
*/
prototype._fonts =
{
	spaceUser : shell_fontPool.get( 13, 'la' ),

	spaceTag : shell_fontPool.get( 13, 'la' ),

	moveTo : shell_fontPool.get( 13, 'cm' )
};

if( FREEZE )
{
	Object.freeze( prototype._fonts );
}


/*
| Returns the point of a given offset.
*/
prototype._locateOffset =
	function(
		section,   // 'spaceUser' or 'spaceTag'
		offset     // the offset to get the point from.
	)
{
	var
		font,
		text;

	// FUTURE cache position
	font = this._fonts[ section ];

	text = this.fabric[ section ];

	return euclid_point.create(
		'x',
			Math.round(
				euclid_measure.width(
					font,
					text.substring( 0, offset )
				)
			),
		'y', 0
	);
};


/*
| The space the portals references as fabric_spaceRef jion.
|
| FUTURE make this the primer data.
*/
jion.lazyValue(
	prototype,
	'spaceRef',
	function( )
{
	return(
		fabric_spaceRef.create(
			'username', this.fabric.spaceUser,
			'tag', this.fabric.spaceTag
		)
	);
}
);


/*
| User pressed a special key.
*/
prototype.specialKey =
	function(
		key,
		shift
		// ctrl
	)
{
	switch( key )
	{
		case 'backspace' : this._keyBackspace( shift ); break;

		case 'del' : this._keyDel( shift ); break;

		case 'down' : this._keyDown( shift ); break;

		case 'end' : this._keyEnd( shift ); break;

		case 'enter' : this._keyEnter( shift ); break;

		case 'left' : this._keyLeft( shift ); break;

		case 'pos1' : this._keyPos1( shift ); break;

		case 'right' : this._keyRight( shift ); break;

		case 'tab' : this._keyTab( shift ); break;

		case 'up' : this._keyUp( shift ); break;
	}
};


/*
| Silhoutte in current view.
*/
jion.lazyValue(
	prototype,
	'vSilhoutte',
function( )
{
	return this.silhoutte.inView( this.view );
}
);


/*
| The portals silhoutte at zero for current zoom.
*/
jion.lazyValue(
	prototype,
	'vZeroSilhoutte',
	function( )
{
	return this.zeroSilhoutte.inView( this.view.home );
}
);


/*
| Zone in current view.
*/
jion.lazyValue(
	prototype,
	'vZone',
function( )
{
	return this.zone.inView( this.view );
}
);


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


/*
| User pressed backspace.
*/
prototype._keyBackspace =
	function( )
{
	var
		at,
		mark,
		section;

	mark = this.mark;

	section = mark.caretPath.get( -1 );

	if( !isSection( section ) ) return;

	at = mark.caretAt;

	if( at <= 0 ) return;

	root.alter(
		change_remove.create(
			'path', this.path.append( section ).chop,
			'at1', at - 1,
			'at2', at,
			'val', this.fabric[ section ].substring( at - 1, at )
		)
	);
};



/*
| User pressed down key.
*/
prototype._keyDown =
	function( )
{
	var
		cpos,
		mark,
		section;

	mark = this.mark;

	section = mark.caretPath.get( -1 );

	if( !isSection( section ) ) return;

	switch( section )
	{
		case 'spaceUser' :

			cpos = this._locateOffset( section, mark.caretAt );

			root.create(
				'mark',
					visual_mark_caret.create(
						'path', this.path.append( 'spaceTag' ),
						'at',
							this._getOffsetAt(
								'spaceTag',
								cpos.x + this._fieldSpaceUser.pnw.x
							)
					)
			);

			break;

		case 'spaceTag' :

			root.create(
				'mark',
					visual_mark_caret.create(
						'path', this.path.append( 'moveToButton' ),
						'at', 0
					)
			);

			break;

		case 'moveToButton' :

			root.create(
				'mark',
					visual_mark_caret.create(
						'path', this.path.append( 'spaceUser' ),
						'at', 0
					)
			);

			break;
	}
};



/*
| User pressed right key.
*/
prototype._keyLeft =
	function( )
{
	var
		cycle,
		mark,
		section;

	mark = this.mark;

	section = mark.caretPath.get( -1 );

	if( !isSection( section ) ) return;

	if( mark.caretAt === 0 )
	{
		cycle = visual_portal.antiCycle( section );

		root.create(
			'mark',
				visual_mark_caret.create(
					'path', this.path.append( cycle ),
					'at',
						cycle === 'moveToButton'
						? 0
						: this.fabric[ cycle ].length
				)
		);

		return;
	}

	root.create(
		'mark',
			visual_mark_caret.create(
				'path', mark.caretPath,
				'at', mark.caretAt - 1
			)
	);

	return;
};

/*
| User pressed down key.
*/
prototype._keyTab =
	function(
		shift
	)
{
	var
		cycle,
		mark,
		section;

	mark = this.mark;

	section = mark.caretPath.get( -1 );

	if( !isSection( section ) ) return;

	cycle =
		shift
		? visual_portal.antiCycle( section )
		: visual_portal.cycle( section );

	root.create(
		'mark',
			visual_mark_caret.create(
				'path', mark.caretPath.set( -1, cycle ),
				'at', 0
			)
	);
};

/*
| User pressed down key.
*/
prototype._keyUp =
	function( )
{
	var
		cpos,
		mark,
		section;

	mark = this.mark;

	section = mark.caretPath.get( -1 );

	if( !isSection( section ) ) return;

	switch( section )
	{
		case 'spaceUser' :

			root.create(
				'mark',
					visual_mark_caret.create(
						'path', this.path.append( 'moveToButton' ),
						'at', 0
					)
			);

			break;

		case 'spaceTag' :

			cpos =
				this._locateOffset(
					section,
					mark.caretAt
				);

			root.create(
				'mark',
					visual_mark_caret.create(
						'path', this.path.append( 'spaceUser' ),
						'at',
							this._getOffsetAt(
								'spaceUser',
								cpos.x + this._fieldSpaceTag.pnw.x
							)
					)
			);

			break;

		case 'moveToButton' :

			root.create(
				'mark',
					visual_mark_caret.create(
						'path', this.path.append( 'spaceTag' ),
						'at', 0
					)
			);

			break;
	}
};

/*
| User pressed right key.
*/
prototype._keyRight =
	function( )
{
	var
		cycle,
		mark,
		section,
		value;

	mark = this.mark;

	section = mark.caretPath.get( -1 );

	if( !isSection( section ) ) return false;

	value = this.fabric[ section ];

	if(
		section === 'moveToButton'
		|| ( value && mark.caretAt >= value.length )
	)
	{
		cycle = visual_portal.cycle( section );

		root.create(
			'mark',
				visual_mark_caret.create(
					'path', this.path.append( cycle ),
					'at', 0
				)
		);

		return;
	}

	root.create(
		'mark',
			visual_mark_caret.create(
				'path', mark.caretPath,
				'at', mark.caretAt + 1
			)
	);

	return;
};


/*
| User pressed del.
*/
prototype._keyDel =
	function( )
{
	var
		at,
		mark,
		section,
		value;

	mark = this.mark;

	section = mark.caretPath.get( -1 );

	value = this.fabric[ section ];

	if( !isSection( section ) || section === 'moveToButton' ) return;

	at = mark.caretAt;

	if( at >= value.length )
	{
		return;
	}

	root.alter(
		change_remove.create(
			'path', this.path.append( section ).chop,
			'at1', at,
			'at2', at + 1,
			'val', this.fabric[ section ].substring( at, at + 1 )
		)
	);
};


/*
| User pressed end key.
*/
prototype._keyEnd =
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
		!isSection( section )
		|| section === 'moveToButton'
	)
	{
		return;
	}

	at = mark.caretAt,

	value = this.fabric[ section ];

	if( at >= value.length ) return;

	root.create(
		'mark',
			visual_mark_caret.create(
				'path', mark.caretPath,
				'at', value.length
			)
	);
};


/*
| User pressed enter key.
*/
prototype._keyEnter =
	function( )
{
	var
		cycle,
		mark,
		section;

	mark = this.mark;

	section = mark.caretPath.get( -1 );

	if( !isSection( section ) ) return;

	switch( section )
	{
		case 'spaceUser' : cycle = 'spaceTag'; break;

		case 'spaceTag' : cycle = 'moveToButton'; break;
	}

	if( cycle )
	{
		root.create(
			'mark',
				visual_mark_caret.create(
					'path', mark.caretPath.set( -1, cycle ),
					'at', 0
				)
		);
	}
	else
	{
/**/	if( CHECK )
/**/	{
/**/		if( section !== 'moveToButton' ) throw new Error( );
/**/	}

		this._moveTo( );
	}
};


/*
| Prepares the moveTo button.
*/
jion.lazyValue(
	prototype,
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
				'x', math_half( zone.width - width ),
				'y', math_half( zone.height ) + 10
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
						'x', math_half( pnw.x + pse.x ),
						'y', math_half( pnw.y + pse.y )
					)
			};

/**/	if( FREEZE )
/**/	{
/**/		Object.freeze( result );
/**/	}

		return result;
	}
);

/*
| Prepares an input field ( user / tag )
*/
prototype._prepareField =
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

	text = this.fabric[ section ];

	width = euclid_measure.width( this._fonts[ section ], text );

	height = this._fonts[ section ].size + 2;

	pnw =
		basePNW
		? euclid_point.create(
			'x', math_half( zone.width - width ),
			'y', basePNW.y + 23
		)
		: euclid_point.create(
			'x', math_half( zone.width - width ),
			'y', Math.round( math_half( zone.height ) - 30 )
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
jion.lazyValue(
	prototype,
	'_fieldSpaceUser',
	function( )
	{
		return this._prepareField( 'spaceUser' );
	}
);


/*
| Prepares the spaceTag field.
*/
jion.lazyValue(
	prototype,
	'_fieldSpaceTag',
	function( )
	{
		return this._prepareField( 'spaceTag', this._fieldSpaceUser.pnw );
	}
);


/*
| User pressed pos1 key,
*/
prototype._keyPos1 =
	function( )
{
	root.create( 'mark', this.mark.create( 'at', 0 ) );
};


/*
| Returns the offset nearest to point p.
*/
prototype._getOffsetAt =
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

	dx = x - this[ spaceFields[ section ] ].pnw.x;

	value = this.fabric[ section ];

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
| Creates the portal's display.
*/
jion.lazyValue(
	prototype,
	'_display',
	function( )
	{
		var
			buttonFacet,
			display,
			facet,
			hview,
			inputFacet,
			mark,
			moveToButton,
			section,
			fieldSpaceUser,
			fieldSpaceTag,
			vZone;

		vZone = this.vZone;

		display =
			euclid_display.create(
				'width', vZone.width + 2,
				'height', vZone.height + 2
			),

		hview = this.view.home;

		mark = this.mark;

		section =
			mark
			&& mark.hasCaret
			&& mark.caretPath.get( -1 );

		facet = gruga_portal.getFacet( );

		display.fill( facet.fill, this.vZeroSilhoutte );

		if( this.path )
		{
			display.clip( this.vZeroSilhoutte, 0 );

			fieldSpaceUser = this._fieldSpaceUser;

			fieldSpaceTag = this._fieldSpaceTag;

			moveToButton = this._moveToButton;

			buttonFacet =
				gruga_portalButtonFacets.getFacet(
					'hover',
						this.hover
						?  this.hover.equals(
							this.path.append( 'moveToButton' )
						)
						: false,
					'focus', section === 'moveToButton'
				);

			inputFacet =
				gruga_portalInputFacets.getFacet(
					'hover', false,
					'focus', false
				);

			display.paint(
				buttonFacet.fill,
				buttonFacet.border,
				moveToButton.shape.inView( hview )
			);

			display.paint(
				inputFacet.fill,
				inputFacet.border,
				fieldSpaceUser.silhoutte.inView( hview )
			);

			display.paint(
				inputFacet.fill,
				inputFacet.border,
				fieldSpaceTag.silhoutte.inView( hview )
			);

			display.scale( hview.zoom );

			display.paintText(
				'text', fieldSpaceUser.text,
				'p', fieldSpaceUser.pnw,
				'font', this._fonts.spaceUser
			);

			display.paintText(
				'text', fieldSpaceTag.text,
				'p', fieldSpaceTag.pnw,
				'font', this._fonts.spaceTag
			);

			display.paintText(
				'text', 'move to',
				'p', moveToButton.textCenter,
				'font', this._fonts.moveTo
			);


			if(
				mark
				&& mark.reflect === 'visual_mark_caret'
				&& mark.focus
			)
			{
				this._drawCaret( display );
			}

			display.scale( 1 / hview.zoom );

			display.deClip( );
		}

		// redraws the border on the end to top
		// everything else

		display.border( facet.border, this.vZeroSilhoutte );

		return display;
	}
);


/*
| Displays the caret.
*/
prototype._drawCaret =
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

	if( !isSection( section ) || section === 'moveToButton' )
	{
		return;
	}

	font = this._fonts[ section ];

	fs = font.size;

	descend = fs * theme.bottombox;

	fieldPNW = this[ spaceFields[ section ] ].pnw;

	p = this._locateOffset( section, mark.caretAt );

	s = Math.round( p.y + descend ) + fieldPNW.y;

	n = s - Math.round( fs + descend );

	// displays the caret
	display.fillRect( 'black', p.x + fieldPNW.x, n, 1, s - n );
};


/*
| Issues the moveTo action.
*/
prototype._moveTo =
	function( )
{
	root.moveToSpace( this.spaceRef, false );
};


} )( );
