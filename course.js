const authToken = localStorage.getItem('authToken');
const welcomeName = localStorage.getItem('welcomeName') || 'Learner';

if (!authToken) {
    window.location.href = 'login.html';
}

document.getElementById('authLinks').innerHTML = `<a href="#" class="nav-link logout-link">Logout</a> <span class="nav-link">${welcomeName}</span>`;

// Get course ID from URL
const urlParams = new URLSearchParams(window.location.search);
const courseId = urlParams.get('id') || localStorage.getItem('selectedCourse');

if (!courseId) {
    window.location.href = 'courses.html';
}

async function fetchUserInfo() {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) return null;

    try {
        const response = await fetch('/api/user-info', {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        if (!response.ok) return null;
        return await response.json();
    } catch {
        return null;
    }
}

async function ensurePremiumAccess() {
    if (courseId !== 'premium') return true;
    const user = await fetchUserInfo();
    return user && user.totalPoints >= 300;
}

// Course data structure
const courses = {
    'ai-mastery': {
        title: 'AI Tools Mastery',
        description: 'Complete guide to AI productivity tools, ChatGPT, Midjourney, and workflow automation.',
        category: 'AI & Automation',
        assetFolder: 'Ai tools mastery',
        totalLessons: 41,
        totalDuration: '8 hours',
        rating: '4.8',
        reviews: '2.1k',
        students: '15,000+',
        lessons: [
            {
                id: 1,
                title: 'Write a Contract for Business',
                duration: '8 min',
                type: 'video',
                topicFolder: 'Generative_AI_for_Business,_Marketing_Emails,_Ideation,_and_Productivity',
                completed: false,
                videoUrl: '008 Write a Contract for Business.mp4',
                description: 'Learn how to draft a business contract clearly and confidently for your AI services and products.',
                resources: [
                    { type: 'pdf', name: 'Course Syllabus', url: 'course-syllabus.html' },
                    { type: 'pdf', name: 'AI Tools Checklist', url: 'ai-tools-checklist.html' },
                    { type: 'link', name: 'Recommended AI Tools', url: 'https://tools.example.com' }
                ]
            },
            {
                id: 2,
                title: 'Bulk Marketing Emails',
                duration: '12 min',
                type: 'video',
                topicFolder: 'Generative_AI_for_Business,_Marketing_Emails,_Ideation,_and_Productivity',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779190577/009_Bulk_Marketing_Emails_vthiv5.mp4',
                description: 'Learn how to build high-converting bulk email campaigns using AI-powered copy, segmentation, and automation.',
                resources: [
                    { type: 'pdf', name: 'AI Fundamentals Guide', url: 'ai-fundamentals-guide.html' },
                    { type: 'pdf', name: 'AI Fundamentals Cheat Sheet', url: 'ai-fundamentals-cheatsheet.html' }
                ]
            },
            {
                id: 3,
                title: 'Getting Started with ChatGPT',
                duration: '15 min',
                type: 'video',
                topicFolder: 'Generative_AI_for_Business,_Marketing_Emails,_Ideation,_and_Productivity',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779190570/010_Quickly_Respond_To_Emails_With_ChatGPT_ep8giq.mp4',
                description: 'Master the art of prompt engineering and learn how to get the best results from ChatGPT.',
                resources: [
                    { type: 'pdf', name: 'Prompt Engineering Guide', url: 'prompt-engineering-guide.html' },
                    { type: 'pdf', name: 'ChatGPT Templates', url: 'chatgpt-templates.html' }
                ]
            },
            {
                id: 4,
                title: 'Creating Content with AI',
                duration: '18 min',
                type: 'video',
                topicFolder: 'Generative_AI_for_Business,_Marketing_Emails,_Ideation,_and_Productivity',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779191154/011_Learning_Activity_Create_a_New_Product_nomtwy.mp4',
                description: 'Use AI to generate blog posts, social media content, marketing copy, and more.',
                resources: [
                    { type: 'pdf', name: 'Content Creation Templates', url: 'content-creation-templates.html' },
                    { type: 'pdf', name: 'AI Copywriting Checklist', url: 'ai-copywriting-checklist.html' }
                ]
            },
            {
                id: 5,
                title: 'Intro to Using Multiple AI Tools',
                duration: '20 min',
                type: 'video',
                topicFolder: 'Generative_AI_for_Business,_Marketing_Emails,_Ideation,_and_Productivity',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779195084/001_Intro_to_Using_Multiple_AI_Tools_m2m0t6.mp4',
                description: 'Create stunning visuals and artwork using AI-powered image generation tools.',
                resources: [
                    { type: 'pdf', name: 'Midjourney Prompt Guide', url: 'midjourney-prompt-guide.html' },
                    { type: 'pdf', name: 'AI Image Generation Tips', url: 'ai-image-generation-tips.html' }
                ]
            },
            {
                id: 6,
                title: 'Combining Multiple AI Tools',
                duration: '22 min',
                type: 'video',
                topicFolder: 'Generative_AI_for_Business,_Marketing_Emails,_Ideation,_and_Productivity',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779195284/002_Combining_Multiple_AI_Tools_vgnfo3.mp4',
                description: 'Learn how to integrate multiple AI tools for maximum productivity and creative power.',
                resources: [
                    { type: 'pdf', name: 'AI Tools Integration Guide', url: 'ai-tools-checklist.html' },
                    { type: 'pdf', name: 'Workflow Automation Tips', url: 'content-creation-templates.html' }
                ]
            },
            {
                id: 7,
                title: 'AI Voice Generation with Murf.ai',
                duration: '14 min',
                type: 'video',
                topicFolder: 'Generative_AI_for_Business,_Marketing_Emails,_Ideation,_and_Productivity',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779196324/001_Murf.ai_AI_Voice_Generation_b19krz.mp4',
                description: 'Explore AI voice generation using Murf.ai to create professional audio for presentations, videos, and marketing assets.',
                resources: [
                    { type: 'pdf', name: 'AI Tools Checklist', url: 'ai-tools-checklist.html' }
                ]
            },
            {
                id: 8,
                title: 'AI Voice Generation with WellSaid Labs',
                duration: '16 min',
                type: 'video',
                topicFolder: 'Generative_AI_for_Business,_Marketing_Emails,_Ideation,_and_Productivity',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779196320/002_Wellsaid_Labs_Turn_Written_Scripts_Into_Voice_l7u34q.mp4',
                description: 'Turn written scripts into natural-sounding AI voiceovers using WellSaid Labs for content, ads, and video narration.',
                resources: [
                    { type: 'pdf', name: 'AI Voice Production Guide', url: 'ai-tools-checklist.html' }
                ]
            },
            {
                id: 9,
                title: 'Clone Your Voice with ElevenLabs',
                duration: '18 min',
                type: 'video',
                topicFolder: 'Generative_AI_for_Business,_Marketing_Emails,_Ideation,_and_Productivity',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779196276/003_Case_Study_Clone_Your_Voice_with_ElevenLabs_d8bpuh.mp4',
                description: 'Learn how to clone your voice using ElevenLabs for custom narration, branding, and audio content creation.',
                resources: [
                    { type: 'pdf', name: 'AI Voice Production Guide', url: 'ai-tools-checklist.html' }
                ]
            },
            {
                id: 10,
                title: 'Text-to-Voice with Play.ht',
                duration: '14 min',
                type: 'video',
                topicFolder: 'Generative_AI_for_Business,_Marketing_Emails,_Ideation,_and_Productivity',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779196255/005_Play.ht_Text_to_Voice_Generator_vjqb0i.mp4',
                description: 'Use Play.ht to convert written scripts into realistic voiceovers for podcasts, videos, and marketing content.',
                resources: [
                    { type: 'pdf', name: 'AI Voice Production Guide', url: 'ai-tools-checklist.html' }
                ]
            },
            {
                id: 11,
                title: 'Fix Audio with Free AI Filters',
                duration: '12 min',
                type: 'video',
                topicFolder: 'Generative_AI_for_Business,_Marketing_Emails,_Ideation,_and_Productivity',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779196330/006_Free_AI_Filter_To_Fix_Audio_eqiujr.mp4',
                description: 'Learn how to clean and fix audio using free AI tools for better voice quality, noise removal, and production polish.',
                resources: [
                    { type: 'pdf', name: 'Audio Cleanup Guide', url: 'ai-tools-checklist.html' }
                ]
            },
            {
                id: 12,
                title: 'Make Photos Speak with D-ID',
                duration: '15 min',
                type: 'video',
                topicFolder: 'Generative_AI_for_Business,_Marketing_Emails,_Ideation,_and_Productivity',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779199155/001_D-ID.com_Make_Your_Photos_Speak_isgo3w.mp4',
                description: 'Bring photos to life using D-ID to create AI-generated videos where images speak and present content.',
                resources: [
                    { type: 'pdf', name: 'Video Creation Guide', url: 'ai-tools-checklist.html' }
                ]
            },
            {
                id: 13,
                title: 'AI Image Editing with Playground AI',
                duration: '16 min',
                type: 'video',
                topicFolder: 'Generative_AI_for_Business,_Marketing_Emails,_Ideation,_and_Productivity',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779199679/002_Playground_AI_Use_AI_to_Edit_Like_Photoshop_summxb.mp4',
                description: 'Use Playground AI for professional image editing with AI-powered tools, filters, and Photoshop-like capabilities.',
                resources: [
                    { type: 'pdf', name: 'Image Editing Guide', url: 'ai-tools-checklist.html' }
                ]
            },
            {
                id: 14,
                title: 'Add Movement to Photos with LeiaPix',
                duration: '14 min',
                type: 'video',
                topicFolder: 'Generative_AI_for_Business,_Marketing_Emails,_Ideation,_and_Productivity',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779199192/003_LeiaPix_Instantly_Add_Movement_to_Your_Photos_o5ub5i.mp4',
                description: 'Transform static photos into dynamic videos with LeiaPix by adding realistic movement and animation effects.',
                resources: [
                    { type: 'pdf', name: 'Animation Guide', url: 'ai-tools-checklist.html' }
                ]
            },
            {
                id: 15,
                title: 'Remove Watermarks with WatermarkRemover.io',
                duration: '9 min',
                type: 'video',
                topicFolder: 'Generative_AI_for_Business,_Marketing_Emails,_Ideation,_and_Productivity',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779198699/004_WatermarkRemover.io_Instantly_Remove_Watermarks_from_Images_zf45um.mp4',
                description: 'Quickly remove watermarks and unwanted artifacts from images using WatermarkRemover.io for clean visuals.',
                resources: [
                    { type: 'pdf', name: 'Image Cleanup Guide', url: 'ai-tools-checklist.html' }
                ]
            },
            {
                id: 16,
                title: 'Create Photos Faster with PicFinder',
                duration: '10 min',
                type: 'video',
                topicFolder: 'Generative_AI_for_Business,_Marketing_Emails,_Ideation,_and_Productivity',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779199394/005_PicFinder_Create_100_s_of_Photos_in_Seconds_tva7fq.mp4',
                description: 'Generate hundreds of photos in seconds using PicFinder for fast image creation and ideation.',
                resources: [
                    { type: 'pdf', name: 'Fast Image Creation Guide', url: 'ai-tools-checklist.html' }
                ]
            },
            {
                id: 17,
                title: 'Module Introduction',
                duration: '5 min',
                type: 'video',
                topicFolder: 'Generative_AI_for_Business,_Marketing_Emails,_Ideation,_and_Productivity',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779288341/01._Introduction_glsypq.mp4',
                description: 'Introduction to the module and overview of upcoming lessons.',
                resources: []
            },
            {
                id: 18,
                title: 'Top 10 AI Prompts',
                duration: '7 min',
                type: 'video',
                topicFolder: 'Generative_AI_for_Business,_Marketing_Emails,_Ideation,_and_Productivity',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779288364/02._The_top_10_AI_prompts_pnkoum.mp4',
                description: 'A curated list of the top 10 AI prompts for productivity, content, and idea generation.',
                resources: [
                    { type: 'pdf', name: 'Top AI Prompts Cheat Sheet', url: 'ai-tools-checklist.html' }
                ]
            },
            {
                id: 19,
                title: 'What Makes a Good Prompt',
                duration: '8 min',
                type: 'video',
                topicFolder: 'Generative_AI_for_Business,_Marketing_Emails,_Ideation,_and_Productivity',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779288369/03._What_makes_a_good_prompt_jhgi9j.mp4',
                description: 'Learn the principles of a strong AI prompt and how to structure requests for better results.',
                resources: [
                    { type: 'pdf', name: 'Good Prompt Formula', url: 'prompt-engineering-guide.html' }
                ]
            },
            {
                id: 20,
                title: 'Draft a Business Plan with AI',
                duration: '12 min',
                type: 'video',
                topicFolder: 'Generative_AI_for_Business,_Marketing_Emails,_Ideation,_and_Productivity',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779290687/01._Using_AI_to_draft_a_business_plan_jipyf9.mp4',
                description: 'Use AI to draft a business plan with structure, financials, and go-to-market strategy.',
                resources: [
                    { type: 'pdf', name: 'Business Plan Template', url: 'ai-tools-checklist.html' }
                ]
            },
            {
                id: 21,
                title: 'AI Business Plan Demo',
                duration: '11 min',
                type: 'video',
                topicFolder: 'Generative_AI_for_Business,_Marketing_Emails,_Ideation,_and_Productivity',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779291395/02._Demo_of_using_AI_to_draft_a_business_plan_rtcp46.mp4',
                description: 'See a hands-on demo of using AI to draft a business plan with real examples and guidance.',
                resources: [
                    { type: 'pdf', name: 'Business Plan Demo Notes', url: 'ai-tools-checklist.html' }
                ]
            },
            {
                id: 22,
                title: 'Analyze a Financial Report with AI',
                duration: '10 min',
                type: 'video',
                topicFolder: 'Generative_AI_for_Business,_Marketing_Emails,_Ideation,_and_Productivity',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779290728/03._Using_AI_to_analyze_a_financial_report_nligvs.mp4',
                description: 'Use AI to analyze a financial report and extract key insights for business decisions.',
                resources: [
                    { type: 'pdf', name: 'Financial Analysis Guide', url: 'ai-tools-checklist.html' }
                ]
            },
            {
                id: 23,
                title: 'Financial Report Analysis Demo',
                duration: '9 min',
                type: 'video',
                topicFolder: 'Generative_AI_for_Business,_Marketing_Emails,_Ideation,_and_Productivity',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779291257/04._Demo_of_using_AI_to_analyze_a_financial_report_ee8sth.mp4',
                description: 'Demo of using AI to analyze a financial report with practical examples and insights extraction.',
                resources: [
                    { type: 'pdf', name: 'Financial Report Demo Notes', url: 'ai-tools-checklist.html' }
                ]
            },
            {
                id: 24,
                title: 'Create a SWOT Analysis with AI',
                duration: '10 min',
                type: 'video',
                topicFolder: 'Generative_AI_for_Business,_Marketing_Emails,_Ideation,_and_Productivity',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779290733/05._Using_AI_to_create_a_SWOT_analysis_coeft0.mp4',
                description: 'Use AI to create a SWOT analysis for business planning and decision-making.',
                resources: [
                    { type: 'pdf', name: 'SWOT Analysis Template', url: 'ai-tools-checklist.html' }
                ]
            },
            {
                id: 25,
                title: 'SWOT Analysis Demo with AI',
                duration: '11 min',
                type: 'video',
                topicFolder: 'Generative_AI_for_Business,_Marketing_Emails,_Ideation,_and_Productivity',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779291459/06._Demo_of_using_AI_to_create_a_SWOT_analysis_dz4mfx.mp4',
                description: 'Watch a demo of using AI to create a SWOT analysis and interpret results for business strategy.',
                resources: [
                    { type: 'pdf', name: 'SWOT Analysis Demo Notes', url: 'ai-tools-checklist.html' }
                ]
            },
            {
                id: 26,
                title: 'Use AI for Career Coaching',
                duration: '10 min',
                type: 'video',
                topicFolder: 'Generative_AI_for_Business,_Marketing_Emails,_Ideation,_and_Productivity',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779290818/07._Using_AI_to_get_career_coaching_ssj9o4.mp4',
                description: 'Learn how to use AI coaching tools to plan career growth, refine goals, and prepare for interviews.',
                resources: [
                    { type: 'pdf', name: 'Career Coaching Guide', url: 'ai-tools-checklist.html' }
                ]
            },
            {
                id: 27,
                title: 'Career Coaching Demo with AI',
                duration: '11 min',
                type: 'video',
                topicFolder: 'Generative_AI_for_Business,_Marketing_Emails,_Ideation,_and_Productivity',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779291263/08._Demo_of_using_AI_to_get_career_coaching_gsg4c4.mp4',
                description: 'Watch a demo of using AI for career coaching and learn how to apply AI guidance to job search and development.',
                resources: [
                    { type: 'pdf', name: 'Career Coaching Demo Notes', url: 'ai-tools-checklist.html' }
                ]
            },
            {
                id: 28,
                title: 'Write a Project Proposal with AI',
                duration: '12 min',
                type: 'video',
                topicFolder: 'Generative_AI_for_Business,_Marketing_Emails,_Ideation,_and_Productivity',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779290877/09._Using_AI_to_write_a_project_proposal_c8rpw8.mp4',
                description: 'Use AI to draft a polished project proposal with scope, benefits, and delivery plans.',
                resources: [
                    { type: 'pdf', name: 'Project Proposal Template', url: 'ai-tools-checklist.html' }
                ]
            },
            {
                id: 29,
                title: 'Project Proposal Demo Subtitles',
                duration: '5 min',
                type: 'video',
                topicFolder: 'Generative_AI_for_Business,_Marketing_Emails,_Ideation,_and_Productivity',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/raw/upload/v1779290803/10._Demo_of_using_AI_to_write_a_project_proposal_miynqj.srt',
                description: 'Supplementary SRT file with the project proposal demo transcript for AI-generated proposal writing.',
                resources: [
                    { type: 'pdf', name: 'Project Proposal Demo Notes', url: 'ai-tools-checklist.html' }
                ]
            },
            {
                id: 30,
                title: 'Prepare for Your Annual Review with AI',
                duration: '10 min',
                type: 'video',
                topicFolder: 'Generative_AI_for_Business,_Marketing_Emails,_Ideation,_and_Productivity',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779290889/11._Using_AI_to_prepare_for_your_annual_review_oyuaxc.mp4',
                description: 'Learn how to use AI to prepare for your annual performance review with evidence, goals, and talking points.',
                resources: [
                    { type: 'pdf', name: 'Annual Review Prep Guide', url: 'ai-tools-checklist.html' }
                ]
            },
            {
                id: 31,
                title: 'Annual Review Demo with AI',
                duration: '11 min',
                type: 'video',
                topicFolder: 'Generative_AI_for_Business,_Marketing_Emails,_Ideation,_and_Productivity',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779291417/12._Demo_of_using_AI_to_prepare_for_your_annual_review_go4vql.mp4',
                description: 'Watch a demo of preparing for an annual review using AI, including evidence presentation and goal-setting.',
                resources: [
                    { type: 'pdf', name: 'Annual Review Demo Notes', url: 'ai-tools-checklist.html' }
                ]
            },
            {
                id: 32,
                title: 'Summarize a Research Paper with AI',
                duration: '10 min',
                type: 'video',
                topicFolder: 'Generative_AI_for_Business,_Marketing_Emails,_Ideation,_and_Productivity',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779290931/13._Using_AI_to_summarize_a_research_paper_ttfxcn.mp4',
                description: 'Learn how to use AI to summarize research papers efficiently and extract key findings.',
                resources: [
                    { type: 'pdf', name: 'Research Summary Template', url: 'ai-tools-checklist.html' }
                ]
            },
            {
                id: 33,
                title: 'Research Paper Summary Demo',
                duration: '11 min',
                type: 'video',
                topicFolder: 'Generative_AI_for_Business,_Marketing_Emails,_Ideation,_and_Productivity',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779291194/14._Demo_of_using_AI_to_summarize_a_research_paper_bhodrb.mp4',
                description: 'Watch a demo of how to use AI to summarize a research paper and capture the most important insights.',
                resources: [
                    { type: 'pdf', name: 'Research Summary Demo Notes', url: 'ai-tools-checklist.html' }
                ]
            },
            {
                id: 34,
                title: 'Optimize a Process with AI',
                duration: '12 min',
                type: 'video',
                topicFolder: 'Generative_AI_for_Business,_Marketing_Emails,_Ideation,_and_Productivity',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779290958/15._Using_AI_to_optimize_a_process_tr1yz6.mp4',
                description: 'Learn how to use AI to optimize a business process, reduce waste, and improve efficiency.',
                resources: [
                    { type: 'pdf', name: 'Process Optimization Guide', url: 'ai-tools-checklist.html' }
                ]
            },
            {
                id: 35,
                title: 'Process Optimization Demo',
                duration: '13 min',
                type: 'video',
                topicFolder: 'Generative_AI_for_Business,_Marketing_Emails,_Ideation,_and_Productivity',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779291140/16._Demo_of_using_AI_to_optimize_a_process_hvnoz9.mp4',
                description: 'Watch a practical demo of using AI to optimize a process and improve operational performance.',
                resources: [
                    { type: 'pdf', name: 'Process Optimization Demo Notes', url: 'ai-tools-checklist.html' }
                ]
            },
            {
                id: 36,
                title: 'Create a Data Analysis Report with AI',
                duration: '12 min',
                type: 'video',
                topicFolder: 'Generative_AI_for_Business,_Marketing_Emails,_Ideation,_and_Productivity',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779290999/17._Using_AI_to_create_a_data_analysis_report_bpx2hq.mp4',
                description: 'Learn how AI can help create a data analysis report and surface key findings quickly.',
                resources: [
                    { type: 'pdf', name: 'Data Analysis Report Guide', url: 'ai-tools-checklist.html' }
                ]
            },
            {
                id: 37,
                title: 'Data Analysis Report Demo',
                duration: '13 min',
                type: 'video',
                topicFolder: 'Generative_AI_for_Business,_Marketing_Emails,_Ideation,_and_Productivity',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779291403/18._Demo_of_using_AI_to_create_a_data_analysis_report_usmxf0.mp4',
                description: 'Watch a demo of AI creating a data analysis report with real examples and insights.',
                resources: [
                    { type: 'pdf', name: 'Data Analysis Report Demo Notes', url: 'ai-tools-checklist.html' }
                ]
            },
            {
                id: 38,
                title: 'Create Training Material with AI',
                duration: '12 min',
                type: 'video',
                topicFolder: 'Generative_AI_for_Business,_Marketing_Emails,_Ideation,_and_Productivity',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779291157/19._Using_AI_to_create_training_material_vredzc.mp4',
                description: 'Learn how to use AI to create effective training materials quickly and consistently.',
                resources: [
                    { type: 'pdf', name: 'Training Material Guide', url: 'ai-tools-checklist.html' }
                ]
            },
            {
                id: 39,
                title: 'Training Material Demo',
                duration: '13 min',
                type: 'video',
                topicFolder: 'Generative_AI_for_Business,_Marketing_Emails,_Ideation,_and_Productivity',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779291428/20._Demo_of_using_AI_to_create_training_material_th4hth.mp4',
                description: 'Watch a demo of using AI to create training materials with practical examples and templates.',
                resources: [
                    { type: 'pdf', name: 'Training Material Demo Notes', url: 'ai-tools-checklist.html' }
                ]
            },
            {
                id: 40,
                title: 'Summary and Next Steps',
                duration: '10 min',
                type: 'video',
                topicFolder: 'Generative_AI_for_Business,_Marketing_Emails,_Ideation,_and_Productivity',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779302061/01._Summary_and_next_steps_iuor8z.mp4',
                description: 'Course summary and recommended next steps to apply AI tools in projects and workflows.',
                resources: [
                    { type: 'pdf', name: 'Course Next Steps', url: 'ai-tools-checklist.html' }
                ]
            },
            {
                id: 41,
                title: 'Congratulations on Completing this Course',
                duration: '8 min',
                type: 'video',
                topicFolder: 'Generative_AI_for_Business,_Marketing_Emails,_Ideation,_and_Productivity',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779303047/001_Congratulations_on_Completing_this_Course_ssrqvk.mp4',
                description: 'Celebrate course completion and review the key takeaways for applying AI tools successfully.',
                resources: [
                    { type: 'pdf', name: 'Course Completion Guide', url: 'ai-tools-checklist.html' }
                ]
            }
        ]
    },
    'web-dev': {
        title: 'Modern Web Development',
        description: 'Build responsive websites with HTML, CSS, JavaScript, and modern frameworks.',
        category: 'Programming & Development',
        assetFolder: 'Modern web development',
        totalLessons: 44,
        totalDuration: '12 hours',
        rating: '4.9',
        reviews: '1.8k',
        students: '12,000+',
        lessons: [
            {
                id: 1,
                title: 'VS Code in 100 Seconds',
                duration: '5 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779304861/VS_Code_in_100_Seconds_d7uovl.mp4',
                description: 'Quick introduction to Visual Studio Code — the essential code editor for modern web development.',
                resources: [
                    { type: 'pdf', name: 'Web Dev Setup Guide', url: 'web-dev-setup.html' },
                    { type: 'link', name: 'VS Code Official Site', url: 'https://code.visualstudio.com' }
                ]
            },
            {
                id: 2,
                title: 'What You\'ll Get in This Course',
                duration: '8 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779306211/001_What_You_ll_Get_in_This_Course_ykz9zd.mp4',
                description: 'Overview of course content, learning outcomes, and skills you\'ll master in Modern Web Development.',
                resources: [
                    { type: 'pdf', name: 'Course Roadmap', url: 'web-dev-roadmap.html' }
                ]
            },
            {
                id: 3,
                title: 'How Does the Internet Actually Work',
                duration: '12 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779307043/005_How_Does_the_Internet_Actually_Work_fab979.mp4',
                description: 'Learn the fundamentals of how the internet works — DNS, HTTP, servers, and client-server architecture.',
                resources: [
                    { type: 'pdf', name: 'Internet Basics Guide', url: 'internet-guide.html' }
                ]
            },
            {
                id: 4,
                title: 'How Do Websites Actually Work',
                duration: '10 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779307120/006_How_Do_Websites_Actually_Work_eipj8s.mp4',
                description: 'Understand how websites are built and served, including browsers, hosting, and HTML rendering.',
                resources: [
                    { type: 'pdf', name: 'Website Mechanics Guide', url: 'website-mechanics.html' }
                ]
            },
            {
                id: 5,
                title: 'How to Get the Most Out of the Course',
                duration: '9 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779307042/007_How_to_Get_the_Most_Out_of_the_Course_vofmqt.mp4',
                description: 'Discover tips for staying engaged, practicing effectively, and getting the most value from this web development course.',
                resources: [
                    { type: 'pdf', name: 'Course Success Tips', url: 'course-success-tips.html' }
                ]
            },
            {
                id: 6,
                title: 'How to Get Help When You\'re Stuck',
                duration: '7 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779307035/008_How_to_Get_Help_When_You_re_Stuck_fwvezt.mp4',
                description: 'Learn where to find help, use community resources, and overcome obstacles while learning web development.',
                resources: [
                    { type: 'link', name: 'Community Support Guide', url: 'https://developer.mozilla.org' }
                ]
            },
            {
                id: 7,
                title: 'What is HTML',
                duration: '10 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779308996/002_What_is_HTML_kmugwo.mp4',
                description: 'Learn the basics of HTML and how it structures web pages for the browser.',
                resources: [
                    { type: 'pdf', name: 'HTML Basics Guide', url: 'html-basics.html' }
                ]
            },
            {
                id: 8,
                title: 'How to Download the Course Resources',
                duration: '6 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779308961/003_How_to_Download_the_Course_Resources_be5dvq.mp4',
                description: 'Learn how to download and organize the course resources needed for web development practice.',
                resources: [
                    { type: 'pdf', name: 'Resource Download Guide', url: 'resource-downloads.html' }
                ]
            },
            {
                id: 9,
                title: 'HTML Heading Elements',
                duration: '7 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779309857/004_HTML_Heading_Elements_wby11n.mp4',
                description: 'Learn how HTML heading elements work and how to structure page content semantically.',
                resources: [
                    { type: 'pdf', name: 'HTML Headings Guide', url: 'html-headings.html' }
                ]
            }
            ,
            {
                id: 10,
                title: 'HTML Paragraph Elements',
                duration: '6 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779310538/005_HTML_Paragraph_Elements_oy3jzj.mp4',
                description: 'Learn how to use paragraph tags and structure textual content semantically in HTML.',
                resources: [
                    { type: 'pdf', name: 'HTML Paragraphs Guide', url: 'html-paragraphs.html' }
                ]
            }
            ,
            {
                id: 11,
                title: 'Self-Closing Tags',
                duration: '5 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779311258/006_Self_Closing_Tags_jvgka7.mp4',
                description: 'Understand self-closing tags in HTML and when to use them effectively.',
                resources: [
                    { type: 'pdf', name: 'Self-Closing Tags Reference', url: 'self-closing-tags.html' }
                ]
            }
            ,
            {
                id: 12,
                title: 'Project: Movie Ranking',
                duration: '14 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779311374/007_Project_Movie_Ranking_xws3xy.mp4',
                description: 'Build a small movie ranking project to apply HTML structure and basic interactivity.',
                resources: [
                    { type: 'pdf', name: 'Project Starter Files', url: 'project-movie-ranking.zip' }
                ]
            }
            ,
            {
                id: 13,
                title: 'How to Ace this Course',
                duration: '8 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779311809/008_How_to_Ace_this_Course_mizuvk.mp4',
                description: 'Tips and strategies to get the most from this course and succeed in your projects and assessments.',
                resources: [
                    { type: 'pdf', name: 'Course Success Checklist', url: 'course-success-checklist.pdf' }
                ]
            }
            ,
            {
                id: 14,
                title: 'Why do we need CSS?',
                duration: '10 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779350544/001_Why_do_we_need_CSS_qpzomh.mp4',
                description: 'Understand why CSS is essential for styling web pages and separating content from presentation.',
                resources: [
                    { type: 'pdf', name: 'CSS Basics Guide', url: 'css-basics-guide.pdf' }
                ]
            }
            ,
            {
                id: 15,
                title: 'How to add CSS',
                duration: '12 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779351202/002_How_to_add_CSS_olltqe.mp4',
                description: 'Learn how to add CSS to your HTML pages using inline, internal, and external stylesheets.',
                resources: [
                    { type: 'pdf', name: 'CSS Linking Guide', url: 'css-linking-guide.pdf' }
                ]
            }
            ,
            {
                id: 16,
                title: 'CSS Selectors',
                duration: '10 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779356485/004_CSS_Selectors_yc7lkl.mp4',
                description: 'Learn CSS selectors and how to target HTML elements for styling efficiently.',
                resources: [
                    { type: 'pdf', name: 'CSS Selectors Cheat Sheet', url: 'css-selectors-cheat-sheet.pdf' }
                ]
            }
            ,
            {
                id: 17,
                title: 'Project: Colour Vocab Website',
                duration: '14 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779351269/005_Project_Colour_Vocab_Website_o2shqb.mp4',
                description: 'Build a colour vocabulary website project to practice CSS and layout for visual design.',
                resources: [
                    { type: 'pdf', name: 'Colour Vocab Project Guide', url: 'colour-vocab-project-guide.pdf' }
                ]
            }
            ,
            {
                id: 18,
                title: 'Tip from Angela - Dealing with Distractions',
                duration: '9 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779351110/006_Tip_from_Angela_-_Dealing_with_Distractions_p3qcbv.mp4',
                description: 'Learn practical tips from Angela on minimizing distractions and staying focused while learning web development.',
                resources: [
                    { type: 'pdf', name: 'Focus and Productivity Guide', url: 'focus-productivity-guide.pdf' }
                ]
            }
            ,
            {
                id: 19,
                title: 'CSS Display',
                duration: '11 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779357838/001_CSS_Display_fcznib.mp4',
                description: 'Learn how CSS display values control layout behavior and how to use them for page structure.',
                resources: [
                    { type: 'pdf', name: 'CSS Display Reference', url: 'css-display-reference.pdf' }
                ]
            }
            ,
            {
                id: 20,
                title: 'CSS Float',
                duration: '9 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779358383/002_CSS_Float_urnxre.mp4',
                description: 'Learn how CSS float works and how to use it to position elements on a page.',
                resources: [
                    { type: 'pdf', name: 'CSS Float Guide', url: 'css-float-guide.pdf' }
                ]
            }
            ,
            {
                id: 21,
                title: 'Media Queries',
                duration: '10 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779358318/004_Media_Queries_hkhses.mp4',
                description: 'Learn how to use media queries to make responsive layouts that adapt to different screen sizes.',
                resources: [
                    { type: 'pdf', name: 'Media Query Cheat Sheet', url: 'media-query-cheat-sheet.pdf' }
                ]
            }
            ,
            {
                id: 22,
                title: 'Project: Web Design Agency Website',
                duration: '15 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779358319/005_Project_Web_Design_Agency_Website_eq33vd.mp4',
                description: 'Build a web design agency website project to practice responsive layouts and visual styling.',
                resources: [
                    { type: 'pdf', name: 'Web Agency Project Guide', url: 'web-agency-project-guide.pdf' }
                ]
            }
            ,
            {
                id: 23,
                title: 'Introduction to JavaScript',
                duration: '14 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779361692/002_Introduction_to_Javascript_jfav0g.mp4',
                description: 'Get introduced to JavaScript: variables, functions, and how scripts add interactivity to web pages.',
                resources: [
                    { type: 'pdf', name: 'JS Quickstart', url: 'js-quickstart.pdf' }
                ]
            }
            ,
            {
                id: 24,
                title: 'Backend Tools and Technologies',
                duration: '16 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779360096/002_Backend_Tools_and_Technologies_-_Which_one_to_learn_eiqppf.mp4',
                description: 'Overview of backend tools and technologies and guidance on which to learn next.',
                resources: [
                    { type: 'pdf', name: 'Backend Tools Guide', url: 'backend-tools-guide.pdf' }
                ]
            },
            {
                id: 25,
                title: 'Advanced JavaScript Patterns',
                duration: '18 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779361692/002_Introduction_to_Javascript_jfav0g.mp4',
                description: 'Explore advanced JavaScript patterns, best practices, and techniques for more maintainable, modular code.',
                resources: [
                    { type: 'pdf', name: 'Advanced JS Patterns', url: 'advanced-js-patterns.pdf' }
                ]
            },
            {
                id: 26,
                title: 'JavaScript Alerts & Website Behavior',
                duration: '12 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779365392/003_Javascript_Alerts_-_Adding_Behaviour_to_Websites_ccizix.mp4',
                description: 'Learn how to use JavaScript alerts and add interactive behavior to web pages with event-driven scripting.',
                resources: [
                    { type: 'pdf', name: 'JavaScript Alerts Guide', url: 'js-alerts-guide.pdf' }
                ]
            },
            {
                id: 27,
                title: 'JavaScript Data Types',
                duration: '13 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779361323/004_Data_Types_mqrgdc.mp4',
                description: 'Understand JavaScript data types and how to use them for reliable, bug-resistant code.',
                resources: [
                    { type: 'pdf', name: 'JavaScript Data Types Guide', url: 'js-data-types-guide.pdf' }
                ]
            },
            {
                id: 28,
                title: 'JavaScript Variables',
                duration: '11 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779361706/005_Javascript_Variables_fxxsra.mp4',
                description: 'Learn how JavaScript variables work and how to store, update, and use values in your web apps.',
                resources: [
                    { type: 'pdf', name: 'JavaScript Variables Guide', url: 'js-variables-guide.pdf' }
                ]
            },
            {
                id: 29,
                title: 'JavaScript Variables Exercise Start',
                duration: '10 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779361263/006_Javascript_Variables_Exercise_Start_dorgb6.mp4',
                description: 'Start the JavaScript variables exercise and practice using variables in a real coding challenge.',
                resources: [
                    { type: 'pdf', name: 'Variables Exercise Workbook', url: 'js-variables-exercise-workbook.pdf' }
                ]
            },
            {
                id: 30,
                title: 'Naming and Naming Conventions for JavaScript Variables',
                duration: '12 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779361722/009_Naming_and_Naming_Conventions_for_Javascript_Variables_r2gzda.mp4',
                description: 'Learn how to name JavaScript variables clearly and consistently using naming conventions for cleaner code.',
                resources: [
                    { type: 'pdf', name: 'JS Naming Conventions Guide', url: 'js-naming-conventions-guide.pdf' }
                ]
            },
            {
                id: 31,
                title: 'String Concatenation',
                duration: '11 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779361574/011_String_Concatenation_z8j7qk.mp4',
                description: 'Learn how to join strings in JavaScript and build dynamic text for your web applications.',
                resources: [
                    { type: 'pdf', name: 'String Concatenation Guide', url: 'js-string-concatenation-guide.pdf' }
                ]
            },
            {
                id: 32,
                title: 'String Lengths and Character Count',
                duration: '12 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779361677/012_String_Lengths_and_Retrieving_the_Number_of_Characters_ho5o2z.mp4',
                description: 'Learn how to get string length in JavaScript and retrieve the number of characters in text values.',
                resources: [
                    { type: 'pdf', name: 'String Length Guide', url: 'js-string-length-guide.pdf' }
                ]
            },
            {
                id: 33,
                title: 'String Slicing and Extraction',
                duration: '13 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779361864/013_Slicing_and_Extracting_Parts_of_a_String_gccxug.mp4',
                description: 'Discover how to extract parts of a string in JavaScript using slicing, substring, and related methods.',
                resources: [
                    { type: 'pdf', name: 'String Slicing Guide', url: 'js-string-slicing-guide.pdf' }
                ]
            },
            {
                id: 34,
                title: 'Build a Drum Kit',
                duration: '18 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779380554/001_What_We_ll_Make_Drum_Kit_iguzla.mp4',
                description: 'Build an interactive drum kit web app using JavaScript event listeners and sound playback.',
                resources: [
                    { type: 'pdf', name: 'Drum Kit Project Guide', url: 'drum-kit-project-guide.pdf' }
                ]
            },
            {
                id: 35,
                title: 'Adding Event Listeners to a Button',
                duration: '10 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779433223/003_Adding_Event_Listeners_to_a_Button_nnkvcs.mp4',
                description: 'Learn how to attach event listeners to buttons to handle clicks and other user interactions.',
                resources: [
                    { type: 'pdf', name: 'Event Listeners Guide', url: 'event-listeners-guide.pdf' }
                ]
            },
            {
                id: 36,
                title: 'Higher-Order Functions',
                duration: '14 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779433839/004_Higher_Order_Functions_and_Passing_Functions_as_Arguments_caqqma.mp4',
                description: 'Understand higher-order functions and how to pass functions as arguments to other functions in JavaScript.',
                resources: [
                    { type: 'pdf', name: 'Higher-Order Functions Guide', url: 'higher-order-functions-guide.pdf' }
                ]
            },
            {
                id: 37,
                title: 'Playing Sounds on a Website',
                duration: '12 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779434523/006_How_to_Play_Sounds_on_a_Website_egcjzn.mp4',
                description: 'Learn how to play sound effects and music on a website using the Web Audio API and HTML5 audio.',
                resources: [
                    { type: 'pdf', name: 'Playing Sounds Guide', url: 'playing-sounds-guide.pdf' }
                ]
            },
            {
                id: 38,
                title: 'A Deeper Understanding of Javascript Objects',
                duration: '15 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779434549/007_A_Deeper_Understanding_of_Javascript_Objects_btcolu.mp4',
                description: 'Dive deeper into JavaScript objects, understanding their structure, methods, and how to work with them effectively.',
                resources: [
                    { type: 'pdf', name: 'JavaScript Objects Deep Dive', url: 'js-objects-deep-dive.pdf' }
                ]
            },
            {
                id: 39,
                title: 'How to Use Switch Statements in Javascript',
                duration: '12 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779434397/008_How_to_Use_Switch_Statements_in_Javascript_xhzhbx.mp4',
                description: 'Learn how to control program flow using switch statements for cleaner conditional logic.',
                resources: [
                    { type: 'pdf', name: 'Switch Statements Guide', url: 'switch-statements-guide.pdf' }
                ]
            },
            {
                id: 40,
                title: 'Objects, their Methods, and the Dot Notation',
                duration: '13 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779434433/009_Objects_their_Methods_and_the_Dot_Notation_wfddtu.mp4',
                description: 'Learn how to use object methods and dot notation to access and manipulate JavaScript object properties.',
                resources: [
                    { type: 'pdf', name: 'Object Methods Guide', url: 'object-methods-guide.pdf' }
                ]
            }
        ]
    },
    'freelance': {
        title: 'Freelancing Mastery',
        description: 'Launch your freelance career with client acquisition, pricing, and project management.',
        category: 'Business & Freelancing',
        assetFolder: 'Freelancing mastery',
        totalLessons: 20,
        totalDuration: '6 hours',
        rating: '4.7',
        reviews: '950',
        students: '8,000+',
        lessons: [
            {
                id: 1,
                title: 'Freelancing Mindset',
                duration: '10 min',
                type: 'video',
                completed: false,
                videoUrl: 'lesson-1.mp4',
                description: 'Develop the right mindset for freelancing success and learn what it takes to be a successful freelancer.',
                resources: [
                    { type: 'pdf', name: 'Freelancer Mindset Guide', url: 'freelancer-mindset-guide.pdf' }
                ]
            }
        ]
    },
    'premium': {
        title: 'Premium Growth Pass',
        description: 'Unlock premium mastery modules with advanced projects, exclusive resources, and career acceleration tools.',
        category: 'Premium & Career Growth',
        assetFolder: 'Premium course',
        totalLessons: 12,
        totalDuration: '20 hours',
        rating: '5.0',
        reviews: '1.2k',
        students: '3,500+',
        lessons: [
            {
                id: 1,
                title: 'Premium Launch Strategy',
                duration: '15 min',
                type: 'video',
                completed: false,
                videoUrl: '',
                description: 'Learn how to package your skills, define premium offers, and set up a strong growth path.',
                resources: [
                    { type: 'pdf', name: 'Premium Launch Checklist', url: '#' }
                ]
            },
            {
                id: 2,
                title: 'Premium Project Roadmap',
                duration: '18 min',
                type: 'video',
                completed: false,
                videoUrl: '',
                description: 'Build your own high-value project roadmap that attracts real clients and remote income.',
                resources: [
                    { type: 'pdf', name: 'Premium Project Planner', url: '#' }
                ]
            }
        ]
    },
    'cybersecurity': {
        title: 'Cybersecurity Essentials',
        description: 'Learn the fundamentals of cybersecurity, online safety, and threat awareness for the modern internet.',
        category: 'Security & IT',
        assetFolder: 'cybersecurity essentials',
        totalLessons: 7,
        totalDuration: '56 min',
        rating: '4.6',
        reviews: '1.1k',
        students: '9,800+',
        lessons: [
            {
                id: 1,
                title: 'Introduction',
                duration: '8 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779438969/001_Introduction_tzcjtg.mp4',
                description: 'Get introduced to the fundamentals of cybersecurity, threat awareness, and safe online behavior.',
                resources: [
                    { type: 'pdf', name: 'Course Syllabus', url: 'course-syllabus.html' }
                ]
            },
            {
                id: 2,
                title: 'Center for Internet Security',
                duration: '8 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779438723/002_Center_for_Internet_Security_cxnmmm.mov',
                description: 'Learn about the Center for Internet Security and how its controls help secure systems and networks.',
                resources: [
                    { type: 'pdf', name: 'CIS Controls Overview', url: 'cis-controls-overview.pdf' }
                ]
            },
            {
                id: 3,
                title: 'Kali Linux installation',
                duration: '8 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779439292/003_Kali_Linux_installation_hnq3nl.mp4',
                description: 'Step-by-step Kali Linux installation and basic setup for security testing labs.',
                resources: [
                    { type: 'pdf', name: 'Kali Installation Guide', url: 'kali-installation-guide.pdf' }
                ]
            }
            ,
            {
                id: 4,
                title: 'Weaponizing Windows 1',
                duration: '8 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779441749/004_Weaponizing_Windows_1_geku7a.mov',
                description: 'Introductory techniques for weaponizing Windows in security testing labs.',
                resources: [
                    { type: 'pdf', name: 'Weaponizing Windows Guide', url: 'weaponizing-windows-guide.pdf' }
                ]
            },
            {
                id: 5,
                title: 'NGROK: Connecting Servers To Internet',
                duration: '8 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779442622/005_NGROK_Connecting_Servers_To_Internet_khtkgz.mp4',
                description: 'Learn how to use NGROK to securely connect local servers to the internet for testing and remote access.',
                resources: [
                    { type: 'pdf', name: 'NGROK Setup Guide', url: 'ngrok-setup-guide.pdf' }
                ]
            },
            {
                id: 6,
                title: 'Kali Linux features and functions for ethical hacking 1',
                duration: '8 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779455482/006_Kali_Linux_features_and_functions_for_ethical_hacking_1_pzbfh2.mp4',
                description: 'Explore the features and functions of Kali Linux for ethical hacking and penetration testing.',
                resources: [
                    { type: 'pdf', name: 'Kali Linux Features Guide', url: 'kali-linux-features-guide.pdf' }
                ]
            },
            {
                id: 7,
                title: 'Install Kali Linux on Windows',
                duration: '8 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779455767/007_Install_Kali_Linux_on_Windows_amx1p4.mp4',
                description: 'Step-by-step guide to installing Kali Linux on Windows using WSL or virtualization.',
                resources: [
                    { type: 'pdf', name: 'Kali Windows Installation Guide', url: 'kali-windows-installation-guide.pdf' }
                ]
            },
            {
                id: 8,
                title: 'Web Servers VS Applications',
                duration: '8 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779457243/1.Web_Servers_VS_Applications_onan8s.mp4',
                description: 'Understand the difference between web servers and web applications, and how they interact.',
                resources: [
                    { type: 'pdf', name: 'Web Servers vs Applications Guide', url: 'web-servers-vs-applications-guide.pdf' }
                ]
            },
            {
                id: 9,
                title: 'Vulnerability Scanning with Acunetix',
                duration: '8 min',
                type: 'video',
                completed: false,
                videoUrl: 'https://res.cloudinary.com/dng0zi4lo/video/upload/v1779457510/2.Vulnerability_Scanning_with_Acunetix_wr7hfv.mp4',
                description: 'Learn how to scan for web vulnerabilities using Acunetix and interpret the results.',
                resources: [
                    { type: 'pdf', name: 'Acunetix Vulnerability Scanning Guide', url: 'acunetix-vulnerability-scanning-guide.pdf' }
                ]
            }
        ]
    }
};

let currentLessonIndex = 0;
let courseProgress = JSON.parse(localStorage.getItem(`courseProgress_${courseId}`)) || {};

function getAssetUrl(course, fileName, subfolder) {
    if (!fileName) return '';
    if (/^(https?:)?\/\//.test(fileName) || fileName.startsWith('/')) {
        return fileName;
    }

    let folderPath = `assets/${course.assetFolder}`;
    if (subfolder) {
        folderPath += `/${subfolder}`;
    }

    return encodeURI(`${folderPath}/${fileName}`);
}

function getResourceUrl(course, resource, lesson) {
    if (!resource || !resource.url) return '#';
    if (resource.type === 'link' || /^(https?:)?\/\//.test(resource.url) || resource.url.startsWith('/')) {
        return resource.url;
    }
    return getAssetUrl(course, resource.url, lesson?.topicFolder);
}

function getVideoSourceType(url) {
    if (!url) return 'video/mp4';
    const lowered = url.split('?')[0].toLowerCase();
    if (lowered.endsWith('.m3u8')) return 'application/x-mpegURL';
    if (lowered.endsWith('.mpd')) return 'application/dash+xml';
    return 'video/mp4';
}

function formatTopicName(topicFolder) {
    if (!topicFolder) return '';
    return topicFolder
        .replace(/_/g, ' ')
        .replace(/\s+,\s+/g, ', ')
        .trim();
}

function initializeCourse() {
    const course = courses[courseId];
    if (!course) {
        window.location.href = 'courses.html';
        return;
    }

    // Update course header
    document.getElementById('courseTitle').textContent = course.title;
    document.getElementById('courseDescription').textContent = course.description;
    document.querySelector('.course-category').textContent = course.category;

    // Update progress
    updateProgress();

    // Load lessons
    loadLessons();

    // Load current lesson
    loadLesson(currentLessonIndex);
}

function loadLessons() {
    const course = courses[courseId];
    const lessonsList = document.getElementById('lessonsList');

    lessonsList.innerHTML = '';

    course.lessons.forEach((lesson, index) => {
        const lessonItem = document.createElement('div');
        lessonItem.className = `lesson-item ${lesson.completed ? 'completed' : ''} ${index === currentLessonIndex ? 'active' : ''}`;
        lessonItem.onclick = () => selectLesson(index);

        lessonItem.innerHTML = `
            <div class="lesson-status">
                ${lesson.completed ? '✓' : index + 1}
            </div>
            <div class="lesson-info">
                <div class="lesson-title">${lesson.title}</div>
                <div class="lesson-meta">${lesson.duration} • ${lesson.type}</div>
            </div>
        `;

        lessonsList.appendChild(lessonItem);
    });
}

function selectLesson(index) {
    currentLessonIndex = index;
    loadLessons();
    loadLesson(index);
}

function loadLesson(index) {
    const course = courses[courseId];
    const lesson = course.lessons[index];

    if (!lesson) return;

    // Update lesson header
    document.getElementById('currentLessonTitle').textContent = lesson.title;
    document.querySelector('.lesson-duration').textContent = lesson.duration;
    document.querySelector('.lesson-type').textContent = lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1);

    const courseTopicEl = document.getElementById('courseTopic');
    if (courseTopicEl) {
        const topicName = formatTopicName(lesson.topicFolder || course.topicFolder);
        courseTopicEl.textContent = topicName ? `Topic: ${topicName}` : '';
    }

    // Update video container
    const videoUrl = lesson.videoUrl ? getAssetUrl(course, lesson.videoUrl, lesson.topicFolder) : '';
    const videoContainer = document.getElementById('videoContainer');

    if (videoUrl) {
        const sourceType = getVideoSourceType(videoUrl);
        videoContainer.innerHTML = `
            <div class="video-player">
                <video controls preload="metadata">
                    <source src="${videoUrl}" type="${sourceType}">
                    Your browser does not support the video tag.
                </video>
            </div>
        `;

        const videoElement = videoContainer.querySelector('video');
        if (videoElement) {
            videoElement.addEventListener('ended', () => {
                markLessonCompleted(currentLessonIndex);
            });
            videoElement.play().catch(() => {
                // autoplay may require additional user interaction in some browsers
            });
        }
    } else {
        videoContainer.innerHTML = `
            <div class="video-player video-placeholder">
                <div class="placeholder-text">
                    <h3>Premium lesson content is coming soon.</h3>
                    <p>Check back for the full premium learning experience once you unlock access.</p>
                </div>
            </div>
        `;
    }

    // Update lesson content
    document.getElementById('lessonDescription').innerHTML = lesson.description;

    // Update resources
    const resourcesContainer = document.getElementById('lessonResources');
    if (lesson.resources && lesson.resources.length > 0) {
        resourcesContainer.innerHTML = `
            <h4>Resources</h4>
            <div class="resource-list">
                ${lesson.resources.map(resource => `
                    <div class="resource-item">
                        <span class="resource-icon">${getResourceIcon(resource.type)}</span>
                        <a href="${getResourceUrl(course, resource, lesson)}" class="resource-link" ${resource.type === 'link' ? 'target="_blank"' : ''}>${resource.name}</a>
                    </div>
                `).join('')}
            </div>
        `;
    } else {
        resourcesContainer.innerHTML = '';
    }

    // Update navigation
    updateNavigation();
}

function getResourceIcon(type) {
    switch (type) {
        case 'pdf': return '📄';
        case 'link': return '🔗';
        case 'doc': return '📋';
        default: return '📄';
    }
}

function playVideo(videoUrl) {
    const videoContainer = document.getElementById('videoContainer');
    const sourceType = getVideoSourceType(videoUrl);
    videoContainer.innerHTML = `
        <div class="video-player">
            <video controls autoplay style="width: 100%; max-height: 400px; background: #000;">
                <source src="${videoUrl}" type="${sourceType}">
                Your browser does not support the video tag.
            </video>
        </div>
    `;

    // Mark lesson as completed when video ends
    const video = videoContainer.querySelector('video');
    video.addEventListener('ended', () => {
        markLessonCompleted(currentLessonIndex);
    });
}

function markLessonCompleted(index) {
    const course = courses[courseId];
    course.lessons[index].completed = true;
    courseProgress[index] = true;
    localStorage.setItem(`courseProgress_${courseId}`, JSON.stringify(courseProgress));
    updateProgress();
    loadLessons();
}

function updateProgress() {
    const course = courses[courseId];
    const completedLessons = course.lessons.filter(lesson => lesson.completed).length;
    const progressPercent = Math.round((completedLessons / course.lessons.length) * 100);

    document.getElementById('progressFill').style.width = `${progressPercent}%`;
    document.getElementById('progressPercent').textContent = `${progressPercent}%`;
}

function updateNavigation() {
    const prevBtn = document.getElementById('prevLesson');
    const nextBtn = document.getElementById('nextLesson');

    prevBtn.disabled = currentLessonIndex === 0;
    nextBtn.disabled = currentLessonIndex === courses[courseId].lessons.length - 1;

    prevBtn.onclick = () => currentLessonIndex > 0 && selectLesson(currentLessonIndex - 1);
    nextBtn.onclick = () => currentLessonIndex < courses[courseId].lessons.length - 1 && selectLesson(currentLessonIndex + 1);
}

// Logout functionality
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('logout-link')) {
        e.preventDefault();
        localStorage.removeItem('authToken');
        localStorage.removeItem('welcomeName');
        localStorage.removeItem('authExpertise');
        window.location.href = 'login.html';
    }
});

// Initialize course when page loads
window.addEventListener('DOMContentLoaded', async () => {
    const allowed = await ensurePremiumAccess();
    if (!allowed) {
        window.location.href = 'premium.html';
        return;
    }
    initializeCourse();
});
