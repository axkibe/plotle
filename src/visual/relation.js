/*
| Relates two items (including other relations)
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	visual;

visual = visual || { };


/*
| Imports
*/
var
	euclid,
	jools,
	marks,
	Peer,
	shell,
	theme;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		name :
			'Relation',
		unit :
			'visual',
		attributes :
			{
				doc :
					{
						comment :
							'the labels document',
						// FUTURE make this type: 'visual.Doc'
						type :
							'Doc',
						unit :
							'visual',
						json :
							true
					},
				fontsize :
					{
						comment :
							'the fontsize of the label',
						type :
							'Number',
						json :
							true
					},
				hover :
					{
						comment :
							'node currently hovered upon',
						type :
							'path',
						assign :
							null,
						defaultValue :
							// FIXME undefined
							null
					},
				item1key :
					{
						comment :
							'item the relation goes from',
						type :
							'String',
						json :
							true
					},
				item2key :
					{
						comment :
							'item the relation goes to',
						type :
							'String',
						json :
							true
					},
				path :
					{
						comment :
							'the path of the doc',
						type :
							'path',
						defaultValue :
							undefined
					},
				pnw :
					{
						comment :
							'point in the north-west',
						type :
							'euclid.point',
						json :
							true
					},
				mark :
					{
						comment :
							'the users mark',
						concerns :
							{
								unit :
									'visual',
								type :
									'Item',
								func :
									'concernsMark',
								args :
									[
										'mark',
										'path'
									]
							},
						type :
							'Object', // FUTURE 'marks.*',
						defaultValue :
							undefined
					},
				view :
					{
						comment :
							'the current view',
						type :
							'euclid.view',
						defaultValue :
							undefined
					}
			},
		init :
			[
				'inherit'
			],
		node :
			true,
		subclass :
			'visual.Label'
	};
}


/*
| Node includes.
*/
if( SERVER )
{
	jools = require( '../jools/jools' );

	visual =
		{
			Label :
				require( './label' ),
			Relation :
				require( '../jion/this' )( module )
		};
}

var
	Relation;

Relation = visual.Relation;


/*
| Initializer.
*/
Relation.prototype._init =
	function(
		inherit
	)
{
	visual.Label.prototype._init.call(
		this,
		inherit
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
		cline,
		key,
		pnw,
		result;

	cline =
		euclid.line.connect(
			item1.silhoutte,
			null,
			item2.silhoutte,
			null
		);

	pnw =
		cline.pc.sub(
			theme.relation.spawnOffset
		);

	result =
		Peer.newRelation(
			shell.space.spaceUser,
			shell.space.spaceTag,
			pnw,
			'relates to',
			20,
			item1.key,
			item2.key
		);

	key =
		result.chgX.trg.path.get( -1 );

	shell.setMark(
		marks.caret.create(
			'path',
				shell
				.space
				.twig[ key ]
				.doc
				.atRank( 0 )
				.textPath,
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
		item1,
		item2,
		l1,
		l2,
		space,
		zone;

	space =
		shell.$space;

	item1 =
		space.getItem( this.item1key );

	item2 =
		space.getItem( this.item2key );

	zone =
		this.zone;

	if( item1 )
	{
		l1 =
			euclid.line.connect(
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
		l2 =
			euclid.line.connect(
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

	visual.Label.prototype.draw.call(
		this,
		fabric
	);
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports = Relation;
}


} )( );

