/*
| The user is resizing an item.
*/
'use strict';


tim.define( module, ( def ) => {


def.extend = './action';


if( TIM )
{
	def.attributes =
	{
		// the paths of the items to drag
		itemPaths: { type : [ 'undefined', 'tim.js/src/pathList' ] },

		// mouseDown point on drag creation
		startPoint : { type : '../gleam/point' },

		// base the resize to this point
		pBase : { type : [ 'undefined', '../gleam/point' ] },

		// if true resize proportionally
		// scaleX must be === scaleY
		proportional : { type : [ 'undefined', 'boolean' ] },

		// resize to this direction
		resizeDir : { type : [ '< ../compass/dir-types' ] },

		// scale x by this factor
		scaleX : { type : [ 'undefined', 'number' ] },

		// scale y by this factor
		scaleY : { type : [ 'undefined', 'number' ] },

		// the zones as the resize started
		startZone : { type : '../gleam/rect' },

		// the zones as the resize started
		startZones : { type : '../gleam/rectGroup' },
	};
}


const action_none = require( './none' );

const change_list = require( '../change/list' );

const visual_space = require( '../visual/space' );


/*
| Returns true if an entity with path is affected by this action.
*/
def.proto.affectsItem =
	function(
		item
	)
{
	const path = item.path;

	const paths = this.itemPaths;

	for( let a = 0, pLen = paths.length; a < pLen; a++ )
	{
		const pa = paths.get( a );

		if( pa.equals( path ) ) return true;
	}

	return false;
};


/*
| 'Normal' button ought to be down during this action.
*/
def.proto.normalButtonDown = true;


/*
| Returns a zone affected by this action.
*/
def.proto.affectPoint =
	function(
		p   // the unaffected point
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 1 ) throw new Error( );
/**/}

	if( !this.pBase ) return p;

	return p.baseScaleAction( this, 0, 0 );
};


/*
| Returns a zone affted by this action.
*/
def.proto.affectZone =
	function(
		zone,      // the unaffected zone
		minSize    // minimum size of the zone
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 2 ) throw new Error( );
/**/}

	if( !this.pBase ) return zone;

	zone = zone.baseScaleAction( this, 0, 0 );

	if( minSize ) zone = zone.ensureMinSize( minSize );

	return zone;
};


/*
| Drag moves during item resizing.
*/
def.proto.dragMove =
	function(
		p,      // point, viewbased point of stop
		screen, // the screen for this operation
		shift,  // true if shift key was pressed
		ctrl    // true if ctrl key was pressed
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 4 ) throw new Error( );
/**/}

	// this action only makes sense on spaces
	if( screen.timtype !== visual_space ) return;

	const transform = screen.transform;

	const pBase = this.pBase;

	const proportional = this.proportional;

	const resizeDir = this.resizeDir;

	const startPoint = this.startPoint;

	const startZone = this.startZone;

	const dp = p.detransform( transform );

	let scaleX, scaleY;

	{
		// start zone reference point
		const szrp = resizeDir.from( startZone );

		// distance of startPoint to szrp
		const disp = szrp.sub( startPoint );

		// end zone point
		let ezp = dp.add( disp );

		// FIXME decomplicate
		ezp = screen.pointToSpaceRS( ezp.transform( transform ), !ctrl );

		if( resizeDir.hasY )
		{
			scaleY = ( pBase.y - ezp.y ) / ( pBase.y - szrp.y );

			if( scaleY < 0 ) scaleY = 0;
		}

		if( resizeDir.hasX )
		{
			scaleX = ( pBase.x - ezp.x ) / ( pBase.x - szrp.x );

			if( scaleX < 0 ) scaleX = 0;
		}
	}

	if( proportional )
	{
		if( scaleX === undefined ) scaleX = scaleY;
		else if( scaleY === undefined ) scaleY = scaleX;
	}
	else
	{
		if( scaleX === undefined ) scaleX = 1;

		if( scaleY === undefined ) scaleY = 1;
	}

	const paths = this.itemPaths;

	const startZones = this.startZones;

	for( let a = 0, al = paths.length; a < al; a++ )
	{
		const path = paths.get( a );

		const key = path.get( 2 );

		const item = screen.get( key );

		const startZone = startZones.get( key );

		let min = item.minScaleX( startZone );

		if( scaleX < min ) scaleX = min;

		min = item.minScaleY( startZone );

		if( scaleY < min ) scaleY = min;
	}

	if( proportional ) scaleX = scaleY = Math.max( scaleX, scaleY );

	root.create( 'action', this.create( 'scaleX', scaleX, 'scaleY', scaleY ) );
};


/*
| Starts a drag.
*/
def.proto.dragStart =
	function(
		p,     // cursor point
		screen, // the screen for this operation
		shift, // true if shift key was pressed
		ctrl   // true if ctrl key was pressed
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 4 ) throw new Error( );
/**/}

	console.log( new Error( ) );
};



/*
| Stops a drag.
*/
def.proto.dragStop =
	function(
		p,      // point of stop
		screen, // the screen for this operation
		shift,  // true if shift key was pressed
		ctrl    // true if ctrl key was pressed
	)
{
	const paths = this.itemPaths;

	let changes;

	for( let a = 0, al = paths.length; a < al; a++ )
	{
		const item = root.getPath( paths.get( a ) );

		const chi = item.getItemChange( );

		if( !chi ) continue;

		if( !changes )
		{
			changes = chi;
		}
		else
		{
			if( changes.timtype !== change_list )
			{
				changes = change_list.create( 'list:append', changes );
			}

			if( chi.timtype !== change_list )
			{
				changes = changes.create( 'list:append', chi );
			}
			else
			{
				changes = changes.appendList( chi );
			}

		}
	}

	if( changes ) root.alter( changes );

	root.create( 'action', action_none.create( ) );
};


} );
