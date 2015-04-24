jQuery.noConflict();

var username = window.localStorage.getItem("username");
var sessionID = window.localStorage.getItem("sessionID");
var currentPanel = jQuery("#login");

jQuery(document).bind("mobileinit", function(){
    
        if(isLoggedIn()) {
            switchPanel("shopping_list");
        }
    
        jQuery("#submit_login").bind("click submit", function() {
        jQuery.ajax({
            url: "http://einkaufszettel.devdungeon.de/api/api.php?a=login&username="+jQuery("#username").val()+"&password="+jQuery("#password").val()+"",
            dataType: "json",
            async: true,
            success: function(result) {
               if(result.code == 0) {
                   window.localStorage.setItem("username", jQuery("#username").val());
                   window.localStorage.setItem("sessionID", result.msg);
                   alert("Login war erfolgreich");
               } 
            },
            error: function (request,error) {
                    alert('Beim Anmeldeversuch gab es einen Fehler');
            }
        });
    });
});

function switchPanel(id) {
    currentPanel.css({"display" : "none"});
    currentPanel = jQuery("#"+id);
    currentPanel.css({"display" : "block"});
}

function isLoggedIn() {
    if(username !== null && sessionID !== null) {
        return true;
    } else {
        return false;
    }
}

function fetchShoppingList() {
    var list;
    if(username !== null && sessionID !== null) {
       jQuery.ajax({
            url: "http://einkaufszettel.devdungeon.de/api/api.php?a=getZettelJSON&session="+sessionID+"",
            dataType: "json",
            async: true,
            success: function(result) {
               if(result !== null) {
                    
               } 
            },
            error: function (request,error) {
                    alert('Beim laden der Einkaufszettel gab es einen Fehler');
            }
        }); 
    }
}