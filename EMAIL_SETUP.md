# 📧 COUSERIASEMOR Email Verification Setup Guide

## What's New? ✨

Your COUSERIASEMOR website now has **email verification** with automated welcome emails! Here's what happens:

1. **User registers** → Gets a 6-digit code sent to their email
2. **User enters code** → Email is verified
3. **User auto-logged in** → Receives welcome email 🎉
4. **Can't login until verified** → Security feature

## ⚡ Quick Setup (5 minutes)

### Step 1: Enable 2FA on Gmail
1. Go to **https://myaccount.google.com**
2. Click **Security** (left sidebar)
3. Find **2-Step Verification** and click **Enable**
4. Complete the setup (you'll need your phone)

### Step 2: Get App Password
1. Go to **https://myaccount.google.com/apppasswords**
2. You'll see a text field: **"To create a new app-specific password, type a name for it below…"**
3. Type a name for the password (example: `COUSERIASEMOR` or `Gmail App`)
4. Click **Generate**
5. **Copy** the 16-character password that appears (it will look like: `xxxx xxxx xxxx xxxx`)
6. Keep this safe! (You'll paste it in .env)

### Step 3: Update .env File
Open `.env` in your project and fill in:

```
MONGODB_URI=mongodb+srv://kenyahustlehub1_db_user:XTS3jCPCkUJF3xvY@couseriasemor.8cqke78.mongodb.net/?appName=couseriasemor
PORT=3000
GMAIL_USER=couseriasemor@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

**Already set to:**
- `couseriasemor@gmail.com` (your Gmail)
- Replace `xxxx xxxx xxxx xxxx` with your 16-character app password (keep the spaces!)

### Step 4: Install Dependencies
```bash
npm install
```

### Step 5: Start Server
```bash
npm start
```

You should see:
```
✨ COUSERIASEMOR server is running at http://localhost:3000
✅ Connected to MongoDB successfully.
📧 Email verification enabled!
```

## 🧪 Test It Out

1. Go to **http://localhost:3000**
2. Click **Get Started** or go to **register.html**
3. Fill in registration form with:
   - Full Name: Test User
   - Email: **couseriasemor@gmail.com** (use your COUSERIASEMOR Gmail!)
   - Password: test123456
   - Expertise: Beginner
   - Check the terms checkbox
   - Click **Register**

4. **Check your email** (usually takes 5-10 seconds)
   - Look in **Inbox** and **Spam** folder
   - Find email from COUSERIASEMOR with subject: "🎓 Verify Your COUSERIASEMOR Account"
   - Copy the 6-digit code

5. **Enter verification code** on the verification screen
   - Code expires in 15 minutes
   - You'll see: "🎉 Email verified! Welcome to COUSERIASEMOR!"
   - Automatically logged in ✅
   - Welcome email sent to your inbox 🎉

## 🚀 Deploy to Render

When deploying to Render, add these **Environment Variables** in Render dashboard:

| Key | Value |
|-----|-------|
| MONGODB_URI | Your MongoDB Atlas connection string |
| GMAIL_USER | your-email@gmail.com |
| GMAIL_APP_PASSWORD | xxxx xxxx xxxx xxxx |

Everything else works the same!

## ❓ Troubleshooting

### "Failed to send verification email"
- ✅ Check GMAIL_USER is correct (exact email)
- ✅ Check GMAIL_APP_PASSWORD is correct (16 chars with spaces)
- ✅ Check 2FA is enabled on your Gmail
- ✅ Check `.env` file doesn't have typos

### "Email not arriving"
- ✅ Check **Spam/Promotions** folder
- ✅ Wait 5-10 seconds (sometimes slower)
- ✅ Click **Resend** on verification page
- ✅ Check console for error messages (F12 → Console)

### Code is "Invalid"
- ✅ Make sure you entered exactly 6 digits
- ✅ Check code hasn't expired (15 minutes)
- ✅ Try clicking **Resend** to get a new code

### Can't login
- ✅ If you see "Please verify your email first" → verify first!
- ✅ Check email address matches registration email
- ✅ Check password is correct

## 📚 How It Works (Technical)

- **Backend:** Uses Nodemailer with Gmail SMTP (FREE!)
- **Database:** Stores verification codes with 15-minute expiration
- **Security:** Codes are 6-digit random, passwords stored in MongoDB
- **No Third-Party Service:** Uses Gmail directly (no SendGrid, Mailgun, etc.)
- **Render Compatible:** Works on free Render tier, no blocking

## 🎉 Features

✅ Automatic verification email with nice HTML formatting
✅ Automatic welcome email after verification
✅ 6-digit random verification codes
✅ 15-minute code expiration
✅ Resend code functionality
✅ Auto-login after verification
✅ Beautiful dark-themed emails
✅ Completely free (Gmail free tier)

---

**You're all set! Register now and verify your email.** 🚀
