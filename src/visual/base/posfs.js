/*
| All items that are positioned by zone.
|
| FUTURE with multilpe inheritance this would be more elegenat.
*/
'use strict';


tim.define( module, ( def ) => {


const change_list = tim.require( '../../change/list' );

const change_set = tim.require( '../../change/set' );


/*
| Returns the change-set for a resizing
| the item, defined by pos/fontsize.
*/
def.static.getItemChange =
	function( )
{
/**/if( CHECK )
/**/{
/**/	if( this.positioning !== 'pos/fontsize' ) throw new Error( );
/**/}

	const changes = [ ];

	const tpos = this.pos;
	const fpos = this.fabric.pos;

	const tfs = this.fontsize;
	const ffs = this.fabric.fontsize;

	if( !tpos.equals( fpos ) )
	{
		changes.push(
			change_set.create(
				'path', this.path.chop.append( 'pos' ),
				'val', this.pos,
				'prev', this.fabric.pos
			)
		);
	}

	if( tfs !== ffs )
	{
		changes.push(
			change_set.create(
				'path', this.path.chop.append( 'fontsize' ),
				'val', this.fontsize,
				'prev', this.fabric.fontsize
			)
		);
	}

	if( changes.length === 0 ) return;
	if( changes.length === 1 ) return changes[ 0 ];
	return( change_list.create( 'list:init', changes ) );
};


} );
