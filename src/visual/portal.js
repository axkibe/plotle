/*
| A portal to another space.
*/
'use strict';


tim.define( module, ( def, visual_portal ) => {


def.extend = './item';


if( TIM )
{
	def.attributes =
	{
		// current action
		action : { type : [ '< ../action/types', 'undefined' ] },

		// portal fabric data
		fabric : { type : '../fabric/portal' },

		// the item is highlighted
		highlight : { type : 'boolean' },

		// node currently hovered upon
		hover : { type : [ 'undefined', 'tim.js/path' ] },

		// the users mark
		mark : { type : [ '< ./mark/types', 'undefined' ] },

		// the path of the portal
		path : { type : [ 'undefined', 'tim.js/path' ] },

		// current space transform
		transform : { type : '../gleam/transform' },
	};

	def.alike =
	{
		alikeIgnoringTransform :
		{
			ignores : { 'transform' : true }
		}
	};
}


const action_dragItems = require( '../action/dragItems' );

const action_resizeItems = require( '../action/resizeItems' );

const change_grow = require( '../change/grow' );

const change_insert = require( '../change/insert' );

const change_remove = require( '../change/remove' );

const fabric_portal = require( '../fabric/portal' );

const gleam_ellipse = require( '../gleam/ellipse' );

const gleam_facet = require( '../gleam/facet' );

const gleam_glint_border = require( '../gleam/glint/border' );

const gleam_glint_fill = require( '../gleam/glint/fill' );

const gleam_glint_list = require( '../gleam/glint/list' );

const gleam_glint_mask = require( '../gleam/glint/mask' );

const gleam_glint_paint = require( '../gleam/glint/paint' );

const gleam_glint_text = require( '../gleam/glint/text' );

const gleam_glint_window = require( '../gleam/glint/window' );

const gleam_point = require( '../gleam/point' );

const gleam_rect = require( '../gleam/rect' );

const gleam_roundRect = require( '../gleam/roundRect' );

const gleam_transform = require( '../gleam/transform' );

const gruga_portal = require( '../gruga/portal' );

const pathList = tim.import( 'tim.js', 'pathList' );

const result_hover = require( '../result/hover' );

const ref_space = require( '../ref/space' );

const session_uid = require( '../session/uid' );

const shell_fontPool = require( '../shell/fontPool' );

const shell_settings = require( '../shell/settings' );

const tim_path = tim.import( 'tim.js', 'path' );

const visual_item = require( '../visual/item' );

const visual_mark_caret = require( '../visual/mark/caret' );

const visual_mark_items = require( '../visual/mark/items' );


/*
| List of all space fields of the portal
*/
const spaceFields =
{
	spaceUser : '_fieldSpaceUser',

	spaceTag : '_fieldSpaceTag'
};


/**/if( FREEZE ) Object.freeze( spaceFields );



/*
| The portal model.
*/
def.staticLazy.model =
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
};


/*
| Deriving concerns stuff.
*/
def.func.concernsHover =
def.static.concernsHover =
	visual_item.concernsHover;


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

	const portal = action.transItem.fabric.create( 'zone', zone );

	const key = session_uid.newUid( );

	root.alter(
		change_grow.create(
			'path', tim_path.empty.append( 'twig' ).append( key ),
			'val', portal,
			'rank', 0
		)
	);

	root.setUserMark(
		visual_mark_caret.pathAt( root.spaceVisual.get( key ).path.append( 'spaceUser' ), 0 )
	);
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
| Returns the attention center.
*/
def.lazy.attentionCenter =
	function( )
{
	const ac = this.zone.pos.y;

	const mark = this.mark;

	if( !mark || !mark.hasCaret ) return ac;

	const section = this._markSection;

	if( !visual_portal.isSection( section ) ) return ac;

	if( section === 'moveToButton' )
	{
		return ac + this._moveToButtonShape.pos.y;
	}

	const font = this._fontFor( section );

	const fs = font.size;

	const fieldP = this[ spaceFields[ section ] ].pos;

	const p = this._locateOffset( section, mark.caret.at );

	return ac + p.y + fieldP.y - fs;
};


/*
| The item's glint.
*/
def.lazy.glint =
	function( )
{
	const tZone = this.tZone;

	const arr =
		[
			gleam_glint_window.create(
				'glint', this._glint,
				'rect', tZone.add1_5,
				'offset', gleam_point.zero
			)
		];

	if( this.highlight )
	{
		const facet = gruga_portal.facets.getFacet( 'highlight', true );

		arr.push( gleam_glint_paint.createFS( facet, this.tShape ) );
	}

	return gleam_glint_list.create( 'list:init', arr );
};


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
|
| FIXME make this the primer data.
*/
def.lazy.spaceRef =
	function( )
{
	return(
		ref_space.create(
			'username', this.fabric.spaceUser,
			'tag', this.fabric.spaceTag
		)
	);
};


/*
| The shape in current transform.
*/
def.lazy.tShape =
	function( )
{
	return this.shape.transform( this.transform );
};


/*
| Zone in current transform.
*/
def.lazy.tZone =
	function( )
{
	return this.zone.transform( this.transform );
};


/*
| The items zone possibly altered by action.
*/
def.lazy.zone =
	function( )
{
	const action = this.action;

	const zone = this.fabric.zone;

	switch( action && action.timtype )
	{
		case action_dragItems : return zone.add( action.moveBy );

		case action_resizeItems : return zone.baseScaleAction( action, 0, 0 );

		default : return this.fabric.zone;
	}
};


/*
| Font for spaceUser.
*/
def.lazy._fontSpaceUser =
	function( )
{
	return shell_fontPool.get( 13, 'la' );
};


/*
| Font for spaceTag.
*/
def.lazy._fontSpaceTag =
	function( )
{
	return shell_fontPool.get( 13, 'la' );
};


/*
| Font for moveToButton.
*/
def.lazy._fontMoveTo =
	function( )
{
	return shell_fontPool.get( 13, 'cm' );
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
| The moveToButton facet.
*/
def.lazy._facetMoveToButton =
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
};


/*
| Creates the portal's inner glint.
*/
def.lazy._glint =
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
				'font', this._tFontMoveTo,
				'p', orthoMoveToButtonShape.pc,
				'text', 'move to'
			)
		];

	if(
		mark
		&& mark.timtype === visual_mark_caret
		&& mark.focus
	)
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
def.inherit._glint =
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
| Glint for the caret.
*/
def.lazy._glintCaret =
	function( )
{
	const mark = this.mark;

	const ot = this.transform.ortho;

	const section = this._markSection;

	if( !visual_portal.isSection( section ) || section === 'moveToButton' ) return;

	const font = this._fontFor( section );

	const fs = font.size;

	const descend = fs * shell_settings.bottombox;

	const fieldPos = this[ spaceFields[ section ] ].pos;

	const p = this._locateOffset( section, mark.caret.at );

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
| The section of the current mark
*/
def.lazy._markSection =
	function( )
{
	const mark = this.mark;

	return mark && mark.hasCaret && mark.caret.path.get( -1 );
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
| The move to button shape transformed to current zoom level.
*/
def.lazy._orthoMoveToButtonShape =
	function( )
{
	return this._moveToButtonShape.transform( this.transform.ortho );
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


/*
| Portals do not need to be resized proportionally.
*/
def.func.proportional = false;


/*
| Sees if this portal is being clicked.
*/
def.func.click =
	function(
		p,
		shift,
		access
	)
{
	if( !this.tShape.within( p ) ) return;

	const transform = this.transform;

	const zone = this.zone;

	let pp = p.detransform( transform ).sub( zone.pos );

	if( this._moveToButtonShape.within( pp ) )
	{
		this._moveTo( );

		return true;
	}

	if( access != 'rw' ) return false;

	pp = p.detransform( transform ).sub( zone.pos );

	let setMark;

	for( let field in spaceFields )
	{
		const fieldLazyName = spaceFields[ field ];

		const sf = this[ fieldLazyName ];

		if( sf.shape.within( pp ) )
		{
			setMark =
				visual_mark_caret.pathAt(
					this.path.append( field ),
					this._getOffsetAt( field, pp.x )
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
				'itemPaths', pathList.create( 'list:init', [ this.path ] )
			);
	}

	if( setMark ) root.setUserMark( setMark );

	return true;
};


/*
| Returns the change for dragging this item.
*/
def.func.getDragItemChange = visual_item.getDragItemChangeZone;


/*
| Returns the change for resizing this item.
*/
def.func.getResizeItemChange = visual_item.getResizeItemChangeZone;


/*
| Text has been inputed.
*/
def.func.input =
	function(
		text
	)
{
	const reg  = /([^\n]+)(\n?)/g;

	const mark = this.mark;

	const section = this._markSection;

	if( !visual_portal.isSection( section ) ) return false;

	if( section === 'moveToButton' ) { this._moveTo( ); return; }

	// ignores newlines
	for( let rx = reg.exec( text ); rx; rx = reg.exec( text ) )
	{
		const line = rx[ 1 ];

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
| Nofication when the item lost the users mark.
*/
def.func.markLost = function( ){ };


/*
| Minimum height.
*/
def.func.minHeight = gruga_portal.minHeight;


/*
| Minimum width.
*/
def.func.minWidth = gruga_portal.minWidth;


/*
| Returns the minimum x-scale factor this item could go through.
*/
def.func.minScaleX =
	function(
		zone  // original zone
	)
{
	return this.minWidth / zone.width;
};


/*
| Returns the minimum y-scale factor this item could go through.
*/
def.func.minScaleY =
	function(
		zone  // original zone
	)
{
	return this.minHeight / zone.height;
};


/*
| Mouse wheel turned.
*/
def.func.mousewheel =
	function(
		p,
		dir,
		shift,
		ctrl
	)
{
	return this.tShape.within( p );
};


/*
| User is hovering his/her pointing device around.
|
| Checks if this item reacts on this.
*/
def.func.pointingHover =
	function(
		p       // point hovered upon
	)
{
	const transform = this.transform;

	const zone = this.zone;

	// not clicked on the portal?
	if( !this.tShape.within( p ) ) return;

	const pp = p.detransform( transform ).sub( zone.pos );

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
def.static.positioning =
def.func.positioning =
	'zone';


/*
| Returns the font for 'section'.
*/
def.func._fontFor =
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
def.func._locateOffset =
	function(
		section,   // 'spaceUser' or 'spaceTag'
		offset     // the offset to get the point from.
	)
{
	// FUTURE cache position
	const font = this._fontFor( section );

	const text = this.fabric[ section ];

	return(
		gleam_point.xy(
			Math.round( font.getAdvanceWidth( text.substring( 0, offset ) ) ),
			0
		)
	);
};


/*
| User pressed a special key.
*/
def.func.specialKey =
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
| User pressed backspace.
*/
def.func._keyBackspace =
	function( )
{
	const mark = this.mark;

	const section = this._markSection;

	if( !visual_portal.isSection( section ) ) return;

	const at = mark.caret.at;

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
def.func._keyDown =
	function( )
{
	const mark = this.mark;

	const section = this._markSection;

	if( !visual_portal.isSection( section ) ) return;

	switch( section )
	{
		case 'spaceUser' :
		{
			const cpos = this._locateOffset( section, mark.caret.at );

			root.setUserMark(
				visual_mark_caret.pathAt(
					this.path.append( 'spaceTag' ),
					this._getOffsetAt( 'spaceTag', cpos.x + this._fieldSpaceUser.pos.x )
				)
			);

			break;
		}

		case 'spaceTag' :

			root.setUserMark( visual_mark_caret.pathAt( this.path.append( 'moveToButton' ), 0 ) );

			break;

		case 'moveToButton' :

			root.setUserMark( visual_mark_caret.pathAt( this.path.append( 'spaceUser' ), 0 ) );

			break;
	}
};


/*
| User pressed right key.
*/
def.func._keyLeft =
	function( )
{
	const mark = this.mark;

	const section = this._markSection;

	if( !visual_portal.isSection( section ) ) return;

	if( mark.caret.at === 0 )
	{
		const cycle = visual_portal.antiCycle( section );

		root.setUserMark(
			visual_mark_caret.pathAt(
				this.path.append( cycle ),
				cycle === 'moveToButton' ? 0 : this.fabric[ cycle ].length
			)
		);

		return;
	}

	// FIXME make a lazy value for this
	root.setUserMark( visual_mark_caret.pathAt( mark.caret.path, mark.caret.at - 1 ) );

	return;
};


/*
| User pressed down key.
*/
def.func._keyTab =
	function(
		shift
	)
{
	const mark = this.mark;

	const section = this._markSection;

	if( !visual_portal.isSection( section ) ) return;

	const cycle =
		shift
		? visual_portal.antiCycle( section )
		: visual_portal.cycle( section );

	root.setUserMark( visual_mark_caret.pathAt( mark.caret.path.set( -1, cycle ), 0 ) );
};


/*
| User pressed down key.
*/
def.func._keyUp =
	function( )
{
	const mark = this.mark;

	const section = this._markSection;

	if( !visual_portal.isSection( section ) ) return;

	switch( section )
	{
		case 'spaceUser' :

			root.setUserMark( visual_mark_caret.pathAt( this.path.append( 'moveToButton' ), 0 ) );

			break;

		case 'spaceTag' :
		{
			const cpos = this._locateOffset( section, mark.caret.at );

			root.setUserMark(
				visual_mark_caret.pathAt(
					this.path.append( 'spaceUser' ),
					this._getOffsetAt( 'spaceUser', cpos.x + this._fieldSpaceTag.pos.x )
				)
			);

			break;
		}

		case 'moveToButton' :

			root.setUserMark( visual_mark_caret.pathAt( this.path.append( 'spaceTag' ), 0 ) );

			break;
	}
};


/*
| User pressed right key.
*/
def.func._keyRight =
	function( )
{
	const mark = this.mark;

	const section = this._markSection;

	if( !visual_portal.isSection( section ) ) return false;

	const value = this.fabric[ section ];

	if( section === 'moveToButton' || ( value && mark.caret.at >= value.length ) )
	{
		const cycle = visual_portal.cycle( section );

		root.setUserMark( visual_mark_caret.pathAt( this.path.append( cycle ), 0 ) );

		return;
	}

	// FIXME lazy val caret
	root.setUserMark( visual_mark_caret.pathAt( mark.caret.path, mark.caret.at + 1 ) );
};


/*
| User pressed del.
*/
def.func._keyDel =
	function( )
{
	const mark = this.mark;

	const section = this._markSection;

	const value = this.fabric[ section ];

	if( !visual_portal.isSection( section ) || section === 'moveToButton' ) return;

	const at = mark.caret.at;

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
def.func._keyEnd =
	function( )
{
	const mark = this.mark;

	const section = this._markSection;

	if( !visual_portal.isSection( section ) || section === 'moveToButton' ) return;

	const at = mark.caret.at;

	const value = this.fabric[ section ];

	if( at >= value.length ) return;

	root.setUserMark( visual_mark_caret.pathAt( mark.caret.path, value.length ) );
};


/*
| User pressed enter key.
*/
def.func._keyEnter =
	function( )
{
	const mark = this.mark;

	const section = this._markSection;

	if( !visual_portal.isSection( section ) ) return;

	let cycle;

	switch( section )
	{
		case 'spaceUser' : cycle = 'spaceTag'; break;

		case 'spaceTag' : cycle = 'moveToButton'; break;
	}

	if( cycle )
	{
		root.setUserMark( visual_mark_caret.pathAt( mark.caret.path.set( -1, cycle ), 0 ) );
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
| Returns the offset nearest to point p.
*/
def.func._getOffsetAt =
	function(
		section,
		x
	)
{
	const dx = x - this[ spaceFields[ section ] ].pos.x;

	const value = this.fabric[ section ];

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
| User pressed pos1 key,
*/
def.func._keyPos1 =
	function( )
{
	root.setUserMark( this.mark.create( 'at', 0 ) );
};


/*
| Issues the moveTo action.
*/
def.func._moveTo =
	function( )
{
	root.moveToSpace( this.spaceRef, false );
};



/*
| Prepares an input field ( user / tag )
*/
def.func._prepareField =
	function(
		section,
		baseP
	)
{
	const zone = this.zone;

	const pitch = gruga_portal.inputPitch;

	const rounding = gruga_portal.inputRounding;

	const text = this.fabric[ section ];

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

	const result = {
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


} );
