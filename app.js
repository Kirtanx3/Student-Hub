// ===== FIREBASE IMPORTS =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-analytics.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  deleteDoc,
  where,
  limit
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-storage.js";
import {
  getDatabase,
  ref as dbRef,
  set,
  onValue,
  onDisconnect,
  serverTimestamp as rtdbServerTimestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";

// ===== CONFIG =====
const firebaseConfig = {
  apiKey: "AIzaSyATYycIBHS-hqwbX-MVNa7_867pb8jmKNg",
  authDomain: "index-bad60.firebaseapp.com",
  projectId: "index-bad60",
  storageBucket: "index-bad60.firebasestorage.app",
  messagingSenderId: "60479450754",
  appId: "1:60479450754:web:856d8360c987f2d9500e9b",
  measurementId: "G-S7DG5ZBLJP",
  databaseURL: "https://index-bad60-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const rtdb = getDatabase(app);

// ===== SET PERSISTENCE =====
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("✅ Persistence set to LOCAL"))
  .catch((error) => console.error("❌ Persistence error:", error));

// ===== GLOW EFFECT =====
const glowBlob = document.getElementById('glowBlob');
const glowBlobSecondary = document.getElementById('glowBlobSecondary');

document.addEventListener('mousemove', (e) => {
  const x = e.clientX;
  const y = e.clientY;
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  glowBlob.style.left = x + 'px';
  glowBlob.style.top = y + 'px';
  glowBlob.classList.add('active');
  
  const secondaryX = width - x;
  const secondaryY = height - y;
  glowBlobSecondary.style.left = secondaryX + 'px';
  glowBlobSecondary.style.top = secondaryY + 'px';
});

document.addEventListener('mouseleave', () => {
  glowBlob.classList.remove('active');
});


// Pause glow animations when tab is hidden to save CPU/battery
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    document.getElementById('glowContainer').classList.add('paused');
  } else {
    document.getElementById('glowContainer').classList.remove('paused');
  }
});
\n// ===== DOM REFS =====
const $ = id => document.getElementById(id);
const loadingScreen = $('loadingScreen');
const loginPage = $('loginPage');
const signupPage = $('signupPage');
const dashboardPage = $('dashboardPage');
const forgotModal = $('forgotModal');
const logoutModal = $('logoutModal');

// ===== ROLE TOGGLE =====
let selectedRole = 'student';

$('loginStudentBtn').addEventListener('click', function() {
  selectedRole = 'student';
  $('loginStudentBtn').className = 'role-toggle-btn active-student';
  $('loginTeacherBtn').className = 'role-toggle-btn';
  $('loginBtn').className = 'btn btn-primary';
  $('loginBtn').textContent = 'Sign In';
});

$('loginTeacherBtn').addEventListener('click', function() {
  selectedRole = 'teacher';
  $('loginTeacherBtn').className = 'role-toggle-btn active-teacher';
  $('loginStudentBtn').className = 'role-toggle-btn';
  $('loginBtn').className = 'btn btn-teacher';
  $('loginBtn').textContent = '👨‍🏫 Sign In as Teacher';
});

$('signupStudentBtn').addEventListener('click', function() {
  selectedRole = 'student';
  $('signupStudentBtn').className = 'role-toggle-btn active-student';
  $('signupTeacherBtn').className = 'role-toggle-btn';
  $('studentCourseGroup').style.display = 'block';
  $('teacherDepartmentGroup').style.display = 'none';
  $('signupBtn').className = 'btn btn-primary';
  $('signupBtn').textContent = 'Create Account';
  $('signupBtn').disabled = false;
  $('signupCourse').required = true;
});

$('signupTeacherBtn').addEventListener('click', function() {
  selectedRole = 'teacher';
  $('signupTeacherBtn').className = 'role-toggle-btn active-teacher';
  $('signupStudentBtn').className = 'role-toggle-btn';
  $('studentCourseGroup').style.display = 'none';
  $('teacherDepartmentGroup').style.display = 'block';
  $('signupBtn').className = 'btn btn-teacher';
  $('signupBtn').textContent = '👨‍🏫 Create Teacher Account';
  $('signupBtn').disabled = false;
  $('signupCourse').required = false;
});

// ===== THEME =====
const themeToggles = document.querySelectorAll('.theme-toggle');
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  themeToggles.forEach(b => b.textContent = theme === 'dark' ? '☀️' : '🌙');
  const glowColor = theme === 'dark' ? 'rgba(79, 70, 229, 0.12)' : 'rgba(79, 70, 229, 0.08)';
  document.documentElement.style.setProperty('--glow-color', glowColor);
}
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  setTheme(current === 'dark' ? 'light' : 'dark');
}
themeToggles.forEach(b => b.addEventListener('click', toggleTheme));
setTheme(localStorage.getItem('theme') || 'light');

// ===== PASSWORD TOGGLE =====
document.querySelectorAll('.toggle-pw').forEach(btn => {
  btn.addEventListener('click', function() {
    const input = document.getElementById(this.dataset.target);
    input.type = input.type === 'password' ? 'text' : 'password';
    this.textContent = input.type === 'password' ? '👁' : '🙈';
  });
});

// ===== NAVIGATION (auth pages) =====
$('showSignup')?.addEventListener('click', e => { e.preventDefault(); loginPage.style.display = 'none'; signupPage.style.display = 'flex'; });
$('showLogin')?.addEventListener('click', e => { e.preventDefault(); signupPage.style.display = 'none'; loginPage.style.display = 'flex'; });
$('backFromReset')?.addEventListener('click', e => { e.preventDefault(); forgotModal.style.display = 'none'; loginPage.style.display = 'flex'; });
$('closeForgot')?.addEventListener('click', () => forgotModal.style.display = 'none');
$('forgotLink')?.addEventListener('click', e => {
  e.preventDefault();
  const email = $('loginEmail').value;
  if (email) $('resetEmail').value = email;
  forgotModal.style.display = 'flex';
});
forgotModal?.addEventListener('click', e => { if (e.target === forgotModal) forgotModal.style.display = 'none'; });

// ===== TOAST NOTIFICATION =====
function showToast(message, type = 'info') {
  const existing = document.querySelector('.toast-container');
  if (existing) existing.remove();
  
  const container = document.createElement('div');
  container.className = `toast-container ${type}`;
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  
  container.innerHTML = `
    <span style="font-size:20px;">${icons[type] || 'ℹ️'}</span>
    <span style="font-size:14px;font-weight:500;">${message}</span>
  `;
  
  document.body.appendChild(container);
  
  setTimeout(() => {
    container.style.opacity = '0';
    container.style.transform = 'translateX(100px)';
    setTimeout(() => container.remove(), 300);
  }, 3000);
}

// ===== HELPERS =====
function getFirstName(fullName) {
  if (!fullName) return '';
  const trimmed = fullName.trim();
  if (!trimmed) return '';
  const parts = trimmed.split(/\s+/);
  const first = parts[0];
  return first.charAt(0).toUpperCase() + first.slice(1);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = String(str || '');
  return div.innerHTML;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning 🌅';
  if (hour < 17) return 'Good afternoon ☀️';
  return 'Good evening 🌙';
}

function getCourseEmoji(courseKey) {
  const emojis = {
    'computer-science': '🖥️',
    'data-science': '📊',
    'artificial-intelligence': '🤖',
    'cybersecurity': '🔒',
    'software-engineering': '⚡',
    'information-technology': '💻',
    'business-analytics': '📈',
    'digital-media': '🎨',
    'game-development': '🎮',
    'cloud-computing': '☁️'
  };
  return emojis[courseKey] || '📚';
}

function getDepartmentLabel(deptKey) {
  const labels = {
    'computer-science': 'Computer Science',
    'data-science': 'Data Science',
    'artificial-intelligence': 'Artificial Intelligence',
    'cybersecurity': 'Cybersecurity',
    'software-engineering': 'Software Engineering',
    'information-technology': 'Information Technology',
    'business-analytics': 'Business Analytics',
    'digital-media': 'Digital Media',
    'game-development': 'Game Development',
    'cloud-computing': 'Cloud Computing',
    'mathematics': 'Mathematics',
    'physics': 'Physics',
    'chemistry': 'Chemistry',
    'biology': 'Biology',
    'engineering': 'Engineering',
    'business': 'Business',
    'arts': 'Arts & Humanities'
  };
  return labels[deptKey] || deptKey;
}

// ===== AUTH STATE =====
let currentUser = null;
let chatUnsubscribe = null, typingUnsubscribe = null, presenceUnsubscribe = null;
let studentsUnsubscribe = null;
let userRole = 'student';
let userDepartment = 'computer-science';
let isLoggingIn = false;
let isInitialLoad = true;

// ==================================================================
// ============ LOCATION HELPERS (IMPROVED / FIXED) =================
// ==================================================================

// Smart getCurrentPosition with fallback chain — fixes timeout issues
function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported by this browser'));
      return;
    }
    
    // Try a single getCurrentPosition with given options
    const attempt = (highAccuracy, timeout, maximumAge) => {
      return new Promise((res, rej) => {
        navigator.geolocation.getCurrentPosition(res, rej, {
          enableHighAccuracy: highAccuracy,
          timeout,
          maximumAge
        });
      });
    };
    
    // Strategy: try GPS first, then fall back to network location
    attempt(true, 20000, 60000)  // 20s GPS, accept cache up to 60s old
      .catch(() => {
        console.warn('⚠️ High accuracy failed, trying network location...');
        return attempt(false, 15000, 300000);  // 15s WiFi/cell, cache up to 5 min
      })
      .then(resolve)
      .catch(err => {
        if (err.code === 1) reject(new Error('Location permission denied. Please allow location access in your browser settings.'));
        else if (err.code === 2) reject(new Error('Location unavailable. Move near a window or check that GPS is on.'));
        else if (err.code === 3) reject(new Error('Location request timed out. Try again in a moment.'));
        else reject(new Error('Could not get your location.'));
      });
  });
}

// Pre-check permission status for better UX
async function ensureLocationPermission() {
  if (!navigator.permissions) return true; // Browser doesn't support — assume ok
  
  try {
    const result = await navigator.permissions.query({ name: 'geolocation' });
    
    if (result.state === 'granted') return true;
    if (result.state === 'denied') {
      throw new Error('Location is blocked. Click the 🔒 icon in your address bar → Site settings → Allow Location.');
    }
    // 'prompt' state — will ask now, resolved by getCurrentPosition
    return true;
  } catch (e) {
    if (e.message && e.message.includes('blocked')) throw e;
    return true;
  }
}

function distanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = d => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2)**2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

// ==================================================================

// ===== SESSION TOKEN =====
async function generateSessionToken(sessionId, ts, salt) {
  const data = `${sessionId}:${ts}:${salt}`;
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(data));
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
}

// ===== DEVICE FINGERPRINT =====
async function getDeviceFingerprint() {
  let id = localStorage.getItem('deviceId');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('deviceId', id);
  }
  const canvas = document.createElement('canvas');
  canvas.width = 200; canvas.height = 40;
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillStyle = '#4f46e5';
  ctx.fillText('StudentHub-fp', 2, 2);
  const canvasHash = canvas.toDataURL().slice(-32);
  const combined = `${id}|${navigator.userAgent}|${screen.width}x${screen.height}|${canvasHash}`;
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(combined));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('').slice(0, 32);
}

// ===== LOAD DASHBOARD =====
async function loadDashboard(user) {
  currentUser = user;
  const email = user.email;
  
  let displayName = getFirstName(email.split('@')[0]);

  document.querySelector('.welcome-text').textContent = getGreeting() + ' 👋';

  let courseLabel = 'Computer Science';
  let courseKey = 'computer-science';
  let role = 'student';
  let department = '';
  let photoURL = '';
  
  try {
    const snap = await getDoc(doc(db, 'users', user.uid));
    if (snap.exists()) {
      const data = snap.data();
      role = data.role || 'student';
      courseKey = data.course || 'computer-science';
      courseLabel = data.courseLabel || 'Computer Science';
      department = data.department || 'Computer Science';
      userRole = role;
      userDepartment = department;
      photoURL = data.photoURL || '';
      
      if (data.name) {
        displayName = getFirstName(data.name);
      }
    }
  } catch(e) { 
    console.warn('User data load:', e); 
  }

  ['welcomeName', 'profileName', 'userName', 'fullName'].forEach(id => {
    const el = $(id);
    if (el) el.textContent = displayName;
  });
  ['profileEmail', 'fullEmail'].forEach(id => {
    const el = $(id);
    if (el) el.textContent = email;
  });

  const isTeacher = role === 'teacher';
  
  if (isTeacher) {
    if ($('userRoleDisplay')) $('userRoleDisplay').innerHTML = `👨‍🏫 Teacher <span class="teacher-role-badge">${department}</span>`;
    if ($('profileRoleValue')) $('profileRoleValue').textContent = '👨‍🏫 Teacher';
    if ($('profileRoleDisplay')) $('profileRoleDisplay').textContent = '👨‍🏫 Teacher';
    if ($('profileRoleBadge')) $('profileRoleBadge').style.display = 'inline-block';
    
    document.querySelectorAll('.teacher-only').forEach(el => el.style.display = 'flex');
    document.querySelectorAll('.student-only').forEach(el => el.style.display = 'none');
    
    $('welcomeBanner').className = 'welcome teacher-welcome';
    $('welcomeBanner').querySelector('h1').textContent = '👨‍🏫 Teacher Dashboard';
    $('dashboardSubtitle').textContent = `Manage your courses and students • ${department}`;
    
    $('courseCount').textContent = '3';
    $('courseCount').parentElement.querySelector('p').textContent = 'Teaching';
    $('completedCount').textContent = '45';
    $('completedCount').parentElement.querySelector('p').textContent = 'Students';
    $('pendingCount').textContent = '2';
    $('pendingCount').parentElement.querySelector('p').textContent = "Today's Classes";
    
    $('profileCourseDisplay').textContent = department;
    
  } else {
    if ($('userRoleDisplay')) $('userRoleDisplay').innerHTML = `🎯 Student <span class="course-badge" id="courseBadge">${courseLabel}</span>`;
    if ($('profileRoleValue')) $('profileRoleValue').textContent = 'Student';
    if ($('profileRoleDisplay')) $('profileRoleDisplay').textContent = 'Student';
    if ($('profileRoleBadge')) $('profileRoleBadge').style.display = 'none';
    
    document.querySelectorAll('.teacher-only').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.student-only').forEach(el => el.style.display = 'flex');
    
    $('welcomeBanner').className = 'welcome';
    $('welcomeBanner').querySelector('h1').textContent = '📊 Your Dashboard';
    $('dashboardSubtitle').textContent = "Here's your academic overview";
    
    $('courseCount').textContent = '6';
    $('courseCount').parentElement.querySelector('p').textContent = 'Enrolled';
    $('completedCount').textContent = '4';
    $('completedCount').parentElement.querySelector('p').textContent = 'Completed';
    $('pendingCount').textContent = '2';
    $('pendingCount').parentElement.querySelector('p').textContent = 'Pending';
    
    $('profileCourseDisplay').textContent = courseLabel;
  }

  const courseEmoji = getCourseEmoji(courseKey);
  const courseDisplay = `${courseEmoji} ${courseLabel}`;
  
  const courseBadge = $('courseBadge');
  if (courseBadge) courseBadge.textContent = courseLabel;
  
  const profileCourseBadge = $('profileCourseBadge');
  if (profileCourseBadge) profileCourseBadge.textContent = isTeacher ? `👨‍🏫 ${department}` : courseDisplay;

  // Avatar
  const avatarSrc = photoURL || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Ccircle cx='100' cy='100' r='100' fill='%234f46e5'/%3E%3Ctext x='50%25' y='55%25' font-size='80' fill='white' font-family='Arial' text-anchor='middle' dominant-baseline='central'%3E${displayName.charAt(0)}%3C/text%3E%3C/svg%3E`;
  ['miniAvatar', 'profileAvatar', 'profileUploadPreview'].forEach(id => {
    const el = $(id);
    if (el) el.src = avatarSrc;
  });

  if (user.metadata?.creationTime) {
    const d = new Date(user.metadata.creationTime);
    $('joinedDate').textContent = d.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  }

  loginPage.style.display = 'none';
  signupPage.style.display = 'none';
  dashboardPage.style.display = 'block';

  setupPresence(user);
  setupChatListener();
  setupTypingListener(user);

  if (isTeacher) {
    loadTeacherStudents(department);
  } else {
    watchActiveSessions(courseKey);
  }
  
  setInterval(() => {
    document.querySelector('.welcome-text').textContent = getGreeting() + ' 👋';
  }, 60000);
}

// ===== TEACHER STUDENTS =====
function loadTeacherStudents(department) {
  if (studentsUnsubscribe) { studentsUnsubscribe(); studentsUnsubscribe = null; }
  const studentsList = $('studentsList');
  const totalCount = $('totalStudentsCount');
  if (!studentsList) return;

  const q = query(
    collection(db, 'users'),
    where('role', '==', 'student'),
    where('course', '==', department)
  );

  studentsUnsubscribe = onSnapshot(q, async (snap) => {
    if (snap.empty) {
      studentsList.innerHTML = `
        <div class="students-empty" style="grid-column:1/-1;">
          <span class="empty-icon">👥</span>
          No students enrolled in <strong>${getDepartmentLabel(department)}</strong> yet
        </div>
      `;
      if (totalCount) totalCount.textContent = '0';
      return;
    }

    const presenceSnap = await new Promise(resolve => {
      onValue(dbRef(rtdb, 'presence'), resolve, { onlyOnce: true });
    });
    const presenceData = presenceSnap.val() || {};

    let html = '';
    let count = 0;

    snap.forEach(docSnap => {
      const student = docSnap.data();
      const uid = docSnap.id;
      const rawName = student.name || (student.email ? student.email.split('@')[0] : 'Student');
      const name = getFirstName(rawName);
      const email = student.email || '';
      const isOnline = presenceData[uid] && presenceData[uid].online === true;

      const avatarContent = student.photoURL 
        ? `<img src="${student.photoURL}" alt="${escapeHtml(name)}">` 
        : escapeHtml(name.charAt(0).toUpperCase());

      html += `
        <div class="student-row-card" data-uid="${uid}">
          <div class="stu-avatar">${avatarContent}</div>
          <div class="stu-info">
            <div class="stu-name">${escapeHtml(name)}</div>
            <div class="stu-email">${escapeHtml(email)}</div>
          </div>
          <div class="stu-status ${isOnline ? 'online' : ''}" title="${isOnline ? 'Online' : 'Offline'}"></div>
        </div>
      `;
      count++;
    });

    studentsList.innerHTML = html;
    if (totalCount) totalCount.textContent = String(count);
  }, (err) => {
    console.error('Students listener error:', err);
    studentsList.innerHTML = `<p style="color:#dc2626;text-align:center;padding:20px;">⚠️ Error loading students</p>`;
  });
}

// ===== AUTH STATE OBSERVER =====
onAuthStateChanged(auth, async user => {
  loadingScreen.style.opacity = '0';
  setTimeout(() => loadingScreen.style.display = 'none', 400);
  
  if (user) {
    console.log("✅ User is signed in:", user.email);
    
    if (!isLoggingIn && (loginPage.style.display !== 'none' || dashboardPage.style.display === 'none')) {
      await loadDashboard(user);
      
      if (isInitialLoad) {
        const snap = await getDoc(doc(db, 'users', user.uid));
        const name = snap.exists() && snap.data().name ? getFirstName(snap.data().name) : user.email.split('@')[0];
        showToast('👋 Welcome back, ' + name + '!', 'success');
        isInitialLoad = false;
      }
    }
  } else {
    console.log("❌ User is signed out");
    
    if (!isLoggingIn) {
      loginPage.style.display = 'flex';
      signupPage.style.display = 'none';
      dashboardPage.style.display = 'none';
      
      if (chatUnsubscribe) { chatUnsubscribe(); chatUnsubscribe = null; }
      if (typingUnsubscribe) { typingUnsubscribe(); typingUnsubscribe = null; }
      if (presenceUnsubscribe) { presenceUnsubscribe(); presenceUnsubscribe = null; }
      if (studentsUnsubscribe) { studentsUnsubscribe(); studentsUnsubscribe = null; }
      if (teacherSessionUnsub) { teacherSessionUnsub(); teacherSessionUnsub = null; }
      if (checkinUnsub) { checkinUnsub(); checkinUnsub = null; }
      if (studentSessionsUnsub) { studentSessionsUnsub(); studentSessionsUnsub = null; }
      stopScanner();
      stopRotatingQR();
      
      if (currentUser) {
        set(dbRef(rtdb, 'presence/' + currentUser.uid), null);
      }
      
      isInitialLoad = true;
    }
  }
});

// ===== LOGIN =====
$('loginForm').addEventListener('submit', async e => {
  e.preventDefault();

  const email = $('loginEmail').value.trim();
  const password = $('loginPassword').value;
  const error = $('loginError');
  const success = $('loginSuccess');
  const btn = $('loginBtn');

  error.style.display = 'none';
  success.style.display = 'none';

  if (!email || !password) {
    error.textContent = 'Please fill in all fields.';
    error.style.display = 'block';
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '⏳ Signing in...';
  isLoggingIn = true;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.exists() ? userDoc.data() : {};
    const role = userData.role || 'student';

    if (selectedRole === 'teacher' && role !== 'teacher') {
      await signOut(auth);
      error.textContent = '❌ This account is not a teacher account. Please switch to Student mode.';
      error.style.display = 'block';
      btn.disabled = false;
      btn.innerHTML = selectedRole === 'teacher' ? '👨‍🏫 Sign In as Teacher' : 'Sign In';
      isLoggingIn = false;
      return;
    }

    if (selectedRole === 'student' && role === 'teacher') {
      await signOut(auth);
      error.textContent = '❌ This is a teacher account. Please switch to Teacher mode.';
      error.style.display = 'block';
      btn.disabled = false;
      btn.innerHTML = selectedRole === 'teacher' ? '👨‍🏫 Sign In as Teacher' : 'Sign In';
      isLoggingIn = false;
      return;
    }

    await loadDashboard(user);
    isLoggingIn = false;
    
    const name = userData.name ? getFirstName(userData.name) : email.split('@')[0];
    showToast('✅ Welcome back, ' + name + '!', 'success');

  } catch (err) {
    console.error('Firebase login error:', err);
    let msg = 'Unable to sign in.';
    switch (err.code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        msg = 'Invalid email or password.';
        break;
      case 'auth/invalid-email':
        msg = 'Invalid email format.';
        break;
      case 'auth/too-many-requests':
        msg = 'Too many login attempts. Please try again later.';
        break;
      case 'auth/user-disabled':
        msg = 'This account has been disabled.';
        break;
      case 'auth/network-request-failed':
        msg = 'Network error. Check your internet connection and try again.';
        break;
      default:
        msg = err.message || msg;
    }

    error.textContent = '❌ ' + msg;
    error.style.display = 'block';
    loginPage.style.display = 'flex';
    signupPage.style.display = 'none';
    dashboardPage.style.display = 'none';
    isLoggingIn = false;
  } finally {
    btn.disabled = false;
    btn.innerHTML = selectedRole === 'teacher' ? '👨‍🏫 Sign In as Teacher' : 'Sign In';
  }
});

// ===== SIGNUP =====
$('signupForm').addEventListener('submit', async e => {
  e.preventDefault();
  const name = $('signupName').value.trim();
  const email = $('signupEmail').value.trim();
  const password = $('signupPassword').value.trim();
  const confirm = $('signupConfirm').value.trim();
  const course = $('signupCourse').value;
  const courseLabel = $('signupCourse').selectedOptions[0]?.text || 'Computer Science';
  const department = $('signupDepartment')?.value || 'Computer Science';
  const role = selectedRole;
  
  const error = $('signupError');
  const success = $('signupSuccess');
  error.style.display = 'none';
  success.style.display = 'none';
  
  if (!name || !email || !password || !confirm) {
    error.textContent = 'Please fill in all fields.';
    error.style.display = 'block';
    return;
  }
  
  if (role === 'student' && !course) {
    error.textContent = 'Please select your course.';
    error.style.display = 'block';
    return;
  }
  
  if (password.length < 6) {
    error.textContent = 'Password must be at least 6 characters.';
    error.style.display = 'block';
    return;
  }
  
  if (password !== confirm) {
    error.textContent = 'Passwords do not match.';
    error.style.display = 'block';
    return;
  }
  
  const btn = $('signupBtn');
  btn.disabled = true;
  btn.innerHTML = '⏳ Creating...';
  
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    
    const userData = {
      name,
      email,
      role: role,
      photoURL: '',
      createdAt: new Date().toISOString()
    };
    
    if (role === 'student') {
      userData.course = course;
      userData.courseLabel = courseLabel;
      userData.enrolledCourses = [course];
    } else {
      userData.department = department;
      userData.courses = [];
    }
    
    await setDoc(doc(db, 'users', cred.user.uid), userData);
    
    const roleMessage = role === 'teacher' ? 'Teacher' : 'Student';
    success.textContent = `✅ ${roleMessage} account created! Please sign in.`;
    success.style.display = 'block';
    
    $('signupForm').reset();
    await signOut(auth);
    
    setTimeout(() => {
      signupPage.style.display = 'none';
      loginPage.style.display = 'flex';
      $('loginEmail').value = email;
      
      if (role === 'teacher') $('loginTeacherBtn').click();
      else $('loginStudentBtn').click();
    }, 1500);
    
  } catch (err) {
    console.error('Signup error:', err);
    let msg = 'Something went wrong.';
    if (err.code === 'auth/email-already-in-use') msg = 'Email already registered. Please sign in.';
    else if (err.code === 'auth/weak-password') msg = 'Password too weak.';
    error.textContent = '❌ ' + msg;
    error.style.display = 'block';
  }
  
  btn.disabled = false;
  btn.innerHTML = role === 'teacher' ? '👨‍🏫 Create Teacher Account' : 'Create Account';
});

// ===== RESET PASSWORD =====
$('resetForm').addEventListener('submit', async e => {
  e.preventDefault();
  const email = $('resetEmail').value.trim();
  const error = $('resetError');
  const success = $('resetSuccess');
  
  error.style.display = 'none';
  success.style.display = 'none';
  
  if (!email) { 
    error.textContent = 'Please enter your email.'; 
    error.style.display = 'block'; 
    return; 
  }
  
  const btn = $('resetBtn');
  btn.disabled = true;
  btn.innerHTML = '⏳ Sending...';
  
  try {
    await sendPasswordResetEmail(auth, email);
    success.textContent = `✅ Reset link sent to ${email}! Check your inbox.`;
    success.style.display = 'block';
    setTimeout(() => { forgotModal.style.display = 'none'; }, 3000);
  } catch (err) {
    let msg = 'Failed to send. Try again.';
    if (err.code === 'auth/user-not-found') msg = 'No account found with this email.';
    error.textContent = '❌ ' + msg;
    error.style.display = 'block';
  }
  
  btn.disabled = false;
  btn.innerHTML = 'Send Reset Link';
});

// ===== PASSWORD RESET CONFIRMATION =====
(async function handleResetConfirm() {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get('mode');
  const code = params.get('oobCode');
  
  if (mode === 'resetPassword' && code) {
    loginPage.style.display = 'none';
    signupPage.style.display = 'none';
    dashboardPage.style.display = 'none';
    
    const container = document.createElement('div');
    container.id = 'resetContainer';
    container.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px;">
        <div class="auth-card" style="max-width:380px;">
          <div class="logo-wrap"><h1>🔑 New Password</h1><p>Enter your new password</p></div>
          <div class="error-msg" id="newPwError"></div>
          <div class="success-msg" id="newPwSuccess"></div>
          <form id="newPwForm">
            <div class="form-group">
              <label>New Password</label>
              <div class="password-wrapper">
                <input type="password" id="newPw" placeholder="Min 6 characters" required>
                <button type="button" class="toggle-pw" data-target="newPw">👁</button>
              </div>
            </div>
            <div class="form-group">
              <label>Confirm Password</label>
              <input type="password" id="newPwConfirm" placeholder="Confirm" required>
            </div>
            <button type="submit" class="btn btn-primary" id="newPwBtn" style="width:100%;justify-content:center;">Reset Password</button>
          </form>
        </div>
      </div>
    `;
    document.body.prepend(container);
    
    document.getElementById('newPwForm').addEventListener('submit', async e => {
      e.preventDefault();
      const pw = document.getElementById('newPw').value;
      const confirm = document.getElementById('newPwConfirm').value;
      const error = document.getElementById('newPwError');
      const success = document.getElementById('newPwSuccess');
      
      error.style.display = 'none';
      success.style.display = 'none';
      
      if (pw.length < 6) {
        error.textContent = 'Password must be at least 6 characters.';
        error.style.display = 'block';
        return;
      }
      
      if (pw !== confirm) {
        error.textContent = 'Passwords do not match.';
        error.style.display = 'block';
        return;
      }
      
      const btn = document.getElementById('newPwBtn');
      btn.disabled = true;
      btn.innerHTML = '⏳ Resetting...';
      
      try {
        await confirmPasswordReset(auth, code, pw);
        success.textContent = '✅ Password reset successful!';
        success.style.display = 'block';
        setTimeout(() => {
          container.remove();
          loginPage.style.display = 'flex';
          window.history.replaceState({}, '', window.location.pathname);
        }, 1500);
      } catch (err) {
        error.textContent = '❌ Invalid or expired link. Please request a new one.';
        error.style.display = 'block';
      }
      
      btn.disabled = false;
      btn.innerHTML = 'Reset Password';
    });
  }
})();

// ===== PROFILE PICTURE UPLOAD =====
$('profilePicInput')?.addEventListener('change', async function() {
  const file = this.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    $('uploadStatus').textContent = '❌ Please select an image.';
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    $('uploadStatus').textContent = '❌ Max 5MB.';
    return;
  }
  const user = auth.currentUser;
  if (!user) return;
  
  $('uploadStatus').textContent = '⏳ Uploading...';
  try {
    const storageRef = ref(storage, `profilePictures/${user.uid}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    await updateDoc(doc(db, 'users', user.uid), { photoURL: url });
    
    ['miniAvatar', 'profileAvatar', 'profileUploadPreview'].forEach(id => {
      const el = $(id);
      if (el) el.src = url;
    });
    
    $('uploadStatus').textContent = '✅ Photo updated!';
    showToast('✅ Profile photo updated!', 'success');
  } catch(e) {
    $('uploadStatus').textContent = '❌ Upload failed.';
    showToast('❌ Upload failed. Please try again.', 'error');
  }
});

// ===== PRESENCE =====
function setupPresence(user) {
  const presenceRef = dbRef(rtdb, 'presence/' + user.uid);
  set(presenceRef, { online: true, name: user.email.split('@')[0], lastSeen: rtdbServerTimestamp() });
  onDisconnect(presenceRef).set({ online: false, name: user.email.split('@')[0], lastSeen: rtdbServerTimestamp() });
  
  if (presenceUnsubscribe) presenceUnsubscribe();
  presenceUnsubscribe = onValue(dbRef(rtdb, 'presence'), snap => {
    const data = snap.val();
    let count = 0;
    if (data) {
      Object.values(data).forEach(p => { 
        if (p && p.online === true) count++; 
      });
    }
    const el = $('onlineCount');
    if (el) el.textContent = `🟢 ${count} online`;
  });
}

// ===== TYPING =====
let typingTimeout = null;

function setupTypingListener(user) {
  if (typingUnsubscribe) typingUnsubscribe();
  
  typingUnsubscribe = onSnapshot(
    query(collection(db, 'typing'), where('uid', '!=', user.uid)),
    snap => {
      const typingUsers = [];
      const now = Date.now();
      
      snap.forEach(doc => {
        const d = doc.data();
        if (d.typing && d.timestamp) {
          const ts = d.timestamp.toMillis ? d.timestamp.toMillis() : d.timestamp;
          if (now - ts < 5000) typingUsers.push(d.name || 'Someone');
        }
      });
      
      const indicator = $('typingIndicator');
      if (!indicator) return;
      if (typingUsers.length > 0) {
        const nameSpan = $('typingName');
        const names = typingUsers.slice(0, 2).join(', ');
        const suffix = typingUsers.length > 2 ? ` and ${typingUsers.length - 2} others` : '';
        nameSpan.textContent = names + suffix;
        indicator.style.display = 'flex';
      } else {
        indicator.style.display = 'none';
      }
    }
  );
}

async function setTyping(typing) {
  if (!auth.currentUser) return;
  const typingRef = doc(db, 'typing', auth.currentUser.uid);
  
  if (typing) {
    const snap = await getDoc(doc(db, 'users', auth.currentUser.uid));
    const rawName = snap.exists() && snap.data().name ? snap.data().name : auth.currentUser.email.split('@')[0];
    const name = getFirstName(rawName);
    await setDoc(typingRef, {
      uid: auth.currentUser.uid,
      name: name,
      typing: true,
      timestamp: serverTimestamp()
    });
  } else {
    await deleteDoc(typingRef).catch(() => {});
  }
}

$('chatInput')?.addEventListener('input', () => {
  if (!auth.currentUser) return;
  if (typingTimeout) clearTimeout(typingTimeout);
  setTyping(true);
  typingTimeout = setTimeout(() => {
    setTyping(false);
    typingTimeout = null;
  }, 2000);
});

$('chatInput')?.addEventListener('blur', () => {
  if (typingTimeout) {
    clearTimeout(typingTimeout);
    typingTimeout = null;
  }
  setTyping(false);
});

// ===== CHAT =====
function setupChatListener() {
  if (chatUnsubscribe) chatUnsubscribe();
  
  chatUnsubscribe = onSnapshot(
    query(collection(db, 'messages'), orderBy('timestamp', 'asc'), limit(200)),
    snap => {
      const container = $('chatMessages');
      if (!container) return;
      
      if (snap.empty) {
        container.innerHTML = '<div class="empty">💬 No messages yet. Say hello!</div>';
        return;
      }
      
      let html = '';
      snap.forEach(doc => {
        const d = doc.data();
        const isSelf = d.senderId === auth.currentUser?.uid;
        const initial = (d.senderName || '?').charAt(0).toUpperCase();
        const time = d.timestamp?.toDate?.() || new Date();
        const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const colors = ['#4f46e5','#7c3aed','#ec4899','#f59e0b','#10b981','#3b82f6'];
        const color = colors[(d.senderName || '').length % colors.length];
        
        html += `
          <div class="chat-msg ${isSelf ? 'self' : ''}">
            <div class="avatar" style="background:${color}">${escapeHtml(initial)}</div>
            <div class="bubble">
              <div class="name">${escapeHtml(d.senderName || 'Anonymous')}</div>
              <div class="text">${escapeHtml(d.text || '')}</div>
              <span class="time">${timeStr}</span>
            </div>
          </div>
        `;
      });
      
      container.innerHTML = html;
      container.scrollTop = container.scrollHeight;
    },
    err => {
      console.error('Chat error:', err);
      $('chatMessages').innerHTML = '<div class="empty" style="color:#dc2626;">⚠️ Error loading chat</div>';
    }
  );
}

async function sendMessage() {
  const input = $('chatInput');
  const text = input.value.trim();
  if (!text || !auth.currentUser) return;
  
  const btn = $('sendBtn');
  btn.disabled = true;
  input.disabled = true;
  
  if (typingTimeout) { clearTimeout(typingTimeout); typingTimeout = null; }
  await setTyping(false);
  
  try {
    const snap = await getDoc(doc(db, 'users', auth.currentUser.uid));
    const rawName = snap.exists() && snap.data().name ? snap.data().name : auth.currentUser.email.split('@')[0];
    const name = getFirstName(rawName);
    await addDoc(collection(db, 'messages'), {
      text,
      senderId: auth.currentUser.uid,
      senderName: name,
      timestamp: serverTimestamp()
    });
    input.value = '';
    input.focus();
  } catch(e) {
    console.error('Send error:', e);
  }
  
  btn.disabled = false;
  input.disabled = false;
}

$('sendBtn')?.addEventListener('click', sendMessage);
$('chatInput')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') sendMessage();
});

// ===== REMEMBER ME =====
const savedEmail = localStorage.getItem('rememberedEmail');
if (savedEmail) {
  $('loginEmail').value = savedEmail;
  $('rememberMe').checked = true;
}

$('loginForm')?.addEventListener('submit', () => {
  if ($('rememberMe').checked) {
    localStorage.setItem('rememberedEmail', $('loginEmail').value.trim());
  } else {
    localStorage.removeItem('rememberedEmail');
  }
});

// ===== NAVIGATION =====
document.querySelectorAll('.nav-item:not(.logout-btn)').forEach(item => {
  item.addEventListener('click', function() {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    this.classList.add('active');
    const view = this.dataset.view;
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const target = document.getElementById(`view-${view}`);
    if (target) {
      target.classList.add('active');
      if (view === 'chat') {
        setTimeout(() => {
          const container = $('chatMessages');
          if (container) container.scrollTop = container.scrollHeight;
        }, 100);
      }
      if (view === 'checkin') {
        updateGeoBadge();
      }
    }
  });
});

// ==================================================================
// ==================== QR ATTENDANCE SYSTEM ========================
// ==================================================================

let teacherSessionUnsub = null;
let checkinUnsub = null;
let studentSessionsUnsub = null;
let qrRotationInterval = null;
let qrTimerInterval = null;
let activeSessionId = null;
let activeSessionSalt = null;
let qrCountdownStart = 0;

// ---------- TEACHER: START SESSION (IMPROVED) ----------
$('startAttendanceBtn')?.addEventListener('click', async function() {
  const course = $('teacherCourseSelect').value;
  if (!course) {
    showToast('Please select a course first.', 'error');
    return;
  }
  
  const btn = this;
  btn.disabled = true;
  btn.innerHTML = '⏳ Requesting location...';
  
  const geoBadge = $('teacherGeoBadge');
  if (geoBadge) {
    geoBadge.className = 'geo-badge';
    geoBadge.textContent = '📍 Waiting for GPS signal...';
  }
  
  try {
    // Pre-check permission for clearer error messaging
    await ensureLocationPermission();
    
    const pos = await getCurrentPosition();
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    const accuracy = Math.round(pos.coords.accuracy);
    
    if (geoBadge) {
      geoBadge.className = 'geo-badge ok';
      geoBadge.textContent = `📍 Location locked (±${accuracy}m)`;
    }
    
    btn.innerHTML = '⏳ Creating session...';
    
    const sessionId = crypto.randomUUID();
    const salt = crypto.randomUUID().slice(0, 16);
    const expiresAt = Date.now() + 30 * 60 * 1000; // 30 min
    
    // Radius adapts to GPS accuracy (indoors accuracy can be ±50m)
    const radius = Math.max(40, accuracy + 25);
    
    await setDoc(doc(db, 'attendanceSessions', sessionId), {
      courseId: course,
      teacherId: auth.currentUser.uid,
      teacherName: $('userName')?.textContent || 'Teacher',
      startedAt: serverTimestamp(),
      createdAt: Date.now(),
      expiresAt,
      active: true,
      location: { lat, lng },
      accuracyMeters: accuracy,
      radiusMeters: radius,
      salt
    });
    
    activeSessionId = sessionId;
    activeSessionSalt = salt;
    
    $('attendanceSession').style.display = 'block';
    $('checkInCount').textContent = '0';
    $('liveCheckIns').innerHTML = '<p style="color:var(--text-muted);font-size:13px;">⏳ Waiting for students to check in...</p>';
    $('sessionStatus').textContent = 'Live';
    $('sessionStatus').className = 'session-status live';
    
    btn.innerHTML = '🔄 Session Active';
    
    startRotatingQR(sessionId, salt);
    listenToCheckins(sessionId);
    
    setTimeout(() => {
      if (activeSessionId === sessionId) stopAttendanceSession();
    }, 30 * 60 * 1000);
    
    showToast(`✅ Session started! GPS ±${accuracy}m, radius ${radius}m.`, 'success');
    
  } catch (err) {
    console.error('Start attendance error:', err);
    const msg = err.message || 'Failed to start session.';
    
    if (geoBadge) {
      geoBadge.className = 'geo-badge bad';
      geoBadge.textContent = '📍 ' + msg;
    }
    
    showToast('❌ ' + msg, 'error');
    btn.disabled = false;
    btn.innerHTML = '▶️ Start Attendance Session';
  }
});

// Ensure QRCode library is loaded with fallback
async function ensureQRCodeLoaded() {
  if (window.QRCode && typeof window.QRCode.toCanvas === 'function') return;
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcode/1.5.1/qrcode.min.js';
    s.onload = () => resolve();
    s.onerror = () => {
      const s2 = document.createElement('script');
      s2.src = 'https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js';
      s2.onload = () => resolve();
      s2.onerror = reject;
      document.head.appendChild(s2);
    };
    document.head.appendChild(s);
  });
}

// ---------- TEACHER: ROTATING QR ----------
async function startRotatingQR(sessionId, salt) {
  stopRotatingQR();
  await ensureQRCodeLoaded().catch(e => console.error('Failed to load QRCode:', e));
  
  const rotate = async () => {
    if (activeSessionId !== sessionId) return;
    
    const ts = Math.floor(Date.now() / 1000);
    const token = await generateSessionToken(sessionId, ts, salt);
    
    const payload = JSON.stringify({
      s: sessionId,
      t: token,
      x: ts
    });
    
    const holder = $('qrCodePlaceholder');
    holder.innerHTML = '';
    
    try {
      if (!window.QRCode) await ensureQRCodeLoaded();
      const canvas = document.createElement('canvas');
      await QRCode.toCanvas(canvas, payload, {
        width: 220,
        margin: 1,
        errorCorrectionLevel: 'M',
        color: { dark: '#1a1a2e', light: '#ffffff' }
      });
      holder.appendChild(canvas);
    } catch(e) {
      holder.textContent = '❌ QR error';
      console.error('QR gen:', e);
    }
    
    qrCountdownStart = Date.now();
    updateQrCountdown();
  };
  
  await rotate();
  qrRotationInterval = setInterval(rotate, 8000);
  qrTimerInterval = setInterval(updateQrCountdown, 100);
}

function updateQrCountdown() {
  const elapsed = Date.now() - qrCountdownStart;
  const total = 8000;
  const remaining = Math.max(0, total - elapsed);
  const pct = (remaining / total) * 100;
  
  const bar = $('qrTimerBar')?.querySelector('.fill');
  if (bar) bar.style.width = pct + '%';
  
  const timerText = $('qrTimer');
  if (timerText) {
    const secs = (remaining / 1000).toFixed(1);
    timerText.textContent = `⏳ Refreshes in ${secs}s`;
  }
}

function stopRotatingQR() {
  if (qrRotationInterval) { clearInterval(qrRotationInterval); qrRotationInterval = null; }
  if (qrTimerInterval) { clearInterval(qrTimerInterval); qrTimerInterval = null; }
}

// ---------- TEACHER: LISTEN TO CHECK-INS ----------
function listenToCheckins(sessionId) {
  if (checkinUnsub) checkinUnsub();
  
  checkinUnsub = onSnapshot(
    collection(db, 'attendanceSessions', sessionId, 'checkins'),
    snap => {
      const count = snap.size;
      $('checkInCount').textContent = String(count);
      
      if (snap.empty) {
        $('liveCheckIns').innerHTML = '<p style="color:var(--text-muted);font-size:13px;">⏳ Waiting for students...</p>';
        return;
      }
      
      let html = '';
      snap.forEach(d => {
        const data = d.data();
        const initial = (data.name || '?').charAt(0).toUpperCase();
        const timeStr = data.at?.toDate
          ? data.at.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : 'now';
        const dist = data.distanceFromClass != null ? `${data.distanceFromClass}m` : '—';
        
        html += `
          <div class="student-row-card" style="padding:10px 14px;margin-bottom:6px;">
            <div class="stu-avatar" style="width:36px;height:36px;font-size:14px;">${escapeHtml(initial)}</div>
            <div class="stu-info">
              <div class="stu-name">${escapeHtml(data.name || 'Student')}</div>
              <div class="stu-email">✅ ${timeStr} • ${dist} from class</div>
            </div>
          </div>
        `;
      });
      
      $('liveCheckIns').innerHTML = html;
    },
    err => {
      console.error('Check-ins listener:', err);
    }
  );
}

// ---------- TEACHER: STOP SESSION ----------
$('stopAttendanceBtn')?.addEventListener('click', function() {
  if (!confirm('End this attendance session? Students will no longer be able to check in.')) return;
  stopAttendanceSession();
});

async function stopAttendanceSession() {
  if (activeSessionId) {
    try {
      await updateDoc(doc(db, 'attendanceSessions', activeSessionId), { active: false });
    } catch(e) { console.warn('Session update:', e); }
  }
  
  stopRotatingQR();
  if (checkinUnsub) { checkinUnsub(); checkinUnsub = null; }
  
  activeSessionId = null;
  activeSessionSalt = null;
  
  $('attendanceSession').style.display = 'none';
  $('startAttendanceBtn').innerHTML = '▶️ Start Attendance Session';
  $('startAttendanceBtn').disabled = false;
  $('qrCodePlaceholder').innerHTML = '⏳';
  
  showToast('⏹️ Attendance session ended.', 'info');
}

// ---------- STUDENT: WATCH ACTIVE SESSIONS ----------
function watchActiveSessions(courseKey) {
  if (studentSessionsUnsub) studentSessionsUnsub();
  
  const q = query(
    collection(db, 'attendanceSessions'),
    where('courseId', '==', courseKey),
    where('active', '==', true)
  );
  
  studentSessionsUnsub = onSnapshot(q, snap => {
    const checkinNavBtn = document.querySelector('.nav-item.student-only[data-view="checkin"]');
    if (!checkinNavBtn) return;
    
    let hasActive = false;
    snap.forEach(d => {
      const s = d.data();
      if (s.expiresAt > Date.now()) hasActive = true;
    });
    
    if (hasActive) {
      checkinNavBtn.innerHTML = '<span class="icon">📷</span><span class="label">Check In <span style="display:inline-block;width:8px;height:8px;background:#22c55e;border-radius:50%;margin-left:4px;animation:pulse-dot 1.5s infinite;"></span></span>';
    } else {
      checkinNavBtn.innerHTML = '<span class="icon">📷</span><span class="label">Check In</span>';
    }
  });
}

// ---------- STUDENT: GEO BADGE (IMPROVED) ----------
async function updateGeoBadge() {
  const badge = $('geoBadge');
  if (!badge) return;
  badge.className = 'geo-badge';
  badge.textContent = '📍 Location: checking...';
  
  try {
    const pos = await getCurrentPosition();
    badge.className = 'geo-badge ok';
    badge.textContent = `📍 Location ready (±${pos.coords.accuracy.toFixed(0)}m accuracy)`;
  } catch (err) {
    badge.className = 'geo-badge bad';
    badge.textContent = '📍 ' + (err.message || 'Location unavailable');
  }
}

// ---------- STUDENT: CAMERA SCANNER ----------
let scannerStream = null;
let scanRafId = null;
let jsQRLoaded = false;
let scanCanvas = null;
let scanCtx = null;

async function loadJsQR() {
  if (jsQRLoaded || window.jsQR) { jsQRLoaded = true; return; }
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js';
    s.onload = () => { jsQRLoaded = true; resolve(); };
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

let currentFacingMode = 'environment';

$('startScannerBtn')?.addEventListener('click', () => startScanner());
$('stopScannerBtn')?.addEventListener('click', stopScanner);
$('flipCameraBtn')?.addEventListener('click', async () => {
  currentFacingMode = currentFacingMode === 'environment' ? 'user' : 'environment';
  if (scannerStream) {
    scannerStream.getTracks().forEach(t => t.stop());
    scannerStream = null;
  }
  if (scanRafId) {
    cancelAnimationFrame(scanRafId);
    scanRafId = null;
  }
  await startScanner();
});

async function startScanner() {
  $('checkinIdle').style.display = 'none';
  $('checkinScanner').style.display = 'block';
  
  try {
    await loadJsQR();
    
    try {
      scannerStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: currentFacingMode } }
      });
    } catch (camErr) {
      // Fallback to any available video camera
      scannerStream = await navigator.mediaDevices.getUserMedia({ video: true });
    }
    
    const video = $('scannerVideo');
    video.srcObject = scannerStream;
    await video.play();
    
    // Reusable offscreen canvas with willReadFrequently to prevent 60 FPS memory thrashing & battery drain
    if (!scanCanvas) {
      scanCanvas = document.createElement('canvas');
      scanCtx = scanCanvas.getContext('2d', { willReadFrequently: true });
    }

    const scanLoop = () => {
      if (!scannerStream) return;
      if (video.readyState === video.HAVE_ENOUGH_DATA && video.videoWidth > 0 && video.videoHeight > 0) {
        if (scanCanvas.width !== video.videoWidth || scanCanvas.height !== video.videoHeight) {
          scanCanvas.width = video.videoWidth;
          scanCanvas.height = video.videoHeight;
        }
        scanCtx.drawImage(video, 0, 0, scanCanvas.width, scanCanvas.height);
        const imageData = scanCtx.getImageData(0, 0, scanCanvas.width, scanCanvas.height);
        
        if (window.jsQR) {
          const code = window.jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert'
          });
          if (code && code.data) {
            handleScannedData(code.data);
            return;
          }
        }
      }
      scanRafId = requestAnimationFrame(scanLoop);
    };
    scanLoop();
    
    setCheckinStatus('Point your camera at the teacher\'s QR code', 'info');
  } catch (err) {
    console.error('Camera error:', err);
    setCheckinStatus('❌ Camera access denied or unavailable. Check camera permissions and try again.', 'error');
    stopScanner();
    $('checkinIdle').style.display = 'block';
  }
}

function stopScanner() {
  if (scanRafId) { cancelAnimationFrame(scanRafId); scanRafId = null; }
  if (scannerStream) {
    scannerStream.getTracks().forEach(t => t.stop());
    scannerStream = null;
  }
  const video = $('scannerVideo');
  if (video) video.srcObject = null;
  const scanner = $('checkinScanner');
  const idle = $('checkinIdle');
  if (scanner) scanner.style.display = 'none';
  if (idle) idle.style.display = 'block';
}

// ---------- STUDENT: HANDLE SCANNED DATA ----------
async function handleScannedData(raw) {
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch(e) {
    setCheckinStatus('❌ Invalid QR. Make sure you scanned the teacher\'s code.', 'error');
    return;
  }
  
  const { s: sessionId, t: token, x: ts } = payload;
  if (!sessionId || !token || !ts) {
    setCheckinStatus('❌ Malformed QR code.', 'error');
    return;
  }
  
  stopScanner();
  await verifyAndCheckIn(sessionId, token, ts);
}

// ---------- CORE: VERIFY & CHECK-IN (IMPROVED) ----------
async function verifyAndCheckIn(sessionId, token, ts) {
  setCheckinStatus('🔍 Verifying...', 'info');
  
  try {
    // 1. Time freshness (relaxed a bit for laggy connections)
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - ts) > 45) {
      throw new Error('QR code expired. Ask your teacher to show the current one.');
    }
    
    // 2. Load session
    const sessionSnap = await getDoc(doc(db, 'attendanceSessions', sessionId));
    if (!sessionSnap.exists()) throw new Error('Session not found.');
    const session = sessionSnap.data();
    
    if (!session.active) throw new Error('This attendance session has ended.');
    if (session.expiresAt < Date.now()) throw new Error('Session expired.');
    
    // 3. Verify HMAC token
    const expectedToken = await generateSessionToken(sessionId, ts, session.salt);
    if (expectedToken !== token) throw new Error('Invalid or outdated QR code.');
    
    // 4. Get student location
    setCheckinStatus('📍 Getting your location...', 'info');
    let pos;
    try {
      pos = await getCurrentPosition();
    } catch (geoErr) {
      throw new Error(geoErr.message || 'Location required. Enable GPS and try again.');
    }
    
    // 5. Distance check
    const dist = distanceMeters(
      pos.coords.latitude, pos.coords.longitude,
      session.location.lat, session.location.lng
    );
    
    if (dist > session.radiusMeters) {
      throw new Error(`You are ${Math.round(dist)}m away. Move closer (within ${session.radiusMeters}m).`);
    }
    
    // 6. Device fingerprint — one device = one student per session (one-time query, no listener leak)
    const deviceId = await getDeviceFingerprint();
    const q = query(
      collection(db, 'attendanceSessions', sessionId, 'checkins'),
      where('deviceId', '==', deviceId)
    );
    const existingSnap = await getDocs(q);
    
    let conflict = false;
    existingSnap.forEach(d => {
      if (d.id !== auth.currentUser.uid) conflict = true;
    });
    if (conflict) throw new Error('This device has already checked in another student.');
    
    // 7. Write check-in
    const userSnap = await getDoc(doc(db, 'users', auth.currentUser.uid));
    const studentName = userSnap.exists() && userSnap.data().name
      ? getFirstName(userSnap.data().name)
      : (auth.currentUser.email || '').split('@')[0];
    
    await setDoc(
      doc(db, 'attendanceSessions', sessionId, 'checkins', auth.currentUser.uid),
      {
        studentId: auth.currentUser.uid,
        name: studentName,
        email: auth.currentUser.email || '',
        at: serverTimestamp(),
        deviceId,
        distanceFromClass: Math.round(dist),
        location: {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        }
      }
    );
    
    setCheckinStatus(`✅ Checked in successfully! You were ${Math.round(dist)}m from class.`, 'success');
    showToast('✅ Attendance recorded!', 'success');
    playCheckinSuccessSound();
    
  } catch (err) {
    console.error('Check-in error:', err);
    setCheckinStatus('❌ ' + (err.message || 'Check-in failed.'), 'error');
    showToast('❌ ' + (err.message || 'Check-in failed.'), 'error');
  }
}

function setCheckinStatus(msg, type) {
  const el = $('checkinStatus');
  if (!el) return;
  el.textContent = msg;
  el.className = 'checkin-status ' + type;
  el.style.display = 'block';
}

// ==================================================================
// ==================================================================

// ===== CUSTOM LOGOUT =====
$('logoutBtn')?.addEventListener('click', function(e) {
  e.preventDefault();
  logoutModal.style.display = 'flex';
});

$('cancelLogoutBtn')?.addEventListener('click', function() {
  logoutModal.style.display = 'none';
});

logoutModal?.addEventListener('click', function(e) {
  if (e.target === this) this.style.display = 'none';
});

$('confirmLogoutBtn')?.addEventListener('click', async function() {
  logoutModal.style.display = 'none';
  
  if (typingTimeout) { clearTimeout(typingTimeout); typingTimeout = null; }
  await setTyping(false);
  
  // Cleanup QR attendance
  stopRotatingQR();
  stopScanner();
  if (checkinUnsub) { checkinUnsub(); checkinUnsub = null; }
  if (studentSessionsUnsub) { studentSessionsUnsub(); studentSessionsUnsub = null; }
  
  // End any active session owned by this teacher
  if (activeSessionId) {
    try {
      await updateDoc(doc(db, 'attendanceSessions', activeSessionId), { active: false });
    } catch(e) {}
    activeSessionId = null;
  }
  
  if (currentUser) {
    set(dbRef(rtdb, 'presence/' + currentUser.uid), null);
  }
  
  if (chatUnsubscribe) { chatUnsubscribe(); chatUnsubscribe = null; }
  if (typingUnsubscribe) { typingUnsubscribe(); typingUnsubscribe = null; }
  if (presenceUnsubscribe) { presenceUnsubscribe(); presenceUnsubscribe = null; }
  if (studentsUnsubscribe) { studentsUnsubscribe(); studentsUnsubscribe = null; }
  
  await signOut(auth);
  showToast('👋 Logged out successfully.', 'info');
});

// ===== PASSWORD STRENGTH =====
$('signupPassword')?.addEventListener('input', function() {
  const pw = this.value;
  const bar = $('strengthBar');
  
  if (!pw) {
    bar.style.width = '0%';
    bar.style.background = 'var(--border)';
    return;
  }
  
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  
  const pct = Math.min((score / 5) * 100, 100);
  const colors = ['#dc2626', '#f59e0b', '#22c55e', '#22c55e', '#3b82f6'];
  bar.style.width = pct + '%';
  bar.style.background = colors[Math.min(Math.floor(score / 1.5), 4)] || 'var(--border)';
});

// ===== FRIEND REQUEST SYSTEM =====
async function getUidByUsername(username) {
  const q = query(collection(db, 'users'), where('username', '==', username.toLowerCase()), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].id;
}

async function sendFriendRequest(targetUsername) {
  const me = auth.currentUser.uid;
  const targetUid = await getUidByUsername(targetUsername);
  if (!targetUid) { showToast('❌ User not found', 'error'); return; }
  if (targetUid === me) { showToast('❌ You cannot add yourself', 'error'); return; }

  const existing = await getDocs(query(
    collection(db, 'friendRequests'),
    where('fromUid', '==', me),
    where('toUid', '==', targetUid),
    where('status', '==', 'pending')
  ));
  if (!existing.empty) { showToast('⏳ Request already sent', 'info'); return; }

  await addDoc(collection(db, 'friendRequests'), {
    fromUid: me,
    toUid: targetUid,
    status: 'pending',
    createdAt: serverTimestamp()
  });
  showToast('🚀 Friend request sent!', 'success');
}

let incomingReqUnsub = null;
function watchIncomingRequests() {
  const me = auth.currentUser.uid;
  if (incomingReqUnsub) incomingReqUnsub();
  incomingReqUnsub = onSnapshot(
    query(collection(db, 'friendRequests'), where('toUid', '==', me), where('status', '==', 'pending')),
    snap => {
      const container = document.getElementById('incomingRequestsList');
      container.innerHTML = '';
      snap.forEach(doc => {
        const d = doc.data();
        const card = document.createElement('div');
        card.className = 'request-card';
        card.innerHTML = `
          <strong>${escapeHtml(d.fromUid)}</strong> wants to be friends
          <button class="btn btn-sm btn-primary accept" data-id="${doc.id}">Accept</button>
          <button class="btn btn-sm btn-danger decline" data-id="${doc.id}">Decline</button>
        `;
        container.appendChild(card);
      });
      container.querySelectorAll('.accept').forEach(b => b.onclick = () => respondRequest(b.dataset.id, true));
      container.querySelectorAll('.decline').forEach(b => b.onclick = () => respondRequest(b.dataset.id, false));
    });
}

async function respondRequest(reqId, accept) {
  const me = auth.currentUser.uid;
  const ref = doc(db, 'friendRequests', reqId);
  const newStatus = accept ? 'accepted' : 'declined';
  await updateDoc(ref, { status: newStatus });

  if (accept) {
    const reqSnap = await getDoc(ref);
    const { fromUid, toUid } = reqSnap.data();
    const participants = [fromUid, toUid].sort();
    const fsRef = doc(collection(db, 'friendships'), participants.join('_'));
    await setDoc(fsRef, { participants, createdAt: serverTimestamp() });

    const chatRef = doc(collection(db, 'conversations'), participants.join('_'));
    await setDoc(chatRef, {
      participants,
      lastMessage: '',
      updatedAt: serverTimestamp()
    });
    showToast('✅ Friend added – you can now chat!', 'success');
  } else {
    showToast('❌ Request declined', 'info');
  }
}

let friendsUnsub = null;
function watchMyFriends() {
  const me = auth.currentUser.uid;
  if (friendsUnsub) friendsUnsub();
  friendsUnsub = onSnapshot(
    query(collection(db, 'friendships'), where('participants', 'array-contains', me)),
    snap => {
      const list = document.getElementById('friendsList');
      list.innerHTML = '';
      snap.forEach(doc => {
        const buddyUid = doc.data().participants.find(u => u !== me);
        getDoc(doc(db, 'users', buddyUid)).then(uSnap => {
          const u = uSnap.data();
          const item = document.createElement('div');
          item.className = 'friend-item';
          item.innerHTML = `
            <img src="${u.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.displayName)}`}" class="avatar-sm">
            <span>${escapeHtml(u.displayName)}</span>
            <button class="btn btn-sm btn-primary chat-btn" data-chat="${[me, buddyUid].sort().join('_')}">Chat</button>
          `;
          list.appendChild(item);
        });
      });
      list.querySelectorAll('.chat-btn').forEach(b => {
        b.onclick = () => openPrivateChat(b.dataset.chat);
      });
    });
}

function openPrivateChat(chatId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-chat').classList.add('active');
  loadChat(chatId);
}

console.log('🎓 Student Hub loaded successfully!');
console.log('🔒 Secure QR Attendance System active.');
console.log('📍 Location service: improved with GPS → network fallback.');

// Register service worker for PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch((error) => {
        console.log('ServiceWorker registration failed: ', error);
      });
  });
}

// ---------- AUDIO & HAPTIC FEEDBACK ----------
function playCheckinSuccessSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch (e) {}
  if (navigator.vibrate) {
    try { navigator.vibrate([70, 40, 70]); } catch (e) {}
  }
}

// ---------- EXPORT ATTENDANCE TO CSV ----------
$('exportAttendanceCsvBtn')?.addEventListener('click', exportAttendanceCsv);
$('exportStudentsCsvBtn')?.addEventListener('click', exportAllStudentsCsv);

async function exportAttendanceCsv() {
  if (!activeSessionId) {
    showToast('No active attendance session to export.', 'info');
    return;
  }
  
  try {
    showToast('Preparing CSV export...', 'info');
    const snap = await getDocs(collection(db, 'attendanceSessions', activeSessionId, 'checkins'));
    if (snap.empty) {
      showToast('No student check-ins recorded yet.', 'info');
      return;
    }
    
    let csv = 'Student Name,Email,Timestamp,Distance From Class (m),Device ID\r\n';
    snap.forEach(d => {
      const data = d.data();
      const name = `"${(data.name || 'Student').replace(/"/g, '""')}"`;
      const email = `"${(data.email || '').replace(/"/g, '""')}"`;
      const timeStr = data.at?.toDate
        ? data.at.toDate().toLocaleString()
        : new Date().toLocaleString();
      const time = `"${timeStr.replace(/"/g, '""')}"`;
      const dist = data.distanceFromClass != null ? data.distanceFromClass : '';
      const deviceId = `"${(data.deviceId || '').replace(/"/g, '""')}"`;
      csv += `${name},${email},${time},${dist},${deviceId}\r\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_session_${activeSessionId.slice(0, 8)}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('✅ Attendance exported to CSV!', 'success');
  } catch (err) {
    console.error('CSV export error:', err);
    showToast('Failed to export CSV: ' + (err.message || 'Unknown error'), 'error');
  }
}

// ---------- EXPORT ALL STUDENTS TO CSV ----------
async function exportAllStudentsCsv() {
  try {
    showToast('Exporting student directory...', 'info');
    const q = query(collection(db, 'users'), where('role', '==', 'student'));
    const snap = await getDocs(q);
    if (snap.empty) {
      showToast('No enrolled students found.', 'info');
      return;
    }
    
    let csv = 'Full Name,Email,Course,Joined Date\r\n';
    snap.forEach(d => {
      const data = d.data();
      const name = `"${(data.name || 'Student').replace(/"/g, '""')}"`;
      const email = `"${(data.email || '').replace(/"/g, '""')}"`;
      const course = `"${(data.courseLabel || data.course || '—').replace(/"/g, '""')}"`;
      const joined = `"${(data.joined || '2025').replace(/"/g, '""')}"`;
      csv += `${name},${email},${course},${joined}\r\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students_directory_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('✅ Student directory exported to CSV!', 'success');
  } catch (err) {
    console.error('Students export error:', err);
    showToast('Failed to export students: ' + (err.message || 'Unknown error'), 'error');
  }
}