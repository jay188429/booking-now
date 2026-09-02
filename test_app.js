import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle' });
    await page.screenshot({ path: './test_screenshot.png', fullPage: true });
    console.log('Screenshot saved');
    
    // 탭 버튼들을 찾아서 텍스트 확인
    const buttons = await page.locator('button').all();
    console.log(`Found ${buttons.length} buttons`);
    
    for (const btn of buttons) {
      const text = await btn.textContent();
      if (text && ['대시보드', '예약목록', '예약추가', '상태관리', '위치확인'].includes(text.trim())) {
        console.log(`Tab button found: ${text.trim()}`);
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
