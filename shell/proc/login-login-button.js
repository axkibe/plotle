/*
| Login button on the login panel.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var Proc;
Proc = Proc || {};


/*
| Imports
*/
var Dash;
var Jools;


/*
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }


/*
| Constructor
*/
var LoginLoginButton = Proc.LoginLoginButton =
	function(
		twig,
		panel,
		inherit,
		name
	)
{
	Dash.Button.call(
		this,
		twig,
		panel,
		inherit,
		name
	);
};


Jools.subclass(
	LoginLoginButton,
	Dash.Button
);


/*
| Button is being pushed.
*/
LoginLoginButton.prototype.push =
	function(
		// shift,
		// ctrl
	)
{
	Proc.util.login( this.panel );
};


} )( );
