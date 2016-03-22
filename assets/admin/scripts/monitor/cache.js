/**
 * Created by wanglijun on 16/1/6.
 */
$(function () {
    //默认加载函数
    lion.web.AppInit();

    $('.btn-manager-clear').click(function(){
        var $this=$(this),ehcachename=$this.data('ehcachename'),params={'ehcacheName':ehcachename};
        console.dir(params);
        bootbox.confirm('确认要清除此缓存？', function(result) {
            if(result){

            lion.util.post('clear.json',params,function(data){
                console.dir(data);
                if(data.success){
                    lion.util.success('提示',data.message);
                    setTimeout(location.reload(),500);
                    //$this.parent().parent().remove();
                    //$('.'+ehcachename).remove();
                }else{
                    lion.util.error('提示',data.message);
                }
            }
            ,function(){
                lion.util.error('提示','清除缓存失败!');
            });
        }
        });


    });


    $('.btn-cache-clear').click(function(){
        var $this=$(this),ehcachename=$this.data('ehcachename'),cacheName=$this.data('cachename'),params={'ehcacheName':ehcachename,'cacheName':cacheName};
        bootbox.confirm('确认要清除此缓存？', function(result) {
            if(result){

                lion.util.post('clear.json',params,function(data){
                        if(data.success){
                            lion.util.success('提示',data.message);
                            //刷新页面数据
                            setTimeout(location.reload(),500);
                        }else{
                            lion.util.error('提示',data.message);
                        }
                    }
                    ,function(){
                        lion.util.error('提示','清除缓存失败!');
                    });
            }
        });
    });
});