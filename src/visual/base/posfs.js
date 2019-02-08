/*
| All items that are positioned by zone.
|
| FUTURE with multilpe inheritance this would be more elegenat.
*/
'use strict';


tim.define( module, ( def ) => {


const change_list = require( '../../change/list' );

const change_set = require( '../../change/set' );

const gleam_point = require( '../../gleam/point' );


/*
| An dragItems action stopped.
*/
def.static.getDragItemChange =
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
| the item, defined by pos/fontsize.
*/
def.static.getResizeItemChange =
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


} );
