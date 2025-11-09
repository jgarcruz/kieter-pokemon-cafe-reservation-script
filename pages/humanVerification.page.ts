import {expect, Locator, Page} from '@playwright/test';

export class HumanVerificationPage {
    readonly page: Page;
    readonly confirmHuman: Locator;

    constructor(page: Page) {
        this.page = page;
        this.confirmHuman = page.getByText("Let's confirm you are human");
    }

    async verifyHumanity() {
        try {
            await expect(this.confirmHuman).toBeVisible({ timeout: 3000 });
            
            console.log('Human verification prompt detected. Please complete the task.');

            await this.page.waitForFunction(() => document.title.includes("席の予約"), null, { timeout: 300000 });
            
            console.log('Human verification completed. Resuming script.');
          } catch (e) {
            console.log('No human verification prompt found. Continuing script.');
          }
    }
}