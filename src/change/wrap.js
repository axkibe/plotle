/*
| A change wrapped for transport.
*/


var
	change_wrap,
	jion,
	session_uid;


/*
| Capsule
*/
( function( ) {
"use strict";


/*
| The jion definition.
*/
if( JION )
{
	return{
		id : 'change_wrap',
		attributes :
		{
			cid :
			{
				comment : 'change id',
				json : true,
					// FIXME it accepted 'true',
					// jion validator shouldn't
				type : 'string'
			},
			changeRay :
			{
				comment : 'change or change ray',
				json : true,
				type : 'change_ray'
			},
			seq :
			{
				comment : 'sequence number',
				json : true,
				type : [ 'undefined', 'number' ]
			}
		}
	};
}


var
	prototype;


if( NODE )
{
	jion = require( 'jion' );

	change_wrap = jion.this( module, 'source' );
}


prototype = change_wrap.prototype;


/*
| Creates an inverted changeWrap.
|
| This one has a distinct change id and no sequence id yet
*/
prototype.createInvert =
	function( )
{
	return(
		change_wrap.create(
			'cid', session_uid( ),
			'changeRay', this.changeRay.invert
		)
	);
};


/*
| Transform cx on this wrapped change.
|
| cx can be a change, changeRay, changeWrap or changeWrapRay.
*/
prototype.transform =
	function(
		cx
	)
{
	return this.changeRay.transform( cx );
};



/*
| Performes the wrapped change on a tree.
*/
prototype.changeTree =
	function(
		tree
	)
{
	return this.changeRay.changeTree( tree );
};



}( ) );
