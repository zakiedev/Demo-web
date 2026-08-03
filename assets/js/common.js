/* ==========================================================================
   DegreeToCareer — shared client logic
   - One Supabase client for the whole public site (admin has its own copy
     because it needs the auth session + imgbb key).
   - Every public page reads real data from Supabase first; if the tables
     are empty/unreachable it falls back to demo content so the site never
     shows a blank page.
   - dtcToast() replaces alert() everywhere.
   ========================================================================== */

const SUPABASE_URL = 'https://ujkfjalepcldduwbwddz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqa2ZqYWxlcGNsZGR1d2J3ZGR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU2NTUxMjgsImV4cCI6MjEwMTIzMTEyOH0.8wjBN2fuQolkagyCP7Hf_40CEhq3T2VZYtX96YEv65Y';

const dtcSupabase = (window.supabase && window.supabase.createClient)
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

/* ---------- Toast ---------- */
function dtcToast(message, type = 'success', duration = 4000) {
  let host = document.getElementById('dtc-toast-host');
  if (!host) {
    host = document.createElement('div');
    host.id = 'dtc-toast-host';
    document.body.appendChild(host);
  }
  const el = document.createElement('div');
  el.className = `dtc-toast ${type}`;
  el.textContent = message;
  host.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 300);
  }, duration);
}

/* ---------- Mobile menu (used on every page) ---------- */
function dtcInitMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('mobileOverlay');
  const closeBtn = document.getElementById('closeMenu');
  if (!hamburger || !mobileMenu || !overlay || !closeBtn) return;
  const open = () => { mobileMenu.classList.add('open'); overlay.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const close = () => { mobileMenu.classList.remove('open'); overlay.classList.remove('open'); document.body.style.overflow = ''; };
  hamburger.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);
}
document.addEventListener('DOMContentLoaded', dtcInitMobileMenu);

/* ---------- Demo fallback data (shown until real records exist) ---------- */
const DTC_FALLBACK_UNIVERSITIES = [
  { id: 'amity-online', slug: 'amity-online', name: 'Amity University Online', accreditation: 'UGC-DEB, NAAC A+', ranking: 1, avg_fee: '₹1,50,000', placement_rate: '85%', state: 'Delhi', description: 'A pioneer in online education, offering UGC-approved degree programs with flexible learning, experienced faculty, and 24/7 student support.', courses: ['Online MBA', 'BBA', 'BCA', 'M.Com'] },
  { id: 'lpu-online', slug: 'lpu-online', name: 'LPU Online', accreditation: 'UGC-DEB, NIRF Ranked', ranking: 2, avg_fee: '₹1,20,000', placement_rate: '92%', state: 'Punjab', description: 'Lovely Professional University Online offers a wide range of UG and PG programs, backed by strong industry connections and placement support.', courses: ['Online MBA', 'M.Sc Data Science', 'BBA', 'BCA'] },
  { id: 'manipal-jaipur', slug: 'manipal-jaipur', name: 'Manipal University Jaipur', accreditation: 'UGC-DEB, NAAC A+', ranking: 3, avg_fee: '₹1,80,000', placement_rate: '88%', state: 'Rajasthan', description: 'Offers UGC-entitled online degrees with a modern curriculum, virtual labs, and consistently high student satisfaction.', courses: ['Online MBA', 'BBA', 'BCA', 'M.Com', 'B.Sc IT'] },
  { id: 'jain-online', slug: 'jain-online', name: 'Jain Online', accreditation: 'UGC-DEB, NAAC A', ranking: 4, avg_fee: '₹1,40,000', placement_rate: '82%', state: 'Karnataka', description: 'A deemed-to-be university providing quality online education with flexible exam schedules and personalised mentorship.', courses: ['Online MBA', 'BBA', 'BCA', 'M.Com'] },
  { id: 'chandigarh-online', slug: 'chandigarh-online', name: 'Chandigarh University Online', accreditation: 'UGC-DEB, NAAC A+', ranking: 5, avg_fee: '₹1,30,000', placement_rate: '87%', state: 'Punjab', description: 'Combines a modern, tech-driven curriculum with strong corporate tie-ups for placements.', courses: ['Online MBA', 'BBA', 'BCA'] },
  { id: 'upes-online', slug: 'upes-online', name: 'UPES Online', accreditation: 'UGC-DEB, NAAC A', ranking: 6, avg_fee: '₹1,60,000', placement_rate: '84%', state: 'Uttarakhand', description: 'Known for industry-aligned online programs across management and technology.', courses: ['Online MBA', 'BBA'] },
  { id: 'amrita-online', slug: 'amrita-online', name: 'Amrita Online', accreditation: 'UGC-DEB, NAAC A++', ranking: 7, avg_fee: '₹1,70,000', placement_rate: '90%', state: 'Tamil Nadu', description: 'A NAAC A++ accredited institution offering rigorous, research-driven online degrees.', courses: ['Online MBA', 'M.Sc Data Science'] },
  { id: 'smu-online', slug: 'smu-online', name: 'SMU Online', accreditation: 'UGC-DEB', ranking: 8, avg_fee: '₹1,10,000', placement_rate: '78%', state: 'Sikkim', description: 'Affordable UGC-DEB approved online degrees with a broad course catalogue.', courses: ['BBA', 'BCA', 'M.Com'] }
];

const DTC_FALLBACK_COURSES = [
  { name: 'Online MBA', slug: 'online-mba', duration: '2 Years', level: 'Management', description: 'A postgraduate management degree covering finance, marketing, operations and leadership.' },
  { name: 'B.Tech Computer Science', slug: 'btech-cs', duration: '4 Years', level: 'Engineering', description: 'An undergraduate engineering degree focused on programming, systems and software design.' },
  { name: 'BBA', slug: 'bba', duration: '3 Years', level: 'Management', description: 'An undergraduate business administration degree covering core management fundamentals.' },
  { name: 'B.Sc Nursing', slug: 'bsc-nursing', duration: '4 Years', level: 'Healthcare', description: 'A professional nursing degree combining clinical practice with healthcare theory.' },
  { name: 'M.Com', slug: 'mcom', duration: '2 Years', level: 'Commerce', description: 'A postgraduate commerce degree specialising in accounting, taxation and finance.' },
  { name: 'BCA', slug: 'bca', duration: '3 Years', level: 'IT', description: 'An undergraduate computer applications degree preparing students for software careers.' },
  { name: 'BA (Journalism & Mass Comm.)', slug: 'ba-journalism', duration: '3 Years', level: 'Arts', description: 'An undergraduate degree in media, journalism and communication.' },
  { name: 'M.Sc Data Science', slug: 'msc-data-science', duration: '2 Years', level: 'Science', description: 'A postgraduate degree in statistics, machine learning and data analytics.' },
  { name: 'LL.B.', slug: 'llb', duration: '3 Years', level: 'Law', description: 'An undergraduate law degree qualifying graduates to practice law in India.' },
  { name: 'Diploma in Digital Marketing', slug: 'diploma-digital-marketing', duration: '1 Year', level: 'Vocational', description: 'A short, skills-focused diploma covering SEO, paid ads and social media marketing.' },
  { name: 'B.Com (Hons)', slug: 'bcom-hons', duration: '3 Years', level: 'Commerce', description: 'An honours commerce degree with deeper coverage of accounting and finance.' },
  { name: 'Executive MBA', slug: 'executive-mba', duration: '1 Year', level: 'Management', description: 'An accelerated MBA designed for working professionals with several years of experience.' }
];

const DTC_ICONS = { Management:'📊', Engineering:'💻', Healthcare:'🏥', Commerce:'📈', IT:'🖥️', Arts:'🎨', Science:'🔬', Law:'⚖️', Vocational:'🎯' };

/* ---------- Data helpers (Supabase first, fallback second) ---------- */
async function dtcFetchUniversities() {
  try {
    if (!dtcSupabase) throw new Error('no client');
    const { data, error } = await dtcSupabase.from('universities').select('*').order('ranking', { ascending: true });
    if (error || !data || data.length === 0) throw error || new Error('empty');
    return { data, live: true };
  } catch (e) {
    return { data: DTC_FALLBACK_UNIVERSITIES, live: false };
  }
}

async function dtcFetchCourses() {
  try {
    if (!dtcSupabase) throw new Error('no client');
    const { data, error } = await dtcSupabase.from('courses').select('*').order('name');
    if (error || !data || data.length === 0) throw error || new Error('empty');
    return { data, live: true };
  } catch (e) {
    return { data: DTC_FALLBACK_COURSES, live: false };
  }
}

async function dtcFetchUniversityBySlug(slug) {
  try {
    if (!dtcSupabase) throw new Error('no client');
    const { data, error } = await dtcSupabase.from('universities').select('*').eq('slug', slug).single();
    if (error || !data) throw error || new Error('not found');
    return data;
  } catch (e) {
    return DTC_FALLBACK_UNIVERSITIES.find(u => u.slug === slug) || null;
  }
}

async function dtcSubmitLead(lead) {
  try {
    if (!dtcSupabase) throw new Error('no client');
    const { error } = await dtcSupabase.from('leads').insert([{
      name: lead.name, email: lead.email, phone: lead.phone,
      course_interest: lead.course_interest || null, status: 'new'
    }]);
    if (error) throw error;
    return { ok: true };
  } catch (e) {
    console.error('Lead submission failed:', e);
    return { ok: false, error: e };
  }
}
