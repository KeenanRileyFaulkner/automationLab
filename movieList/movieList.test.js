const { Builder, Capabilities, By } = require('selenium-webdriver');
require('chromedriver');
const driver = new Builder().withCapabilities(Capabilities.chrome()).build();

beforeAll(async () => {
    await driver.get('http://localhost:5500/movieList/index.html');
});

afterAll(async () => {
    await driver.quit();
});



describe('Cross off and remove movie', () => {
    test('Movies can be crossed off', async () => {
        //Add a movie to the list
        let addMovieBar = await driver.findElement(By.css('input'));
        await addMovieBar.sendKeys('Star Wars Episode IV: A New Hope\n');
    
        //Click on the movie so that it is crossed off
        let movieTitle = await driver.findElement(By.xpath('//ul/li'))
        await movieTitle.click()
    
        //Check that the movie title has the 'checked' class
        await driver.findElement(By.xpath('//span[@class="checked"]'));
    });
    
    test('Movies can be removed', async () => {
        //Add a movie to the list
        let addMovieBar = await driver.findElement(By.css('input'));
        await addMovieBar.sendKeys('Rocky Balboa\n');

    
        //Click on the x to remove the movie
        let xBtn = await driver.findElements(By.xpath('//*[text()="x"]'));
        await xBtn.forEach(elem => elem.click());
        await driver.sleep(100);

    
        //Check to see if both movies can be removed one li element exists (from previous test)
        let numListItems;
        await driver.findElements(By.xpath('//li')).then(elements => numListItems = elements.length);
        expect(numListItems).toBe(0);
    });
});



describe('Displays correct notification for watched, added back, and removed', () => {
    test('Watched notification', async () => {
        //Add a movie to the list
        await driver.findElement(By.css('input')).sendKeys('-12345\n');
        let messageWrapper = await driver.findElement(By.css('aside'));

        //click on the movie to cross it off, and check that the text sent to aside element is correct
        await driver.findElement(By.css('span')).click();

        let message = await messageWrapper.getAttribute('textContent');;
        expect(message).toBe('-12345 watched!');
    });

    test('Added back notification', async () => {
        //click on the movie to un-cross it off, and check that the text sent to aside element is correct
        await driver.findElement(By.css('span')).click();
        let messageWrapper = await driver.findElement(By.css('aside'));
        let message = await messageWrapper.getAttribute('textContent');;
        expect(message).toBe('-12345 added back!');
    });

    test('Removed notification', async() => {
        //click on the x button for the movie, and check that the message sent to aside is correct
        await driver.findElement(By.xpath('//button[text()="x"]')).click();

        let messageWrapper = await driver.findElement(By.css('aside'));
        let message = await messageWrapper.getAttribute('textContent');
        expect(message).toBe('-12345 deleted!');
    });
})