/*
| Relates two items (including other relations).
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'visual_relation',
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
				comment : 'the relations fabric',
				type : 'fabric_relation'
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
				assign : ''
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
				comment : 'the path of the doc',
				type : [ 'undefined', 'jion$path' ]
			},
			transform :
			{
				comment : 'the current space transform',
				type : 'gleam_transform'
			}
		},
		init : [ ]
	};
}


var
	gleam_arrow,
	gleam_glint_paint,
	gleam_glint_ray,
	gleam_glint_window,
	gleam_glint_paint,
	gruga_label,
	gruga_relation,
	jion,
	root,
	visual_docItem,
	visual_item,
	visual_label,
	visual_relation;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	prototype;


/*
| Node includes.
*/
if( NODE )
{
	jion = require( 'jion' );

	visual_relation = jion.this( module, 'source' );

	visual_relation.prototype._init = function( ) { };

	return;
}


prototype = visual_relation.prototype;


/*
| Relations resize proportional only.
*/
prototype.proportional = true;


/*
| Initializer.
*/
prototype._init =
	function( )
{
	visual_label.prototype._init.call( this );

	this._cache = { };
};


/*
| The attention center.
*/
jion.lazyValue( prototype, 'attentionCenter', visual_docItem.attentionCenter );


/*
| Reacts on clicks.
*/
prototype.click = visual_docItem.click;


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
prototype.dragStart = visual_docItem.dragStart;


/*
| Fontsize of the relations label.
*/
jion.lazyValue( prototype, 'fontsize', visual_label.fontsize );


/*
| The item's glint.
|
| This cannot be done lazily, since
| when one of the items the relation
| points to is moved the arrows are moved
| too.
*/
Object.defineProperty(
	prototype,
	'glint',
{
	get:
		function( )
	{
		var
			arrShape,
			cache,
			cg,
			conShape,
			facet,
			gLen,
			gRay,
			item1,
			item2,
			shape1,
			shape2,
			tZone,
			wg;

		cache = this._cache;

		item1 = root.spaceVisual.get( this.fabric.item1key );

		item2 = root.spaceVisual.get( this.fabric.item2key );

		if( item1 ) shape1 = item1.shape;

		if( item2 ) shape2 = item2.shape;

		cg = cache.glint;

		if( cg )
		{
			arrShape = cache.arrShape;

			conShape = cache.conShape;

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

		tZone = this.tZone;

		wg =
			gleam_glint_window.create(
				'glint', this.doc.glint,
				'rect', tZone.enlarge1
			);

		gRay = [ wg ];

		gLen = 1;

		if( this.highlight )
		{
			facet = gruga_label.facets.getFacet( 'highlight', true );

			gRay[ gLen++ ] =
				gleam_glint_paint.create(
					'facet', facet,
					'shape', this.tShape
				);
		}

		if( shape1 )
		{
			gRay[ gLen++ ] = this._getConnectionGlint( shape1 );
		}

		if( shape2 )
		{
			gRay[ gLen++ ] = this._getArrowGlint( shape2 );
		}

		return(
			cache.glint =
				gleam_glint_ray.create( 'ray:init', gRay )
		);
	}
}
);


/*
| A text has been inputed.
*/
prototype.input = visual_docItem.input;


/*
| Returns the change for dragging this item.
*/
prototype.getDragItemChange = visual_item.getDragItemChangePnwFs;


/*
| Returns the change for resizing this item.
*/
prototype.getResizeItemChange = visual_item.getResizeItemChangePnwFs;


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
| Returns the mark for a point
*/
prototype.markForPoint = visual_docItem.markForPoint;


/*
| Mouse wheel turned.
*/
prototype.mousewheel = visual_label.prototype.mousewheel;


/*
| The labels position possibly altered by an action.
*/
jion.lazyValue( prototype, 'pos', visual_label.pos );


/*
| User is hovering their pointing device over something.
*/
prototype.pointingHover = visual_docItem.pointingHover;


/*
| Relations use pos/fontsize for positioning
*/
prototype.positioning = 'pos/fontsize';


/*
| The item's shape.
*/
jion.lazyValue(
	prototype,
	'shape',
	function( )
{
	return this.zone.shrink1;
}
);


/*
| Handles a special key.
*/
prototype.specialKey = visual_docItem.specialKey;


/*
| Nofication when the item lost the users mark.
*/
prototype.markLost = visual_label.prototype.markLost;


/*
| Returns the minimum scale factor this item could go through.
*/
prototype.minScaleX = visual_label.minScaleX;

prototype.minScaleY = visual_label.minScaleY;


/*
| A move during a text select on this item.
*/
prototype.moveSelect = visual_docItem.moveSelect;


/*
| Dummy since a relation does not scroll.
*/
prototype.scrollMarkIntoView = function( ){ };


/*
| The relations shape for current transform.
*/
jion.lazyValue( prototype, 'tShape', visual_label.tShape );


/*
| The relations zone for current transform.
*/
jion.lazyValue( prototype, 'tZone', visual_label.tZone );


/*
| The relations zone.
*/
jion.lazyValue( prototype, 'zone', visual_label.zone );


/*
| Returns the glint of a connection to a shape.
*/
prototype._getConnectionGlint =
	function(
		shape
	)
{
	var
		cache,
		conGlint,
		conShape;

	cache = this._cache;

	conShape = cache.conShape;

	if( conShape && conShape.equals( shape ) )
	{
		return cache.conGlint;
	}

	conGlint =
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
prototype._getArrowGlint =
	function(
		shape
	)
{
	var
		arrShape,
		arrGlint,
		cache;

	cache = this._cache;

	arrShape = cache.arrShape;

	if( arrShape && arrShape.equals( shape ) )
	{
		return cache.arrGlint;
	}

	arrGlint =
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


jion.lazyValue( prototype, '_zoneHeight', visual_label._zoneHeight );


jion.lazyValue( prototype, '_zoneWidth', visual_label._zoneWidth );


} )( );

