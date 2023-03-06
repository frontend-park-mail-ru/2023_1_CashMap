(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['post'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"post-head\">\n        <div class=\"post-author-image\"><img src="
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"post") : depth0)) != null ? lookupProperty(stack1,"senderPhoto") : stack1), depth0))
    + "></div>\n        <div class=\"post-author-name\"><span>"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"post") : depth0)) != null ? lookupProperty(stack1,"sender_name") : stack1), depth0))
    + "</span></div>\n        <div class=\"post-date\">"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"post") : depth0)) != null ? lookupProperty(stack1,"date") : stack1), depth0))
    + "</div>\n        <div class=\"post-edit\"><img src="
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"paths") : depth0)) != null ? lookupProperty(stack1,"postEditIconPath") : stack1), depth0))
    + "></div>\n    </div>\n\n    <div class=\"post-body\">\n        "
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"post") : depth0)) != null ? lookupProperty(stack1,"text") : stack1), depth0))
    + "\n    </div>\n\n    <div class=\"post-bottom\">\n        <button class=\"post-like\">\n            <div class=\"post-like-icon\">\n                <img src="
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"paths") : depth0)) != null ? lookupProperty(stack1,"likeIconPath") : stack1), depth0))
    + ">\n                <img src="
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"paths") : depth0)) != null ? lookupProperty(stack1,"clickedLikeIconPath") : stack1), depth0))
    + ">\n            </div>\n            <div class=\"post-like-number\"><span>"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"post") : depth0)) != null ? lookupProperty(stack1,"likes") : stack1), depth0))
    + "</span></div>\n        </button>\n        <button class=\"post-comments\">\n            <div class=\"post-comments-icon\"><img src="
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"paths") : depth0)) != null ? lookupProperty(stack1,"commentIconPath") : stack1), depth0))
    + "></div>\n            <div class=\"post-comments-number\"><span>"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"post") : depth0)) != null ? lookupProperty(stack1,"commentsNumber") : stack1), depth0))
    + "</span></div>\n        </button>\n        <button>\n            <div class=\"post-bookmark-icon\">\n                <img src="
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"paths") : depth0)) != null ? lookupProperty(stack1,"bookmarkIconPath") : stack1), depth0))
    + ">\n                <img src="
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"paths") : depth0)) != null ? lookupProperty(stack1,"clickedBookmarkIconPath") : stack1), depth0))
    + ">\n            </div>\n        </button>\n</div>";
},"useData":true});
})();