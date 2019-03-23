/*
| A set of items.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.set = [ '< ./item-types' ];
}


const gleam_rectGroup = tim.require( '../gleam/rectGroup' );

const tim_path_list = tim.require( 'tim.js/pathList' );


/*
| Returns the list of paths of the items.
| FIXME make it a set.
*/
def.lazy.itemPaths =
	function( )
{
	const arr = [ ];

	const it = this.iterator( );

	for( let i = it.next( ); !i.done; i = it.next( ) )
	{
		arr.push( i.value.path );
	}

	return tim_path_list.create( 'list:init', arr );
};


/*
| Returns the list of zones of the items.
| FIXME make a set.
*/
def.lazy.zones =
	function( )
{
	const group = { };

	const it = this.iterator( );

	for( let i = it.next( ); !i.done; i = it.next( ) )
	{
		const item = i.value;

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
