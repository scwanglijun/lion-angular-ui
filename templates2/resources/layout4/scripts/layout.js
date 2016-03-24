/**
 Core script to handle the entire theme and core functions
 **/
var Layout = function () {

    var layoutImgPath = 'layout4/img/';

    var layoutCssPath = 'layout4/css/';

    var resBreakpointMd = Metronic.getResponsiveBreakpoint('md');

    //* BEGIN:CORE HANDLERS *//
    // this function handles responsive layout on screen size resize or mobile device rotate.


    // Handle sidebar menu links
    //根据当前URL地址，激活对应的菜单URL状态
    var handleSidebarMenuActiveLink = function (mode, el, stateName) {
        var url = location.hash.toLowerCase();

        var menu = $('.page-sidebar-menu');

        if (mode === 'click' || mode === 'set') {
            el = $(el);
        } else if (mode === 'match') {
            var matched = false;
            menu.find("li > a").each(function () {
                //通过点击菜单跳转时，有stateChangeSuccess事件触发传递stateName，便于定位菜单状态
                var state = $(this).attr("ui-sref") || "";
                if (state != "" && stateName != "" && state === stateName) {
                    el = $(this);
                    matched = true;
                    return false;
                }

            });
            //使用state未匹配时，再次使用URL匹配
            if (!matched) {
                menu.find("li > a").each(function () {
                    //直接刷新浏览器时，通过URL来定位菜单状态
                    //使用angular ui-route时无href属性，做兼容判断
                    var href = $(this).attr("ui-sref") || $(this).attr("href");
                    var path = href.toLowerCase();
                    // url match condition
                    if (path.length > 1 && url.substr(2) == path) {//去掉#/后做比较
                        el = $(this);
                        return false;
                    }
                });

            }

        }

        if (!el || el.size() == 0) {
            return;
        }

        if (el.attr('href').toLowerCase() === 'javascript:;' || el.attr('href').toLowerCase() === '#') {
            return;
        }

        var slideSpeed = parseInt(menu.data("slide-speed"));
        var keepExpand = menu.data("keep-expanded");

        // disable active states
        menu.find('li.active').removeClass('active');
        menu.find('li > a > .selected').remove();

        if (menu.hasClass('page-sidebar-menu-hover-submenu') === false) {
            menu.find('li.open').each(function () {
                if ($(this).children('.sub-menu').size() === 0) {
                    $(this).removeClass('open');
                    $(this).find('> a > .arrow.open').removeClass('open');
                }
            });
        } else {
            menu.find('li.open').removeClass('open');
        }

        el.parents('li').each(function () {
            $(this).addClass('active');
            $(this).find('> a > span.arrow').addClass('open');

            if ($(this).parent('ul.page-sidebar-menu').size() === 1) {
                $(this).find('> a').append('<span class="selected"></span>');
            }

            if ($(this).children('ul.sub-menu').size() === 1) {
                $(this).addClass('open');
            }
        });

        if (mode === 'click') {
            if (Metronic.getViewPort().width < resBreakpointMd && $('.page-sidebar').hasClass("in")) { // close the menu on mobile view while laoding a page 
                $('.page-header .responsive-toggler').click();
            }
        }
    };

    // Handle sidebar menu
    var handleSidebarMenu = function ($rootScope) {
        $('.page-sidebar').on('click', 'li > a', function (e) {

            if (Metronic.getViewPort().width >= resBreakpointMd && $(this).parents('.page-sidebar-menu-hover-submenu').size() === 1) { // exit of hover sidebar menu
                return;
            }

            if ($(this).next().hasClass('sub-menu') === false) {
                if (Metronic.getViewPort().width < resBreakpointMd && $('.page-sidebar').hasClass("in")) { // close the menu on mobile view while laoding a page 
                    $('.page-header .responsive-toggler').click();
                }
                return;
            }

            if ($(this).next().hasClass('sub-menu always-open')) {
                return;
            }

            var parent = $(this).parent().parent();
            var the = $(this);
            var menu = $('.page-sidebar-menu');
            var sub = $(this).next();

            var autoScroll = menu.data("auto-scroll");
            var slideSpeed = parseInt(menu.data("slide-speed"));
            var keepExpand = menu.data("keep-expanded");

            if (keepExpand !== true) {
                parent.children('li.open').children('a').children('.arrow').removeClass('open');
                parent.children('li.open').children('.sub-menu:not(.always-open)').slideUp(slideSpeed);
                parent.children('li.open').removeClass('open');
            }

            var slideOffeset = -200;

            if (sub.is(":visible")) {
                $('.arrow', $(this)).removeClass("open");
                $(this).parent().removeClass("open");
                sub.slideUp(slideSpeed, function () {
                    if (autoScroll === true && $('body').hasClass('page-sidebar-closed') === false) {
                        if ($('body').hasClass('page-sidebar-fixed')) {
                            menu.slimScroll({
                                'scrollTo': (the.position()).top
                            });
                        } else {
                            Metronic.scrollTo(the, slideOffeset);
                        }
                    }
                });
            } else {
                $('.arrow', $(this)).addClass("open");
                $(this).parent().addClass("open");
                sub.slideDown(slideSpeed, function () {
                    if (autoScroll === true && $('body').hasClass('page-sidebar-closed') === false) {
                        if ($('body').hasClass('page-sidebar-fixed')) {
                            menu.slimScroll({
                                'scrollTo': (the.position()).top
                            });
                        } else {
                            Metronic.scrollTo(the, slideOffeset);
                        }
                    }
                });
            }

            e.preventDefault();
        });

        // handle ajax links within sidebar menu
        $('.page-sidebar').on('click', ' li > a.ajaxify', function (e) {
            e.preventDefault();
            Metronic.scrollTop();

            var url = $(this).attr("href");
            var menuContainer = $('.page-sidebar ul');
            var pageContent = $('.page-content');
            var pageContentBody = $('.page-content .page-content-body');

            menuContainer.children('li.active').removeClass('active');
            menuContainer.children('arrow.open').removeClass('open');

            $(this).parents('li').each(function () {
                $(this).addClass('active');
                $(this).children('a > span.arrow').addClass('open');
            });
            $(this).parents('li').addClass('active');

            if (Metronic.getViewPort().width < resBreakpointMd && $('.page-sidebar').hasClass("in")) { // close the menu on mobile view while laoding a page 
                $('.page-header .responsive-toggler').click();
            }

            Metronic.startPageLoading();

            var the = $(this);

            $.ajax({
                type: "GET",
                cache: false,
                url: url,
                dataType: "html",
                success: function (res) {

                    if (the.parents('li.open').size() === 0) {
                        $('.page-sidebar-menu > li.open > a').click();
                    }

                    Metronic.stopPageLoading();
                    pageContentBody.html(res);
                    Layout.fixContentHeight(); // fix content height
                    Metronic.initAjax(); // initialize core stuff
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    Metronic.stopPageLoading();
                    pageContentBody.html('<h4>Could not load the requested content.</h4>');
                }
            });
        });

        // handle ajax link within main content
        $('.page-content').on('click', '.ajaxify', function (e) {
            e.preventDefault();
            Metronic.scrollTop();

            var url = $(this).attr("href");
            var pageContent = $('.page-content');
            var pageContentBody = $('.page-content .page-content-body');

            Metronic.startPageLoading();

            if (Metronic.getViewPort().width < resBreakpointMd && $('.page-sidebar').hasClass("in")) { // close the menu on mobile view while laoding a page 
                $('.page-header .responsive-toggler').click();
            }

            $.ajax({
                type: "GET",
                cache: false,
                url: url,
                dataType: "html",
                success: function (res) {
                    Metronic.stopPageLoading();
                    pageContentBody.html(res);
                    Layout.fixContentHeight(); // fix content height
                    Metronic.initAjax(); // initialize core stuff
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    pageContentBody.html('<h4>Could not load the requested content.</h4>');
                    Metronic.stopPageLoading();
                }
            });
        });

        // handle scrolling to top on responsive menu toggler click when header is fixed for mobile view
        $(document).on('click', '.page-header-fixed-mobile .responsive-toggler', function () {
            Metronic.scrollTop();
        });
    };

    // Helper function to calculate sidebar height for fixed sidebar layout.
    var _calculateFixedSidebarViewportHeight = function () {
        var sidebarHeight = Metronic.getViewPort().height - $('.page-header').outerHeight() - 30;
        if ($('body').hasClass("page-footer-fixed")) {
            sidebarHeight = sidebarHeight - $('.page-footer').outerHeight();
        }

        return sidebarHeight;
    };

    // Handles fixed sidebar
    var handleFixedSidebar = function () {
        var menu = $('.page-sidebar-menu');

        Metronic.destroySlimScroll(menu);

        if ($('.page-sidebar-fixed').size() === 0) {
            return;
        }

        if (Metronic.getViewPort().width >= resBreakpointMd) {
            menu.attr("data-height", _calculateFixedSidebarViewportHeight());
            Metronic.initSlimScroll(menu);
        }
    };

    // Handles sidebar toggler to close/hide the sidebar.
    var handleFixedSidebarHoverEffect = function () {
        var body = $('body');
        if (body.hasClass('page-sidebar-fixed')) {
            $('.page-sidebar').on('mouseenter', function () {
                if (body.hasClass('page-sidebar-closed')) {
                    $(this).find('.page-sidebar-menu').removeClass('page-sidebar-menu-closed');
                }
            }).on('mouseleave', function () {
                if (body.hasClass('page-sidebar-closed')) {
                    $(this).find('.page-sidebar-menu').addClass('page-sidebar-menu-closed');
                }
            });
        }
    };

    // Hanles sidebar toggler
    var handleSidebarToggler = function () {
        var body = $('body');
        var closed = window.localStorage.getItem("settings.layout.pageSidebarClosed") || "";
        if (closed != "" && closed == "false") {
            closed = false;
        } else if (closed != "" && closed == "true") {
            closed = true;
        } else {
            closed = false;
        }
        if (closed && Metronic.getViewPort().width >= resBreakpointMd) {
            $('body').addClass('page-sidebar-closed');
            $('.page-sidebar-menu').addClass('page-sidebar-menu-closed');
        }

        // handle sidebar show/hide
        $('body').on('click', '.sidebar-toggler', function (e) {
            var sidebar = $('.page-sidebar');
            var sidebarMenu = $('.page-sidebar-menu');
            $(".sidebar-search", sidebar).removeClass("open");
            var closed = false;
            if (body.hasClass("page-sidebar-closed")) {
                body.removeClass("page-sidebar-closed");
                sidebarMenu.removeClass("page-sidebar-menu-closed");

            } else {
                body.addClass("page-sidebar-closed");
                sidebarMenu.addClass("page-sidebar-menu-closed");
                if (body.hasClass("page-sidebar-fixed")) {
                    sidebarMenu.trigger("mouseleave");
                }
                closed = true;
            }
            window.localStorage.setItem("settings.layout.pageSidebarClosed", closed);

            $(window).trigger('resize');
        });

        handleFixedSidebarHoverEffect();

        // handle the search bar close
        $('.page-sidebar').on('click', '.sidebar-search .remove', function (e) {
            e.preventDefault();
            $('.sidebar-search').removeClass("open");
        });

        // handle the search query submit on enter press
        $('.page-sidebar .sidebar-search').on('keypress', 'input.form-control', function (e) {
            if (e.which == 13) {
                $('.sidebar-search').submit();
                return false; //<---- Add this line
            }
        });

        // handle the search submit(for sidebar search and responsive mode of the header search)
        $('.sidebar-search .submit').on('click', function (e) {
            e.preventDefault();
            if ($('body').hasClass("page-sidebar-closed")) {
                if ($('.sidebar-search').hasClass('open') === false) {
                    if ($('.page-sidebar-fixed').size() === 1) {
                        $('.page-sidebar .sidebar-toggler').click(); //trigger sidebar toggle button
                    }
                    $('.sidebar-search').addClass("open");
                } else {
                    $('.sidebar-search').submit();
                }
            } else {
                $('.sidebar-search').submit();
            }
        });

        // handle close on body click
        if ($('.sidebar-search').size() !== 0) {
            $('.sidebar-search .input-group').on('click', function (e) {
                e.stopPropagation();
            });

            $('body').on('click', function () {
                if ($('.sidebar-search').hasClass('open')) {
                    $('.sidebar-search').removeClass("open");
                }
            });
        }
    };

    // Handles the horizontal menu
    var handleHeader = function () {
        // handle search box expand/collapse        
        $('.page-header').on('click', '.search-form', function (e) {
            $(this).addClass("open");
            $(this).find('.form-control').focus();

            $('.page-header .search-form .form-control').on('blur', function (e) {
                $(this).closest('.search-form').removeClass("open");
                $(this).unbind("blur");
            });
        });

        // handle hor menu search form on enter press
        $('.page-header').on('keypress', '.hor-menu .search-form .form-control', function (e) {
            if (e.which == 13) {
                $(this).closest('.search-form').submit();
                return false;
            }
        });

        // handle header search button click
        $('.page-header').on('mousedown', '.search-form.open .submit', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).closest('.search-form').submit();
        });
    };

    // Handles the go to top button at the footer
    var handleGoTop = function () {
        var offset = 300;
        var duration = 500;

        if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) { // ios supported
            $(window).bind("touchend touchcancel touchleave", function (e) {
                if ($(this).scrollTop() > offset) {
                    $('.scroll-to-top').fadeIn(duration);
                } else {
                    $('.scroll-to-top').fadeOut(duration);
                }
            });
        } else { // general 
            $(window).scroll(function () {
                if ($(this).scrollTop() > offset) {
                    $('.scroll-to-top').fadeIn(duration);
                } else {
                    $('.scroll-to-top').fadeOut(duration);
                }
            });
        }

        $('.scroll-to-top').click(function (e) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: 0
            }, duration);
            return false;
        });
    };
    //* END:CORE HANDLERS *//

    //绑定菜单列表，数据从后端获取到
    var initMenuURL = function ($scope, $http, $modal, $window, $state, callback) {
        // 数据从服务端获取，或从指定的JSON文件当中获取
        var menus = [
            {
                "name": "机构管理", "icon": "jigou",
                "subList": [
                    {"name": "机构录入", "icon": "luru", "url": "divisionEntry"},
                    {"name": "机构修改", "icon": "xiugai", "url": "divisionModify"},
                    {"name": "机构迁移", "icon": "shujujiaohuan", "url": "divisionMigration"}
                ]
            },
            {
                "name": "部门管理", "icon": "bumenjiagou",
                "subList": [
                    {"name": "部门录入", "icon": "luru", "url": "departmentEntry"},
                    {"name": "部门修改", "icon": "xiugai", "url": "departmentModify"},
                    {"name": "部门查询", "icon": "zhongduanchaxun", "url": "departmentSearch"},
                    {"name": "部门停用", "icon": "tingyongzhiyuan", "url": "departmentDisable"},
                    {"name": "部门迁移", "icon": "shujujiaohuan", "url": "departmentMigration"}
                ]
            },
            {
                "name": "人才管理", "icon": "gaojirencaisousuo",
                "subList": [
                    {"name": "人才招聘", "icon": "luru", "url": "talentEntry"},
                    {"name": "人才修改", "icon": "renyuandiaodong", "url": "talentModify"},
                    {"name": "人才查询", "icon": "zhongduanchaxun", "url": "talentSearch"},
                    {"name": "人才面试", "icon": "mianshi", "url": "talentInterview"},
                    {"name": "人才删除", "icon": "shanchu", "url": "talentDeleted"}
                ]
            },
            {
                "name": "人员管理", "icon": "quanxianshezhi",
                "subList": [
                    {"name": "人员录入", "icon": "luru", "url": "partyRoleEntry"},
                    {"name": "人员修改", "icon": "renyuandiaodong", "url": "partyRoleModify"},
                    {"name": "人员查询", "icon": "zhongduanchaxun", "url": "partyRoleSearch"},
                    {"name": "人员离职", "icon": "lizhi", "url": "partyRoleQuit"},
                    {"name": "人员调动", "icon": "diaodongshenqing", "url": "partyRoleTransfer"},
                    {"name": "影像管理", "icon": "yingxiang", "url": "partyRoleImageManage"}
                ]
            },
            {
                "name": "产品管理", "icon": "chanpinku",
                "subList": [
                    {"name": "产品录入", "icon": "luru", "url": "productEntry"},
                    {"name": "产品修改", "icon": "renyuandiaodong", "url": "productModify"},
                    {"name": "产品查询", "icon": "zhongduanchaxun", "url": "productSearch"},
                    {"name": "产品删除", "icon": "shanchu", "url": "productRemove"},
                    {"name": "期次录入", "icon": "luru", "url": "raisingPeriodEntry"},
                    {"name": "期次修改", "icon": "renyuandiaodong", "url": "raisingPeriodModify"}
                ]
            },
            {
                "name": "业务管理", "icon": "quanxianguanlix",
                "subList": []
            },
            {
                "name": "薪酬结算", "icon": "quanxianguanlix",
                "subList": []
            },
            {
                "name": "审核管理", "icon": "quanxianguanlix",
                "subList": [
                    {"name": "审核流程", "icon": "huiyuan", "url": "flowTemplateEntry"},
                    {"name": "业务审核", "icon": "huiyuan", "url": "businessFlowEntry"},
                    {"name": "部门审核", "icon": "huiyuan", "url": "auditDepartmentEntry"},
                    {"name": "工员审核", "icon": "huiyuan", "url": "auditPartyRoleEntry"},
                ]
            },
            {
                "name": "系统管理", "icon": "quanxianguanlix",
                "subList": []
            },

            {
                "name": "权限管理", "icon": "quanxianguanlix",
                "subList": [
                    {"name": "用户管理", "icon": "huiyuan", "url": "securityUserList"},
                    {"name": "角色管理", "icon": "access_user", "url": "securityRoleList"},
                    {"name": "资源录入", "icon": "luru", "url": "resourceEntry"},
                    {"name": "资源修改", "icon": "xiugai", "url": "resourceModify"},
                    {"name": "字典管理", "icon": "shujuzidianguanli", "url": "securityImList"},
                    {"name": "示例代码", "icon": "893renwumiaoshu", "url": "formTest"}

                ]
            }];


        var ApiRequest = {};
        ApiRequest["transCode"] = "9124";
        ApiRequest["requestBody"] = {"no": "no"};
        $http.post("../menus.json", ApiRequest).success(function (data, status, headers, config) {
            if (data.status == 401) {//用户未登录
                $window.location.href = "login.html";
            } else if (data.status == 403) {
                alert("无权限获取菜单!");
                return;
            }
            if (angular.isUndefined(data)) {
                $scope.pageHeaderMenus = null;
                return;
            }
            angular.forEach(menus, function (menu, i) {
                if (menu.subList) {
                    var parentShow = false;
                    angular.forEach(menu.subList, function (m, index) {
                        var isExist = false;
                        angular.forEach(data, function (item) {
                            if (m.url == item['url']) {
                                isExist = true;
                                return false;
                            }
                        });
                        m["show"] = isExist;
                        if (isExist) {
                            parentShow = true;
                        }
                    });
                    //子菜单都为空时,父级菜单不显示
                    menu["show"] = parentShow;
                } else {
                    var isExist = false;
                    angular.forEach(data, function (item) {
                        if (menu.url == item['url']) {
                            isExist = true;
                            return false;
                        }
                    });
                    menu["show"] = isExist;
                }
            });
            $scope.pageHeaderMenus = menus;

            callback.call();
        }).error(function (data, status, headers, config) {

        });


    };

    return {

        // Main init methods to initialize the layout
        // IMPORTANT!!!: Do not modify the core handlers call order.

        initHeader: function () {
            handleHeader(); // handles horizontal menu    
        },

        setSidebarMenuActiveLink: function (mode, el, stateName) {
            handleSidebarMenuActiveLink(mode, el, stateName);
        },

        initSidebar: function ($scope, $http, $modal, $window, $state) {
            var stateName = $state.$current.name;
            initMenuURL($scope, $http, $modal, $window, $state, function () {
                //layout handlers
                handleFixedSidebar(); // handles fixed sidebar menu
                handleSidebarMenu(); // handles main menu
                handleSidebarToggler(); // handles sidebar hide/show

                if (Metronic.isAngularJsApp()) {
                    setTimeout(function () {
                        //延迟几百毫秒,等待菜单列表渲染完成再触发激活菜单状态的事件
                        handleSidebarMenuActiveLink('match', null, stateName);
                    }, 500);
                    // init sidebar active links
                }

                Metronic.addResizeHandler(handleFixedSidebar); // reinitialize fixed sidebar on window resize

            });
        },

        initContent: function () {
            return;
        },

        initFooter: function () {
            handleGoTop(); //handles scroll to top functionality in the footer
        },

        init: function () {
            this.initHeader();
            this.initSidebar();
            this.initContent();
            this.initFooter();
        },

        //public function to fix the sidebar and content height accordingly
        fixContentHeight: function () {
            return;
        },

        initFixedSidebarHoverEffect: function () {
            handleFixedSidebarHoverEffect();
        },

        initFixedSidebar: function () {
            handleFixedSidebar();
        },

        getLayoutImgPath: function () {
            return Metronic.getAssetsPath() + layoutImgPath;
        },

        getLayoutCssPath: function () {
            return Metronic.getAssetsPath() + layoutCssPath;
        }
    };

}();