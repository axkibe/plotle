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
	Mark,
	shell,
	theme;


/*
| Capsule
*/
( function( ) {
'use strict';

if( CHECK && typeof( window ) === 'undefined' )
{
	throw new Error(
		'this code needs a browser!'
	);
}


var
	_tag =
		'LABEL-30268594';

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
		item2key,
		mark
	)
{
	Visual.Label.call(
		this,
		tag,
		tree,
		path,
		pnw,
		fontsize,
		doc,
		mark
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
| Reflection.
*/
Relation.prototype.reflect =
	'Relation';


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
		doc =
			null,

		fontsize =
			null,

		inherit =
			null,

		item1key =
			null,

		item2key =
			null,

		mark =
			null,

		path =
			null,

		pnw =
			null,

		tree =
			null;


	for(
		var a = 0, aZ = arguments.length;
		a < aZ;
		a += 2
	)
	{
		switch( arguments[ a ] )
		{
			case 'doc' :

				doc =
					arguments[ a + 1 ];

				break;

			case 'fontsize' :

				fontsize =
					arguments[ a + 1 ];

				break;

			case 'hover' :

				// ignored

				break;

			case 'inherit' :

				inherit =
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

			case 'mark' :

				mark =
					arguments[ a + 1 ];

				break;

			case 'path' :

				path =
					arguments[ a + 1 ];

				break;

			case 'pnw' :

				pnw =
					arguments[ a + 1 ];

				break;

			case 'traitSet' :

				// FIXME ignoring

				break;

			case 'tree' :

				tree =
					arguments[ a + 1 ];

				break;

			case 'view' :

				// ignore

				break;

			default :

				throw new Error(
					'invalid argument: ' + arguments[ a ]
				);
		}
	}

	if( inherit )
	{
		if( !path )
		{
			path =
				inherit.path;
		}
	}

	if( mark && mark.reflect !== 'Vacant' )
	{

/**/	if( CHECK )
/**/	{
/**/		if( !path )
/**/		{
/**/			throw new Error(
/**/				'mark needs path'
/**/			);
/**/		}
/**/	}

		mark =
			Visual.Item.concernsMark(
				mark,
				path
			);
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

		if( pnw === null )
		{
			pnw =
				tree.twig.pnw;
		}

	}

	if( inherit )
	{
		if( doc === null )
		{
			doc =
				inherit.sub.doc;
		}

		if( fontsize === null )
		{
			fontsize =
				inherit.fontsize;
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

		if( !mark )
		{
			mark =
				inherit.mark;
		}

		if( pnw === null )
		{
			pnw =
				inherit.pnw;
		}

		if( tree === null )
		{
			tree =
				inherit.tree;
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
					inherit.sub.doc.path
					:
					(
						path
						&&
						path.append( 'doc' )
					),
			'fontsize',
				fontsize,
			'flowWidth',
				0,
			'paraSep',
				Math.round( fontsize / 20 ),
			'mark',
				mark
		);

	// FIXME return inherit

	return (
		new Relation(
			_tag,
			tree,
			path,
			pnw,
			fontsize,
			doc,
			item1key,
			item2key,
			mark
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


	shell.setMark(
		Mark.Caret.create(
			'path',
				shell.space.sub[ key ].sub.doc.atRank( 0 ).textPath,
			'at',
				0
		)
	);
};


/*
| Draws the relation on the fabric.
*/
Relation.prototype.draw =
	function(
		fabric,
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
		var
			l1 =
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
		view
	);
};

} )( );

