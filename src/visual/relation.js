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
				doc :
					{
						comment :
							'the labels document',
						// FUTURE make this type: 'Visual.Doc'
						type :
							'Doc',
						unit :
							'Visual',
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
							'Path',
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
							'Path',
						defaultValue :
							undefined
					},
				pnw :
					{
						comment :
							'point in the north-west',
						type :
							'Point',
						unit :
							'Euclid',
						json :
							true
					},
				mark :
					{
						comment :
							'the users mark',
						concerns :
							{
								func :
									// FUTURE this is kinda not nice
									'Visual.Item && Visual.Item.concernsMark',
								args :
									[
										'mark',
										'path'
									]
							},
						type :
							'Mark',
						defaultValue :
							undefined
					},
				// FIXME remove
				traitSet :
					{
						comment :
							'traits set',
						type :
							'TraitSet',
						assign :
							null,
						defaultValue :
							null
					},
				view :
					{
						comment :
							'the current view',
						type :
							'View',
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
			'Visual.Label'
	};
}


/*
| Node includes.
*/
if( SERVER )
{
	Jools =
		require( '../jools/jools' );

	Visual =
		{
			Label :
				require( './label' ),
			Relation :
				require( '../joobj/this' )( module )
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
		Euclid.Line.connect(
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
		shell.peer.newRelation(
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
		Mark.Caret.Create(
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
		l2 =
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


/*
| Node export.
*/
if( SERVER )
{
	module.exports =
		Relation;
}


} )( );

