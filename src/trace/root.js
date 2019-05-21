/*
| A root of a trace
*/
'use strict';

tim.define( module, ( def, trace_root ) => {


def.singleton = true;


const trace_forms = tim.require( './forms' );

const trace_space = tim.require( './space' );


/*
| Returns a trace with a space appended.
*/
def.lazy.appendSpace =
	function( )
{
	return trace_space.create( 'list:append', this );
};


/*
| Returns a trace with a space appended.
*/
def.lazy.appendForms =
	function( )
{
	return trace_forms.create( 'list:append', this );
};


} );
