/*
| The user is resizing an item.
*/
'use strict';


tim.define( module, ( def ) => {


def.extend = './base';


if( TIM )
{
	def.attributes =
	{
		// the items to resize
		items: { type : [ 'undefined', '../fabric/itemSet' ] },

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


const action_none = tim.require( './none' );

const change_list = tim.require( '../change/list' );

const change_set = tim.require( '../change/set' );

const fabric_space = tim.require( '../fabric/space' );


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

};


/*
| The changes this action applies on the fabric tree.
*/
def.lazy.changes =
	function( )
{
	const pBase = this.pBase;

	if( !pBase ) return change_list.empty;

	const changes = [ ];

	for( let item of this.items.iterator( ) )
	{
		if( item.actionAffectsZone )
		{
			const iZone = item.zone;

			const aZone = iZone.baseScaleAction( this, 0, 0 ).ensureMinSize( item.minSize );

			changes.push(
				change_set.create(
					'path', item.path.chop.append( 'zone' ),
					'val', aZone,
					'prev', iZone
				)
			);
		}

		if( item.actionAffectsPosFs )
		{
			const iPos = item.pos;

			const aPos = iPos.baseScaleAction( this, 0, 0 );

			if( !iPos.equals( aPos ) )
			{
				changes.push(
					change_set.create(
						'path', item.path.chop.append( 'pos' ),
						'val', aPos,
						'prev', iPos
					)
				);
			}

			const iFs = item.fontsize;

/**/		if( CHECK )
/**/		{
/**/			if( this.scaleX !== this.scaleY ) throw new Error( );
/**/		}

			const aFs = iFs * this.scaleY;

			if( iFs !== aFs )
			{
				changes.push(
					change_set.create(
						'path', item.path.chop.append( 'fontsize' ),
						'val', aFs,
						'prev', iFs
					)
				);
			}
		}
	}

	return change_list.create( 'list:init', changes );
};


/*
| Drag moves during item resizing.
*/
def.proto.dragMove =
	function(
		p,      // point, viewbased point of stop
		screen, // the screen for this operation
		// FIXME check if really needed
		shift,  // true if shift key was pressed
		ctrl    // true if ctrl key was pressed
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 4 ) throw new Error( );
/**/}

	// this action only makes sense on spaces
	if( screen.timtype !== fabric_space ) return;

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

	const startZones = this.startZones;

	for( let item of this.items.iterator( ) )
	{
		const key = item.key;

		const startZone = startZones.get( key );

		let min = item.minScaleX( startZone );

		if( scaleX < min ) scaleX = min;

		min = item.minScaleY( startZone );

		if( scaleY < min ) scaleY = min;
	}

	if( proportional ) scaleX = scaleY = Math.max( scaleX, scaleY );

	root.alter( 'action', this.create( 'scaleX', scaleX, 'scaleY', scaleY ) );
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
	root.alter( 'action', action_none.singleton, 'change', this.changes );
};


/*
| Mouse hover.
|
| Returns a result_hover with hovering path and cursor to show.
*/
def.proto.pointingHover =
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

	return this.resizeDir.resizeHoverCursor;
};


} );
