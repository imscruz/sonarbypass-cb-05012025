const mineflayer = require('mineflayer');
const readline = require('readline');
const chalk = require('chalk');
const figlet = require('figlet');
const { exec } = require('child_process');

// Clear terminal and set title
exec('clear');
exec('title SonarBypass - imscruz');
console.log(figlet.textSync('SONAR BYPASS', { horizontalLayout: 'full' }));
console.log(chalk.green('\n[ + ] SONAR Bypass Script Initialized'));

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, answer => resolve(answer)));
}

(async () => {
    let botname = await askQuestion("Bot name? (Example: botname_%%random4char) ");
    botname += '_' + Math.random().toString(36).substring(2, 6);
    let server = await askQuestion("IP:Port? ");
    if (!/^\d+\.\d+\.\d+\.\d+:\d+$/.test(server)) {
        console.log(chalk.red("[ - ] Invalid IP:Port format! Exiting...")); //error code
        process.exit(1);
    }
    let thread = await askQuestion("Thread count? "); 
    let proxiesFile = await askQuestion("Proxies file (leave blank if none)? "); 
    let joinDelay = await askQuestion("Join delay (min 3 sec)? ");
    while (parseInt(joinDelay) < 3) { // want abuse change this to 3>0
        joinDelay = await askQuestion("Join delay too low! Enter at least 3 seconds: "); //error code
    }
    console.log(chalk.green("[ + ] Starting bypass..."));
    rl.close();
    function createBot() {
        const bot = mineflayer.createBot({
            host: server.split(':')[0],
            port: parseInt(server.split(':')[1]),
            username: botname
        });
        bot.on('spawn', () => {
            console.log(chalk.green(`[ + ] ${botname} joined`));
            setInterval(() => {
                bot.setControlState('sneak', true);
                setTimeout(() => bot.setControlState('sneak', false), 400);
            }, 400); //this can be more lower for abuse 400>100
        });
        bot.on('error', (err) => {
            console.log(chalk.red(`[ - ] ${botname} can't connect: ${err.message}`));
        });
        bot.on('end', () => {
            console.log(chalk.yellow(`[+] ${botname} reconnected`));
            setTimeout(createBot, joinDelay * 1000);
        });
    }
    for (let i = 0; i < thread; i++) {
        setTimeout(createBot, i * joinDelay * 1000);
    }
})();
console.log(chalk.red("CTRL+C for stop BYPASSING"));
