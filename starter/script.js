$(document).ready(function () {

    appkey =  "58fd75da88a9ad4c48a2eb7af4a02455";

    // the below code will cget the city co-ordinates
    $( "#search-form" ).submit(function( event ) {
        let city = $("#search-input").val();
        
        console.log(city);
        var qryLocationURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + appkey;
        
        $.ajax({
          url: qryLocationURL,
          method: "GET"
        }).then(function(response) {
            GetWeather(response);
        });
        event.preventDefault();
      });


      function GetWeather(response){
        let lat;
        let lon;
        lat = response.coord.lat;
        lon = response.coord.lon;
        let queryURL = "http://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&appid="+appkey;
          
          console.log(queryURL);
          $.ajax({
            url: queryURL,
            method: "GET"
          }).then(function(result) {
              resp = result;
              console.log(resp);
              let htmlStr ="";
              htmlStr += '<div class="card"><div class="card-body">';
              htmlStr += $("#search-input").val()+ ' ('+(new Date(resp.list[0].dt_txt)).toLocaleDateString('en-GB')+')<br>';
              htmlStr += 'Temp: '+resp.list[0].main.temp+'<br>';
              htmlStr += 'Wind: '+resp.list[0].wind.speed+'<br>';
              htmlStr += 'Humidity: '+resp.list[0].main.humidity;

              $('#today').append(htmlStr);

              let dt = new Date(resp.list[0].dt_txt);
              dt.setDate(dt.getDate()+1);
              for(let i=1; i< resp.list.length; i++){
                loopDt = new Date(resp.list[i].dt_txt);
                if(loopDt.getDate() == dt.getDate() && loopDt.getMonth()+1 == dt.getMonth()+1 && loopDt.getFullYear() == dt.getFullYear()){
                    console.log("date vali");
                    htmlStr="";
                    htmlStr = '<div class="card"><div class="card-body">';
                    htmlStr += $("#search-input").val()+ ' ('+(new Date(resp.list[i].dt_txt)).toLocaleDateString('en-GB')+')<br>';
                    htmlStr += 'Temp: '+resp.list[i].main.temp+'<br>';
                    htmlStr += 'Wind: '+resp.list[i].wind.speed+'<br>';
                    htmlStr += 'Humidity: '+resp.list[i].main.humidity;
                    $('#forecast').append(htmlStr);
                    dt.setDate(dt.getDate()+1);
                }
                
              }

          });

      }





});
