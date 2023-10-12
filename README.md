# PBS Partner Player GA4 Events with Google Tag Manager

## Google Tag Manager (GTM) Setup
## Setup GA4 PBS Partner Player Events in GTM
- Create a workspace to hold all the changes
- Added 7 Variables that are set/read in the dataLayer
- Added iframe message processor (as script on website head, rather than GTM Tag)
- Added event submitter to GA4 analytics
- Assigned all items in PBS Partner Player folder

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

For example setup for each variable:
* Example: **PBS Partner Player Action, pbs_video_action**
- Create a new user defined variable:
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
#### ~~1. GA4 - PBS Partner Player Message Processor~~ (ga4PartnerPlayerEvents.js is currently being added directly to website head)
Since we need to capture the an iframe message that occurs before the DOM loads, prior to interactive state, a minified version of the ga4PartnerPlayerEvents.js script is currently being added to the website header in lieu of this GTM tag.
<s>
  - Create a new variable:
    - `Tags > (click) New`
  - Tag Name: **GA4 - PBS Partner Player Message Processor**
  - Tag Configuration: **Custom HTML**
    - ```<script>(Insert contents of partnerPlayerGA4Events.js)</script>```
  - Triggering: **All Pages** (with respect to your Consent Mode setup)
  - Save Tag
</s>
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
- Publish the workspace
- Go back to 'Default Workspace' and click 'update' to bring the changes from your recently published workspace version.

## Google Analytics Setup
### GA4 Custom Dimensions
Once you start to receive event data in GA4, you can then setup 2 custom dimensions which can be used in Exploration reports. Custom Dimension filters data will only be available starting the day the dimensions were created.

#### Custom Dimension: Video Provider
- Go to Admin (gear icon lower left)
- Under the **Property** area go to **Custom definitions**
- Click on **Create custom dimension**
  - Dimension name: **Video Provider**
  - Scope: **Event**
  - Description: **Name of video player provider**
  - Event Parameter: **video_provider**
    - This will only appear once you get this video_provider parameter to show up in the list with data from a few event entries. This video_provider option may be quick or may take up 1 or 2 days to appear
- Click Save

#### Custom Dimension: Video Title
Create another custom dimension for Video Title
- Go to Admin (gear icon lower left)
- Under the **Property** area go to **Custom definitions**
- Click on **Create custom dimension**
  - Dimension name: **Video Title**
  - Scope: **Event**
  - Description: **Title of video during event**
  - Event Parameter: **video_title**
    - This will only appear once you get this video_provider parameter to show up in the list with data from a few event entries. This video_provider option may be quick or may take up 1 or 2 days to appear
- Click Save
