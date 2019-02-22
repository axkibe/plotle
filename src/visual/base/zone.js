/*
| All items that are positioned by zone.
|
| FUTURE with multilpe inheritance this would be more elegenat.
*/
'use strict';


tim.define( module, ( def ) => {


const change_set = require( '../../change/set' );


/*
| Returns the change-set for a resizing
| the item, defined by its zone.
*/
def.static.getItemChange =
	function( )
{
/**/if( CHECK )
/**/{
/**/	if( this.positioning !== 'zone' ) throw new Error( );
/**/}

	return(
		change_set.create(
			'path', this.path.chop.append( 'zone' ),
			'val', this.zone( ),
			'prev', this.fabric.zone
		)
	);
};


} );
