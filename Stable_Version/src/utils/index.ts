import { log4Others } from '../log4js'
import * as puppeteerType from 'puppeteer'
import { INFO } from '../userInfo'
export function getLocalTime(timeZone = -5) {
	// timeZone ,  Beijing for 8,  New York for -5
	const MonthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	const d = new Date()
	const len = d.getTime()
	const offset = d.getTimezoneOffset() * 60000
	const utcTime = len + offset
	const d2 = new Date(utcTime + 3600000 * timeZone)
	const month = MonthList[d2.getMonth()]
	const date = d2.getDate()
	return `${month} ${date}` //example: February 13
}

export function getExactTime(timeZone = -5) {
	// timeZone ,  Beijing for 8,  New York for -5
	const MonthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	const d = new Date()
	const len = d.getTime()
	const offset = d.getTimezoneOffset() * 60000
	const utcTime = len + offset
	const d2 = new Date(utcTime + 3600000 * timeZone)
	const month = MonthList[d2.getMonth()]
	const date = d2.getDate()
	const hours = d2.getHours()
	const minutes = d2.getMinutes()
	const seconds = d2.getSeconds()
	return `${month}-${date}: ${hours}:${minutes}:${seconds}`
}

export async function autoScroll(page: puppeteerType.Page) {
	return page.evaluate(`(async () => {
		await new Promise((resolve, reject) => {
			let totalHeight = 0
			let distance = 100
			let timer = setInterval(() => {
				let scrollHeight = document.body.scrollHeight
				window.scrollBy(0, distance)
				totalHeight += distance
				if (totalHeight >= scrollHeight) {
					clearInterval(timer)
					resolve(true)
				}
			}, 120)
		})
	})()`)
}

export const replaceSpace = (str: string) => {
	const tempVal = str.toLocaleLowerCase()
	return tempVal.replace(/\s+/gi, '')
}

export const compareDate = (target: string) => {
	//target  September 4  or  August 19, 2020
	return new Promise((resolve, reject) => {
		let today = getLocalTime()
		today = replaceSpace(today)
		target = replaceSpace(target)
		log4Others(`The date in Map is:${target}, today is:${today} => Thus the result returned is: ${target.includes(today)}`)
		resolve(target.includes(today))
	})
}
