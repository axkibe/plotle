/*
| Shell extensions to the meshverse.
|
| Authors: Axel Kittenberger
*/


/*
| Imports
*/
var
	Euclid,
	Jools,
	Meshverse;


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
	Jools.immute( {

		must :
			Jools.immute( {
				anchor :
					'String',

				x :
					'Number',

				y :
					'Number'
			} )

	} );


Shellverse.prototype.BeziTo =
	Jools.immute( {

		must :
			Jools.immute( {
				to :
					'AnchorPoint',

				bx :
					'Number',

				by :
					'Number',

				// FIXME Maybe replace with "Tangent"
				c1x :
					'Number',

				c1y :
					'Number',

				c2x :
					'Number',

				c2y :
					'Number'
			} )
	} );


Shellverse.prototype.ButtonWidget =
	Jools.immute( {

		must :
			Jools.immute( {

				shape :
					Jools.immute( {
						'Curve' :
							true,

						'Ellipse' :
							true
					} ),

				frame :
					'Frame',

				style :
					'String'

			} ),

		can :
			Jools.immute( {

				icon :
					'String',

				iconStyle :
					'String',

				caption :
					'LabelWidget',

				visible :
					'Boolean'

			} )

	} );


Shellverse.prototype.CheckBoxWidget =
	Jools.immute( {

		must :
			Jools.immute( {

				box :
					'Frame',

				checked :
					'Boolean',

				style :
					'String'

			} )

	} );


Shellverse.prototype.Curve =
	Jools.immute( {

		twig :
			Jools.immute( {

				MoveTo :
					true,

				LineTo :
					true,

				BeziTo :
					true

			} )

	} );


Shellverse.prototype.Ellipse =
	Jools.immute( {

		must :
			Jools.immute( {

				pnw :
					'AnchorPoint',

				pse :
					'AnchorPoint'

			} )

	} );


Shellverse.prototype.Font =
	Jools.immute( {

		must :
			Jools.immute( {

				size :
					'Number',

				family :
					'String',

				align :
					'String',

				fill :
					'String',

				base :
					'String'

			} )

	} );


Shellverse.prototype.Frame =
	Jools.immute( {

		must :
			Jools.immute( {

				pnw :
					'AnchorPoint',

				pse :
					'AnchorPoint'
			} )

	} );


Shellverse.prototype.InputWidget =
	Jools.immute( {

		must :
			Jools.immute( {

				frame :
					'Frame',

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

				rotate :
					'Number',

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


Shellverse.prototype.LineTo =
	Jools.immute( {

		must :
			Jools.immute( {
				to :
					'AnchorPoint',

				bx :
					'Number',

				by :
					'Number'
			} )

	} );


Shellverse.prototype.MoveTo =
	Jools.immute( {

		must :
			Jools.immute( {
				to :
					'AnchorPoint',

				bx :
					'Number',

				by :
					'Number'
			} )

	} );


Shellverse.prototype.creators =
	Jools.immute( {

		'Font' :
			Euclid.Font,

		'Point' :
			Euclid.Point,

		'Rect' :
			Euclid.Rect
	} );


shellverse =
	new Shellverse( );


} )( );

