tinyMCE.init({
    mode : "none",
    theme : "advanced",

    plugins : "advhr,emotions,insertdatetime,paste,table,fullscreen,inlinepopups,autosave",

    dialog_type : "modal",


    theme_advanced_buttons1 : "cut,copy,paste,pasteword,pastetext,removeformat,separator,undo,redo,separator,link,unlink,image,separator,fontselect,fontsizeselect",
    theme_advanced_buttons2 : "bold,italic,separator,justifyleft,justifycenter,justifyright,justifyfull,separator,bullist,numlist,separator,insertdate,inserttime,separator,forecolor,backcolor,charmap,emotions",
    theme_advanced_buttons3 : "visualaid,tablecontrols,separator,advhr",

    theme_advanced_buttons3_add : "fullscreen",
    fullscreen_settings : {
        theme_advanced_path_location : "top"
    },

    theme_advanced_toolbar_location : "top",
    theme_advanced_toolbar_align : "left",
    theme_advanced_path_location : "bottom",
    plugin_insertdate_dateFormat : "%d.%m.%Y",
    plugin_insertdate_timeFormat : "%H:%M:%S",
    file_browser_callback : "imageBrowser",

    theme_advanced_resize_horizontal : false,
    theme_advanced_resizing : true,
    editor_deselector : "mceNoEditor",
    language : "<?php echo $_GET['lang'];?>",
    preformatted : true,
    remove_linebreaks : false,
    oninit : "postInit",
    forced_root_block : false,

    content_css : "/lib/tinymce/config/content.css"
});

var fileBrowserReturnURL = "";
var fileBrowserWin;
var fileBrowserFieldName;

function imageBrowser(field_name, url, type, win)
{
  window.open('../../../../imagebrowser.php?cacheid=<?php echo isset($_REQUEST['cacheid']) ? ($_REQUEST['cacheid']+0) : 0; ?>', '', 'width=450,height=550,menubar=no,scrollbars=yes,status=no,location=no,resizable=yes,status=no,dependent');
  fileBrowserWin = win;
  fileBrowserFieldName = field_name;
}

function fileBrowserReturn(url)
{
  fileBrowserWin.document.forms[0].elements[fileBrowserFieldName].value = url;
}
