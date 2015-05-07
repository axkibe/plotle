/*
| Everything there is in a space.
*/


var
	action_createRelation,
	action_itemDrag,
	action_scrolly,
	jion$path,
	result_hover,
	root,
	visual_item,
	visual_mark_item;


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
| A move during an action.
*/
visual_item.dragMove =
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

			if( !this.vZone.within( p ) ) return false;

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
		sbary;

	action = root.action;

	sbary = this.scrollbarY;

	if(
		!action
		&& sbary
		&& sbary.within( p )
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

	if( !this.vSilhoutte.within( p ) )
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
					'toItemPath', jion$path.empty,
					'relationState', 'hadSelect',
					'toPoint', p
				)
		);

		return true;
	}

	// scrolling or dragging
	if( access == 'rw' )
	{
		// also takes focus
		root.create(
			'action',
				action_itemDrag.create(
					'start', this.view.depoint( p ),
					'transItem', this,
					'origin', this
				),
			'mark', visual_mark_item.create( 'path', this.path )
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
visual_item.dragStop =
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

			if( !this.vZone.within( p ) )
			{
				return false;
			}

			root.spawnRelation(
				root.spaceVisual.get( action.fromItemPath.get( -1 ) ),
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
visual_item.pointingHover =
	function(
		p
	)
{
	var
		sbary;

	sbary = this.scrollbarY;

	if( sbary && sbary.within( p ) )
	{
		return(
			result_hover.create(
				'path', this.path,
				'cursor', 'default'
			)
		);
	}

	if( !this.vZone.within( p ) ) return;

	return(
		result_hover.create(
			'path', this.path,
			'cursor', 'default'
		)
	);
};

} )( );
