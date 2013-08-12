/*
| A button
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Widgets;

Widgets =
	Widgets || { };


/*
| Imports
*/
var
	config,
	Curve,
	Euclid,
	Jools,
	Path,
	shell,
	system,
	theme;


/*
| Capsule
*/
( function( ) {
'use strict';

if( typeof( window ) === 'undefined' )
{
	throw new Error( 'this code needs a browser!' );
}


/*
| Constructor.
*/
var Widget =
Widgets.Widget =
	function(
		type,
		freeStrings,
		freeType
	)
{
	this.inherit =
	this.name =
	this.parent =
	this.tree =
	this._$visible =
		null;

	var baseFreeType =
	{
		'inherit' :
		{
			type :
				'param'
		},

		'name' :
		{
			type :
				'param',

			required :
				true
		},

		'parent' :
		{
			type :
				'param',

			required :
				true
		},

		'tree' :
		{
			type :
				'param',

			required :
				true
		},

		'visible' :
		{
			type :
				'param',

			property :
				'_$visible'
		}
	};

	Jools.parseFreeStrings.call(
		this,
		Jools.extentFreeType(
			baseFreeType,
			freeType
		),
		freeStrings
	);

	if( this.tree.type !== type )
	{
		throw new Error(
			'invalid tree type'
		);
	}

	this.path = new Path(
		[
			this.parent.name,
			this.name
		]
	);

	this._$visible =
		this._$visible ||
		( this.inherit ? this.inherit._$visible : true );
};


/*
| Control takes focus.
*/
Widget.prototype.grepFocus =
	function( )
{
	if(
		!this.focusable ||
		!this._$visible ||
		this.parent.getFocus( ) === this
	)
	{
		return false;
	}

	this.parent.setCaret(
		{
			path :
				this.path,

			at1 :
				0
		}
	);

	return true;
};


/*
| Returns visibility status.
*/
Widget.prototype.isVisible =
function( )
{
	return this._$visible;
};


/*
| Sets the button in/visible.
*/
Widget.prototype.setVisible =
    function(
        visible
    )
{
    this._$visible
        = visible;
};



} )( );
