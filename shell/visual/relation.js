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
		tag,
		inherit,
		twig,
		path,
		pnw,
		doc
	)
{
	Visual.Label.call(
		this,
		tag,
		twig,
		path,
		pnw,
		doc
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
| Creates a new Relation
*/
Relation.create =
	function(
		// free strings
	)
{
	var
		inherit =
			null,

		twig =
			null,

		path =
			null,

		pnw =
			null,

		doc =
			null,

		fontsize =
			null;

	for(
		var a = 0, aZ = arguments.length;
		a < aZ;
		a += 2
	)
	{
		switch( arguments[ a ] )
		{
			case 'inherit' :

				inherit =
					arguments[ a + 1 ];

				break;

			case 'pnw' :

				pnw =
					arguments[ a + 1 ];

				break;

			case 'twig' :

				twig =
					arguments[ a + 1 ];

				break;

			case 'path' :

				path =
					arguments[ a + 1 ];

				break;

			case 'doc' :

				doc =
					arguments[ a + 1 ];

				break;

			case 'fontsize' :

				fontsize =
					arguments[ a + 1 ];

				break;

			default :

				throw new Error(
					'invalid argument: ' + arguments[ a ]
				);
		}
	}

	if( twig )
	{
		if( CHECK && !path )
		{
			throw new Error(
				'twig needs path'
			);
		}

		if( !fontsize )
		{
			fontsize =
				twig.fontsize;
		}

		if( !doc )
		{
			doc =
				Visual.Doc.create(
					'inherit',
						inherit && inherit.$sub.doc,
					'twig',
						twig.doc,
					'path',
						new Path(
							path,
							'++',
								'doc'
						),
					'fontsize',
						fontsize,
					'flowWidth',
						0
				);
		}

		if( !pnw )
		{
			pnw =
				twig.pnw;
		}
	}

	if( inherit )
	{
		if( !twig )
		{
			twig =
				inherit.twig;
		}

		if( !path )
		{
			path =
				inherit.path;
		}

		if( !fontsize )
		{
			fontsize =
				inherit.fontsize;
		}

		if( !pnw )
		{
			pnw =
				inherit.pnw;
		}

		if( !doc )
		{
			doc =
				inherit.$sub.doc;
		}
	}


	if( !fontsize )
	{
		fontsize =
			doc.fontsize;
	}

	if( zone )
	{
		if( CHECK )
		{
			if( !doc )
			{
				throw new Error(
					'doc missing'
				);
			}

			if( fontsize !== doc.fontsize )
			{
				throw new Error(
					'fontsize !== doc.fontsize: ' +
					fontsize + '!==' +  doc.fontsize
				);
			}
		}

		// resizing is done by fontSizeChange( )
		var
			height =
				doc.getHeight( ),

			dy =
				zone.height - height;

		fontsize =
			Math.max(
				fontsize * ( height + dy ) / height,
				theme.label.minSize
			);

		doc =
			Visual.Doc.create(
				'inherit',
					doc,
				'fontsize',
					fontsize
			);

		pnw =
			zone.pnw;
	}

	// TODO return inherit

	return (
		new Relation(
			'XOXO',
			inherit,
			twig,
			path,
			pnw,
			zone,
			doc
		)
	);
};


/*
| Creates a new Relation by specifing its relates.
*/
Relation.spawn =
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
			theme.relation.spawnOffset
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

	// event listener has spawned the vrel
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
	var
		space =
			shell.$space,

		item1 =
			space.$sub[ this.twig.item1key ],

		item2 =
			space.$sub[ this.twig.item2key ],

		zone =
			this.zone;

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

