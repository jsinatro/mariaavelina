import { chromium } from "playwright";

export async function htmlToPdfBuffer(html: string, format: "A4" | "A5" = "A4") {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle" });
  const pdf = await page.pdf({ format, printBackground: true });
  await browser.close();
  return Buffer.from(pdf);
}
