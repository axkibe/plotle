/*
| Everything there is in a space.
*/


var
	action_createRelation,
	action_itemDrag,
	action_scrolly,
	fabric_item,
	fabric_relation,
	jion_path,
	jools,
	mark_item,
	result_hover,
	root;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| Node includes.
*/
if( SERVER )
{
	fabric_item = module.exports;

	jools = require( '../jools/jools' );
}
else
{
	fabric_item = { };
}


/*
| Returns the mark if an item with 'path' concerns about
| the mark.
*/
fabric_item.concernsMark =
	function(
		mark,
		path
	)
{

/**/if( CHECK )
/**/{
/**/	if( path && path.isEmpty )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if( !path || !mark )
	{
		return undefined;
	}

	return(
		mark.containsPath( path )
		? mark
		: undefined
	);
};


/*
| A move during an action.
*/
fabric_item.dragMove =
	function(
		p
		// shift,
		// ctrl
	)
{
	var
		action,
		dy,
		sbary,
		spos,
		start,
		view;

	action = root.action;

	view = this.view;

	switch( action.reflect )
	{
		case 'action_createRelation' :

			if( !this.zone.within( view, p ) )
			{
				return false;
			}

			root.create(
				'action', action.create( 'toItemPath', this.path )
			);

			return true;

		case 'action_scrolly' :

			start = action.start,

			dy = ( p.y - start.y ) / view.zoom,

			sbary = this.scrollbarY,

			spos = action.startPos + sbary.scale( dy );

			root.setPath(
				this.path.append( 'scrolly' ),
				spos
			);

			return true;

		default :

			throw new Error( );
	}

	return true;
};



/*
| Handles a potential dragStart event for this item.
*/
fabric_item.dragStart =
	function(
		p,
		shift,
		ctrl,
		access
	)
{
	var
		action,
		sbary,
		view;

	action = root.action;

	sbary = this.scrollbarY;

	view = this.view;

	if(
		!action
		&& sbary
		&& sbary.within( view, p )
	)
	{
		root.create(
			'action',
				action_scrolly.create(
					'itemPath', this.path,
					'start', p,
					'startPos', sbary.pos
				)
		);

		return true;
	}

	if( !this.silhoutte.within( view, p ) )
	{
		return false;
	}

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

	if( ctrl && access == 'rw' )
	{
		// relation binding

		root.create(
			'action',
				action_createRelation.create(
					'fromItemPath', this.path,
					'toItemPath', jion_path.empty,
					'relationState', 'hadSelect',
					'toPoint', p
				)
		);

		return true;
	}

	// scrolling or dragging
	if( access == 'rw' )
	{
		// take focus
		if( root.space.focusedItem( ) !== this )
		{
			root.create( 'mark', mark_item.create( 'path', this.path ) );
		}

		root.create(
			'action',
				action_itemDrag.create(
					'start', view.depoint( p ),
					'transItem', this,
					'origin', this
				)
		);

		return true;
	}
	else
	{
		return false;
	}
};


/*
| A draggin action regarding this item stopped.
*/
fabric_item.dragStop =
	function(
		p
	)
{
	var
		action;

	action = root.action;

	switch( action.reflect )
	{
		case 'action_createRelation' :

			if( !this.zone.within( this.view, p ) )
			{
				return false;
			}

			fabric_relation.spawn(
				root.space.getItem(
					action.fromItemPath.get( -1 )
				),
				this
			);

			return true;

		default :

			return false;
	}
};


/*
| User is hovering their pointing device over something.
*/
fabric_item.pointingHover =
	function(
		p
	)
{
	var
		sbary,
		view;

	sbary = this.scrollbarY;

	view = this.view;

	if( sbary && sbary.within( view, p ) )
	{
		return(
			result_hover.create(
				'path', this.path,
				'cursor', 'default'
			)
		);
	}

	if( !this.zone.within( view, p ) )
	{
		return;
	}

	return(
		result_hover.create(
			'path', this.path,
			'cursor', 'default'
		)
	);
};


} )( );
