import * as puppeteer from 'puppeteer'
import Mail from './mailer'
import { INFO, EMAIL, URL } from './userInfo'
import { Logger, LoggerCount, LoggerErr, log4Error, log4Info, log4Notice, log4Others } from './log4js'
let browser: puppeteer.Browser
let page: puppeteer.Page
let timer: NodeJS.Timer
let timerB: NodeJS.Timer
let Default_Credit = 0
let Temp_Credit = 0
let idx = 0

// Browser initialization
const Init = async () => {
	try {
		if (INFO.Local) {
			INFO.Slow_Mode
				? (browser = await puppeteer.launch({ headless: false, ignoreHTTPSErrors: true, slowMo: 250, defaultViewport: { width: 1200, height: 960 } }))
				: (browser = await puppeteer.launch({ headless: false, ignoreHTTPSErrors: true, defaultViewport: { width: 1200, height: 960 } }))
		} else {
			// Running on the server
			browser = await puppeteer.launch({
				headless: true,
				args: ['--no-sandbox'],
				executablePath: INFO.Server_Chrome_Path,
			})
		}
		page = await browser.newPage()
		if (INFO.Local) {
			let width = 1200
			let height = 960
			await page.setViewport({
				width: width,
				height: height,
			})
		}
		log4Info(`Service started successfully`)
		await page.goto(URL.Complete_Url, { waitUntil: 'domcontentloaded', timeout: 0 })
		await page.waitForTimeout(INFO.Loading_Time)
		log4Notice('Entered the Home page')
		LoggerCount.info(`Successfully started browser!`)
	} catch (err) {
		Logger.debug(err)
		log4Error('Failed to Init browser')
		throw new Error(`Failed to Init browser`)
	}
}

// Login
async function Login() {
	try {
		await checkHomePage()
		await page.type('#ls_username', INFO.UserName, { delay: 200 })
		await page.type('#ls_password', INFO.Password, { delay: 200 })
		await page.click('.pn.vm', { delay: 200 })
		await page.waitForTimeout(INFO.Loading_Time)
		log4Info(`Logged in, ready to read articles...`)
	} catch (err) {
		Logger.debug(err)
		log4Error('Failed to log in')
		throw new Error(`Failed to log in`)
	}
}

// Read article Timeout.
let AnalyzerTimeout = async (countDown = 0, i = 0) => {
	if (timer) clearTimeout(timer)
	if (timerB) clearTimeout(timerB)
	timer = setTimeout(async () => {
		try {
			i++
			log4Notice(`Reading article ${i}`)
			await Analyzer(INFO.Default_Time, i)
			await AnalyzerTimeout(countDown, i)
		} catch (err) {
			log4Info(`Timeout error`)
			Logger.debug(err)
		}
	}, countDown)
}

// Check user status
async function Status() {
	try {
		// status error : 1. logged in. 2. logged out
		const userGroup = await page.$eval(`#g_upmine`, (el) => el.textContent)
		const credit = await page.$eval(`#extcreditmenu`, (el) => el.textContent)
		if (!credit || !userGroup) {
			throw new Error('Logged out')
		}
		if (credit.includes('积分') || userGroup.includes('用户组')) {
			log4Info(`Checked status, still logged in`)
			await checkHomePage()
		}
	} catch (err) {
		Logger.debug(err)
		log4Error(err)
		throw new Error('Logged Out')
	}
}

async function checkHomePage() {
	try {
		let urlTest = await page.url()
		if (!urlTest.includes(URL.Base_Url)) {
			log4Others(`checkHomePage running...  go to homePage`)
			await page.goto(URL.Complete_Url, { waitUntil: 'load', timeout: 0 })
			await page.waitForTimeout(INFO.Loading_Time)
		}
	} catch (err) {
		Logger.debug(err)
		throw new Error('Failed to check HomePage ')
	}
}
function timerBFunc(index: number) {
	if (timer) clearTimeout(timer)
	timerB = setTimeout(async () => {
		if (!page || !browser) throw new Error(`Browser or page didn't response`)
		log4Error('Back up timer online')
		log4Error('timerB working...')
		try {
			if (page) {
				await page.close()
				page = await browser.newPage()
				log4Info(`Service restarted successfully`)
				await page.goto(URL.Complete_Url, { waitUntil: 'domcontentloaded', timeout: 0 })
				await page.waitForTimeout(INFO.Loading_Time)
				log4Info('Entered the login page')
				try {
					await Status()
				} catch (err) {
					Login()
				}
			}
			await AnalyzerTimeout(INFO.Time_Gap, index)
		} catch (err) {
			if (!timerB) {
				await Reboot(err)
			}
		}
	}, INFO.Default_Time * 2)
	return timerB
}

// Read Blogs
async function Analyzer(time: number, index: number) {
	try {
		log4Info(`-------------------Start-------------------`)
		await checkHomePage()
		await page.reload()
		await page.waitForTimeout(INFO.Loading_Time)
		await Status()
		timerBFunc(index) // vital BackUp!
		log4Notice('Checking Credits now')
		if (page && page.url().includes('bbs.saraba1st.com/')) {
			await checkCreditPage()
		} else {
			if (timerB) {
				clearTimeout(timerB)
				log4Others('Back up timerB successfully deleted')
			}
			throw new Error('page has been closed, failed to run checkCreditPage')
		}
		if (timerB) {
			clearTimeout(timerB)
			log4Others('Back up timerB successfully deleted')
		}
		await checkHomePage()
		log4Info(`-------------------END-------------------`)
	} catch (err) {
		Logger.debug(err)
		log4Error('Failed to read target article')
		await Reboot(err)
	}
}

async function refreshCredit() {
	try {
		if (!page) throw 'page has closed'
		await page.click(`#extcreditmenu`, { delay: 100 })
		await page.waitForTimeout(INFO.Loading_Time)
		const credit = await page.$eval(`#extcreditmenu`, (el) => el.textContent)
		const userGroup = await page.$eval(`#g_upmine`, (el) => el.textContent)
		const username = await page.$eval(`.vwmy a`, (el) => el.textContent)
		if (credit == null) throw new Error('credit is null')
		const newCredit = Number(credit.substring(4))
		const change = newCredit - Default_Credit
		const change_Record = newCredit - Temp_Credit
		idx++
		if (idx >= INFO.Record_Trigger && INFO.Record_Credit) {
			LoggerCount.info(`New credit is ${newCredit}`)
			idx = 0
		}
		if (change_Record >= INFO.Record_Trigger) {
			Temp_Credit = newCredit
		} else {
			log4Others(`Credit didn't change,still keeping ${newCredit}`)
		}
		// Return to the blog page.
		await page.waitForTimeout(INFO.Loading_Time)

		const res = {
			credit,
			userGroup,
			username,
			change,
		}
		return res
	} catch (err) {
		Logger.debug(err)
		log4Error(`Failed to refresh my credit`)
		throw new Error(`Failed to refresh credit`)
	}
}

// check user credit
async function checkCreditPage() {
	try {
		if (!page) throw 'page not exist'
		const res = await refreshCredit()
		if (!res) {
			throw new Error('res in checkCreditPage is undefined')
		}
		const { credit, userGroup, username, change } = res
		if (credit && userGroup && username) {
			log4Others(`UserName is ${username}, change is ${change}`)
			if (credit.includes('积分') && change >= EMAIL.Email_Trigger) {
				//Send Email
				if (EMAIL.Email_Open) {
					Mail(credit, userGroup, username)
					log4Others(`Successfully sent e-mail`)
				}
				Default_Credit = Number(credit.substring(4))
				LoggerCount.info(`Credit has increased to ${Default_Credit}`)
			}
		}

		// Return to the HomePage
		const url = page.url()
		if (!url.includes(URL.Base_Url)) {
			await page.goto(URL.Complete_Url, { waitUntil: 'load', timeout: 0 })
			await page.waitForTimeout(INFO.Loading_Time)
		}
	} catch (err) {
		Logger.debug(err)
		log4Error('Failed to check credit')
		await Reboot(err)
	}
}

async function Reboot(err: unknown) {
	try {
		if (timer) clearTimeout(timer)
		if (timerB) clearTimeout(timerB)
		if (!browser) throw new Error('Critical Error Occurs')
		if (!page) throw new Error('Reboot Log: page has been closed')
		LoggerErr.error(err)
		log4Error(err)
		log4Info(`Good news, you are still logged in!`)
		page && (await Status())
		await AnalyzerTimeout(INFO.Time_Gap, 0)
	} catch (err) {
		if (browser) {
			log4Error(err)
			page && (await page.close())
			await browser.close()
			log4Info(`Browser has been closed`)
		}
		await sleep(INFO.Default_Time / 4)
		Main()
	}
}
async function sleep(delay: number) {
	return new Promise((resolve) => setTimeout(resolve, delay))
}

async function Main() {
	try {
		await Init()
		await Login()
		await AnalyzerTimeout()
	} catch (err) {
		await Reboot(err)
	}
}

Main()
