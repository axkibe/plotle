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
	jion,
	server_resource,
	server_resourceList,
	stringList;


jion = require( 'jion' );

server_resource = require( './resource' );

server_resourceList = require( './resourceList' );

stringList = jion.stringList.stringList; // FUTURE

module.exports =
server_resourceList.create(
	'list:init',
	[
	server_resource.create(
		'filePath', 'import/opentype.js',
		'maxage', 'long',
		'postProcessor', 'opentype'
	),
	server_resource.create(
		'filePath', 'import/opentype.min.js',
		'maxage', 'long',
		'postProcessor', 'opentypeMin'
	),
	server_resource.create(
		'aliases', stringList( [ 'ideoloom.html', 'index.html', '' ] ),
		'filePath', 'media/ideoloom.html',
		'maxage', 'short',
		'postProcessor', 'indexHtml'
	),
	server_resource.create(
		'aliases', stringList( [ 'devel.html' ] ),
		'filePath', 'media/devel.html',
		'devel', true,
		'postProcessor', 'develHtml'
	),
	server_resource.create(
		'aliases', stringList( [ 'favicon.ico', 'media-favicon.ico' ] ),
		'filePath', 'media/favicon.ico',
		'maxage', 'long'
	),
	server_resource.create(
		'aliases', stringList( [ 'tim-browser.js' ] ),
		'coding', 'utf-8',
		'data', tim.browserSource,
		'mime', 'text/javascript',
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'aliases', stringList( [ 'tim-proto.js' ] ),
		'coding', 'utf-8',
		'data', tim.proto.source,
		'mime', 'text/javascript',
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'aliases', stringList( [ 'jion-proto.js' ] ),
		'coding', 'utf-8',
		'data', jion.proto.source,
		'mime', 'text/javascript',
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'aliases', stringList( [ 'jioncode-path.js' ] ),
		'coding', 'utf-8',
		'data', jion.path.jionCode,
		'mime', 'text/javascript',
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'aliases', stringList( [ 'jion-path.js' ] ),
		'coding', 'utf-8',
		'data', tim.path.source,
		'mime', 'text/javascript',
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'aliases', stringList( [ 'jioncode-pathList.js' ] ),
		'coding', 'utf-8',
		'data', jion.pathList.jionCode,
		'mime', 'text/javascript',
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'aliases', stringList( [ 'jion-pathList.js' ] ),
		'coding', 'utf-8',
		'data', jion.pathList.source,
		'mime', 'text/javascript',
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/math/limit.js',
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/math/maxInteger.js',
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/shell/settings.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/hash/sha1.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/session/uid.js',
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/change/error.js',
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/change/mark/text.js',
		'hasTim', true,
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/change/mark/node.js',
		'hasTim', true,
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/change/generic.js',
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/change/grow.js',
		'hasTim', true,
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/change/insert.js',
		'hasTim', true,
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/change/join.js',
		'hasTim', true,
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/change/remove.js',
		'hasTim', true,
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/change/list.js',
		'hasTim', true,
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/change/listAppend.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/change/listShorten.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/change/set.js',
		'hasTim', true,
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/change/shrink.js',
		'hasTim', true,
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/change/split.js',
		'hasTim', true,
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/change/wrap.js',
		'hasTim', true,
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/change/wrapList.js',
		'hasTim', true,
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/change/dynamic.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/color.js',
		'hasTim', true,
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/gleam/intern/opentype.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/border.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/borderList.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/point.js',
		'hasTim', true,
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/gleam/size.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/rect.js',
		'hasTim', true,
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/gleam/rectGroup.js',
		'hasTim', true,
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/gleam/gradient/colorStop.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/gradient/askew.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/gradient/radial.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/flow/token.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/flow/line.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/flow/block.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/shell/fontPool.js',
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/gleam/constants.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/margin.js',
		'hasTim', true,
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/gleam/font.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/display/canvas.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/glint/mask.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/glint/border.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/glint/fill.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/glint/paint.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/glint/text.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/glint/window.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/glint/list.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/measure.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/shape/line.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/shape/round.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/shape/start.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/shape.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/shapeList.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/roundRect.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/ellipse.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/line.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/connect.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/arrow.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/facet.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/facetList.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/transform.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/widget/widget.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/widget/button.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/widget/input.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/widget/checkbox.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/widget/label.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/widget/scrollbox.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/ref/space.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/ref/moment.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/ref/momentList.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/ref/spaceList.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/ref/userSpaceList.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/dynamic/refSpaceList.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/reply/acquire.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/reply/alter.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/reply/auth.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/reply/error.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/reply/register.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/reply/update.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/request/acquire.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/request/alter.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/request/auth.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/request/register.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/request/update.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/net/requestWrap.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/net/requestWrapList.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/net/channel.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/net/ajax.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/net/link.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/shell/doTracker.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/disc/disc.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/disc/createDisc.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/disc/mainDisc.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/disc/zoomDisc.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/disc/root.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/result/hover.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/form/form.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/form/loading.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/form/login.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/form/signUp.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/form/space.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/form/moveTo.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/form/user.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/form/welcome.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/form/noAccessToSpace.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/form/nonExistingSpace.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/form/root.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/fonts.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/controls.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/highlight.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/iconCheck.js',
		'inBundle', true
	),
//	server_resource.create(
//		'filePath', 'src/gruga/iconMoveTo.js',
//		'inBundle', true
//	),
	server_resource.create(
		'filePath', 'src/gruga/iconNormal.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/iconZoom.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/iconZoomAll.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/iconZoomHome.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/iconZoomIn.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/iconZoomOut.js',
		'inBundle', true
	),
//	server_resource.create(
//		'filePath', 'src/gruga/iconHand.js',
//		'inBundle', true
//	),
	server_resource.create(
		'filePath', 'src/gruga/iconRemove.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/iconSelect.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/genericButton.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/genericCheckbox.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/genericInput.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/formFacet.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/mainDisc.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/createDisc.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/zoomDisc.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/selection.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/frame.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/scrollbar.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/handles.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/label.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/note.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/portal.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/relation.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/loading.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/login.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/moveto.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/noAccessToSpace.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/nonExistingSpace.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/select.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/signup.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/space.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/user.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/welcome.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/fabric/para.js',
		'hasTim', true,
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/visual/frame.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/widget/scrollbar.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/fabric/doc.js',
		'hasTim', true,
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/fabric/note.js',
		'hasTim', true,
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/fabric/label.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/fabric/relation.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/fabric/portal.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/fabric/space.js',
		'hasTim', true,
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/visual/para.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/visual/doc.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/visual/item.js',
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/visual/docItem.js',
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/visual/space.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/visual/label.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/visual/note.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/visual/portal.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/visual/relation.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/visual/itemList.js',
		'hasTim', true,
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/shell/system.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/visual/mark/text.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/visual/mark/caret.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/visual/mark/items.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/visual/mark/range.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/visual/mark/widget.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/show/create.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/show/form.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/show/zoom.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/show/normal.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/action/createGeneric.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/action/createRelation.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/action/dragItems.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/action/pan.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/action/resizeItems.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/action/scrolly.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/action/select.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/action/zoomButton.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/animation/transform.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/animation/root.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/user/creds.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/user/passhash.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/shell/root.js',
		'hasTim', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/shell/fontloader.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'media/cursor.css',
		'maxage', 'long'
	),
	server_resource.create(
		'filePath', 'media/fonts/DejaVuSans-Regular.ttf',
		'maxage', 'long'
	),
	server_resource.create(
		'filePath', 'media/fonts/NotoSans-Regular.ttf',
		'maxage', 'long'
	),
	server_resource.create(
		'filePath', 'media/fonts/OpenSans-Regular.ttf',
		'maxage', 'long'
	),
	server_resource.create(
		'filePath', 'media/fonts/Roboto-Regular.ttf',
		'maxage', 'long'
	),
	server_resource.create(
		'filePath', 'media/fonts/SourceSansPro-Regular.ttf',
		'maxage', 'long'
	),

	// --- TestPad ---
	server_resource.create(
		'aliases', stringList( [ 'testpad.html' ] ),
		'filePath', 'media/testpad.html',
		'devel', true,
		'postProcessor', 'testPadHtml'
	),
	server_resource.create(
		'filePath', 'src/testpad/repository.js',
		'devel', true,
		'hasTim', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/testpad/action.js',
		'devel', true,
		'hasTim', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/testpad/root.js',
		'devel', true,
		'hasTim', true,
		'inTestPad', true
	)
	]
);


} )( );
