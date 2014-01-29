/*
| The move to form.
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
	Design,
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
			'MoveTo',

		unit :
			'Forms',

		attributes :
			{
				hover :
					{
						comment :
							'the widget hovered upon',

						type :
							'Path'
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
							}
					},

				path :
					{
						comment :
							'the path of the form',

						type :
							'Path'
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
								func :
									'view.sizeOnly',

								args :
									null
							}
					}
			},

		subclass :
			'Forms.Form',

		init :
			[
				'inherit',
				'traitSet'
			]
	};
}

var
	MoveTo =
		Forms.MoveTo;


/*
| The moveto form.
*/
MoveTo.prototype._init =
	function(
		inherit,
		traitSet
	)
{
	var
		isGuest =
			this.username === null ?
				false
				:
				this.username.substr( 0, 7 ) === 'visitor';

	traitSet =
		TraitSet.create(
			'set',
				traitSet,
			'trait',
				this._widgetPath( 'userHomeButton' ),
				'visible',
				!isGuest,
			'trait',
				this._widgetPath( 'userHomeButton' ),
				'text',
				this.username + '\n' + 'home'
		);

	Forms.Form.init.call(
		this,
		inherit,
		Design.MoveToForm,
		traitSet
	);
};


/*
| A button of the form has been pushed.
*/
MoveTo.prototype.pushButton =
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
		case 'meshcraftHomeButton' :

			shell.moveToSpace(
				'meshcraft',
				'home',
				false
			);


			break;

		case 'meshcraftSandboxButton' :

			shell.moveToSpace(
				'meshcraft',
				'sandbox',
				false
			);

			break;

		case 'userHomeButton' :

			shell.moveToSpace(
				this.username,
				'home',
				false
			);

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

})( );

