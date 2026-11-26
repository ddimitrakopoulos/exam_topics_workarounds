# Exam Topics Workarounds

## Fixes

### Promo Banner on Discussion Pages (Old Pop-Up Filter Note)

ExamTopics removed the old timed `.popup-overlay` pop-up on discussion pages, so `examtopics.com##.popup-overlay` is no longer needed.

If you have an adblocker that supports custom filters (such as uBlock Origin), you can optionally hide the "View all questions & answers" promo banner on discussion pages by adding the following to **My Filters / Custom Filters**:

```
examtopics.com##.contrib__ulimited
```

> Note: Exam view pages beyond page 1 (`/exams/.../view/2/` onward) are now gated server-side behind login/subscription and cannot be bypassed with CSS filters.

### Reveal Community Votes On Discussion Pages

Download the Tampermonkey browser extension and add the [reveal.js](./reveal.js) script.

ExamTopics no longer sends the official suggested answer or hidden vote JSON in discussion page HTML. Instead, `reveal.js` replaces the non-functional `Show Suggested Answer` button with a green **Reveal Community Votes** toggle that:
- Tallies community votes directly from the discussion comments (matching ExamTopics's official vote distribution)
- Displays a percentage bar chart with exact vote counts
- Highlights the most-voted option(s) directly in the question text

For questions without multiple-choice voting tags (e.g. drag-and-drop or hotspot questions), the panel notes that no vote tags were found so you can check the comments directly.

### Navigation Between Discussion Questions

Download the Tampermonkey browser extension and add the [next_and_previous_buttons.js](./next_and_previous_buttons.js) script.

This adds up to 4 buttons above the question on discussion pages (including multi-word exam names such as AWS exams):
- Prev Topic
- Prev Q
- Next Q
- Next Topic

Routing uses DuckDuckGo's `!ducky` redirect. If the next question or topic does not exist (or isn't indexed as the top result), you may be redirected to a general discussion listing page.

### Ask LLM Directly From The Question

Download the Tampermonkey browser extension and add the [ask_llm.js](./ask_llm.js) script to add a floating widget in the bottom-right corner of discussion pages.

- Copies the cleaned question text to your clipboard (excluding injected buttons and vote panels)
- Remembers your preferred LLM (`ChatGPT`, `Claude`, or `Gemini`) across pages
- For ChatGPT and Claude, pre-fills the prompt box automatically; for Gemini, paste the copied prompt manually
