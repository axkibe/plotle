/*
| Generates jools like objects from a jools definition.
|
| FIXME remove all mutable pushes
|
| Version 2
|
| Authors: Axel Kittenberger
*/


/*
| Exports.
*/
var
	Generator =
		{ };


/*
| Imports.
*/
var
	Code,
	Jools,
	Validator;


/*
| Capsule.
*/
(function( ) {
'use strict';


/*
| Node includes.
*/
if( SERVER )
{
	Code =
		{
			Assign :
				require( '../code/assign' ),
			Block :
				require( '../code/block' ),
			Comment :
				require( '../code/comment' ),
			File :
				require( '../code/file' ),
			FuncArg :
				require( '../code/func-arg' ),
			Function :
				require( '../code/function' )
		};

	Jools =
		require( '../jools/jools' );

	Validator =
		require( './validator' );
}


/*
| Generates the constructor.
*/
var generateConstructor =
	function(
		joobj,  // the joobj definition
		content
	)
{
	var
		assign;

	content.push(
		Code.Comment.create(
			'content',
				[ 'Constructor.' ]
		)
	);

	assign =
		Code.Assign.create(
			'left',
				[
					'var Comment',
					'Code.Comment'
				],
			'right',
				Code.Function.create(
					'args',
						[
							Code.FuncArg.create(
								'name',
									'tag'
							),
							Code.FuncArg.create(
								'name',
									'v_content',
								'comment',
									'content'
							)
						],
					'block',
						Code.Block.create(
							'content',
								[ ]
						)
				)
		);

	content.push(
		assign
	);
};


/*
| Generates the capsule.
*/
var generateCapsule =
	function(
		joobj // the joobj definition
	)
{
	var
		content =
			[ ];

	generateConstructor( joobj, content );

	return (
		Code.Block.create(
			'content',
				content
		)
	);
};


/*
| Generates code from a jools object definition.
*/
Generator.generate =
	function(
		joobj // the joobj definition
	)
{
	var
		capsule,
		header,
		file;

	Validator.check( joobj );

	header =
		Code.Comment.create(
			'content',
				[
					'This is an autogenerated file.',
					'',
					'DO NOT EDIT!'
				]
		);

	file =
		Code.File.create(
			'header',
				header
		);

	capsule =
		generateCapsule( joobj );


	file =
		file.create(
			'capsule',
				capsule
		);

	return file;
};


/*
| Node export
*/
if( SERVER )
{
	module.exports =
		Generator;
}


} )( );
