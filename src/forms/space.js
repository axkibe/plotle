/*
| The space form.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var Forms;


Forms =
	Forms || { };


/*
| Imports
*/
var
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
			'Space',
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
							'null'
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
							'null'
					},
				path :
					{
						comment :
							'the path of the form',
						type :
							'Path',
						defaultVal :
							'null'
					},
				traitSet :
					{
						comment :
							'traits being set',
						type :
							'TraitSet',
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
							'null'
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
	Space =
		Forms.Space;


/*
| The space form.
*/
Space.prototype._init =
	function(
		inherit,
		traitSet
	)
{
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

	if( this.path )
	{
		traitSet =
			TraitSet.create(
				'set',
					traitSet,
				'trait',
					this._widgetPath( 'headline' ),
					'text',
					this.spaceUser + ':' + this.spaceTag
			);
	}

	Forms.Form.init.call(
		this,
		inherit,
		traitSet
	);
};


/*
| A button of the form has been pushed.
*/
Space.prototype.pushButton =
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
		case 'closeButton' :

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
