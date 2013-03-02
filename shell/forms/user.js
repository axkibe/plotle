/*
| The user's form.
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
var Euclid;
var fontPool;
var Jools;
var Path;
var shell;


/*
| Capsule
*/
(function( ) {
'use strict';


/*
| The login form
*/
var User =
Forms.User =
	function(
		// free strings
	)
{
	Forms.Form.apply(
		this,
		arguments
	);
};


Jools.subclass(
	User,
	Forms.Form
);


/*
| Layout
*/
User.prototype.layout =
	{
		type :
			'Layout',

		copse :
		{
			'headline' :
			{
				type :
					'Label',

				text :
					'Hello',

				font :
					fontPool.get( 22, 'ca' ),

				pos :
				{
					type :
						'Point',

					anchor :
						'c',

					x :
						0,

					y :
						-120
				}
			},

			'visitor1' :
			{
				type :
					'Label',

				text :
					'You\'re currently an anonymous visitor!',

				font :
					fontPool.get( 16, 'ca' ),

				pos :
				{
					type :
						'Point',

					anchor :
						'c',

					x :
						0,

					y :
						-50
				}
			},

			'visitor2' :
			{
				type :
					'Label',

				text :
					'Click on "sign up" or "log in"',

				font :
					fontPool.get( 16, 'ca' ),

				pos :
				{
					type :
						'Point',

					anchor :
						'c',

					x :
						0,

					y :
						0
				}
			},

			'visitor3' :
			{
				type :
					'Label',

				text :
					'on the control disc to the left',

				font :
					fontPool.get( 16, 'ca' ),

				pos :
				{
					type :
						'Point',

					anchor :
						'c',

					x :
						0,

					y :
						20
				}
			},

			'visitor4' :
			{
				type :
					'Label',

				text :
					' to register as an user.',

				font :
					fontPool.get( 16, 'ca' ),

				pos :
				{
					type :
						'Point',

					anchor :
						'c',

					x :
						0,

					y :
						40
				}
			},

			'greeting1' :
			{
				type :
					'Label',

				text :
					'This is your profile page!',

				font :
					fontPool.get( 16, 'ca' ),

				pos :
				{
					type :
						'Point',

					anchor :
						'c',

					x :
						0,

					y :
						-50
				}
			},

			'greeting2' :
			{
				type :
					'Label',

				text :
					'In future you will be able to do stuff',

				font :
					fontPool.get( 16, 'ca' ),

				pos :
				{
					type :
						'Point',

					anchor :
						'c',

					x :
						0,

					y :
						-10
				}
			},

			'greeting3' :
			{
				type :
					'Label',

				text :
					'here, like for example change your password',

				font :
					fontPool.get( 16, 'ca' ),

				pos :
				{
					type :
						'Point',

					anchor :
						'c',

					x :
						0,

					y :
						10
				}
			},

		},


		ranks :
		[
			'headline',
			'visitor1',
			'visitor2',
			'visitor3',
			'visitor4',
			'greeting1',
			'greeting2',
			'greeting3',
		]
	};

/*
| sets the username
*/
User.prototype.setUsername =
	function( username )
{
	var $sub =
		this.$sub;

	$sub.headline.setText(
		'hello ' + username + '!'
	);

	if( username.substr( 0, 7 ) !== 'visitor' )
	{
		$sub.visitor1.setVisible( false );
		$sub.visitor2.setVisible( false );
		$sub.visitor3.setVisible( false );
		$sub.visitor4.setVisible( false );

		$sub.greeting1.setVisible( true );
		$sub.greeting2.setVisible( true );
		$sub.greeting3.setVisible( true );
	}
	else
	{
		console.log(' YYY ');
		$sub.visitor1.setVisible( false );

		$sub.visitor1.setVisible( true );
		$sub.visitor2.setVisible( true );
		$sub.visitor3.setVisible( true );
		$sub.visitor4.setVisible( true );

		$sub.greeting1.setVisible( false );
		$sub.greeting2.setVisible( false );
		$sub.greeting3.setVisible( false );
	}
};


/*
| Name of the form.
*/
User.prototype.name =
	'user';


})( );

