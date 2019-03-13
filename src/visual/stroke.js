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
		path : { type : [ 'undefined', 'tim.js/path' ] },

		// the current space transform
		transform : { type : '../gleam/transform' },
	};
}


const gleam_arrow = tim.require( '../gleam/arrow' );

const gleam_connect = tim.require( '../gleam/connect' );

const gleam_glint_paint = tim.require( '../gleam/glint/paint' );

const gleam_point = tim.require( '../gleam/point' );

const gruga_relation = tim.require( '../gruga/relation' );

const tim_path = tim.require( 'tim.js/path' );

const visual_base_stroke = tim.require( './base/stroke' );


/*
| The attention center.
*/
def.lazy.attentionCenter =
	function( )
{
	return this.zone( ).pc.y;
};


/*
| Checks if the item is being clicked and reacts.
*/
def.proto.click =
	function(
		p,       // point where dragging starts
		shift,   // true if shift key was held down
		ctrl,    // true if ctrl or meta key was held down
		mark     // mark of the visual space
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
			'joint1', this._line( ).p1,
			'joint2', this._line( ).p2,
			'end1', fabric.fromStyle,
			'end2', fabric.toStyle
		).shape
	);
};


/*
| The items zone possibly altered by action.
*/
def.proto.zone =
	function( )
{
	return this._line( ).zone;
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
		case gleam_point : return this._line( ).p1;

		case tim_path : return ffrom;

		default : throw new Error( );
	}
};


/*
| The line of the stroke.
*/
def.proto._line =
	function( )
{
	let ffrom = this.fabric.from;
	let fto = this.fabric.to;

	if( ffrom.timtype === gleam_point )
	{
		ffrom = this.action.affectPoint( ffrom );
	}
	else
	{
		const ifrom = root.spaceVisual.getPath( ffrom );

		if( ifrom ) ffrom = root.spaceVisual.getPath( ffrom ).shape( );
		else ffrom = gleam_point.zero;
	}

	if( fto.timtype === gleam_point )
	{
		fto = this.action.affectPoint( fto );
	}
	else
	{
		const ito = root.spaceVisual.getPath( fto );

		if( ito ) fto = root.spaceVisual.getPath( fto ).shape( );
		else fto = gleam_point.zero;
	}

	return gleam_connect.line( ffrom, fto );
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
		case gleam_point : return this._line( ).p2;

		case tim_path : return fto;

		default : throw new Error( );
	}
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
