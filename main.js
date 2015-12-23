'use strict';
$(document).ready(function() {
  // Global Variables
  // List of streamers
  var streamers = [
    'freecodecamp',
    'MedryBW',
    'luminosity48',
    'snipealot4',
    'terakilobyte',
    'habathcx',
    'gervasoadyt',
    'thomasballinger',
    'noobs2ninjas',
    'beohoff',
    'comster404',
    'brunofin'
  ];
  // Status lists
  var streamersAll = [];
  var streamersOnline = [];
  var streamersOffline = [];
  // URL base of API 
  var url = 'https://api.twitch.tv/kraken/';
  var activeList;

  function toStartApp() {
    streamers.forEach(function(streamer) {
      // Temporary object
      var streamerTemp = {};
      streamerTemp.url = 'https://twitch.tv/' + streamer;
      streamerTemp.show = true;
      // Check if streaming
      $.getJSON(url + 'streams/' + streamer)
        // If streamer channel exist..
        .success(function(data) {
          var streaming = (data.stream === null) ? false : true;
          if (streaming) {
            streamerTemp.status = '&#xf14a;';
            var streamTitle = data.stream.channel.status;
            if (streamTitle.length > 36) {
              streamTitle = streamTitle.substring(0, 33);
              streamTitle += '...';
            }
            streamerTemp.streamTitle = streamTitle;
          } else {
            streamerTemp.status = '&#xf00d;';
            streamerTemp.streamTitle = '';
          }
          streamerTemp.nombre = streamer;

          // Get user name and image
          $.getJSON(url + 'users/' + streamer).success(function(data) {
            streamerTemp.name = data.display_name;
            if (data.logo === null) {
              streamerTemp.logo = 'http://s.jtvnw.net/jtv_user_pictures/hosted_images/TwitchGlitchIcon_WhiteNoBkgrd.png';
            } else {
              streamerTemp.logo = data.logo;
            };

            streamersAll.push(streamerTemp);
            if (streaming) {
              streamersOnline.push(streamerTemp);
            } else {
              streamersOffline.push(streamerTemp);
            }
          });

        })
        // If streamer channel doesn't exist...
        .fail(function() {
          streamerTemp.name = streamer;
          streamerTemp.logo = 'https://cdn3.iconfinder.com/data/icons/softwaredemo/PNG/256x256/DeleteRed.png';
          streamerTemp.status = 'Closed';
          streamerTemp.streamTitle = '';
          streamerTemp.url = '';
          streamersAll.push(streamerTemp);
        });
    });
  }
  // Activate template html for streamer item.
  function activateTemplate(id) {
    var t = document.querySelector(id);
    return document.importNode(t.content, true);
  }
  // Render template for each item.
  function renderTemplate(streamer) {
    var clone = activateTemplate('#template--streamer');
    // Pinta los datos
    clone.querySelector('[data-url').href = streamer.url;
    clone.querySelector('[data-logo]').src = streamer.logo;
    clone.querySelector('[data-name]').innerHTML = streamer.name;
    clone.querySelector('[data-streaming]').innerHTML = streamer.status;
    clone.querySelector('[data-status]').innerHTML = streamer.streamTitle;

    $('#streamers').append(clone);
  }
  // Reder of the items 
  function toRender() {
    $('#streamers li').remove();
    toSelectList();
    activeList.forEach(function(streamer) {
      if (streamer.show === true) {
        renderTemplate(streamer);
      };

    });
  }
  // Filter the list of users compared with the text search  
  function toFilterStreamers() {
    var filtro = '';
    filtro = $('#busqueda').val().toLowerCase();
    console.log(filtro);
    if (filtro !== '') {
      activeList.forEach(function(streamer) {
        if (streamer.name.toLowerCase().indexOf(filtro) === -1) {
          streamer.show = false;
          toRender();
        };
      });
    } else {
      activeList.forEach(function(streamer) {
        streamer.show = true;
      });
      toRender();
    };
  }
  // Select the active list
  function toSelectList() {

    if ($('#online').hasClass('selected')) {
      activeList = streamersOnline;
    } else if ($('#offline').hasClass('selected')) {
      activeList = streamersOffline;
    } else {
      activeList = streamersAll;
      $('#all').addClass('selected');
    };

    return activeList;
  }
  // Change the state of the active list 
  $('#all').on('click', function() {
    $('#all').addClass('selected');
    $('#online, #offline').removeClass('selected');
    toRender();
  })

  $('#online').on('click', function() {
    $('#online').addClass('selected');
    $('#all, #offline').removeClass('selected');
    toRender();
  })

  $('#offline').on('click', function() {
      $('#offline').addClass('selected');
      $('#all, #online').removeClass('selected');
      toRender();
    })
    // Ejecution of the search
  $('#busqueda').keyup(toFilterStreamers);

  toStartApp();
  setTimeout(toRender, 2500); // delaying the rendering
});