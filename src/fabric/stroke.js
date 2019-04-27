/*
| A stroke (with possible arrow heads)
*/
'use strict';


tim.define( module, ( def ) => {


def.extend = './item';


if( TIM )
{
	def.attributes =
	{
		// rights the current user has for this space
		// no json thus not saved or transmitted
		access : { type : [ 'undefined', 'string' ] },

		// itemkey or pos the stoke goes from
		from : { type : [ 'tim.js/path', '../gleam/point' ], json : true },

		// "arrow" or "none"
		fromStyle : { type : 'string', json: true },

		// true if the item is highlighted
		// no json thus not saved or transmitted
		highlight : { type : [ 'undefined', 'boolean' ] },

		// node currently hovered upon
		// no json thus not saved or transmitted
		hover : { type : [ 'undefined' ] },

		// the users mark
		// no json thus not saved or transmitted
		mark : { type : [ 'undefined', '< ../mark/visual-types'] },

		// the path of the arrow
		// no json thus not saved or transmitted
		path : { type : [ 'undefined', 'tim.js/path' ] },

		// itemkey or pos the stroke goes to
		to : { type : [ 'tim.js/path', '../gleam/point' ], json : true },

		// "arrow" or "none"
		toStyle : { type : 'string', json: true },

		// the current space transform
		// no json thus not saved or transmitted
		transform : { type : [ 'undefined', '../gleam/transform' ] },
	};

	def.json = 'stroke';
}


const gleam_arrow = tim.require( '../gleam/arrow' );

const gleam_connect = tim.require( '../gleam/connect' );

const gleam_glint_paint = tim.require( '../gleam/glint/paint' );

const gleam_point = tim.require( '../gleam/point' );

const gruga_relation = tim.require( '../gruga/relation' );

const tim_path = tim.require( 'tim.js/path' );


/*
| The attention center.
*/
def.lazy.attentionCenter =
	function( )
{
	return this.zone.pc.y;
};


/*
| Checks if the item is being clicked and reacts.
*/
def.proto.click =
	function(
		p,       // point where dragging starts
		shift,   // true if shift key was held down
		ctrl     // true if ctrl or meta key was held down
	)
{
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
| The item's glint.
|
| This cannot be done lazily, since it may
| depend on other items.
*/
def.lazy.glint =
	function( )
{
	// FIXME remove gruga_relation dependency
	return gleam_glint_paint.createFacetShape( gruga_relation.facet, this.tShape );
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
def.lazy.shape =
	function( )
{
	return(
		gleam_arrow.create(
			'joint1', this._line.p1,
			'joint2', this._line.p2,
			'end1', this.fromStyle,
			'end2', this.toStyle
		).shape
	);
};


/*
| The items zone.
*/
def.lazy.zone =
	function( )
{
	return this._line.zone;
};


/*
| Shape or point the stroke goes from.
*/
def.lazy._from =
	function( )
{
	const ffrom = this.from;

	switch( ffrom.timtype )
	{
		case gleam_point : return this._line.p1;

		case tim_path : return ffrom;

		default : throw new Error( );
	}
};


/*
| The line of the stroke.
*/
def.lazy._line =
	function( )
{
	let ffrom = this.from;
	let fto = this.to;

	/*
	if( ffrom.timtype === gleam_point )
	{
		ffrom = this.action.affectPoint( ffrom );
	}
	else
	{
		// FIXME immutable tree hierachy violation
		const ifrom = root.space.getPath( ffrom );

		if( ifrom ) ffrom = root.space.getPath( ffrom ).shape;
		else ffrom = gleam_point.zero;
	}

	if( fto.timtype === gleam_point )
	{
		fto = this.action.affectPoint( fto );
	}
	else
	{
		// FIXME immutable tree hierachy violation
		const ito = root.space.getPath( fto );

		if( ito ) fto = root.space.getPath( fto ).shape;
		else fto = gleam_point.zero;
	}
	*/

	return gleam_connect.line( ffrom, fto );
};


/*
| Shape or point the stroke goes to.
*/
def.lazy._to =
	function( )
{
	const fto = this.to;

	switch( fto.timtype )
	{
		case gleam_point : return this._line.p2;

		case tim_path : return fto;

		default : throw new Error( );
	}
};


} );
