/*
| One or several items marked ( without caret or range )
*/
'use strict';


tim.define( module, 'visual_mark_items', ( def, visual_mark_items ) => {


const change_mark_node = require( '../../change/mark/node' );


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		itemPaths :
		{
			// paths of the items
			type : 'tim$pathList'
		}
	};


	def.init = [ ];
}


/*
| Initializer.
*/
def.func._init =
	function( )
{

/**/if( CHECK )
/**/{
/**/	const paths = this.itemPaths;
/**/
/**/	for( let c = 0, cZ = paths.length; c < cZ; c++ )
/**/	{
/**/		if( paths.get( c ).isEmpty ) throw new Error( );
/**/
/**/		if( paths.get( c ).get( 0 ) !== 'spaceVisual' ) throw new Error( );
/**/	}
/**/}
};


/*
| The change engine's nodemark.
*/
def.lazyFuncInt._changeMarkNode =
	function( i )
{
	return change_mark_node.create( 'path', this.itemPaths.get( i ).chop );
};


/*:::::::::::.
:: Functions
'::::::::::::*/


/*
| Recreates this mark with a change set applied.
*/
def.func.createTransformed =
	function(
		changes
	)
{
	const paths = this.itemPaths;

	const arr = [ ];

	for( let a = 0, aZ = paths.length; a < aZ; a++ )
	{
		const tm = changes.transform( this._changeMarkNode( a ) );

		if( tm )
		{
			arr.push( tm.path.prepend( 'spaceVisual' ) );
		}
	}

	if( arr.length === 0 ) return undefined;

	return(
		this.create(
			'itemPaths', this.itemPaths.create( 'list:init', arr )
		)
	);
};


/*
| Item marks do not have a caret.
*/
def.func.hasCaret = false;


/*
| The widget's path.
*/
def.func.widgetPath = undefined;


/*
| The content the mark puts into the clipboard.
|
| FUTURE write something
*/
def.func.clipboard = '';


/*
| Returns true if an entity of this mark
| contains 'path'.
*/
def.func.containsPath =
	function(
		path
	)
{
/**/if( CHECK )
/**/{
/**/	if( path.length === 0 )	throw new Error( );
/**/}

	const paths = this.itemPaths;

	for( let a = 0, aZ = paths.length; a < aZ; a++ )
	{
		if( path.subPathOf( paths.get( a ) ) ) return true;
	}

	return false;
};


/*
| Returns a items-mark with the path added
| when it isn't part of this mark, or the
| path removed when it is.
*/
def.func.togglePath =
	function(
		path
	)
{
/**/if( CHECK )
/**/{
/**/	if( path.empty ) throw new Error( );
/**/}

	const paths = this.itemPaths;

	for( let a = 0, aZ = paths.length; a < aZ; a++ )
	{
		if( path.subPathOf( paths.get( a ) ) )
		{
			return(
				this.create(
					'itemPaths',
						this.itemPaths.create( 'list:remove', a )
				)
			);
		}
	}

	return(
		this.create(
			'itemPaths',
				this.itemPaths.create( 'list:append', path )
		)
	);
};


/*
| Returns true if an entity of this mark
| contains 'path'.
*/
def.func.containsPath =
	function(
		path
	)
{
/**/if( CHECK )
/**/{
/**/	if( path.empty ) throw new Error( );
/**/}

	const paths = this.itemPaths;

	for( let a = 0, aZ = paths.length; a < aZ; a++ )
	{
		if( path.subPathOf( paths.get( a ) ) ) return true;
	}

	return false;
};


} );
