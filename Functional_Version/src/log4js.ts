import * as chalk from 'chalk'
import * as log4js from 'log4js'
import { INFO } from './userInfo'
const log = console.log
type _Logs = {
	(temp: string): void
}

log4js.configure({
	appenders: {
		Notice: { type: 'file', filename: 'logs/notice.log', compress: true },
		Credit: { type: 'file', filename: 'logs/credit.log', compress: true },
		Blogs: { type: 'file', filename: 'logs/blogs.log', compress: true },
		Error: { type: 'file', filename: 'logs/error.log', compress: true },
	},
	categories: {
		default: { appenders: ['Notice'], level: 'debug' },
		Blogs: { appenders: ['Blogs'], level: 'info' },
		Error: { appenders: ['Error'], level: 'error' },
		Credit: { appenders: ['Credit'], level: 'info' },
	},
})
export const Logger = log4js.getLogger('Notice')
export const LoggerErr = log4js.getLogger('Error')
export const LoggerCredit = log4js.getLogger('Credit')
export const LoggerBlogs = log4js.getLogger('Blogs')

export const log4Info: _Logs = (info) => {
	INFO.Logger && log(chalk.green(info))
}

export const log4Error = (err: unknown) => {
	log(chalk.red(err))
}

export const log4Notice: _Logs = (note) => {
	INFO.Logger && log(chalk.yellow(note))
}

export const log4Others: _Logs = (other) => {
	INFO.Logger && log(chalk.blue(other))
}
