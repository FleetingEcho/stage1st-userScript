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
const puppeteer = require("puppeteer");
const mailer_1 = require("./mailer");
const userInfo_1 = require("./userInfo");
const log4js_1 = require("./log4js");
let browser;
let page;
let timer;
let timerB;
let browserUrl;
let Default_Credit = 0;
let Temp_Credit = 0;
let idx = 0;
let r = 10;
let articleName;
function currentUrl() {
    return __awaiter(this, void 0, void 0, function* () {
        browserUrl = yield page.url();
        log4js_1.log4Info(`Currently on: ${browserUrl}`);
    });
}
// Browser initialization
const Init = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (userInfo_1.INFO.Local) {
            userInfo_1.INFO.Slow_Mode
                ? (browser = yield puppeteer.launch({ headless: false, ignoreHTTPSErrors: true, slowMo: 250, defaultViewport: { width: 1200, height: 960 } }))
                : (browser = yield puppeteer.launch({ headless: false, ignoreHTTPSErrors: true, defaultViewport: { width: 1200, height: 960 } }));
        }
        else {
            // Running on the server
            browser = yield puppeteer.launch({ headless: true, args: ['--no-sandbox'], executablePath: '/usr/bin/chromium' });
        }
        page = yield browser.newPage();
        if (userInfo_1.INFO.Local) {
            let width = 1200;
            let height = 960;
            yield page.setViewport({
                width: width,
                height: height,
            });
        }
        log4js_1.log4Info(`Service started successfully`);
        yield page.goto(userInfo_1.URL.Complete_Url);
        yield page.waitForTimeout(userInfo_1.INFO.Loading_Time);
        log4js_1.log4Notice('Entered the login page');
        log4js_1.LoggerCredit.info(`Successfully started browser!`);
    }
    catch (err) {
        log4js_1.Logger.debug(err);
        log4js_1.log4Error('Failed to Init browser');
        throw new Error(`Failed to Init browser`);
    }
});
// Login
function Login() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield checkHomePage();
            yield page.type('#ls_username', userInfo_1.INFO.UserName, { delay: 200 });
            yield page.type('#ls_password', userInfo_1.INFO.Password, { delay: 200 });
            yield page.click('.pn.vm', { delay: 200 });
            yield page.waitForTimeout(userInfo_1.INFO.Loading_Time);
            log4js_1.log4Info(`Logged in, ready to read articles...`);
        }
        catch (err) {
            log4js_1.Logger.debug(err);
            log4js_1.log4Error('Failed to log in');
            throw new Error(`Failed to log in`);
        }
    });
}
// unstable=> testing
// Read article Timeout.
let ReadArticlesTimeout = (countDown = userInfo_1.INFO.Time_Gap, i = 0) => __awaiter(void 0, void 0, void 0, function* () {
    if (timer)
        clearTimeout(timer);
    if (timerB)
        clearTimeout(timerB);
    timer = setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            i++;
            log4js_1.log4Notice(`Reading article ${i}`);
            yield ReadArticles(userInfo_1.INFO.Default_Time, i);
            yield ReadArticlesTimeout(countDown, i);
        }
        catch (err) {
            log4js_1.log4Info(`Timeout error`);
            log4js_1.Logger.debug(err);
        }
    }), countDown);
});
// Check user status
function Status() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // status error : 1. logged in. 2. logged out
            const userGroup = yield page.$eval(`#g_upmine`, (el) => el.textContent);
            const credit = yield page.$eval(`#extcreditmenu`, (el) => el.textContent);
            if (!credit || !userGroup) {
                throw new Error('Logged out');
            }
            if (credit.indexOf('积分') >= 0 || userGroup.indexOf('用户组') >= 0) {
                log4js_1.log4Info(`Checked status, still logged in`);
                yield checkHomePage();
            }
        }
        catch (err) {
            log4js_1.Logger.debug(err);
            log4js_1.log4Error(err);
            throw new Error('Logged Out');
        }
    });
}
// Take a random Number from blogs List.
const randomN = (len) => {
    log4js_1.log4Others(`${len}---Total`);
    return Math.floor(Math.random() * (len - 10) + 10);
};
function selectArticle() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield checkHomePage();
            const articleLength = yield page.$$eval('#threadlisttableid tbody', (tbody) => tbody.length);
            // Randomly open a blog
            r = randomN(articleLength);
            articleName = yield page.$eval(`#threadlisttableid tbody:nth-child(${r}) tr th .s.xst`, (item) => item.textContent);
            userInfo_1.INFO.Record_Blogs && log4js_1.LoggerBlogs.info(articleName);
            log4js_1.log4Info(`Ready to read blog---${articleName}`);
            return true;
        }
        catch (err) {
            log4js_1.Logger.debug(err);
            log4js_1.log4Error(`Failed to open---${articleName}`);
            throw new Error(`select Article Error`);
        }
    });
}
function Reading(time) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield checkHomePage();
            yield page.click(`#threadlisttableid tbody:nth-child(${r}) tr th .s.xst`, { delay: 200 });
            yield page.waitForTimeout(userInfo_1.INFO.Loading_Time);
            log4js_1.log4Info(`Successfully opened the article`);
            log4js_1.log4Info(`Reading...`);
            yield currentUrl(); // address
            yield page.waitForTimeout(time / 4); // Reading Time
            log4js_1.log4Info(`Reading End`);
            const url = yield page.url();
            if (url.indexOf(userInfo_1.URL.Base_Url) < 0) {
                yield page.goBack();
                yield page.waitForTimeout(userInfo_1.INFO.Loading_Time);
            }
            if (userInfo_1.INFO.Reload_HomePage) {
                yield page.reload();
                yield page.waitForTimeout(userInfo_1.INFO.Loading_Time);
            }
        }
        catch (err) {
            log4js_1.Logger.debug(err);
            throw new Error('Reading Error');
        }
    });
}
function checkHomePage() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let urlTest = yield page.url();
            // checking location
            if (urlTest.indexOf(userInfo_1.URL.Base_Url) < 0) {
                yield currentUrl();
                log4js_1.log4Others(`checkHomePage running...  go to homePage`);
                yield page.goto(userInfo_1.URL.Complete_Url);
                yield page.waitForTimeout(userInfo_1.INFO.Loading_Time);
            }
        }
        catch (err) {
            log4js_1.Logger.debug(err);
            throw new Error('Failed to check HomePage ');
        }
    });
}
function timerBFunc(index) {
    timerB = setTimeout(() => __awaiter(this, void 0, void 0, function* () {
        if (!page || !browser)
            throw new Error(`Browser or page didn't response`);
        log4js_1.log4Error('Back up timer online');
        log4js_1.log4Error('timerB working...');
        try {
            yield page.close();
            page = yield browser.newPage();
            log4js_1.log4Error(`Service restarted successfully`);
            yield page.goto(userInfo_1.URL.Complete_Url);
            yield page.waitForTimeout(userInfo_1.INFO.Loading_Time);
            log4js_1.log4Error('Entered the login page');
            try {
                yield Status();
            }
            catch (err) {
                yield Login();
            }
            yield checkHomePage(); //make sure currently on Homepage. Restart reading
            yield ReadArticlesTimeout(userInfo_1.INFO.Time_Gap, index);
        }
        catch (err) {
            if (!timerB) {
                yield _Error(err);
            }
        }
    }), userInfo_1.INFO.Default_Time * 2);
    return timerB;
}
// Read Blogs
function ReadArticles(time, index) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield checkHomePage();
            log4js_1.log4Info(`-------------------Start-------------------`);
            yield Status();
            timerBFunc(index); // vital BackUp!
            // Randomly open a blog
            yield selectArticle();
            yield Reading(time);
            log4js_1.log4Notice('Checking Credits now');
            if (userInfo_1.INFO.Check_Credit) {
                yield checkCreditPage();
            }
            yield checkHomePage();
            if (timerB) {
                clearTimeout(timerB);
                log4js_1.log4Others('Back up timerB successfully deleted');
            }
            log4js_1.log4Info(`-------------------END-------------------`);
        }
        catch (err) {
            log4js_1.Logger.debug(err);
            log4js_1.log4Error('Failed to read target article');
            yield _Error(err);
        }
    });
}
function refreshCredit() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield page.click(`#extcreditmenu`, { delay: 100 });
            yield page.waitForTimeout(userInfo_1.INFO.Loading_Time);
            const credit = yield page.$eval(`#extcreditmenu`, (el) => el.textContent);
            const userGroup = yield page.$eval(`#g_upmine`, (el) => el.textContent);
            const username = yield page.$eval(`.vwmy a`, (el) => el.textContent);
            if (credit == null)
                throw new Error('credit is null');
            const newCredit = Number(credit.substring(4));
            const change = newCredit - Default_Credit;
            const change_Record = newCredit - Temp_Credit;
            idx++;
            if (idx >= userInfo_1.INFO.Record_Trigger && userInfo_1.INFO.Record_Credit) {
                log4js_1.LoggerCredit.info(`New credit is ${newCredit}`);
                idx = 0;
            }
            if (change_Record >= 10) {
                Temp_Credit = newCredit;
                log4js_1.log4Notice(`New credit is ${newCredit}`);
            }
            else {
                log4js_1.log4Others(`Credit didn't change,still keeping ${newCredit}`);
            }
            // Return to the blog page.
            yield page.waitForTimeout(userInfo_1.INFO.Loading_Time);
            const res = {
                credit,
                userGroup,
                username,
                change,
            };
            return res;
        }
        catch (err) {
            log4js_1.Logger.debug(err);
            log4js_1.log4Error(`Failed to refresh my credit`);
            throw new Error(`Failed to refresh credit`);
        }
    });
}
// check user credit
function checkCreditPage() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield refreshCredit();
            if (!res) {
                throw new Error('res in checkCreditPage is undefined');
            }
            const { credit, userGroup, username, change } = res;
            if (credit && userGroup && username) {
                log4js_1.log4Others(`UserName is ${username}, change is ${change}`);
                if (credit.indexOf('积分') >= 0 && change >= userInfo_1.EMAIL.Email_Trigger) {
                    //Send Email
                    if (userInfo_1.EMAIL.Email_Open) {
                        mailer_1.default(credit, userGroup, username);
                        log4js_1.log4Others(`Successfully sent e-mail`);
                    }
                    Default_Credit = Number(credit.substring(4));
                    log4js_1.log4Notice(`Credit has increased to ${Default_Credit}`);
                }
            }
            // Return to the HomePage
            const url = yield page.url();
            if (url.indexOf(userInfo_1.URL.Base_Url) < 0) {
                yield page.goBack();
                yield page.waitForTimeout(userInfo_1.INFO.Loading_Time);
            }
        }
        catch (err) {
            log4js_1.Logger.debug(err);
            log4js_1.log4Error('Failed to check credit');
            yield _Error(err);
        }
    });
}
function _Error(err) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!browser || !page)
                throw new Error('Critical Error Occurs');
            log4js_1.LoggerErr.error(err);
            yield Status(); //Check user status
            log4js_1.log4Error(err);
            log4js_1.log4Info(`Good news, you are still logged in!`);
            yield page.goto(userInfo_1.URL.Complete_Url);
            yield page.waitForTimeout(userInfo_1.INFO.Loading_Time);
            yield ReadArticlesTimeout(); // reset timeout
        }
        catch (err) {
            if (browser || page) {
                log4js_1.log4Error(err);
                yield page.close();
                yield browser.close();
                log4js_1.log4Info(`Browser has been closed`);
            }
            if (timer)
                clearTimeout(timer);
            if (timerB) {
                clearTimeout(timerB);
                log4js_1.log4Others('Back up timerB successfully deleted in Error Func');
            }
            yield sleep(userInfo_1.INFO.Default_Time / 4);
            yield Main();
        }
    });
}
function sleep(delay) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => setTimeout(resolve, delay));
    });
}
function Main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield Init();
            yield Login();
            yield ReadArticlesTimeout();
        }
        catch (err) {
            yield _Error(err);
        }
    });
}
Main();
