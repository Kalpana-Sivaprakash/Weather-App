$(document).ready(function () {

  appkey = "58fd75da88a9ad4c48a2eb7af4a02455";

            //clear local storage
      UpdateSearchHistory();

  $("#clearHistory").click(function () {
      localStorage.clear();
      UpdateSearchHistory();
  });
  // the below code will cget the city co-ordinates
  $("#search-form").submit(function (event) {
      let city = $("#search-input").val().trim();
      console.log(city);

      if (city == "") {
          console.log("error", "city name cannot be blank");
          alert("city name should not be blank");
      }

       

      var qryLocationURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + appkey;
     
      $.ajax({
        url: qryLocationURL,
        method: "GET"
      }).then(function(response) {
          GetWeather(response);
      });
      event.preventDefault();
    });


  $("#city-history").find(":button").on('click', function () {
      $("#search-input").val($(this).val());
  });

    function GetWeather(response){
      let lat;
      let lon;
      lat = response.coord.lat;
      lon = response.coord.lon;
      let queryURL = "http://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&appid="+appkey;
       
        $.ajax({
          url: queryURL,
          method: "GET"
        }).then(function(result) {
            resp = result;
            console.log(resp);
            UpdateWeatherScreen(resp);
            localSession();
            UpdateSearchHistory();


           
        });

    }

  function UpdateWeatherScreen(resp) {
      let htmlStr = "";
      htmlStr += '<div class="card border-dark"><div class="card-body"><b>';
      htmlStr += $("#search-input").val() + ' (' + (new Date(resp.list[0].dt_txt)).toLocaleDateString('en-GB') + ')</b><br>';
      htmlStr += 'Temp: ' + resp.list[0].main.temp + '<br>';
      htmlStr += 'Wind: ' + resp.list[0].wind.speed + '<br>';
      htmlStr += 'Humidity: ' + resp.list[0].main.humidity;

      $('#today').html("");
      $('#forecast').html("");
      $('#today').append(htmlStr);

      let dt = new Date(resp.list[0].dt_txt);
      dt.setDate(dt.getDate() + 1);
      $('#forecast').append('<div class="container mt-3"><div id="forecast-flex" class="d-flex mb-3 gap-2" >');
      for (let i = 1; i < resp.list.length; i++) {
          loopDt = new Date(resp.list[i].dt_txt);
          if (loopDt.getDate() == dt.getDate() && loopDt.getMonth() + 1 == dt.getMonth() + 1 && loopDt.getFullYear() == dt.getFullYear()) {
              console.log("date vali");
              htmlStr = "";
              htmlStr += '<div class="p-2 mx-5 flex-fill bg-info">Flex item 1</div>';
              htmlStr = '<div class="card bg-dark text-white"><div class="card-body"><b>';
              htmlStr += $("#search-input").val() + ' (' + (new Date(resp.list[i].dt_txt)).toLocaleDateString('en-GB') + ')</b><br>';
              htmlStr += 'Temp: ' + resp.list[i].main.temp + '<br>';
              htmlStr += 'Wind: ' + resp.list[i].wind.speed + '<br>';
              htmlStr += 'Humidity: ' + resp.list[i].main.humidity;
              htmlStr += '</div></div>';
             
              $('#forecast').append(htmlStr);
              dt.setDate(dt.getDate() + 1);
          }
          $('#forecast').append('</div></div>');
         
      }

  }

  function localSession() {
      let searchList;
      let searchListJson = [];
      if (localStorage.getItem("SearchList") != null) {
          searchList = localStorage.getItem("SearchList");
          searchListJson = JSON.parse(searchList);
          //check duplicates
          var added = false;
          $.each(searchListJson, function (i, val) {
              if (val.toLowerCase() == $("#search-input").val().toLowerCase()) {
                  added = true;
              }
          });
          if (!added) {
              searchListJson.push($("#search-input").val());
              localStorage.setItem("SearchList", JSON.stringify(searchListJson));
          }

      } else {
          searchListJson.push($("#search-input").val());
          localStorage.setItem("SearchList", JSON.stringify(searchListJson));
          searchList = localStorage.getItem("SearchList");
          searchListJson = JSON.parse(searchList);
      }

  }

  function UpdateSearchHistory() {
      $('#city-history').html("");
      $('#city-history').append('<hr>');
      if (localStorage.getItem("SearchList") != null) {
          $("#clearHistory").show();
          let searchList = localStorage.getItem("SearchList");
          let searchListJson = JSON.parse(searchList);
          $.each(searchListJson, function (i, val) {
              let htmlBtn = "";
              htmlBtn += '<input type="button" class="btn btn-secondary col-sm-12 mt-3" value="' + val + '">';
              $('#city-history').append(htmlBtn);
          });
      }
      else {
          $("#clearHistory").hide();
      }
     
  }

});
