/*
| Shell extensions to the meshverse.
|
| Authors: Axel Kittenberger
*/


/*
| Imports
*/
var
	Design,
	Euclid,
	Jools,
	Meshverse,
	Widgets;


/*
| Exports
*/
var
	Shellverse,
	shellverse;


/*
| Capsule
*/
( function( ) {
"use strict";


Shellverse =
	function( )
	{

	};


Jools.subclass(
	Shellverse,
	Meshverse
);


Shellverse.prototype.AnchorPoint =
	Design.AnchorPoint;


Shellverse.prototype.ButtonWidget =
	Widgets.Button;
	/*
	Jools.immute( {

		must :
			Jools.immute( {
				shape :
					Jools.immute( {
						'AnchorEllipse' :
							true
					} ),
				designFrame :
					'AnchorRect',
				style :
					'String'
			} ),

		can :
			Jools.immute( {
				font :
					'Font',
				icon :
					'String',
				iconStyle :
					'String',
				visible :
					'Boolean',
				text :
					'String',
				textNewline :
					'Number',
				textRotation :
					'Number',
				textDesignPos :
					'AnchorPoint',
			} )

	} );
	*/


Shellverse.prototype.CheckBoxWidget =
	Jools.immute( {

		must :
			Jools.immute( {

				designFrame :
					'AnchorRect',

				checked :
					'Boolean',

				style :
					'String'

			} )

	} );

Shellverse.prototype.AnchorEllipse =
	Design.AnchorEllipse;

Shellverse.prototype.Font =
	Euclid.Font;

Shellverse.prototype.AnchorRect =
	Design.AnchorRect;

Shellverse.prototype.InputWidget =
	Jools.immute( {

		must :
			Jools.immute( {
				designFrame :
					'AnchorRect',
				password :
					'Boolean',
				style :
					'String',
				font :
					'Font',
				maxlen :
					'Number'
			} )

	} );


Shellverse.prototype.LabelWidget =
	Jools.immute( {
		must :
			Jools.immute( {
				text :
					'String',
				pos  :
					'AnchorPoint',
				font :
					'Font'
			} ),

		can :
			Jools.immute( {
				newline :
					'Integer'
			} )
	} );


Shellverse.prototype.Layout =
	Jools.immute( {

		twig :
			Jools.immute( {

				ButtonWidget :
					true,

				CheckBoxWidget :
					true,

				InputWidget :
					true,

				LabelWidget :
					true
			} ),

		ranks :
			true

	} );



shellverse =
	new Shellverse( );


} )( );

