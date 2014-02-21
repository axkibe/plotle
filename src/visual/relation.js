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
	Mark,
	shell,
	theme;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The joobj definition.
*/
if( JOOBJ )
{
	return {
		name :
			'Relation',
		unit :
			'Visual',
		attributes :
			{
				hover :
					{
						comment :
							'node currently hovered upon',
						type :
							'Path',
						assign :
							null,
						defaultVal :
							'null'
					},
				path :
					{
						comment :
							'the path of the doc',
						type :
							'Path'
					},
				mark :
					{
						comment :
							'the users mark',
						concerns :
							{
								func :
									'Visual.Item.concernsMark',
								args :
									[
										'mark',
										'path'
									]
							},
						type :
							'Mark'
					},
				traitSet :
					{
						comment :
							'traits set',
						type :
							'TraitSet',
						assign :
							null,
						defaultVal :
							'null'
					},
				tree :
					{
						comment :
							'the data tree',
						type :
							'Tree'
					},
				view :
					{
						comment :
							'the current view',
						type :
							'View'
					}
			},
		init :
			[
				'inherit'
			],
		subclass :
			'Visual.Label'
	};
}


var
	Relation =
		Visual.Relation;


/*
| Initializer.
*/
Relation.prototype._init =
	function(
		inherit
	)
{
	Visual.Label.prototype._init.call(
		this,
		inherit
	);

	var
		tree =
			this.tree;

	this.item1key =
		tree.twig.item1key;

	this.item2key =
		tree.twig.item2key;
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
		fabric
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
			this.view
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
			this.view
		);
	}

	Visual.Label.prototype.draw.call(
		this,
		fabric
	);
};

} )( );

