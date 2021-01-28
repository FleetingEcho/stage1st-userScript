import * as path from 'path'
import * as nodemailer from 'nodemailer'
import { EMAIL } from './userInfo'
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
		subject: `${username} stays online today: ${new Date().toLocaleDateString()}`, // Subject line
		text: `Good News,your integral has increased.${credit}-------${userGroup}`,
		attachments: [
			{
				filename: 'Grand Blue.png',
				path: path.resolve(__dirname, 'Grand Blue.jpg'),
			},
		],
	})
	console.log('Message sent: %s', info.messageId)
}

export default Mail
