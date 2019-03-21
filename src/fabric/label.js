/*
| An item with resizing text.
*/
'use strict';


tim.define( module, ( def, fabric_label ) => {


def.extend = './docItem';


if( TIM )
{
	def.attributes =
	{
		// access level of current user (rw or ro)
		// no json thus not saved or transmitted
		access : { type : [ 'undefined', 'string' ] },

		// the labels document
		doc : { type : './doc', json : true },

		// the fontsize of the label
		fontsize : { type : 'number', json : true },

		// the item is highlighted
		// no json thus not saved or transmitted
		highlight : { type : [ 'undefined', 'boolean' ] },

		// node currently hovered upon
		// no json thus not saved or transmitted
		hover : { type : 'undefined' },

		// the users mark
		// no json thus not saved or transmitted
		mark : { type : [ '< ../visual/mark/types', 'undefined' ] },

		// the path of the doc
		// no json thus not saved or transmitted
		path : { type : [ 'undefined', 'tim.js/path' ] },

		// position
		pos : { type : '../gleam/point', json : true },

		// the current space transform
		// no json thus not saved or transmitted
		transform : { type : [ 'undefined', '../gleam/transform' ] }
	};

	def.json = 'label';
}

const change_grow = tim.require( '../change/grow' );

const change_shrink = tim.require( '../change/shrink' );

const gleam_glint_list = tim.require( '../gleam/glint/list' );

const gleam_glint_paint = tim.require( '../gleam/glint/paint' );

const gleam_glint_window = tim.require( '../gleam/glint/window' );

const gleam_point = tim.require( '../gleam/point' );

const gleam_rect = tim.require( '../gleam/rect' );

const gleam_transform = tim.require( '../gleam/transform' );

const fabric_doc = tim.require( './doc' );

const fabric_para = tim.require( './para' );

const gruga_label = tim.require( '../gruga/label' );

const session_uid = tim.require( '../session/uid' );

const tim_path = tim.require( 'tim.js/path' );

const visual_mark_caret = tim.require( '../visual/mark/caret' );


/*
| Position and fontsize are directly affected by actions.
*/
def.static.actionAffectsPosFs =
def.proto.actionAffectsPosFs =
	true;



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
	const model = fabric_label.model;

	const zone = gleam_rect.createArbitrary( action.startPoint, dp );

	const fs = model.doc.fontsize * zone.height / model.zone.height;

	const resized = model.create( 'fontsize', fs );

	const pos =
		( dp.x > action.startPoint.x )
		? zone.pos
		: gleam_point.create(
			'x', zone.pos.x + zone.width - resized.zone.width,
			'y', zone.pos.y
		);

	const label = resized.create( 'pos', pos );

	const key = session_uid.newUid( );

/**/if( CHECK )
/**/{
/**/	if( label.fontsize !== label.doc.fontsize ) throw new Error( );
/**/
/**/	if( label.pos !== label.pos ) throw new Error( );
/**/}

	root.alter(
		'change',
			change_grow.create(
				'val', label,
				'path', tim_path.empty.append( 'twig' ).append( key ),
				'rank', 0
			),
		'mark',
			visual_mark_caret.pathAt(
				root.space.get( key ).doc.atRank( 0 ).textPath,
				0
			)
	);
};


/*
| Adjusts the doc.
*/
def.adjust.doc =
	function(
		doc
	)
{
	const path = doc.path || ( this.path && this.path.append( 'doc' ) );

	return(
		( doc || this.doc ).create(
			'flowWidth', 0,
			'fontsize', this.fontsize,
			'innerMargin', gruga_label.innerMargin,
			'mark', this.mark,
			'paraSep', Math.round( this.fontsize / 20 ),
			'path', path,
			'scrollPos', gleam_point.zero,
			'transform', this.transform && this.transform.ortho
		)
	);
};


/*
| The fontsize of the label.
*/
/*
def.lazy.fontsize =
	function( )
{
	const action = this.action;

	let fs = this.fontsize;

	if( action && action.timtype === action_resizeItems )
	{
****	if( CHECK )
****	{
****		if( action.scaleX !== action.scaleY ) throw new Error( );
****	}

		fs *= action.scaleY;
	}

	return fs;
};
*/


/*
| The items glint.
*/
def.proto.glint = function( ) { return this._glint; };


/*
| Nofication when the item lost the users mark.
*/
def.proto.markLost =
	function( )
{
	if( this.doc.isBlank )
	{
		const pc = this.path.chop;

		root.alter(
			'change',
			change_shrink.create(
				'path', pc,
				'prev', root.space.getPath( pc ),
				'rank', root.space.rankOf( pc.get( 1 ) )
			)
		);
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
	return 0;
};


/*
| Returns the minimum y-scale factor this item could go through.
*/
def.proto.minScaleY =
	function(
		zone  // original zone
	)
{
	return 0;
};


/*
| The label model.
*/
def.staticLazy.model =
	function( )
{
	return(
		fabric_label.create(
			'access', 'rw',
			'doc',
				fabric_doc.create(
					'twig:add', '1', fabric_para.create( 'text', 'Label' )
				),
			'fontsize', gruga_label.defaultFontsize,
			'pos', gleam_point.zero,
			'highlight', false,
			'transform', gleam_transform.normal
		)
	);
};


/*
| The mouse wheel turned.
*/
def.proto.mousewheel =
	function(
		// p
		// dir
	)
{
	// the label lets wheel events pass through it.
	return false;
};


/*
| The labels position possibly altered by actions
| FIXME
*/
/*
def.lazy.pos =
	function( )
{
	const action = this.action;

	switch( action && action.timtype )
	{
		case action_dragItems :

			return this.pos.add( action.moveBy );

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

	return this.pos;
};
*/


/*
| Labels use pos/fontsize for positioning
*/
def.static.positioning =
def.proto.positioning =
	'pos/fontsize';


/*
| Labels resize proportional only.
*/
def.proto.proportional = true;


/*
| Dummy since a label does not scroll.
*/
def.proto.scrollMarkIntoView = function( ){ };


/*
| The item's shape.
| FIXME lazy
*/
def.proto.shape = function( ){ return this.zone.shrink1; };


/*
| Calculates the labels zone,
| possibly altered by an action.
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

		arr.push( gleam_glint_paint.createFS( facet, this._tShape( ) ) );
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
