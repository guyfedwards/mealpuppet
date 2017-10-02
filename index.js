#!/usr/bin/env node
const chalk = require('chalk')
const puppeteer = require('puppeteer')
const meow = require('meow')

const debug = process.env.DEBUG
const debugOpts = debug
    ? { headless: false, slowMo: 250 }
    : {}

const sleep = ms => {
    return new Promise(res => { setTimeout(() => res(), ms) })
}

const cli = meow(`
    Usage: $ mealpuppet --email mail@gmail.com --password p455w0rd --filter 'walter & monty'
`)

const email = cli.flags.email
const password = cli.flags.password
const filter = cli.flags.filter

if (!email || !password || !filter) {
    console.log(chalk.red(cli.help))
    process.exit(1)
}

puppeteer.launch(debugOpts).then(async browser => {
    const page = await browser.newPage()
    await page.goto('https://secure.mealpal.com/lunch')
    await page.setViewport({
      width: 1440,
      height: 1000
    });

    await page.focus('input[type=email]')
    await page.type(email)

    await page.focus('input[type=password]')
    await page.type(password)

    await page.click('button[type=submit]')

    await sleep(6000)

    await page.focus('.filter-text input')
    await page.type(filter)

    await page.click('.filter-text .search-button')

    await page.hover('.meal-listing .meal:first-of-type')
    await page.click('.meal-listing .meal:first-of-type .meal-dropdown__button')

    await page.click('.pickupTimes-list li:nth-of-type(4)')
    await sleep(500)
    await page.click('.mp-reserve-button')

    await browser.close()
    process.exit(0)
})