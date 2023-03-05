(function () {
  const template = Handlebars.template; const templates = Handlebars.templates = Handlebars.templates || {}
  templates.feed = template({
    1: function (container, depth0, helpers, partials, data) {
      let stack1; let helper; const alias1 = container.lambda; const alias2 = container.escapeExpression; const alias3 = depth0 != null ? depth0 : (container.nullContext || {}); const lookupProperty = container.lookupProperty || function (parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName]
        }
        return undefined
      }

      return '        \r\n            <a href=' +
    alias2(alias1((depth0 != null ? lookupProperty(depth0, 'ref') : depth0), depth0)) +
    '>\r\n                <li class="nav-item">\r\n                    <img class="nav-item-icon" src=' +
    alias2(alias1((depth0 != null ? lookupProperty(depth0, 'iconPath') : depth0), depth0)) +
    '/>\r\n                    <img class="nav-item-icon" src=' +
    alias2(alias1((depth0 != null ? lookupProperty(depth0, 'hoveredIconPath') : depth0), depth0)) +
    '/>\r\n                    <div class="nav-item-text"><span>' +
    alias2(((helper = (helper = lookupProperty(helpers, 'title') || (depth0 != null ? lookupProperty(depth0, 'title') : depth0)) != null ? helper : container.hooks.helperMissing), (typeof helper === 'function' ? helper.call(alias3, { name: 'title', hash: {}, data, loc: { start: { line: 14, column: 53 }, end: { line: 14, column: 64 } } }) : helper))) +
    '</span></div>\r\n' +
    ((stack1 = lookupProperty(helpers, 'if').call(alias3, (depth0 != null ? lookupProperty(depth0, 'notifies') : depth0), { name: 'if', hash: {}, fn: container.program(2, data, 0), inverse: container.noop, data, loc: { start: { line: 15, column: 20 }, end: { line: 17, column: 27 } } })) != null ? stack1 : '') +
    '                </li>\r\n            </a>\r\n\r\n'
    },
    2: function (container, depth0, helpers, partials, data) {
      let helper; const lookupProperty = container.lookupProperty || function (parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName]
        }
        return undefined
      }

      return '                        <div class="nav-item-notify"><p>' +
    container.escapeExpression(((helper = (helper = lookupProperty(helpers, 'notifies') || (depth0 != null ? lookupProperty(depth0, 'notifies') : depth0)) != null ? helper : container.hooks.helperMissing), (typeof helper === 'function' ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}), { name: 'notifies', hash: {}, data, loc: { start: { line: 16, column: 56 }, end: { line: 16, column: 70 } } }) : helper))) +
    '</p></div>\r\n'
    },
    compiler: [8, '>= 4.3.0'],
    main: function (container, depth0, helpers, partials, data) {
      let stack1; let helper; const alias1 = depth0 != null ? depth0 : (container.nullContext || {}); const alias2 = container.hooks.helperMissing; const alias3 = 'function'; const alias4 = container.escapeExpression; const lookupProperty = container.lookupProperty || function (parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName]
        }
        return undefined
      }

      return '<div class="logo-block">\r\n    <img class="logo-pic" src=' +
    alias4(((helper = (helper = lookupProperty(helpers, 'logoPath') || (depth0 != null ? lookupProperty(depth0, 'logoPath') : depth0)) != null ? helper : alias2), (typeof helper === alias3 ? helper.call(alias1, { name: 'logoPath', hash: {}, data, loc: { start: { line: 2, column: 30 }, end: { line: 2, column: 44 } } }) : helper))) +
    '/>\r\n    <div class="logo-text">' +
    alias4(((helper = (helper = lookupProperty(helpers, 'logoTitle') || (depth0 != null ? lookupProperty(depth0, 'logoTitle') : depth0)) != null ? helper : alias2), (typeof helper === alias3 ? helper.call(alias1, { name: 'logoTitle', hash: {}, data, loc: { start: { line: 3, column: 27 }, end: { line: 3, column: 42 } } }) : helper))) +
    '</div>\r\n</div>\r\n\r\n<div class="nav-list">\r\n    <ol>\r\n' +
    ((stack1 = lookupProperty(helpers, 'each').call(alias1, (depth0 != null ? lookupProperty(depth0, 'itemsList') : depth0), { name: 'each', hash: {}, fn: container.program(1, data, 0), inverse: container.noop, data, loc: { start: { line: 8, column: 8 }, end: { line: 21, column: 17 } } })) != null ? stack1 : '') +
    '    </ol>\r\n</div>\r\n'
    },
    useData: true
  })
})()
