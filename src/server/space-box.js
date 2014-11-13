/*
| Holds a space.
|
| FIXME move logic into here.
*/


/*
| Capsule.
*/
( function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		id :
			'server.spaceBox',
		attributes :
			{
				spaceRef :
					{
						comment :
							'reference to the space',
						type :
							'fabric.spaceRef',
					},
				changesDB:
					{
						comment :
							'changes database collection',
						type :
							'Object'
					},
				changes :
					{
						// FIXME this should not be zero based
						// and it should be a changeWrapRay
						comment :
							'changes buffer ( in RAM )',
						type :
							'Object'
					},
				space :
					{
						comment :
							'latest space version',
						type :
							'visual.space'
					},
				seqZ :
					{
						comment :
							'latest sequence number',
						type :
							'Integer'
					}
			},
		node :
			true,
		init :
			[ ]
	};
}


} )( );
