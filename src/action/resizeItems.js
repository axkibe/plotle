/*
| The user is resizing an item.
*/
'use strict';


tim.define( module, ( def ) => {


def.extend = './action';


if( TIM )
{
	def.attributes =
	{
		// the paths of the items to drag
		itemPaths: { type : [ 'undefined', 'tim.js/src/pathList' ] },

		// mouseDown point on drag creation
		startPoint : { type : '../gleam/point' },

		// base the resize to this point
		pBase : { type : [ 'undefined', '../gleam/point' ] },

		// if true resize proportionally
		// scaleX must be === scaleY
		proportional : { type : [ 'undefined', 'boolean' ] },

		// resize to this direction
		resizeDir : { type : [ '< ../compass/dir-types' ] },

		// scale x by this factor
		scaleX : { type : [ 'undefined', 'number' ] },

		// scale y by this factor
		scaleY : { type : [ 'undefined', 'number' ] },

		// the zones as the resize started
		startZone : { type : '../gleam/rect' },

		// the zones as the resize started
		startZones : { type : '../gleam/rectGroup' },
	};
}


/*
| Returns true if an entity with path is affected by this action.
*/
def.proto.affectsItem =
	function(
		item
	)
{
	const path = item.path;

	const paths = this.itemPaths;

	for( let a = 0, pLen = paths.length; a < pLen; a++ )
	{
		const pa = paths.get( a );

		if( pa.equals( path ) ) return true;
	}

	return false;
};


/*
| 'Normal' button ought to be down during this action.
*/
def.proto.normalButtonDown = true;


/*
| Returns a zone affted by this action.
| FIXME put into use.
*/
def.proto.affectZone =
	function(
		zone,      // the unaffected zone
		itemKey,   // the key of the item to be affected
		minSize    // minimum size of the zone
	)
{
	const pBase = this.pBase;

	zone = this.startZones.get( itemKey );

	if( !pBase ) return zone;

	zone = zone.baseScaleAction( this, 0, 0 );

	if( minSize ) zone = zone.ensureMinSize( minSize );

	return zone;
};


} );

