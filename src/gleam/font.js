/*
| A font style.
*/
'use strict';


tim.define( module, 'gleam_font', ( def, gleam_font ) => {


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
		size :
		{
			type : 'number'
		},
		family :
		{
			type : 'string'
		},
		align : // horizonal alignment
		{
			type : 'string'
		},
		fill : // font color
		{
			type : 'gleam_color'
		},
		base : // vertical alignment
		{
			type : 'string'
		}
	};

	/*
	| Tim alike functions.
	*/
	def.alike =
	{
		alikeWithoutSize :
		{
			ignores : { size : true }
		}
	};

	def.init = [ 'inherit' ];
}


/*
| Initializer.
*/
def.func._init =
	function(
		inherit
	)
{
	if(
		inherit
		&& inherit._tPool
		&& this.alikeWithoutSize( inherit )
	)
	{
		this._tPool = inherit._tPool;
	}
	else if( FREEZE )
	{
		this._tPool = { };
	}
};


/*:::::::::::::.
:: Lazy values
'::::::::::::::*/


/*
| The CSS-string for this font.
|
| FIXME: remove?
*/
def.lazy.css =
	function( )
{
	return Math.round( this.size ) + 'px ' + 'Ideoloom-' + this.family;
};


/*:::::::::::.
:: Functions
'::::::::::::*/


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


} );
