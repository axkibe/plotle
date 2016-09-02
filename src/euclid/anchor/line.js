/*
| A line.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'euclid_anchor_line',
		attributes :
		{
			p1 :
			{
				comment : 'first point',
				type : 'euclid_anchor_point'
			},
			p2 :
			{
				comment : 'second point',
				type : 'euclid_anchor_point'
			}
		}
	};
}


var
	euclid_anchor_line;


/*
| Capsule
*/
(function(){
'use strict';


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


var
	prototype;

prototype = euclid_anchor_line.prototype;


/*
| Computes the point to an euclid one.
|
| FIXME make area part of view
*/
prototype.compute =
	function(
		view
	)
{

/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 1 ) throw new Error( );
/**/}

	return(
		euclid_anchor_line.create(
			'pnw', this.pnw.compute( view ),
			'pse', this.pse.compute( view )
		)
	);
};


} )( );
