# Automated script for Stage 1st 



> This is an automated script written in TypeScript for helping user to accumulate points automatically (on [Stage 1st](https://www.saraba1st.com/2b/forum-75-1.html)).
>
> Support custom configurations, such as logging blogs and user points, **automatic email alerts**, and  record potential errors(for user debugging).



## Classification

1. **Functional_Version**
   1. Support for custom extensions for other functions, such as recording article content and  specifying crawling a separate article.
2. **Stable_Version** 
   1. Without performing article reading (may cause navigation problems), cut out some unnecessary features and focus on daily credit.
   2. Just for the purpose of constantly checking user points and then counting it in the logs.

## Features

+ Keeping user account online 24/7 to increase "online-time" points.

+ Customizing saved access articles and real-time points.
+ Customizing virtual reading time.
+ Automatically send **Emails** when scores increased by Target_Trigger(See configuration below for details).
+ **Stable error handling** to ensure program keep running.



## Tools

+ Language: **TypeScript**

+ **Nodemailer**
+ log4js
+ chalk
+ Puppeteer
+ Chromium
+ pm2



## Deployment

> Notice: Setting your configuration first.

+ Running locally

  + Compile TypeScript files

  + ```js
    node ./dist/auto.js
    
    or
    
    ts-node ./src/auto.ts
    ```

+ Running on the server
  + Install  **Chromium**  ,Node.js. 
    + **Notice**: Default executablePath is  '/usr/bin/chromium'.   
  + Use **pm2** to manage node process.



## Configuration  

> user configuration file is **'./src/userInfo.ts'**

> Please make sure that you have canceled your validation question.



```typescript
const min: number = 60000
const seconds: number = 1000

export const URL: _URL = {
	Complete_Url: 'https://bbs.saraba1st.com/2b/forum-75-1.html', //HomePage address
	Base_Url: '2b/forum-75-1', //used for address validation.
}
enum SERVER_CHROME_PATH {
	Snap = '/snap/bin/chromium',
	Usr = '/usr/bin/chromium',
}
export const INFO: _INFO = {
    Server_Chrome_Path: SERVER_CHROME_PATH.Snap,  // chromium path
	UserName: 'Jake Zhang',                     // Username
	Password: 'my password',                    // Password
    // ---PLEASE MAKE SURE YOU HAVE CANCELED YOUR VALIDATION QUESTIONS.---
	Local: true,                                // If running on server, set false
	Slow_Mode: false,                           // Browser slow mode
	Default_Time: 2 * min,                      // Whole process gap.Preferably longer than 2 minutes
	Time_Gap: 0.5 * min,                        // Reading time gap
	Loading_Time: 5 * seconds,                  // Wait for page loading
	Logger: true,                               // Whether to display the console in terminal or not
	Record_Trigger: 30,                         // Record every 30 articles
	Record_Blogs: false,                        // Record blogs or not
	Record_Credit: true,                        // Record credit or not
	Check_Credit: true,                         // Update credit after reading process. 
	Reload_HomePage: true,			    // Reload homepage
}

export const EMAIL: _EMAIL = {
	Email_Open: false,                          // Whether to send email
	Email_Trigger: 240,                         // Send email every 240 point increased.
	Email_Address: 'xxxxxx@gmail.com',          // Sender's email 
	Email_Service: 'Gmail',                     // Email Service,Gmail for example
	Smtp_Pass: 'xxxxxxxxxx',                    // Sender's SMTP pass
	Email_To: 'xxxxxx@gmail.com',	            // Receiver's email address,string or an array.
}

```

