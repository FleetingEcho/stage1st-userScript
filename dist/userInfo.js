"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECURE = exports.EMAIL = exports.INFO = exports.URL = void 0;
const min = 60000;
const seconds = 1000;
exports.URL = {
    Complete_Url: 'https://bbs.saraba1st.com/2b/forum-75-1.html',
    Base_Url: '/2b/forum-75-1',
};
exports.INFO = {
    UserName: 'Jake Zhang',
    Password: 'my password',
    // ---PLEASE MAKE SURE YOU HAVE CANCELED YOUR VALIDATION QUESTIONS.---
    Local: true,
    Slow_Mode: false,
    Default_Time: 2 * min,
    Time_Gap: 0.5 * min,
    Loading_Time: 5 * seconds,
    Logger: true,
    Record_Trigger: 30,
    Record_Blogs: false,
    Record_Credit: true,
    Check_Credit: true,
    Reload_HomePage: true,
};
exports.EMAIL = {
    Email_Open: false,
    Email_Trigger: 240,
    Email_Address: 'xxxxxx@gmail.com',
    Email_Service: 'Gmail',
    Smtp_Pass: 'xxxxxxxxxx',
    Email_To: 'xxxxxx@gmail.com',
};
//VALIDATION PROCESS IS IN TESTING,PLEASE MAKE SURE YOUR SECURITY QUESTIONS HAVE BEEN CANCELED.
exports.SECURE = {
    SecurityCheck: false,
    SecurityQuestionIndex: 5,
    SecurityAnswer: 'XXX',
};
