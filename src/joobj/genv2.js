/*
| Generates jooled objects from a jools definition.
|
| FIXME remove all mutable pushes
|
| Version 2
|
| Authors: Axel Kittenberger
*/


/*
| Capsule.
*/
(function( ) {
'use strict';


/*
| The joobj definition.
*/
if( JOOBJ )
{
	return {
		name :
			'GenV2',
		node :
			true,
		attributes :
			{
				'joobj' :
					{
						comment :
							'the joobj definition',
						type :
							'Object'
					}
			},
		init :
			[ ]
	};
}


var
	Code =
		{
			Assign :
				require( '../code/assign' ),
			Block :
				require( '../code/block' ),
			Call :
				require( '../code/call' ),
			Check :
				require( '../code/check' ),
			Comment :
				require( '../code/comment' ),
			If :
				require( '../code/if' ),
			Fail :
				require( '../code/fail' ),
			File :
				require( '../code/file' ),
			Func :
				require( '../code/func' ),
			FuncArg :
				require( '../code/func-arg' ),
			Switch :
				require( '../code/switch' ),
			Term :
				require( '../code/term' ),
			TList :
				require( '../code/tlist' ),
			VarDec :
				require( '../code/var-dec' ),
			VList :
				require( '../code/vlist' )
		},
	Generator =
		require( '../joobj/this' )( module ),
//	Jools =
//		require( '../jools/jools' ),
	Validator =
		require( './validator' );


/*
| Shortcut for creating assignments.
*/
var
Assign =
	function(
		left,
		right
	)
{
	return (
		Code.Assign.create(
			'left',
				left,
			'right',
				right
		)
	);
};


/*
| Shortcut for creating blocks.
*/
var
Block =
	function( )
{
	return Code.Block.create( );
};


/*
| Shortcut for creating calls
*/
var
Call =
	function(
		func
	)
{
	return (
		Code.Call.create(
			'func',
				func
		)
	);
};


/*
| Shortcut for creating files.
*/
var
File =
	function( )
{
	return Code.File.create( );
};


/*
| Shortcut for creating functions.
*/
var
Func =
	function(
		block
	)
{
	var
		func =
			Code.Func.create(
				'block',
					block || null
			);

	return func;
};


/*
| Shortcut for creating switch statements.
*/
var
Switch =
	function(
		statement
	)
{
	return (
		Code.Switch.create(
			'statement',
				statement
		)
	);
};


/*
| Shortcut for creating terms.
*/
var
Term =
	function(
		term
	)
{
	return (
		Code.Term.create(
			'term',
				term
		)
	);
};


/*
| Shortcut for creating term lists.
*/
var
TList =
	function( )
{
	return Code.TList.create( );
};



/*
| Shortcut for variable declerations.
*/
/*
var
VarDec =
	function(
		name,   // variable name
		assign  // variable assignment
	)
{
	return (
		Code.VarDec.create(
			'name',
				name,
			'assign',
				assign || null
		)
	);
};
*/


/*
| Shortcut for creating vlists.
*/
var
VList =
	function( )
{
	return Code.VList.create( );
};



/*
| Initialized a generator
*/
Generator.prototype._init =
	function( )
{
	var
		assign,
		attr,
		attributes =
			{ },
		attrList,
		jAttr,
		joobj =
			this.joobj,
		name;
			
			
	this.init =
		joobj.init;

	this.unit =
		joobj.unit;

	this.name =
		joobj.name;

	this.hasJSON =
		!!joobj.json;

	this.tag =
		Math.floor( Math.random( ) * 1000000000 );

	for( name in joobj.attributes || { } )
	{
		jAttr =
			joobj.attributes[ name ];

		if( jAttr.json )
		{
			this.hasJSON =
				true;
		}

		assign =
			jAttr.assign !== undefined ?
				jAttr.assign
				:
				name;

		attr =
		attributes[ name ] =
			Object.freeze( {
				allowsNull :
					jAttr.allowsNull
					||
					jAttr.defaultValue === 'null',
				allowsUndefined :
					jAttr.allowsUndefined
					||
					jAttr.defaultValue === 'undefined',
				assign :
					assign,
				comment :
					jAttr.comment,
				inConstructor :
					assign !== null
					||
					(
						this.init
						&&
						this.init.indexOf( name ) >= 0
					),
				json :
					jAttr.json,
				name :
					name,
				type :
					jAttr.type,
				unit :
					jAttr.unit,
				vName :
					'v_' + name
			} );
	}

	attrList =
		Object.keys( attributes );

	attrList.sort( );

	this.attrList =
		attrList;

	this.attributes =
		Object.freeze( attributes );

	this.reference =
		( joobj.unit === joobj.name ) ?
			joobj.name + 'Obj'
			:
			joobj.name;

};


/*
| Creates the joobj data structures to work with.
*/
/*
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
		name,
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
						concerns :
							attr.concerns,
						defaultValue :
							attr.defaultValue,
						json :
							attr.json,
						name :
							name,
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
			singleton :
				joobj.singleton,
			subclass :
				joobj.subclass,
			twig :
				joobj.twig,
			unitList :
				unitList
		}
	);
};
*/


/*
| Generates the imports section.
*/
Generator.prototype.genImportsSection =
	function(
		capsule // block to append to
	)
{
	capsule =
		capsule.Comment(
			'Imports.'
		);

	capsule =
		capsule
			.VarDec( 'JoobjProto' )
			.VarDec( 'Jools' );

	return capsule;
};

/*
| Generates the node include section.
*/
Generator.prototype.genNodeIncludesSection =
	function(
		capsule // block to append to
	)
{
	var
		block;

	capsule =
		capsule.Comment(
			'Node includes.'
		);

	block =
		Block( )
		.Assign(
			Term( 'JoobjProto' ),
			Term( 'require( \'../src/joobj/proto\' )' )
		)
		.Assign(
			Term( 'Jools' ),
			Term( 'require( \'../src/jools/jools\' )' )
		);

	capsule =
		capsule.If(
			Term( 'SERVER' ),
			block
		);

	return capsule;
};


/*
| Generates the constructor.
*/
Generator.prototype.genConstructor =
	function(
		capsule // block to append to
	)
{
	var
		a,
		aZ,
		attr,
		block,
		constructor,
		name;

	capsule =
		capsule.Comment(
			'Constructor.'
		);

	block =
		Block( )
		.Check(
			Block( ).
			If(
				Term( 'tag !== ' + this.tag ),
				Block( )
					.Fail( )
			)
		);

	for(
		a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.attrList[ a ],
		attr =
			this.attributes[ name ];

		if( attr.assign === null )
		{
			continue;
		}

		block =
			block.Assign(
				Term( 'this.' + attr.assign ),
				Term( attr.vName )
			);
	}

	block =
		block.Term(
			'Jools.immute( this )'
		);

	constructor =
		Func( block )
		.Arg(
			'tag',
			'magic cookie'
		);

	for(
		a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.attrList[ a ];

		attr =
			this.attributes[ name ];

		if( !attr.inConstructor )
		{
			continue;
		}

		constructor =
			constructor.Arg(
				attr.vName,
				attr.comment
			);
	}
	// XXX

	if( this.unit )
	{
		capsule =
			capsule.VarDec(
				this.reference,
				Assign(
					Term(
						this.unit + '.' + this.name
					),
					constructor
				)
			);
	}
	else
	{
		throw new Error( 'TODO' );
	}

	return capsule;
};


/*
| Generates the creators variable list.
*/
Generator.prototype.genCreatorVariables =
	function(
		block // block to append to
	)
{
	var
		a,
		aZ,
		name,
		varList =
			[ ];

	for( name in this.attributes )
	{
		varList.push( this.attributes[ name ].vName );
	}

	varList.push( 'inherit' );
	varList.sort( );

	for(
		a = 0, aZ = varList.length;
		a < aZ;
		a++
	)
	{
		block =
			block.VarDec( varList[ a ] );
	}

	return block;
};


/*
| Generates the creators inheritance receiver.
*/
Generator.prototype.genCreatorInheritanceReceiver =
	function(
		block // block to append to
	)
{
	var
		a,
		aZ,
		attr,
		name,
		receiver =
			Block( )
			.Assign(
				Term( 'inherit' ),
				Term( 'this' )
			);

	if( this.twig )
	{
		throw new Error( 'TODO' );
	}

	for(
		a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.attrList[ a ];

		attr =
			this.attributes[ name ];

		if( attr.assign === null )
		{
			continue;
		}

		receiver =
			receiver.Assign(
				Term( attr.vName ),
				Term( 'this.' + attr.assign )
			);
	}

	return (
		block.If(
			Term( 'this !== ' + this.reference ),
			receiver
		)
	);
};


/*
| Generates the creators free strings parser.
*/
Generator.prototype.genCreatorFreeStringsParser =
	function(
		block // block to append to
	)
{
	var
		attr,
		loop,
		name,
		switchExpr;

	loop =
		Block( ).
		VarDec(
			'arg',
			Term( 'arguments[ a + 1 ]' )
		);

	switchExpr =
		Switch( Term( 'arguments[ a ]' ) );

	for(
		var a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.attrList[ a ];

		attr =
			this.attributes[ name ];

		switchExpr =
			switchExpr
			.Case(
				Term( '\'' + name + '\'' ),
				Block( )
				.If(
					Term( 'arg !== undefined' ),
					Block( )
					.Assign(
						Term( attr.vName ),
						Term( 'arg' )
					)
				)
			);
	}

	switchExpr =
		switchExpr.Default(
			Block( )
			.Check(
				Block( )
				.Fail( 'invalid argument' )
			)
		);

	loop =
		loop.append( switchExpr );

	block =
		block.For(
			VList( )
				.VarDec( 'a', Term( '0' ) )
				.VarDec( 'aZ', Term( 'arguments.length' ) ),
			Term( 'a < aZ' ),
			Term( 'a += 2' ),
			loop
		);

	return block;
};


/*
| Generates the creators default values
*/
Generator.prototype.genCreatorDefaults =
	function(
		block,   // block to append to
		json     // only do jsons
	)
{
	var
		a,
		aZ,
		attr,
		name;

	for(
		a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.attrList[ a ];

		attr =
			this.attributes[ name ];

		if( json && !attr.json )
		{
			continue;
		}

		if( attr.defaultValue )
		{
			block =
				block
				.If(
					Term( attr.vName + ' === undefined' ),
					Block( )
					.Assign(
						Term( attr.vName ),
						Term( attr.defaultValue )
					)
				);
		}
	}

	return block;
};


/*
| Generates the creators checks
*/
Generator.prototype.genCreatorChecks =
	function(
		block // block to append to
	)
{
	var
		attr,
		check,
		cond,
		name,
		skip,
		tcheck,
		tfail;

	check =
		Block( );

	for(
		var a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.attrList[ a ];

		attr =
			this.attributes[ name ];

		if( !attr.allowsUndefined )
		{
			check =
				check.If(
					Term( attr.vName + ' === undefined' ),
					Block( )
					.Fail( 'undefined attribute ' + name )
				);
		}

		if( !attr.allowsNull )
		{
			check =
				check.If(
					Term( attr.vName + ' === null' ),
					Block( )
					.Fail( 'attribute ' + name + ' must not be null.' )
				);
		}

		switch( attr.type )
		{
			case 'Action' :
			case 'Array' :
			case 'Function' :
			case 'Item' :
			case 'Mark' :
			case 'Object' :
			case 'Tree' :

				skip =
					true;

				break;

			default :

				skip =
					false;
		}

		if( !skip )
		{
			if( attr.allowsNull && !attr.allowsUndefined )
			{
				cond =
					Term( attr.vName + ' !== null' );
			}
			else if( !attr.allowsNull && attr.allowsUndefined )
			{
				cond =
					Term( attr.vName + ' !== undefined' );
			}
			else if( attr.allowsNull && attr.allowsUndefine )
			{
				// FUTURE multilined
				cond =
					Term(
						attr.vName + ' !== null' +
						' && ' +
						attr.vName + ' !== undefined'
					);
			}
			else
			{
				cond =
					null;
			}
		}

		switch( attr.type )
		{
			case 'Boolean' :

				tcheck =
					Term(
						'typeof( ' + attr.vName + ' ) !== \'boolean\''
					);

				break;

			case 'Integer' :

				tcheck =
					Term(
						'typeof( ' + attr.vName  + ' ) !== \'number\'' +
						' || ' +
						'Math.floor( ' + attr.vName + ' ) !== ' + attr.vNae
					);

				break;

			case 'Number' :

				tcheck =
					Term(
						'typeof( ' + attr.vName  + ' ) !== \'number\''
					);

				break;


			case 'String' :

				tcheck =
					Term(
						'typeof( ' + attr.vName  + ' )' + ' !== \'string\'' +
						' && ' +
						'!( ' + attr.vName + ' instanceof String )'
					);

				break;

			default :

				tcheck =
					Term(
						attr.vName + '.reflect !== \'' + attr.type + '\''
					);

				break;
		}

		tfail =
			Block( ).
			Fail( 'type mismtach' );

		if( cond )
		{
			check =
				check.If(
					cond,
					Block.If(
						tcheck,
						tfail
					)
				);
		}
		else
		{
			check =
				check.If(
					tcheck,
					tfail
				);
		}
	}


	// FIXME, in case of check is empty
	//        do not append

	block =
		block.Check(
			check
		);

	return block;
};


/*
| Generates the creators unchanged detection,
| returning this.
*/
Generator.prototype.genCreatorUnchanged =
	function(
		block // block to append to
	)
{
	var
		attr,
		name,
		tList;

	tList =
		TList( )
		.Term( 'inherit' );


	if( this.twig )
	{
		tList =
			tList
			.Term( '&&' )
			.Term(' !twigDup' );
	}

	for(
		var a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.attrList[ a ];

		attr =
			this.attributes[ name ];

		if( attr.assign === null )
		{
			tList =
				tList
				.Term( '&&' )
				.Term( attr.vName + ' === null' );
		}

		switch( attr.type )
		{

			case 'Array' : // FIXME
			case 'Boolean' :
			case 'Function' :
			case 'Integer' :
			case 'Mark' : // FIXME
			case 'Number' :
			case 'Object' :
			case 'String' :
			case 'Tree' : // FIXME

				tList =
					tList
					.Term( '&&' )
					.Term(
						attr.vName +
						' === inherit.' + attr.assign
					);

				break;

			default :

				if( !attr.allowsNull && !attr.allowsUndefined )
				{
					tList =
						tList
						.Term( '&&' )
						.Term(
							attr.vName +
							'.equals( inherit.' + attr.assign
						);
				}
				else
				{
					tList =
						tList
						.Term( '&&' )
						.Term( '(' )
						.Term(
							attr.vName + ' === inherit.' + attr.assign
						)
						.Term( '||' )
						.Term( '(' )
						.Term( attr.vName )
						.Term( '&&' )
						.Term(
							attr.vName +
							'.equals( inherit.' + attr.assign
						)
						.Term( ')' )
						.Term( ')' );
				}
		}
	}

	block =
		block.If(
			tList,
			Block( )
			.Return( Term( 'inherit' ) )
		);

	return block;
};


/*
| Generates the creators return statement
*/
Generator.prototype.genCreatorReturn =
	function(
		block // block to append to
	)
{
	var
		attr,
		call,
		name;

	call =
		Call(
			Term( this.reference )
		)
		.append(
			Term( '' + this.tag )
		);

	for(
		var a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.attrList[ a ];

		attr =
			this.attributes[ name ];
			
		call =
			call
			.append(
				Term( attr.vName )
			);
	}

	return block.Return( call );
};


/*
| Generates the creator.
*/
Generator.prototype.genCreator =
	function(
		capsule // block to append to
	)
{
	var
		block;

	capsule =
		capsule.Comment(
			'Creates a new ' + this.name + ' object.'
		);

	block =
		Block( );

	block =
		this.genCreatorVariables( block );

	block =
		this.genCreatorInheritanceReceiver( block );

	block =
		this.genCreatorFreeStringsParser( block );

	block =
		this.genCreatorDefaults( block, false );

	block =
		this.genCreatorChecks( block );

	block =
		this.genCreatorUnchanged( block );

	block =
		this.genCreatorReturn( block );

	capsule =
		capsule
		.Assign(
			Term( this.reference + '.create' ),
			Assign(
				Term( this.reference + '.prototype.create' ),
				Func( block )
				.Arg(
					null,
					'free strings'
				)
			)
		);

	return capsule;
};


/*
| Generates the from JSON creators variable list.
*/
Generator.prototype.genFromJSONCreatorVariables =
	function(
		block // block to append to
	)
{
	var
		a,
		aZ,
		name,
		varList =
			[ ];

	for( name in this.attributes )
	{
		varList.push( this.attributes[ name ].vName );
	}

	varList.push( 'arg' );

	varList.sort( );

	for(
		a = 0, aZ = varList.length;
		a < aZ;
		a++
	)
	{
		block =
			block.VarDec( varList[ a ] );
	}

	return block;
};

/*
| Generates the from JSON creators JSON parser.
*/
Generator.prototype.genFromJSONCreatorParser =
	function(
		block,   // block to append
		jsonList
	)
{
	var
		a,
		aZ,
		arg,
		attr,
		// block built for cases
		caseBlock,
		name,
		// the switch
		switchExpr;

	switchExpr =
		Switch(
			Term( 'name' )
		)
		.Case(
			Term( '\'type\'' ),
			Block( )
			.If(
				Term( 'arg !== \'' + this.name + '\'' ),
				Block( )
				.Fail( 'invalid JSON ' )
			)
		);

	for(
		a = 0, aZ = jsonList.length;
		a < aZ;
		a++
	)
	{
		name =
			jsonList[ a ];

		if( name === 'twig' || name === 'ranks' )
		{
			throw new Error( 'TODO' );
		}

		attr =
			this.attributes[ name ];

		switch( attr.type )
		{
			case 'Boolean' :
			case 'Integer' :
			case 'Number' :
			case 'String' :

				arg =
					Term( 'arg' );

				break;

			default :

				arg =
					Term(
						(
							attr.unit ?
							( attr.unit + '.' )
							:
							''
						)
						+
						attr.type
						+
						'.createFromJSON( arg )'
					);
		}

		caseBlock =
			Block( )
			.Assign(
				Term( attr.vName ),
				arg
			);

		switchExpr =
			switchExpr
			.Case(
				Term( '\'' + name + '\'' ),
				caseBlock
			);
	}

	block =
		block
		.ForIn(
			'name',
			Term( 'json' ),
			Block( )
			.append(
				switchExpr
			)
		);

	return block;
};


/*
| Generates the from JSON creator.
*/
Generator.prototype.genFromJSONCreator =
	function(
		capsule // block to append to
	)
{
	var
		a,
		aZ,
		attr,
		// function contents
		funcBlock,
		// all attributes expected from JSON
		name,
		jsonList =
			[ ];

	//generateChecks( r, jj, true );

	for(
		a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.attrList[ a ];

		attr =
			this.attributes[ name ];

		if( attr.json )
		{
			jsonList.push( name );
		}
	}

	if( this.twig )
	{
		jsonList.push( 'twig', 'ranks' );
	}

	jsonList.sort( );

	capsule =
		capsule.Comment(
			'Creates a new ' + this.name + ' object from JSON.'
		);

	funcBlock =
		this.genFromJSONCreatorVariables(
			Block( )
		);

	// TODO remove
	funcBlock =
		funcBlock
		.If(
			Term( 'json._$grown' ),
			Block( )
			.Return(
				Term( 'json' )
			)
		);

	funcBlock =
		this.genFromJSONCreatorParser( funcBlock, jsonList );

	funcBlock =
		this.genCreatorDefaults( funcBlock, true );

	funcBlock =
		this.genCreatorChecks( funcBlock );

	capsule =
		capsule
		.Assign(
			Term( this.reference + '.createFromJSON' ),
			Func( funcBlock )
			.Arg(
				'json',
				'the JSON object'
			)
		);

	return capsule;
};


/*
| Returns generator with the capsule generated.
*/
Generator.prototype.genCapsule =
	function( )
{
	var
		capsule =
			Block( );

	capsule =
		this.genImportsSection(
			capsule
		);

	capsule =
		this.genNodeIncludesSection(
			capsule
		);

	capsule =
		this.genConstructor(
			capsule
		);

	capsule =
		this.genCreator(
			capsule
		);

/*TODO
	if( this.hasJSON )
	{
		capsule =
			this.genFromJSONCreator(
				capsule
			);
	}
*/

	return capsule;
};


/*
| Generates code from a jools object definition.
*/
Generator.generate =
	function(
		joobj // the joobj definition
	)
{
	Validator.check( joobj );

	var
		file,
		gen;

	gen =
		Generator.create(
			'joobj',
				joobj
		);


	file =
		File( )
		.Header(
			'This is an auto generated file.',
			'',
			'DO NOT EDIT!'
		).Capsule(
			gen.genCapsule( )
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
