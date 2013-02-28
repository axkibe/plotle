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
					fontPool.get( 22, 'la' ),

				pos :
				{
					type :
						'Point',

					anchor :
						'c',

					x :
						-400,

					y :
						-200
				}
			},

			'username' :
			{
				type :
					'Label',

				text :
					'',

				font :
					fontPool.get( 26, 'la' ),

				pos :
				{
					type :
						'Point',

					anchor :
						'c',

					x :
						-350,

					y :
						-160
				}
			},
		},


		ranks :
		[
			'headline',
			'username'
		]
	};


/*
| Name of the form.
*/
User.prototype.name =
	'user';


})( );

