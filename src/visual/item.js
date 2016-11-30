/*
| Everything there is in a space.
*/


var
	action_dragItems,
	change_ray,
	change_set,
	euclid_point,
	jion$pathRay,
	root,
	visual_item,
	visual_mark_items;


/*
| Capsule
*/
( function( ) {
'use strict';


visual_item = NODE ? module.exports : { };


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
	var
		action,
		mark,
		paths;

	action = this.action;

	if( !this.tSilhoutte.within( p ) ) return false;

	switch( action && action.reflect )
	{
		case 'action_createRelation' :

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

	mark = this.mark;

	if( !mark || mark.reflect !== 'visual_mark_items' )
	{
		// also makes the user mark to this item
		paths =
			jion$pathRay.create(
				'ray:init', [ this.path ]
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
	var
		action,
		moveBy,
		zone;

	action = this.action;

	moveBy = action.moveBy;

	if( moveBy.equals( euclid_point.zero ) )
	{
		return;
	}

	zone = this.fabric.zone;

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
visual_item.getDragItemChangePnwFs =
	function( )
{
	var
		action,
		moveBy,
		pnw;

	action = this.action;

	moveBy = action.moveBy;

	if( action.moveBy.equals( euclid_point.zero ) )
	{
		return;
	}

	pnw = this.fabric.pnw;

	return(
		change_set.create(
			'path', this.path.chop.append( 'pnw' ),
			'val', pnw.add( moveBy ),
			'prev', pnw
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
	var
		action;

	action = this.action;

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
| the item, defined by pnw/fontsize.
*/
visual_item.getResizeItemChangePnwFs =
	function( )
{
	var
		action;

	action = this.action;

/**/if( CHECK )
/**/{
/**/	if( this.positioning !== 'pnw/fontsize' ) throw new Error( );
/**/}

	return(
		change_ray.create(
			'ray:append',
			change_set.create(
				'path', this.path.chop.append( 'pnw' ),
				'val', this.pnw,
				'prev', this.fabric.pnw
			),
			'ray:append',
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
	if( !this._glintBackground.within( p ) ) return;

	if( access !== 'rw' ) return false;

	if( !mark )
	{
		root.create(
			'mark',
				visual_mark_items.create(
					'itemPaths',
						jion$pathRay.create( 'ray:init', [ this.path ] )
				)
		);

		return true;
	}

	switch( mark.reflect )
	{
		case 'visual_mark_items' :

			root.create(
				'mark', mark.togglePath( this.path )
			);

			return true;

		case 'visual_mark_caret' :
		case 'visual_mark_range' :

			root.create(
				'mark',
					visual_mark_items.create(
						'itemPaths',
							mark.itemPaths.create(
								'ray:append',
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
	var
		action;

	action = this.action;

/**/if( CHECK )
/**/{
/**/	if( action.reflect !== 'action_createRelation' ) throw new Error( );
/**/}

	if( !this.tZone.within( p ) ) return false;

	root.spawnRelation(
		root.spaceVisual.get( action.fromItemPath.get( -1 ) ),
		this
	);

	return true;
};


} )( );
