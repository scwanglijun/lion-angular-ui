/**
 * Created by wanglijun on 16/1/7.
 */
$(function(){
    $('#demo').jstree({
        'plugins':["checkbox","types"],
        "themes" : {
            "responsive": false
        },
        'core' : {
            'data' : [{
                "text": "Same but with checkboxes",
                "state": {
                    "opened": false
                },
                "children": [{
                    "text": "initially selected",
                    "state": {
                        "selected": true
                    }
                }, {
                    "text": "custom icon",
                    "icon": "fa fa-warning icon-state-danger"
                }, {
                    "text": "initially open",
                    "icon" : "fa fa-folder icon-state-default",
                    "children": ["Another node"]
                }, {
                    "text": "custom icon",
                    "icon": "fa fa-warning icon-state-warning"
                }, {
                    "text": "disabled node",
                    "icon": "fa fa-check icon-state-success",
                    "state": {
                        "selected": true,
                        "disabled":true
                    },
                }]
            },
                "And wholerow selection"
            ]
        }
    });

    $('#demo1').jstree({
        'plugins':["checkbox","types"],
        "themes" : {
            "responsive": false
        },
        'core' : {'data':{'url':function(node){
                         return "list.json";
        }}}
    });

    $('#demo1').on('changed.jstree',function(e,data){
         console.log(data);
    });

    $('.btn').on('click',function(){
        var menu = $('#demo1').jstree().get_checked(true);
        console.log(menu);
    });
});
