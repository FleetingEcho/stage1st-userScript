"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mail = void 0;
const path = require("path");
const nodemailer = require("nodemailer");
const userInfo_1 = require("./userInfo");
exports.Mail = (credit, userGroup, username) => __awaiter(void 0, void 0, void 0, function* () {
    let transporter = nodemailer.createTransport({
        port: 465,
        service: userInfo_1.EMAIL.Email_Service,
        secure: true,
        auth: {
            user: userInfo_1.EMAIL.Email_Address,
            pass: userInfo_1.EMAIL.Smtp_Pass,
        },
    });
    let info = yield transporter.sendMail({
        from: `"S1 integral reminder" <${userInfo_1.EMAIL.Email_Address}>`,
        to: userInfo_1.EMAIL.Email_To,
        subject: `${username} stays online today: ${new Date().toLocaleDateString()}`,
        text: `Good News,your integral has increased.${credit}-------${userGroup}`,
        attachments: [
            {
                filename: 'Grand Blue.png',
                path: path.resolve(__dirname, 'Grand Blue.jpg'),
            },
        ],
    });
    console.log('Message sent: %s', info.messageId);
});
exports.default = exports.Mail;
