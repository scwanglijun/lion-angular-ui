$(function() {
	//加载bootstrap
	Metronic.init(); // init metronic core componets
	Layout.init(); // init layout
	Tasks.initDashboardWidget(); // init tash dashboard widget
});

var zTree;
var demoIframe;

function addHoverDom(treeId, treeNode) {
    var sObj = $("#" + treeNode.tId + "_span");
    if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
    var addStr = '<span class="button remove" id="removeBtn_' + treeNode.tId + '" title="add node" onfocus="this.blur();"></span>';

    addStr += '<span class="button add" id="addBtn_' + treeNode.tId + '"></span>';
    addStr += '<span class="button edit" id="editBtn_' + treeNode.tId + '"></span>';
    sObj.after(addStr);
    var btn = $("#addBtn_"+treeNode.tId);
    if (btn) btn.bind("click", function(){
        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
        zTree.addNodes(treeNode, {id:(1000 + newCount), pId:treeNode.id, name:"new node" + (newCount++)});
        return false;
    });
}

function removeHoverDom(treeId, treeNode) {
    $("#addBtn_"+treeNode.tId).unbind().remove();
    $("#removeBtn_"+treeNode.tId).unbind().remove();
    $("#editBtn_"+treeNode.tId).unbind().remove();
}

var setting = {
    check: {
        enable: true,
        //chkStyle: "radio",
        //radioType: "level"
    },
    view: {
        addHoverDom: addHoverDom,
        removeHoverDom: removeHoverDom,
        dblClickExpand: false,
        showLine: true,
        selectedMulti: false
    },
    data: {
        simpleData: {
            enable:true,
            idKey: "id",
            pIdKey: "pId",
            rootPId: ""
        }
    },
    callback: {
        beforeClick: function(treeId, treeNode) {
            var zTree = $.fn.zTree.getZTreeObj("tree");
            if (treeNode.isParent) {
                zTree.expandNode(treeNode);
                return false;
            } else {
                demoIframe.attr("src",treeNode.file + ".html");
                return true;
            }
        }
    }
};

var zNodes =[
    {id:1, pId:0, name:"[core] 基本功能 演示", open:true},
    {id:101, pId:1, name:"最简单的树 --  标准 JSON 数据", file:"core/standardData"},
    {id:102, pId:1, name:"最简单的树 --  简单 JSON 数据", file:"core/simpleData"},
    {id:103, pId:1, name:"不显示 连接线", file:"core/noline"},
    {id:104, pId:1, name:"不显示 节点 图标", file:"core/noicon"},
    {id:105, pId:1, name:"自定义图标 --  icon 属性", file:"core/custom_icon"},
    {id:106, pId:1, name:"自定义图标 --  iconSkin 属性", file:"core/custom_iconSkin"},
    {id:107, pId:1, name:"自定义字体", file:"core/custom_font"},
    {id:115, pId:1, name:"超链接演示", file:"core/url"},
    {id:108, pId:1, name:"异步加载 节点数据", file:"core/async"},
    {id:109, pId:1, name:"用 zTree 方法 异步加载 节点数据", file:"core/async_fun"},
    {id:110, pId:1, name:"用 zTree 方法 更新 节点数据", file:"core/update_fun"},
    {id:111, pId:1, name:"单击 节点 控制", file:"core/click"},
    {id:112, pId:1, name:"展开 / 折叠 父节点 控制", file:"core/expand"},
    {id:113, pId:1, name:"根据 参数 查找 节点", file:"core/searchNodes"},
    {id:114, pId:1, name:"其他 鼠标 事件监听", file:"core/otherMouse"},

    {id:2, pId:0, name:"[excheck] 复/单选框功能 演示", open:false},
    {id:201, pId:2, name:"Checkbox 勾选操作", file:"excheck/checkbox"},
    {id:206, pId:2, name:"Checkbox nocheck 演示", file:"excheck/checkbox_nocheck"},
    {id:207, pId:2, name:"Checkbox chkDisabled 演示", file:"excheck/checkbox_chkDisabled"},
    {id:208, pId:2, name:"Checkbox halfCheck 演示", file:"excheck/checkbox_halfCheck"},
    {id:202, pId:2, name:"Checkbox 勾选统计", file:"excheck/checkbox_count"},
    {id:203, pId:2, name:"用 zTree 方法 勾选 Checkbox", file:"excheck/checkbox_fun"},
    {id:204, pId:2, name:"Radio 勾选操作", file:"excheck/radio"},
    {id:209, pId:2, name:"Radio nocheck 演示", file:"excheck/radio_nocheck"},
    {id:210, pId:2, name:"Radio chkDisabled 演示", file:"excheck/radio_chkDisabled"},
    {id:211, pId:2, name:"Radio halfCheck 演示", file:"excheck/radio_halfCheck"},
    {id:205, pId:2, name:"用 zTree 方法 勾选 Radio", file:"excheck/radio_fun"},

    {id:3, pId:0, name:"[exedit] 编辑功能 演示", open:false},
    {id:301, pId:3, name:"拖拽 节点 基本控制", file:"exedit/drag"},
    {id:302, pId:3, name:"拖拽 节点 高级控制", file:"exedit/drag_super"},
    {id:303, pId:3, name:"用 zTree 方法 移动 / 复制 节点", file:"exedit/drag_fun"},
    {id:304, pId:3, name:"基本 增 / 删 / 改 节点", file:"exedit/edit"},
    {id:305, pId:3, name:"高级 增 / 删 / 改 节点", file:"exedit/edit_super"},
    {id:306, pId:3, name:"用 zTree 方法 增 / 删 / 改 节点", file:"exedit/edit_fun"},
    {id:307, pId:3, name:"异步加载 & 编辑功能 共存", file:"exedit/async_edit"},
    {id:308, pId:3, name:"多棵树之间 的 数据交互", file:"exedit/multiTree"},

    {id:4, pId:0, name:"大数据量 演示", open:false},
    {id:401, pId:4, name:"一次性加载大数据量", file:"bigdata/common"},
    {id:402, pId:4, name:"分批异步加载大数据量", file:"bigdata/diy_async"},
    {id:403, pId:4, name:"分批异步加载大数据量", file:"bigdata/page"},

    {id:5, pId:0, name:"组合功能 演示", open:false},
    {id:501, pId:5, name:"冻结根节点", file:"super/oneroot"},
    {id:502, pId:5, name:"单击展开/折叠节点", file:"super/oneclick"},
    {id:503, pId:5, name:"保持展开单一路径", file:"super/singlepath"},
    {id:504, pId:5, name:"添加 自定义控件", file:"super/diydom"},
    {id:505, pId:5, name:"checkbox / radio 共存", file:"super/checkbox_radio"},
    {id:506, pId:5, name:"左侧菜单", file:"super/left_menu"},
    {id:513, pId:5, name:"OutLook 样式的左侧菜单", file:"super/left_menuForOutLook"},
    {id:507, pId:5, name:"下拉菜单", file:"super/select_menu"},
    {id:509, pId:5, name:"带 checkbox 的多选下拉菜单", file:"super/select_menu_checkbox"},
    {id:510, pId:5, name:"带 radio 的单选下拉菜单", file:"super/select_menu_radio"},
    {id:508, pId:5, name:"右键菜单 的 实现", file:"super/rightClickMenu"},
    {id:511, pId:5, name:"与其他 DOM 拖拽互动", file:"super/dragWithOther"},
    {id:512, pId:5, name:"异步加载模式下全部展开", file:"super/asyncForAll"},

    {id:6, pId:0, name:"其他扩展功能 演示", open:false},
    {id:601, pId:6, name:"隐藏普通节点", file:"exhide/common"},
    {id:602, pId:6, name:"配合 checkbox 的隐藏", file:"exhide/checkbox"},
    {id:603, pId:6, name:"配合 radio 的隐藏", file:"exhide/radio"}
];

$(function(){
    var t = $("#ztree");
    t = $.fn.zTree.init(t, setting, zNodes);
    demoIframe = $("#testIframe");
    demoIframe.bind("load", loadReady);
    var zTree = $.fn.zTree.getZTreeObj("ztree");
    zTree.selectNode(zTree.getNodeByParam("id", 101));
});

function loadReady() {
    var bodyH = demoIframe.contents().find("body").get(0).scrollHeight,
        htmlH = demoIframe.contents().find("html").get(0).scrollHeight,
        maxH = Math.max(bodyH, htmlH), minH = Math.min(bodyH, htmlH),
        h = demoIframe.height() >= maxH ? minH:maxH ;
    if (h < 530) h = 530;
    demoIframe.height(h);
}



var setting1 = {
		check: {
			enable: true,
			chkStyle: "radio",
			radioType: "all"
		},
		data: {
			simpleData: {
				enable: true
			}
		}
	};

	var zNodes1 =[
		{ id:1, pId:0, name:"随意勾选 1", open:true},
		{ id:11, pId:1, name:"随意勾选 1-1", open:true},
		{ id:111, pId:11, name:"随意勾选 1-1-1"},
		{ id:112, pId:11, name:"随意勾选 1-1-2"},
		{ id:12, pId:1, name:"随意勾选 1-2", open:true},
		{ id:121, pId:12, name:"随意勾选 1-2-1"},
		{ id:122, pId:12, name:"随意勾选 1-2-2"},
		{ id:2, pId:0, name:"随意勾选 2", open:true},
		{ id:21, pId:2, name:"随意勾选 2-1"},
		{ id:22, pId:2, name:"随意勾选 2-2", open:true},
		{ id:221, pId:22, name:"随意勾选 2-2-1", checked:true},
		{ id:222, pId:22, name:"随意勾选 2-2-2"},
		{ id:23, pId:2, name:"随意勾选 2-3"}
	];
	
	var code;		
	function setCheck() {
		$.fn.zTree.init($("#treeDemo"), setting1, zNodes1);
	}
	function showCode(str) {
		 
	}
	
	$(document).ready(function(){
		setCheck();			
	 
	});

    var lastSelectNodetId;

    var settingSelect = {
            view: {
                dblClickExpand: false
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                beforeClick:beforeClick,
                onClick: onClick
            }
        };

        var zNodesSelect =[
            {id:1, pId:0, name:"北京"},
            {id:2, pId:0, name:"天津"},
            {id:3, pId:0, name:"上海"},
            {id:6, pId:0, name:"重庆"},
            {id:4, pId:0, name:"河北省", open:true},
            {id:41, pId:4, name:"石家庄"},
            {id:42, pId:4, name:"保定"},
            {id:43, pId:4, name:"邯郸"},
            {id:44, pId:4, name:"承德"},
            {id:5, pId:0, name:"广东省", open:true},
            {id:51, pId:5, name:"广州"},
            {id:52, pId:5, name:"深圳"},
            {id:53, pId:5, name:"东莞"},
            {id:54, pId:5, name:"佛山"},
            {id:6, pId:0, name:"福建省", open:true},
            {id:61, pId:6, name:"福州"},
            {id:62, pId:6, name:"厦门"},
            {id:63, pId:6, name:"泉州"},
            {id:64, pId:6, name:"三明"}
         ];

        function beforeClick(treeId, treeNode) {
            if(treeNode.tId===lastSelectNodetId){
                console.dir(treeNode.tId);
                console.dir(lastSelectNodetId);
                var zTree = $.fn.zTree.getZTreeObj("treeDemo1");
                zTree.cancelSelectedNode(treeNode);
                var cityObj = $("#citySel");
                cityObj.find('span').text(cityObj.attr('placeholder'));
                lastSelectNodetId="";
                return false;
            }else{
                 lastSelectNodetId=treeNode.tId;
            }
        }
        
        function onClick(e, treeId, treeNode) {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo1"),
            nodes = zTree.getSelectedNodes(),v = "";
            
            nodes.sort(function compare(a,b){return a.id-b.id;});
            for (var i=0, l=nodes.length; i<l; i++) {
                v += nodes[i].name + ",";
            }
            if (v.length > 0 ) v = v.substring(0, v.length-1);
            var cityObj = $("#citySel");
            cityObj.find('span').text(v); 
        }

        function showMenu() {
            var cityObj = $("#citySel");
            var cityOffset =cityObj.offset();
            $("#menuContent").css({left:'0px', top:cityObj.outerHeight() + "px"}).slideDown("fast");

            $("body").bind("mousedown", onBodyDown);
        }
        function hideMenu() {
            $("#menuContent").fadeOut("fast");
            $("body").unbind("mousedown", onBodyDown);
        }
        function onBodyDown(event) {
            if (!(event.target.id == "menuBtn" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
                hideMenu();
            }
        }

        $(document).ready(function(){
            $.fn.zTree.init($("#treeDemo1"), settingSelect, zNodesSelect);
            $("#citySel").click(function(){
                return  showMenu();
            });

            $("#departmentId").combotree('treeOnClick',function(e, treeId, treeNode){
                
            });
        });


$(function () {
    $("#btnTree").click(function(){
            console.dir("请求");
        $("#departmentId").combotree('refresh');
    });
});