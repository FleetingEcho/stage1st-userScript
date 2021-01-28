import * as puppeteer from 'puppeteer'
import Mail from './mailer'
import { INFO, EMAIL, URL } from './userInfo'
import { Logger, LoggerBlogs, LoggerCredit, LoggerErr, log4Error, log4Info, log4Notice, log4Others } from './log4js'
let browser: puppeteer.Browser
let page: puppeteer.Page
let timer: NodeJS.Timer
let timerB: NodeJS.Timer
let browserUrl: string
let Default_Credit = 0
let Temp_Credit = 0
let idx = 0
let r = 10
let articleName: string | null
async function currentUrl() {
	browserUrl = await page.url()
	log4Info(`Currently on: ${browserUrl}`)
}

// Browser initialization
const Init = async () => {
	try {
		if (INFO.Local) {
			INFO.Slow_Mode
				? (browser = await puppeteer.launch({ headless: false, ignoreHTTPSErrors: true, slowMo: 250, defaultViewport: { width: 1200, height: 960 } }))
				: (browser = await puppeteer.launch({ headless: false, ignoreHTTPSErrors: true, defaultViewport: { width: 1200, height: 960 } }))
		} else {
			// Running on the server
			browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'], executablePath: '/usr/bin/chromium' })
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
		await page.goto(URL.Complete_Url)
		await page.waitForTimeout(INFO.Loading_Time)
		log4Notice('Entered the login page')
		LoggerCredit.info(`Successfully started browser!`)
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

// unstable=> testing

// Read article Timeout.
let ReadArticlesTimeout = async (countDown = INFO.Time_Gap, i = 0) => {
	if (timer) clearTimeout(timer)
	if (timerB) clearTimeout(timerB)
	timer = setTimeout(async () => {
		try {
			i++
			log4Notice(`Reading article ${i}`)
			await ReadArticles(INFO.Default_Time, i)
			await ReadArticlesTimeout(countDown, i)
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
		if (credit.indexOf('积分') >= 0 || userGroup.indexOf('用户组') >= 0) {
			log4Info(`Checked status, still logged in`)
			await checkHomePage()
		}
	} catch (err) {
		Logger.debug(err)
		log4Error(err)
		throw new Error('Logged Out')
	}
}
// Take a random Number from blogs List.
const randomN = (len: number) => {
	log4Others(`${len}---Total`)
	return Math.floor(Math.random() * (len - 10) + 10)
}
async function selectArticle() {
	try {
		await checkHomePage()
		const articleLength = await page.$$eval('#threadlisttableid tbody', (tbody) => tbody.length)
		// Randomly open a blog
		r = randomN(articleLength)
		articleName = await page.$eval(`#threadlisttableid tbody:nth-child(${r}) tr th .s.xst`, (item) => item.textContent)
		INFO.Record_Blogs && LoggerBlogs.info(articleName)
		log4Info(`Ready to read blog---${articleName}`)
		return true
	} catch (err) {
		Logger.debug(err)
		log4Error(`Failed to open---${articleName}`)
		throw new Error(`select Article Error`)
	}
}

async function Reading(time: number) {
	try {
		await checkHomePage()
		await page.click(`#threadlisttableid tbody:nth-child(${r}) tr th .s.xst`, { delay: 200 })
		await page.waitForTimeout(INFO.Loading_Time)
		log4Info(`Successfully opened the article`)
		log4Info(`Reading...`)
		await currentUrl() // address
		await page.waitForTimeout(time / 4) // Reading Time
		log4Info(`Reading End`)
		const url = await page.url()
		if (url.indexOf(URL.Base_Url) < 0) {
			await page.goBack()
			await page.waitForTimeout(INFO.Loading_Time)
		}
		if (INFO.Reload_HomePage) {
			await page.reload()
			await page.waitForTimeout(INFO.Loading_Time)
		}
	} catch (err) {
		Logger.debug(err)
		throw new Error('Reading Error')
	}
}

async function checkHomePage() {
	try {
		let urlTest = await page.url()
		// checking location
		if (urlTest.indexOf(URL.Base_Url) < 0) {
			await currentUrl()
			log4Others(`checkHomePage running...  go to homePage`)
			await page.goto(URL.Complete_Url)
			await page.waitForTimeout(INFO.Loading_Time)
		}
	} catch (err) {
		Logger.debug(err)
		throw new Error('Failed to check HomePage ')
	}
}
function timerBFunc(index: number) {
	timerB = setTimeout(async () => {
		if (!page || !browser) throw new Error(`Browser or page didn't response`)
		log4Error('Back up timer online')
		log4Error('timerB working...')
		try {
			await page.close()
			page = await browser.newPage()
			log4Error(`Service restarted successfully`)
			await page.goto(URL.Complete_Url)
			await page.waitForTimeout(INFO.Loading_Time)
			log4Error('Entered the login page')
			try {
				await Status()
			} catch (err) {
				await Login()
			}
			await checkHomePage() //make sure currently on Homepage. Restart reading
			await ReadArticlesTimeout(INFO.Time_Gap, index)
		} catch (err) {
			if (!timerB) {
				await _Error(err)
			}
		}
	}, INFO.Default_Time * 2)
	return timerB
}

// Read Blogs
async function ReadArticles(time: number, index: number) {
	try {
		await checkHomePage()
		log4Info(`-------------------Start-------------------`)
		await Status()
		timerBFunc(index) // vital BackUp!
		// Randomly open a blog
		await selectArticle()
		await Reading(time)
		log4Notice('Checking Credits now')

		if (INFO.Check_Credit) {
			await checkCreditPage()
		}
		await checkHomePage()
		if (timerB) {
			clearTimeout(timerB)
			log4Others('Back up timerB successfully deleted')
		}
		log4Info(`-------------------END-------------------`)
	} catch (err) {
		Logger.debug(err)
		log4Error('Failed to read target article')
		await _Error(err)
	}
}

async function refreshCredit() {
	try {
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
			LoggerCredit.info(`New credit is ${newCredit}`)
			idx = 0
		}
		if (change_Record >= 10) {
			Temp_Credit = newCredit
			log4Notice(`New credit is ${newCredit}`)
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
		const res = await refreshCredit()
		if (!res) {
			throw new Error('res in checkCreditPage is undefined')
		}
		const { credit, userGroup, username, change } = res
		if (credit && userGroup && username) {
			log4Others(`UserName is ${username}, change is ${change}`)
			if (credit.indexOf('积分') >= 0 && change >= EMAIL.Email_Trigger) {
				//Send Email
				if (EMAIL.Email_Open) {
					Mail(credit, userGroup, username)
					log4Others(`Successfully sent e-mail`)
				}
				Default_Credit = Number(credit.substring(4))
				log4Notice(`Credit has increased to ${Default_Credit}`)
			}
		}

		// Return to the HomePage
		const url = await page.url()
		if (url.indexOf(URL.Base_Url) < 0) {
			await page.goBack()
			await page.waitForTimeout(INFO.Loading_Time)
		}
	} catch (err) {
		Logger.debug(err)
		log4Error('Failed to check credit')
		await _Error(err)
	}
}

async function _Error(err: unknown) {
	try {
		if (!browser || !page) throw new Error('Critical Error Occurs')
		LoggerErr.error(err)
		await Status() //Check user status
		log4Error(err)
		log4Info(`Good news, you are still logged in!`)
		await page.goto(URL.Complete_Url)
		await page.waitForTimeout(INFO.Loading_Time)
		await ReadArticlesTimeout() // reset timeout
	} catch (err) {
		if (browser || page) {
			log4Error(err)
			await page.close()
			await browser.close()
			log4Info(`Browser has been closed`)
		}
		if (timer) clearTimeout(timer)
		if (timerB) {
			clearTimeout(timerB)
			log4Others('Back up timerB successfully deleted in Error Func')
		}
		await sleep(INFO.Default_Time / 4)
		await Main()
	}
}
async function sleep(delay: number) {
	return new Promise((resolve) => setTimeout(resolve, delay))
}

async function Main() {
	try {
		await Init()
		await Login()
		await ReadArticlesTimeout()
	} catch (err) {
		await _Error(err)
	}
}

Main()
