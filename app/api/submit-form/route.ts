import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

// SPREADSHEET_ID will now come from environment variable
// const SPREADSHEET_ID = '1InawAiSrQX1S7JTtaaJW6kwRy873shjs9qrCaikeKTI'; 
const SHEET_NAME = 'Sheet1'; // Or your specific sheet name

// Helper function to format Korean phone numbers
function formatKoreanPhoneNumber(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/\D/g, ''); // Remove non-digit characters

  if (cleaned.startsWith('02')) { // Seoul area code
    if (cleaned.length === 9) return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 5)}-${cleaned.slice(5, 9)}`; // 02-XXX-XXXX
    if (cleaned.length === 10) return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 6)}-${cleaned.slice(6, 10)}`; // 02-XXXX-XXXX
  } else if (cleaned.startsWith('01')) { // Mobile phones (010, 011, 016, 017, 018, 019)
    if (cleaned.length === 10) return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`; // 01X-XXX-XXXX
    if (cleaned.length === 11) return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;// 01X-XXXX-XXXX
  } else if (cleaned.length === 8 && !cleaned.startsWith('0')) { // Short numbers like 1588-XXXX or 1600-XXXX
    return `${cleaned.slice(0,4)}-${cleaned.slice(4,8)}`;
  } else { // Other regional numbers (assuming 3-digit area code if not 02 or 01X)
    if (cleaned.length === 10 && cleaned.startsWith('0')) return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`; // 0XX-XXX-XXXX
    if (cleaned.length === 11 && cleaned.startsWith('0')) return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`; // 0XX-XXXX-XXXX
  }
  return phoneNumber; // Return original (or cleaned) if no specific format matches
}

async function getAuthClient() {
  // Read credentials from environment variable
  const credentialsJson = process.env.GOOGLE_CREDENTIALS_JSON;
  if (!credentialsJson) {
    console.error('GOOGLE_CREDENTIALS_JSON environment variable is not set.');
    throw new Error('Google API credentials configuration is missing.');
  }
  try {
    const credentials = JSON.parse(credentialsJson);
    return google.auth.getClient({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
  } catch (parseError) {
    console.error('Failed to parse GOOGLE_CREDENTIALS_JSON:', parseError);
    throw new Error('Invalid Google API credentials format.');
  }
}

async function appendToSheet(auth: any, data: any, spreadsheetId: string) {
  const sheets = google.sheets({ version: 'v4', auth });
  const timestamp = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
  const privacyConsentText = data.privacy ? '동의함' : '미동의'; // Or however you want to represent this
  const values = [
    [timestamp, data.name, data.phone, data.message || '', privacyConsentText]
  ];
  const resource = {
    values,
  };
  await sheets.spreadsheets.values.append({
    spreadsheetId: spreadsheetId, // Use spreadsheetId from env var
    range: `${SHEET_NAME}`, // Appends to the first empty row of the sheet.
                          // If row 1 is a header, data starts at row 2.
    valueInputOption: 'USER_ENTERED',
    requestBody: resource,
  });
}

export async function POST(request: NextRequest) {
  // Retrieve SPREADSHEET_ID from environment variable
  const spreadsheetId = process.env.SPREADSHEET_ID;
  if (!spreadsheetId) {
    console.error('SPREADSHEET_ID environment variable is not set.');
    return NextResponse.json({ message: 'Google Sheet configuration is missing.' }, { status: 500 });
  }

  try {
    const rawData = await request.json();
    let { name, phone, message, privacy } = rawData;

    if (!name || !phone) {
      return NextResponse.json({ message: '이름과 핸드폰 번호는 필수입니다.' }, { status: 400 });
    }

    // Format the phone number before further processing
    const formattedPhone = formatKoreanPhoneNumber(phone);

    const authClient = await getAuthClient();
    await appendToSheet(authClient, { name, phone: formattedPhone, message, privacy }, spreadsheetId);

    console.log('Form data successfully sent to Google Sheets:', { name, phone: formattedPhone, message, privacy });
    return NextResponse.json({ 
      message: '상담 신청이 성공적으로 접수되었습니다.\n평일 영업일 기준 24시간 내 담당자가 연락드리겠습니다.', 
      data: { name, phone: formattedPhone, message, privacy } 
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error processing form submission or appending to Google Sheets:', error);
    let errorMessage = '오류가 발생했습니다. 다시 시도해주세요.';
    if (error.message === 'Google API credentials configuration is missing.' || error.message === 'Invalid Google API credentials format.') {
        errorMessage = '서버 설정 오류: Google API 인증 정보가 잘못되었습니다.';
    } else if (error.code === 'ENOENT') { // Should not happen anymore with env vars
      errorMessage = 'Google API 인증 파일(credentials.json)을 찾을 수 없습니다. 경로를 확인해주세요.';
    } else if (error.message && error.message.includes('PERMISSION_DENIED')) {
      errorMessage = 'Google Sheet에 접근 권한이 없습니다. 서비스 계정에 편집자 권한을 부여했는지 확인해주세요.';
    } else if (error.message && error.message.includes('Requested entity was not found')){
      errorMessage = `Google Sheet ID (${spreadsheetId}) 또는 시트 이름 (${SHEET_NAME})을 찾을 수 없습니다. 확인해주세요.`
    }
    return NextResponse.json({ message: errorMessage, error: error.message || 'Unknown error' }, { status: 500 });
  }
}
