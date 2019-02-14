/*
| All items that are positioned by zone.
|
| FUTURE with multilpe inheritance this would be more elegenat.
*/
'use strict';


tim.define( module, ( def ) => {


const change_set = require( '../../change/set' );

const gleam_point = require( '../../gleam/point' );

const change_list = require( '../../change/list' );


/*
| Returns the change-set for a dragging
| the item, defined by its zone.
*/
def.static.getItemChange =
	function( )
{
	const action = this.action;

	const moveBy = action.moveBy;

	if( moveBy.equals( gleam_point.zero ) ) return;

	const tfrom = this.from;

	const tto = this.to;

	const ffrom = this.fabric.from;

	const fto = this.fabric.to;

	let changes = [ ];

	if( tfrom.timtype !== ffrom.timtype || !tfrom.equals( ffrom ) )
	{
		changes.push(
			change_set.create(
				'path', this.path.chop.append( 'from' ),
				'val', this.from,
				'prev', ffrom
			)
		);
	}

	if( tto.timtype !== fto.timtype || !tto.equals( fto ) )
	{
		changes.push(
			change_set.create(
				'path', this.path.chop.append( 'to' ),
				'val', this.to,
				'prev', fto
			)
		);
	}

	if( changes.length === 0 ) return;
	if( changes.length === 1 ) return changes[ 0 ];
	return change_list.create( 'list:init', changes );
};


} );
