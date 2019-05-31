/*
| One or several items marked ( without caret or range )
*/
'use strict';


tim.define( module, ( def, mark_items ) => {


if( TIM )
{
	def.attributes =
	{
		// paths of the items
		itemPaths : { type : 'tim.js/pathList' }
	};

	def.set = [ '../trace/item' ];
}

const pathList = tim.require( 'tim.js/pathList' );


/*
| Exta checking
*/
def.proto._check =
	function( )
{
/**/if( CHECK )
/**/{
/**/	for( let path of this.itemPaths )
/**/	{
/**/		if( path.isEmpty ) throw new Error( );
/**/
/**/		if( path.get( 0 ) !== 'space' ) throw new Error( );
/**/	}
/**/}
};


/*
| The content the mark puts into the clipboard.
|
| FUTURE write something
*/
def.proto.clipboard = '';


/*
| Creates the list with one item.
*/
def.static.createWithOne =
	function(
		path,
		trace
	)
{
	// also sets the user mark on this item
	const paths = pathList.create( 'list:init', [ path ] );

	const traces = new Set( );

	traces.add( trace );

	return mark_items.create( 'itemPaths', paths, 'set:init', traces );
};


/*
| Item marks do not have a caret.
*/
def.proto.hasCaret = false;


/*
| The widget's path.
*/
def.proto.widgetPath = undefined;



/*
| Combines the items mark (set) with another one.
*/
def.proto.combine =
	function(
		imark
	)
{
/**/if( CHECK )
/**/{
/**/	if( imark.timtype !== mark_items ) throw new Error( );
/**/}

	const itemPaths = this.itemPaths.combine( imark.itemPaths );

	const set = this.clone( );

	for( let t of imark )
	{
		if( !this.contains( t ) ) set.add( t );
	}

	return mark_items.create( 'itemPaths', itemPaths, 'set:init', set );
}


/*
| Returns true if an entity of this mark
| contains 'path'.
*/
def.proto.containsPath =
	function(
		path
	)
{
/**/if( CHECK )
/**/{
/**/	if( path.empty ) throw new Error( );
/**/}

	for( let p of this.itemPaths )
	{
		if( path.subPathOf( p ) ) return true;
	}

	return false;
};


/*
| Returns true if an entity of this mark
| contains 'path'.
*/
def.proto.containsItemTrace =
	function(
		itrace
	)
{

	for( let t of this ) if( t.equals( itrace ) return true;

	return false;
};


/*
| Returns a items-mark with the path added
| when it isn't part of this mark, or the
| path removed when it is.
*/
def.proto.togglePath =
	function(
		path
	)
{
/**/if( CHECK )
/**/{
/**/	if( path.empty ) throw new Error( );
/**/}

	const paths = this.itemPaths;

	for( let a = 0, al = paths.length; a < al; a++ )
	{
		if( path.equals( paths.get( a ) ) )
		{
			return this.create( 'itemPaths', this.itemPaths.create( 'list:remove', a ) );
		}
	}

	return this.create( 'itemPaths', this.itemPaths.create( 'list:append', path ) );
};


} );
