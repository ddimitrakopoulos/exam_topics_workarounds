// ==UserScript==
// @name         ExamTopics DDG Fast Navigate
// @namespace    http://tampermonkey.net/
// @version      4.3
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

    const style = document.createElement('style');
    style.textContent = `
        [data-et-workaround="nav"] .et-nav-btn {
            flex: 1;
            min-width: 140px;
            padding: 8px 14px;
            border-radius: 4px;
            font-size: 15px;
            line-height: 1.4;
            text-decoration: none;
            cursor: pointer;
            transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
        }
        [data-et-workaround="nav"] .et-nav-outline-info {
            color: #17a2b8;
            background-color: #ffffff;
            border: 1px solid #17a2b8;
        }
        [data-et-workaround="nav"] .et-nav-outline-info:hover {
            color: #ffffff;
            background-color: #17a2b8;
            border-color: #17a2b8;
        }
        [data-et-workaround="nav"] .et-nav-outline-secondary {
            color: #495057;
            background-color: #ffffff;
            border: 1px solid #6c757d;
        }
        [data-et-workaround="nav"] .et-nav-outline-secondary:hover {
            color: #ffffff;
            background-color: #6c757d;
            border-color: #6c757d;
        }
        [data-et-workaround="nav"] .et-nav-primary {
            color: #ffffff;
            background-color: #007bff;
            border: 1px solid #007bff;
            font-weight: bold;
        }
        [data-et-workaround="nav"] .et-nav-primary:hover {
            background-color: #0069d9;
            border-color: #0062cc;
        }
        [data-et-workaround="nav"] .et-nav-info {
            color: #ffffff;
            background-color: #17a2b8;
            border: 1px solid #17a2b8;
            font-weight: bold;
        }
        [data-et-workaround="nav"] .et-nav-info:hover {
            background-color: #138496;
            border-color: #117a8b;
        }
    `;
    document.head.appendChild(style);

    const navGroup = document.createElement('div');
    navGroup.dataset.etWorkaround = 'nav';
    navGroup.className = 'd-flex justify-content-between mt-3 mb-3';
    navGroup.style.gap = '10px';
    navGroup.style.flexWrap = 'wrap';

    function buildUrl(t, q) {
        const query = `site:examtopics.com intitle:"Exam ${exam} topic ${t} question ${q} discussion"`;
        return `https://duckduckgo.com/?q=!ducky+${encodeURIComponent(query)}`;
    }

    function createNavButton(label, variantClass, targetTopic, targetQuestion) {
        const link = document.createElement('a');
        link.href = buildUrl(targetTopic, targetQuestion);
        link.rel = 'noreferrer';
        link.referrerPolicy = 'no-referrer';
        link.innerText = label;
        link.dataset.originalLabel = label;
        link.className = `btn et-nav-btn ${variantClass}`;
        link.addEventListener('click', (e) => {
            if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                link.innerText = '⏳ Routing...';
            }
        });
        return link;
    }

    if (topic > 1) {
        navGroup.appendChild(createNavButton(`⬅️ Prev Topic (T${topic - 1})`, 'et-nav-outline-info', topic - 1, 1));
    }

    if (question > 1) {
        navGroup.appendChild(createNavButton(`⬅️ Prev Q (Q${question - 1})`, 'et-nav-outline-secondary', topic, question - 1));
    }

    navGroup.appendChild(createNavButton(`Next Q (Q${question + 1}) ➡️`, 'et-nav-primary', topic, question + 1));
    navGroup.appendChild(createNavButton(`Next Topic (T${topic + 1}) ➡️`, 'et-nav-info', topic + 1, 1));

    window.addEventListener('pageshow', () => {
        navGroup.querySelectorAll('a[data-original-label]').forEach(link => {
            link.innerText = link.dataset.originalLabel;
        });
    });

    targetArea.insertBefore(navGroup, targetArea.firstChild);
})();
