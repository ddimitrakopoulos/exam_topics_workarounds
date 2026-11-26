// ==UserScript==
// @name         ExamTopics Reveal Community Votes
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Tallies community votes from discussion comments and highlights the most-voted option(s).
// @author       You
// @match        *://*.examtopics.com/discussions/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const targetArea = document.querySelector('.question-body');
    if (!targetArea) return;

    function hideOriginalButtons() {
        document.querySelectorAll('a.btn.btn-primary').forEach(btn => {
            if (btn.innerText.includes('Show Suggested Answer')) {
                btn.style.display = 'none';
            }
        });
    }

    function tallyCommunityVotes() {
        const counts = {};
        let totalVotes = 0;

        document.querySelectorAll('.comment-container').forEach(comment => {
            const answerEl = comment.querySelector(':scope > .media-body > .comment-body > .badge-warning strong');
            if (!answerEl) return;

            const answer = answerEl.textContent.trim().toUpperCase();
            if (!answer) return;

            const upvoteEl = comment.querySelector(':scope > .media-body > .comment-body > .comment-control .upvote-count');
            const parsed = upvoteEl ? parseInt(upvoteEl.textContent.trim(), 10) : NaN;
            const votes = Number.isNaN(parsed) ? 1 : parsed;

            counts[answer] = (counts[answer] || 0) + votes;
            totalVotes += votes;
        });

        const entries = Object.entries(counts)
            .map(([answer, votes]) => ({
                answer,
                votes,
                percent: totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0
            }))
            .sort((a, b) => b.votes - a.votes || a.answer.localeCompare(b.answer));

        const topVotes = entries.length > 0 ? entries[0].votes : 0;
        entries.forEach(entry => {
            entry.isMostVoted = topVotes > 0 && entry.votes === topVotes;
        });

        return { entries, totalVotes };
    }

    function getHighlightedChoiceLetters(entries) {
        const letters = new Set();
        entries
            .filter(entry => entry.isMostVoted)
            .forEach(entry => {
                if (/^[A-Z]+$/.test(entry.answer)) {
                    for (const ch of entry.answer) {
                        letters.add(ch);
                    }
                }
            });
        return letters;
    }

    function wrapChoiceLines(cardText) {
        if (!cardText || cardText.dataset.etChoicesWrapped === '1') return;

        const validLetters = new Set(
            Array.from(document.querySelectorAll('.vote-checkboxes input[name="comAnswer[]"]'))
                .map(input => input.value.trim().toUpperCase())
        );

        const segments = [[]];
        Array.from(cardText.childNodes).forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BR') {
                segments.push([]);
            } else {
                segments[segments.length - 1].push(node);
            }
        });

        segments.forEach(nodes => {
            const text = nodes.map(n => n.textContent || '').join('');
            const match = text.match(/^\s*([A-Z])\.\s+\S/);
            if (!match) return;

            const letter = match[1];
            if (validLetters.size > 0 && !validLetters.has(letter)) return;

            const wrapper = document.createElement('span');
            wrapper.className = 'et-choice-line';
            wrapper.dataset.etChoiceLetter = letter;

            const firstNode = nodes[0];
            cardText.insertBefore(wrapper, firstNode);
            nodes.forEach(n => wrapper.appendChild(n));

            const badge = document.createElement('span');
            badge.dataset.etWorkaround = 'reveal-badge';
            badge.className = 'et-most-voted-badge';
            badge.style.display = 'none';
            badge.style.color = '#155724';
            badge.style.marginLeft = '6px';
            badge.innerHTML = '<strong>(Most Voted)</strong>';
            wrapper.appendChild(badge);
        });

        cardText.dataset.etChoicesWrapped = '1';
    }

    function setChoiceHighlights(letters, visible) {
        const cardText = targetArea.querySelector('.card-text');
        if (!cardText) return;
        wrapChoiceLines(cardText);

        cardText.querySelectorAll('.et-choice-line').forEach(wrapper => {
            const isMatch = visible && letters.has(wrapper.dataset.etChoiceLetter);
            wrapper.style.display = isMatch ? 'inline-block' : '';
            wrapper.style.backgroundColor = isMatch ? '#d4edda' : '';
            wrapper.style.border = isMatch ? '1px solid #c3e6cb' : '';
            wrapper.style.borderRadius = isMatch ? '5px' : '';
            wrapper.style.padding = isMatch ? '4px 8px' : '';
            wrapper.style.margin = isMatch ? '2px 0' : '';

            const badge = wrapper.querySelector('.et-most-voted-badge');
            if (badge) {
                badge.style.display = isMatch ? 'inline' : 'none';
            }
        });
    }

    function buildVoteBox({ entries, totalVotes }) {
        const box = document.createElement('div');
        box.dataset.etWorkaround = 'reveal-panel';
        box.style.marginTop = '12px';
        box.style.padding = '12px';
        box.style.backgroundColor = '#f8f9fa';
        box.style.border = '1px solid #dee2e6';
        box.style.borderRadius = '6px';

        const header = document.createElement('div');
        header.style.fontWeight = 'bold';
        header.style.marginBottom = '8px';
        header.textContent = totalVotes > 0
            ? `📊 Community Votes (${totalVotes} total):`
            : '📊 Community Votes:';
        box.appendChild(header);

        if (entries.length === 0) {
            const empty = document.createElement('div');
            empty.style.color = '#6c757d';
            empty.style.fontSize = '0.95em';
            empty.textContent = 'No voting comments found on this discussion (likely a drag-and-drop, hotspot, or image question — check the comments below).';
            box.appendChild(empty);
            return box;
        }

        entries.forEach(entry => {
            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.alignItems = 'center';
            row.style.gap = '10px';
            row.style.marginBottom = '6px';

            const label = document.createElement('span');
            label.style.minWidth = '36px';
            label.style.fontWeight = 'bold';
            label.textContent = entry.answer;

            const track = document.createElement('div');
            track.style.flex = '1';
            track.style.height = '20px';
            track.style.backgroundColor = '#e9ecef';
            track.style.borderRadius = '4px';
            track.style.overflow = 'hidden';

            const bar = document.createElement('div');
            bar.style.width = `${Math.max(entry.percent, 2)}%`;
            bar.style.height = '100%';
            bar.style.backgroundColor = entry.isMostVoted ? '#28a745' : '#007bff';
            bar.style.transition = 'width 0.3s ease';
            track.appendChild(bar);

            const stats = document.createElement('span');
            stats.style.minWidth = '155px';
            stats.style.fontSize = '0.9em';
            stats.textContent = `${entry.percent}% (${entry.votes} ${entry.votes === 1 ? 'vote' : 'votes'})${entry.isMostVoted ? ' 🏆' : ''}`;

            row.append(label, track, stats);
            box.appendChild(row);
        });

        const note = document.createElement('div');
        note.style.marginTop = '8px';
        note.style.fontSize = '0.82em';
        note.style.color = '#6c757d';
        note.textContent = 'Calculated from community voting comments below (ExamTopics no longer includes the official suggested answer in discussion pages).';
        box.appendChild(note);

        return box;
    }

    hideOriginalButtons();

    const revealBtn = document.createElement('button');
    revealBtn.type = 'button';
    revealBtn.dataset.etWorkaround = 'reveal-btn';
    revealBtn.innerText = '👁️ Reveal Community Votes';
    revealBtn.className = 'btn btn-success mt-3 mb-2';
    revealBtn.style.display = 'block';
    revealBtn.style.fontWeight = 'bold';

    let revealed = false;
    let voteBox = null;
    let highlightedLetters = new Set();

    revealBtn.addEventListener('click', function() {
        revealed = !revealed;

        if (revealed) {
            const results = tallyCommunityVotes();
            highlightedLetters = getHighlightedChoiceLetters(results.entries);
            setChoiceHighlights(highlightedLetters, true);

            if (voteBox) voteBox.remove();
            voteBox = buildVoteBox(results);
            revealBtn.insertAdjacentElement('afterend', voteBox);
            revealBtn.innerText = '🙈 Hide Community Votes';
        } else {
            setChoiceHighlights(highlightedLetters, false);
            if (voteBox) {
                voteBox.remove();
                voteBox = null;
            }
            revealBtn.innerText = '👁️ Reveal Community Votes';
        }

        hideOriginalButtons();
    });

    targetArea.appendChild(revealBtn);
})();
