require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials in environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createUser(email, passwordHash, firstName, lastName) {
  const { data, error } = await supabase
    .from('users')
    .insert([{ email, password_hash: passwordHash, first_name: firstName, last_name: lastName }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function getUserByEmail(email) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

async function getUserById(id) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

async function updateUserProfile(id, updates) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select();
  if (error) throw error;
  return data;
}

async function getAllCourses() {
  const { data, error } = await supabase.from('courses').select('*');
  if (error) throw error;
  return data;
}

async function getCourseById(courseId) {
  const { data, error } = await supabase.from('courses').select('*').eq('id', courseId).single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

async function getCoursesByCategory(category) {
  const { data, error } = await supabase.from('courses').select('*').eq('category', category);
  if (error) throw error;
  return data;
}

async function getUserCourseProgress(userId, courseId) {
  const { data, error } = await supabase
    .from('course_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

async function updateCourseProgress(userId, courseId, progress) {
  const { data, error } = await supabase
    .from('course_progress')
    .upsert({ user_id: userId, course_id: courseId, ...progress })
    .select();
  if (error) throw error;
  return data;
}

async function addUserPoints(userId, points, type, courseId, description) {
  const { data, error } = await supabase
    .from('points')
    .insert([{ user_id: userId, points_earned: points, points_type: type, course_id: courseId, description }])
    .select();
  if (error) throw error;
  return data;
}

async function getUserDashboardStats(userId) {
  const { data: courses, error: coursesError } = await supabase
    .from('course_progress')
    .select('course_id, progress_percentage, is_completed')
    .eq('user_id', userId);
  if (coursesError) throw coursesError;

  const { data: points, error: pointsError } = await supabase
    .from('points')
    .select('points_earned')
    .eq('user_id', userId);
  if (pointsError) throw pointsError;

  return {
    progress: courses || [],
    points: points?.reduce((sum, p) => sum + (p.points_earned || 0), 0) || 0,
  };
}

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserProfile,
  getAllCourses,
  getCourseById,
  getCoursesByCategory,
  getUserCourseProgress,
  updateCourseProgress,
  addUserPoints,
  getUserDashboardStats,
};
