const min: number = 60000
const seconds: number = 1000
import { _EMAIL, _INFO, _SECURE, _URL } from './utils/types'

enum SERVER_CHROME_PATH {
	Snap = '/snap/bin/chromium',
	Usr = '/usr/bin/chromium',
}
export const URL: _URL = {
	Complete_Url: 'https://bbs.saraba1st.com/2b/forum-75-1.html',
	Base_Url: '/2b/forum-75-1',
}

export const INFO: _INFO = {
	Server_Chrome_Path: SERVER_CHROME_PATH.Snap,
	UserName: 'Jake Zhang', // username
	Password: 'my password', //password
	// ---PLEASE MAKE SURE YOU HAVE CANCELED YOUR VALIDATION QUESTIONS.---
	Local: true, // If running on server, set false
	Slow_Mode: false, //browser slow mode
	Default_Time: 2 * min, //Whole process gap,preferably longer than 2 minutes
	Time_Gap: 0.5 * min, //reading time gap
	Loading_Time: 5 * seconds, //wait for page loading
	Logger: true, //whether to display the console in terminal or not
	Record_Trigger: 30, // Record every 10 articles
	Record_Blogs: false, //Record blogs or not
	Record_Credit: true, //Record credit or not
	Check_Credit: true, // Perfectly be true.
	Reload_HomePage: true, // reload homepage
}

export const EMAIL: _EMAIL = {
	Email_Open: false, //whether to send email
	Email_Trigger: 240, //Send email every 240 point increased.
	Email_Address: 'xxxxxx@gmail.com', // Sender's email
	Email_Service: 'Gmail', // Email Service,Gmail for example
	Smtp_Pass: 'xxxxxxxxxx', //Sender's SMTP pass
	Email_To: 'xxxxxx@gmail.com', // Receiver's email address
}
//VALIDATION PROCESS IS IN TESTING,PLEASE MAKE SURE YOUR SECURITY QUESTIONS HAVE BEEN CANCELED.
export const SECURE: _SECURE = {
	SecurityCheck: false, // TESTING => Not stable
	SecurityQuestionIndex: 5,
	SecurityAnswer: 'XXX',
}
