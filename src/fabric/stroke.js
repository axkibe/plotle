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
		// pos the stoke goes from (absolute point of reference)
		j1 : { type : [ 'undefined', '../gleam/point', '../trace/item' ], json : true },

		// ancillary point the stroke goes from
		jp1 : { type : [ 'undefined', '../gleam/point' ], json : true },

		// "arrow" or "none"
		js1 : { type : 'string', json: true },

		// pos the stoke goes to (absolute point of reference)
		j2 : { type : [ 'undefined', '../gleam/point', '../trace/item' ], json : true },

		// ancillary point the stroke goes to
		jp2 : { type : [ 'undefined', '../gleam/point' ], json : true },

		// "arrow" or "none"
		js2 : { type : 'string', json: true },
	};

	def.json = 'stroke';
}


const change_list = tim.require( '../change/list' );

const change_set = tim.require( '../change/set' );

const change_shrink = tim.require( '../change/shrink' );

const gleam_arrow = tim.require( '../gleam/arrow' );

const gleam_glint_paint = tim.require( '../gleam/glint/paint' );

const gleam_line = tim.require( '../gleam/line' );

const gleam_point = tim.require( '../gleam/point' );

const gleam_rect = tim.require( '../gleam/rect' );

const gruga_stroke = tim.require( '../gruga/stroke' );

const trace_item = tim.require( '../trace/item' );


/*
| The zone is directly affected by actions.
*/
def.proto.actionAffects = 'j1j2';


/*
| The changes needed for secondary data to adapt to primary.
*/
def.proto.ancillary =
	function(
		space  // space including other items dependend upon
	)
{
	let j1 = this.j1;

	let j2 = this.j2;

	if( j1 && j1.timtype === trace_item )
	{
		j1 = space.get( j1.key );

		if( j1 ) j1 = j1.shape;
	}

	if( j2 && j2.timtype === trace_item )
	{
		j2 = space.get( j2.key );

		if( j2 ) j2 = j2.shape;
	}

	if( !j1 || !j2 )
	{
		return(
			change_list.one(
				change_shrink.create(
					'trace', this.trace.chopRoot,
					'prev', this,
					'rank', space.rankOf( this.key )
				)
			)
		);
	}

	if( j1.timtype !== gleam_point || j2.timtype !== gleam_point )
	{
		const line = gleam_line.createConnection( j1, j2 );

		j1 = line.p1;

		j2 = line.p2;
	}

	let ancillary;

/**/if( CHECK )
/**/{
		if( j1.timtype !== gleam_point || j2.timtype !== gleam_point ) throw new Error( );
/**/}

	if( !j1.equals( this.jp1 ) )
	{
		const ch =
			change_set.create(
				'trace', this.trace.appendJP1.chopRoot,
				'prev', this.jp1,
				'val', j1
			);

		if( !ancillary ) ancillary = change_list.one( ch );
		else ancillary = ancillary.append( ch );
	}

	if( !j2.equals( this.jp2 ) )
	{
		const ch =
			change_set.create(
				'trace', this.trace.appendJP2.chopRoot,
				'prev', this.jp2,
				'val', j2
			);

		if( !ancillary ) ancillary = change_list.one( ch );
		else ancillary = ancillary.append( ch );
	}

	return ancillary;
};


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
		ctrl,
		action   // current action
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 4 ) throw new Error( );
/**/}

	// TODO make it more coherent what don't care means
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
	return gleam_glint_paint.createFacetShape( gruga_stroke.facet, this.tShape );
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
			'joint1', this.jp1,
			'end1', this.js1,
			'joint2', this.jp2,
			'end2', this.js2,
			'arrowSize', gruga_stroke.arrowSize
		).shape
	);
};


/*
| The items zone.
*/
def.lazy.zone =
	function( )
{
	return gleam_rect.createArbitrary( this.jp1, this.jp2 );
};


} );
