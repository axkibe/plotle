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

Shellverse.prototype.CheckBoxWidget =
	Widgets.CheckBox;

Shellverse.prototype.AnchorEllipse =
	Design.AnchorEllipse;

Shellverse.prototype.Font =
	Euclid.Font;

Shellverse.prototype.AnchorRect =
	Design.AnchorRect;

Shellverse.prototype.InputWidget =
	Widgets.Input;

Shellverse.prototype.LabelWidget =
	Widgets.Label;

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

