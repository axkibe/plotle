/*
| An item with resizing text.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'visual_label',
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
				comment : 'the labels fabric',
				type : 'fabric_label'
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
	change_shrink,
	gleam_glint_paint,
	gleam_glint_ray,
	gleam_glint_window,
	gleam_point,
	gleam_rect,
	gleam_transform,
	fabric_doc,
	fabric_label,
	fabric_para,
	gruga_label,
	jion,
	session_uid,
	visual_doc,
	visual_docItem,
	visual_item,
	visual_label,
	visual_mark_caret;


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

	visual_label = jion.this( module, 'source' );

	visual_label.prototype._init = function( ) { };

	return;
}

visual_label.reflect = 'visual_note:static';

prototype = visual_label.prototype;


/*
| Hack to fix visual_note:static references
*/
visual_label.equals =
	function( o )
{
	return o === this;
};


/*
| Labels resize proportional only.
*/
prototype.proportional = true;


/*
| User wants to create a new label.
*/
visual_label.createGeneric =
	function(
		action, // the create action
		dp      // the detransform point the createGeneric
		//      // stoped at.
	)
{
	var
		fs,
		key,
		label,
		model,
		pos,
		resized,
		zone;

	model = visual_label.model;

	zone = gleam_rect.createArbitrary( action.startPoint, dp );

	fs =
		Math.max(
			model.doc.fontsize
			* zone.height
			/ model.zone.height,
			gruga_label.minSize
		);

	resized =
		model.create(
			'fabric', model.fabric.create( 'fontsize', fs )
		);

	pos =
		( dp.x > action.startPoint.x )
		? zone.pos
		: gleam_point.create(
			'x', zone.pos.x + zone.width - resized.zone.width,
			'y', zone.pos.y
		);

	label = resized.create( 'fabric', resized.fabric.create( 'pos', pos ) );

	key = session_uid( );

/**/if( CHECK )
/**/{
/**/	if( label.fabric.fontsize !== label.doc.fontsize )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( label.fabric.pos !== label.pos )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	root.alter(
		change_grow.create(
			'val', label.fabric,
			'path',
				jion.path.empty
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
| The label model.
*/
jion.lazyStaticValue(
	visual_label,
	'model',
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
}
);


/*
| Initializer.
*/
prototype._init =
	function(
		inherit
	)
{
	var
		fabric;

	fabric = this.fabric;

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
		&& jion.hasLazyValueSet( inherit, 'glint' )
	)
	{
		jion.aheadValue( this, 'glint', inherit.glint );
	}
/**/else if( CHECK && CHECK.noinherit )
/**/{
/**/	console.log( 'noinherit', 'visual_label' );
/**/}

};


/*
| The attention center.
*/
jion.lazyValue(
	prototype,
	'attentionCenter',
	visual_docItem.attentionCenter
);


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
| The fontsize of the label.
*/
visual_label.fontsize =
	function( )
{
	var
		action,
		fs;

	action = this.action;

	fs = this.fabric.fontsize;

	if( action && action.reflect === 'action_resizeItems' )
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


jion.lazyValue( prototype, 'fontsize', visual_label.fontsize );


/*
| Returns the change for dragging this item.
*/
prototype.getDragItemChange = visual_item.getDragItemChangePosFs;


/*
| Returns the change for resizing this item.
*/
prototype.getResizeItemChange = visual_item.getResizeItemChangePosFs;


/*
| The items glint.
*/
jion.lazyValue(
	prototype,
	'glint',
	function( )
{
	// FUTURE GLINT inherit
	var
		facet,
		gLen,
		gRay,
		tZone;

	tZone = this.tZone;

	gRay = [ ];

	gLen = 0;

	gRay[ gLen++ ] =
		gleam_glint_window.create(
			'glint', this.doc.glint,
			'rect', tZone.enlarge1
		);

	if( this.highlight )
	{
		facet = gruga_label.facets.getFacet( 'highlight', true );

		gRay[ gLen++ ] =
			gleam_glint_paint.create(
				'facet', facet,
				'shape', this.tShape
			);
	}

	return gleam_glint_ray.create( 'list:init', gRay );
}
);


/*
| A text has been inputed.
*/
prototype.input = visual_docItem.input;


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
| Nofication when the item lost the users mark.
*/
prototype.markLost =
	function( )
{
	var
		pc;

	if( this.doc.fabric.isBlank )
	{
		pc = this.path.chop;

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
visual_label.minScaleX =
prototype.minScaleX =
	function(
		zone  // original zone
	)
{
	return this.minScaleY( zone );
};


/*
| Returns the minimum y-scale factor this item could go through.
*/
visual_label.minScaleY =
prototype.minScaleY =
	function(
//		zone  // original zone
	)
{
	return gruga_label.minSize / this.fabric.fontsize;
};


/*
| The mouse wheel turned.
*/
prototype.mousewheel =
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
prototype.moveSelect = visual_docItem.moveSelect;


/*
| The labels position possibly altered by actions
*/
visual_label.pos =
	function( )
{
	var
		action,
		zone;

	action = this.action;

	switch( action && action.reflect )
	{
		case 'action_dragItems' :

			return this.fabric.pos.add( action.moveBy );

		case 'action_resizeItems' :

			zone = action.startZones.get( this.path.get( 2 ) );

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
| The labels position, possibly altered by an action.
*/
jion.lazyValue( prototype, 'pos', visual_label.pos );


/*
| User is hovering their pointing device over something.
*/
prototype.pointingHover = visual_docItem.pointingHover;


/*
| Labels use pos/fontsize for positioning
*/
visual_label.positioning =
prototype.positioning =
	'pos/fontsize';


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
| Dummy since a label does not scroll.
*/
prototype.scrollMarkIntoView = function( ){ };


/*
| The item's shape in current transform.
*/
visual_label.tShape =
	function( )
{
	return this.shape.transform( this.transform );
};


/*
| The item's shape in current transform.
*/
jion.lazyValue( prototype, 'tShape', visual_label.tShape );


/*
| Zone in current transform.
*/
visual_label.tZone =
	function( )
{
	return this.zone.transform( this.transform );
};


jion.lazyValue( prototype, 'tZone', visual_label.tZone );


/*
| Returns the zone height.
*/
visual_label._zoneHeight =
	function( )
{
	return this.doc.fullsize.height + 2;
};

jion.lazyValue( prototype, '_zoneHeight', visual_label._zoneHeight );


/*
| Returns the zone width.
*/
visual_label._zoneWidth =
	function( )
{
	return(
		Math.max(
			this.doc.fullsize.width + 4,
			this._zoneHeight / 4
		)
	);
};

jion.lazyValue( prototype, '_zoneWidth', visual_label._zoneWidth );


/*
| Calculates the labels zone,
| possibly altered by an action.
|
| FUTURE inherit
*/
visual_label.zone =
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


jion.lazyValue( prototype, 'zone', visual_label.zone );


} )( );
