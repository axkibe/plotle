/*
| An users action in the making.
|
| Creating a new note.
| Creating a new label.
| Creating a new portal.
*/
'use strict';


tim.define( module, ( def, action_createGeneric ) => {


def.extend = './action';


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


const gleam_point = require( '../gleam/point' );

const gleam_rect = require( '../gleam/rect' );

const visual_label = require( '../visual/label' );

const visual_note = require( '../visual/note' );

const visual_portal = require( '../visual/portal' );


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
	'note'   : visual_note,
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
| Extra checking
*/
def.proto._check =
	function( )
{
	if( !this.itemTim ) throw new Error( );
};


/*
| Drag moves during creating a generic item.
*/
def.proto.dragMove =
	function(
		p,      // point, viewbased point of stop
		space,  // the visual space for this operation
		shift,  // true if shift key was pressed
		ctrl    // true if ctrl key was pressed
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 4 ) throw new Error( );
/**/}

	// there isn't really a creation going on?
	if( !this.startPoint ) return;

	const transform = space.transform;

	// FIXME make this combo a visual space call
	const dp = space._snap( p, ctrl ).detransform( transform );

	let zone = gleam_rect.createArbitrary( this.startPoint, dp );

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
			const fs = model.doc.fontsize * zone.height / model.zone.height;

			const resized =
				transientItem.create(
					'fabric', model.fabric.create( 'fontsize', fs )
				);

			const pos =
				( dp.x > this.startPoint.x )
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


} );
