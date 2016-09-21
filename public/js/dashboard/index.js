griot.dashoardIndex = function(){};
griot.dashoardIndex.prototype = (function(){

    var bindMeasurementsOnTable = function(deviceFriendlyName,deviceId, data){
        $("#results-info").find("span").text(deviceFriendlyName +", "+ data.length + " μετρήσεις τις τελευταίες 24 ώρες");
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
    groupBy = function (collection, property) {
        var collectionCopy = collection;
        for (var k = 0; k < collectionCopy.length; k++) {
            //TODO comment
            collectionCopy[k]['createdAt'] = new Date(collectionCopy[k]['createdAt']).getHours();
            //console.log(collectionCopy[k].createdAt);
        }
        var i = 0, val, index,
            values = [], result = [], groupped = [];
        for (; i < collectionCopy.length; i++) {
            val = collectionCopy[i][property];
            index = values.indexOf(val);
            if (index > -1)
                result[index].push(collectionCopy[i]);
            else {
                values.push(val);
                result.push([collectionCopy[i]]);
            }
        }
        for(i = 0; i < result.length; i++) {
            var dataSum = 0;
            for(k = 0; k < result[i].length; k++) {
                dataSum += result[i][k].data;
            }
            groupped.push({'createdAt': result[i][k-1]['createdAt'], 'data': Math.round(dataSum/result[i].length)});
        }
        groupped.sort(function(a, b){
            var keyA = new Date(a['createdAt']),
                keyB = new Date(b['createdAt']);
            // Compare the 2 dates
            if(keyA < keyB) return -1;
            if(keyA > keyB) return 1;
            return 0;
        });
        return groupped;
    },
    bindMeasurementsOnChart = function(deviceFriendlyName,deviceId, graphData){
        console.log(graphData);
        var ctx = document.getElementById("temperaturesChart");

        var data = {
            labels: [],
            datasets: [
                {
                
                    label: "Θερμοκρασία",
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "rgba(75,192,192,1)",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "rgba(75,192,192,1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(75,192,192,1)",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: [],
                    spanGaps: true,
                }
            ]
        };
        console.log(data.datasets[0]);
        for(var i = 0; i < graphData.length; i++) {
            data.labels.push(graphData[i]['createdAt']);
            data.datasets[0].data.push(graphData[i].data);
        }
        var myChart = new Chart(ctx, {
                type: 'line',
                data: data,
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                suggestedMin: graphData[0].data - 5,
                                suggestedMax: graphData[0].data + 5,
                                stepSize: 1
                            }
                        }]
                    }
                }
            });
        $("#temperaturesChart").css("display", "block");
        },
        retrieveMeasurements = function(){
            var deviceId = $(this).data("id");
            var deviceFriendlyName = $(this).text();
            griot.setState(griot.enum.State.LOADING);
            $(".device").removeClass("active");
            $(this).addClass("active");

            $.ajax({
                url: "/dashboard/measurements/"+deviceId + "/hours/" + "24",
                cache:false,
                success: function(data){
                    if (data && data.length>0){
                        griot.setState(griot.enum.State.HAS_RESULTS);
                        bindMeasurementsOnTable(deviceFriendlyName,deviceId,data);
                    
                        bindMeasurementsOnChart(deviceFriendlyName,deviceId,groupBy(data, 'createdAt'));
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