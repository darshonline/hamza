/**
 * نظام إدارة درس الهمزة التفاعلي
 * النسخة المطورة
 */

document.addEventListener('DOMContentLoaded', function () {
    console.log("✅ Lesson Ready!");

    // تعيين شريط التقدم ليبدأ من الصفر
    updateQuizProgress();
});

/**
 * التبديل بين التبويبات
 */
function openTab(evt, tabName) {
    document.querySelectorAll(".tab-content").forEach(tc => tc.classList.remove("active"));
    document.querySelectorAll(".tab-btn").forEach(tb => tb.classList.remove("active"));
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openTabByName(tabName) {
    document.querySelectorAll(".tab-content").forEach(tc => tc.classList.remove("active"));
    document.querySelectorAll(".tab-btn").forEach(tb => tb.classList.remove("active"));
    const target = document.getElementById(tabName);
    if (target) target.classList.add("active");

    const tabOrder = ['lesson-intro', 'middle-hamza', 'end-hamza', 'media-tab', 'quiz-tab'];
    const idx = tabOrder.indexOf(tabName);
    const buttons = document.querySelectorAll(".tab-btn");
    if (idx >= 0 && buttons[idx]) buttons[idx].classList.add("active");

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * تحديث شريط تقدم الاختبار
 */
function updateQuizProgress() {
    const questions = document.querySelectorAll('.question-item');
    let answered = 0;

    questions.forEach(q => {
        const type = q.getAttribute('data-qtype');
        if (type === 'tf') {
            if (q.querySelector('input[type="radio"]:checked')) answered++;
        } else if (type === 'mcq') {
            const sel = q.querySelector('select');
            if (sel && sel.value) answered++;
        } else if (type === 'fill') {
            const inp = q.querySelector('input[type="text"]');
            if (inp && inp.value.trim()) answered++;
        }
    });

    const total = questions.length;
    const progressText = document.getElementById('quiz-progress-text');
    const progressBar = document.getElementById('quizProgressBar');

    if (progressText) progressText.textContent = `${answered} / ${total} سؤال`;
    if (progressBar) progressBar.style.width = total > 0 ? (answered / total * 100) + '%' : '0%';
}

/**
 * حساب النتيجة الشاملة
 */
function calculateMasterScore() {
    let score = 0;
    const questions = document.querySelectorAll('.question-item');
    const total = questions.length;

    questions.forEach(q => {
        const type = q.getAttribute('data-qtype');
        const correct = q.getAttribute('data-correct');
        let isCorrect = false;

        if (type === 'tf') {
            const sel = q.querySelector('input[type="radio"]:checked');
            if (sel && sel.value === correct) isCorrect = true;
        } else if (type === 'mcq') {
            const sel = q.querySelector('select');
            if (sel && sel.value === correct) isCorrect = true;
        } else if (type === 'fill') {
            const val = q.querySelector('input[type="text"]').value.trim();
            if (val === correct || (correct === 'يسبقها' && val === 'قبلها')) isCorrect = true;
        }

        q.classList.toggle('correct-answer', isCorrect);
        q.classList.toggle('wrong-answer', !isCorrect);

        const exp = q.querySelector('.explanation');
        if (exp) exp.classList.remove('hidden');

        if (isCorrect) score++;
    });

    displayFinalResult(score, total);
}

/**
 * عرض النتيجة النهائية
 */
function displayFinalResult(score, total) {
    const area = document.getElementById('master-result-area');
    const scoreText = document.getElementById('score-text');
    const comment = document.getElementById('grade-comment');
    const emoji = document.getElementById('result-emoji');
    const bar = document.getElementById('score-bar');
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;

    if (!area) return;

    area.classList.remove('hidden', 'result-excellent', 'result-good', 'result-average', 'result-weak');

    if (scoreText) {
        scoreText.innerHTML = `نتيجتك النهائية: <span class="score-num">${score}</span> من <span>${total}</span>`;
    }

    if (bar) {
        bar.style.width = pct + '%';
        bar.style.background = pct === 100 ? '#27ae60' : pct >= 70 ? '#f1c40f' : '#e74c3c';
    }

    let commentText = '';
    let emojiChar = '📚';
    let resultClass = 'result-weak';

    if (score === total) {
        emojiChar = '🏆';
        commentText = 'ممتاز! أنت تتقن قواعد الهمزة بنسبة 100%.';
        resultClass = 'result-excellent';
    } else if (score >= total * 0.7) {
        emojiChar = '✨';
        commentText = 'رائع! مستواك جيد جداً، راجع الأخطاء البسيطة لتكتمل معرفتك.';
        resultClass = 'result-good';
    } else if (score >= total * 0.5) {
        emojiChar = '👍';
        commentText = 'جيد، لكنك تحتاج لقراءة القواعد مرة أخرى والتركيز على الاستثناءات.';
        resultClass = 'result-average';
    } else {
        emojiChar = '📚';
        commentText = 'لا تقلق، الإملاء يحتاج لممارسة. شاهد الفيديوهات مرة أخرى وحاول مجدداً.';
        resultClass = 'result-weak';
    }

    if (emoji) emoji.textContent = emojiChar;
    if (comment) comment.textContent = commentText;
    area.classList.add(resultClass);

    area.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
