const { Resend } = require('resend');

// Initialize Resend with API key from environment
const resend = new Resend(process.env.RESEND_API_KEY);

// Helper to format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value || 0);
};

// Helper to format percentage
const formatPercent = (value) => {
  return new Intl.NumberFormat('en-AU', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value || 0);
};

exports.handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    // Parse body
    let data;
    try {
      data = JSON.parse(event.body);
    } catch (e) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid JSON body' })
      };
    }

    const { email, roadmapData, buyingSoon, openToContact } = data;

    if (!email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email is required' })
      };
    }

    if (!roadmapData) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Roadmap data is required' })
      };
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Email service not configured. Please add RESEND_API_KEY to Netlify environment variables.' })
      };
    }

    // Build email HTML (no PDF for now - simpler and more reliable)
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb;">
        <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">

          <h1 style="color: #1f2937; font-size: 24px; margin: 0 0 8px 0;">Your Property Portfolio Roadmap</h1>
          <p style="color: #6b7280; margin: 0 0 24px 0;">Here's your personalised wealth building projection</p>

          <!-- Hero Number -->
          <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <div style="font-size: 36px; font-weight: 700; color: #065f46;">${formatCurrency(roadmapData.projectedIncome)}<span style="font-size: 18px; font-weight: 400;">/year</span></div>
            <div style="color: #047857; font-size: 14px; margin-top: 4px;">Projected passive income after ${roadmapData.targetYears || 15} years</div>
          </div>

          <!-- Stats Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
            <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; text-align: center;">
              <div style="font-size: 24px; font-weight: 600; color: #1f2937;">${roadmapData.totalProperties || 0}</div>
              <div style="font-size: 12px; color: #6b7280;">Total Properties</div>
            </div>
            <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; text-align: center;">
              <div style="font-size: 24px; font-weight: 600; color: #059669;">${roadmapData.debtFreeProperties || 0}</div>
              <div style="font-size: 12px; color: #6b7280;">Debt-Free Properties</div>
            </div>
            <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; text-align: center;">
              <div style="font-size: 24px; font-weight: 600; color: #1f2937;">+${roadmapData.propertiesBought || 0}</div>
              <div style="font-size: 12px; color: #6b7280;">Properties to Acquire</div>
            </div>
            <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; text-align: center;">
              <div style="font-size: 24px; font-weight: 600; color: #7c3aed;">${formatCurrency(roadmapData.portfolioValue)}</div>
              <div style="font-size: 12px; color: #6b7280;">Final Portfolio Value</div>
            </div>
          </div>

          <!-- Your Inputs -->
          <h3 style="color: #1f2937; font-size: 16px; margin: 0 0 12px 0; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">Your Starting Position</h3>
          <table style="width: 100%; font-size: 14px; margin-bottom: 24px;">
            <tr>
              <td style="color: #6b7280; padding: 4px 0;">Current Properties</td>
              <td style="color: #1f2937; text-align: right; padding: 4px 0;">${roadmapData.currentProperties || 0}</td>
            </tr>
            <tr>
              <td style="color: #6b7280; padding: 4px 0;">Cash to Invest</td>
              <td style="color: #1f2937; text-align: right; padding: 4px 0;">${formatCurrency(roadmapData.cashToInvest)}</td>
            </tr>
            <tr>
              <td style="color: #6b7280; padding: 4px 0;">Target Timeline</td>
              <td style="color: #1f2937; text-align: right; padding: 4px 0;">${roadmapData.targetYears || 15} years</td>
            </tr>
            <tr>
              <td style="color: #6b7280; padding: 4px 0;">Income Goal</td>
              <td style="color: #1f2937; text-align: right; padding: 4px 0;">${formatCurrency(roadmapData.incomeGoal)}/year</td>
            </tr>
          </table>

          <!-- Assumptions -->
          <h3 style="color: #1f2937; font-size: 16px; margin: 0 0 12px 0; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">Key Assumptions</h3>
          <table style="width: 100%; font-size: 14px; margin-bottom: 24px;">
            <tr>
              <td style="color: #6b7280; padding: 4px 0;">Capital Growth</td>
              <td style="color: #1f2937; text-align: right; padding: 4px 0;">${formatPercent(roadmapData.assumptions?.appreciationRate)}</td>
            </tr>
            <tr>
              <td style="color: #6b7280; padding: 4px 0;">Rental Yield</td>
              <td style="color: #1f2937; text-align: right; padding: 4px 0;">${formatPercent(roadmapData.assumptions?.rentalYield)}</td>
            </tr>
            <tr>
              <td style="color: #6b7280; padding: 4px 0;">Interest Rate</td>
              <td style="color: #1f2937; text-align: right; padding: 4px 0;">${formatPercent(roadmapData.assumptions?.interestRate)}</td>
            </tr>
            <tr>
              <td style="color: #6b7280; padding: 4px 0;">Target Purchase Price</td>
              <td style="color: #1f2937; text-align: right; padding: 4px 0;">${formatCurrency(roadmapData.assumptions?.averagePropertyPrice)}</td>
            </tr>
          </table>

          <!-- Strategy -->
          <div style="background: #eff6ff; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <h4 style="color: #1e40af; font-size: 14px; margin: 0 0 8px 0;">Strategy Summary</h4>
            <p style="color: #3b82f6; font-size: 13px; margin: 0; line-height: 1.5;">
              Over ${roadmapData.targetYears || 15} years, this projection shows you acquiring ${roadmapData.propertiesBought || 0} additional properties through strategic refinancing and cash investment. At the end of the period, you would sell ${roadmapData.propertiesToSell || 0} properties to pay off all debt, leaving you with ${roadmapData.debtFreeProperties || 0} debt-free properties generating passive income.
            </p>
          </div>

          <!-- CTA -->
          <div style="text-align: center; margin-bottom: 24px;">
            <a href="https://property-retirement-calc.netlify.app" style="display: inline-block; background: #2563eb; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 500;">Adjust Your Scenario</a>
          </div>

          <!-- Disclaimer -->
          <div style="background: #fef3c7; border-radius: 8px; padding: 16px;">
            <p style="color: #92400e; font-size: 11px; margin: 0; line-height: 1.5;">
              <strong>Disclaimer:</strong> This projection is for illustrative purposes only. Actual results depend on market conditions, your borrowing capacity, and other factors. This is not financial advice. Consult qualified professionals before making investment decisions.
            </p>
          </div>

        </div>

        <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 24px;">
          Property Portfolio Retirement Calculator
        </p>
      </body>
      </html>
    `;

    // Send email
    console.log('Sending email to:', email);

    const { data: emailResult, error } = await resend.emails.send({
      from: 'Property Calculator <onboarding@resend.dev>',
      to: email,
      subject: `Your Property Roadmap: ${formatCurrency(roadmapData.projectedIncome)}/year in ${roadmapData.targetYears || 15} years`,
      html: emailHtml,
    });

    if (error) {
      console.error('Resend error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to send email: ' + (error.message || 'Unknown error') })
      };
    }

    console.log('Email sent successfully:', emailResult);

    // Log lead info
    console.log('Lead captured:', {
      email,
      buyingSoon,
      openToContact,
      projectedIncome: roadmapData.projectedIncome,
      timestamp: new Date().toISOString()
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, message: 'Email sent successfully' })
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error: ' + (error.message || 'Unknown error') })
    };
  }
};
