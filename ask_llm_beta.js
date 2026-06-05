// ==UserScript==
// @name         ExamTopics LLM Floating Helper
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Standalone floating script to send ExamTopics questions to LLMs
// @author       You
// @match        *://*.examtopics.com/discussions/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const targetArea = document.querySelector('.question-body');
    if (!targetArea) return;

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.right = '20px';
    container.style.display = 'flex';
    container.style.gap = '8px';
    container.style.background = '#ffffff';
    container.style.padding = '10px';
    container.style.borderRadius = '8px';
    container.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    container.style.zIndex = '9999';
    container.style.border = '1px solid #ddd';

    const select = document.createElement('select');
    select.style.padding = '6px';
    select.style.borderRadius = '4px';
    select.style.border = '1px solid #ccc';
    
    const options = [
        { text: 'ChatGPT', value: 'chatgpt' },
        { text: 'Claude', value: 'claude' },
        { text: 'Gemini', value: 'gemini' }
    ];

    options.forEach(opt => {
        const el = document.createElement('option');
        el.text = opt.text;
        el.value = opt.value;
        select.appendChild(el);
    });

    const btn = document.createElement('button');
    btn.innerText = '🤖 Ask LLM';
    btn.style.padding = '6px 12px';
    btn.style.backgroundColor = '#28a745';
    btn.style.color = '#fff';
    btn.style.border = 'none';
    btn.style.borderRadius = '4px';
    btn.style.cursor = 'pointer';
    btn.style.fontWeight = 'bold';

    function cleanText(element) {
        const clone = element.cloneNode(true);
        const badElements = clone.querySelectorAll('.correct-answer-box, .correct-hidden, .reveal-solution, .voted-answers-tally, .question-discussion-button, .btn, .hide-solution');
        badElements.forEach(el => el.remove());
        
        let text = clone.innerText.trim();
        text = text.replace(/Reveal Solution/gi, '');
        text = text.replace(/Hide Solution/gi, '');
        text = text.replace(/Next Question/gi, '');
        text = text.replace(/Previous Question/gi, '');
        text = text.replace(/Discussion\s*\(\d+\)/gi, '');
        return text.replace(/\n\s*\n/g, '\n\n').trim();
    }

    btn.addEventListener('click', () => {
        const cleanQuestion = cleanText(targetArea);
        const prompt = `Act as an expert technical tutor. Answer this certification question and provide a detailed explanation for why the correct option is right, and exactly why the other options are incorrect. Do not just provide the answer letter:\n\n${cleanQuestion}`;
        
        let llmUrl = '';
        const selected = select.value;
        
        if (selected === 'chatgpt') {
            llmUrl = `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`;
        } else if (selected === 'claude') {
            llmUrl = `https://claude.ai/new?q=${encodeURIComponent(prompt)}`;
        } else if (selected === 'gemini') {
            llmUrl = `https://gemini.google.com/app?q=${encodeURIComponent(prompt)}`;
        }

        navigator.clipboard.writeText(prompt).then(() => {
            window.open(llmUrl, '_blank');
        }).catch(() => {
            window.open(llmUrl, '_blank');
        });
    });

    container.appendChild(select);
    container.appendChild(btn);
    document.body.appendChild(container);
})();
