/*
| Everything there is in a space.
*/
'use strict';


tim.define( module, ( def ) => {


const action_createRelation = require( '../action/createRelation' );

const action_dragItems = require( '../action/dragItems' );

const action_none = require( '../action/none' );

const change_list = require( '../change/list' );

const change_set = require( '../change/set' );

const gleam_point = require( '../gleam/point' );

const visual_mark_caret = require( '../visual/mark/caret' );

const visual_mark_items = require( '../visual/mark/items' );

const visual_mark_range = require( '../visual/mark/range' );


/*
| Returns the action if an item with 'path' concerns about
| the action.
*/
def.static.concernsAction =
	function(
		action,
		item
	)
{
	if( action.timtype === action_none ) return action;

	if( !item || !item.path ) return action_none.create( );

	return action.affectsItem( item ) ? action : action_none.create( );
};


/*
| Returns the action if an item with 'path' concerns about
| the hover.
*/
def.static.concernsHover =
def.proto.concernsHover =
	( hover, path ) => undefined;


/*
| Returns the mark if an item with 'path' concerns about
| the mark.
*/
def.static.concernsMark =
	function(
		mark,
		path
	)
{
	if( !path || !mark ) return undefined;

	return(
		mark.containsPath( path )
		? mark
		: undefined
	);
};


/*
| Handles a potential dragStart event for this item.
*/
def.static.dragStart =
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

	const action = this.action;

	if( !this.tShape.within( p ) ) return false;

	switch( action && action.timtype )
	{
		case action_createRelation :

			root.create(
				'action',
					action.create(
						'fromItemPath', this.path,
						'relationState', 'hadSelect',
						'toPoint', p
					)
			);

			return true;
	}

	// dragging
	if( this.access !== 'rw' ) return false;

	let mark = this.mark;

	if( !mark || mark.timtype !== visual_mark_items )
	{
		mark = visual_mark_items.createWithOne( this.path );

		root.setUserMark( mark );
	}

	const paths = mark.itemPaths;

	root.create(
		'action',
			action_dragItems.create(
				'itemPaths', paths,
				'moveBy', gleam_point.zero,
				'startPoint', p.detransform( this.transform ),
				'startZone', this.zone
			)
	);

	return true;
};


/*
| Returns the change-set for a dragging
| the item, defined by its zone.
*/
def.static.getDragItemChangeZone =
	function( )
{
	const action = this.action;

	const moveBy = action.moveBy;

	if( moveBy.equals( gleam_point.zero ) ) return;

	const zone = this.fabric.zone;

	return(
		change_set.create(
			'path', this.path.chop.append( 'zone' ),
			'val', zone.add( moveBy ),
			'prev', this.fabric.zone
		)
	);
};


/*
| An dragItems action stopped.
*/
def.static.getDragItemChangePosFs =
	function( )
{
	const action = this.action;

	const moveBy = action.moveBy;

	if( action.moveBy.equals( gleam_point.zero ) ) return;

	const pos = this.fabric.pos;

	return(
		change_set.create(
			'path', this.path.chop.append( 'pos' ),
			'val', pos.add( moveBy ),
			'prev', pos
		)
	);
};


/*
| Returns the change-set for a resizing
| the item, defined by its zone.
*/
def.static.getResizeItemChangeZone =
	function( )
{
/**/if( CHECK )
/**/{
/**/	if( this.positioning !== 'zone' ) throw new Error( );
/**/}

	return(
		change_set.create(
			'path', this.path.chop.append( 'zone' ),
			'val', this.zone,
			'prev', this.fabric.zone
		)
	);
};


/*
| Returns the change-set for a resizing
| the item, defined by pos/fontsize.
*/
def.static.getResizeItemChangePosFs =
	function( )
{
/**/if( CHECK )
/**/{
/**/	if( this.positioning !== 'pos/fontsize' ) throw new Error( );
/**/}

	return(
		change_list.create(
			'list:append',
			change_set.create(
				'path', this.path.chop.append( 'pos' ),
				'val', this.pos,
				'prev', this.fabric.pos
			),
			'list:append',
			change_set.create(
				'path', this.path.chop.append( 'fontsize' ),
				'val', this.fontsize,
				'prev', this.fabric.fontsize
			)
		)
	);
};


/*
| Generic click handler.
|
| Takes care about mutli-selecting item groups by ctrl+click.
|
| Returns true if it handled the click event.
*/
def.proto.ctrlClick =
	function(
		p,      // the point clicked
		shift,  // true if shift key was pressed
		access, // 'r' or 'rw'
		mark    // the mark of the space
	)
{
	if( !this.tShape.within( p ) ) return;

	if( access !== 'rw' ) return false;

	if( !mark )
	{
		root.setUserMark( visual_mark_items.createWithOne( this.path ) );

		return true;
	}

	switch( mark.timtype )
	{
		case visual_mark_items :

			root.setUserMark( mark.togglePath( this.path ) );

			return true;

		case visual_mark_caret :
		case visual_mark_range :

			root.setUserMark(
				visual_mark_items.create(
					'itemPaths', mark.itemPaths.create( 'list:append', this.path )
				)
			);

			return true;
	}
};


/*
| A createRelation action stops.
*/
def.proto.createRelationStop =
	function(
		p
	)
{
	const action = this.action;

/**/if( CHECK )
/**/{
/**/	if( action.timtype !== action_createRelation ) throw new Error( );
/**/}

	if( !this.tZone.within( p ) ) return false;

	root.spawnRelation( root.spaceVisual.get( action.fromItemPath.get( -1 ) ), this );

	return true;
};


/*
| The key of this item.
*/
def.lazy.key =
	function( )
{
	return this.path.get( -1 );
};



/*
| Nofication when the item lost the users mark.
*/
def.proto.markLost = function( ){ };


/*
| The shape in current transform.
*/
def.lazy.tShape =
	function( )
{
	return this.shape.transform( this.transform );
};


/*
| Zone in current transform.
*/
def.lazy.tZone =
	function( )
{
	return this.zone.transform( this.transform );
};


} );
