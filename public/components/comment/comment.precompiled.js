(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['comment'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"commentators-photo\">\n        <img src="
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"comment") : depth0)) != null ? lookupProperty(stack1,"senderPhotoPath") : stack1), depth0))
    + ">\n    </div>\n    <div class=\"commentators-name\"><span>"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"comment") : depth0)) != null ? lookupProperty(stack1,"sender_name") : stack1), depth0))
    + "</span></div>\n    <div class=\"comment-body\"><span>"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"comment") : depth0)) != null ? lookupProperty(stack1,"text") : stack1), depth0))
    + "</span></div>\n    <div class=\"comment-date\">"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"comment") : depth0)) != null ? lookupProperty(stack1,"date") : stack1), depth0))
    + "</div>\n    <div class=\"comment-edit-block\">\n        <img src="
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"paths") : depth0)) != null ? lookupProperty(stack1,"edit") : stack1), depth0))
    + ">\n        <img src="
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"paths") : depth0)) != null ? lookupProperty(stack1,"delete") : stack1), depth0))
    + ">\n</div>";
},"useData":true});
})();