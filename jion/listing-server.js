module.exports =
{
	app :
		'server',
	list :
		[
			'src/euclid/margin.js',
			'src/euclid/point.js',
			'src/euclid/rect.js',
			'src/euclid/view.js',
			'src/jion/change.js',
			'src/jion/change-ray.js',
			// FUTURE check server really using
			// these two
			'src/jion/change-wrap.js',
			'src/jion/change-wrap-ray.js',
			'src/jion/path.js',
			'src/jion/sign.js',
			'src/jion/sign-ray.js',
			'src/server/resource.js',
			'src/server/inventory.js',
			'src/visual/doc.js',
			'src/visual/label.js',
			'src/visual/note.js',
			'src/visual/para.js',
			'src/visual/portal.js',
			'src/visual/relation.js',
			'src/visual/space.js',

			// built-in genjion
			'src/ast/a-null.js',
			'src/ast/an-and.js',
			'src/ast/an-array-literal.js',
			'src/ast/an-assign.js',
			'src/ast/a-block.js',
			'src/ast/a-boolean-literal.js',
			'src/ast/a-call.js',
			'src/ast/a-case.js',
			'src/ast/a-check.js',
			'src/ast/a-comma-list.js',
			'src/ast/a-comment.js',
			'src/ast/a-condition.js',
			'src/ast/a-delete.js',
			'src/ast/a-differs.js',
			'src/ast/a-dot.js',
			'src/ast/an-equals.js',
			'src/ast/a-fail.js',
			'src/ast/a-file.js',
			'src/ast/a-for.js',
			'src/ast/a-for-in.js',
			'src/ast/a-func.js',
			'src/ast/a-func-arg.js',
			'src/ast/a-greater-than.js',
			'src/ast/an-if.js',
			'src/ast/an-instanceof.js',
			'src/ast/a-less-than.js',
			'src/ast/a-member.js',
			'src/ast/a-new.js',
			'src/ast/a-not.js',
			'src/ast/a-number-literal.js',
			'src/ast/an-obj-literal.js',
			'src/ast/an-or.js',
			'src/ast/a-plus.js',
			'src/ast/a-plus-assign.js',
			'src/ast/a-pre-increment.js',
			'src/ast/a-return.js',
			'src/ast/a-string-literal.js',
			'src/ast/a-switch.js',
			'src/ast/a-typeof.js',
			'src/ast/a-var.js',
			'src/ast/a-var-dec.js',
			'src/ast/a-vlist.js',

			'src/format/context.js',
			'src/jion/gen.js'
		]
};
