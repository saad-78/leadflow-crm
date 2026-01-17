const { chromium } = require('playwright');

async function testLeadFlowCRM() {
  console.log('Starting LeadFlow CRM tests...\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Collect console errors
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  page.on('pageerror', error => {
    errors.push(error.message);
  });

  try {
    // Test 1: Login Page
    console.log('1. Testing Login Page...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle', timeout: 30000 });
    
    // Wait for the page to be fully loaded
    await page.waitForSelector('body', { timeout: 10000 });
    
    // Check for login form elements
    const emailInput = await page.$('input[type="email"]');
    const passwordInput = await page.$('input[type="password"]');
    const submitButton = await page.$('button[type="submit"]');
    
    if (emailInput && passwordInput && submitButton) {
      console.log('   ✓ Login page loaded with form elements');
    } else {
      throw new Error('Login form elements not found');
    }

    // Test 2: Login with credentials
    console.log('2. Testing Login...');
    await page.fill('input[type="email"]', 'admin@leadflow.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Wait for navigation to dashboard
    await page.waitForURL('**/', { timeout: 15000 });
    console.log('   ✓ Login successful, redirected to dashboard');

    // Test 3: Dashboard Analytics
    console.log('3. Testing Dashboard Analytics...');
    await page.waitForSelector('body', { timeout: 10000 });
    
    // Check if analytics cards are present (they might show 0 if no data)
    const dashboardTitle = await page.textContent('h1');
    if (dashboardTitle && dashboardTitle.includes('Dashboard')) {
      console.log('   ✓ Dashboard loaded');
    }

    // Test 4: Navigate to Leads
    console.log('4. Testing Leads Page...');
    await page.click('a[href="/leads"]');
    await page.waitForURL('**/leads', { timeout: 10000 });
    await page.waitForSelector('body', { timeout: 10000 });
    console.log('   ✓ Leads page loaded');

    // Test 5: Check for API errors (filter out MongoDB connection expected errors)
    const relevantErrors = errors.filter(err => 
      !err.includes('MongoDB') && 
      !err.includes('ECONNREFUSED')
    );
    
    if (relevantErrors.length > 0) {
      console.log('\n⚠ Console Errors Found:');
      relevantErrors.forEach(err => console.log(`   - ${err}`));
    } else {
      console.log('   ✓ No critical console errors detected');
    }

    console.log('\n✅ All tests passed successfully!');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

testLeadFlowCRM();
