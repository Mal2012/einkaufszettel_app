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
                   var list = "";
                    jQuery.each(result, function(key, itemData) {
                        list += createShoppingListInHtml(itemData, true);
                        i++;
                    });
                    jQuery("#shopping_list_content").append(list);
                    console.log(list);
                    jQuery("[data-role='collapsible']").collapsible().trigger('create');
                    console.log(i);
                    
                    /* create new implementation for fancy animation
                    if(i < jQuery("#shopping_list_content").children().length) {
                        jQuery("#shopping_list_content").children(":gt("+(i-1)+")").slideUp();
                    }
                    */
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

function createShoppingListInHtml(entryJSON, collapsed) {
    var id = "list_entry_"+entryJSON.name+"_"+entryJSON.id;
    var listHtml = "<div id=\""+id+"\" data-collapsed=\""+collapsed+"\" data-role=\"collapsible\">";
    listHtml += "<h3>"+entryJSON.name+"</h3>";
    listHtml += "<div data-role=\"fieldcontain\"><fieldset data-role=\"controlgroup\">";
    if(entryJSON.items !== undefined) {
        jQuery.each(entryJSON.items, function(key, item) {
            console.log(entryJSON.name + ": " + item.name);
            listHtml += createShoppingListEntryInHtml(entryJSON.name, item);
        });
    }
    listHtml += "</fieldset></div></div>";
    return listHtml;
    /*
     <h3>Dummy Entry</h3>
        <div data-role="fieldcontain">
            <fieldset data-role="controlgroup">
                <input type="checkbox" name="checkbox_list_entry" id="checkbox_list_entry_dummy" class="custom" />
                <label for="checkbox_list_entry_dummy">I agree</label>
            </fieldset>
        </div>
     */
}

function createShoppingListEntryInHtml(listName, entryJSON) {
    var id = "checkobox_list_entry_"+listName+"_"+entryJSON.name+"_"+entryJSON.id;
    var listEntry = "";
    if(jQuery("#"+id).length > 0) {
        listEntry += jQuery("#"+id).html();
        listEntry += jQuery("label[for='"+id+"']").html();
    } else {
        listEntry += "<input type=\"checkbox\" name=\""+id+"\" id=\""+id+"\" class=\"custom\" />";  
        listEntry += "<label for=\""+id+"\">"+entryJSON.name+"</label>";
    }
    
    return listEntry;
}