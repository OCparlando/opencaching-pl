(function($) {

    "use strict";

    var NS = "okapiGpxFormatterWidget";

    var strings = {
        downloadButtonLabel: "Download GPX",
        cancelButtonLabel: "Cancel",
        continueButtonLabel: "Continue >",
        closeButtonLabel: "Close",
        // More valid string IDs can be found in the HTML template.
    };

    var loadFormResponses = function(form) {
        var responses = {};
        $.each(form.find("form").serializeArray(), function(_, obj) {
            responses[obj.name] = obj.value;
        });
        return responses;
    };

    var generateOkapiParamSets = function(cacheCodes, formResponses) {
        var params = {};
        params['ns_ground'] = "true";

        // lpc
        if (formResponses['lpc'] === "all") {
            params['latest_logs'] = "true";
            params['lpc'] = "all";
        } else if (formResponses['lpc'] === "0") {
            params['latest_logs'] = "false";
        } else {
            params['latest_logs'] = "true";
            params['lpc'] = formResponses['lpc'];
        }

        // trackables
        params['trackables'] = formResponses['trackables'];

        // attrs
        var tmp = [];
        if (formResponses['attrs_desctext']) {
            tmp.push("desc:text");
        }
        if (formResponses['attrs_oxtags']) {
            tmp.push("ox:tags");
            params['ns_ox'] = "true";
        }
        if (formResponses['attrs_gcattrs']) {
            tmp.push("gc:attrs");
        }
        if (tmp.length == 0) {
            params['attrs'] = "none";
        } else {
            params['attrs'] = tmp.join("|");
        }

        // my_notes
        tmp = [];
        if (formResponses['my_notes_desctext']) {
            tmp.push("desc:text");
        }
        if (formResponses['my_notes_gcpersonalnote']) {
            tmp.push("gc:personal_note");
        }
        if (tmp.length == 0) {
            params['my_notes'] = "none";
        } else {
            params['my_notes'] = tmp.join("|");
        }

        // location_source
        params['location_source'] = formResponses['location_source'];

        // images
        params['images'] = formResponses['images'];
        if (params['images'] === "ox:all") {
            params['ns_ox'] = "true";
        }

        // protection_areas
        if (formResponses['protection_areas']) {
            params['protection_areas'] = "desc:text";
        } else {
            params['protection_areas'] = "none";
        }

        // recommendations
        if (formResponses['recommendations']) {
            params['recommendations'] = "desc:count";
        } else {
            params['recommendations'] = "none";
        }

        // alt_wpts
        if (formResponses['alt_wpts']) {
            params['alt_wpts'] = "true";
            params['ns_gsak'] = "true";
        } else {
            params['alt_wpts'] = "false";
        }

        // mark_found
        if (formResponses['mark_found']) {
            params['mark_found'] = "true";
        } else {
            params['mark_found'] = "false";
        }

        /* All of the above are params which will be constant in every one of
         * the returned paramsets. However, the `cache_codes` parameter might
         * vary. */

        if (cacheCodes.length <= 500) {
            params['cache_codes'] = cacheCodes.join("|");
            if (cacheCodes.length == 1) {
                params['_filename'] = cacheCodes[0] + ".gpx";
            } else {
                params['_filename'] = "results.gpx";
            }
            return [params];
        } else {
            var sets = [];
            for (var offset = 0; offset < cacheCodes.length; offset += 500) {
                var subsetOfCodes = cacheCodes.slice(offset, offset + 500);
                sets.push($.extend({}, params, {
                    'cache_codes': subsetOfCodes.join("|"),
                    '_filename': "results-part" + ((offset / 500) + 1) + ".gpx"
                }));
            }
            return sets;
        }
    };

    var performFormPost = function(url, params) {
        var form = $('<form></form>');
        form.attr("method", "POST");
        form.attr("action", url);
        $.each(params, function(key, value) {
            var field = $('<input></input>');
            field.attr("type", "hidden");
            field.attr("name", key);
            field.attr("value", value);
            form.append(field);
        });
        $(document.body).append(form);
        form.submit();
    }

    var getTemplate = function(id) {
        var VERSION = 1;  // increment when template changed!
        var url = "tpl/stdstyle/js/okapiGpxFormatterWidget.template.html?v=" + VERSION;
        var contents = $("#" + id);
        if (contents.length == 0) {
            return $.ajax({
                dataType: "html",
                // cache: false,  // uncomment when debugging
                url: url
            }).then(function(html) {
                $('body').append(html);
                contents = $("#" + id);
                if (contents.length == 0) {
                    console.error("ID " + id + " not found in template " + url);
                }
                // Apply translations, if available.
                contents.find("[data-string-id]").each(function(_, elem) {
                    var stringId = $(elem).attr('data-string-id');
                    if (strings[stringId]) {
                        if (stringId.endswith("HTML")) {
                            $(elem).html(strings[stringId]);
                        } else { // plaintext
                            $(elem).text(strings[stringId]);
                        }
                    }
                });
                return contents.clone();
            });
        } else {
            var deferred = $.Deferred();
            deferred.resolve(contents.clone());
            return deferred.promise();
        }
    };

    var show = function(opts) {
        var defaultOptions = {
            cacheCodes: [],
        };
        var options = $.extend({}, defaultOptions, opts);
        getTemplate("okapiGpxFormatterDialogContentsTemplate").done(function(innerContents) {
            var dialogContents = $("<div>").append(innerContents);
            if (options.cacheCodes.length > 500) {
                dialogContents.find("h2 b").addClass("multi");
            }
            dialogContents.find(".okapi-number-of-cachecodes").text(options.cacheCodes.length);

            var dialog;
            var continueButton;
            var closeButton;

            continueButton = {
                text: (
                    (options.cacheCodes.length > 500)
                    ? strings.continueButtonLabel : strings.downloadButtonLabel
                ),
                click: function() {
                    var paramSets = generateOkapiParamSets(
                        options.cacheCodes, loadFormResponses(dialogContents)
                    );
                    if (paramSets.length == 1) {
                        performFormPost("/lib/okapi_gpx.php", {
                            "params": JSON.stringify(paramSets[0])
                        });
                        dialog.dialog("destroy");
                    } else {
                        getTemplate("okapiGpxFormatterDialogContentsTemplate2").done(function(newContents) {
                            var ul = newContents.find("ul");
                            $.each(paramSets, function(_, paramSet) {
                                ul.append($("<li>")
                                    .append($("<a>")
                                        .text(paramSet['_filename'])
                                        .on("click", function() {
                                            performFormPost("/lib/okapi_gpx.php", {
                                                "params": JSON.stringify(paramSet)
                                            });
                                        })
                                    )
                                );
                            });
                            dialogContents.empty().append(newContents);
                            closeButton.text = strings.closeButtonLabel;
                            dialog.dialog('option', 'buttons', [closeButton]);
                        });
                    }
                }
            };

            closeButton = {
                text: strings.cancelButtonLabel,
                click: function() {
                    dialog.dialog("destroy");
                }
            };

            var dialog = dialogContents.dialog({
                height: jQuery(window).height() * 0.9,
                width: 650,
                modal: true,
                buttons: [continueButton, closeButton],
                open: function() {
                    $(":focus").blur();
                }
            });
        });
    }

    $[NS] = {
        show: show,
    };

})(jQuery);
