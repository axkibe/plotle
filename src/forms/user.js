/*
| The user form.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	forms;

forms = forms || { };


/*
| Imports
*/
var
	jools,
	shell;


/*
| Capsule
*/
(function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		name :
			'user',
		unit :
			'forms',
		attributes :
			{
				hover :
					{
						comment :
							'the widget hovered upon',
						type :
							'jion.path',
						defaultValue :
							null
					},
				mark :
					{
						comment :
							'the users mark',
						type :
							'Object', // FUTURE: 'marks.*',
						concerns :
							{
								type :
									'forms.form',
								func :
									'concernsMark',
								args :
									[
										'mark',
										'path'
									]
							},
						defaultValue :
							null
					},
				path :
					{
						comment :
							'the path of the form',
						type :
							'jion.path',
						defaultValue :
							undefined
					},
				spaceUser :
					{
						comment :
							'the user of the current space',
						type :
							'String',
						defaultValue :
							undefined,
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
							undefined,
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
							null
					},
				view :
					{
						comment :
							'the current view',
						type :
							'euclid.view',
						concerns :
							{
								member :
									'sizeOnly'
							},
						defaultValue :
							undefined
					}
			},

		subclass :
			'forms.form',

		init :
			[
				'inherit',
				'twigDup'
			],
		twig :
			'form-widgets'
	};
}

var
	user;

user = forms.user;


/*
| The space form.
*/
user.prototype._init =
	function(
		inherit,
		twigDup
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

	if( !twigDup )
	{
		this.twig = jools.copy( this.twig );
	}

	this.twig.headline =
		this.twig.headline.create(
			'text',
				'hello ' + ( this.username || '' )
		);

	this.twig.visitor1 =
		this.twig.visitor1.create(
			'visible',
				isGuest
		);

	this.twig.visitor2 =
		this.twig.visitor2.create(
			'visible',
				isGuest
		);

	this.twig.visitor3 =
		this.twig.visitor3.create(
			'visible',
				isGuest
		);

	this.twig.visitor4 =
		this.twig.visitor4.create(
			'visible',
				isGuest
		);

	this.twig.greeting1 =
		this.twig.greeting1.create(
			'visible',
				!isGuest
		);

	this.twig.greeting2 =
		this.twig.greeting2.create(
			'visible',
				!isGuest
		);

	this.twig.greeting3 =
		this.twig.greeting3.create(
			'visible',
				!isGuest
		);

	forms.form.init.call(
		this,
		inherit
	);
};


/*
| A button of the form has been pushed.
*/
user.prototype.pushButton =
	function(
		path
		// shift,
		// ctrl
	)
{

/**/if( CHECK )
/**/{
/**/	if( path.get( 2 ) !== this.reflexName )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	var
		buttonName =
			path.get( 4 );

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

