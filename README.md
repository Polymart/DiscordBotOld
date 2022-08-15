# This is the old Polymart Discord Bot

For information about the current version of Polymart's Discord bot, visit **https://polymart.org/blog/6/adding-the-polymart-bot-to-your-discord-server**

***

[Polymart](https://polymart.org)'s official Discord Bot! Add it to your server [here](https://discord.com/api/oauth2/authorize?client_id=724460914560073838&permissions=268527680&scope=bot%20applications.commands).

### Setup Guide

1. Add the Polymart Discord bot by going [here](https://discord.com/api/oauth2/authorize?client_id=724460914560073838&permissions=268527680&scope=bot%20applications.commands), and choosing your server. Make sure to authorize the bot to have access to all the included features!
2. If your resources are on your personal account, visit your account settings at https://polymart.org/account, and generate a new API key — name it something like "Polymart Discord Bot", and copy the key to your clipboard. If they're on a team account, visit the team profile page, click "Team API Keys", and generate a new API key. Only the team creator can see API keys.
3. Type `/config apikey value:<YOUR_API_KEY>` where YOUR_API_KEY is the API key you got from your Polymart profile. For example, `/config apikey value:eyJoZW...xsbyJ9`
4. (optional) Let's set up your resource roles! First, find your resource's ID. Your resource's ID is the number at the very end of its URL on Polymart. For example, the ID of https://polymart.org/resource/item-bridge.4 is `4`. Now, add a role to this resource by typing `/resource config resourceid:<RESOURCE_ID> role:<VERIFIED_ROLE>`, where `RESOURCE_ID` is your resource's ID, and `VERIFIED_ROLE` is the role that you want to give users who have this resource when they verify. If you have multiple resources and don't want to give users a special role for every resource they own, you can skip this step. For example, if we wanted to give all CustomItems users the `CustomItems` role, we would do `/resource config resourceid:1 role:@CustomItems`
5. (optional) All verified users can be given a generic "Verified" role which you can set up by using `/config role value:<Role>` to set the role, like `/config role value:@PolymartVerified`. This will be given to users who own at least 1 of your resources.

If you want to clear any of the configuration options, just run the command with a blank value. e.g. `/config role value:` will remove the generic verification role


That's it! When buyers join your Discord server, they can use `/verify` to verify themselves automatically (they get sent to Polymart where they're given a token, and then they send that token back to the bot to verify their identity). Don't worry! There's security measures in place to make sure that only one Discord account can be linked to a given Polymart account.
