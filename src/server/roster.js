/*
| The roster of all resources.
*/

/*
| Capsule
*/
( function( ) {
'use strict';


/*
| Imports
*/
var
	resource;

resource = require( './resource' );


module.exports =
[
	resource.create(
		'aliases', [ 'ideoloom.html', 'index.html', '' ],
		'filePath', 'media/ideoloom.html',
		'maxage', 'short',
		'postProcessor', 'indexHtml'
	),
	resource.create(
		'aliases', [ 'devel.html' ],
		'filePath', 'media/devel.html',
		'devel', true,
		'postProcessor', 'develHtml'
	),
	resource.create(
		'aliases', [ 'favicon.ico' ],
		'filePath', 'media/favicon.ico',
		'maxage', 'long'
	),
	resource.create(
		'filePath', 'webfont/webfont.js',
		'maxage', 'long'
	),
	resource.create(
		'filePath', 'src/jion/proto.js',
		'inBundle', true,
		'inTestPad', true
	),
	resource.create(
		'filePath', 'src/jools/jools.js',
		'inBundle', true,
		'inTestPad', true
	),
	resource.create(
		'filePath', 'src/jools/sha1.js',
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/jion/path.js',
		'inBundle', true,
		'hasJion', true,
		'inTestPad', true
	),
	resource.create(
		'filePath', 'src/result/changeTree.js',
		'hasJion', true,
		'inBundle', true,
		'inTestPad', true
	),
	resource.create(
		'filePath', 'src/ccot/sign.js',
		'hasJion', true,
		'inBundle', true,
		'inTestPad', true
	),
	resource.create(
		'filePath', 'src/ccot/signRay.js',
		'hasJion', true,
		'inBundle', true,
		'inTestPad', true
	),
	resource.create(
		'filePath', 'src/ccot/change.js',
		'hasJion', true,
		'inBundle', true,
		'inTestPad', true
	),
	resource.create(
		'filePath', 'src/ccot/changeRay.js',
		'hasJion', true,
		'inBundle', true,
		'inTestPad', true
	),
	resource.create(
		'filePath', 'src/ccot/changeWrap.js',
		'hasJion', true,
		'inBundle', true,
		'inTestPad', true
	),
	resource.create(
		'filePath', 'src/ccot/changeWrapRay.js',
		'hasJion', true,
		'inBundle', true,
		'inTestPad', true
	),

	resource.create(
		'filePath', 'src/change/error.js',
		'inBundle', true,
		'inTestPad', true
	),
	resource.create(
		'filePath', 'src/change/generic.js',
		'inBundle', true,
		'inTestPad', true
	),
	resource.create(
		'filePath', 'src/change/insert.js',
		'hasJion', true,
		'inBundle', true,
		'inTestPad', true
	),
	resource.create(
		'filePath', 'src/change/join.js',
		'hasJion', true,
		'inBundle', true,
		'inTestPad', true
	),
	resource.create(
		'filePath', 'src/change/remove.js',
		'hasJion', true,
		'inBundle', true,
		'inTestPad', true
	),
	resource.create(
		'filePath', 'src/change/ray.js',
		'hasJion', true,
		'inBundle', true,
		'inTestPad', true
	),
	resource.create(
		'filePath', 'src/change/set.js',
		'hasJion', true,
		'inBundle', true,
		'inTestPad', true
	),
	resource.create(
		'filePath', 'src/change/split.js',
		'hasJion', true,
		'inBundle', true,
		'inTestPad', true
	),
	resource.create(
		'filePath', 'src/change/wrap.js',
		'hasJion', true,
		'inBundle', true,
		'inTestPad', true
	),
	resource.create(
		'filePath', 'src/change/wrapRay.js',
		'hasJion', true,
		'inBundle', true,
		'inTestPad', true
	),

	resource.create(
		'filePath', 'src/euclid/point.js',
		'hasJion', true,
		'inBundle', true,
		'inTestPad', true
	),
	resource.create(
		'filePath', 'src/euclid/fixPoint.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/euclid/rect.js',
		'hasJion', true,
		'inBundle', true,
		'inTestPad',
			true
	),
	resource.create(
		'filePath', 'src/shell/fontpool.js',
		'inBundle', true,
		'inTestPad', true
	),
	resource.create(
		'filePath', 'src/euclid/constants.js',
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/euclid/compass.js',
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/euclid/margin.js',
		'hasJion', true,
		'inBundle', true,
		'inTestPad', true
	),
	resource.create(
		'filePath', 'src/euclid/font.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/euclid/display.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/euclid/measure.js',
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/euclid/shape.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/euclid/roundRect.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/euclid/ellipse.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/euclid/line.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/euclid/arrow.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/design/anchorPoint.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/design/anchorRect.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/design/anchorEllipse.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/shell/theme.js',
		'inBundle', true,
		'inTestPad', true
	),
	resource.create(
		'filePath', 'src/euclid/view.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/widgets/widget.js',
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/widgets/style.js',
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/widgets/button.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/widgets/input.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/widgets/checkbox.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/widgets/label.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/shell/style.js',
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/shell/accent.js',
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/fabric/spaceRef.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/reply/acquire.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/reply/alter.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/reply/auth.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/reply/error.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/reply/register.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/reply/update.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/request/acquire.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/request/alter.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/request/auth.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/request/register.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/request/update.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/net/requestWrap.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/net/requestWrapRay.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/net/channel.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/net/ajax.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/net/link.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/shell/doTracker.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/shell/alter.js',
		'inBundle', true,
		'inTestPad', true
	),
	resource.create(
		'filePath', 'src/icons/normal.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/icons/moveto.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/icons/remove.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/icons/check.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/discs/disc.js',
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/discs/createdisc.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/discs/maindisc.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/discs/jockey.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/result/hover.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/forms/form.js',
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/forms/login.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/forms/signup.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/forms/space.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/forms/moveto.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/forms/user.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/forms/welcome.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/forms/noAccessToSpace.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/forms/nonExistingSpace.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/forms/jockey.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/gruga/maindisc.js',
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/gruga/createdisc.js',
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/gruga/login.js',
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/gruga/moveto.js',
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/gruga/noAccessToSpace.js',
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/gruga/nonExistingSpace.js',
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/gruga/signup.js',
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/gruga/space.js',
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/gruga/user.js',
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/gruga/welcome.js',
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/fabric/para.js',
		'hasJion', true,
		'inBundle', true,
		'inTestPad', true
	),
	resource.create(
		'filePath', 'src/visual/scrollbar.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/fabric/doc.js',
		'hasJion', true,
		'inBundle', true,
		'inTestPad', true
	),
	resource.create(
		'filePath', 'src/fabric/item.js',
		'inBundle', true,
		'inTestPad', true
	),
	resource.create(
		'filePath', 'src/fabric/docItem.js',
		'inBundle', true,
		'inTestPad', true
	),
	resource.create(
		'filePath', 'src/fabric/note.js',
		'hasJion', true,
		'inBundle', true,
		'inTestPad', true
	),
	resource.create(
		'filePath', 'src/fabric/label.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/fabric/relation.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/fabric/portal.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/fabric/space.js',
		'hasJion', true,
		'inBundle', true,
		'inTestPad', true
	),
	resource.create(
		'filePath', 'src/shell/stubs.js',
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/shell/system.js',
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/mark/text.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/mark/caret.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/mark/item.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/mark/range.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/mark/widget.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/actions/isAction.js',
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/actions/createGeneric.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/actions/createRelation.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/actions/itemDrag.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/actions/itemResize.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/actions/pan.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/actions/scrolly.js',
		'hasJion', true,
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/shell/root.js',
		'inBundle', true
	),
	resource.create(
		'filePath', 'src/shell/fontloader.js',
		'inBundle', true
	),
	resource.create(
		'filePath', 'media/dejavusans/style.css',
		'maxage', 'long'
	),
	resource.create(
		'filePath', 'media/dejavusans/boldoblique-webfont.eot',
		'maxage', 'long'
	),
	resource.create(
		'filePath', 'media/dejavusans/boldoblique-webfont.svg',
		'maxage', 'long'
	),
	resource.create(
		'filePath', 'media/dejavusans/boldoblique-webfont.ttf',
		'maxage', 'long'
	),
	resource.create(
		'filePath', 'media/dejavusans/boldoblique-webfont.woff',
		'maxage', 'long'
	),
	resource.create(
		'filePath', 'media/dejavusans/bold-webfont.eot',
		'maxage', 'long'
	),
	resource.create(
		'filePath', 'media/dejavusans/bold-webfont.svg',
		'maxage', 'long'
	),
	resource.create(
		'filePath', 'media/dejavusans/bold-webfont.ttf',
		'maxage', 'long'
	),
	resource.create(
		'filePath', 'media/dejavusans/bold-webfont.woff',
		'maxage', 'long'
	),
	resource.create(
		'filePath', 'media/dejavusans/oblique-webfont.eot',
		'maxage', 'long'
	),
	resource.create(
		'filePath', 'media/dejavusans/oblique-webfont.svg',
		'maxage', 'long'
	),
	resource.create(
		'filePath', 'media/dejavusans/oblique-webfont.ttf',
		'maxage', 'long'
	),
	resource.create(
		'filePath', 'media/dejavusans/oblique-webfont.woff',
		'maxage', 'long'
	),
	resource.create(
		'filePath', 'media/dejavusans/webfont.eot',
		'maxage', 'long'
	),
	resource.create(
		'filePath', 'media/dejavusans/webfont.svg',
		'maxage', 'long'
	),
	resource.create(
		'filePath', 'media/dejavusans/webfont.ttf',
		'maxage', 'long'
	),
	resource.create(
		'filePath', 'media/dejavusans/webfont.woff',
		'maxage', 'long'
	),

	// --- TestPad ---
	resource.create(
		'aliases', [ 'testpad.html' ],
		'filePath', 'media/testpad.html',
		'devel', true,
		'postProcessor', 'testPadHtml'
	),
	resource.create(
		'filePath', 'src/testpad/repository.js',
		'devel', true,
		'hasJion', true,
		'inTestPad', true
	),
	resource.create(
		'filePath', 'src/testpad/doTracker.js',
		'devel', true,
		'hasJion', true,
		'inTestPad', true
	),
	resource.create(
		'filePath', 'src/testpad/action.js',
		'devel', true,
		'hasJion', true,
		'inTestPad', true
	),
	resource.create(
		'filePath', 'src/testpad/root.js',
		'devel', true,
		'hasJion', true,
		'inTestPad', true
	)
];


} )( );
