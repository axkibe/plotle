/*
| A root of a trace
*/
'use strict';

tim.define( module, ( def, trace_root ) => {


def.proto._check =
	function( )
{
/**/if( CHECK )
/**/{
/**/	// roots need to not have parents
/**/	if( this.length !== 0 ) throw new Error( );
/**/}
};


const trace_space = tim.require( './space' );


/*
| Returns a trace with a space appended.
*/
def.lazy.appendSpace =
	function( )
{
	return trace_space.create( 'list:init', this, 'list:append', this );
};


} );
