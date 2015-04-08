/*
| A change wrapped for transport.
*/


var
	ccot_changeWrap,
	jools,
	result_changeTree;


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
			'ccot_changeWrap',
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
							'String'
					},
				changeRay :
					{
						comment :
							'change or change ray',
						json :
							true,
						type :
							'ccot_changeRay',
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
							'Number',
						defaultValue :
							undefined
					}
			}
	};
}


if( SERVER )
{
	ccot_changeWrap = require( 'jion' ).this( module );

	jools = require( '../jools/jools' );

	result_changeTree = require( '../result/changeTree' );
}


/*
| Creates an inverted changeWrap.
|
| This one has a distinct change id and no sequence id
*/
ccot_changeWrap.prototype.createInvert =
	function( )
{
	return(
		ccot_changeWrap.create(
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
ccot_changeWrap.prototype.transform =
	function(
		cx
	)
{
	return this.changeRay.transform( cx );
};



/*
| Performes the wrapped change on a tree.
*/
ccot_changeWrap.prototype.changeTree =
	function(
		tree,
		resultModality
	)
{
	var
		result;

	result = this.changeRay.changeTree( tree, resultModality );

	switch( resultModality )
	{
		case 'combined' :

			return(
				result_changeTree.create(
					'reaction', this.create( 'changeRay', result.reaction ),
					'tree', result.tree
				)
			);

		case 'reaction' :

			return this.create( 'changeRay', result );

		case 'tree' :

			return result;
	}
};



}( ) );
