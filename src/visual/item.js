/*
| Everything there is in a space.
*/
'use strict';


tim.define( module, ( def ) => {


const action_createRelation = require( '../action/createRelation' );

const action_dragItems = require( '../action/dragItems' );

const change_list = require( '../change/list' );

const change_set = require( '../change/set' );

const gleam_point = require( '../gleam/point' );

const pathList = tim.import( 'tim.js', 'pathList' );

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
	if( !item || !item.path || !action ) return undefined;

	return action.affectsItem( item ) ? action : undefined;
};


/*
| Returns the action if an item with 'path' concerns about
| the hover.
*/
def.static.concernsHover =
	function(
		hover,
		path
	)
{
	if( !path || !hover ) return undefined;

	return path.subPathOf( hover ) ? hover : undefined;
};


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
	function(
		p,
		shift,
		ctrl,
		access
	)
{
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
	if( access !== 'rw' ) return false;

	const mark = this.mark;

	let paths;

	if( !mark || mark.timtype !== visual_mark_items )
	{
		// also makes the user mark to this item
		paths = pathList.create( 'list:init', [ this.path ] );

		root.setUserMark( visual_mark_items.create( 'itemPaths', paths ) );
	}
	else
	{
		paths = mark.itemPaths;
	}

	root.create(
		'action',
			action_dragItems.create(
				'moveBy', gleam_point.zero,
				'itemPaths', paths,
				'startPoint', p.detransform( this.transform )
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
| A createRelation action moves.
*/
def.static.createRelationMove =
	function(
		p,
		action
	)
{
	if( !this.tZone.within( p ) ) return;

	root.create(
		'action', action.create( 'toItemPath', this.path )
	);

	return true;
};


/*
| Generic click handler.
|
| Takes care about mutli-selecting item groups by ctrl+click.
|
| Returns true if it handled the click event.
*/
def.static.ctrlClick =
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
		root.setUserMark(
			visual_mark_items.create(
				'itemPaths', pathList.create( 'list:init', [ this.path ] )
			)
		);

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
def.static.createRelationStop =
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

	root.spawnRelation(
		root.spaceVisual.get( action.fromItemPath.get( -1 ) ),
		this
	);

	return true;
};


} );
