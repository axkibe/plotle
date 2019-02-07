/*
| All items that are positioned by zone.
|
| FUTURE with multilpe inheritance this would be more elegenat.
*/
'use strict';


tim.define( module, ( def ) => {


const change_set = require( '../../change/set' );

const gleam_point = require( '../../gleam/point' );


/*
| Returns the change-set for a dragging
| the item, defined by its zone.
*/
def.static.getDragItemChange =
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
| Returns the change-set for a resizing
| the item, defined by its zone.
*/
def.static.getResizeItemChange =
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


} );
