/*
| A portal to another space.
*/
'use strict';


tim.define( module, ( def, fabric_portal ) => {


def.extend = './item';


if( TIM )
{
	def.attributes =
	{
		// node currently hovered upon
		// no json thus not saved or transmitted
		hover : { type : [ 'undefined', '< ../trace/hover-types' ] },

		// owner of the space the portal goes to
		spaceUser : { type : 'string', json : true },

		// tag of the space the portal goes to
		spaceTag : { type : 'string', json : true },

		// the portals zone
		zone : { type : '../gleam/rect', json : true }
	};

	def.json = 'portal';

	def.alike =
	{
		alikeIgnoringTransform :
		{
			ignores : { 'transform' : true }
		}
	};
}


const change_grow = tim.require( '../change/grow' );

const change_insert = tim.require( '../change/insert' );

const change_remove = tim.require( '../change/remove' );

const gleam_ellipse = tim.require( '../gleam/ellipse' );

const gleam_facet = tim.require( '../gleam/facet' );

const gleam_font_font = tim.require( '../gleam/font/font' );

const gleam_glint_border = tim.require( '../gleam/glint/border' );

const gleam_glint_fill = tim.require( '../gleam/glint/fill' );

const gleam_glint_list = tim.require( '../gleam/glint/list' );

const gleam_glint_mask = tim.require( '../gleam/glint/mask' );

const gleam_glint_paint = tim.require( '../gleam/glint/paint' );

const gleam_glint_text = tim.require( '../gleam/glint/text' );

const gleam_glint_pane = tim.require( '../gleam/glint/pane' );

const gleam_glint_window = tim.require( '../gleam/glint/window' );

const gleam_point = tim.require( '../gleam/point' );

const gleam_rect = tim.require( '../gleam/rect' );

const gleam_roundRect = tim.require( '../gleam/roundRect' );

const gleam_transform = tim.require( '../gleam/transform' );

const gruga_font = tim.require( '../gruga/font' );

const gruga_portal = tim.require( '../gruga/portal' );

const result_hover = tim.require( '../result/hover' );

const ref_space = tim.require( '../ref/space' );

const session_uid = tim.require( '../session/uid' );

const tim_path = tim.require( 'tim.js/path' );

const trace_root = tim.require( '../trace/root' );

const mark_caret = tim.require( '../mark/caret' );

const mark_items = tim.require( '../mark/items' );


/*
| List of all space fields of the portal
*/
const spaceFields =
	Object.freeze ( {
		spaceUser : '_fieldSpaceUser',
		spaceTag : '_fieldSpaceTag'
	} );


/*
| The zone is directly affected by actions.
*/
def.proto.actionAffects = 'zone';


/*
| Gets the previous section in a cycle.
*/
def.static.antiCycle =
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
| Returns the attention center.
*/
def.lazy.attentionCenter =
	function( )
{
	const ac = this.zone.pos.y;

	const mark = this.mark;

	if( !mark || !mark.hasCaret ) return ac;

	const section = this._markSection;

	if( !fabric_portal.isSection( section ) ) return ac;

	if( section === 'moveToButton' )
	{
		return ac + this._moveToButtonShape.pos.y;
	}

	const font = this._fontFor( section );

	const fs = font.size;

	const fieldP = this[ spaceFields[ section ] ].pos;

	const p = this._locateOffset( section, mark.caretOffset.at );

	return ac + p.y + fieldP.y - fs;
};


/*
| Returns the hover if an item with 'path' concerns about
| the hover.
*/
def.static.concernsHover =
def.proto.concernsHover =
	function(
		hover,
		trace
	)
{
	if( !hover ) return;

	if( hover.hasTrace( trace ) ) return hover;
};


/*
| User wants to create a new portal.
*/
def.static.createGeneric =
	function(
		action, // the create action
		dp      // the detransform point the createGeneric
		//      // stoped at.
	)
{
	const zone = gleam_rect.createArbitrary( action.startPoint, dp );

	const portal = action.transientItem.create( 'zone', zone );

	const key = session_uid.newUid( );

	const path = tim_path.empty.append( 'twig' ).append( key );

	root.alter(
		'change',
			change_grow.create(
				'path', path,
				'val', portal,
				'rank', 0
			),
		'mark',
			mark_caret.create(
				'offset',
					trace_root.singleton
					.appendSpace
					.appendItem( key )
					.appendField( 'spaceUser' )
					.appendOffset( 0 )
			)
	);
};


/*
| Sees if this portal is being clicked.
*/
def.proto.click =
	function(
		p,       // point where dragging starts
		shift,   // true if shift key was held down
		ctrl,    // true if ctrl or meta key was held down
		mark     // current user mark
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 4 ) throw new Error( );
/**/}

	if( !this.pointWithin( p ) ) return;

	if( ctrl ) return this._ctrlClick( p, shift, mark );

	const transform = this.transform;

	const zone = this.zone;

	let pp = p.detransform( transform ).sub( zone.pos );

	if( this._moveToButtonShape.within( pp ) )
	{
		this._moveTo( );

		return true;
	}

	if( this.access != 'rw' ) return false;

	pp = p.detransform( transform ).sub( zone.pos );

	let setMark;

	for( let field in spaceFields )
	{
		const fieldLazyName = spaceFields[ field ];

		const sf = this[ fieldLazyName ];

		if( sf.shape.within( pp ) )
		{
			const offset = this._getOffsetAt( field, pp.x );

			setMark =
				mark_caret.create(
					'offset', this.trace.appendField( field ).appendOffset( offset )
				);

			break;
		}
	}

	// if non of the field were clicked
	// just focus the portal itself
	if( !setMark ) setMark = mark_items.createWithOne( this.trace );

	root.alter( 'mark', setMark );

	return true;
};



/*
| Gets the next section in a cycle.
*/
def.static.cycle =
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
| The item's glint.
*/
def.lazy.glint =
	function( )
{
	const zone = this.tZone.add1_5;

	const arr =
		[
			gleam_glint_window.create(
				'pane',
					gleam_glint_pane.create(
						'glint', this._innerGlint,
						'size', zone.size
					),
				'pos', zone.pos
			)
		];

	if( this.highlight )
	{
		const facet = gruga_portal.facets.getFacet( 'highlight', true );

		arr.push( gleam_glint_paint.createFacetShape( facet, this.tShape ) );
	}

	return gleam_glint_list.create( 'list:init', arr );
};




/*
| Text has been inputed.
*/
def.proto.input =
	function(
		text
	)
{
	const reg  = /([^\n]+)(\n?)/g;

	const mark = this.mark;

	const section = this._markSection;

	if( !fabric_portal.isSection( section ) ) return false;

	if( section === 'moveToButton' ) { this._moveTo( ); return; }

	// ignores newlines
	for( let rx = reg.exec( text ); rx; rx = reg.exec( text ) )
	{
		const line = rx[ 1 ];

		root.alter(
			'change',
			change_insert.create(
				'val', line,
				'path', this.path.append( section ).chop,
				'at1', mark.caretOffset.at,
				'at2', mark.caretOffset.at + line.length
			)
		);
	}
};


/*
| Returns true if section is a section.
*/
def.static.isSection =
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
| Returns the minimum x-scale factor this item could go through.
*/
def.proto.minScaleX =
	function(
		zone  // original zone
	)
{
	return this.minSize.width / zone.width;
};


/*
| Returns the minimum y-scale factor this item could go through.
*/
def.proto.minScaleY =
	function(
		zone  // original zone
	)
{
	return this.minSize.height / zone.height;
};


/*
| Minimum size
*/
def.lazy.minSize = ( ) => gruga_portal.minSize;


/*
| The portal model.
*/
def.staticLazy.model =
	function( )
{
	return(
		fabric_portal.create(
			'access', 'rw',
			'highlight', false,
			'spaceTag', '',
			'spaceUser', '',
			'transform', gleam_transform.normal,
			'zone', gleam_rect.zero
		)
	);
};


/*
| Mouse wheel turned.
*/
def.proto.mousewheel =
	function(
		p,
		dir,
		shift,
		ctrl
	)
{
	return this.pointWithin( p );
};


/*
| User is hovering his/her pointing device around.
|
| Checks if this item reacts on this.
*/
def.proto.pointingHover =
	function(
		p       // point hovered upon
	)
{
	const transform = this.transform;

	const zone = this.zone;

	// not clicked on the portal?
	if( !this.pointWithin( p ) ) return;

	const pp = p.detransform( transform ).sub( zone.pos );

	if( this._moveToButtonShape.within( pp ) )
	{
		return(
			result_hover.create(
				'trace', this.trace.appendField( 'moveToButton' ),
				'cursor', 'pointer'
			)
		);
	}

	return result_hover.cursorDefault;
};


/*
| Portals are positioned by their zone.
*/
def.static.positioning =
def.proto.positioning =
	'zone';


/*
| Portals do not need to be resized proportionally.
*/
def.proto.proportional = false;


/*
| The portal's shape.
*/
def.lazy.shape =
	function( )
{
	const zone = this.zone;

	return(
		gleam_ellipse.create(
			'pos', zone.pos,
			'width', zone.width,
			'height', zone.height
		)
	);
};


/*
| The space the portals references.
*/
def.lazy.spaceRef =
	function( )
{
	return(
		ref_space.create(
			'username', this.spaceUser,
			'tag', this.spaceTag
		)
	);
};


/*
| User pressed a special key.
*/
def.proto.specialKey =
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
| The moveToButton facet.
*/
def.lazy._facetMoveToButton =
	function( )
{
	let hover = this.hover;

	if( hover && !hover.equals( this.trace.appendField( 'moveToButton' ) ) ) hover = false;

	return(
		gruga_portal.buttonFacets.getFacet(
			'hover', !!hover,
			'focus', this._markSection === 'moveToButton'
		)
	);
};


/*
| Returns the font for 'section'.
*/
def.proto._fontFor =
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
| Prepares the spaceTag field.
*/
def.lazy._fieldSpaceTag =
	function( )
{
	return this._prepareField( 'spaceTag', this._fieldSpaceUser.pos );
};


/*
| Prepares the spaceUser field.
*/
def.lazy._fieldSpaceUser =
	function( )
{
	return this._prepareField( 'spaceUser' );
};


/*
| Font for moveToButton.
*/
def.lazy._fontMoveTo = ( ) => gruga_font.standard( 13 );


/*
| Font for spaceTag.
*/
def.lazy._fontSpaceTag = ( ) => gruga_font.standard( 13 );


/*
| Font for spaceUser.
*/
def.lazy._fontSpaceUser = ( ) => gruga_font.standard( 13 );


/*
| Glint for the caret.
*/
def.lazy._glintCaret =
	function( )
{
	const mark = this.mark;

	const ot = this.transform.ortho;

	const section = this._markSection;

	if( !fabric_portal.isSection( section ) || section === 'moveToButton' ) return;

	const font = this._fontFor( section );

	const fs = font.size;

	const descend = fs * gleam_font_font.bottomBox;

	const fieldPos = this[ spaceFields[ section ] ].pos;

	const p = this._locateOffset( section, mark.caretOffset.at );

	const pos =
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
};


/*
| Returns the offset nearest to point p.
*/
def.proto._getOffsetAt =
	function(
		section,
		x
	)
{
	const dx = x - this[ spaceFields[ section ] ].pos.x;

	const value = this[ section ];

	let x1 = 0;

	let x2 = 0;

	const font = this._fontFor( section );

	let a;

	const al = value.length;

	for( a = 0; a < al; a++ )
	{
		x1 = x2;

		x2 = font.getAdvanceWidth( value.substr( 0, a ) );

		if( x2 >= dx ) break;
	}

	if( dx - x1 < x2 - dx && a > 0 ) a--;

	return a;
};


/*
| Creates the portal's inner glint.
*/
def.lazy._innerGlint =
	function( )
{
	const ot = this.transform.ortho;

	const mark = this.mark;

	const facet = gruga_portal.facets.getFacet( );

	const fieldSpaceUser = this._fieldSpaceUser;

	const fieldSpaceTag = this._fieldSpaceTag;

	const orthoMoveToButtonShape = this._orthoMoveToButtonShape;

	const inputFacet =
		gruga_portal.inputFacets.getFacet(
			'hover', false,
			'focus', false
		);

	const arr =
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
				'align', 'center',
				'base', 'middle',
				'font', this._tFontMoveTo,
				'p', orthoMoveToButtonShape.pc,
				'text', 'move to'
			)
		];

	if( mark && mark.timtype === mark_caret && mark.focus )
	{
		const glintCaret = this._glintCaret;

		if( glintCaret ) arr[ 6 ] = this._glintCaret;
	}

	const tzs = this._zeroShape.transform( ot );

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
};


/*
| Inheritance optimization.
*/
def.inherit._innerGlint =
	function(
		inherit
	)
{
	return(
		inherit.alikeIgnoringTransform( this )
		&& inherit.transform.zoom === this.transform.zoom
	);
};


/*
| User pressed backspace.
*/
def.proto._keyBackspace =
	function( )
{
	const mark = this.mark;

	const section = this._markSection;

	if( !fabric_portal.isSection( section ) ) return;

	const at = mark.caretOffset.at;

	if( at <= 0 ) return;

	root.alter(
		'change',
		change_remove.create(
			'path', this.path.append( section ).chop,
			'at1', at - 1,
			'at2', at,
			'val', this[ section ].substring( at - 1, at )
		)
	);
};



/*
| User pressed down key.
*/
def.proto._keyDown =
	function( )
{
	const mark = this.mark;

	const section = this._markSection;

	if( !fabric_portal.isSection( section ) ) return;

	switch( section )
	{
		case 'spaceUser' :
		{
			const cpos = this._locateOffset( section, mark.caretOffset.at );

			const offset = this._getOffsetAt( 'spaceTag', cpos.x + this._fieldSpaceUser.pos.x );

			root.alter(
				'mark',
					mark_caret.create(
						'offset', this.trace.appendField( 'spaceTag' ).appendOffset( offset )
					)
			);

			break;
		}

		case 'spaceTag' :

			root.alter(
				'mark',
					mark_caret.create(
						'offset', this.trace.appendField( 'moveToButton' ).appendOffset( 0 )
					)
			);

			break;

		case 'moveToButton' :

			root.alter(
				'mark',
					mark_caret.create(
						'offset', this.trace.appendField( 'spaceUser' ).appendOffset( 0 )
					)
			);

			break;
	}
};


/*
| User pressed right key.
*/
def.proto._keyLeft =
	function( )
{
	const mark = this.mark;

	const section = this._markSection;

	if( !fabric_portal.isSection( section ) ) return;

	if( mark.caretOffset.at === 0 )
	{
		const cycle = fabric_portal.antiCycle( section );

		const offset = cycle === 'moveToButton' ? 0 : this[ cycle ].length;

		root.alter( 'mark', mark_caret.create( 'offset', offset ) );

		return;
	}

	root.alter( 'mark', mark.backward );

	return;
};


/*
| User pressed del.
*/
def.proto._keyDel =
	function( )
{
	const mark = this.mark;

	const section = this._markSection;

	const value = this[ section ];

	if( !fabric_portal.isSection( section ) || section === 'moveToButton' ) return;

	const at = mark.caretOffet.at;

	if( at >= value.length ) return;

	root.alter(
		'change',
		change_remove.create(
			'path', this.path.append( section ).chop,
			'at1', at,
			'at2', at + 1,
			'val', this[ section ].substring( at, at + 1 )
		)
	);
};


/*
| User pressed end key.
*/
def.proto._keyEnd =
	function( )
{
	const mark = this.mark;

	const section = this._markSection;

	if( !fabric_portal.isSection( section ) || section === 'moveToButton' ) return;

	const at = mark.caretOffset.at;

	const value = this[ section ];

	if( at >= value.length ) return;

	root.alter(
		'mark', mark_caret.create( 'offset', mark.offset.changeTo( value.length ) )
	);
};


/*
| User pressed enter key.
*/
def.proto._keyEnter =
	function( )
{
	const section = this._markSection;

	if( !fabric_portal.isSection( section ) ) return;

	let cycle;

	switch( section )
	{
		case 'spaceUser' : cycle = 'spaceTag'; break;

		case 'spaceTag' : cycle = 'moveToButton'; break;
	}

	if( cycle )
	{
		root.alter(
			'mark',
				mark_caret.create(
					'offset', this.trace.appendField( cycle ).appendOffset( 0 )
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
| User pressed pos1 key,
*/
def.proto._keyPos1 =
	function( )
{
	root.alter( 'mark', this.mark.zero );
};


/*
| User pressed right key.
*/
def.proto._keyRight =
	function( )
{
	const mark = this.mark;

	const section = this._markSection;

	if( !fabric_portal.isSection( section ) ) return false;

	const value = this[ section ];

	if( section === 'moveToButton' || ( value && mark.caretOffset.at >= value.length ) )
	{
		const cycle = fabric_portal.cycle( section );

		root.alter(
			'mark',
				mark_caret.create(
					'offset', this.trace.appendField( cycle ).appendOffset( 0 )
				)
		);

		return;
	}

	root.alter( 'mark', mark.forward );
};


/*
| User pressed down key.
*/
def.proto._keyTab =
	function(
		shift
	)
{
	const section = this._markSection;

	if( !fabric_portal.isSection( section ) ) return;

	const cycle =
		shift
		? fabric_portal.antiCycle( section )
		: fabric_portal.cycle( section );

	root.alter(
		'mark',
			mark_caret.create(
				'offset', this.trace.appendField( cycle ).appendOffset( 0 )
			)
	);
};


/*
| User pressed down key.
*/
def.proto._keyUp =
	function( )
{
	const mark = this.mark;

	const section = this._markSection;

	if( !fabric_portal.isSection( section ) ) return;

	switch( section )
	{
		case 'spaceUser' :

			root.alter(
				'mark',
					mark_caret.create(
						'offset', this.trace.appendField( 'moveToButton' ).appendOffset( 0 )
					)
			);

			break;

		case 'spaceTag' :
		{
			const cpos = this._locateOffset( section, mark.caretOffset.at );

			const offset = this._getOffsetAt( 'spaceUser', cpos.x + this._fieldSpaceTag.pos.x );

			root.alter(
				'mark',
					mark_caret.create(
						'offset', this.trace.appendField( 'spaceUser' ).appendOffset( offset )
					)
			);

			break;
		}

		case 'moveToButton' :

			root.alter(
				'mark',
					mark_caret.create(
						'offset', this.trace.appendField( 'spaceTag' ).appendOffset( 0 )
					)
			);

			break;
	}
};


/*
| Returns the point of a given offset.
*/
def.proto._locateOffset =
	function(
		section,   // 'spaceUser' or 'spaceTag'
		offset     // the offset to get the point from.
	)
{
	// FUTURE cache position
	const font = this._fontFor( section );

	const text = this[ section ];

	return(
		gleam_point.createXY(
			Math.round( font.getAdvanceWidth( text.substring( 0, offset ) ) ),
			0
		)
	);
};


/*
| The section of the current mark
*/
def.lazy._markSection =
	function( )
{
	const mark = this.mark;

	return mark && mark.hasCaret && mark.caretOffset.last.key;
};


/*
| The move to button shape.
*/
def.lazy._moveToButtonShape =
	function( )
{
	const zone = this.zone;

	const width = gruga_portal.moveToWidth;

	const height = gruga_portal.moveToHeight;

	const rounding = gruga_portal.moveToRounding;

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
};





/*
| Moves the user to another space.
*/
def.proto._moveTo =
	function( )
{
	root.moveToSpace( this.spaceRef, false );
};


/*
| The move to button shape transformed to current zoom level.
*/
def.lazy._orthoMoveToButtonShape =
	function( )
{
	return this._moveToButtonShape.transform( this.transform.ortho );
};


/*
| Prepares an input field ( user / tag )
*/
def.proto._prepareField =
	function(
		section,
		baseP
	)
{
	const zone = this.zone;

	const pitch = gruga_portal.inputPitch;

	const rounding = gruga_portal.inputRounding;

	const text = this[ section ];

	const font = this._fontFor( section );

	const width = font.getAdvanceWidth( text );

	const height = font.size + 2;

	const pos =
		baseP
		? gleam_point.create(
			'x', ( zone.width - width ) / 2,
			'y', baseP.y + 23
		)
		: gleam_point.create(
			'x', ( zone.width - width ) / 2,
			'y', zone.height / 2 - 30
		);

	const shape =
		gleam_roundRect.create(
			'pos', pos.sub( pitch, height ),
			'width', width + 2 * pitch,
			'height', height + pitch,
			'a', rounding,
			'b', rounding
		);

	const glint =
		gleam_glint_paint.create(
			'facet',
				gruga_portal.inputFacets.getFacet(
					'hover', false,
					'focus', false
				),
			'shape', shape
		);

	return(
		Object.freeze( {
			text : text,
			width : width,
			height : height,
			pos : pos,
			shape : shape,
			glint : glint
		} )
	);
};


/*
| Font for spaceUser.
*/
def.lazy._tFontSpaceUser =
	function( )
{
	return this._fontSpaceUser.transform( this.transform );
};


/*
| Font for spaceTag.
*/
def.lazy._tFontSpaceTag =
	function( )
{
	return this._fontSpaceTag.transform( this.transform );
};


/*
| Font for moveToButton.
*/
def.lazy._tFontMoveTo =
	function( )
{
	return this._fontMoveTo.transform( this.transform );
};


/*
| The portal's shape at zero.
*/
def.lazy._zeroShape =
	function( )
{
	const zone = this.zone;

	return(
		gleam_ellipse.create(
			'pos', gleam_point.zero,
			'width', zone.width,
			'height', zone.height
		)
	);
};


} );
