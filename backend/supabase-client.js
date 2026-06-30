require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const sqliteDb = require('./db');

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;
let supabaseReady = false;

function isValidUuid(value) {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

try {
  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
    supabaseReady = true;
  }
} catch (error) {
  console.warn('Supabase client unavailable, falling back to local SQLite auth:', error.message);
}

sqliteDb.initializeDb();

function normalizeUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    fullName: user.fullName || user.full_name || [user.first_name, user.last_name].filter(Boolean).join(' ').trim() || '',
    email: user.email,
    expertise: user.expertise || user.expertise || 'Beginner',
    totalPoints: user.totalPoints || user.total_points || 0,
    lastLogin: user.lastLogin || user.last_login || null,
    createdAt: user.createdAt || user.created_at || null,
    profilePictureUrl: user.profilePictureUrl || user.profile_picture_url || null,
    bio: user.bio || null,
    password_hash: user.password_hash || user.password || null,
    reset_token: user.reset_token || user.resetToken || null,
    reset_token_expires: user.reset_token_expires || user.resetTokenExpires || null,
  };
}

async function normalizeSqliteUserById(id) {
  const users = await sqliteDb.loadUsers();
  const user = users.find((entry) => entry.id === id);
  return normalizeUser(user);
}

async function normalizeSqliteUserByEmail(email) {
  const users = await sqliteDb.loadUsers();
  const user = users.find((entry) => String(entry.email || '').toLowerCase() === String(email || '').toLowerCase());
  return normalizeUser(user);
}

async function createUser(email, passwordHash, fullName, expertise = 'Beginner', startingPoints = 10) {
  const [firstName = '', lastName = ''] = String(fullName || '').trim().split(/\s+/, 2);

  if (supabaseReady) {
    const payload = {
      email,
      password_hash: passwordHash,
      first_name: firstName || null,
      last_name: lastName || null,
      total_points: startingPoints,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase
        .from('users')
        .insert([payload])
        .select()
        .maybeSingle();

      if (!error) return normalizeUser(data);
      console.warn('Supabase createUser failed, using SQLite fallback:', error.message);
    } catch (error) {
      console.warn('Supabase createUser failed, using SQLite fallback:', error.message);
    }
  }

  const sqliteUser = await sqliteDb.createUser({
    fullName,
    email,
    password: passwordHash,
    expertise,
    totalPoints: startingPoints,
  });
  return normalizeUser(sqliteUser);
}

async function getUserByEmailRaw(email) {
  if (supabaseReady) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();
      if (!error) return data || null;
      console.warn('Supabase getUserByEmailRaw failed, using SQLite fallback:', error.message);
    } catch (error) {
      console.warn('Supabase getUserByEmailRaw failed, using SQLite fallback:', error.message);
    }
  }

  const sqliteUser = await normalizeSqliteUserByEmail(email);
  return sqliteUser ? { ...sqliteUser, password_hash: sqliteUser.password_hash } : null;
}

async function getUserByEmail(email) {
  const raw = await getUserByEmailRaw(email);
  return raw ? normalizeUser(raw) : null;
}

async function getUserById(id) {
  if (!id || !isValidUuid(id)) return null;

  if (supabaseReady) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (!error) return data ? normalizeUser(data) : null;
      console.warn('Supabase getUserById failed, using SQLite fallback:', error.message);
    } catch (error) {
      console.warn('Supabase getUserById failed, using SQLite fallback:', error.message);
    }
  }

  return normalizeSqliteUserById(id);
}

async function setResetToken(userId, token, expiresAt) {
  if (supabaseReady) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ reset_token: token, reset_token_expires: expiresAt })
        .eq('id', userId)
        .select()
        .maybeSingle();
      if (!error) return normalizeUser(data);
      console.warn('Supabase setResetToken failed, using SQLite fallback:', error.message);
    } catch (error) {
      console.warn('Supabase setResetToken failed, using SQLite fallback:', error.message);
    }
  }

  const users = await sqliteDb.loadUsers();
  const user = users.find((entry) => entry.id === userId);
  if (!user) return null;
  const updated = await sqliteDb.updateUser(user.email, { resetToken: token, resetTokenExpires: expiresAt });
  return normalizeUser(updated);
}

async function getUserByResetToken(token) {
  if (supabaseReady) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('reset_token', token)
        .maybeSingle();
      if (!error) return data ? normalizeUser(data) : null;
      console.warn('Supabase getUserByResetToken failed, using SQLite fallback:', error.message);
    } catch (error) {
      console.warn('Supabase getUserByResetToken failed, using SQLite fallback:', error.message);
    }
  }

  const users = await sqliteDb.loadUsers();
  const user = users.find((entry) => entry.resetToken === token || entry.reset_token === token);
  return normalizeUser(user);
}

async function updateUserPassword(email, passwordHash) {
  if (supabaseReady) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ password_hash: passwordHash, reset_token: null, reset_token_expires: null })
        .eq('email', email)
        .select()
        .maybeSingle();
      if (!error) return normalizeUser(data);
      console.warn('Supabase updateUserPassword failed, using SQLite fallback:', error.message);
    } catch (error) {
      console.warn('Supabase updateUserPassword failed, using SQLite fallback:', error.message);
    }
  }

  const updated = await sqliteDb.updateUser(email, { password: passwordHash, resetToken: null, resetTokenExpires: null });
  return normalizeUser(updated);
}

async function updateLastLogin(userId) {
  if (supabaseReady) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .maybeSingle();
      if (!error) return normalizeUser(data);
      console.warn('Supabase updateLastLogin failed, using SQLite fallback:', error.message);
    } catch (error) {
      console.warn('Supabase updateLastLogin failed, using SQLite fallback:', error.message);
    }
  }

  const users = await sqliteDb.loadUsers();
  const user = users.find((entry) => entry.id === userId);
  if (!user) return null;
  const updated = await sqliteDb.updateUser(user.email, { lastLogin: new Date().toISOString() });
  return normalizeUser(updated);
}

async function updateUserProfile(id, updates) {
  if (supabaseReady) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .maybeSingle();
      if (!error) return normalizeUser(data);
      console.warn('Supabase updateUserProfile failed, using SQLite fallback:', error.message);
    } catch (error) {
      console.warn('Supabase updateUserProfile failed, using SQLite fallback:', error.message);
    }
  }

  const users = await sqliteDb.loadUsers();
  const user = users.find((entry) => entry.id === id);
  if (!user) return null;
  const updated = await sqliteDb.updateUser(user.email, updates);
  return normalizeUser(updated);
}

async function getAllCourses() {
  if (supabaseReady) {
    try {
      const { data, error } = await supabase.from('courses').select('*');
      if (!error) return data;
      console.warn('Supabase getAllCourses failed, returning empty list:', error.message);
    } catch (error) {
      console.warn('Supabase getAllCourses failed, returning empty list:', error.message);
    }
  }
  return [];
}

async function getCourseById(courseId) {
  if (supabaseReady) {
    try {
      const { data, error } = await supabase.from('courses').select('*').eq('id', courseId).single();
      if (!error) return data;
      console.warn('Supabase getCourseById failed, returning null:', error.message);
    } catch (error) {
      console.warn('Supabase getCourseById failed, returning null:', error.message);
    }
  }
  return null;
}

async function getCoursesByCategory(category) {
  if (supabaseReady) {
    try {
      const { data, error } = await supabase.from('courses').select('*').eq('category', category);
      if (!error) return data;
      console.warn('Supabase getCoursesByCategory failed, returning empty list:', error.message);
    } catch (error) {
      console.warn('Supabase getCoursesByCategory failed, returning empty list:', error.message);
    }
  }
  return [];
}

async function getUserCourseProgress(userId, courseId) {
  if (supabaseReady) {
    try {
      const { data, error } = await supabase
        .from('course_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .single();
      if (!error) return data;
    } catch (error) {
      console.warn('Supabase getUserCourseProgress failed:', error.message);
    }
  }
  return null;
}

async function updateCourseProgress(userId, courseId, progress) {
  if (supabaseReady) {
    try {
      const { data, error } = await supabase
        .from('course_progress')
        .upsert({ user_id: userId, course_id: courseId, ...progress })
        .select();
      if (!error) return data;
    } catch (error) {
      console.warn('Supabase updateCourseProgress failed:', error.message);
    }
  }
  return null;
}

async function addUserPoints(userId, points, type, courseId, description) {
  if (supabaseReady) {
    try {
      const { data, error } = await supabase
        .from('points')
        .insert([{ user_id: userId, points_earned: points, points_type: type, course_id: courseId, description }])
        .select();
      if (!error) return data;
    } catch (error) {
      console.warn('Supabase addUserPoints failed:', error.message);
    }
  }
  return null;
}

async function getUserDashboardStats(userId) {
  if (supabaseReady) {
    try {
      const { data: courses, error: coursesError } = await supabase
        .from('course_progress')
        .select('course_id, progress_percentage, is_completed')
        .eq('user_id', userId);
      const { data: points, error: pointsError } = await supabase
        .from('points')
        .select('points_earned')
        .eq('user_id', userId);
      if (!coursesError && !pointsError) {
        return {
          progress: courses || [],
          points: points?.reduce((sum, p) => sum + (p.points_earned || 0), 0) || 0,
        };
      }
    } catch (error) {
      console.warn('Supabase getUserDashboardStats failed:', error.message);
    }
  }
  return { progress: [], points: 0 };
}

module.exports = {
  createUser,
  getUserByEmail,
  getUserByEmailRaw,
  getUserById,
  updateUserProfile,
  getAllCourses,
  getCourseById,
  getCoursesByCategory,
  getUserCourseProgress,
  updateCourseProgress,
  addUserPoints,
  getUserDashboardStats,
  setResetToken,
  getUserByResetToken,
  updateUserPassword,
  updateLastLogin,
};
