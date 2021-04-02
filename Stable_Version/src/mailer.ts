import * as path from 'path'
import * as nodemailer from 'nodemailer'
import { EMAIL } from './userInfo'
import { LoggerMail } from './log4js'
import { getExactTime } from './utils/index'

type _Mail = (credit: string, userGroup: string, username: string) => void

export const Mail: _Mail = async (credit, userGroup, username) => {
	let transporter = nodemailer.createTransport({
		port: 465,
		service: EMAIL.Email_Service, //Service List  https://nodemailer.com/smtp/well-known/
		secure: true,
		auth: {
			user: EMAIL.Email_Address,
			pass: EMAIL.Smtp_Pass,
		},
	})

	let info = await transporter.sendMail({
		from: `"S1 integral reminder" <${EMAIL.Email_Address}>`,
		to: EMAIL.Email_To,
		subject: `${new Date().toLocaleDateString()}--${username} stays online today: ${new Date().toLocaleDateString()}`, // Subject line
		text: `Good News,your integral has increased.${credit}-------${userGroup}`,
		attachments: [
			{
				filename: 'Grand Blue.png',
				path: path.resolve(__dirname, 'Grand Blue.jpg'),
			},
		],
	})

	LoggerMail.info(`Successfully sent update e-mail on ${getExactTime()}`)
	LoggerMail.info(`'Update Email has been sent:: %s',${info.messageId}`)
	return `Sent on ${getExactTime()}`
}

export default Mail
