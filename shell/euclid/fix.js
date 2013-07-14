/*
| A fixed area that keeps a constant zoom level, but is attached to a zooming element.
| Used for control elements.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var Euclid;
Euclid = Euclid || {};


/*
| Imports
*/
var Jools;
var theme;


/*
| Capsule
*/
(function(){
'use strict';

if (typeof(window) === 'undefined')
	{ throw new Error('this code needs a browser'); }


/*
| Constructor.
*/
var Fix =
Euclid.Fix =
	function(
		area,
		joint
	)
{
	this.joint =
		joint;

	this.area =
		area;

	Jools.immute(this);

	// TODOC
	this.$preView =
		null;

	this.$fixView =
		null;
};


/*
| Returns the zoom 0 matching view
*/
Fix.prototype.fixView = function(view)
{
	if( view.eq( this.$preView ) )
	{
		return this.$fixView;
	}

	this.$preView =
		view;

	var fv =
	this.$fixView =
		view.review(
			0,
			view.point( this.joint )
		);

	return fv;
};


} )( );
