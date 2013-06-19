/*
| Relates two items (including other relations)
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var Visual;
Visual =
	Visual || { };


/*
| Imports
*/
var Euclid;
var Jools;
var shell;
var theme;


/*
| Capsule
*/
( function( ) {
'use strict';

if( typeof( window ) === 'undefined' )
{
	throw new Error( 'this code needs a browser!' );
}


/*
| Constructor.
*/
var Relation =
Visual.Relation =
	function(
		twig,
		path
	)
{
	Visual.Label.call(
		this,
		'twig',
		twig,
		path
	);
};

Jools.subclass(
	Relation,
	Visual.Label
);


/*
| Default margin for all relations.
*/
Relation.imargin =
	new Euclid.Margin(
		theme.relation.imargin
	);


/*
| Creates a new Relation by specifing its relates.
*/
Relation.create =
	function(
		space,
		item1,
		item2
	)
{
	var cline =
		Euclid.Line.connect(
			item1.getSilhoutte( item1.getZone( ) ),
			null,
			item2.getSilhoutte( item2.getZone( ) ),
			null
		);

	var pnw =
		cline.pc.sub(
			theme.relation.createOffset
		);

	var key =
		shell.peer.newRelation(
			space.spaceUser,
			space.spaceTag,
			pnw,
			'relates to',
			20,
			item1.key,
			item2.key
		);

	// event listener has created the vrel
	space.$sub[ key ].grepFocus( space );
};


/*
| Draws the relation on the fabric.
*/
Relation.prototype.draw =
	function(
		fabric,
		caret,
		view
	)
{
	var space =
		shell.$space;

	var item1 =
		space.$sub[ this.twig.item1key ];

	var item2 =
		space.$sub[ this.twig.item2key ];

	var zone =
		this.getZone( );

	if( item1 )
	{
		var l1 =
			Euclid.Line.connect(
				item1.getSilhoutte( item1.getZone( ) ),
				'normal',
				zone,
				'normal'
			);

		fabric.paint(
			theme.relation.style,
			l1,
			'sketch',
			view
		);
	}

	if( item2 )
	{
		var l2 =
			Euclid.Line.connect(
				zone,
				'normal',
				item2.getSilhoutte(
					item2.getZone( )
				),
				'arrow'
			);

		fabric.paint(
			theme.relation.style,
			l2,
			'sketch',
			view
		);
	}

	Visual.Label.prototype.draw.call(
		this,
		fabric,
		caret,
		view
	);
};

} )( );

