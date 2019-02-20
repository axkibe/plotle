/*
| A stroke (with possibly arrowhead decorations).
*/
'use strict';


tim.define( module, ( def ) => {


def.extend = './item';


if( TIM )
{
	def.attributes =
	{
		// rights the current user has for this space
		access : { type : 'string' },

		// current action
		action : { type : [ '< ../action/types' ] },

		// the item's fabric
		fabric : { type : '../fabric/stroke' },

		// true if the item is highlighted
		highlight : { type : 'boolean' },

		// node currently hovered upon
		hover : { type : [ 'undefined' ] },

		// the users mark
		mark : { type : [ '< ./mark/types', 'undefined' ] },

		// the path of the itm
		path : { type : [ 'undefined', 'tim.js/src/path' ] },

		// the current space transform
		transform : { type : '../gleam/transform' },
	};
}


const gleam_arrow = require( '../gleam/arrow' );

const gleam_glint_paint = require( '../gleam/glint/paint' );

const gleam_point = require( '../gleam/point' );

const gleam_rect = require( '../gleam/rect' );

const gruga_relation = require( '../gruga/relation' );

const tim_path = require( 'tim.js/src/path' );

const visual_base_stroke = require( './base/stroke' );


/*
| The attention center.
*/
def.lazy.attentionCenter =
	function( )
{
	return this.zone.pc.y;
};


/*
| Sees if this portal is being clicked.
*/
def.proto.click =
	function(
		p,
		shift,
		access  // FIXME have access be an attribute
	)
{
	return;
};



/*
| Handles a potential dragStart event for this item.
*/
def.proto.dragStart =
	function(
		p,
		shift,
		ctrl
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 3 ) throw new Error( );
/**/}

	// FIXME make it more coherent what don't care means
	// false or undefined
	return false;
};


/*
| Returns the change for the action affecting this item.
*/
def.proto.getItemChange = visual_base_stroke.getItemChange;


/*
| The item's glint.
|
| This cannot be done lazily, since it may
| depend on other items.
*/
def.proto.glint =
	function( )
{
	// FIXME remove gruga_relation dependency
	return gleam_glint_paint.createFS( gruga_relation.facet, this._tShape( ) );
};


/*
| No scaling minimum.
*/
def.proto.minScaleX =
def.proto.minScaleY =
	( ) => 0;


/*
| Mouse wheel turned.
*/
def.proto.mousewheel =
	function(
		p,
		dir
		// shift,
		// ctrl
	)
{
	return false;
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
	return;
};


/*
| The items shape
*/
def.proto.shape =
	function( )
{
	const fabric = this.fabric;

	return(
		gleam_arrow.create(
			'joint1', this._from,
			'joint2', this._to,
			'end1', fabric.fromStyle,
			'end2', fabric.toStyle
		).shape
	);
};


/*
| The items zone possibly altered by action.
*/
def.lazy.zone =
	function( )
{
	return gleam_rect.createArbitrary( this._fromPoint, this._toPoint );
};


/*
| Shape or point the stroke goes from.
*/
def.lazy._from =
	function( )
{
	const ffrom = this.fabric.from;

	switch( ffrom.timtype )
	{
		case gleam_point : return this._fromPoint;

		case tim_path : return root.spaceVisual.getPath( ffrom ).shape( );

		default : throw new Error( );
	}
};


/*
| Point the stroke goes from.
*/
def.lazy._fromPoint =
	function( )
{
	const ffrom = this.fabric.from;

/**/if( CHECK )
/**/{
/**/	if( ffrom.timtype !== gleam_point ) throw new Error( );
/**/}

	return this.action.affectPoint( ffrom );
};


/*
| Shape or point the stroke goes to.
*/
def.lazy._to =
	function( )
{
	const fto = this.fabric.to;

	switch( fto.timtype )
	{
		case gleam_point : return this._toPoint;

		case tim_path : return root.spaceVisual.getPath( fto ).shape( );

		default : throw new Error( );
	}
};


/*
| Point the stroke goes to.
*/
def.lazy._toPoint =
	function( )
{
	const fto = this.fabric.to;

/**/if( CHECK )
/**/{
/**/	if( fto.timtype !== gleam_point ) throw new Error( );
/**/}

	return this.action.affectPoint( fto );
};


/*
| Transformed shape.
*/
def.proto._tShape =
	function( )
{
	return this.shape( ).transform( this.transform );
};


} );
