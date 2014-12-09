/*
| Relates two items (including other relations).
*/


var
	euclid_arrow,
	jools,
	marks_caret,
	peer,
	root,
	theme,
	visual;

visual = visual || { }; // TODO


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
							'jion_path',
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
							'jion_path',
						defaultValue :
							undefined
					},
				pnw :
					{
						comment :
							'point in the north-west',
						type :
							'euclid_point',
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
									[ 'mark', 'path' ]
							},
						type :
							'Object', // FUTURE '->marks_',
						defaultValue :
							undefined,
						allowsNull :
							true
					},
				view :
					{
						comment :
							'the current view',
						type :
							'euclid_view',
						defaultValue :
							undefined
					}
			},
		init :
			[
				'inherit'
			],
		subclass :
			'visual.label'
	};
}


var
	label,
	relation;

/*
| Node includes.
*/
if( SERVER )
{
	jools = require( '../jools/jools' );

	label = require( './label' );

	relation = require( '../jion/this' )( module );
}
else
{
	label = visual.label;

	relation = visual.relation;
}


/*
| Initializer.
*/
relation.prototype._init =
	function(
		inherit
	)
{
	label.prototype._init.call( this, inherit );
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
		arrow,
		key,
		pnw,
		result;

	arrow =
		euclid_arrow.connect(
			item1.silhoutte, null,
			item2.silhoutte, null
		);

	pnw =
		arrow.pc.sub(
			theme.relation.spawnOffset
		);

	result =
		peer.newRelation(
			pnw,
			'relates to',
			20,
			item1.key,
			item2.key
		);

	key = result.reaction.trg.path.get( -1 );

	root.setMark(
		marks_caret.create(
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
| Displays the relation.
*/
relation.prototype.draw =
	function(
		display
	)
{
	var
		item1,
		item2,
		arrow1,
		arrow2,
		space,
		zone;

	space = root.space;

	item1 = space.getItem( this.item1key );

	item2 = space.getItem( this.item2key );

	zone = this.zone;

	if( item1 )
	{
		arrow1 =
			euclid_arrow.connect(
				item1.silhoutte, 'normal',
				zone, 'normal'
			);

		arrow1.draw(
			display,
			this.view,
			theme.relation.style
		);
	}

	if( item2 )
	{
		arrow2 =
			euclid_arrow.connect(
				zone, 'normal',
				item2.silhoutte, 'arrow'
			);

		arrow2.draw(
			display,
			this.view,
			theme.relation.style
		);
	}

	label.prototype.draw.call( this, display );
};


} )( );

