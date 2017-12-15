/*
| Relates two items (including other relations).
*/
'use strict';


// FIXME
var
	gleam_arrow,
	gleam_glint_list,
	gleam_glint_paint,
	gleam_glint_window,
	gleam_point,
	gruga_label,
	gruga_relation,
	visual_docItem,
	visual_item,
	visual_label;


tim.define( module, 'visual_relation', ( def, visual_relation ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		action :
		{
			// current action
			type :
				require( '../action/typemap' )
				.concat( [ 'undefined' ] ),
			prepare : 'visual_item.concernsAction( action, path )'
		},
		fabric :
		{
			// the relations fabric
			type : 'fabric_relation'
		},
		highlight :
		{
			// the item is highlighted
			type : 'boolean'
		},
		hover :
		{
			// node currently hovered upon
			type : [ 'undefined', 'tim$path' ],
			assign : ''
		},
		mark :
		{
			// the users mark
			prepare : 'visual_item.concernsMark( mark, path )',
			type :
				require( './mark/typemap' )
				.concat( [ 'undefined' ] )
		},
		path :
		{
			// the path of the doc
			type : [ 'undefined', 'tim$path' ]
		},
		transform :
		{
			// the current space transform
			type : 'gleam_transform'
		}
	};

	def.init = [ ];
}


/*
| Initializer.
*/
def.func._init =
	function( )
{
	visual_label.prototype._init.call( this );

	this._cache = { };
};


/*:::::::::::::.
:: Lazy values
'::::::::::::::*/


/*
| The attention center.
*/
// FIXME
def.lazy.attentionCenter = NODE || visual_docItem.attentionCenter;


/*
| Fontsize of the relations label.
*/
// FIXME
def.lazy.fontsize = NODE || visual_label.fontsize;


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
// FIXME
def.lazy.pos = NODE ||  visual_label.pos;


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
// FIXME
def.lazy.tShape = NODE || visual_label.tShape;


/*
| The relations zone for current transform.
*/
// FIXME
def.lazy.tZone = NODE || visual_label.tZone;


/*
| The relations zone.
*/
def.lazy.zone = NODE || visual_label.zone;

// FIXME
def.lazy._zoneHeight = NODE || visual_label._zoneHeight;

def.lazy._zoneWidth = NODE || visual_label._zoneWidth;


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
// FIXME
def.func.click = NODE || visual_docItem.click;


/*
| Reacts on ctrl-clicks.
*/
// FIXME
def.func.ctrlClick = NODE || visual_item.ctrlClick;


/*
| A create relation action moves.
*/
// FIXME
def.func.createRelationMove = NODE || visual_item.createRelationMove;


/*
| A create relation action stops.
*/
// FIXME
def.func.createRelationStop = NODE || visual_item.createRelationStop;


/*
| Handles a potential dragStart event for this item.
*/
// FIXME
def.func.dragStart = NODE || visual_docItem.dragStart;


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
	const cache = this._cache;

	const item1 = root.spaceVisual.get( this.fabric.item1key );

	const item2 = root.spaceVisual.get( this.fabric.item2key );

	let shape1, shape2;

	if( item1 ) shape1 = item1.shape;

	if( item2 ) shape2 = item2.shape;

	const cg = cache.glint;

	if( cg )
	{
		const arrShape = cache.arrShape;

		const conShape = cache.conShape;

		if(
			(
				( !conShape && !shape1 )
				|| ( conShape && conShape.equals( shape1 ) )
			)
			&& (
				( !arrShape && !shape2 )
				|| ( arrShape && arrShape.equals( shape2 ) )
			)
		)
		{
			return cg;
		}
	}

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

	return( cache.glint = gleam_glint_list.create( 'list:init', arr ) );
};


/*
| A text has been inputed.
*/
// FIXME
def.func.input = NODE || visual_docItem.input;


/*
| Returns the change for dragging this item.
*/
// FIXME
def.func.getDragItemChange = NODE || visual_item.getDragItemChangePosFs;


/*
| Returns the change for resizing this item.
*/
// FIXME
def.func.getResizeItemChange = NODE || visual_item.getResizeItemChangePosFs;


/*
| Returns the mark for a point
*/
// FIXME
def.func.markForPoint = NODE || visual_docItem.markForPoint;


/*
| Mouse wheel turned.
*/
// FIXME
def.func.mousewheel = NODE || visual_label.prototype.mousewheel;


/*
| User is hovering their pointing device over something.
*/
// FIXME
def.func.pointingHover = NODE || visual_docItem.pointingHover;


/*
| Relations use pos/fontsize for positioning
*/
def.func.positioning = 'pos/fontsize';


/*
| Handles a special key.
*/
// FIXME
def.func.specialKey = NODE || visual_docItem.specialKey;


/*
| Nofication when the item lost the users mark.
*/
// FIXME
def.func.markLost = NODE || visual_label.prototype.markLost;


/*
| Returns the minimum scale factor this item could go through.
*/
// FIXME
def.func.minScaleX = NODE || visual_label.minScaleX;

def.func.minScaleY = NODE || visual_label.minScaleY;


/*
| A move during a text select on this item.
*/
// FIXME
def.func.moveSelect = NODE || visual_docItem.moveSelect;


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
	const cache = this._cache;

	const conShape = cache.conShape;

	if( conShape && conShape.equals( shape ) )
	{
		return cache.conGlint;
	}

	const conGlint =
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
		);

	cache.conShape = shape;

	cache.conGlint = conGlint;

	return conGlint;
};


/*
| Returns the glint of an arrow to a shape.
*/
def.func._getArrowGlint =
	function(
		shape
	)
{
	const cache = this._cache;

	const arrShape = cache.arrShape;

	if( arrShape && arrShape.equals( shape ) )
	{
		return cache.arrGlint;
	}

	const arrGlint =
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
		);

	cache.arrShape = shape;

	cache.arrGlint = arrGlint;

	return arrGlint;
};


} );

