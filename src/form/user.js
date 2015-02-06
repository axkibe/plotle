/*
| The user form.
*/


var
	form_form,
	form_user,
	jools,
	root;


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
		id :
			'form_user',
		attributes :
			{
				hover :
					{
						comment :
							'the widget hovered upon',
						type :
							'jion_path',
						defaultValue :
							'null'
					},
				mark :
					{
						comment :
							'the users mark',
						type :
							'Object', // FUTURE: '->mark',
						concerns :
							{
								type :
									'form_form',
								func :
									'concernsMark',
								args :
									[ 'mark', 'path' ]
							},
						defaultValue :
							'null'
					},
				path :
					{
						comment :
							'the path of the form',
						type :
							'jion_path',
						defaultValue :
							'undefined'
					},
				spaceUser :
					{
						comment :
							'the user of the current space',
						type :
							'string',
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
							'string',
						defaultValue :
							'undefined',
						assign :
							null
					},
				username :
					{
						comment :
							'currently logged in user',
						type :
							'string',
						defaultValue :
							'null'
					},
				view :
					{
						comment :
							'the current view',
						type :
							'euclid_view',
						concerns :
							{
								member : 'sizeOnly'
							},
						defaultValue :
							'undefined'
					}
			},

		subclass :
			'form_form',

		init :
			[
				'inherit',
				'twigDup'
			],
		twig :
			'->formWidgets'
	};
}

var
	user;

user = form_user;


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

	form_form.init.call( this, inherit );
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
/**/	if( path.get( 2 ) !== this.reflectName )
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

			root.setMode( 'Normal' );

			break;

		default :

			throw new Error( );
	}
};


})( );
