// v20230501
(function() {
  var PBS_Partner_Players = [];

  var getFrameTarget = function(evt) {
      var frames = document.querySelector('body').getElementsByTagName('iframe')
        , frameId = 0
        , framesLength = frames.length;

      for (; frameId < framesLength; frameId++) {
          if (frames[frameId].contentWindow === evt.source) {
              return {
                  "index": frameId,
                  "value": frames[frameId]
              };
          }
      }
      return null;
  };

  var getPartnerPlayerFromEvent = function(evt) {
      var partnerPlayer = false;
      if (PBS_Partner_Players) {
          partnerPlayer = PBS_Partner_Players.find(function(partnerplayer) {
              return partnerplayer.value == getFrameTarget(evt).value;
          });
      }
      return partnerPlayer;
  };

  function determineEventType(action, value, evt) {
      var currentVideoPlayer;

      if (action === "video") {
          // Get current iframe object from PBS_Partner_Players
          currentVideoPlayer = getPartnerPlayerFromEvent(evt);

          // Create object copy to prevent same object reference in dataLayer for different event
          currentVideoPlayer.data = Object.assign({}, currentVideoPlayer.data);

          if (currentVideoPlayer) {
              // video_start
              if (value === "playing" && currentVideoPlayer.firstView) {
                  currentVideoPlayer.firstView = false;
                  currentVideoPlayer.data.pbs_video_percent = 0;
                  currentVideoPlayer.data.pbs_video_action = 'start';

                  // Submit Event
                  // console.log('start', currentVideoPlayer.data);
                  submitPartnerPlayerEvent(currentVideoPlayer.data);

              // video_complete
              } else if (value === 'finished') {
                  currentVideoPlayer.data.pbs_video_percent = 100;
                  currentVideoPlayer.data.pbs_video_action = 'complete';

                  // Track Event
                  // console.log('complete', currentVideoPlayer.data);
                  submitPartnerPlayerEvent(currentVideoPlayer.data);
              }
          }
      }
  }

  function submitPartnerPlayerEvent(vid_data){
      window.dataLayer = window.dataLayer || [];
      dataLayer.push(vid_data);
      // console.log('pushing:', vid_data);
  }

  function videoMessageHandler(evt) {
      // Only read messages coming from origin window: player.pbs.org
      if (/^https?:\/\/player.pbs.org/.test(evt.origin)) {

          var data = evt.data;
          var hasSeparator = /::/.test(data);
          var action = (hasSeparator) ? data.split('::')[0] : data;
          var value = (hasSeparator) ? data.split('::')[1] : '';
          var videoInfoRegex = /({"title":")(.*)(?=","airdate")/g;
          var isVideoInfo = videoInfoRegex.test(data);
          var frameTarget, vidData;
          // console.log('isVideoInfo', isVideoInfo, '\nDATA:', data, '\nACTION:', action, '\nVALUE:', value);

          // If message is video information/data, setup frame in PBS_Partner_Players
          if (isVideoInfo) {
              // Setup frame in PBS_Partner_Players
              vidData = JSON.parse(value);
              frameTarget = getFrameTarget(evt);
              frameTarget.data = {
                  'event': 'partnerPlayerEvent',
                  'pbs_video_duration': vidData.duration,
                  'pbs_video_provider': 'PBS Partner Player',
                  'pbs_video_title': vidData.program.title + " - " + vidData.title,
                  'pbs_video_url': frameTarget.value.src,
                  'pbs_video_embed_url': window.location.href

                  // NOT ADDED: Info not available from message data
                  // ,'pbs_video_current_time': (result.event/100)*pbs_video_duration
                  // ,'pbs_video_percent': result.event, // this will be 0 for video_start, and 100 for video_complete (Added in determineEventType function)
                  // ,'visible': 1  // 1 or 0 if player visible on screen while video engagement was tracked                    
              };
              frameTarget.firstView = true;
              PBS_Partner_Players.push(frameTarget);
          }

          // If message data (action::value) is video::playing or video::finished (ignored: video::intitialized)
          // then process event type
          if (action === 'video' && (value === 'playing' || value === 'finished')) {
              determineEventType(action, value, evt);
          }
      }
  }

  function isPartnerPlayerOnPage() {
      for (var e = document.getElementsByTagName("iframe"), x=0; x < e.length; x++) {
          if (/^https?:\/\/player.pbs.org/.test(e[x].src)) {
              return true;
          }
      }
      return false;
  }

  function partnerPlayerEvents() {
      var hasPartnerPlayer = isPartnerPlayerOnPage();

      // If PBS Partner Player exists, setup addEventListener for all iframe messages
      if (hasPartnerPlayer) {
          if (typeof window.addEventListener === 'function') {
              window.addEventListener('message', videoMessageHandler, false)
          } else {
              window.attachEvent('onmessage', videoMessageHandler)
          }
      }
  }

  // CheckDOM
  (function(d, f) {
      if (d.readyState === 'loading') {
          d.addEventListener('readystatechange', function() {
              if (d.readyState === 'interactive') {
                  f();
              }
          });
      } else {
          f();
      }
  })(document, partnerPlayerEvents);
}
)();