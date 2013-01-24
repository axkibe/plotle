/*
| The login form.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var Forms;
Forms = Forms || { };


/*
| Imports
*/
var Euclid;
var fontPool;
var Jools;


/*
| Capsule
*/
(function( ) {
'use strict';


/*
| The login form
*/
var Login =
Forms.Login =
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
	Login,
	Forms.Form
);


/*
| Layout
*/
Login.prototype.layout =
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
					'Log In',
				font :
					fontPool.get( 22, 'la' ),

				pos :
				{
					type :
						'Point',

					anchor :
						'nw',

					x :
						150,

					y :
						50
				}
			},

			'usernameLabel' :
			{
				type :
					'Label',

				text :
					'username',

				font :
					fontPool.get( 16, 'la' ),

				pos :
				{
					type :
						'Point',

					anchor :
						'nw',

					x :
						200,

					y :
						110
				}
			},

			'passwordLabel' :
			{
				type :
					'Label',

				text :
					'password',

				font :
					fontPool.get( 16, 'la' ),

				pos :
				{
					type :
						'Point',

					anchor :
						'nw',

					x :
						200,

					y :
						150
				}
			},

			'userInput' :
			{
				type :
					'Input',

				code :
					'',

				password :
					false,

				normaStyle :
					'input',

				focusStyle :
					'inputFocus',

				hoverStyle :
					'input',

				hofocStyle :
					'inputFocus',

				font :
					fontPool.get( 14, 'la' ),

				maxlen :
					100,

				frame  :
				{
					type :
						'Frame',

					pnw :
					{
						type :
							'Point',

						anchor :
							'nw',

						x :
							295,

						y :
							95
					},

					pse :
					{
						type :
							'Point',

						anchor :
							'nw',

						x :
							505,

						y :
							118
					}
				}
			},

			'passwordInput' :
			{
				type :
					'Input',

				code :
					'',

				password :
					false,

				normaStyle :
					'input',

				focusStyle :
					'inputFocus',

				hoverStyle :
					'input',

				hofocStyle :
					'inputFocus',

				font :
					fontPool.get( 14, 'la' ),

				maxlen :
					100,

				frame  :
				{
					type :
						'Frame',

					pnw :
					{
						type :
							'Point',

						anchor :
							'nw',

						x :
							295,

						y :
							135
					},

					pse :
					{
						type :
							'Point',

						anchor :
							'nw',

						x :
							505,

						y :
							158
					}
				}
			}
		},

		ranks :
		[
			'headline',
			'usernameLabel',
			'passwordLabel',
			'userInput',
			'passwordInput'
		]
	};


/*
| Name of the form.
*/
Login.prototype.name =
	'login';

} )( );
