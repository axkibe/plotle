/*
| A font style.
|
| FIXME family is ignored?
*/
'use strict';


tim.define( module, ( def ) => {


/*
| This tim has an abstract form.
*/
def.hasAbstract = true;


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		size : { type : 'number' },

		opentype : { type : [ 'undefined', 'protean' ] },

		// horizonal alignment
		align : { type : 'string' },

		// font color
		fill : { type : './color' },

		// vertical alignment
		base : { type : 'string' }
	};

	/*
	| Tim alike functions.
	*/
	def.alike =
	{
		alikeWithoutSize : { ignores : { size : true } }
	};
}


/*:::::::::::.
:: Functions
'::::::::::::*/


/*
| Measures the advance width of a given text.
*/
def.func.getAdvanceWidth =
	function(
		text
	)
{
	return this.opentype.getAdvanceWidth( text, this.size );
};


/*
| Applies a transformation to this font.
*/
def.func.transform =
	function(
		transform
	)
{
	let tp = this._tPool && this._tPool[ transform.zoom ];

	if( tp ) return tp;

	if( !FREEZE && !this._tPool ) this._tPool = { };

	tp =
	this._tPool[ transform.zoom ] =
		this.create( 'size', this.size * transform.zoom );

	// FUTURE clear a too large pool

	return tp;
};


/*
| The transform pool.
| This breaks immutability for caching.
*/
def.lazy._tPool =
	function( )
{
	return { };
};


/*
| Inherits the transform pool if alike.
*/
def.inherit._tPool =
	function(
		inherit
	)
{
	return this.alikeWithoutSize( inherit );
};


} );
