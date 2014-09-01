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
	root,
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
		id :
			'visual.relation',
		attributes :
			{
				doc :
					{
						comment :
							'the labels document',
						type :
							'visual.doc',
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
							'jion.path',
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
							'jion.path',
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
								type :
									'visual.item',
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
			'visual.label'
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
			label :
				require( './label' ),
			relation :
				require( '../jion/this' )( module )
		};
}

var
	relation;

relation = visual.relation;


/*
| Initializer.
*/
relation.prototype._init =
	function(
		inherit
	)
{
	visual.label.prototype._init.call(
		this,
		inherit
	);
};


/*
| Creates a new relation by specifing its relates.
*/
relation.spawn =
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
			pnw,
			'relates to',
			20,
			item1.key,
			item2.key
		);

	key =
		result.chgX.trg.path.get( -1 );

	root.setMark(
		marks.caret.create(
			'path',
				root
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
relation.prototype.draw =
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

	space = root.$space;

	item1 = space.getItem( this.item1key );

	item2 = space.getItem( this.item2key );

	zone = this.zone;

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
			this.view
		);
	}

	visual.label.prototype.draw.call(
		this,
		fabric
	);
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports = relation;
}


} )( );

