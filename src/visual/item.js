/*
| Everything there is in a space.
*/
'use strict';


var
	action_createRelation,
	action_dragItems,
	change_list,
	change_set,
	gleam_point,
	visual_item,
	visual_mark_caret,
	visual_mark_items,
	visual_mark_range;


visual_item = NODE ? module.exports : { };


/*
| Returns the action if an item with 'path' concerns about
| the action.
*/
visual_item.concernsAction =
	function(
		action,
		path
	)
{
	if( !path || !action ) return undefined;

	return action.affects( path ) ? action : undefined;
};


/*
| Returns the action if an item with 'path' concerns about
| the hover.
*/
visual_item.concernsHover =
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
visual_item.concernsMark =
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
visual_item.dragStart =
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

	if( !mark || mark.timtype !== visual_mark_items )
	{
		// also makes the user mark to this item
		const paths =
			tim.pathList.create(
				'list:init', [ this.path ]
			);

		root.create(
			'action',
				action_dragItems.create(
					'startPoint', p.detransform( this.transform ),
					'itemPaths', paths
				),
			'mark',
				visual_mark_items.create( 'itemPaths', paths )
		);
	}
	else
	{
		// this is already part of a (multi) item mark.

		root.create(
			'action',
				action_dragItems.create(
					'startPoint', p.detransform( this.transform ),
					'itemPaths', mark.itemPaths
				)
		);
	}

	return true;
};


/*
| Returns the change-set for a dragging
| the item, defined by its zone.
*/
visual_item.getDragItemChangeZone =
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
visual_item.getDragItemChangePosFs =
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
visual_item.getResizeItemChangeZone =
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
visual_item.getResizeItemChangePosFs =
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
visual_item.createRelationMove =
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
visual_item.ctrlClick =
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
		root.create(
			'mark',
				visual_mark_items.create(
					'itemPaths',
						tim.pathList.create( 'list:init', [ this.path ] )
				)
		);

		return true;
	}

	switch( mark.timtype )
	{
		case visual_mark_items :

			root.create(
				'mark', mark.togglePath( this.path )
			);

			return true;

		case visual_mark_caret :
		case visual_mark_range :

			root.create(
				'mark',
					visual_mark_items.create(
						'itemPaths',
							mark.itemPaths.create(
								'list:append',
								this.path
							)
					)
			);

			return true;
	}
};


/*
| A createRelation action stops.
*/
visual_item.createRelationStop =
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

