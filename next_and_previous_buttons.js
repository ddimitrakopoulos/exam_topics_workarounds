// ==UserScript==
// @name         ExamTopics DDG Fast Navigate
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  Uses DuckDuckGo I'm Feeling Lucky to navigate between ExamTopics discussions
// @author       You
// @match        *://*.examtopics.com/discussions/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const titleSource = document.title || document.querySelector('.discussion-list-header h1')?.textContent || '';
    const match = titleSource.match(/Exam\s+(.+?)\s+topic\s+(\d+)\s+question\s+(\d+)/i);
    if (!match) return;

    const exam = match[1].trim();
    const topic = parseInt(match[2], 10);
    const question = parseInt(match[3], 10);
    const targetArea = document.querySelector('.question-body');

    if (!targetArea) return;

    const navGroup = document.createElement('div');
    navGroup.dataset.etWorkaround = 'nav';
    navGroup.className = 'd-flex justify-content-between mt-3 mb-3';
    navGroup.style.gap = '10px';
    navGroup.style.flexWrap = 'wrap';

    function buildUrl(t, q) {
        const query = `site:examtopics.com intitle:"Exam ${exam} topic ${t} question ${q} discussion"`;
        return `https://duckduckgo.com/?q=!ducky+${encodeURIComponent(query)}`;
    }

    function createNavButton(label, className, targetTopic, targetQuestion, bold = false) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.innerText = label;
        btn.dataset.originalLabel = label;
        btn.className = className;
        btn.style.flex = '1';
        if (bold) btn.style.fontWeight = 'bold';
        btn.addEventListener('click', () => {
            btn.innerText = '⏳ Routing...';
            window.location.href = buildUrl(targetTopic, targetQuestion);
        });
        return btn;
    }

    if (topic > 1) {
        navGroup.appendChild(createNavButton(`⬅️ Prev Topic (T${topic - 1})`, 'btn btn-outline-info', topic - 1, 1));
    }

    if (question > 1) {
        navGroup.appendChild(createNavButton(`⬅️ Prev Q (Q${question - 1})`, 'btn btn-outline-secondary', topic, question - 1));
    }

    navGroup.appendChild(createNavButton(`Next Q (Q${question + 1}) ➡️`, 'btn btn-primary', topic, question + 1, true));
    navGroup.appendChild(createNavButton(`Next Topic (T${topic + 1}) ➡️`, 'btn btn-info', topic + 1, 1, true));

    window.addEventListener('pageshow', () => {
        navGroup.querySelectorAll('button[data-original-label]').forEach(btn => {
            btn.innerText = btn.dataset.originalLabel;
        });
    });

    targetArea.insertBefore(navGroup, targetArea.firstChild);
})();
