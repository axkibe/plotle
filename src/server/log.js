/*
| Logging utilities.
*/
'use strict';


/*
| Pads the number with a leading zero if below 10.
*/
const pad =
	function( s )
{
	return(
		s < 10
		? '0' + s
		: s
	);
};


/*
| Creates a timestamp.
*/
const timestamp =
	function( )
{
	const now = new Date( );

	return(
		''
		+ pad( now.getMonth( ) + 1 ) + '-'
		+ pad( now.getDate( ) ) + ' '
		+ pad( now.getMonth( ) + 1 ) + '-'
		+ pad( now.getHours( ) ) + ':'
		+ pad( now.getMinutes( ) ) + ':'
		+ pad( now.getSeconds( ) ) + ' :'
	);
};


/*
| Logs a message
*/
module.exports =
	function( )
{
	let args = Array.prototype.slice.call( arguments );

	args.unshift( timestamp( ) );

	console.log.apply( console, args );
};
