/*
| A change wrapped for transport.
*/


var
	change_wrap,
	jools;


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
	return {
		id :
			'change_wrap',
		attributes :
			{
				cid :
					{
						comment :
							'change id',
						json :
							true,
							// FIXME it accepted 'true',
							// jion validator shouldn't
						type :
							'string'
					},
				changeRay :
					{
						comment :
							'change or change ray',
						json :
							true,
						type :
							'change_ray',
						allowsNull :
							true
							// in case of transformation the change
							// can evaporate, the changeWrap needs to
							// be kept alive though so the client
							// can be notified of its change to
							// have arrived, albeit it had no effect.
					},
				seq :
					{
						comment :
							'sequence number',
						json :
							true,
						type :
							'number',
						defaultValue :
							'undefined'
					}
			}
	};
}


var
	prototype;


if( SERVER )
{
	change_wrap = require( 'jion' ).this( module );

	jools = require( '../jools/jools' );
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
			'cid', jools.uid( ),
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
