/**
 * Mock Authentication Service
 * 
 * PURPOSE:
 * Simulates asynchronous backend network communication with Spring Boot.
 * Uses Promises and setTimeout to simulate real server latency (~800ms).
 * 
 * IMPORTANT FOR LATER:
 * In Session 4 & 5, when we connect Spring Security and JWT, the mock functions
 * below will be replaced by real Axios calls:
 * 
 *   // Real Axios equivalent:
 *   // export const registerUser = (userData) => axios.post('/api/auth/register', userData);
 *   // export const loginUser = (credentials) => axios.post('/api/auth/login', credentials);
 */

// In-memory mock database for registered users
const registeredUsersDatabase = [
  {
    fullName: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    phone: '5552345678',
    role: 'PATIENT'
    // NOTE: Real passwords are never stored in plain text in memory or localStorage!
  },
  {
    fullName: 'Dr. Sarah Jenkins',
    email: 'dr.jenkins@hospital.com',
    phone: '5559871234',
    role: 'DOCTOR'
  },
  {
    fullName: 'System Administrator',
    email: 'admin@hospital.com',
    phone: '5550001111',
    role: 'ADMIN'
  }
];

// Valid credentials map for demo/academic testing
const demoPasswordLookup = {
  'alex.morgan@example.com': 'Patient@123',
  'patient@hospital.com': 'Patient@123',
  'dr.jenkins@hospital.com': 'Doctor@123',
  'admin@hospital.com': 'Admin@123'
};

/**
 * =========================================================================
 * MOCK FUNCTION: mockRegisterUser
 * =========================================================================
 * In Session 4 & 5, this will be replaced with:
 *   const response = await axios.post('http://localhost:8080/api/auth/register', userData);
 *   return response.data;
 * =========================================================================
 */
export const mockRegisterUser = (userData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const { fullName, email, phone, password } = userData;

      // Check if email already exists in our mock database
      const existingUser = registeredUsersDatabase.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (existingUser) {
        reject(new Error('An account with this email address already exists. Please log in instead.'));
        return;
      }

      // Add to our mock users list (store safe profile info only)
      const newUser = {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        role: 'PATIENT'
      };

      registeredUsersDatabase.push(newUser);
      demoPasswordLookup[newUser.email] = password; // Temporary mock lookup for the current session

      resolve({
        success: true,
        message: `Account created successfully for ${newUser.fullName}! Redirecting to login...`,
        user: newUser
      });
    }, 800); // 800ms simulated network delay
  });
};

/**
 * =========================================================================
 * MOCK FUNCTION: mockLoginUser
 * =========================================================================
 * In Session 4 & 5, this will be replaced with:
 *   const response = await axios.post('http://localhost:8080/api/auth/login', credentials);
 *   return response.data;
 * =========================================================================
 */
export const mockLoginUser = ({ email, password }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const normalizedEmail = email.trim().toLowerCase();

      // Find user by email
      const matchedUser = registeredUsersDatabase.find(
        (u) => u.email.toLowerCase() === normalizedEmail
      );

      // Verify demo password
      const expectedPassword = demoPasswordLookup[normalizedEmail];

      if (!matchedUser || expectedPassword !== password) {
        reject(
          new Error('Invalid email or password. Please verify your credentials and try again.')
        );
        return;
      }

      // Generate a mock JWT token (simulating what Spring Boot's JwtUtil generates)
      const mockJwtToken = `mock-header.${btoa(JSON.stringify({ sub: matchedUser.email, role: matchedUser.role }))}.mock-signature`;

      // Construct safe session payload (NO PASSWORDS STORED)
      const sessionData = {
        token: mockJwtToken,
        user: {
          name: matchedUser.fullName,
          email: matchedUser.email,
          role: matchedUser.role,
          phone: matchedUser.phone
        }
      };

      // Store only safe session data in localStorage
      localStorage.setItem('careplus_token', sessionData.token);
      localStorage.setItem('careplus_user', JSON.stringify(sessionData.user));

      resolve({
        success: true,
        message: `Welcome back, ${matchedUser.fullName}! Logging you in...`,
        data: sessionData
      });
    }, 800); // 800ms simulated network delay
  });
};
