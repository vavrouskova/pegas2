import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  console.log('POST request received:', request);
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  // Parse the request body
  const postData = await request.json();
  const { gRecaptchaToken } = postData;

  try {
    // Use URLSearchParams to encode the form data
    const formData = new URLSearchParams();
    formData.append('secret', secretKey ?? '');
    formData.append('response', gRecaptchaToken);

    // Make the POST request to Google reCAPTCHA verification API
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const data = await response.json();
    console.log('Response', data);

    // Check the response from the reCAPTCHA verification API
    if (data?.success && data?.score > (process.env.RECAPTCHA_THRESHOLD ?? 0.3)) {
      console.log('reCAPTCHA verification score:', data?.score);

      // Return success response
      return NextResponse.json({
        success: true,
        score: data.score,
      });
    }
    // Return failure response due to low score or failed validation
    return NextResponse.json({
      success: false,
      error: 'Low score or reCAPTCHA validation failed.',
    });
  } catch (error) {
    console.error('Error during reCAPTCHA validation:', error);
    return NextResponse.json({ success: false, error: 'Server error during reCAPTCHA validation.' });
  }
}
