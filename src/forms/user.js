/*
| The user form.
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
			'User',
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
						defaultValue :
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
						defaultValue :
							'null'
					},
				path :
					{
						comment :
							'the path of the form',
						type :
							'Path',
						defaultValue :
							'undefined'
					},
				spaceUser :
					{
						comment :
							'the user of the current space',
						type :
							'String',
						defaultValue :
							'undefined',
						assign :
							null
					},
				spaceTag :
					{
						comment :
							'tag of the current space',
						type :
							'String',
						defaultValue :
							'undefined',
						assign :
							null
					},
				traitSet :
					{
						comment :
							'traits being set',
						type :
							'TraitSet',
						defaultValue :
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
						defaultValue :
							'null'
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
						defaultValue :
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
	User =
		Forms.User;


/*
| The space form.
*/
User.prototype._init =
	function(
		inherit,
		traitSet
	)
{
	var
		isGuest;

	if( !this.path )
	{
		return;
	}

	if( this.username )
	{
		isGuest =
			this.username.substr( 0, 7 ) === 'visitor';
	}
	else
	{
		isGuest =
			true;
	}

	traitSet =
		TraitSet.create(
			'set',
				traitSet,
			'trait',
				this._widgetPath( 'headline' ),
				'text',
				'hello ' + ( this.username || '' ),
			'trait',
				this._widgetPath( 'visitor1' ),
				'visible',
				isGuest,
			'trait',
				this._widgetPath( 'visitor2' ),
				'visible',
				isGuest,
			'trait',
				this._widgetPath( 'visitor3' ),
				'visible',
				isGuest,
			'trait',
				this._widgetPath( 'visitor4' ),
				'visible',
				isGuest,
			'trait',
				this._widgetPath( 'greeting1' ),
				'visible',
				!isGuest,
			'trait',
				this._widgetPath( 'greeting2' ),
				'visible',
				!isGuest,
			'trait',
				this._widgetPath( 'greeting3' ),
				'visible',
				!isGuest
		);

	Forms.Form.init.call(
		this,
		inherit,
		traitSet
	);
};


/*
| A button of the form has been pushed.
*/
User.prototype.pushButton =
	function(
		path
		// shift,
		// ctrl
	)
{

/**/if( CHECK )
/**/{
/**/	if( path.get( 2 ) !== this.reflect )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	var
		buttonName =
			path.get( 3 );

	switch( buttonName )
	{
		case 'closeButton' :

			shell.setMode( 'Normal' );

			break;

		default :

			throw new Error( );
	}
};


})( );

