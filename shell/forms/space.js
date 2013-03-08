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
var Space =
Forms.Space =
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
	Space,
	Forms.Form
);


/*
| Layout
*/
Space.prototype.layout =
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
				'',

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

		'message1' :
		{
			type :
				'Label',

			text :
				'In future space settings can be altered here.',

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
		}
	},


	ranks :
	[
		'headline',
		'message1'
	]
};



/*
| Name of the form.
*/
Space.prototype.name =
	'space';

/*
| Finished loading a space.
*/
Space.prototype.arrivedAtSpace =
	function(
		name,
		access
	)
{
	var $sub =
		this.$sub;

	$sub.headline.setText( name );


};

})( );

