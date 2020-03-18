/* 

Sample Slackbot listener.

Loosly built off of:
https://medium.com/@yusuke8h/easy-slack-bot-from-google-apps-script-82065b5e08f7

The goals are to:

1) Verify Google Apps Script as a service that accepts POST requests from Slack.
2) Receive message event subscriptions from Slack.
3) Post a message back into Slack.

*/

// The Slack OAuth access token that Slack provides once we create bot user.
// Access in Scripts > File > Project properties > Script properties
var SLACK_ACCESS_TOKEN = PropertiesService.getScriptProperties().getProperty('SLACK_ACCESS_TOKEN');

// Where this webapp sends messages into Slack.
var POST_MESSAGE_ENDPOINT = 'https://slack.com/api/chat.postMessage';


/* 
*
* Accepts data that a system posts to this webapp.
*
* @param {object} e - Some data that is sent via POST request to this webapp.
*
*/

function doPost(e) {
  
  /*
   
  Sample initial verification object from Slack.
  Via: https://api.slack.com/events/url_verification

  {
    "token": "Jhj5dZrVaK7ZwHHjRyZWjbDl",
    "challenge": "3eZbrw1aBm2rZgRNFdxV2595E9CY3gmdALWMmHkvFXO7tYXAYM8P",
    "type": "url_verification"
  }
  
  */
  
  /*
  
  Sample Channel message event that Slack sends into the webapp.
  Via: https://api.slack.com/events/message.channels
  
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
  
  var request = JSON.parse(e.postData.contents);
  
  // Check to see is the POST request includes a challenge.
  if (request.challenge) {
    
    var challenge = request.challenge;
    return ContentService.createTextOutput(challenge);
    
  } else {
    
    // Get the message event from the object.
    var event = request.event;
    
    // If the Channel message was not sent by a bot
    // Prevents an infinite loop where a bot replies to a bot message in perpetuity.
    if (!event.bot_id) {
      SendToSlack(event);
    }
  }
}


/* 
*
* Sends into Slack an ALLCAPS version of the user's initial word.
*
* @param {object} event - A Slack message event
*
*/

function SendToSlack(event){
  
  // Defines where and what of the slack message
  var payload = {token: SLACK_ACCESS_TOKEN, // OAuth bot token.
                 channel: event.channel, 
                 text:event.text.toUpperCase()};
  
  var options = {method: 'post',
                 payload: payload}
  
  UrlFetchApp.fetch(POST_MESSAGE_ENDPOINT, options);
}