const dayPlan = [
    {
        level: 'Level 1 of 5',
        title: 'Confirm the Requirement',
        npc: 'Ms. Chen · Bank PM',
        npcLine: 'We need to confirm the reporting requirement before UAT starts.',
        lesson: 'Use \u201cCould you walk me through...\u201d when you want a bank client to explain a requirement step by step. It sounds professional and collaborative.',
        mode: 'Shadowing',
        target: 'Could you walk me through the reporting requirement?',
        hint: '\u8bf7\u8ddf\u8bfb\uff1a\u4f60\u80fd\u5e26\u6211\u8fc7\u4e00\u4e0b\u62a5\u8868\u9700\u6c42\u5417\uff1f',
        keywords: ['walk me through', 'requirement', 'reporting'],
        xp: 12
    },
    {
        level: 'Level 2 of 5',
        title: 'Sync with QA',
        npc: 'Mia \u00b7 QA Teammate',
        npcLine: 'I can prepare the UAT test cases once the reporting fields are confirmed.',
        lesson: 'When speaking with teammates, you can be direct but still clear. Use \u201conce...\u201d to connect a dependency with the next action.',
        mode: 'Team sync',
        target: 'Mia can prepare the UAT test cases once the reporting fields are confirmed.',
        hint: '\u8bf7\u590d\u8ff0\u540c\u4e8b\u7684\u610f\u601d\uff1a\u62a5\u8868\u5b57\u6bb5\u786e\u8ba4\u540e\uff0cMia \u53ef\u4ee5\u51c6\u5907 UAT \u6d4b\u8bd5\u7528\u4f8b\u3002',
        keywords: ['UAT test cases', 'once', 'reporting fields'],
        xp: 14
    },
    {
        level: 'Level 3 of 5',
        title: 'Ask the Developer',
        npc: 'Ravi \u00b7 Backend Engineer',
        npcLine: 'The refresh frequency depends on the batch job schedule.',
        lesson: 'For internal technical questions, ask for the reason behind a constraint. \u201cWhat drives...\u201d is a useful way to ask why something depends on something else.',
        mode: 'Internal question',
        target: 'What drives the batch job schedule, and can we adjust it for this report?',
        hint: '\u8bf7\u95ee\u6280\u672f\u540c\u4e8b\uff1a\u6279\u5904\u7406\u8ba1\u5212\u7531\u4ec0\u4e48\u51b3\u5b9a\uff1f\u8fd9\u4e2a\u62a5\u8868\u80fd\u4e0d\u80fd\u8c03\u6574\uff1f',
        keywords: ['batch job schedule', 'adjust', 'report'],
        xp: 16
    },
    {
        level: 'Level 4 of 5',
        title: 'Reply to the Bank',
        npc: 'Mr. Wong \u00b7 Bank IT',
        npcLine: 'Can you confirm the data refresh frequency?',
        lesson: 'A good client reply starts with acknowledgement, then gives the next action. \u201cUnderstood. We will confirm...\u201d is clear and safe.',
        mode: 'Client reply',
        target: 'Understood. We will confirm the data refresh frequency with our technical team.',
        hint: '\u8bf7\u56de\u5e94\u5ba2\u6237\uff1a\u660e\u767d\uff0c\u6211\u4eec\u4f1a\u548c\u6280\u672f\u56e2\u961f\u786e\u8ba4\u6570\u636e\u5237\u65b0\u9891\u7387\u3002',
        keywords: ['understood', 'confirm', 'data refresh frequency'],
        xp: 18
    },
    {
        level: 'Level 5 of 5',
        title: 'Boss Review',
        npc: 'Alex \u00b7 Delivery Lead',
        npcLine: 'Give me a quick update on the bank reporting request.',
        lesson: 'For an internal update, summarize the client need and the next action in one sentence. Keep it short and specific.',
        mode: 'Daily recap',
        target: 'The bank needs the reporting fields confirmed, and our team is checking the refresh frequency.',
        hint: '\u8bf7\u5411\u9886\u5bfc\u6c47\u62a5\uff1a\u94f6\u884c\u9700\u8981\u786e\u8ba4\u62a5\u8868\u5b57\u6bb5\uff0c\u6211\u4eec\u56e2\u961f\u6b63\u5728\u68c0\u67e5\u5237\u65b0\u9891\u7387\u3002',
        keywords: ['reporting fields', 'our team', 'refresh frequency'],
        xp: 20
    }
];

const coursePlan = Array.isArray(window.coursePlan) && window.coursePlan.length
    ? window.coursePlan
    : [{ week: 1, day: 1, title: 'Day 1', subtitle: 'Prototype content', theme: 'Prototype', levels: dayPlan }];

const state = {
    currentDay: Number(localStorage.getItem('fvq-current-day') || 0),
    current: Number(localStorage.getItem('fvq-current') || 0),
    xp: Number(localStorage.getItem('fvq-xp') || 0),
    completedByDay: JSON.parse(localStorage.getItem('fvq-completed-days') || '{}'),
    seenIntro: localStorage.getItem('fvq-seen-intro') === '1',
    mediaRecorder: null,
    audioChunks: [],
    audioUrl: '',
    transcript: '',
    recognition: null,
    isRecording: false,
    hasScored: false,
    lessonTimer: null,
    lessonStartedAt: 0,
    lessonTotalMs: 1,
    selectedVoice: null,
    selectedVoiceName: 'browser default',
    audioEl: null
};

const nodes = {
    onboardingPanel: document.getElementById('onboardingPanel'),
    startGuideBtn: document.getElementById('startGuideBtn'),
    dayLabel: document.getElementById('dayLabel'),
    courseTitle: document.getElementById('courseTitle'),
    courseSubtitle: document.getElementById('courseSubtitle'),
    prevDayBtn: document.getElementById('prevDayBtn'),
    nextDayBtn: document.getElementById('nextDayBtn'),
    xpValue: document.getElementById('xpValue'),
    npcName: document.getElementById('npcName'),
    npcLine: document.getElementById('npcLine'),
    stageLabel: document.getElementById('stageLabel'),
    missionTitle: document.getElementById('missionTitle'),
    lessonText: document.getElementById('lessonText'),
    lessonProgress: document.getElementById('lessonProgress'),
    voiceNote: document.getElementById('voiceNote'),
    challengeMode: document.getElementById('challengeMode'),
    targetLine: document.getElementById('targetLine'),
    hintLine: document.getElementById('hintLine'),
    keywordRow: document.getElementById('keywordRow'),
    micButton: document.getElementById('micButton'),
    micLabel: document.getElementById('micLabel'),
    replayBtn: document.getElementById('replayBtn'),
    playTargetBtn: document.getElementById('playTargetBtn'),
    scoreValue: document.getElementById('scoreValue'),
    feedbackTitle: document.getElementById('feedbackTitle'),
    feedbackText: document.getElementById('feedbackText'),
    playNpcBtn: document.getElementById('playNpcBtn'),
    lessonPlayBtn: document.getElementById('lessonPlayBtn'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    routeSteps: Array.from(document.querySelectorAll('.route-step')),
    sharedAudio: document.getElementById('sharedAudio')
};

function saveState() {
    localStorage.setItem('fvq-current-day', String(state.currentDay));
    localStorage.setItem('fvq-current', String(state.current));
    localStorage.setItem('fvq-xp', String(state.xp));
    localStorage.setItem('fvq-completed-days', JSON.stringify(state.completedByDay));
}

function getCurrentCourseDay() {
    if (state.currentDay < 0) state.currentDay = 0;
    if (state.currentDay >= coursePlan.length) state.currentDay = coursePlan.length - 1;
    return coursePlan[state.currentDay];
}

function getDayLevels() {
    return getCurrentCourseDay().levels;
}

function getCompletedLevels() {
    const key = String(state.currentDay);
    if (!Array.isArray(state.completedByDay[key])) {
        state.completedByDay[key] = [];
    }
    return state.completedByDay[key];
}

function getCurrentMission() {
    const levels = getDayLevels();
    if (state.current < 0) state.current = 0;
    if (state.current >= levels.length) state.current = levels.length - 1;
    return levels[state.current];
}

function getAudioPath(type) {
    const day = getCurrentCourseDay();
    return 'audio/w' + day.week + '_d' + day.day + '_l' + (state.current + 1) + '_' + type + '.mp3';
}

function stopAllAudio() {
    if (nodes.sharedAudio) {
        nodes.sharedAudio.pause();
        nodes.sharedAudio.currentTime = 0;
        nodes.sharedAudio.src = '';
    }
}

function playAudioFile(type) {
    stopAllAudio();
    stopLessonTimer();

    var el = nodes.sharedAudio;
    if (!el) { return playTTSFallback(type); }

    var path = getAudioPath(type);
    el.src = path;

    return new Promise(function(resolve) {
        var resolved = false;
        var finish = function() { if (!resolved) { resolved = true; resolve(); } };

        el.onloadedmetadata = function() {
            state.lessonTotalMs = (el.duration || 4) * 1000;
        };

        el.onended = finish;
        el.onerror = function() {
            el.src = '';
            playTTSFallback(type).then(resolve);
        };

        var playPromise = el.play();
        if (playPromise && playPromise.then) {
            playPromise.catch(function() {
                el.src = '';
                playTTSFallback(type).then(resolve);
            });
        }
    });
}

function playTTSFallback(type) {
    var mission = getCurrentMission();
    if (type === 'lesson') {
        return speak(mission.lesson, 0.94);
    } else if (type === 'npc') {
        return speak(mission.npcLine);
    } else if (type === 'target') {
        return speak(mission.target, 0.86);
    }
    return Promise.resolve();
}

function getBestVoice() {
    if (!window.speechSynthesis) return null;
    var voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;
    var preferredNames = ['jenny','aria','guy','samantha','daniel','google us english','google uk english','microsoft'];
    var englishVoices = voices.filter(function(v) { return /^en[-_]/i.test(v.lang); });
    var scored = englishVoices.map(function(voice) {
        var name = voice.name.toLowerCase();
        var langScore = /en[-_]us/i.test(voice.lang) ? 20 : 10;
        var nameScore = preferredNames.reduce(function(score, pref, idx) { return name.includes(pref) ? Math.max(score, 40 - idx * 3) : score; }, 0);
        return { voice: voice, score: langScore + nameScore + (voice.localService ? 6 : 0) };
    });
    scored.sort(function(a, b) { return b.score - a.score; });
    return scored[0] ? scored[0].voice : voices[0];
}

function refreshVoice() {
    state.selectedVoice = getBestVoice();
    state.selectedVoiceName = state.selectedVoice ? state.selectedVoice.name : 'browser default';
    if (nodes.voiceNote) {
        nodes.voiceNote.textContent = 'Voice: ' + state.selectedVoiceName;
    }
}

function estimateSpeechMs(text, rate) {
    var words = text.split(/\s+/).filter(Boolean).length;
    return Math.max(3500, Math.min(18000, (words / (2.25 * rate)) * 1000 + 1200));
}

function speak(text, rate) {
    if (!rate) rate = 0.88;
    if (!window.speechSynthesis) {
        setFeedback('--', '\u65e0\u6cd5\u64ad\u653e\u8bed\u97f3', '\u5f53\u524d\u6d4f\u89c8\u5668\u4e0d\u652f\u6301\u8bed\u97f3\u64ad\u653e\uff0c\u8bf7\u6362\u7528 Chrome\u3001Edge \u6216 Safari\u3002');
        return Promise.resolve();
    }
    refreshVoice();
    window.speechSynthesis.cancel();
    return new Promise(function(resolve) {
        var u = new SpeechSynthesisUtterance(text);
        u.lang = state.selectedVoice ? state.selectedVoice.lang : 'en-US';
        u.voice = state.selectedVoice;
        u.rate = rate;
        u.pitch = 1;
        u.onend = resolve;
        u.onerror = resolve;
        window.speechSynthesis.speak(u);
    });
}

function getRecognition() {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;
    var r = new SpeechRecognition();
    r.lang = 'en-US';
    r.continuous = false;
    r.interimResults = false;
    r.maxAlternatives = 1;
    return r;
}

function normalizeWords(text) {
    return text.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter(Boolean);
}

function scoreSpeech(transcript, mission) {
    var heard = normalizeWords(transcript);
    var target = normalizeWords(mission.target);
    var keywordWords = mission.keywords.flatMap(normalizeWords);
    var keywordHits = keywordWords.filter(function(w) { return new Set(heard).has(w); }).length;
    var keywordTotal = keywordWords.length;
    if (!heard.length) return { score: 0, title: '\u672a\u8bc6\u522b\u5230\u82f1\u6587', message: '\u53ef\u4ee5\u5148\u64ad\u653e\u89d2\u8272\u8bed\u97f3\uff0c\u518d\u70b9\u51fb\u9ea6\u514b\u98ce\u91cd\u8bd5\u3002' };
    var heardSet = new Set(heard);
    var targetHits = target.filter(function(w) { return heardSet.has(w); }).length;
    var targetScore = target.length ? targetHits / target.length : 0;
    var keywordScore = keywordWords.length ? keywordHits / keywordWords.length : 0;
    var score = Math.min(100, Math.round(targetScore * 65 + keywordScore * 35));
    var hitText = '\u8bc6\u522b\u5230\uff1a\u201c' + transcript + '\u201d\u3002\u5173\u952e\u8bcd\u547d\u4e2d ' + keywordHits + '/' + keywordTotal + '\uff1a' + mission.keywords.join(' / ') + '\u3002';
    if (score >= 84) return { score: score, title: '\u672c\u5173\u53cd\u9988\uff1a\u8868\u8fbe\u6e05\u695a', message: hitText + ' \u6838\u5fc3\u610f\u601d\u6293\u4f4f\u4e86\uff0c\u53ef\u4ee5\u8fdb\u5165\u4e0b\u4e00\u5173\u3002' };
    if (score >= 58) return { score: score, title: '\u672c\u5173\u53cd\u9988\uff1a\u57fa\u672c\u8fbe\u6807', message: hitText + ' \u5efa\u8bae\u518d\u8ddf\u8bfb\u4e00\u6b21\uff0c\u628a\u5173\u952e\u8bcd\u8bf4\u5f97\u66f4\u5b8c\u6574\u3002' };
    return { score: score, title: '\u672c\u5173\u53cd\u9988\uff1a\u518d\u7ec3\u4e00\u6b21', message: hitText + ' \u5efa\u8bae\u5148\u70b9\u201c\ud83d\udd0a \u76ee\u6807\u53e5\u201d\u542c\u4e00\u904d\uff0c\u8ddf\u8bfb\u540e\u518d\u5b8c\u6574\u8bf4\u4e00\u904d\u3002' };
}

function setFeedback(score, title, text) {
    nodes.scoreValue.textContent = score;
    nodes.feedbackTitle.textContent = title;
    nodes.feedbackText.textContent = text;
}

function stopLessonTimer() {
    if (state.lessonTimer) { clearInterval(state.lessonTimer); state.lessonTimer = null; }
}

function playLesson() {
    stopLessonTimer();
    stopAllAudio();
    nodes.lessonProgress.style.width = '0%';
    nodes.lessonPlayBtn.textContent = 'Playing';
    state.lessonStartedAt = Date.now();
    state.lessonTotalMs = 8000;

    playAudioFile('lesson').then(function() {
        stopLessonTimer();
        nodes.lessonProgress.style.width = '100%';
        nodes.lessonPlayBtn.textContent = 'Play';
    });

    state.lessonTimer = setInterval(function() {
        var elapsed = Date.now() - state.lessonStartedAt;
        var percent = Math.min(98, (elapsed / state.lessonTotalMs) * 100);
        nodes.lessonProgress.style.width = percent + '%';
    }, 120);
}

function renderMission() {
    var courseDay = getCurrentCourseDay();
    var levels = getDayLevels();
    var completed = getCompletedLevels();
    var mission = getCurrentMission();

    nodes.dayLabel.textContent = 'Week ' + courseDay.week + ' \u00b7 Day ' + courseDay.day;
    nodes.courseTitle.textContent = courseDay.title;
    nodes.courseSubtitle.textContent = courseDay.subtitle;
    nodes.xpValue.textContent = state.xp;
    nodes.npcName.textContent = mission.npc;
    nodes.npcLine.textContent = mission.npcLine;
    nodes.stageLabel.textContent = mission.level;
    nodes.missionTitle.textContent = mission.title;
    nodes.lessonText.textContent = mission.lesson;
    nodes.challengeMode.textContent = mission.mode;
    nodes.targetLine.textContent = mission.target;
    nodes.hintLine.textContent = mission.hint;
    nodes.keywordRow.innerHTML = '';
    mission.keywords.forEach(function(kw) {
        var chip = document.createElement('span');
        chip.textContent = kw;
        nodes.keywordRow.appendChild(chip);
    });

    nodes.routeSteps.forEach(function(step, idx) {
        var level = levels[idx];
        if (level) {
            var emoji = step.querySelector('.route-emoji');
            var label = step.querySelector('small');
            if (emoji) emoji.textContent = level.routeEmoji || String(idx + 1);
            if (label) label.textContent = level.routeLabel || '\u7b2c ' + (idx + 1) + ' \u5173';
        }
        step.classList.toggle('active', idx === state.current);
        step.classList.toggle('done', completed.includes(idx));
    });

    nodes.prevBtn.disabled = state.current === 0;
    nodes.prevDayBtn.disabled = state.currentDay === 0;
    nodes.nextDayBtn.disabled = state.currentDay === coursePlan.length - 1;
    nodes.nextBtn.textContent = state.current === levels.length - 1 ? 'Finish day' : 'Next level';
    nodes.lessonProgress.style.width = '0%';
    nodes.replayBtn.disabled = !state.audioUrl;
    setFeedback('--', '\u51c6\u5907\u7ec3\u4e60', '\u542c\u5b8c\u5c0f\u8bfe\u540e\uff0c\u70b9\u51fb\u9ea6\u514b\u98ce\u5f00\u59cb\u5f55\u97f3\uff0c\u518d\u70b9\u51fb\u4e00\u6b21\u7ed3\u675f\u3002');
    nodes.micLabel.textContent = 'Start recording';
    nodes.micButton.classList.remove('recording');
    stopLessonTimer();
    stopAllAudio();
    refreshVoice();
}

async function startMediaRecording() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) {
        throw new Error('MediaRecorder is not available in this browser.');
    }
    var stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    state.audioChunks = [];
    var mimeTypes = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'];
    var supportedType = mimeTypes.find(function(t) { return MediaRecorder.isTypeSupported(t); });
    state.mediaRecorder = new MediaRecorder(stream, supportedType ? { mimeType: supportedType } : undefined);
    state.mediaRecorder.ondataavailable = function(e) { if (e.data.size > 0) state.audioChunks.push(e.data); };
    state.mediaRecorder.onstop = function() {
        var blob = new Blob(state.audioChunks, { type: supportedType || 'audio/webm' });
        if (state.audioUrl) URL.revokeObjectURL(state.audioUrl);
        state.audioUrl = URL.createObjectURL(blob);
        nodes.replayBtn.disabled = false;
        stream.getTracks().forEach(function(t) { t.stop(); });
    };
    state.mediaRecorder.start();
}

async function startSpeaking() {
    if (state.isRecording) return;
    state.isRecording = true;
    state.transcript = '';
    state.hasScored = false;
    nodes.micButton.classList.add('recording');
    nodes.micLabel.textContent = 'Stop recording';
    setFeedback('--', '\u5f55\u97f3\u4e2d', '\u8bf7\u8bf4\u51fa\u76ee\u6807\u8868\u8fbe\u3002\u8bc6\u522b\u5230\u7247\u6bb5\u540e\u4e0d\u4f1a\u81ea\u52a8\u7ed3\u675f\uff1b\u8bf4\u5b8c\u540e\u518d\u70b9\u4e00\u6b21\u9ea6\u514b\u98ce\uff0c\u7cfb\u7edf\u624d\u4f1a\u7ed3\u7b97\u672c\u5173\u53cd\u9988\u3002');
    try { await startMediaRecording(); } catch (e) {
        state.isRecording = false;
        nodes.micButton.classList.remove('recording');
        nodes.micLabel.textContent = 'Start recording';
        setFeedback('--', '\u5f55\u97f3\u542f\u52a8\u5931\u8d25', '\u8bf7\u786e\u8ba4\u6d4f\u89c8\u5668\u5141\u8bb8\u9ea6\u514b\u98ce\u6743\u9650\uff0c\u5e76\u7528 HTTPS \u6216 localhost \u6253\u5f00\u9875\u9762\u3002');
        return;
    }
    var rec = getRecognition();
    if (!rec) { setFeedback('--', '\u5f55\u97f3\u4e2d', '\u5f53\u524d\u6d4f\u89c8\u5668\u4e0d\u652f\u6301\u81ea\u52a8\u8bc6\u522b\u3002\u7ed3\u675f\u540e\u53ef\u4ee5\u70b9 Replay \u56de\u542c\uff0c\u5e76\u5bf9\u7167\u76ee\u6807\u53e5\u81ea\u67e5\u3002'); return; }
    state.recognition = rec;
    rec.onresult = function(e) { state.transcript = e.results[0][0].transcript; setFeedback('--', '\u5df2\u8bc6\u522b\u5230\u7247\u6bb5', '\u76ee\u524d\u8bc6\u522b\u5230\uff1a\u201c' + state.transcript + '\u201d\u3002\u4f60\u53ef\u4ee5\u7ee7\u7eed\u8bf4\uff1b\u5168\u90e8\u8bf4\u5b8c\u540e\uff0c\u518d\u70b9\u4e00\u6b21\u9ea6\u514b\u98ce\u7ed3\u675f\u5e76\u751f\u6210\u672c\u5173\u53cd\u9988\u3002'); };
    rec.onerror = function(e) { console.warn('Speech recognition error:', e.error); };
    rec.onend = function() { state.recognition = null; };
    try { rec.start(); } catch (e) { console.warn('SpeechRecognition start failed:', e); }
}

function finishSpeaking() {
    if (state.mediaRecorder && state.mediaRecorder.state !== 'inactive') state.mediaRecorder.stop();
    state.isRecording = false;
    nodes.micButton.classList.remove('recording');
    nodes.micLabel.textContent = 'Start recording';
}

function completeAttempt(transcript) {
    if (state.hasScored) return;
    state.hasScored = true;
    state.transcript = transcript;
    finishSpeaking();
    var mission = getCurrentMission();
    var completed = getCompletedLevels();
    var result = scoreSpeech(transcript, mission);
    setFeedback(result.score, result.title, result.message);
    if (result.score >= 58 && !completed.includes(state.current)) {
        completed.push(state.current);
        state.xp += mission.xp;
        saveState();
        nodes.xpValue.textContent = state.xp;
        nodes.routeSteps[state.current].classList.add('done');
    }
}

function stopSpeaking() {
    if (!state.isRecording) return;
    if (state.recognition) { try { state.recognition.stop(); } catch (e) {} }
    finishSpeaking();
    if (state.transcript) { completeAttempt(state.transcript); return; }
    setFeedback('--', '\u5f55\u97f3\u5df2\u4fdd\u5b58', '\u81ea\u52a8\u8bc6\u522b\u6ca1\u6709\u62ff\u5230\u6587\u5b57\u3002\u53ef\u4ee5\u70b9 Replay \u56de\u542c\uff0c\u5e76\u5bf9\u7167\u76ee\u6807\u53e5\u81ea\u67e5\uff1a\u5173\u952e\u8bcd\u662f\u5426\u8bf4\u5b8c\u6574\u3001\u8bed\u901f\u662f\u5426\u592a\u5feb\u3002');
}

function replayRecording() {
    if (!state.audioUrl) return;
    (new Audio(state.audioUrl)).play();
}

function goToLevel(next) {
    state.current = Math.max(0, Math.min(getDayLevels().length - 1, next));
    saveState();
    renderMission();
}

function goToDay(next) {
    state.currentDay = Math.max(0, Math.min(coursePlan.length - 1, next));
    state.current = 0;
    if (state.audioUrl) { URL.revokeObjectURL(state.audioUrl); state.audioUrl = ''; }
    stopAllAudio();
    saveState();
    renderMission();
}

nodes.playNpcBtn.addEventListener('click', function() { playAudioFile('npc'); });
nodes.playTargetBtn.addEventListener('click', function() { playAudioFile('target'); });
nodes.lessonPlayBtn.addEventListener('click', playLesson);
nodes.replayBtn.addEventListener('click', replayRecording);
nodes.prevBtn.addEventListener('click', function() { goToLevel(state.current - 1); });
nodes.prevDayBtn.addEventListener('click', function() { goToDay(state.currentDay - 1); });
nodes.nextDayBtn.addEventListener('click', function() { goToDay(state.currentDay + 1); });
nodes.nextBtn.addEventListener('click', function() {
    var levels = getDayLevels();
    if (state.current === levels.length - 1) {
        state.completedByDay[String(state.currentDay)] = [0, 1, 2, 3, 4];
        saveState();
        if (state.currentDay < coursePlan.length - 1) {
            var nd = coursePlan[state.currentDay + 1];
            goToDay(state.currentDay + 1);
            setFeedback('Done', '\u4eca\u65e5\u5b8c\u6210', '\u4eca\u65e5 5 \u5173\u5b8c\u6210\u3002\u7d2f\u8ba1 ' + state.xp + ' XP\u3002\u5df2\u8fdb\u5165 Week ' + nd.week + ' \u00b7 Day ' + nd.day + '\uff1a' + nd.title + '\u3002');
            return;
        }
        renderMission();
        setFeedback('Done', '\u6708\u5ea6\u5b8c\u6210', '\u7b2c\u4e00\u4e2a\u6708 20 \u5929\u8bfe\u7a0b\u5df2\u5b8c\u6210\u3002\u7d2f\u8ba1 ' + state.xp + ' XP\u3002');
        return;
    }
    goToLevel(state.current + 1);
});

nodes.routeSteps.forEach(function(step) {
    step.addEventListener('click', function() { goToLevel(Number(step.dataset.level)); });
});

nodes.micButton.addEventListener('click', function() {
    if (state.isRecording) { stopSpeaking(); return; }
    startSpeaking();
});

nodes.startGuideBtn.addEventListener('click', function() {
    state.seenIntro = true;
    localStorage.setItem('fvq-seen-intro', '1');
    nodes.onboardingPanel.classList.add('hidden');
});

if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = refreshVoice;
}

renderMission();

if (state.seenIntro) {
    nodes.onboardingPanel.classList.add('hidden');
}
