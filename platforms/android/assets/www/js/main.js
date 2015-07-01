jQuery.noConflict();
var currentPanel = jQuery("#login");
var listEntryDummy = jQuery("#list_entry_dummy");

jQuery(document).bind("mobileinit", function () {
    jQuery(document).on("pageshow", "#splash_screen", function (event, date) {
        var nextPage = "";
        if (isLoggedIn()) {
            nextPage = "shopping_list";
        } else {
            nextPage = "login";
        }
        switchPage(nextPage);
    });

    jQuery(document).on("pageshow", "#shopping_list", function (event, date) {
        fetchShoppingList();
    });

    jQuery('#refresh_list').bind("click", function () {
        fetchShoppingList();
    });

    jQuery("#submit_login").bind("click submit", function () {
        showLoadingWidget("Melde an, bitte warten ...");
        jQuery.ajax({
            url: "http://einkaufszettel.devdungeon.de/api/api.php?a=login&username=" + jQuery("#username").val() + "&password=" + jQuery("#password").val() + "",
            dataType: "json",
            async: true,
            success: function (result) {
                if (result.code === 0) {
                    setCurrentUsername(jQuery("#username").val());
                    setCurrentSessionID(result.msg);
                    switchPage("shopping_list");
                }
                hideLoadingWidget();
            },
            error: function (request, error) {
                alert('Beim Anmeldeversuch gab es einen Fehler');
                hideLoadingWidget();
            }
        });
    });

    jQuery("#logout").bind("click submit", function () {
        showLoadingWidget("Melde ab, bitte warten ...");
        jQuery.ajax({
            url: "http://einkaufszettel.devdungeon.de/api/api.php?a=logout&session=" + getCurrentSessionID() + "",
            dataType: "json",
            async: true,
            success: function (result) {
                if (result.code === 0) {
                    logout();
                } else {
                    alert('Beim Abmeldeversuch gab es einen Fehler');
                    hideLoadingWidget();
                }
            },
            error: function (request, error) {
                alert('Beim Abmeldeversuch gab es einen Fehler');
                hideLoadingWidget();
            }
        });
    });

    jQuery("#submit_add_shopping_list").bind("click submit", function () {
        var dialog = jQuery("#addShoppingList");
        showLoadingWidget("Lege Liste an, bitte warten ...");
        jQuery.ajax({
            url: "http://einkaufszettel.devdungeon.de/api/api.php?a=addZettel&session=" + getCurrentSessionID() + "&zettelname=" + jQuery('#new_shopping_list_name').val() + "",
            dataType: "json",
            async: true,
            success: function (result) {
                if (result.code === 0) {
                    hideLoadingWidget();
                    fetchShoppingList();
                } else {
                    alert('Beim Versuch die Liste anzulegen gab es einen Fehler');
                    hideLoadingWidget();
                }
                jQuery(dialog).popup("close");
            },
            error: function (request, error) {
                alert('Beim Versuch die Liste anzulegen gab es einen Fehler');
                hideLoadingWidget();
                jQuery(dialog).popup("close");
            }
        });
    });
    
    jQuery("#submit_add_shopping_item").bind("click submit", function () {
        var dialog = jQuery("#addShoppingItem");
        showLoadingWidget("Lege Liste an, bitte warten ...");
        jQuery.ajax({
            url: "http://einkaufszettel.devdungeon.de/api/api.php?a=addItem&session=" + getCurrentSessionID() + "&zettelid=" + jQuery('#current_list_id').val() + "&itemname=" + jQuery("#new_shopping_item_name").val() + "",
            dataType: "json",
            async: true,
            success: function (result) {
                if (result.code === 0) {
                    hideLoadingWidget();
                    fetchShoppingList();
                } else {
                    alert('Beim Versuch das Produkt anzulegen gab es einen Fehler');
                    hideLoadingWidget();
                }
                jQuery(dialog).popup("close");
            },
            error: function (request, error) {
                alert('Beim Versuch das Produkt anzulegen gab es einen Fehler');
                hideLoadingWidget();
                jQuery(dialog).popup("close");
            }
        });
    });

    jQuery("#submit_add_list_user").bind("click submit", function () {
        var dialog = jQuery("#addListUser");
        showLoadingWidget("Teile Liste mit angegebenen Benutzer, bitte warten ...");
        jQuery.ajax({
            url: "http://einkaufszettel.devdungeon.de/api/api.php?a=userFind&session=" + getCurrentSessionID() + "&usermail=" + jQuery('#new_shopping_list_user').val() + "",
            dataType: "json",
            async: true,
            success: function (result) {
                if (result.code === 0) {
                    jQuery.ajax({
                        url: "http://einkaufszettel.devdungeon.de/api/api.php?a=shareZettel&session=" + getCurrentSessionID() + "&usermail=" + jQuery('#new_shopping_list_user').val() + "&zettelid=" + jQuery("#current_list_id").val() + "&userid=" + result.msg +"",
                        dataType: "json",
                        async: true,
                        success: function (result) {
                            if (result.code === 0) {
                                hideLoadingWidget();
                                fetchShoppingList();
                            } else {
                                alert('Beim Versuch den Zettel zu teilen gab es einen Fehler');
                                hideLoadingWidget();
                            }
                            jQuery(dialog).popup("close");
                        },
                        error: function (request, error) {
                            alert('Beim Versuch den Zettel zu teilen gab es einen Fehler');
                            hideLoadingWidget();
                            jQuery(dialog).popup("close");
                        }
                    });
                } else {
                    alert(result.msg);
                    hideLoadingWidget();
                }
                jQuery(dialog).popup("close");
            },
            error: function (request, error) {
                alert('Beim Versuch die Liste anzulegen gab es einen Fehler');
                hideLoadingWidget();
                jQuery(dialog).popup("close");
            }
        });
    });

    jQuery("#apply_remove_shopping_list").bind("click submit", function () {
        var dialog = jQuery("#removeShoppingList");
        showLoadingWidget("L&ouml;sche Liste, bitte warten ...");
        jQuery.ajax({
            url: "http://einkaufszettel.devdungeon.de/api/api.php?a=delZettel&session=" + getCurrentSessionID() + "&zettelid=" + jQuery('#current_list_id').val() + "",
            dataType: "json",
            async: true,
            success: function (result) {
                if (result.code === 0) {
                    hideLoadingWidget();
                    fetchShoppingList();
                } else {
                    alert('Beim Versuch die Liste anzulegen gab es einen Fehler');
                    hideLoadingWidget();
                }
                jQuery(dialog).popup("close");
            },
            error: function (request, error) {
                alert('Beim Versuch die Liste anzulegen gab es einen Fehler');
                hideLoadingWidget();
                jQuery(dialog).popup("close");
            }
        });
    });

    jQuery("#chancel_remove_shopping_list").bind("click submit", function () {
        jQuery("#removeShoppingList").popup("close");
    });

    jQuery(document).on("change", "[type='checkbox']", function () {
        var noteId = parseInt(jQuery(this).parents("[data-role='collapsible']").attr("id").replace(/[^0-9]*/g, ""));
        var itemId = parseInt(jQuery(this).attr("id").replace(/[^0-9]*/g, ""));
        var wholeId = jQuery(this).attr("id");
        var state = (jQuery(this).is(":checked") ? 1 : 0);

        jQuery.ajax({
            url: "http://einkaufszettel.devdungeon.de/api/api.php?a=updateItem&session=" + getCurrentSessionID() + "&zettelid=" + noteId + "&itemid=" + itemId + "&itemstatus=" + state,
            dataType: "json",
            async: true,
            beforeSend: function() {
                var loader = new Image();
                loader.src = "./img/loader.gif";
                jQuery(loader).addClass("loader");
                jQuery("label[for='"+wholeId+"']").append(loader);
            },
            success: function (result) {
                if (result.code === 0) {
                    fetchShoppingList(true);
                } else {
                    alert('Beim Versuch den Status zu aktualisieren gab es einen Fehler');
                    hideLoadingWidget();
                }
            },
            error: function (request, error) {
                alert('Beim Versuch den Status zu aktualisieren gab es einen Fehler');
            },
            ajaxComplete: function () {
                ///jQuery("label[for='"+itemId+"']").removeClass("cloud_icon");
            }
        });
    });
    
    
    jQuery(document).on("click", ".entry_list input[data-role=\"button\"]", function(e) {
        e.stopPropagation();
        e.stopImmediatePropagation();
    }); 
    
    jQuery(document).on("mouseup", "[href=\"#addListUser\"], [href=\"#removeShoppingList\"], [href=\"#addShoppingItem\"]", function(e) {
        var noteId = parseInt(jQuery(this).parents("[data-role='collapsible']").attr("id").replace(/[^0-9]*/g, ""));
        jQuery("#current_list_id").val(noteId);
    });
    
});

function showLoadingWidget(msg) {
    jQuery.mobile.loading('show', {
        text: msg,
        textVisible: true,
        theme: 'a',
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
    currentPanel.css({"display": "none"});
    currentPanel = jQuery("#" + id);
    currentPanel.css({"display": "block"});
}

function switchPage(name) {
    jQuery.mobile.changePage("./index.html#" + name, {transition: "slideup"});
}

function isLoggedIn() {
    var isLoggedIn = false;
    if (getCurrentSessionID() !== null && getCurrentUsername() !== null) {
        jQuery.ajax({
            url: "http://einkaufszettel.devdungeon.de/api/api.php?a=checkLogin&session=" + getCurrentSessionID() + "&username=" + getCurrentUsername(),
            dataType: "json",
            async: false,
            success: function (result) {
                if (result.code === 0) {
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

function fetchShoppingList(noLoadingWidget) {
    var list;
    var username = getCurrentUsername();
    var sessionID = getCurrentSessionID();
    if (username !== null && sessionID !== null) {
        if(!noLoadingWidget) {
            showLoadingWidget("Aktualisiere Liste, bitte warten ...");
        }
        jQuery.ajax({
            url: "http://einkaufszettel.devdungeon.de/api/api.php?a=getZettelJSON&session=" + sessionID + "",
            dataType: "json",
            async: true,
            success: function (result) {
                if (result !== null) {
                    console.log(result);
                    var i = 0;
                    var list = "";
                    jQuery.each(result, function (key, itemData) {
                        list += createShoppingListInHtml(itemData, true);
                        i++;
                    });
                    jQuery("#shopping_list_content").html(list);
                    //console.log(list);
                    /** TODO: try to set events only once **/
                    jQuery("[data-role='collapsible']").collapsible({
                        create: function(event, ui) {
                            console.log("sadsadsd");
                            jQuery(this).append(jQuery(this).find(".list_btns"));  
                        },
                        collapse: function (event, ui) {
                            localStorage.setItem(jQuery(this).attr("id") + "_isCollapsed", true);
                            jQuery(this).append(jQuery(this).find(".list_btns"));
                        },
                        expand: function (event, ui) {
                            localStorage.setItem(jQuery(this).attr("id") + "_isCollapsed", false);
                        }
                    });
                    jQuery("[data-role='collapsible']").collapsible().trigger('create');

                    
                    //console.log(i);

                    /* create new implementation for fancy animation
                     if(i < jQuery("#shopping_list_content").children().length) {
                     jQuery("#shopping_list_content").children(":gt("+(i-1)+")").slideUp();
                     }
                     */
                }
                if(!noLoadingWidget) {
                    hideLoadingWidget();
                }
            },
            error: function (request, error) {
                hideLoadingWidget();
                alert('Beim laden der Einkaufszettel gab es einen Fehler');
            }
        });
    }
}

function createShoppingListInHtml(entryJSON, collapsed) {
    var id = "list_entry_" + entryJSON.name + "_" + entryJSON.id;
    if (jQuery("#" + id).length > 0) {
        collapsed = jQuery("#" + id).collapsible("option", "collapsed");
    } else if (localStorage.getItem(id + "_isCollapsed") != null) {
        collapsed = localStorage.getItem(id + "_isCollapsed");
    }
    var listHtml = "<div id=\"" + id + "\" class=\"entry_list\" data-collapsed=\"" + collapsed + "\" data-role=\"collapsible\">";
    listHtml += "<div class=\"list_btns\">";
    listHtml += "<a href=\"#addListUser\" data-transition=\"slidedown\" data-rel=\"popup\" data-position-to=\"window\" data-role=\"button\" class=\"clear_btn\" data-role=\"button\" data-icon=\"plus\" data-mini='true' data-inline=\"true\" data-icon-pos=\"center\" ></a>";
    listHtml += "<a href=\"#removeShoppingList\" data-transition=\"slidedown\" data-rel=\"popup\" data-position-to=\"window\" data-role=\"button\" class=\"clear_btn\" data-role=\"button\" data-icon=\"delete\" data-mini='true' data-inline=\"true\" data-icon-pos=\"center\" ></a>";
    listHtml += "</div>";
    listHtml += "<h3>" + entryJSON.name + "</h3>";
    listHtml += "<div data-role=\"fieldcontain\"><fieldset data-role=\"controlgroup\">";
    if (entryJSON.items !== undefined) {
        jQuery.each(entryJSON.items, function (key, item) {
            listHtml += createShoppingListEntryInHtml(entryJSON.name, item);
        });
    }
    listHtml += "</fieldset>";
    listHtml += "<a data-role=\"button\" href=\"#addShoppingItem\" data-transition=\"slidedown\" data-rel=\"popup\" data-position-to=\"window\" data-icon=\"plus\">Produkt hinzuf&uuml;gen</a>";
    listHtml += "</div></div>";
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
    var id = "checkobox_list_entry_" + listName + "_" + entryJSON.name + "_" + entryJSON.id;
    var listEntry = "";
    listEntry += "<input type=\"checkbox\" name=\"" + id + "\" id=\"" + id + "\" " + ((entryJSON.status == 1) ? "checked=\"checked\"" : "") + " class=\"custom\" />";
    listEntry += "<label for=\"" + id + "\">" + entryJSON.name + "</label>";

    return listEntry;
}