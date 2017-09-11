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
					require( '../action/typemap' )
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
				type : [ 'undefined', 'jion$path' ],
				prepare : 'visual_item.concernsHover( hover, path )'
			},
			mark :
			{
				comment : 'the users mark',
				prepare : 'visual_item.concernsMark( mark, path )',
				type :
					require( './mark/typemap' )
					.concat( [ 'undefined' ] )
			},
			path :
			{
				comment : 'the path of the portal',
				type : [ 'undefined', 'jion$path' ]
			},
			transform :
			{
				comment : 'the current space transform',
				type : 'gleam_transform'
			}
		},
		init : [ 'inherit' ],
		alike :
		{
			alikeIgnoringTransform :
			{
				ignores : { 'transform' : true }
			}
		}
	};
}


var
	change_grow,
	change_insert,
	change_remove,
	fabric_portal,
	gleam_ellipse,
	gleam_facet,
	gleam_glint_border,
	gleam_glint_fill,
	gleam_glint_list,
	gleam_glint_mask,
	gleam_glint_paint,
	gleam_glint_text,
	gleam_glint_window,
	gleam_measure,
	gleam_point,
	gleam_rect,
	gleam_roundRect,
	gleam_transform,
	gruga_portal,
	jion,
	jion$pathList,
	visual_mark_caret,
	visual_mark_items,
	result_hover,
	ref_space,
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
		&& inherit.alikeIgnoringTransform( this )
		&& inherit.transform.zoom === this.transform.zoom
		&& jion.hasLazyValueSet( inherit, '_glint' )
	)
	{
		jion.aheadValue( this, '_glint', inherit._glint );
	}
/**/else if( CHECK && CHECK.noinherit )
/**/{
/**/	console.log( 'noinherit', 'visual_portal' );
/**/}

};


/*
| User wants to create a new portal.
*/
visual_portal.createGeneric =
	function(
		action, // the create action
		dp      // the detransform point the createGeneric
		//      // stoped at.
	)
{
	var
		portal,
		key,
		zone;

	zone = gleam_rect.createArbitrary( action.startPoint, dp );

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
					'zone', gleam_rect.zero,
					'spaceUser', '',
					'spaceTag', ''
				),
			'highlight', false,
			'transform', gleam_transform.normal
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
		p,
		section;

	ac = this.zone.pos.y,

	mark = this.mark;

	if( !mark || !mark.hasCaret ) return ac;

	section = this._markSection;

	if( !isSection( section ) ) return ac;

	if( section === 'moveToButton' )
	{
		return ac + this._moveToButtonShape.pos.y;
	}

	font = this._fontFor( section );

	fs = font.size;

	descend = fs * shell_settings.bottombox;

	fieldP = this[ spaceFields[ section ] ].pos;

	p = this._locateOffset( section, mark.caret.at );

	return ac + p.y + fieldP.y - fs;
}
);


/*
| Sees if this portal is being clicked.
*/
prototype.click =
	function(
		p,
		shift,
		access
	)
{
	var
		field,
		fieldLazyName,
		pp,
		setMark,
		sf,
		transform,
		zone;

	if( !this.tShape.within( p ) ) return;

	transform = this.transform;

	zone = this.zone;

	pp = p.detransform( transform ).sub( zone.pos );

	if( this._moveToButtonShape.within( pp ) )
	{
		this._moveTo( );

		return true;
	}

	if( access != 'rw' ) return false;

	pp = p.detransform( transform ).sub( zone.pos );

	for( field in spaceFields )
	{
		fieldLazyName = spaceFields[ field ];

		sf = this[ fieldLazyName ];

		if( sf.shape.within( pp ) )
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
					jion$pathList.create(
						'list:init', [ this.path ]
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
| A create relation action moves.
*/
prototype.createRelationMove = visual_item.createRelationMove;


/*
| A create relation action stops.
*/
prototype.createRelationStop = visual_item.createRelationStop;


/*
| Reacts on ctrl-clicks.
*/
prototype.ctrlClick = visual_item.ctrlClick;


/*
| Handles a potential dragStart event for this item.
*/
prototype.dragStart = visual_item.dragStart;


/*
| Returns the change for dragging this item.
*/
prototype.getDragItemChange = visual_item.getDragItemChangeZone;


/*
| Returns the change for resizing this item.
*/
prototype.getResizeItemChange = visual_item.getResizeItemChangeZone;


/*
| The item's glint.
*/
jion.lazyValue(
	prototype,
	'glint',
	function( )
{
	var
		arr,
		facet,
		tZone;

	tZone = this.tZone;

	arr =
		[
			gleam_glint_window.create(
				'glint', this._glint,
				'rect', tZone.add1_5
			)
		];

	if( this.highlight )
	{
		facet = gruga_portal.facets.getFacet( 'highlight', true );

		arr[ 1 ] =
			gleam_glint_paint.create(
				'facet', facet,
				'shape', this.tShape
			);
	}

	return gleam_glint_list.create( 'list:init', arr );
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

	section = this._markSection;

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
		p
		// dir,
		// shift,
		// ctrl
	)
{
	return this.tShape.within( p );
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
		transform,
		zone;

	transform = this.transform;

	zone = this.zone;

	// not clicked on the portal?
	if( !this.tShape.within( p ) ) return;

	pp = p.detransform( transform ).sub( zone.pos );

	if( this._moveToButtonShape.within( pp ) )
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
| The portal's shape.
*/
jion.lazyValue(
	prototype,
	'shape',
	function( )
{
	var
		zone;

	zone = this.zone;

	return(
		gleam_ellipse.create(
			'pos', zone.pos,
			'width', zone.width,
			'height', zone.height
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
		action,
		zone;

	action = this.action;

	zone = this.fabric.zone;

	switch( action && action.reflect )
	{
		case 'action_dragItems' :

			return zone.add( action.moveBy );

		case 'action_resizeItems' :

			return zone.baseScale( action, 0, 0 );

		default : return this.fabric.zone;
	}
}
);


/*
| Font for spaceUser.
*/
jion.lazyValue(
	prototype,
	'_fontSpaceUser',
	function( )
{
	return shell_fontPool.get( 13, 'la' );
}
);


/*
| Font for spaceTag.
*/
jion.lazyValue(
	prototype,
	'_fontSpaceTag',
	function( )
{
	return shell_fontPool.get( 13, 'la' );
}
);


/*
| Font for moveToButton.
*/
jion.lazyValue(
	prototype,
	'_fontMoveTo',
	function( )
{
	return shell_fontPool.get( 13, 'cm' );
}
);


/*
| Font for spaceUser.
*/
jion.lazyValue(
	prototype,
	'_tFontSpaceUser',
	function( )
{
	return this._fontSpaceUser.transform( this.transform );
}
);


/*
| Font for spaceTag.
*/
jion.lazyValue(
	prototype,
	'_tFontSpaceTag',
	function( )
{
	return this._fontSpaceTag.transform( this.transform );
}
);


/*
| Font for moveToButton.
*/
jion.lazyValue(
	prototype,
	'_tFontMoveTo',
	function( )
{
	return this._fontMoveTo.transform( this.transform );
}
);


/*
| Returns the font for 'section'.
*/
prototype._fontFor =
	function(
		section
	)
{
	switch( section )
	{
		case 'spaceUser' : return this._fontSpaceUser;

		case 'spaceTag' : return this._fontSpaceTag;

		case 'moveTo' : return this._fontMoveTo;

		default : throw new Error( );
	}
};


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
	font = this._fontFor( section );

	text = this.fabric[ section ];

	return gleam_point.create(
		'x',
			Math.round(
				gleam_measure.width(
					font,
					text.substring( 0, offset )
				)
			),
		'y', 0
	);
};


/*
| The space the portals references.
|
| FIXME make this the primer data.
*/
jion.lazyValue(
	prototype,
	'spaceRef',
	function( )
{
	return(
		ref_space.create(
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
| The shape in current transform.
*/
jion.lazyValue(
	prototype,
	'tShape',
function( )
{
	return this.shape.transform( this.transform );
}
);


/*
| Zone in current transform.
*/
jion.lazyValue(
	prototype,
	'tZone',
function( )
{
	return this.zone.transform( this.transform );
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

	section = this._markSection;

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

	section = this._markSection;

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
								cpos.x + this._fieldSpaceUser.pos.x
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

	section = this._markSection;

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

	section = this._markSection;

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

	section = this._markSection;

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
								cpos.x + this._fieldSpaceTag.pos.x
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

	section = this._markSection;

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

	section = this._markSection;

	value = this.fabric[ section ];

	if( !isSection( section ) || section === 'moveToButton' ) return;

	at = mark.caret.at;

	if( at >= value.length ) return;

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

	section = this._markSection;

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

	section = this._markSection;

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
| Prepares the spaceTag field.
*/
jion.lazyValue(
	prototype,
	'_fieldSpaceTag',
	function( )
{
	return this._prepareField( 'spaceTag', this._fieldSpaceUser.pos );
}
);


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
| The moveToButton facet.
*/
jion.lazyValue(
	prototype,
	'_facetMoveToButton',
	function( )
{
	return(
		gruga_portal.buttonFacets.getFacet(
			'hover',
				this.hover
				? this.hover.equals(
					this.path.append( 'moveToButton' )
				)
				: false,
			'focus', this._markSection === 'moveToButton'
		)
	);
}
);


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

	dx = x - this[ spaceFields[ section ] ].pos.x;

	value = this.fabric[ section ];

	x1 = 0;

	x2 = 0;

	font = this._fontFor( section );

	for( a = 0, aZ = value.length; a < aZ; a++ )
	{
		x1 = x2;

		x2 = gleam_measure.width( font, value.substr( 0, a ) );

		if( x2 >= dx ) break;
	}

	if( dx - x1 < x2 - dx && a > 0 )
	{
		a--;
	}

	return a;
};


/*
| Creates the portal's inner glint.
*/
jion.lazyValue(
	prototype,
	'_glint',
	function( )
{
	var
		arr,
		glintCaret,
		facet,
		fieldSpaceUser,
		fieldSpaceTag,
		inputFacet,
		mark,
		orthoMoveToButtonShape,
		ot,
		tZone,
		tzs;

	tZone = this.tZone;

	ot = this.transform.ortho;

	mark = this.mark;

	facet = gruga_portal.facets.getFacet( );

	fieldSpaceUser = this._fieldSpaceUser;

	fieldSpaceTag = this._fieldSpaceTag;

	orthoMoveToButtonShape = this._orthoMoveToButtonShape;

	inputFacet =
		gruga_portal.inputFacets.getFacet(
			'hover', false,
			'focus', false
		);

	arr =
		[
			gleam_glint_paint.create(
				'facet', this._facetMoveToButton,
				'shape', orthoMoveToButtonShape
			),
			gleam_glint_paint.create(
				'facet', inputFacet,
				'shape', fieldSpaceUser.shape.transform( ot )
			),
			gleam_glint_paint.create(
				'facet', inputFacet,
				'shape', fieldSpaceTag.shape.transform( ot )
			),
			gleam_glint_text.create(
				'font', this._tFontSpaceUser,
				'p', fieldSpaceUser.pos.transform( ot ),
				'text', fieldSpaceUser.text
			),
			gleam_glint_text.create(
				'font', this._tFontSpaceTag,
				'p', fieldSpaceTag.pos.transform( ot ),
				'text', fieldSpaceTag.text
			),
			gleam_glint_text.create(
				'font', this._tFontMoveTo,
				'p', orthoMoveToButtonShape.pc,
				'text', 'move to'
			)
		];

	if(
		mark
		&& mark.reflect === 'visual_mark_caret'
		&& mark.focus
	)
	{
		glintCaret = this._glintCaret;

		if( glintCaret ) arr[ 6 ] = this._glintCaret;
	}

	tzs = this._zeroShape.transform( ot );

	return(
		gleam_glint_list.create(
			'list:init',
			[
				gleam_glint_fill.create(
					'facet', facet,
					'shape', tzs
				),
				// masks the portals content
				gleam_glint_mask.create(
					'glint', gleam_glint_list.create( 'list:init', arr ),
					'shape', tzs
				),
				// puts the border on top of everything else
				gleam_glint_border.create(
					'facet', facet,
					'shape', tzs
				)
			]
		)
	);
}
);


/*
| Glint for the caret.
*/
jion.lazyValue(
	prototype,
	'_glintCaret',
	function( )
{
	var
		descend,
		fieldPos,
		font,
		fs,
		mark,
		ot,
		p,
		pos,
		section;

	mark = this.mark;

	ot = this.transform.ortho;

	section = this._markSection;

	if( !isSection( section ) || section === 'moveToButton' ) return;

	font = this._fontFor( section );

	fs = font.size;

	descend = fs * shell_settings.bottombox;

	fieldPos = this[ spaceFields[ section ] ].pos;

	p = this._locateOffset( section, mark.caret.at );

	pos =
		p
		.add(
			fieldPos.x,
			p.y + descend + fieldPos.y - fs - descend
		)
		.transform( ot );

	return(
		gleam_glint_fill.create(
			'facet', gleam_facet.blackFill,
			'shape',
				gleam_rect.create(
					'pos', pos,
					'width', 1,
					'height', ot.scale( fs + descend )
				)
		)
	);
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
| The section of the current mark
*/
jion.lazyValue(
	prototype,
	'_markSection',
	function( )
{
	var
		mark;

	mark = this.mark;

	return(
		mark
		&& mark.hasCaret
		&& mark.caret.path.get( -1 )
	);
}
);


/*
| Issues the moveTo action.
*/
prototype._moveTo =
	function( )
{
	root.moveToSpace( this.spaceRef, false );
};


/*
| The move to button shape.
*/
jion.lazyValue(
	prototype,
	'_moveToButtonShape',
	function( )
{
	var
		height,
		rounding,
		width,
		zone;

	zone = this.zone;

	width = gruga_portal.moveToWidth;

	height = gruga_portal.moveToHeight;

	rounding = gruga_portal.moveToRounding;

	return(
		gleam_roundRect.create(
			'pos',
				gleam_point.create(
					'x', ( zone.width - width ) / 2,
					'y', ( zone.height + 10 ) / 2
				),
			'width', width,
			'height', height,
			'a', rounding,
			'b', rounding
		)
	);
}
);


/*
| The move to button shape transformed to current zoom level.
*/
jion.lazyValue(
	prototype,
	'_orthoMoveToButtonShape',
	function( )
{
	return this._moveToButtonShape.transform( this.transform.ortho );
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
		font,
		glint,
		height,
		pitch,
		pos,
		result,
		rounding,
		shape,
		text,
		width,
		zone;

	zone = this.zone;

	pitch = gruga_portal.inputPitch;

	rounding = gruga_portal.inputRounding;

	text = this.fabric[ section ];

	font = this._fontFor( section );

	width = gleam_measure.width( font, text );

	height = font.size + 2;

	pos =
		baseP
		? gleam_point.create(
			'x', ( zone.width - width ) / 2,
			'y', baseP.y + 23
		)
		: gleam_point.create(
			'x', ( zone.width - width ) / 2,
			'y', zone.height / 2 - 30
		);

	shape =
		gleam_roundRect.create(
			'pos', pos.sub( pitch, height ),
			'width', width + 2 * pitch,
			'height', height + pitch,
			'a', rounding,
			'b', rounding
		);

	glint =
		gleam_glint_paint.create(
			'facet',
				gruga_portal.inputFacets.getFacet(
					'hover', false,
					'focus', false
				),
			'shape', shape
		);

	result = {
		text : text,
		width : width,
		height : height,
		pos : pos,
		shape : shape,
		glint : glint
	};

/**/if( FREEZE ) Object.freeze( result );

	return result;
};


/*
| The portal's shape at zero.
*/
jion.lazyValue(
	prototype,
	'_zeroShape',
	function( )
{
	var
		zone;

	zone = this.zone;

	return(
		gleam_ellipse.create(
			'pos', gleam_point.zero,
			'width', zone.width,
			'height', zone.height
		)
	);
}
);


} )( );
