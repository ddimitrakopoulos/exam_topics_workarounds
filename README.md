# Exam Topics Workarounds

## Fixes

### Pop Up After Some Seconds

You need to have an adblocker browser extension that allows for custom filters (Ublock Origin works)

In settings look for My Filters/Custom Filters or anything similar

There paste the following string:

```
examtopics.com##.popup-overlay
```
The pop up should no longer appear

### Reveal Answers Does Not Work On Non Premium Accounts

Download the tampermonkey browser extension and add the reveal.js script 

The Reveal Answers button will be replaced with another green button

Sadly the new button only works in questions that are multiple choice and don't include an image but that should be about 85% of the total questions

### No Navigation For Non Premium Users

Download the tampermonkey browser extension and add the next_and_previous_buttons.js script

This adds 4 buttons above the question :
- Next Question
- Previous Question
- Next Topic
- Previous Topic

If the next question or topic does not exist you will be redirected in a general forum 

I couldn't change this behaviour with a quick fix attempt but it does not seem to cause problems
