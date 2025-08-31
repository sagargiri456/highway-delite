const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';
let authToken = '';
let testNoteId = '';

// Test configuration
const testUser = {
  email: 'test@example.com',
  password: 'testpassword123'
};

const testNote = {
  title: 'Test Note',
  content: 'This is a test note content'
};

const updatedNote = {
  title: 'Updated Test Note',
  content: 'This is the updated test note content'
};

// Helper function to make authenticated requests
const makeAuthRequest = (method, url, data = null) => {
  const config = {
    method,
    url: `${API_BASE}${url}`,
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    }
  };
  
  if (data) {
    config.data = data;
  }
  
  return axios(config);
};

// Test functions
const testAuth = async () => {
  console.log('🔐 Testing Authentication...');
  
  try {
    // First, try to sign up
    const signupResponse = await axios.post(`${API_BASE}/auth/signup`, {
      name: 'Test User',
      dob: '1990-01-01',
      email: testUser.email
    });
    console.log('✅ Signup successful');
  } catch (error) {
    if (error.response?.status === 409) {
      console.log('ℹ️  User already exists, proceeding with signin');
    } else {
      console.log('❌ Signup failed:', error.response?.data);
      return false;
    }
  }

  try {
    // Sign in to get token
    const signinResponse = await axios.post(`${API_BASE}/auth/signin`, {
      email: testUser.email,
      password: testUser.password
    });
    
    authToken = signinResponse.data.token;
    console.log('✅ Signin successful, token received');
    return true;
  } catch (error) {
    console.log('❌ Signin failed:', error.response?.data);
    return false;
  }
};

const testCreateNote = async () => {
  console.log('\n📝 Testing Create Note...');
  
  try {
    const response = await makeAuthRequest('POST', '/notes', testNote);
    testNoteId = response.data.data._id;
    console.log('✅ Note created successfully:', response.data.data.title);
    return true;
  } catch (error) {
    console.log('❌ Create note failed:', error.response?.data);
    return false;
  }
};

const testGetNotes = async () => {
  console.log('\n📋 Testing Get Notes...');
  
  try {
    const response = await makeAuthRequest('GET', '/notes?page=1&limit=10');
    console.log('✅ Notes retrieved successfully');
    console.log(`   Found ${response.data.data.length} notes`);
    console.log(`   Total notes: ${response.data.pagination.totalNotes}`);
    console.log(`   Current page: ${response.data.pagination.currentPage}`);
    console.log(`   Total pages: ${response.data.pagination.totalPages}`);
    return true;
  } catch (error) {
    console.log('❌ Get notes failed:', error.response?.data);
    return false;
  }
};

const testUpdateNote = async () => {
  console.log('\n✏️  Testing Update Note...');
  
  try {
    const response = await makeAuthRequest('PUT', `/notes/${testNoteId}`, updatedNote);
    console.log('✅ Note updated successfully:', response.data.data.title);
    return true;
  } catch (error) {
    console.log('❌ Update note failed:', error.response?.data);
    return false;
  }
};

const testValidation = async () => {
  console.log('\n🔍 Testing Input Validation...');
  
  // Test empty title
  try {
    await makeAuthRequest('POST', '/notes', { title: '', content: 'test' });
    console.log('❌ Empty title validation failed');
  } catch (error) {
    if (error.response?.status === 400) {
      console.log('✅ Empty title validation working');
    }
  }
  
  // Test missing title
  try {
    await makeAuthRequest('POST', '/notes', { content: 'test' });
    console.log('❌ Missing title validation failed');
  } catch (error) {
    if (error.response?.status === 400) {
      console.log('✅ Missing title validation working');
    }
  }
  
  // Test invalid note ID
  try {
    await makeAuthRequest('PUT', '/notes/invalid-id', updatedNote);
    console.log('❌ Invalid ID validation failed');
  } catch (error) {
    if (error.response?.status === 400) {
      console.log('✅ Invalid ID validation working');
    }
  }
  
  return true;
};

const testDeleteNote = async () => {
  console.log('\n🗑️  Testing Delete Note...');
  
  try {
    const response = await makeAuthRequest('DELETE', `/notes/${testNoteId}`);
    console.log('✅ Note deleted successfully');
    return true;
  } catch (error) {
    console.log('❌ Delete note failed:', error.response?.data);
    return false;
  }
};

const testPagination = async () => {
  console.log('\n📄 Testing Pagination...');
  
  // Create multiple notes for pagination testing
  const notesToCreate = [];
  for (let i = 1; i <= 15; i++) {
    notesToCreate.push({
      title: `Pagination Test Note ${i}`,
      content: `Content for note ${i}`
    });
  }
  
  try {
    // Create notes
    for (const note of notesToCreate) {
      await makeAuthRequest('POST', '/notes', note);
    }
    console.log('✅ Created 15 test notes for pagination');
    
    // Test first page
    const page1Response = await makeAuthRequest('GET', '/notes?page=1&limit=5');
    console.log(`   Page 1: ${page1Response.data.data.length} notes`);
    console.log(`   Has next page: ${page1Response.data.pagination.hasNextPage}`);
    
    // Test second page
    const page2Response = await makeAuthRequest('GET', '/notes?page=2&limit=5');
    console.log(`   Page 2: ${page2Response.data.data.length} notes`);
    console.log(`   Has prev page: ${page2Response.data.pagination.hasPrevPage}`);
    
    return true;
  } catch (error) {
    console.log('❌ Pagination test failed:', error.response?.data);
    return false;
  }
};

// Main test runner
const runTests = async () => {
  console.log('🚀 Starting Notes API Tests...\n');
  
  const tests = [
    { name: 'Authentication', fn: testAuth },
    { name: 'Create Note', fn: testCreateNote },
    { name: 'Get Notes', fn: testGetNotes },
    { name: 'Update Note', fn: testUpdateNote },
    { name: 'Input Validation', fn: testValidation },
    { name: 'Pagination', fn: testPagination },
    { name: 'Delete Note', fn: testDeleteNote }
  ];
  
  let passedTests = 0;
  
  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) passedTests++;
    } catch (error) {
      console.log(`❌ ${test.name} test crashed:`, error.message);
    }
  }
  
  console.log(`\n📊 Test Results: ${passedTests}/${tests.length} tests passed`);
  
  if (passedTests === tests.length) {
    console.log('🎉 All tests passed! Notes API is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Please check the implementation.');
  }
};

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  testAuth,
  testCreateNote,
  testGetNotes,
  testUpdateNote,
  testValidation,
  testDeleteNote,
  testPagination
};
