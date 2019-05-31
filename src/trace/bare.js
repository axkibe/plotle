/*
| A bare part of a trace.
*/
'use strict';


tim.define( module, ( def, trace_bare ) => {


def.abstract = true;


/*
| Default item tracer.
*/
def.lazy.traceItem =
	function( )
{
	return this.get( this.length - 1 ).traceItem;
};


/*
| Default space tracer.
*/
def.lazy.traceSpace =
	function( )
{
	return this.get( this.length - 1 ).traceSpace;
};


} );
