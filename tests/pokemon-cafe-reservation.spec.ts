import {expect, Page, test} from '@playwright/test';
import { TermsPage } from '../pages/termsPage.page';
import {EmailPermissionPage} from "../pages/emailPermission.page";
import {ReservationPage} from "../pages/reservation.page";
import {HumanVerificationPage} from "../pages/humanVerification.page";

import { chromium, BrowserContext } from '@playwright/test';

const checkCongested = async (page: Page) => {
    const isCongestedPage = page.getByText("congested due to heavy");
    await expect(isCongestedPage).not.toBeVisible();
}

const userDataDir = '../browserContext'; 

test('make reservation', async () => {

    const context: BrowserContext = await chromium.launchPersistentContext(userDataDir, {
        headless: false, // Headed mode helps with manual tasks like verification
        viewport: { width: 1280, height: 720 },
      });

    const page = await context.newPage();
    await page.goto('https://osaka.pokemon-cafe.jp/');

    // complete terms page
    const termsPage = new TermsPage(page);
    await termsPage.agreeToTerms();
    await checkCongested(page);

    // human verification if necessary
    const humanPage = new HumanVerificationPage(page);
    await humanPage.verifyHumanity();
    await checkCongested(page);

    // complete email auth page
    const emailPermissionPage = new EmailPermissionPage(page);
    await emailPermissionPage.clickMakeReservation();
    await checkCongested(page);

    // complete reservation page
    const reservationPage = new ReservationPage(page);

    // find a booking
    await reservationPage.checkAvailableTime();
});
