/*
| User has no access to a space he tried to port to.
|
| FIXME spaceUser and spaceTag are phony
|       yet are not looked at by joobj
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Forms;


Forms =
	Forms || { };


/*
| Imports
*/
var
	Gruga,
	shell,
	TraitSet;


/*
| Capsule
*/
(function( ) {
'use strict';


/*
| The joobj definition.
*/
if( JOOBJ )
{
	return {
		name :
			'NonExistingSpace',
		unit :
			'Forms',
		attributes :
			{
				hover :
					{
						comment :
							'the widget hovered upon',
						type :
							'Path',
						defaultVal :
							'null',
						allowNull :
							true
					},
				mark :
					{
						comment :
							'the users mark',
						type :
							'Mark',
						concerns :
							{
								func :
									'Forms.Form.concernsMark',
								args :
									[
										'mark',
										'path'
									]
							},
						defaultVal :
							'null',
						allowNull :
							true
					},
				path :
					{
						comment :
							'the path of the form',

						type :
							'Path',
						defaultVal :
							'null',
						allowNull :
							true
					},
				traitSet :
					{
						comment :
							'traits being set',
						type :
							'TraitSet',
						allowNull:
							true,
						defaultVal :
							'null',
						assign :
							null
					},
				username :
					{
						comment :
							'currently logged in user',
						type :
							'String',
						allowNull:
							true,
						defaultVal :
							'null',
						assign :
							null
					},
				view :
					{
						comment :
							'the current view',
						type :
							'View',
						concerns :
							{
								member :
									'sizeOnly'
							},
						defaultVal :
							'null',
						allowNull :
							true
					}
			},
		subclass :
			'Forms.Form',
		init :
			[
				'inherit',
				'traitSet'
			],
		twig :
			{
				'Button' :
					'Widgets.Button',
				'CheckBox' :
					'Widgets.Checkbox',
				'Input' :
					'Widgets.Input',
				'Label' :
					'Widgets.Label'
			}
	};
}


var
	NonExistingSpace =
		Forms.NonExistingSpace;


/*
| The space does not exist form.
*/
NonExistingSpace.prototype._init =
	function(
		inherit,
		traitSet
	)
{
	if( !this.path )
	{
		return;
	}

	var
		spaceUser,
		spaceTag;

	if( traitSet )
	{
		for(
			var a = 0, aZ = traitSet.length;
			a < aZ;
			a++
		)
		{
			var
				t =
					traitSet.get( a );

			if(
				t.path.equals( this.path )
			)
			{
				switch( t.key )
				{

					case 'spaceUser' :

						spaceUser =
							t.val;

						break;

					case 'spaceTag' :

						spaceTag =
							t.val;

						break;

					default :

						throw new Error(
							'unknown trait: ' + t.key
						);
				}
			}
		}
	}

	if( inherit )
	{
		if( spaceUser === undefined )
		{
			spaceUser =
				inherit.spaceUser;
		}

		if( spaceTag === undefined )
		{
			spaceTag =
				inherit.spaceTag;
		}
	}

	this.spaceUser =
		spaceUser;

	this.spaceTag =
		spaceTag;

	traitSet =
		TraitSet.create(
			'set',
				traitSet,
			'trait',
				this._widgetPath( 'headline' ),
				'text',
				spaceUser +
					':' +
					spaceTag +
					' does not exist.'
		);

	Forms.Form.init.call(
		this,
		inherit,
		Gruga.NonExistingSpaceForm,
		traitSet
	);
};


/*
| A button of the form has been pushed.
*/
NonExistingSpace.prototype.pushButton =
	function(
		path
		// shift,
		// ctrl
	)
{

/**/if( CHECK )
/**/{
/**/	if( path.get( 1 ) !== this.reflect )
/**/	{
/**/		throw new Error(
/**/			'path mismatch'
/**/		);
/**/	}
/**/}

	var
		buttonName =
			path.get( 2 );

	switch( buttonName )
	{
		case 'noButton' :

			shell.setMode( 'Normal' );

			break;

		case 'yesButton' :

			shell.moveToSpace(
				this.spaceUser,
				this.spaceTag,
				true
			);

			shell.setMode( 'Normal' );

			break;

		default :

			throw new Error(
				CHECK
				&&
				(
					'unknown button pushed: ' + buttonName
				)
			);
	}
};


} )( );
