/*
| An item with resizing text.
*/
'use strict';


// FIXME
var
	action_dragItems,
	action_resizeItems,
	change_grow,
	change_shrink,
	gleam_glint_list,
	gleam_glint_paint,
	gleam_glint_window,
	gleam_point,
	gleam_rect,
	gleam_transform,
	fabric_doc,
	fabric_label,
	fabric_para,
	gruga_label,
	session_uid,
	visual_doc,
	visual_docItem,
	visual_item,
	visual_mark_caret;


tim.define( module, 'visual_label', ( def, visual_label ) => {


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
			// the labels fabric
			type : 'fabric_label'
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

	def.init = [ 'inherit' ];

	def.alike =
	{
		alikeIgnoringTransform :
		{
			ignores : { 'transform' : true }
		}
	};
}


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

	const key = session_uid( );

/**/if( CHECK )
/**/{
/**/	if( label.fabric.fontsize !== label.doc.fontsize ) throw new Error( );
/**/
/**/	if( label.fabric.pos !== label.pos ) throw new Error( );
/**/}

	root.alter(
		change_grow.create(
			'val', label.fabric,
			'path',
				tim.path.empty
				.append( 'twig' )
				.append( key ),
			'rank', 0
		)
	);

	root.create(
		'mark',
			visual_mark_caret.create(
				'path',
					root.spaceVisual
					.get( key )
					.doc.atRank( 0 )
					.textPath,
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
// FIXME
def.lazy.attentionCenter = NODE || visual_docItem.attentionCenter;


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
// FIXME
def.func.getDragItemChange = NODE || visual_item.getDragItemChangePosFs;


/*
| Returns the change for resizing this item.
*/
// FIXME
def.func.getResizeItemChange = NODE || visual_item.getResizeItemChangePosFs;


/*
| A text has been inputed.
*/
// FIXME
def.func.input = NODE || visual_docItem.input;


/*
| Returns the mark for a point
// FIXME
*/
def.func.markForPoint = NODE || visual_docItem.markForPoint;


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
// FIXME
def.func.moveSelect = NODE || visual_docItem.moveSelect;


/*
| User is hovering their pointing device over something.
*/
// FIXME
def.func.pointingHover = NODE || visual_docItem.pointingHover;


/*
| Labels use pos/fontsize for positioning
*/
def.static.positioning =
def.func.positioning =
	'pos/fontsize';


/*
| Handles a special key.
*/
def.func.specialKey = NODE || visual_docItem.specialKey;


/*
| Dummy since a label does not scroll.
*/
def.func.scrollMarkIntoView = function( ){ };


} );
