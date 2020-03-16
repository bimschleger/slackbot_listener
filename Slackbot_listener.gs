// this is what we're doing: https://medium.com/@yusuke8h/easy-slack-bot-from-google-apps-script-82065b5e08f7

var SLACK_ACCESS_TOKEN = PropertiesService.getScriptProperties().getProperty('SLACK_ACCESS_TOKEN');
var POST_MESSAGE_ENDPOINT = 'https://slack.com/api/chat.postMessage';
  

function doPost(e) {
  
//  // Get the event response
//  var request = e.postData.contents;
//  
//  // Convert the response into a JSON object
//  var requestJson = JSON.parse(request);
//  
//  // Only get the challenge key from the Slack verification POST
//  var challenge = requestJson.challenge;
//  
//  // Return the challenge verification
//  //return ContentService.createTextOutput(challenge);
  
  
  /*
  
  standard channel message event that comes in
  
  {
    "token": "one-long-verification-token",
    "team_id": "T061EG9R6",
    "api_app_id": "A0PNCHHK2",
    "event": {
        "type": "message",
        "channel": "C024BE91L",
        "user": "U2147483697",
        "text": "Live long and prospect.",
        "ts": "1355517523.000005",
        "event_ts": "1355517523.000005",
        "channel_type": "channel"
    },
    "type": "event_callback",
    "authed_teams": [
        "T061EG9R6"
    ],
    "event_id": "Ev0PV52K21",
    "event_time": 1355517523
  }
  
  */
  
  var event = JSON.parse(e.postData.contents).event;
  
  if (!event.bot_id) {
    
    SendToSlack(event);
    
  }
}

function SendToSlack(event){
  
  var payload = {token:SLACK_ACCESS_TOKEN, 
                 channel:event.channel, 
                 text:event.text.toUpperCase()};
  
  var options = {method: 'post',
                 payload: payload}
  
  UrlFetchApp.fetch(POST_MESSAGE_ENDPOINT, options);

}
