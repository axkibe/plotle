/*
| A bare part of a trace.
*/
'use strict';


tim.define( module, ( def, trace_bare ) => {


def.abstract = true;


/*
| Returns true if this trace has 'trace' as parent.
*/
def.proto.hasTrace =
	function(
		trace
	)
{
	if( this.equals( trace ) ) return true;

	for( let a = this.length - 1; a >= 0; a-- )
	{
		if( this.get( a ).equals( trace ) ) return true;
	}

	return false;
};


/*
| Default doc tracer.
*/
def.lazy.traceDoc = function( ) { return this.get( this.length - 1 ).traceDoc; };


/*
| Default item tracer.
*/
def.lazy.traceItem = function( ) { return this.get( this.length - 1 ).traceItem; };


/*
| Default para tracer.
*/
def.lazy.tracePara = function( ) { return this.get( this.length - 1 ).tracePara; };


/*
| Default space tracer.
*/
def.lazy.traceSpace = function( ) { return this.get( this.length - 1 ).traceSpace; };


} );
