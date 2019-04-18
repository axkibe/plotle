/*
| A path/at mark into a text.
*/
'use strict';


tim.define( module, ( def, mark_pat ) => {


if( TIM )
{
	def.attributes =
	{
		// offset of the mark
		at : { type : 'integer' },

		// path of the mark
		path : { type : 'tim.js/path' },
	};
}


/*
| The offset reference - 1.
*/
def.lazy.backward =
	function( )
{
	const at = this.at;

	if( at <= 0 ) return;

	const o = this.create( 'at', this.at - 1 );

	tim.aheadValue( o, 'forward', this );

	return o;
};


/*
| Creation Shortcut.
*/
def.static.createPathAt =
	function(
		path,
		at
	)
{
	return mark_pat.create( 'path', path, 'at', at );
};


/*
| The offset reference + 1.
*/
def.lazy.forward =
	function( )
{
	const o = this.create( 'at', this.at + 1 );

	tim.aheadValue( o, 'backward', this );

	return o;
};


/*
| The offset reference at 0.
*/
def.lazy.zero =
	function( )
{
	return this.create( 'at', 0 );
};


/*
| Exta checking
*/
def.proto._check =
	function( )
{
/**/if( CHECK )
/**/{
/**/	if( this.path.isEmpty ) throw new Error( );
/**/
/**/	if( !( this.at >= 0 ) ) throw new Error( );
/**/}
};


} );
