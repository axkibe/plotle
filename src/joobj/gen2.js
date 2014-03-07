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
| Creates the joobj data structures to work with.
*/
var
buildJD =
	function(
		joobj
	)
{
	var
		attr,
		// alphabetical sorted attribute names
		attrList =
			[ ],
		attributes =
			{ },
		// list of all arguments passed to
		// constructor
		conVars =
			{ },
		hasJSON =
			!!joobj.json,
		name,
		jsonList =
			[ ],
		// units sorted alphabetically
		unitList =
			null,
		// units used
		units =
			{ };

	// list of attributes
	if( joobj.attributes )
	{
		for( name in joobj.attributes )
		{
			attr =
				joobj.attributes[ name ];

			attributes[ name ] =
				Object.freeze(
					{
						allowsNull :
							attr.allowsNull
							||
							attr.defaultValue === 'null',
						allowsUndefined :
							attr.allowsUndefined
							||
							attr.defaultValue === 'undefined',
						assign :
							attr.assign !== undefined
								?
								attr.assign
								:
								name,
						comment :
							attr.comment,
						concerns :
							attr.concerns,
						defaultValue :
							attr.defaultValue,
						json :
							attr.json,
						name :
							name,
						type :
							attr.type,
						unit :
							attr.unit,
						vName :
							'v_' + name
					}
				);

			if( attr.unit )
			{
				units[ attr.unit ] =
					true;
			}

			if( attr.json )
			{
				hasJSON =
					true;

				jsonList.push( name );
			}

			if(
				attr.assign !== null
				||
				(
					joobj.init
					&&
					joobj.init.indexOf( name ) >= 0
				)
			)
			{
				conVars[ name ] =
					Object.freeze(
						{
							name :
								name,
							comment :
								attr.comment,
							vName :
								attributes[ name ].vName
						}
					);
			}
		}

		attrList =
			Object
				.keys( joobj.attributes )
				.sort( );
	}

	unitList =
		Object.keys( units ).sort( );

	if(
		joobj.init
		&&
		joobj.init.indexOf( 'inherit' ) >= 0
	)
	{
		conVars.inherit =
			Object.freeze(
				{
					name :
						'inherit',
					comment :
						'inheritance',
					vName :
						'inherit'
				}
			);
	}

	if( joobj.twig )
	{
		conVars.twig =
			Object.freeze(
				{
					name :
						'twig',
					comment :
						'twig, set upon change',
					vName :
						'twig'
				}
			);

		conVars.ranks =
			Object.freeze(
				{
					name :
						'ranks',
					comment :
						'twig order, set upon change',
					vName :
						'ranks'
				}
			);

		if( hasJSON )
		{
			jsonList.push( 'twig' );
			jsonList.push( 'ranks' );
		}
	}

	var
		conList =
			Object.keys( conVars );

	conList.sort(
		function( o, p )
		{
			return (
				Jools.compare(
					conVars[ o ].vName,
					conVars[ p ].vName
				)
			);
		}
	);

	jsonList.sort( );

	return Object.freeze(
		{
			attrList :
				attrList,
			attributes :
				attributes,
			conList :
				conList,
			conVars :
				conVars,
			equals :
				joobj.equals,
			init :
				joobj.init,
			hasJSON :
				hasJSON,
			jsonList :
				jsonList,
			name :
				joobj.name,
			node :
				joobj.node,
			// in case unit and joobj are named identically
			// the shortcut will be renamed
			reference :
				( joobj.unit === joobj.name )
				?
				joobj.name + 'Obj'
				:
				joobj.name,
			singleton :
				joobj.singleton,
			subclass :
				joobj.subclass,
			twig :
				joobj.twig,
			unit :
				joobj.unit,
			unitList :
				unitList
		}
	);
};



/*
| Generates the constructor.
*/
var generateConstructor =
	function(
		jd,      // the joobj data
		content  // content to append to
	)
{
	var
		a,
		aZ,
		args,
		assign,
		left,
		name,
		right;

	content.push(
		Code.Comment.create(
			'content',
				[ 'Constructor.' ]
		)
	);

	if( jd.unit )
	{
		left =
			[
				'var ' + jd.reference,
				jd.unit + '.' + jd.name
			];
	}
	else
	{
		left =
			jd.refrence;
	}

	args =
		[
			Code.FuncArg.create(
				'name',
					'tag'
			)
		];

	for(
		a = 0, aZ = jd.conList.length;
		a < aZ;
		a++
	)
	{
		name =
			jd.conList[ a ];

		args.push(
			Code.FuncArg.create(
				'name',
					jd.conVars[ name ].vName,
				'comment',
					jd.conVars[ name ].comment
			)
		);
	}

	right =
		Code.Function.create(
			'args',
				args,
			'block',
				Code.Block.create(
					'content',
						[ ]
				)
		);


	assign =
		Code.Assign.create(
			'left',
				left,
			'right',
				right
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
		jd // the joobj data
	)
{
	var
		content =
			[ ];

	generateConstructor( jd, content );

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
		file,
		jd;

	Validator.check( joobj );

	jd =
		buildJD( joobj );

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
		generateCapsule( jd );


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
