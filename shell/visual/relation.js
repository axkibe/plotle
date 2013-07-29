/*
| Relates two items (including other relations)
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Visual;

Visual =
	Visual || { };


/*
| Imports
*/
var
	Euclid,
	Jools,
	Path,
	shell,
	theme;


/*
| Capsule
*/
( function( ) {
'use strict';

if( typeof( window ) === 'undefined' )
{
	throw new Error(
		'this code needs a browser!'
	);
}


/*
| Constructor.
*/
var Relation =
Visual.Relation =
	function(
		tag,
		tree,
		path,
		pnw,
		fontsize,
		doc,
		item1key,
		item2key
	)
{
	Visual.Label.call(
		this,
		tag,
		tree,
		path,
		pnw,
		fontsize,
		doc
	);

	this.item1key =
		item1key;

	this.item2key =
		item2key;
};


/*
| Relations extend labels.
*/
Jools.subclass(
	Relation,
	Visual.Label
);


/*
| Self referencing creator.
*/
Relation.prototype.creator =
	Relation;

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

		tree =
			null,

		path =
			null,

		pnw =
			null,

		doc =
			null,

		fontsize =
			null,

		item1key =
			null,

		item2key =
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

			case 'tree' :

				tree =
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

			case 'item1key ' :

				item1key =
					arguments[ a + 1 ];

				break;

			case 'item2key' :

				item2key =
					arguments[ a + 1 ];

				break;

			default :

				throw new Error(
					'invalid argument: ' + arguments[ a ]
				);
		}
	}

	if( tree )
	{
		if( CHECK && !path )
		{
			throw new Error(
				'tree needs path'
			);
		}

		if( fontsize === null )
		{
			fontsize =
				tree.twig.fontsize;
		}

		if( pnw === null )
		{
			pnw =
				tree.twig.pnw;
		}

		if( item1key === null )
		{
			item1key =
				tree.twig.item1key;
		}

		if( item2key === null )
		{
			item2key =
				tree.twig.item2key;
		}
	}

	if( inherit )
	{
		if( tree === null )
		{
			tree =
				inherit.tree;
		}

		if( path === null )
		{
			path =
				inherit.path;
		}

		if( fontsize === null )
		{
			fontsize =
				inherit.fontsize;
		}

		if( pnw === null )
		{
			pnw =
				inherit.pnw;
		}

		if( doc === null )
		{
			doc =
				inherit.$sub.doc;
		}

		if( item1key === null )
		{
			item1key =
				inherit.item1key;
		}

		if( item2key === null )
		{
			item2key =
				inherit.item2key;
		}
	}

	doc =
		Visual.Doc.create(
			'inherit',
				doc,
			'tree',
				tree && tree.twig.doc,
			'path',
				inherit ?
					inherit.$sub.doc.path
					:
					new Path(
						path,
						'++',
							'doc'
					),
			'fontsize',
				fontsize,
			'flowWidth',
				0,
			'paraSep',
				0
		);

	return (
		new Relation(
			'XOXO',
			tree,
			path,
			pnw,
			fontsize,
			doc,
			item1key,
			item2key
		)
	);
};


/*
| Creates a new Relation by specifing its relates.
*/
Relation.spawn =
	function(
		item1,
		item2
	)
{
	var
		cline =
			Euclid.Line.connect(
				item1.silhoutte,
				null,
				item2.silhoutte,
				null
			),

		pnw =
			cline.pc.sub(
				theme.relation.spawnOffset
			),

		result =
			shell.peer.newRelation(
				shell.space.spaceUser,
				shell.space.spaceTag,
				pnw,
				'relates to',
				20,
				item1.key,
				item2.key
			),

		key =
			result.chgX.trg.path.get( -1 );

	// event listener has spawned the vrel
	shell.space.$sub[ key ].grepFocus( );
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
			space.getItem( this.item1key ),

		item2 =
			space.getItem( this.item2key ),

		zone =
			this.zone;

	if( item1 )
	{
		var l1 =
			Euclid.Line.connect(
				item1.silhoutte,
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
				item2.silhoutte,
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

