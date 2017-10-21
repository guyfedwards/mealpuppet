#!/usr/bin/env node
const chalk = require('chalk')
const ora = require('ora')
const meow = require('meow')
const puppeteer = require('puppeteer')

const debug = process.env.DEBUG
const debugOpts = debug
    ? { headless: false, slowMo: 250 }
    : {}

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

const spinner = ora('Spinning up particle collider').start()

puppeteer.launch(debugOpts).then(async browser => {
    const page = await browser.newPage()
    await page.goto('https://secure.mealpal.com/lunch')
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.50 Safari/537.36')
    await page.setViewport({
      width: 1440,
      height: 1000
    });


    await page.focus('input[type=email]')
    await page.type(email)

    await page.focus('input[type=password]')
    await page.type(password)

    await page.click('button[type=submit]')

    console.log(page)
    spinner.text = 'Searching for ingredients'

    await page.waitForSelector('.row.not-have span[role=button]')
    await page.click('.row.not-have span[role=button]')


    await page.waitForSelector('.filter-text input')
    spinner.text = 'Loading particle collider'

    await page.focus('.filter-text input')
    await page.type(filter)

    await page.click('.filter-text .search-button')

    await page.hover('.meal-listing .meal:first-of-type')
    await page.click('.meal-listing .meal:first-of-type .meal-dropdown__button')

    await page.click('.pickupTimes-list li:nth-of-type(4)')

    spinner.text = 'Making soup with particle collider'
    await page.waitForSelector('.mp-reserve-button')
    await page.click('.mp-reserve-button')


    spinner.text = 'Wow that was fast 🦄'
    spinner.succeed()
    await browser.close()
    process.exit(0)
})
