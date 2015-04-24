jQuery.noConflict();
var currentPanel = jQuery("#login");
var listEntryDummy = jQuery("#list_entry_dummy");

jQuery(document).bind("mobileinit", function(){
        jQuery(document).delegate(".ui-page", "pagecontainershow", function() {
            alert("argh"); 
        });
        
        jQuery('#refresh_list').bind("click"), function() {
            fetchShoppingList();
        };
        
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
                   jQuery("#login").slideUp();
                   jQuery.mobile.changePage("./index.html#shopping_list");
                   fetchShoppingList();
               }
                hideLoadingWidget();
            },
            error: function (request,error) {
                    alert('Beim Anmeldeversuch gab es einen Fehler');
                    hideLoadingWidget();
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

function isLoggedIn() {
}

function fetchShoppingList() {
    var list;
    var username = getCurrentUsername();
    var sessionID = getCurrentSessionID();
    if(username !== null && sessionID !== null) {
       jQuery.ajax({
            url: "http://einkaufszettel.devdungeon.de/api/api.php?a=getZettelJSON&session="+sessionID+"",
            dataType: "json",
            async: true,
            success: function(result) {
               if(result !== null) {
                   console.log(result);
                    jQuery.each(result, function(i, item) {
                        var entry = listEntryDummy.clone();
                        entry.children("h3").eq(0).html(i + ":");
                        entry.children("p").eq(0).html("sadsadasdsad");
                        jQuery("#shopping_list").append(entry);
                        entry.slideDown();
                        entry.collapsible();
                    });
               }
            },
            error: function (request,error) {
                    alert('Beim laden der Einkaufszettel gab es einen Fehler');
            }
        }); 
    }
}