/*
| A portal to another space.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'visual_portal',
		attributes :
		{
			action :
			{
				comment : 'current action',
				type :
					require( '../typemaps/action' )
					.concat( [ 'undefined' ] ),
				prepare : 'visual_item.concernsAction( action, path )'
			},
			fabric :
			{
				comment : 'portal fabric data',
				type : 'fabric_portal'
			},
			highlight :
			{
				comment : 'the item is highlighted',
				type : 'boolean'
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
		},
		init : [ 'inherit' ],
		alike :
		{
			alikeIgnoringView :
			{
				ignores : { 'view' : true }
			}
		}
	};
}


var
	change_grow,
	change_insert,
	change_remove,
	gleam_display_canvas,
	gleam_glint_border,
	gleam_glint_fill,
	gleam_glint_mask,
	gleam_glint_paint,
	gleam_glint_text,
	gleam_glint_twig,
	gleam_glint_window,
	euclid_anchor_ellipse,
	euclid_anchor_point,
	euclid_anchor_roundRect,
	euclid_ellipse,
	euclid_measure,
	euclid_point,
	euclid_rect,
	euclid_roundRect,
	euclid_view,
	fabric_portal,
	fabric_spaceRef,
	gruga_portal,
	jion,
	jion$pathRay,
	math_half,
	visual_mark_caret,
	visual_mark_items,
	result_hover,
	root,
	session_uid,
	shell_fontPool,
	shell_settings,
	visual_item,
	visual_portal;



/*
| Capsule
*/
( function( ) {
'use strict';


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

visual_portal.reflect = 'visual_portal:static';


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
| Portals do not need to be resized proportionally.
*/
prototype.proportional = false;


/*
| Initializer.
*/
prototype._init =
	function(
		inherit
	)
{
	if(
		inherit
		&& inherit.alikeIgnoringView( this )
		&& inherit.view.zoom === this.view.zoom
		&& jion.hasLazyValueSet( inherit, '_display' )
	)
	{
		jion.aheadValue( this, '_display', inherit._display );
	}
};



/*
| User wants to create a new portal.
*/
visual_portal.createGeneric =
	function(
		action, // the create action
		dp      // the deviewed point the createGeneric
		//      // stoped at.
	)
{
	var
		portal,
		key,
		zone;

	zone = euclid_rect.createArbitrary( action.startPoint, dp );

	portal = action.transItem.fabric.create( 'zone', zone );

	key = session_uid( );

	root.alter(
		change_grow.create(
			'path',
				jion.path.empty
				.append( 'twig' )
				.append( key ),
			'val', portal,
			'rank', 0
		)
	);

	root.create(
		'mark',
			visual_mark_caret.create(
				'path',
					root.spaceVisual.get( key ).path
					.append( 'spaceUser' ),
				'at', 0
			)
	);
};


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
| The portal model.
*/
jion.lazyStaticValue(
	visual_portal,
	'model',
	function( )
{
	return(
		visual_portal.create(
			'fabric',
				fabric_portal.create(
					'zone',
						euclid_rect.create(
							'pnw', euclid_point.zero,
							'pse', euclid_point.zero
						),
					'spaceUser', '',
					'spaceTag', ''
				),
			'highlight', false,
			'view', euclid_view.proper
		)
	);
}
);


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
		fieldP,
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

	section = mark.caret.path.get( -1 );

	if( !isSection( section ) ) return ac;

	if( section === 'moveToButton' )
	{
		return ac + this._moveToButton.shape.pnw.y;
	}

	font = this._fonts[ section ];

	fs = font.size;

	descend = fs * shell_settings.bottombox;

	fieldP = this[ spaceFields[ section ] ].p;

	p = this._locateOffset( section, mark.caret.at );

	s = Math.round( p.y + descend ) + fieldP.y;

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
	if( !setMark )
	{
		setMark =
			visual_mark_items.create(
				'itemPaths',
					jion$pathRay.create(
						'ray:init', [ this.path ]
					)
			);
	}

	if( setMark )
	{
		root.create( 'mark', setMark );
	}

	return true;
};


/*
| Reacts on ctrl-clicks.
*/
prototype.ctrlClick = visual_item.ctrlClick;


/*
| A create relation action moves.
*/
prototype.createRelationMove = visual_item.createRelationMove;


/*
| A create relation action stops.
*/
prototype.createRelationStop = visual_item.createRelationStop;


/*
| Handles a potential dragStart event for this item.
*/
prototype.dragStart = visual_item.dragStart;


/*
| The item's glint.
*/
jion.lazyValue(
	prototype,
	'glint',
	function( )
{
	var
		facet,
		glint;

	glint =
		gleam_glint_twig.create(
			'key', this.key,
			'twine:set+',
				gleam_glint_window.create(
					'display', this._display,
					'key', ':body',
					'p', this.zone.pnw.apnw
				)
		);

	if( this.highlight )
	{
		facet = gruga_portal.facets.getFacet( 'highlight', true );

		glint =
			glint.create(
				'twine:set+',
					gleam_glint_paint.create(
						'facet', facet,
						'key', ':highlight',
						'shape', this.vSilhoutte
					)
			);
	}

	return glint;
}
);


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

	section = mark.caret.path.get( -1 );

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
				'at1', mark.caret.at,
				'at2', mark.caret.at + line.length
			)
		);
	}
};


/*
| Returns the change for dragging this item.
*/
prototype.getDragItemChange = visual_item.getDragItemChangeZone;


/*
| Returns the change for resizing this item.
*/
prototype.getResizeItemChange = visual_item.getResizeItemChangeZone;


/*
| The key of this item.
*/
jion.lazyValue(
	prototype,
	'key',
	function( )
{
	return this.path.get( -1 );
}
);


/*
| Nofication when the item lost the users mark.
*/
prototype.markLost = function( ){ };


/*
| Minimum height.
*/
prototype.minHeight = gruga_portal.minHeight;


/*
| Minimum width.
*/
prototype.minWidth = gruga_portal.minWidth;


/*
| Returns the minimum x-scale factor this item could go through.
*/
prototype.minScaleX =
	function(
		zone  // original zone
	)
{
	return this.minWidth / zone.width;
};


/*
| Returns the minimum y-scale factor this item could go through.
*/
prototype.minScaleY =
	function(
		zone  // original zone
	)
{
	return this.minHeight / zone.height;
};


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
		p       // point hovered upon
	)
{
	var
		pp,
		view,
		zone;

	view = this.view;

	zone = this.zone;

	// not clicked on the portal?
	if( !this.vSilhoutte.within( p ) ) return;

	pp = p.fromView( view ).sub( zone.pnw );

	if( this._moveToButton.shape.within( pp ) )
	{
		return(
			result_hover.create(
				'path', this.path.append( 'moveToButton' ),
				'cursor', 'pointer'
			)
		);
	}
	{
		return result_hover.create( 'cursor', 'default' );
	}
};


/*
| Portals are positioned by their zone.
*/
visual_portal.positioning =
prototype.positioning =
	'zone';


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
| The portal's silhoutte at zero.
*/
prototype.azSilhoutte =
	euclid_anchor_ellipse.create(
		'pnw', euclid_anchor_point.nw,
		'pse', euclid_anchor_point.se
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
		action,
		zone;

	action = this.action;

	zone = this.fabric.zone;

	switch( action && action.reflect )
	{
		case 'action_dragItems' :

			return zone.add( action.moveBy );

		case 'action_resizeItems' :

			return zone.intercept( action.pBase, action.scaleX, action.scaleY );

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


/**/if( FREEZE )
/**/{
/**/	Object.freeze( prototype._fonts );
/**/}


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

	section = mark.caret.path.get( -1 );

	if( !isSection( section ) ) return;

	at = mark.caret.at;

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

	section = mark.caret.path.get( -1 );

	if( !isSection( section ) ) return;

	switch( section )
	{
		case 'spaceUser' :

			cpos = this._locateOffset( section, mark.caret.at );

			root.create(
				'mark',
					visual_mark_caret.create(
						'path', this.path.append( 'spaceTag' ),
						'at',
							this._getOffsetAt(
								'spaceTag',
								cpos.x + this._fieldSpaceUser.p.x
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

	section = mark.caret.path.get( -1 );

	if( !isSection( section ) ) return;

	if( mark.caret.at === 0 )
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
				'path', mark.caret.path,
				'at', mark.caret.at - 1
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

	section = mark.caret.path.get( -1 );

	if( !isSection( section ) ) return;

	cycle =
		shift
		? visual_portal.antiCycle( section )
		: visual_portal.cycle( section );

	root.create(
		'mark',
			visual_mark_caret.create(
				'path', mark.caret.path.set( -1, cycle ),
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

	section = mark.caret.path.get( -1 );

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
					mark.caret.at
				);

			root.create(
				'mark',
					visual_mark_caret.create(
						'path', this.path.append( 'spaceUser' ),
						'at',
							this._getOffsetAt(
								'spaceUser',
								cpos.x + this._fieldSpaceTag.p.x
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

	section = mark.caret.path.get( -1 );

	if( !isSection( section ) ) return false;

	value = this.fabric[ section ];

	if(
		section === 'moveToButton'
		|| ( value && mark.caret.at >= value.length )
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
				'path', mark.caret.path,
				'at', mark.caret.at + 1
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

	section = mark.caret.path.get( -1 );

	value = this.fabric[ section ];

	if( !isSection( section ) || section === 'moveToButton' ) return;

	at = mark.caret.at;

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

	section = mark.caret.path.get( -1 );

	if(
		!isSection( section )
		|| section === 'moveToButton'
	)
	{
		return;
	}

	at = mark.caret.at,

	value = this.fabric[ section ];

	if( at >= value.length ) return;

	root.create(
		'mark',
			visual_mark_caret.create(
				'path', mark.caret.path,
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

	section = mark.caret.path.get( -1 );

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
					'path', mark.caret.path.set( -1, cycle ),
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
		pnw,
		pse,
		result,
		rounding,
		width,
		zone;

	zone = this.zone;

	width = gruga_portal.moveToWidth;

	height = gruga_portal.moveToHeight;

	rounding = gruga_portal.moveToRounding;

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

			// FIXME only have an anchorded shape
			// and make it anchored to center
			aShape :
				euclid_anchor_roundRect.create(
					'pnw', pnw.apnw,
					'pse', pse.apnw,
					'a', rounding,
					'b', rounding
				),


			textCenter :
				euclid_point.create(
					'x', math_half( pnw.x + pse.x ),
					'y', math_half( pnw.y + pse.y )
				)
		};

/**/if( FREEZE )
/**/{
/**/	Object.freeze( result );
/**/}

	return result;
}
);

/*
| Prepares an input field ( user / tag )
*/
prototype._prepareField =
	function(
		section,
		baseP
	)
{
	var
		height,
		pitch,
		p,
		rounding,
		silhoutte,
		text,
		width,
		zone;

	zone = this.zone;

	pitch = gruga_portal.inputPitch;

	rounding = gruga_portal.inputRounding;

	text = this.fabric[ section ];

	width = euclid_measure.width( this._fonts[ section ], text );

	height = this._fonts[ section ].size + 2;

	p =
		baseP
		? euclid_anchor_point.nw.create(
			'x', math_half( zone.width - width ),
			'y', baseP.y + 23
		)
		: euclid_anchor_point.nw.create(
			'x', math_half( zone.width - width ),
			'y', Math.round( math_half( zone.height ) - 30 )
		);

	silhoutte =
		euclid_roundRect.create(
			'pnw', p.euclidPoint.sub( pitch, height ),
			'pse', p.euclidPoint.add( Math.round( width ) + pitch, pitch ),
			'a', rounding,
			'b', rounding
		);

	return {
		text : text,
		width : width,
		height : height,
		p : p,
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
		return this._prepareField( 'spaceTag', this._fieldSpaceUser.p );
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

	dx = x - this[ spaceFields[ section ] ].p.x;

	value = this.fabric[ section ];

	x1 = 0;

	x2 = 0;

	font = this._fonts[ section ];

	for( a = 0, aZ = value.length; a < aZ; a++ )
	{
		x1 = x2;

		x2 = euclid_measure.width( font, value.substr( 0, a ) );

		if( x2 >= dx ) break;
	}

	if( dx - x1 < x2 - dx && a > 0 )
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
		content,
		facet,
		glint,
		hview,
		inputFacet,
		mark,
		moveToButton,
		section,
		fieldSpaceUser,
		fieldSpaceTag,
		vZone;

	vZone = this.vZone;

	hview = this.view.home;

	mark = this.mark;

	section =
		mark
		&& mark.hasCaret
		&& mark.caret.path.get( -1 );

	facet = gruga_portal.facets.getFacet( );

	glint =
		gleam_glint_twig.create(
			'key', 'root',
			'twine:set+',
			gleam_glint_fill.create(
				'facet', facet,
				'key', 'background',
				'shape', this.azSilhoutte
			)
		);

	fieldSpaceUser = this._fieldSpaceUser;

	fieldSpaceTag = this._fieldSpaceTag;

	moveToButton = this._moveToButton;

	buttonFacet =
		gruga_portal.buttonFacets.getFacet(
			'hover',
				this.hover
				?  this.hover.equals(
					this.path.append( 'moveToButton' )
				)
				: false,
			'focus', section === 'moveToButton'
		);

	inputFacet =
		gruga_portal.inputFacets.getFacet(
			'hover', false,
			'focus', false
		);

	content =
		gleam_glint_twig.create(
			'key', 'content',
			'twine:set+',
				gleam_glint_paint.create(
					'facet', buttonFacet,
					'key', 'moveToButton',
					'shape', moveToButton.aShape
				),
			'twine:set+',
				gleam_glint_paint.create(
					'facet', inputFacet,
					'key', 'spaceUserField',
					'shape', fieldSpaceUser.silhoutte.inView( hview )
				),
			'twine:set+',
				gleam_glint_paint.create(
					'facet', inputFacet,
					'key', 'spaceTagField',
					'shape', fieldSpaceTag.silhoutte.inView( hview )
				),
			'twine:set+',
				gleam_glint_text.create(
					'font', this._fonts.spaceUser,
					'key', 'spaceUserText',
					'p', fieldSpaceUser.p,
					'text', fieldSpaceUser.text
				)
		);


	/*
	display.paintText(
		'text', fieldSpaceUser.text,
		'p', fieldSpaceUser.p,
		'font', this._fonts.spaceUser
	);

	display.paintText(
		'text', fieldSpaceTag.text,
		'p', fieldSpaceTag.p,
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

	// redraws the border on the end to top
	// everything else

	*/

	glint =
		glint.create(
			'twine:set+',
				gleam_glint_mask.create(
					'key', 'mask',
					'glint', content,
					'shape', this.azSilhoutte
				),
			'twine:set+',
				gleam_glint_border.create(
					'facet', facet,
					'key', 'border',
					'shape', this.azSilhoutte
				)
		);


	return(
		gleam_display_canvas.create(
			'glint', glint,
			'view',
				this.view.create(
					'pan', euclid_point.zero,
					'height', vZone.height,
					'width', vZone.width
				)
		)
	);
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

	section = mark.caret.path.get( -1 );

	if( !isSection( section ) || section === 'moveToButton' )
	{
		return;
	}

	font = this._fonts[ section ];

	fs = font.size;

	descend = fs * shell_settings.bottombox;

	fieldPNW = this[ spaceFields[ section ] ].p;

	p = this._locateOffset( section, mark.caret.at );

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
