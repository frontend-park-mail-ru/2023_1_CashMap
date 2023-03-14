(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['login'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<main-auth class=\"main-auth\" id=\"main-auth\">\r\n    <div class=\"auth-path\">\r\n        <div class=\"auth-table\">\r\n            <div class=\"title\">\r\n                Авторизация\r\n            </div>\r\n            <div class=\"input-block\" data-id=\"6\">\r\n                <input placeholder=\"Электронная почта\" type=\"email\" class=\"input-field correct-input\" id=\"email-field\">\r\n                <div class=\"error-text\" id=\"email-error\"></div>\r\n            </div>\r\n            <div class=\"input-block\"  data-id=\"7\">\r\n                <input placeholder=\"Пароль\" type=\"password\" class=\"input-field correct-input\" id=\"password-field\">\r\n                <div class=\"error-text\" id=\"password-error\"></div>\r\n            </div>\r\n            <a class=\"btn\" data-id=\"2\" id=\"auth\">Войти</a>\r\n        </div>\r\n        <div class=\"reg-link\">\r\n            <div class=\"reg\">\r\n                <a class=\"create-new-account\" id=\"new\">У вас еще нет аккаунта? Зарегистрироваться</a>\r\n                <span class=\"text-reg\">\r\n                    После успешной регистрации вы получите доступ ко всем функциям Depeche\r\n                </span>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"logo-path\" style=\"background-image: url("
    + alias4(((helper = (helper = lookupProperty(helpers,"fonPath") || (depth0 != null ? lookupProperty(depth0,"fonPath") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"fonPath","hash":{},"data":data,"loc":{"start":{"line":26,"column":56},"end":{"line":26,"column":69}}}) : helper)))
    + ")\">\r\n        <div class=\"logo-table\">\r\n            <div class=\"logo-text\">\r\n                <img src="
    + alias4(((helper = (helper = lookupProperty(helpers,"picPath") || (depth0 != null ? lookupProperty(depth0,"picPath") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"picPath","hash":{},"data":data,"loc":{"start":{"line":29,"column":25},"end":{"line":29,"column":38}}}) : helper)))
    + ">\r\n                <span>Depeche</span>\r\n            </div>\r\n            <div class=\"logo-table-text\">Сервис для общения</div>\r\n        </div>\r\n    </div>\r\n\r\n</main-auth>";
},"useData":true});
})();