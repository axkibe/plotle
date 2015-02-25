/*
| The user form.
*/


var
	form_form,
	form_user,
	jools;


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
							'->mark',
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
				spaceRef :
					{
						comment :
							'the reference to the current space',
						type :
							'fabric_spaceRef',
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


/*
| Initializer.
*/
form_user.prototype._init =
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

	// FIXME take a user object
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
| The focused widget.
*/
jools.lazyValue(
	form_user.prototype,
	'focusedWidget',
	form_form.getFocusedWidget
);


/*
| Draws a form.
*/
form_user.prototype.draw = form_form.draw;


/*
| A button of the form has been pushed.
*/
form_user.prototype.pushButton =
	function(
		path
		// shift,
		// ctrl
	)
{
	var
		buttonName;

/**/if( CHECK )
/**/{
/**/	if( path.get( 2 ) !== this.reflectName )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	buttonName = path.get( 4 );

	switch( buttonName )
	{
		case 'closeButton' :

			root.showHome( );

			break;

		default :

			throw new Error( );
	}
};


/*
| The disc is shown while a form is shown.
*/
form_user.prototype.showDisc = true;


})( );

