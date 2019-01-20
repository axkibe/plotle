/*
| An item with resizing text.
*/
'use strict';


tim.define( module, ( def, visual_label ) => {


def.extend = './docItem';


if( TIM )
{
	def.attributes =
	{
		// current action
		action : { type : [ '< ../action/types', 'undefined' ] },

		// the document (content)
		doc : { type : [ './doc', 'undefined' ] },

		// the labels fabric
		fabric : { type : '../fabric/label' },

		// the item is highlighted
		highlight : { type : 'boolean' },

		// node currently hovered upon
		hover : { type : [ 'undefined' ] },

		// the users mark
		mark : { type : [ '< ./mark/types', 'undefined' ] },

		// the path of the item
		path : { type : [ 'undefined', 'tim.js/src/path' ] },

		// the current space transform
		transform : { type : '../gleam/transform' }
	};
}


const action_dragItems = require( '../action/dragItems' );

const action_resizeItems = require( '../action/resizeItems' );

const change_grow = require( '../change/grow' );

const change_shrink = require( '../change/shrink' );

const compass = require( '../compass/root' );

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

const tim_path = require( 'tim.js/src/path' );

const visual_doc = require( '../visual/doc' );

const visual_docItem = require( '../visual/docItem' );

const visual_item = require( '../visual/item' );

const visual_mark_caret = require( '../visual/mark/caret' );


/*
| Doesn't care about hovering
*/
def.static.concernsHover =
def.func.concernsHover =
	( ) => undefined;


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
			model.doc.fontsize * zone.height / model.zone.height,
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

	root.setUserMark(
		visual_mark_caret.pathAt( root.spaceVisual.get( key ).doc.atRank( 0 ).textPath, 0 )
	);
};


/*
| Transforms the doc.
*/
def.transform.doc =
	function(
		doc
	)
{
	const fabric = this.fabric;

	return(
		( doc || visual_doc ).create(
			'fabric', fabric.doc,
			'flowWidth', 0,
			'fontsize', this.fontsize,
			'innerMargin', gruga_label.innerMargin,
			'mark', this.mark,
			'paraSep', Math.round( this.fontsize / 20 ),
			'path', this.path && this.path.append( 'doc' ),
			'scrollPos', gleam_point.zero,
			'transform', this.transform.ortho
		)
	);
};


/*
| The fontsize of the label.
*/
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
| The items glint.
*/
def.func.glint = function( ) { return this._glint; };


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
def.func.minScaleY =
	function(
		// zone  // original zone
	)
{
	return gruga_label.minSize / this.fabric.fontsize;
};


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
| The labels position possibly altered by actions
*/
def.lazy.pos =
	function( )
{
	const action = this.action;

	switch( action && action.timtype )
	{
		case action_dragItems :

			return this.fabric.pos.add( action.moveBy );

		case action_resizeItems :
		{
			const zone = action.startZones.get( this.path.get( 2 ) );

			// FIXME make a map
			switch( action.resizeDir )
			{
				case compass.ne :

					return zone.psw.baseScaleAction( action, 0, -this._zoneHeight );

				case compass.nw :

					return zone.pse.baseScaleAction( action, -this._zoneWidth, -this._zoneHeight );

				case compass.se :

					return zone.pos.baseScaleAction( action, 0, 0 );

				case compass.sw :

					return zone.pne.baseScaleAction( action, -this._zoneWidth, 0 );
			}

			// should never be reached
			throw new Error( );
		}
	}

	return this.fabric.pos;
};


/*
| Labels use pos/fontsize for positioning
*/
def.static.positioning =
def.func.positioning =
	'pos/fontsize';


/*
| Labels resize proportional only.
*/
def.func.proportional = true;


/*
| Dummy since a label does not scroll.
*/
def.func.scrollMarkIntoView = function( ){ };


/*
| Handles a special key.
*/
def.func.specialKey = visual_docItem.specialKey;


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
| Calculates the labels zone,
| possibly altered by an action.
|
| FUTURE inherit
*/
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



/*
| The items glint.
*/
def.lazy._glint =
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

		arr.push( gleam_glint_paint.createFS( facet, this.tShape ) );
	}

	return gleam_glint_list.create( 'list:init', arr );
};


/*
| Inheritance optimization.
|
| FIXME shouldn't this be default?
*/
def.inherit._glint =
	function(
		inherit
	)
{
	return inherit.equals( this );
};


/*
| Returns the zone height.
*/
def.lazy._zoneHeight =
	function( )
{
	return this.doc.fullsize.height + 2;
};


/*
| Returns the zone width.
*/
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


} );
