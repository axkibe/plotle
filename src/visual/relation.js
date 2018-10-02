/*
| Relates two items (including other relations).
*/
'use strict';


tim.define( module, ( def ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		// current action
		action : { type : [ '< ../action/types', 'undefined' ] },

		// the document (content)
		doc : { type : [ './doc', 'undefined' ] },

		// the relations fabric
		fabric : { type : '../fabric/relation' },

		// the item is highlighted
		highlight : { type : 'boolean' },

		// node currently hovered upon
		hover : { type : [ 'undefined', 'tim.js/path' ], assign : '' },

		// the users mark
		mark :
		{
			type : [ '< ./mark/types', 'undefined' ],
		},

		// the path of the doc
		path : { type : [ 'undefined', 'tim.js/path' ] },

		// the current space transform
		transform : { type : '../gleam/transform' },
	};
}


const gleam_arrow = require( '../gleam/arrow' );

const gleam_glint_list = require( '../gleam/glint/list' );

const gleam_glint_paint = require( '../gleam/glint/paint' );

const gleam_glint_window = require( '../gleam/glint/window' );

const gleam_point = require( '../gleam/point' );

const gruga_label = require( '../gruga/label' );

const gruga_relation = require( '../gruga/relation' );

const visual_docItem = require( '../visual/docItem' );

const visual_item = require( '../visual/item' );

const visual_label = require( '../visual/label' );


/*
| Transforms the doc.
| FIXME this is a dirty workaround.
*/
def.transform.doc = visual_label.prototype[ '__transform_' + 'doc' ];


/*
| The attention center.
*/
def.lazy.attentionCenter = visual_docItem.attentionCenter;


/*
| Fontsize of the relations label.
*/
def.lazy.fontsize = visual_label.fontsize;


/*
| The key of this item.
*/
def.lazy.key =
	function( )
{
	return this.path.get( -1 );
};


/*
| The labels position possibly altered by an action.
*/
def.lazy.pos = visual_label.pos;


/*
| The item's shape.
*/
def.lazy.shape =
	function( )
{
	return this.zone.shrink1;
};


/*
| The relations shape for current transform.
*/
def.lazy.tShape = visual_label.tShape;


/*
| The relations zone for current transform.
*/
def.lazy.tZone = visual_label.tZone;


/*
| The relations zone.
*/
def.lazy.zone = visual_label.zone;

def.lazy._zoneHeight = visual_label._zoneHeight;

def.lazy._zoneWidth = visual_label._zoneWidth;


/*:::::::::::.
:: Functions
'::::::::::::*/


/*
| Relations resize proportional only.
*/
def.func.proportional = true;


/*
| Reacts on clicks.
*/
def.func.click = visual_docItem.click;


/*
| Reacts on ctrl-clicks.
*/
def.func.ctrlClick = visual_item.ctrlClick;


/*
| A create relation action moves.
*/
def.func.createRelationMove = visual_item.createRelationMove;


/*
| A create relation action stops.
*/
def.func.createRelationStop = visual_item.createRelationStop;


/*
| Handles a potential dragStart event for this item.
*/
def.func.dragStart = visual_docItem.dragStart;


/*
| The item's glint.
|
| This cannot be done lazily, since
| when one of the items the relation
| points to is moved the arrows are moved
| too.
*/
def.func.glint =
	function( )
{
	const item1 = root.spaceVisual.get( this.fabric.item1key );

	const item2 = root.spaceVisual.get( this.fabric.item2key );

	let shape1, shape2;

	if( item1 ) shape1 = item1.shape;

	if( item2 ) shape2 = item2.shape;

	const tZone = this.tZone;

	const wg =
		gleam_glint_window.create(
			'glint', this.doc.glint,
			'rect', tZone.enlarge1,
			'offset', gleam_point.zero
		);

	const arr = [ wg ];

	if( this.highlight )
	{
		const facet = gruga_label.facets.getFacet( 'highlight', true );

		arr.push(
			gleam_glint_paint.create(
				'facet', facet,
				'shape', this.tShape
			)
		);
	}

	if( shape1 ) arr.push( this._getConnectionGlint( shape1 ) );

	if( shape2 ) arr.push( this._getArrowGlint( shape2 ) );

	return gleam_glint_list.create( 'list:init', arr );
};


/* FUTURE repair caching
def.inherit.glint =
	function(
		inherit
	)
{
	const item1 = root.spaceVisual.get( this.fabric.item1key );

	const item2 = root.spaceVisual.get( this.fabric.item2key );

	let shape1, shape2;

	if( item1 ) shape1 = item1.shape;

	if( item2 ) shape2 = item2.shape;

	const arrShape = cache.arrShape;

	const conShape = cache.conShape;

	return(
		(
			( !conShape && !shape1 )
			|| ( conShape && conShape.equals( shape1 ) )
		)
		&& (
			( !arrShape && !shape2 )
			|| ( arrShape && arrShape.equals( shape2 ) )
		)
	);
};
*/


/*
| A text has been inputed.
*/
def.func.input = visual_docItem.input;


/*
| Returns the change for dragging this item.
*/
def.func.getDragItemChange = visual_item.getDragItemChangePosFs;


/*
| Returns the change for resizing this item.
*/
def.func.getResizeItemChange = visual_item.getResizeItemChangePosFs;


/*
| Returns the mark for a point
*/
def.func.markForPoint = visual_docItem.markForPoint;


/*
| Mouse wheel turned.
*/
def.func.mousewheel = visual_label.prototype.mousewheel;


/*
| User is hovering their pointing device over something.
*/
def.func.pointingHover = visual_docItem.pointingHover;


/*
| Relations use pos/fontsize for positioning
*/
def.func.positioning = 'pos/fontsize';


/*
| Handles a special key.
*/
def.func.specialKey = visual_docItem.specialKey;


/*
| Nofication when the item lost the users mark.
*/
def.func.markLost = visual_label.prototype.markLost;


/*
| Returns the minimum scale factor this item could go through.
*/
def.func.minScaleX = visual_label.minScaleX;

def.func.minScaleY = visual_label.minScaleY;


/*
| A move during a text select on this item.
*/
def.func.moveSelect = visual_docItem.moveSelect;


/*
| Dummy since a relation does not scroll.
*/
def.func.scrollMarkIntoView = function( ){ };


/*
| Returns the glint of a connection to a shape.
*/
def.func._getConnectionGlint =
	function(
		shape
	)
{
	return(
		gleam_glint_paint.create(
			'facet', gruga_relation.facet,
			'shape',
				gleam_arrow.getArrowShape(
					shape,
					'normal',
					this.shape,
					'normal'
				)
				.transform( this.transform )
		)
	);
};


/*
| Returns the glint of an arrow to a shape.
*/
def.func._getArrowGlint =
	function(
		shape
	)
{
	return(
		gleam_glint_paint.create(
			'facet', gruga_relation.facet,
			'shape',
				gleam_arrow.getArrowShape(
					this.shape,
					'normal',
					shape,
					'arrow'
				)
				.transform( this.transform )
		)
	);
};


} );
