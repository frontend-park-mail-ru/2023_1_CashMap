(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['header'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"search-area-wrap\">\r\n    <div class=\"search-area\">\r\n        <div class=\"search-area-icon\">\r\n        <img src=\"static/img/search.svg\" alt=\"\">\r\n        </div>\r\n        <input class=\"search-input\" placeholder=\"Найти\">\r\n    </div>\r\n</div>\r\n\r\n<div class=\"notification-icon\">\r\n    <img class=\"header-icon\" src=\"static/img/noticeUnread.svg\" alt=\"\">\r\n</div>\r\n\r\n<div class=\"profile-icon\">\r\n    <a href="
    + alias4(((helper = (helper = lookupProperty(helpers,"profileUrl") || (depth0 != null ? lookupProperty(depth0,"profileUrl") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"profileUrl","hash":{},"data":data,"loc":{"start":{"line":15,"column":12},"end":{"line":15,"column":28}}}) : helper)))
    + ">\r\n        <img class=\"header-icon\" src="
    + alias4(((helper = (helper = lookupProperty(helpers,"avatar") || (depth0 != null ? lookupProperty(depth0,"avatar") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"avatar","hash":{},"data":data,"loc":{"start":{"line":16,"column":37},"end":{"line":16,"column":49}}}) : helper)))
    + ">\r\n    </a>\r\n</div>\r\n\r\n<div class=\"profile-menu-icon\">\r\n    <img class=\"header-icon\" src=\"static/img/menu.svg\">\r\n</div>\r\n";
},"useData":true});
})();