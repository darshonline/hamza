/**
 * نظام إدارة درس الهمزة التفاعلي
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log("Lesson Ready!");
});

/**
 * أولاً: منطق التبديل بين التبويبات
 */
function openTab(evt, tabName) {
    // إخفاء جميع محتويات التبويبات
    const tabContent = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContent.length; i++) {
        tabContent[i].classList.remove("active");
        tabContent[i].style.display = "none";
    }

    // إزالة كلاس active من جميع الأزرار
    const tabLinks = document.getElementsByClassName("tab-btn");
    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].classList.remove("active");
    }

    // إظهار التبويب المطلوب وإضافة كلاس active للزر الذي ضغط عليه المستخدم
    const activeTab = document.getElementById(tabName);
    activeTab.style.display = "block";
    setTimeout(() => { activeTab.classList.add("active"); }, 10);
    evt.currentTarget.classList.add("active");

    // التمرير لأعلى الصفحة عند الانتقال لتبويب جديد
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * ثانياً: منطق الاختبار الشامل
 */
function calculateMasterScore() {
    let score = 0;
    const questions = document.querySelectorAll('.question-item');
    const totalQuestions = questions.length;

    questions.forEach((q, index) => {
        const type = q.getAttribute('data-qtype');
        const correctAnswer = q.getAttribute('data-correct');
        let userIsCorrect = false;

        // 1. معالجة أسئلة صح وخطأ
        if (type === 'tf') {
            const selected = q.querySelector('input[type="radio"]:checked');
            if (selected) {
                if (selected.value === correctAnswer) {
                    userIsCorrect = true;
                }
            }
        } 
        // 2. معالجة أسئلة الاختيار من متعدد
        else if (type === 'mcq') {
            const selectMenu = q.querySelector('select');
            if (selectMenu.value === correctAnswer) {
                userIsCorrect = true;
            }
        } 
        // 3. معالجة أسئلة إكمال الفراغات
        else if (type === 'fill') {
            const userInput = q.querySelector('input[type="text"]').value.trim();
            // مقارنة مرنة للنصوص العربية (إزالة المسافات الزائدة)
            if (userInput === correctAnswer || (correctAnswer === 'يسبقها' && userInput === 'قبلها')) {
                userIsCorrect = true;
            }
        }

        // تطبيق التنسيق البصري بناءً على الإجابة
        if (userIsCorrect) {
            score++;
            q.classList.add('correct-answer');
            q.classList.remove('wrong-answer');
        } else {
            q.classList.add('wrong-answer');
            q.classList.remove('correct-answer');
        }

        // إظهار التفسير/التصحيح لكل سؤال
        const exp = q.querySelector('.explanation');
        if (exp) exp.classList.remove('hidden');
    });

    // عرض النتيجة النهائية
    displayFinalResult(score, totalQuestions);
}

/**
 * ثالثاً: عرض النتيجة النهائية وتعديل الواجهة
 */
function displayFinalResult(score, total) {
    const resultArea = document.getElementById('master-result-area');
    const scoreDisplay = document.getElementById('score-text');
    const commentDisplay = document.getElementById('grade-comment');

    resultArea.classList.remove('hidden');
    scoreDisplay.innerHTML = `نتيجتك النهائية هي: <span style="color:#27ae60; font-size:2rem;">${score}</span> من ${total}`;

    // رسالة تقييم بناءً على الدرجة
    let comment = "";
    if (score === total) {
        comment = "🏆 ممتاز! أنت تتقن قواعد الهمزة بنسبة 100%.";
    } else if (score >= total * 0.7) {
        comment = "✨ رائع! مستواك جيد جداً، راجع الأخطاء البسيطة لتكتمل معرفتك.";
    } else if (score >= total * 0.5) {
        comment = "👍 جيد، لكنك تحتاج لقراءة القواعد مرة أخرى والتركيز على الاستثناءات.";
    } else {
        comment = "📚 لا تقلق، الإملاء يحتاج لممارسة. شاهد الفيديوهات مرة أخرى وحاول مجدداً.";
    }

    commentDisplay.innerText = comment;

    // التمرير التلقائي لمنطقة النتيجة
    resultArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
}