/*
| Everything there is in a space.
*/
'use strict';


tim.define( module, ( def ) => {


const action_createRelation = require( '../action/createRelation' );

const action_dragItems = require( '../action/dragItems' );

const action_none = require( '../action/none' );

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

	return mark.containsPath( path ) ? mark : undefined;
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
| dragging start.
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

	if( !this.pointWithin( p ) ) return false;

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
				'startZone', this.zone( )
			)
	);

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
| Defaults to doing nothing about it.
*/
def.proto.markLost = function( ){ };


/*
| Returns true if a point is within
| the item.
*/
def.proto.pointWithin =
	function(
		p
	)
{
	return this.tZone.within( p ) && this._tShape( ).within( p );
};


/*
| Zone in current transform.
*/
def.lazy.tZone =
	function( )
{
	return this.zone( ).transform( this.transform );
};


/*
| Generic ctrl click handler.
|
| Takes care about mutli-selecting item groups by ctrl+click.
|
| Returns true if it handled the click event.
*/
def.proto._ctrlClick =
	function(
		p,      // the point clicked
		shift,  // true if shift key was pressed
		mark    // the mark of the space
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 3 ) throw new Error( );
/**/}

	if( this.access !== 'rw' ) return false;

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

		default : return true;
	}
};


/*
| The shape in current transform (lazy default)
*/
def.lazy.__tlShape =
	function( )
{
	return this.shape( ).transform( this.transform );
};


/*
| The shape in current transform.
*/
def.proto._tShape =
	function( )
{
	return this.__tlShape;
};


} );
