(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['header'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"search-area-wrap\">\n    <div class=\"search-area\">\n        <img src=\"img/search.svg\" alt=\"\">\n        <input class=\"search-input\" placeholder=\"Найти\">\n    </div>\n</div>\n\n<div class=\"notification-icon\">\n    <img class=\"header-icon\" src=\"img/noticeUnread.svg\" alt=\"\">\n</div>\n\n<div class=\"profile-icon\">\n    <a href="
    + alias4(((helper = (helper = lookupProperty(helpers,"profileUrl") || (depth0 != null ? lookupProperty(depth0,"profileUrl") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"profileUrl","hash":{},"data":data,"loc":{"start":{"line":13,"column":12},"end":{"line":13,"column":28}}}) : helper)))
    + ">\n        <img class=\"header-icon\" src="
    + alias4(((helper = (helper = lookupProperty(helpers,"avatar") || (depth0 != null ? lookupProperty(depth0,"avatar") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"avatar","hash":{},"data":data,"loc":{"start":{"line":14,"column":37},"end":{"line":14,"column":49}}}) : helper)))
    + ">\n    </a>\n</div>\n\n<div class=\"profile-menu-icon\">\n    <img class=\"header-icon\" src=\"img/menu.svg\">\n</div>\n";
},"useData":true});
})();