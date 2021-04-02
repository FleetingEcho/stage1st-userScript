const min: number = 60000
const seconds: number = 1000
import { _EMAIL, _INFO, _SECURE, _URL } from './utils/types'

export const URL: _URL = {
	Complete_Url: 'https://bbs.saraba1st.com/2b/forum-75-1.html',
	Base_Url: '2b/forum-75-1',
}
enum SERVER_CHROME_PATH {
	Snap = '/snap/bin/chromium',
	Usr = '/usr/bin/chromium',
}

export const INFO: _INFO = {
	Server_Chrome_Path: SERVER_CHROME_PATH.Snap,
	Local: true,
	UserName: 'XXXXXXXXX',
	Password: 'XXXXXXXXX',
	Slow_Mode: false,
	Default_Time: 0.2 * min,
	Time_Gap: 0.2 * min,
	Loading_Time: 4 * seconds,
	Logger: true,
	Record_Trigger: 100,
	Record_Blogs: false,
	Record_Credit: true,
	Check_Credit: true,
	Reload_HomePage: true,
}

export const EMAIL: _EMAIL = {
	Email_Open: true,
	Email_Trigger: 100, //Increase by 100 integral
	Email_Address: 'xxx@gmail.com',
	Email_Service: 'Gmail',
	Smtp_Pass: 'xxxxxx',
	Email_To: '1234@qq.com',
}
