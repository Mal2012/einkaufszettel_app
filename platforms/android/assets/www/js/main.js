jQuery.noConflict();
var currentPanel = jQuery("#login");
var listEntryDummy = jQuery("#list_entry_dummy");

jQuery(document).bind("mobileinit", function(){   
        jQuery(document).on("pageshow", "#splash_screen", function(event, date) {
            var nextPage = "";
            if(isLoggedIn()) {
                nextPage = "shopping_list";
            } else {
                nextPage = "login";
            }
            switchPage(nextPage);
        });
        
        jQuery(document).on("pageshow", "#shopping_list", function(event, date) {
            fetchShoppingList();
        });
        
        jQuery('#refresh_list').bind("click", function() {
            fetchShoppingList();
        });
        
        jQuery("#submit_login").bind("click submit", function() {
            showLoadingWidget("Melde an, bitte warten ...");
            jQuery.ajax({
                url: "http://einkaufszettel.devdungeon.de/api/api.php?a=login&username="+jQuery("#username").val()+"&password="+jQuery("#password").val()+"",
                dataType: "json",
                async: true,
                success: function(result) {
                   if(result.code === 0) {
                       setCurrentUsername(jQuery("#username").val());
                       setCurrentSessionID(result.msg);
                       switchPage("shopping_list");
                   }
                    hideLoadingWidget();
                },
                error: function (request,error) {
                        alert('Beim Anmeldeversuch gab es einen Fehler');
                        hideLoadingWidget();
                }
            });
        });
        
        jQuery("#logout").bind("click submit", function() {
            showLoadingWidget("Melde ab, bitte warten ...");
            jQuery.ajax({
                url: "http://einkaufszettel.devdungeon.de/api/api.php?a=logout&session="+getCurrentSessionID()+"",
                dataType: "json",
                async: true,
                success: function(result) {
                   if(result.code === 0) {
                       logout();
                   } else {
                        alert('Beim Abmeldeversuch gab es einen Fehler');
                        hideLoadingWidget();
                   }
                },
                error: function (request,error) {
                        alert('Beim Abmeldeversuch gab es einen Fehler');
                        hideLoadingWidget();
                }
            });
        });
        
        jQuery("#submit_add_shopping_list").bind("click submit", function() {
            var dialog = jQuery("#addShoppingList");
            showLoadingWidget("Lege Liste an, bitte warten ...");
            jQuery.ajax({
                url: "http://einkaufszettel.devdungeon.de/api/api.php?a=addZettel&session="+getCurrentSessionID()+"&zettelname="+jQuery('#new_shopping_list_name').val()+"",
                dataType: "json",
                async: true,
                success: function(result) {
                   if(result.code === 0) {
                       hideLoadingWidget();
                        fetchShoppingList();
                   } else {
                        alert('Beim Versuch die Liste anzulegen gab es einen Fehler');
                        hideLoadingWidget();
                   }
                   jQuery(dialog).popup( "close" );
                },
                error: function (request,error) {
                        alert('Beim Versuch die Liste anzulegen gab es einen Fehler');
                        hideLoadingWidget();
                       jQuery(dialog).popup( "close" );
                }
            });
        });
});

function showLoadingWidget(msg) {
    jQuery.mobile.loading('show', {
       text: msg,
       textVisible: true,
       theme: 'b',
       html: ""
    });
}

function hideLoadingWidget() {
    jQuery.mobile.loading('hide');
}

function getCurrentUsername() {
    return localStorage.getItem("username");
}

function getCurrentSessionID() {
    return localStorage.getItem("sessionID");
}

function setCurrentUsername(name) {
    window.localStorage.setItem("username", name);
}

function setCurrentSessionID(id) {
    window.localStorage.setItem("sessionID", id);
}

function switchPanel(id) {
    currentPanel.css({"display" : "none"});
    currentPanel = jQuery("#"+id);
    currentPanel.css({"display" : "block"});
}

function switchPage(name) {
    jQuery.mobile.changePage( "./index.html#"+name, { transition: "slideup"});
}

function isLoggedIn() {
    var isLoggedIn = false;
    if(getCurrentSessionID() !== null && getCurrentUsername() !== null) {
        jQuery.ajax({
            url: "http://einkaufszettel.devdungeon.de/api/api.php?a=checkLogin&session="+getCurrentSessionID()+"&username="+getCurrentUsername(),
            dataType: "json",
            async: false,
            success: function(result) {
                if(result.code === 0) {
                                        alert("Yeah, angemeldet");

                    isLoggedIn = true;
                }
            }
        });
   }
   
   return isLoggedIn;
}

function logout() {
    setCurrentSessionID(0);
    setCurrentUsername("");
    hideLoadingWidget();
    switchPage("login");
}

function fetchShoppingList() {
    var list;
    var username = getCurrentUsername();
    var sessionID = getCurrentSessionID();
    if(username !== null && sessionID !== null) {
       showLoadingWidget("Aktualisiere Liste, bitte warten ...");
       jQuery.ajax({
            url: "http://einkaufszettel.devdungeon.de/api/api.php?a=getZettelJSON&session="+sessionID+"",
            dataType: "json",
            async: true,
            success: function(result) {
               if(result !== null) {
                   console.log(result);
                   var i = 0;
                    jQuery.each(result, function(key, itemData) {
                        var ele = jQuery("#shopping_list_content").children().eq(i);
                        var entry;
                        var collapsed = true;
                        if(ele.length > 0) {
                            entry = ele;
                            entry.children("h3").eq(0).children(".ui-btn").text(itemData.name + ":");
                            entry.children("div").eq(0).children(".ui-collapsible-content").text(itemData.name);
                            collapsed = entry.collapsible( "option", "collapsed" );
                        } else {
                            var entry = listEntryDummy.clone();
                            jQuery("#shopping_list_content").append(entry);
                            entry.removeAttr("id");
                            entry.children("h3").eq(0).text(key + ":");
                            jQuery.each(itemData, function(key, itemValues) {
                                entry.children("div").eq(0).find("checkbox").eq(0).attr("id", "checkbox_list_entry_"+i);
                                entry.children("div").eq(0).find("checkbox").eq(0).attr("checked", (itemValues.status === 1) ? true : false).checkboxradio();
                                entry.children("div").eq(0).find("label").eq(0).attr("for", "checkbox_list_entry_"+i);
                                entry.children("div").eq(0).find("label").eq(0).html(itemValues.name);
                            });
                        }
                        entry.collapsible({collapsed: collapsed});
                        i++;
                    });
                    console.log(i);
                    if(i < jQuery("#shopping_list_content").children().length) {
                        jQuery("#shopping_list_content").children(":gt("+(i-1)+")").slideUp();
                    }
               }
                hideLoadingWidget();
            },
            error: function (request,error) {
                    hideLoadingWidget();
                    alert('Beim laden der Einkaufszettel gab es einen Fehler');
            }
        }); 
    }
}