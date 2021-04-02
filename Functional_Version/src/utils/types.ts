export interface _INFO {
	Server_Chrome_Path: string
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
export interface _EMAIL {
	Email_Open: boolean
	Email_Trigger: number
	Email_Address: string
	Email_Service: string
	Smtp_Pass: string
	Email_To: string
}
export interface _SECURE {
	SecurityCheck: boolean
	SecurityQuestionIndex: number
	SecurityAnswer: string
}
export interface _URL {
	Complete_Url: string
	Base_Url: string
}
