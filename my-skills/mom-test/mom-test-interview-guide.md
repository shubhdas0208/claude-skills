# The Mom Test: A Master Framework for Customer Interviews
**A comprehensive guide to asking non-leading questions and extracting truth from users.**

> Reference knowledge for the `mom-test` skill. The SKILL.md file holds the operating procedure; this file holds the underlying rules and examples.

---

## 1. Introduction
You are preparing to speak with customers or users to validate an idea, understand a problem, or gather feedback. The most dangerous trap is gathering "false positives" — data that feels good but leads to building products nobody buys.

People want to be polite. If you ask them if your idea is good, they will lie to you. The goal of a customer interview is **not** to pitch your idea or seek approval. The goal is to excavate the truth about users' lives, problems, and constraints.

This is **The Mom Test** framework. Follow these rules and you will ask questions so robust that even your own mother could not lie to you about the answers.

---

## 2. The Core Rules of The Mom Test

### Rule 1: Talk about their life instead of your idea.
Never mention your idea or product until absolutely necessary. The moment you introduce your idea, the user tries to protect your feelings and gives biased feedback.
* **Focus on:** Their workflows, daily routines, and the problems they actually face.

### Rule 2: Ask about specifics in the past instead of generics or opinions about the future.
People are wildly optimistic about what they "would" do. Future promises ("I would definitely buy that") are worthless.
* **Focus on:** Concrete actions already taken. How did they solve this last time? How much money or time did they spend?

### Rule 3: Talk less and listen more.
If you are talking more than the user, you are pitching, not learning.
* **Focus on:** Asking a question and shutting up. When they reveal their mental model, do not interrupt to "correct" them or explain features.

---

## 3. Good Questions vs. Bad Questions

### Bad Questions (Avoid These)
These invite compliments, hypotheticals, and fluff.
* **"Do you think [Idea X] is a good idea?"** -> Only the market can tell you. Opinions are worthless.
* **"Would you buy a product that did X?"** -> People say "yes" to please you. An over-optimistic lie.
* **"How much would you pay for X?"** -> Predicting future spending is inaccurate.
* **"What would your dream product do?"** -> Users know their problems, not solutions.

### Good Questions (Ask These)
These anchor the user to past behavior and verifiable facts.
* **"Talk me through the last time [Problem X] happened."** -> Extracts a story showing actual workflow, constraints, environment.
* **"How are you dealing with it now?"** -> Baseline of how much pain they are in. If they are not dealing with it, it is not a real problem.
* **"What else have you tried?"** -> If they have not looked for a workaround or competitor, they will not look for your solution either.
* **"Why do you bother?"** -> Points toward underlying motivations and root causes.
* **"What are the implications of that?"** -> Distinguishes a minor annoyance from a costly, must-solve problem.

---

## 3b. Question Transformations (for the generator)
When a user's framing produces a leading question, rewrite it using the matching transform. Pattern: identify the bad shape on the left, output the good shape on the right, adapted to their domain.

| Bad shape | Why it fails | Good transform |
|-----------|--------------|----------------|
| "Do you think X is a good idea?" | Invites a compliment; opinion not fact | "Talk me through the last time [the problem] happened." |
| "Would you use / buy X?" | Hypothetical future; over-optimistic | "How are you dealing with this today?" |
| "How much would you pay for X?" | Predicts future spend | "What have you already spent (time or money) trying to fix this?" |
| "Would feature Y be useful?" | Smuggles in the solution | "What were you trying to get done when this last came up?" |
| "What's your dream version?" | Asks user to design | "Why does this matter to you? What does it cost you when it goes wrong?" |
| "Do you struggle with [domain]?" | Premature zoom; assumes they care | "What are your big goals / biggest headaches right now?" (let the domain surface on its own) |

---

## 4. Identifying and Navigating "Bad Data"
Users will organically give "bad data." Recognize it and steer back to reality. Three forms:

### 1. Compliments
"That's a great idea!", "I love it!" — fool's gold. Feel good, worthless.
* **Handle:** Deflect and ignore. "Thanks, but going back to what you said earlier about your workflow..."

### 2. Fluff (Generics, Hypotheticals, the Future)
"I usually...", "I always...", "I never...", "I would...", "I might...". Generics describe who they *want* to be, not who they *are*.
* **Handle:** Anchor to the past.
    * *User:* "I always reply to emails immediately."
    * *You:* "When is the last time you fell behind on emails? Talk me through that."

### 3. Ideas and Feature Requests
"You should add a sync-to-Excel feature!" Do not blindly roadmap it.
* **Handle:** Dig beneath the idea for the motivation.
    * *You:* "Why do you want that? What would syncing to Excel let you do that you can't now?"

---

## 5. Avoiding the Premature Zoom
Before zooming in on a specific problem, confirm the problem actually matters.
* **The Trap:** "What is your biggest problem with going to the gym?" implies they care about the gym. They might say "Commute time," but if they have not exercised in 5 years, fixing the commute will not make them a customer.
* **The Fix:** Start broad. "What are your big goals right now?" If your domain (e.g. fitness) does not naturally come up, it might not be a priority.

---

## 6. Commitment and Advancement
If you eventually show a product or pitch, a meeting only succeeds if it ends in a **Commitment** or **Advancement**. Wishy-washy endings ("Looks great, let me know when it launches") are failures.

A real lead gives up something of value (currency) to prove they are serious:
1.  **Time Commitment:** A clear next meeting, sitting down to test a prototype, running a trial with their team.
2.  **Reputation Risk:** Introducing you to their boss or tech team, giving a public testimonial.
3.  **Financial Commitment:** A letter of intent, a pre-order, a cash deposit.

* *Bad Ending:* "I would definitely buy that."
* *Good Ending:* "Can I buy the prototype right now?" or "When can you present this to my manager?"

---

## 7. Execution: How to Run the Interview Process

### Step 1: Prepare (List of 3)
* Never go in without a plan. Decide the **3 most important, scariest questions** you need answered.
* If a question can be answered via a Google search, do not waste interview time on it.

### Step 2: Keep it Casual
* Avoid formal "interviews." If it feels like they are doing you a favor, it is too formal.
* A 10-minute chat at a conference or cafe yields as much factual data as a 60-minute calendar block. You need not mention you are starting a business.

### Step 3: Note-Taking (Shorthand)
Take meticulous notes; memory is flawed. Do not become a "learning bottleneck." Capture signals fast:
* `:)` Excited / `:(` Angry / `:|` Embarrassed
* Lightning bolt = Pain or problem
* Goal = Job-to-be-done
* Box = Obstacle preventing them from solving it
* Arrow = Workaround they currently use
* `$` = Money or budget mentioned
* Check = Feature request

### Step 4: Review
Immediately after, review notes with your product/engineering team. Update beliefs, adjust the next "List of 3," iterate.

---

## Summary Checklist for the Interviewer
- [ ] Am I talking about *their life* instead of my idea?
- [ ] Am I asking about *specific past events* instead of future hypotheticals?
- [ ] Am I talking *less* and listening *more*?
- [ ] Did I deflect compliments?
- [ ] Did I anchor fluff to concrete examples?
- [ ] Did I dig beneath feature requests to find the root motivation?
- [ ] Have I identified if they are actively spending time/money to solve this right now?
- [ ] Did I push for a hard commitment (Time, Reputation, Money) at the end?

*You are searching for the truth, not trying to be right. A "No" or "I don't care" is a successful interview because it saves you from building the wrong product.*
