// ==UserScript==
// @name         ExamTopics Auto-Reveal Answers & Votes
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically highlights the suggested answer and parses community votes.
// @author       You
// @match        *://*.examtopics.com/*
// @grant        none
// ==/UserScript==

 

(function() {
    'use strict';

 

    const targetArea = document.querySelector('.question-body');
    if (!targetArea) return;

 

    const revealBtn = document.createElement('button');
    revealBtn.innerText = '👁️ Reveal Answer & Votes';
    revealBtn.className = 'btn btn-success mt-3 mb-3';
    revealBtn.style.display = 'block';
    revealBtn.style.fontWeight = 'bold';

 

    revealBtn.addEventListener('click', function() {
        const correctItems = document.querySelectorAll('.correct-hidden');
        correctItems.forEach(item => {
            item.style.backgroundColor = '#d4edda';
            item.style.border = '1px solid #c3e6cb';
            item.style.borderRadius = '5px';
            item.style.padding = '5px';

 

            const label = document.createElement('span');
            label.innerHTML = ' <strong>(Suggested Answer)</strong>';
            label.style.color = '#155724';
            item.appendChild(label);
        });

 

        const voteBlocks = document.querySelectorAll('.voted-answers-tally');
        voteBlocks.forEach(block => {
            block.classList.remove('d-none');
            const scriptTag = block.querySelector('script[type="application/json"]');
            if (scriptTag) {
                try {
                    const votes = JSON.parse(scriptTag.textContent);
                    const voteContainer = document.createElement('div');
                    voteContainer.style.marginTop = '15px';
                    voteContainer.style.padding = '10px';
                    voteContainer.style.backgroundColor = '#e2e3e5';
                    voteContainer.style.borderRadius = '5px';
                    voteContainer.innerHTML = '<strong>📊 Community Votes:</strong><br/>';

 

                    votes.forEach(vote => {
                        const isMostVoted = vote.is_most_voted ? ' 🏆 <em>(Most Voted)</em>' : '';
                        voteContainer.innerHTML += `Option <strong>${vote.voted_answers}</strong>: ${vote.vote_count} votes${isMostVoted}<br/>`;
                    });
                    block.appendChild(voteContainer);
                } catch (e) {
                    console.error(e);
                }
            }
        });

 

        const originalButtons = document.querySelectorAll('a.btn.btn-primary');
        originalButtons.forEach(btn => {
            if (btn.innerText.includes('Show Suggested Answer')) {
                btn.style.display = 'none';
            }
        });

 

        revealBtn.style.display = 'none';
    });

 

    targetArea.appendChild(revealBtn);

 

    const originalButtons = document.querySelectorAll('a.btn.btn-primary');
    originalButtons.forEach(btn => {
        if (btn.innerText.includes('Show Suggested Answer')) {
            btn.style.display = 'none';
        }
    });
})();
