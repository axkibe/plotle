/*
| A list of visual items.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.list = [ '< ./item-types' ];
}


const gleam_rectGroup = require( '../gleam/rectGroup' );

const pathList = tim.import( 'tim.js', 'src/pathList' );


/*
| Returns the list of paths of the items.
*/
def.lazy.itemPaths =
	function( )
{
	const arr = [ ];

	for( let a = 0, aZ = this.length; a < aZ; a++ )
	{
		arr.push( this.get( a ).path );
	}

	return pathList.create( 'list:init', arr );
};


/*
| Returns the list of zones of the items.
*/
def.lazy.zones =
	function( )
{
	const group = { };

	for( let a = 0, aZ = this.length; a < aZ; a++ )
	{
		const item = this.get( a );

		const key = item.path.get( 2 );

/**/	if( CHECK )
/**/	{
/**/		if( group[ key ] ) throw new Error( );
/**/	}

		group[ key ] = item.zone;
	}

	return gleam_rectGroup.create( 'group:init', group );
};


} );

