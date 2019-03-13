/*
| An users action in the making.
|
| Creating a new note.
| Creating a new label.
| Creating a new portal.
*/
'use strict';


tim.define( module, ( def, action_createGeneric ) => {


def.extend = './base';


if( TIM )
{
	def.attributes =
	{
		// item type to be created
		itemType : { type : 'string'  },

		// the transient item in creation
		transientItem : { type : [ '< ../visual/item-types', 'undefined' ] },

		// start point of drag creation
		startPoint : { type : [ 'undefined', '../gleam/point' ] }
	};
}


const action_none = tim.require( './none' );

const fabric_note = tim.require( '../fabric/note' );

const gleam_point = tim.require( '../gleam/point' );

const gleam_rect = tim.require( '../gleam/rect' );

const result_hover = tim.require( '../result/hover' );

const visual_label = tim.require( '../visual/label' );

const visual_portal = tim.require( '../visual/portal' );

const visual_space = tim.require( '../visual/space' );


/*
| Shortcut.
*/
def.staticLazy.createLabel = ( ) =>
	action_createGeneric.create( 'itemType', 'label' );


/*
| Shortcut.
*/
def.staticLazy.createNote = ( ) =>
	action_createGeneric.create( 'itemType', 'note' );


/*
| Shortcut.
*/
def.staticLazy.createPortal = ( ) =>
	action_createGeneric.create( 'itemType', 'portal' );


/*
| Maps item type names to timtypes.
*/
def.staticLazy.itemTypeToTim = ( ) =>
( {
	'label'  : visual_label,
	'note'   : fabric_note,
	'portal' : visual_portal,
} );


/*
| Returns the tim of the item to be created.
*/
def.lazy.itemTim =
	function( )
{
	return action_createGeneric.itemTypeToTim[ this.itemType ];
};


/*
| Drag moves during creating a generic item.
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

	// there isn't really a creation going on?
	if( !this.startPoint ) return;

	const transform = screen.transform;

	const ps = screen.pointToSpaceRS( p, !ctrl );

	let zone = gleam_rect.createArbitrary( this.startPoint, ps );

	const model = this.itemTim.model;

	let transientItem = this.transientItem;

	switch( this.itemType )
	{
		case 'note' :
		case 'portal' :

			zone = zone.ensureMinSize( model.minSize );

			transientItem =
				transientItem.create(
					'fabric', transientItem.fabric.create( 'zone', zone ),
					'transform', transform
				);

			break;

		case 'label' :
		{
			const fs = model.doc.fontsize * zone.height / model.zone( ).height;

			const resized =
				transientItem.create(
					'fabric', model.fabric.create( 'fontsize', fs )
				);

			const pos =
				( ps.x > this.startPoint.x )
				? zone.pos
				: gleam_point.xy(
					zone.pos.x + zone.width - resized.zone.width,
					zone.pos.y
				);

			transientItem =
				resized.create(
					'fabric', resized.fabric.create( 'pos', pos ),
					'transform', transform
				);

			break;
		}

		default : throw new Error( );
	}

	root.create( 'action', this.create( 'transientItem', transientItem ) );
};


/*
| Starts a drag.
*/
def.proto.dragStart =
	function(
		p,      // cursor point
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

	const itemTim = this.itemTim;

	const model = itemTim.model;

	const ps = screen.pointToSpaceRS( p, !ctrl );

	let transientItem;

	switch( itemTim.positioning )
	{
		case 'zone' :
		{
			let fabric  =
				model.fabric.create(
					'zone', gleam_rect.posSize( ps, model.minSize )
				);

			if( itemTim === visual_portal )
			{
				fabric =
					fabric.create(
						'spaceUser', root.userCreds.name,
						'spaceTag', 'home'
					);
			}

			transientItem =
				model.create(
					'fabric', fabric,
					'path', visual_space.transPath,
					'transform', screen.transform
				);

			break;
		}

		case 'pos/fontsize' :

			transientItem =
				model.create(
					'fabric', model.fabric.create( 'pos', ps ),
					'path', visual_space.transPath,
					'transform', screen.transform
				);

			break;

		default : throw new Error( );

	}

	root.create( 'action', this.create( 'startPoint', ps, 'transientItem', transientItem ) );
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
	if( !this.startPoint ) return;

	const ps = screen.pointToSpaceRS( p, !ctrl );

	this.itemTim.createGeneric( this, ps );

	root.create(
		'action',
			shift
			? action_createGeneric.create( 'itemType', this.itemType )
			: action_none.create( )
	);
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

	return result_hover.cursorDefault;
};


/*
| Extra checking
*/
def.proto._check =
	function( )
{
	if( !this.itemTim ) throw new Error( );
};


} );
