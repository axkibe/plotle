/*
| The move to form.
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
var MoveTo =
Forms.MoveTo =
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
	MoveTo,
	Forms.Form
);


/*
| Layout
*/
MoveTo.prototype.layout =
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
				'Move to another space:',

			font :
				fontPool.get( 22, 'la' ),

			pos :
			{
				type :
					'Point',

				anchor :
					'w',

				x :
					150,

				y :
					-250
			}
		},
	},


	ranks :
	[
		'headline'
	]
};



/*
| Name of the form.
*/
MoveTo.prototype.name =
	'moveto';

/*
| Finished loading a space.
*/
MoveTo.prototype.arrivedAtSpace =
	function(
		name,
		access
	)
{
};

})( );

