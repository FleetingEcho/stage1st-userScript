const min: number = 60000
const seconds: number = 1000
interface _INFO {
	UserName: string
	Password: string
	Local: boolean
	Slow_Mode: boolean
	Default_Time: number
	Time_Gap: number
	Loading_Time: number
	Logger: boolean
	Record_Trigger: number

	Record_Blogs: boolean
	Record_Credit: boolean
	Check_Credit: boolean
	Reload_HomePage: boolean
}
interface _EMAIL {
	Email_Open: boolean
	Email_Trigger: number
	Email_Address: string
	Email_Service: string
	Smtp_Pass: string
	Email_To: string
}
interface _SECURE {
	SecurityCheck: boolean
	SecurityQuestionIndex: number
	SecurityAnswer: string
}
interface _URL {
	Complete_Url: string
	Base_Url: string
}

export const URL: _URL = {
	Complete_Url: 'https://bbs.saraba1st.com/2b/forum-75-1.html',
	Base_Url: '2b/forum-75-1',
}

export const INFO: _INFO = {
	UserName: 'XXXXXXXXXXX',
	Password: 'XXXXXXXXXXXXXXXX',
	Local: true,
	Slow_Mode: false,
	Default_Time: 1 * min,
	Time_Gap: 0.2 * min,
	Loading_Time: 4 * seconds,
	Logger: true,
	Record_Trigger: 10,
	Record_Blogs: false,
	Record_Credit: true,
	Check_Credit: true,
	Reload_HomePage: true,
}

export const EMAIL: _EMAIL = {
	Email_Open: false,
	Email_Trigger: 100, //Increase by 100 integral
	Email_Address: 'XXXXXXXXXXXX@gmail.com',
	Email_Service: 'Gmail',
	Smtp_Pass: 'XXXXXXXXXXXXXXXX',
	Email_To: 'XXXXXXXXXXXXX', // or [ 1,2, 3]
}

export const SECURE: _SECURE = {
	SecurityCheck: false, // TESTING => Not stable
	SecurityQuestionIndex: 5,
	SecurityAnswer: 'XXX',
}
