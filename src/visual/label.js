/*
| An item with resizing text.
*/
'use strict';


tim.define( module, ( def, visual_label ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		// current action
		action :
		{
			type : [ '< ../action/types', 'undefined' ],
			prepare : 'self.concernsAction( action, path )'
		},

		// the labels fabric
		fabric : { type : '../fabric/label' },

		// the item is highlighted
		highlight : { type : 'boolean' },

		// node currently hovered upon
		hover :
		{
			type : [ 'undefined', 'tim.js/path' ],
			assign : ''
		},

		mark :
		{
			// the users mark
			type : [ '< ./mark/types', 'undefined' ],
			prepare : 'self.concernsMark( mark, path )',
		},

		// the path of the doc
		path : { type : [ 'undefined', 'tim.js/path' ] },

		// the current space transform
		transform : { type : '../gleam/transform' }
	};

	def.init = [ 'inherit' ];

	/*
	def.alike =
	{
		alikeIgnoringTransform :
		{
			ignores : { 'transform' : true }
		}
	};
	*/
}


const action_dragItems = require( '../action/dragItems' );

const action_resizeItems = require( '../action/resizeItems' );

const change_grow = require( '../change/grow' );

const change_shrink = require( '../change/shrink' );

const gleam_glint_list = require( '../gleam/glint/list' );

const gleam_glint_paint = require( '../gleam/glint/paint' );

const gleam_glint_window = require( '../gleam/glint/window' );

const gleam_point = require( '../gleam/point' );

const gleam_rect = require( '../gleam/rect' );

const gleam_transform = require( '../gleam/transform' );

const fabric_doc = require( '../fabric/doc' );

const fabric_label = require( '../fabric/label' );

const fabric_para = require( '../fabric/para' );

const gruga_label = require( '../gruga/label' );

const session_uid = require( '../session/uid' );

const tim_path = tim.import( 'tim.js', 'path' );

const visual_doc = require( '../visual/doc' );

const visual_docItem = require( '../visual/docItem' );

const visual_item = require( '../visual/item' );

const visual_mark_caret = require( '../visual/mark/caret' );




/*::::::::::::::::::::::.
:: Static (lazy) values
':::::::::::::::::::::::*/


/*
| Labels resize proportional only.
*/
def.func.proportional = true;


/*
| The label model.
*/
def.staticLazy.model =
	function( )
{
	return(
		visual_label.create(
			'fabric',
				fabric_label.create(
					'pos', gleam_point.zero,
					'fontsize', gruga_label.defaultFontsize,
					'doc',
						fabric_doc.create(
							'twig:add', '1',
							fabric_para.create( 'text', 'Label' )
						)
				),
			'highlight', false,
			'transform', gleam_transform.normal
		)
	);
};


/*::::::::::::::::::.
:: Static functions
':::::::::::::::::::*/


/*
| Deriving concerns stuff.
*/
def.static.concernsAction = visual_item.concernsAction;

def.static.concernsMark = visual_item.concernsMark;


/*
| User wants to create a new label.
*/
def.static.createGeneric =
	function(
		action, // the create action
		dp      // the detransform point the createGeneric
		//      // stoped at.
	)
{
	const model = visual_label.model;

	const zone = gleam_rect.createArbitrary( action.startPoint, dp );

	const fs =
		Math.max(
			model.doc.fontsize
			* zone.height
			/ model.zone.height,
			gruga_label.minSize
		);

	const resized =
		model.create(
			'fabric', model.fabric.create( 'fontsize', fs )
		);

	const pos =
		( dp.x > action.startPoint.x )
		? zone.pos
		: gleam_point.create(
			'x', zone.pos.x + zone.width - resized.zone.width,
			'y', zone.pos.y
		);

	const label = resized.create( 'fabric', resized.fabric.create( 'pos', pos ) );

	const key = session_uid.newUid( );

/**/if( CHECK )
/**/{
/**/	if( label.fabric.fontsize !== label.doc.fontsize ) throw new Error( );
/**/
/**/	if( label.fabric.pos !== label.pos ) throw new Error( );
/**/}

	root.alter(
		change_grow.create(
			'val', label.fabric,
			'path', tim_path.empty.append( 'twig' ).append( key ),
			'rank', 0
		)
	);

	root.create(
		'mark',
			visual_mark_caret.create(
				'path', root.spaceVisual.get( key ).doc.atRank( 0 ).textPath,
				'at', 0
			)
	);
};


/*
| Initializer.
*/
def.func._init =
	function(
		inherit
	)
{
	const fabric = this.fabric;

	this.doc =
		( inherit && inherit.doc || visual_doc ).create(
			'fabric', fabric.doc,
			'flowWidth', 0,
			'fontsize', this.fontsize,
			'innerMargin', gruga_label.innerMargin,
			'mark', this.mark,
			'paraSep', Math.round( this.fontsize / 20 ),
			'path', this.path && this.path.append( 'doc' ),
			'scrollPos', gleam_point.zero,
			'transform', this.transform.ortho
		);

	if(
		inherit
		&& inherit.equals( this )
		&& tim.hasLazyValueSet( inherit, 'glint' )
	)
	{
		tim.aheadValue( this, 'glint', inherit.glint );
	}

};


/*:::::::::::::.
:: Lazy values
'::::::::::::::*/


/*
| The attention center.
*/
def.lazy.attentionCenter = visual_docItem.attentionCenter;


/*
| The items glint.
*/
def.lazy.glint =
	function( )
{
	const tZone = this.tZone;

	const arr =
		[
			gleam_glint_window.create(
				'glint', this.doc.glint,
				'rect', tZone.enlarge1,
				'offset', gleam_point.zero
			)
		];

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

	return gleam_glint_list.create( 'list:init', arr );
};


/*
| The key of this item.
*/
def.lazy.key =
	function( )
{
	return this.path.get( -1 );
};


/*
| The labels position possibly altered by actions
*/
// FIXME
def.static.pos =
def.lazy.pos =
	function( )
{
	const action = this.action;

	switch( action && action.timtype )
	{
		case action_dragItems :

			return this.fabric.pos.add( action.moveBy );

		case action_resizeItems :

			const zone = action.startZones.get( this.path.get( 2 ) );

			switch( action.resizeDir )
			{
				case 'ne' :

					return(
						zone.psw.baseScale(
							action, 0, -this._zoneHeight
						)
					);

				case 'nw' :

					return(
						zone.pse.baseScale(
							action, -this._zoneWidth, -this._zoneHeight
						)
					);

				case 'se' :

					return zone.pos.baseScale( action, 0, 0 );

				case 'sw' :

					return(
						zone.pne.baseScale(
							action,
							-this._zoneWidth,
							0
						)
					);

			}

		// should never be reached
		throw new Error( );
	}

	return this.fabric.pos;
};




/*
| The item's shape.
*/
def.lazy.shape =
	function( )
{
	return this.zone.shrink1;
};


/*
| The item's shape in current transform.
*/
// FIXME
def.static.tShape =
def.lazy.tShape =
	function( )
{
	return this.shape.transform( this.transform );
};


/*
| Zone in current transform.
*/
// FIXME
def.static.tZone =
def.lazy.tZone =
	function( )
{
	return this.zone.transform( this.transform );
};

/*
| Returns the zone height.
*/
def.static._zoneHeight =
def.lazy._zoneHeight =
	function( )
{
	return this.doc.fullsize.height + 2;
};


/*
| Returns the zone width.
*/
def.static._zoneWidth =
def.lazy._zoneWidth =
	function( )
{
	return(
		Math.max(
			this.doc.fullsize.width + 4,
			this._zoneHeight / 4
		)
	);
};

/*
| Calculates the labels zone,
| possibly altered by an action.
|
| FUTURE inherit
*/
def.static.zone =
def.lazy.zone =
	function( )
{
	return(
		gleam_rect.create(
			'pos', this.pos,
			'width', this._zoneWidth,
			'height', this._zoneHeight
		)
	);
};


/*:::::::::::.
:: Functions
'::::::::::::*/


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
| The fontsize of the label.
*/
// FIXME
def.static.fontsize =
def.lazy.fontsize =
	function( )
{
	const action = this.action;

	let fs = this.fabric.fontsize;

	if( action && action.timtype === action_resizeItems )
	{
/**/	if( CHECK )
/**/	{
/**/		if( action.scaleX !== action.scaleY ) throw new Error( );
/**/	}

		fs *= action.scaleY;

		fs = Math.max( fs, gruga_label.minSize );
	}

	return fs;
};


/*
| Returns the change for dragging this item.
*/
def.func.getDragItemChange = visual_item.getDragItemChangePosFs;


/*
| Returns the change for resizing this item.
*/
def.func.getResizeItemChange = visual_item.getResizeItemChangePosFs;


/*
| A text has been inputed.
*/
def.func.input = visual_docItem.input;


/*
| Returns the mark for a point
*/
def.func.markForPoint = visual_docItem.markForPoint;


/*
| Nofication when the item lost the users mark.
*/
def.func.markLost =
	function( )
{
	if( this.doc.fabric.isBlank )
	{
		const pc = this.path.chop;

		root.alter(
			change_shrink.create(
				'path', pc,
				'prev', root.spaceFabric.getPath( pc ),
				'rank', root.spaceFabric.rankOf( pc.get( 1 ) )
			)
		);
	}
};


/*
| Returns the minimum x-scale factor this item could go through.
*/
// FIXME
def.static.minScaleX =
def.func.minScaleX =
	function(
		zone  // original zone
	)
{
	return this.minScaleY( zone );
};


/*
| Returns the minimum y-scale factor this item could go through.
*/
// FIXME
def.static.minScaleY =
def.func.minScaleY =
	function(
		// zone  // original zone
	)
{
	return gruga_label.minSize / this.fabric.fontsize;
};


/*
| The mouse wheel turned.
*/
def.func.mousewheel =
	function(
		// p
		// dir
	)
{
	//return this.tShape.within( p );
	// the label lets wheel events pass through it.
	return false;
};


/*
| A move during a text select on this item.
*/
def.func.moveSelect = visual_docItem.moveSelect;


/*
| User is hovering their pointing device over something.
*/
def.func.pointingHover = visual_docItem.pointingHover;


/*
| Labels use pos/fontsize for positioning
*/
def.static.positioning =
def.func.positioning =
	'pos/fontsize';


/*
| Handles a special key.
*/
def.func.specialKey = visual_docItem.specialKey;


/*
| Dummy since a label does not scroll.
*/
def.func.scrollMarkIntoView = function( ){ };


} );

