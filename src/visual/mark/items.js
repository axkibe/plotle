/*
| One or several items marked ( without caret or range )
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'visual_mark_items',
		attributes :
		{
			itemPaths :
			{
				comment : 'paths of the items',
				type : 'jion$pathRay'
			}
		}
	};
}


var
	change_mark_node,
	jion,
	visual_mark_items;


/*
| Capsule
*/
(function() {
'use strict';


var
	prototype;


if( NODE )
{
	jion = require( 'jion' );

	visual_mark_items = jion.this( module, 'source' );
}


prototype = visual_mark_items.prototype;


/*
| Initializer.
*/
prototype._init =
	function( )
{

/**/if( CHECK )
/**/{
/**/	var c, cZ, paths;
/**/
/**/	paths = this.itemPaths;
/**/
/**/	if( paths.length !== 1 ) throw new Error( ); // TODO
/**/
/**/	for( c = 0, cZ = paths.length; c < cZ; c++ )
/**/	{
/**/		if( paths.get( c ).isEmpty ) throw new Error( );
/**/
/**/		if( paths.get( c ).get( 0 ) !== 'spaceVisual' ) throw new Error( );
/**/	}
/**/}
};


/*
| Recreates this mark with a change set applied.
*/
prototype.createTransformed =
	function(
		changes
	)
{
	var
		a,
		arr,
		arrZ,
		aZ,
		path,
		paths,
		tm;

	paths = this.itemPaths;

	arr = [ ];

	arrZ = 0;

	for( a = 0, aZ = paths.length; a < aZ; a++ )
	{
		path = paths.get( a );

		tm = changes.transform( this._changeMarkNode( a ) );

		if( tm )
		{
			arr[ arrZ++ ] = tm.path.prepend( 'spaceVisual' );
		}
	}

	if( arrZ === 0 ) return undefined;

	return(
		this.create(
			'itemPaths', this.itemPaths.create( 'ray:init', arr )
		)
	);
};


/*
| The change engine's nodemark.
*/
jion.lazyFunctionInteger(
	prototype,
	'_changeMarkNode',
	function( i )
{
	return change_mark_node.create( 'path', this.itemPaths.get( i ).chop );
}
);


/*
| Item marks do not have a caret.
*/
prototype.hasCaret = false;


/*
| The widget's path.
*/
prototype.widgetPath = undefined;


/*
| The content the mark puts into the clipboard.
|
| FUTURE write something
*/
prototype.clipboard = '';


/*
| Returns true if an entity of this mark
| contains 'path'.
*/
prototype.containsPath =
	function(
		path
	)
{
	var
		a,
		aZ,
		paths;

/**/if( CHECK )
/**/{
/**/	if( path.length === 0 )	throw new Error( );
/**/}

	paths = this.itemPaths;

	for( a = 0, aZ = paths.length; a < aZ; a++ )
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
prototype.togglePath =
	function(
		path
	)
{
	var
		a,
		aZ,
		paths;

/**/if( CHECK )
/**/{
/**/	if( path.empty ) throw new Error( );
/**/}

	paths = this.itemPaths;

	for( a = 0, aZ = paths.length; a < aZ; a++ )
	{
		if( path.subPathOf( paths.get( a ) ) )
		{
			return(
				this.create(
					'itemPaths',
						this.itemPaths.create( 'ray:remove', a )
				)
			);
		}
	}

	return(
		this.create(
			'itemPaths',
				this.itemPaths.create( 'ray:append', path )
		)
	);
};


jion.lazyValue( prototype, 'paths', function() { throw new Error( ); } ); // TODO


/*
| Returns true if an entity of this mark
| contains 'path'.
*/
prototype.containsPath =
	function(
		path
	)
{
	var
		a,
		aZ,
		paths;

/**/if( CHECK )
/**/{
/**/	if( path.empty ) throw new Error( );
/**/}

	paths = this.itemPaths;

	for( a = 0, aZ = paths.length; a < aZ; a++ )
	{
		if( path.subPathOf( paths.get( a ) ) ) return true;
	}

	return false;
};

} )( );
