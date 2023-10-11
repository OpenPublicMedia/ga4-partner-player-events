# PBS Partner Player GA4 Events with Google Tag Manager

## Setup GA4 PBS Partner Player Events in GTM
- Added 7 Variables that are set/read in the dataLayer
- Added iframe message processor
- Added event submitter to GA4 analytics
- Assigned all items in PBS Partner Player folder


## Google Tag Manager (GTM) Setup

### Workspace
Create a new workspace to encapsulate the work to be done. Can be named: **GA4 PBS Partner Player Events**

### User-Defined Variables
Create the following user-defined variables in GTM

Do the following for each of the following variables:
* PBS Partner Player Action, pbs_video_action
* PBS Partner Player Duration, pbs_video_duration
* PBS Partner Player Embed URL, pbs_video_embed_url
* PBS Partner Player Percent, pbs_video_percent
* PBS Partner Player Provider, pbs_video_provider
* PBS Partner Player Title, pbs_video_title
* PBS Partner Player URL, pbs_video_url

For example:
* Example: PBS Partner Player Action, pbs_video_action
- Create a new variable:
- - `Variables > User-Defined Variables > (click) New`
- Variable Name: **PBS Partner Player Action**
- Variable Configuration: **Data Layer Variable**
- Data Layer Variable Name: **pbs_video_action**
- Data Layer Version: **Version 2** (should already be default)
- Set Default Value: (leave unchecked)

### Trigger
- Create a new variable:
  - `Triggers > (click) New`
- Trigger Name: **Event - partnerPlayerEvent**
- Trigger Configuration: **Custom Event**
  - Event Name: **partnerPlayerEvent**
  - This trigger fires on: **[*] All Custom Events** (should be checked)
- Save Trigger

### Tags
#### ~~1. GA4 - PBS Partner Player Message Processor~~ (Currently being added directly to the website head area)
  - Create a new variable:
    - `Tags > (click) New`
  - Tag Name: **GA4 - PBS Partner Player Message Processor**
  - Tag Configuration: **Custom HTML**
    - ```<script>(Insert contents of partnerPlayerGA4Events.js)</script>```
  - Triggering: **All Pages** (with respect to your Consent Mode setup)
  - Save Tag
#### 2. GA4 Partner Player Event Submitter
  - Create a new variable:
    - `Tags > (click) New`
  - Tag Name: **GA4 Partner Player Event Submitter**
  - Tag Configuration: **Google Analytics: GA4 Event**
    - Configuration Tag: *(Your GA4 Configuration Tag, typically the basic GA4 Page Views tag)*
    - Event Name: **video_{{PBS Partner Player Action}}**  (This will allow us to pass in either *start* or *completed*)
    - Event Parameters:
Your user-defined variables should pop up as you start typing ```"{{PBS Partne"``` into the value field

| Parameter Name | Value |
| --- | --- |
| video_duration | {{PBS Partner Player Duration}} |
| video_provider | {{PBS Partner Player Provider}} |
| video_title | {{PBS Partner Player Title}} |
| video_url | {{PBS Partner Player URL}} |
| video_percent | {{PBS Partner Player Percent}} |
| video_embed_url | {{PBS Partner Player Embed URL}} |

- Trigger: **Event - partnerPlayerEvent**
- Save Tag
