/*
| The user is dragging an item.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// the paths of the items to drag
		itemPaths : { type : [ 'undefined', 'tim.js/src/pathList' ] },

		// drags the items by this x/y
		moveBy : { type : '../gleam/point' },

		// the zone of items when started
		// (used for snapping)
		startZone : { type : '../gleam/rect' },

		// mouse down point on drag creation
		startPoint : { type : '../gleam/point' },
	};
}


/**
*** Exta checking
***/
/**/if( CHECK )
/**/{
/**/	def.func._check =
/**/		function( )
/**/	{
/**/		const paths = this.itemPaths;
/**/
/**/		for( let c = 0, cZ = paths.length; c < cZ; c++ )
/**/		{
/**/			if( paths.get( c ).isEmpty ) throw new Error( );
/**/
/**/			if( paths.get( c ).get( 0 ) !== 'spaceVisual' ) throw new Error( );
/**/		}
/**/	};
/**/}


/*
| Returns true if an entity with path is affected by this action.
*/
def.func.affectsItem =
	function(
		item
	)
{
	const paths = this.itemPaths;

	for( let a = 0, pLen = paths.length; a < pLen; a++ )
	{
		const pa = paths.get( a );

		if( pa.equals( item.path ) ) return true;
	}

	return false;
};


/*
| 'Normal' button ought to be down during this action.
*/
def.func.normalButtonDown = true;


} );

