// ==UserScript==
// @name         ExamTopics DDG Fast Navigate
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Uses DuckDuckGo I'm Feeling Lucky to bypass bot protection
// @author       You
// @match        *://*.examtopics.com/discussions/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const match = document.title.match(/Exam\s+([\w-]+)\s+topic\s+(\d+)\s+question\s+(\d+)/i);
    if (!match) return;

    const exam = match[1];
    const topic = parseInt(match[2]);
    const question = parseInt(match[3]);
    const targetArea = document.querySelector('.question-body');

    if (!targetArea) return;

    const navGroup = document.createElement('div');
    navGroup.className = 'd-flex justify-content-between mt-3 mb-3';
    navGroup.style.gap = '10px';
    navGroup.style.flexWrap = 'wrap';

    function buildUrl(t, q) {
        const query = `site:examtopics.com intitle:"Exam ${exam} topic ${t} question ${q} discussion"`;
        return `https://duckduckgo.com/?q=!ducky+${encodeURIComponent(query)}`;
    }

    if (topic > 1) {
        const prevTopicBtn = document.createElement('button');
        prevTopicBtn.innerText = `⬅️ Prev Topic (T${topic - 1})`;
        prevTopicBtn.className = 'btn btn-outline-info';
        prevTopicBtn.style.flex = '1';
        prevTopicBtn.addEventListener('click', () => {
            prevTopicBtn.innerText = '⏳ Routing...';
            window.location.href = buildUrl(topic - 1, 1);
        });
        navGroup.appendChild(prevTopicBtn);
    }

    if (question > 1) {
        const prevBtn = document.createElement('button');
        prevBtn.innerText = `⬅️ Prev Q (Q${question - 1})`;
        prevBtn.className = 'btn btn-outline-secondary';
        prevBtn.style.flex = '1';
        prevBtn.addEventListener('click', () => {
            prevBtn.innerText = '⏳ Routing...';
            window.location.href = buildUrl(topic, question - 1);
        });
        navGroup.appendChild(prevBtn);
    }

    const nextBtn = document.createElement('button');
    nextBtn.innerText = `Next Q (Q${question + 1}) ➡️`;
    nextBtn.className = 'btn btn-primary';
    nextBtn.style.flex = '1';
    nextBtn.style.fontWeight = 'bold';
    nextBtn.addEventListener('click', () => {
        nextBtn.innerText = '⏳ Routing...';
        window.location.href = buildUrl(topic, question + 1);
    });
    navGroup.appendChild(nextBtn);

    const nextTopicBtn = document.createElement('button');
    nextTopicBtn.innerText = `Next Topic (T${topic + 1}) ➡️`;
    nextTopicBtn.className = 'btn btn-info';
    nextTopicBtn.style.flex = '1';
    nextTopicBtn.style.fontWeight = 'bold';
    nextTopicBtn.addEventListener('click', () => {
        nextTopicBtn.innerText = '⏳ Routing...';
        window.location.href = buildUrl(topic + 1, 1);
    });
    navGroup.appendChild(nextTopicBtn);

    targetArea.insertBefore(navGroup, targetArea.firstChild);
})();
