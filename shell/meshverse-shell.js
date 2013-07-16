/*
| Meshcraft tree patterns.
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
	MeshverseShell,
	meshverseShell;


/*
| Capsule
*/
( function( ) {
"use strict";


MeshverseShell =
	function( )
	{

	};


Jools.subclass(
	MeshverseShell,
	Meshverse
);


MeshverseShell.prototype.AnchorPoint =
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


MeshverseShell.prototype.BeziTo =
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


MeshverseShell.prototype.Button =
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

			} ),

	} );


MeshverseShell.prototype.CheckBox =
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


MeshverseShell.prototype.Curve =
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


MeshverseShell.prototype.Ellipse =
	Jools.immute( {

		must :
			Jools.immute( {

				pnw :
					'AnchorPoint',

				pse :
					'AnchorPoint'

			} )

	} );


MeshverseShell.prototype.Font =
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


MeshverseShell.prototype.Frame =
	Jools.immute( {

		must :
			Jools.immute( {

				pnw :
					'AnchorPoint',

				pse :
					'AnchorPoint'
			} )

	} );


MeshverseShell.prototype.Input =
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


MeshverseShell.prototype.LabelWidget =
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

			} ),
	} );


MeshverseShell.prototype.Layout =
	Jools.immute( {

		twig :
			Jools.immute( {

				Button :
					true,

				CheckBox :
					true,

				Input :
					true,

				LabelWidget :
					true
			} ),

		ranks :
			true

	} );


MeshverseShell.prototype.LineTo =
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


MeshverseShell.prototype.MoveTo =
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


MeshverseShell.prototype.creators =
	Jools.immute( {

		'Point' :
			Euclid.Point,

		'Font' :
			Euclid.Font

	} );


meshverseShell =
	new MeshverseShell( );


} )( );

