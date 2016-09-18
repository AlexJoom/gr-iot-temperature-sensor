griot.dashoardIndex = function(){};
griot.dashoardIndex.prototype = (function(){

    var bindMeasurementsOnTable = function(deviceFriendlyName,deviceId, data){
        $("#results-info").find("span").text(deviceFriendlyName +", "+ data.length + " μετρήσεις τις τελευταίες 48 ώρες");
        $("#export").attr("href","/dashboard/measurements/export/"+deviceId);
        var results = [];
        $.each(data,function(index,el){
            results.push("<tr><td>"+(index+1)+"</td>"+
                             "<td>"+el.data+"</td>"+
                             "<td>"+el.createdAt+"</td>"+
                         "</tr>");
        });
        $("#results").find("tbody").append(results.join());
    },
        retrieveMeasurements = function(){
            var deviceId = $(this).data("id");
            var deviceFriendlyName = $(this).text();
            griot.setState(griot.enum.State.LOADING);
            $(".device").removeClass("active");
            $(this).addClass("active");

            $.ajax({
                url: "/dashboard/measurements/"+deviceId,
                cache:false,
                success: function(data){
                    if (data && data.length>0){
                        griot.setState(griot.enum.State.HAS_RESULTS);
                        bindMeasurementsOnTable(deviceFriendlyName,deviceId,data);
                    }
                    else
                        griot.setState(griot.enum.State.NO_RESULTS);
                },
                error: function(){
                    griot.setState(griot.enum.State.ERROR);
                }
            });
        },
        init = function(){
            $(function(){
                $("#devices").on("click",".device",retrieveMeasurements);
                //fetch data for first
                $(".device").first().trigger("click");
            });
        };


    return {init:init}
})()


var dashboardIndex = new griot.dashoardIndex();
dashboardIndex.init();