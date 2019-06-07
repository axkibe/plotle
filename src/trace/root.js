/*
| A root of a trace
*/
'use strict';

tim.define( module, ( def, trace_root ) => {


def.singleton = true;


const tim_path = tim.require( 'tim.js/path' );

const trace_discs = tim.require( './discs' );

const trace_forms = tim.require( './forms' );

const trace_space = tim.require( './space' );


/*
| FIXME remove
*/
def.lazy.toPath = function( ) { return tim_path.empty; };


/*
| Returns a trace with a step to discs root appended.
*/
def.lazy.appendDiscs =
	function( )
{
	return trace_discs.create( 'list:append', this );
};


/*
| Returns a trace with a step to forms root appended.
*/
def.lazy.appendForms =
	function( )
{
	return trace_forms.create( 'list:append', this );
};


/*
| Returns a trace with a space appended.
*/
def.lazy.appendSpace =
	function( )
{
	return trace_space.create( 'list:append', this );
};


/*
| Root doesn't have back traces.
*/
def.lazy.traceDoc = ( ) => undefined;
def.lazy.traceItem = ( ) => undefined;
def.lazy.traceSpace = ( ) => undefined;


} );
