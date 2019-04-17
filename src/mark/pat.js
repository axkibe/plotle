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
