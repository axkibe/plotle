/*
| All items that are positioned by zone.
|
| FUTURE with multilpe inheritance this would be more elegenat.
*/
'use strict';


tim.define( module, ( def ) => {


const change_set = tim.require( '../../change/set' );

const change_list = tim.require( '../../change/list' );


/*
| Returns the change-set for a dragging
| the item, defined by its zone.
*/
def.static.getItemChange =
	function( )
{
	const tfrom = this._from;

	const tto = this._to;

	const ffrom = this.fabric.from;

	const fto = this.fabric.to;

	let changes = [ ];

	if( tfrom.timtype !== ffrom.timtype || !tfrom.equals( ffrom ) )
	{
		changes.push(
			change_set.create(
				'path', this.path.chop.append( 'from' ),
				'val', tfrom,
				'prev', ffrom
			)
		);
	}

	if( tto.timtype !== fto.timtype || !tto.equals( fto ) )
	{
		changes.push(
			change_set.create(
				'path', this.path.chop.append( 'to' ),
				'val', tto,
				'prev', fto
			)
		);
	}

	if( changes.length === 0 ) return;
	if( changes.length === 1 ) return changes[ 0 ];
	return change_list.create( 'list:init', changes );
};


} );
