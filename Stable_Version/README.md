# Automated script for Stage 1st 



> This is an automated script written in TypeScript, which can helps user to earn points (on [Stage 1st](https://www.saraba1st.com/2b/forum-75-1.html)).
>
> It supports a lot of custom configurations, such as logging blogs and user points, **automatic email alerts**, and  record potential errors(for user debugging).



## Features

+ Keeping your account online 24/7 to increase "online-time" points.

+ Customizing saved access articles and real-time points.
+ Customizing virtual reading time.
+ Automatically send **Emails** when scores increased(See configuration below for details).
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

> Setting your configuration first.

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
  + Use **pm2** to manage node processes



## Configuration  

> userInfo file is in **'./src/userInfo.ts'**



```typescript
const min: number = 60000
const seconds: number = 1000

export const URL: _URL = {
	Complete_Url: 'https://bbs.saraba1st.com/2b/forum-75-1.html', //HomePage address
	Base_Url: '2b/forum-75-1', //used for address validation.
}

export const INFO: _INFO = {
	UserName: 'Jake Zhang',                     // username
	Password: 'my password',                    //password
    // ---PLEASE MAKE SURE YOU HAVE CANCELED YOUR VALIDATION QUESTIONS.---
	Local: true,                                // If running on server, set false
	Slow_Mode: false,                           //browser slow mode
	Default_Time: 2 * min,                      //Whole process gap,preferably longer than 2 minutes
	Time_Gap: 0.5 * min,                        //reading time gap
	Loading_Time: 5 * seconds,                  //wait for page loading
	Logger: true,                               //whether to display the console in terminal or not
	Record_Trigger: 30,                         // Record every 10 articles
	Record_Blogs: false,                        //Record blogs or not
	Record_Credit: true,                        //Record credit or not
	Check_Credit: true,                         // Perfectly be true. 
	Reload_HomePage: true,						// reload homepage
}

export const EMAIL: _EMAIL = {
	Email_Open: false,                          //whether to send email
	Email_Trigger: 240,                         //Send email every 240 point increased.
	Email_Address: 'xxxxxx@gmail.com',          // Sender's email 
	Email_Service: 'Gmail',                     // Email Service,Gmail for example
	Smtp_Pass: 'xxxxxxxxxx',                    //Sender's SMTP pass
	Email_To: 'xxxxxx@gmail.com',	            // Receiver's email address
}
//VALIDATION PROCESS IS IN TESTING,PLEASE MAKE SURE YOUR SECURITY QUESTIONS HAVE BEEN CANCELED.
export const SECURE: _SECURE = {
	SecurityCheck: false,                       // TESTING => Not stable
	SecurityQuestionIndex: 5,
	SecurityAnswer: 'XXX',
}


```

