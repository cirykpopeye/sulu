define(["app-config","sulusecurity/components/users/models/user"],function(a,b){"use strict";var c=1,d=2,e=4,f={validateErrorClass:"husky-validate-error",internalLink:{titleContainer:"#internal-link-container .title",linkContainer:"#internal-link-container .link"},externalLink:{titleContainer:"#external-link-container .title",linkContainer:"#external-link-container .link"}};return{view:!0,layout:{changeNothing:!0},initialize:function(){this.sandbox.emit("husky.toolbar.header.item.disable","template",!1),this.load(),this.bindCustomEvents()},startComponents:function(){var a,b=this.sandbox.dom.data("#shadow_base_language_select","languages"),c=[],d=null;void 0!==this.data.enabledShadowLanguages[this.options.language]&&(d=this.data.enabledShadowLanguages[this.options.language]),0===b.length?c.push({id:"",name:"no languages",disabled:!0}):this.sandbox.util.each(this.data.concreteLanguages,function(a,b){if(this.options.language!==b){var e=!1;d===b&&(e=!0),c.push({id:b,name:b,disabled:e})}}.bind(this)),a=this.data.shadowBaseLanguage,0===c.length&&(c=[{id:-1,name:this.sandbox.translate("sulu.content.form.settings.shadow.no_base_language"),disabled:!0}]),this.sandbox.start([{name:"select@husky",options:{el:"#shadow_base_language_select",instanceName:"settings",multipleSelect:!1,defaultLabel:this.sandbox.translate("sulu.content.form.settings.shadow.select_base_language"),data:c,preSelectedElements:[a]}}])},bindCustomEvents:function(){this.sandbox.on("sulu.header.toolbar.save",function(){this.submit()},this);var a=function(){this.sandbox.emit("sulu.content.contents.set-header-bar",!1)}.bind(this);this.sandbox.on("husky.select.nav-contexts.selected.item",a.bind(this)),this.sandbox.on("husky.select.nav-contexts.deselected.item",a.bind(this)),this.sandbox.on("husky.select.settings.selected.item",function(){this.sandbox.emit("sulu.content.changed"),this.sandbox.emit("sulu.content.contents.set-header-bar",!1)}.bind(this))},bindDomEvents:function(){this.sandbox.dom.on("#content-type-container","change",function(a){var b=this.sandbox.dom.$(a.currentTarget),d=this.sandbox.dom.find(".sub-form",b.parent().parent().parent()),e=this.sandbox.dom.val(b);this.sandbox.dom.hide("#content-type-container .sub-form"),this.sandbox.dom.show(d),parseInt(e)===c?this.sandbox.dom.show("#shadow-container"):this.sandbox.dom.hide("#shadow-container")}.bind(this),".content-type")},updateTabVisibilityForShadowCheckbox:function(a){var b=this.sandbox.dom.find("#shadow_on_checkbox")[0],c=b.checked?"hide":"show",d=c;!1===a&&(d="hide"),"hide"===d?(this.sandbox.util.each(["content","seo","excerpt"],function(a,b){this.sandbox.emit("husky.tabs.header.item."+d,"tab-"+b)}.bind(this)),this.sandbox.emit("husky.toolbar.header.item.disable","state",!1)):this.sandbox.emit("husky.toolbar.header.item.enable","state",!1),this.sandbox.util.each(["show-in-navigation-container","settings-content-form-container"],function(a,b){"hide"===c?this.sandbox.dom.find("#"+b).hide():this.sandbox.dom.find("#"+b).show()}.bind(this))},load:function(){this.sandbox.emit("sulu.content.contents.get-data",function(a){this.render(a)}.bind(this))},render:function(a){this.data=a,require(["text!/admin/content/template/content/settings.html?webspaceKey="+this.options.webspace+"&languageCode="+this.options.language],function(b){this.sandbox.dom.html(this.$el,this.sandbox.util.template(b,{translate:this.sandbox.translate})),this.buildAllNavContexts(this.sandbox.dom.data("#nav-contexts","auraData")),this.bindDomEvents(),this.setData(this.data),this.listenForChange(),this.startComponents(),this.sandbox.start(this.$el,{reset:!0}),this.sandbox.dom.on("#shadow_on_checkbox","click",function(){this.updateTabVisibilityForShadowCheckbox(!1)}.bind(this)),this.updateTabVisibilityForShadowCheckbox(!0),this.updateChangelog(a),this.sandbox.emit("sulu.preview.initialize")}.bind(this))},buildAllNavContexts:function(a){this.allNavContexts={};for(var b=0,c=a.length;c>b;b++)this.allNavContexts[a[b].id]=a[b].name},updateChangelog:function(a){var c,d,e=function(a){this.sandbox.dom.text("#created .name",a),g.resolve()},f=function(a){this.sandbox.dom.text("#changed .name",a),h.resolve()},g=this.sandbox.data.deferred(),h=this.sandbox.data.deferred();a.creator===a.changer?(c=new b({id:a.creator}),c.fetch({global:!1,success:function(a){f.call(this,a.get("fullName")),e.call(this,a.get("fullName"))}.bind(this),error:function(){f.call(this,this.sandbox.translate("sulu.content.form.settings.changelog.user-not-found")),e.call(this,this.sandbox.translate("sulu.content.form.settings.changelog.user-not-found"))}.bind(this)})):(c=new b({id:a.creator}),d=new b({id:a.changer}),c.fetch({global:!1,success:function(a){e.call(this,a.get("fullName"))}.bind(this),error:function(){e.call(this,this.sandbox.translate("sulu.content.form.settings.changelog.user-not-found"))}.bind(this)}),d.fetch({global:!1,success:function(a){f.call(this,a.get("fullName"))}.bind(this),error:function(){f.call(this,this.sandbox.translate("sulu.content.form.settings.changelog.user-not-found"))}.bind(this)})),this.sandbox.dom.text("#created .date",this.sandbox.date.format(a.created,!0)),this.sandbox.dom.text("#changed .date",this.sandbox.date.format(a.changed,!0)),this.sandbox.data.when([g,h]).then(function(){this.sandbox.dom.show("#changelog-container")}.bind(this))},setData:function(a){var b=parseInt(a.nodeType);b===c?this.sandbox.dom.attr("#content-node-type","checked",!0).trigger("change"):b===d?this.sandbox.dom.attr("#internal-link-node-type","checked",!0).trigger("change"):b===e&&this.sandbox.dom.attr("#external-link-node-type","checked",!0).trigger("change"),a.title&&(this.sandbox.dom.val("#internal-title",a.title),this.sandbox.dom.val("#external-title",a.title)),a.internal_link&&this.sandbox.dom.data("#internal-link","singleInternalLink",a.internal_link),a.external&&this.sandbox.dom.data("#external","value",a.external),this.sandbox.on("husky.select.nav-contexts.initialize",function(){var b,c,d=[];for(b=0,c=a.navContexts.length;c>b;b++)d.push(this.allNavContexts[a.navContexts[b]]);this.sandbox.dom.data("#nav-contexts","selection",a.navContexts),this.sandbox.dom.data("#nav-contexts","selectionValues",d),$("#nav-contexts").trigger("data-changed")}.bind(this)),a.shadowOn&&(this.sandbox.dom.attr("#shadow_on_checkbox","checked",!0),this.sandbox.emit("husky.toolbar.header.item.disable","state",!1))},listenForChange:function(){this.sandbox.dom.on(this.$el,"keyup change",function(){this.setHeaderBar(!1)}.bind(this),".trigger-save-button"),this.sandbox.on("sulu.single-internal-link.internal-link.data-changed",function(){this.setHeaderBar(!1)}.bind(this))},setHeaderBar:function(a){this.sandbox.emit("sulu.content.contents.set-header-bar",a)},submit:function(){this.sandbox.logger.log("save Model");var a={},b=this.sandbox.dom.data("#shadow_base_language_select","selectionValues");return a.navContexts=this.sandbox.dom.data("#nav-contexts","selection"),a.nodeType=parseInt(this.sandbox.dom.val('input[name="nodeType"]:checked')),a.shadowOn=this.sandbox.dom.prop("#shadow_on_checkbox","checked"),a.nodeType===d?(a.title=this.sandbox.dom.val("#internal-title"),a.internal_link=this.sandbox.dom.data("#internal-link","singleInternalLink")):a.nodeType===e&&(a.title=this.sandbox.dom.val("#external-title"),a.external=this.sandbox.dom.val(this.sandbox.dom.find("input","#external"))),b&&b.length>0&&(a.shadowBaseLanguage=b[0]),this.validate(a)?(this.data=this.sandbox.util.extend(!0,{},this.data,a),this.data.navContexts=a.navContexts,void this.sandbox.emit("sulu.content.contents.save",this.data)):void this.sandbox.emit("sulu.labels.warning.show","form.validation-warning","labels.warning")},validate:function(a){return this.sandbox.dom.removeClass(f.internalLink.titleContainer,f.validateErrorClass),this.sandbox.dom.removeClass(f.internalLink.linkContainer,f.validateErrorClass),this.sandbox.dom.removeClass(f.externalLink.titleContainer,f.validateErrorClass),this.sandbox.dom.removeClass(f.externalLink.linkContainer,f.validateErrorClass),a.nodeType===d?this.validateInternal(a):a.nodeType===e?this.validateExternal(a):!0},validateInternal:function(a){var b=!0;return a.title||(b=!1,this.sandbox.dom.addClass(f.internalLink.titleContainer,f.validateErrorClass)),a.internal_link||(b=!1,this.sandbox.dom.addClass(f.internalLink.linkContainer,f.validateErrorClass)),b},validateExternal:function(a){var b=!0;return a.title||(b=!1,this.sandbox.dom.addClass(f.externalLink.titleContainer,f.validateErrorClass)),a.external||(b=!1,this.sandbox.dom.addClass(f.externalLink.linkContainer,f.validateErrorClass)),b}}});