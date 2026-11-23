# NetraCare: Clinical AI Front Desk & Care Coordination
## 10 – 15 Minute Comprehensive Live Demo Presentation Script

> **Presenter Note**: Speak at a steady, conversational pace (~130 words per minute). When switching tabs or showing features, pause for 2–3 seconds to let your audience take in the clean, investor-ready UI. Everything in brackets `[like this]` is an action prompt for you on screen.

---

### Timing Breakdown (Total: ~13–15 Minutes)
1. **00:00 – 01:30** · The Hook & The Clinical Problem (Why NetraCare?)
2. **01:30 – 03:00** · System Architecture & Design Philosophy (Safety-First AI)
3. **03:00 – 07:00** · Act 1: The Patient Experience & Standalone AI Features
   - Real-time Registration & Availability Check
   - Multimodal Vision Scanner (Optical Prescription Extraction)
   - Conversational Slot Booking & Deterministic Emergency Lockout
4. **07:00 – 09:30** · Act 2: The Doctor Portal & Clinical Intelligence
   - Schedule Roster & Patient Flow
   - AI Clinical Intake Summary & Medical Synthesis
   - Consultation Completion & Enforced Doctor Notes
5. **09:30 – 12:00** · Act 3: Staff Coordination Desk & Deep Tech
   - Pinned Emergency Triage Desk
   - Walk-in / On-behalf Booking
   - RAG Inspector: BM25 vs. Dense Vector vs. 50/50 Hybrid Search
   - Model Context Protocol (MCP) Partner Lab Integration
6. **12:00 – 14:00** · Standalone Features (Why NetraCare Stands Apart from Generic Bots)
7. **14:00 – 15:00** · Conclusion & Opening for Questions

---

## Part 1: The Hook & The Clinical Problem (00:00 – 01:30)

`[Action: Start on the NetraCare Home Page with clean YC-classic UI visible]`

"Hello everyone, and welcome. 

If you have ever visited a specialized eye hospital or medical clinic, you know the reality of the front desk: it is often crowded, stressful, and overwhelmed with phone calls. Patients are asking about pre-operative guidelines, clutching paper prescriptions with handwritten numbers they can't understand, and waiting in line just to book a follow-up. 

Even worse, during peak hours, critical red-flag emergencies—like acute angle-closure glaucoma or retinal tears—can get buried in routine appointment queues. A front desk receptionist juggling 10 tasks at once might schedule someone with sudden vision loss for next Tuesday, when in reality they need emergency attention within the hour.

On top of this, clinics suffer from double bookings, doctor schedule clashes, and lost medical history.

To solve this, we built **NetraCare**—an autonomous, clinical-grade AI Front Desk and Care Coordination platform specifically engineered for ophthalmic hospitals. 

NetraCare is **not** another generic ChatGPT wrapper or chatbot. It is a dual-engine system: combining the natural conversational empathy of multimodal Large Language Models with a hard, deterministic clinical rule engine that guarantees zero double-bookings, strict emergency triage, and absolute role-based medical isolation.

Today, I’m going to walk you through all three distinct personas in our clinic: **The Patient**, **The Doctor**, and **The Front Desk Staff**."

---

## Part 2: System Architecture & Safety-First Philosophy (01:30 – 03:00)

`[Action: Scroll smoothly over the Home Page showcasing the 5 Specialists, OPD Grid, and Clinic Rules]`

"Before we dive into the live portals, let’s understand what makes this platform safe for healthcare.

In clinical practice, hallucination is dangerous. You cannot have an AI agent inventing appointments that don’t exist, or reassuring a patient with an optical emergency that they are 'probably fine.'

NetraCare solves this with four core architectural layers:
1. **Deterministic Rule Engine**: Hardcoded clinic laws that can *never* be bypassed by an LLM prompt. For instance:
   - 20-minute slots for new consultations, 10 minutes for follow-ups.
   - Strict age-gating: any patient under 16 years old is automatically restricted to our Paediatric specialist, Dr. Vikram Menon.
   - Hard blackout periods: Sundays, surgery blocks, and lunch hours are completely unbookable.
2. **LangGraph Agentic Workflow**: State-managed agent execution with dedicated tools for checking slots, rescheduling, and triaging.
3. **Multimodal Vision Engine**: Powered by Google Gemini, capable of reading handwritten and printed optical prescriptions and analyzing visible eye conditions.
4. **Model Context Protocol (MCP)**: Connecting the clinic to external diagnostic services like partner blood and imaging labs in real-time.

Let’s now jump into the shoes of our first user: **The Patient**."

---

## Part 3: Act 1 — The Patient Experience & AI Features (03:00 – 07:00)

`[Action: Click 'Access Portals' on the top-right navbar. Switch to 'Register' sub-tab under Patient]`

### 1. Real-Time Patient Registration & Availability Check
"First, let's look at patient onboarding. In a busy clinic, duplicate patient records are a major headache. 

Watch what happens when I start typing a mobile number into the registration form.

`[Action: Type '9000000001']`

The system instantly checks our database in real-time: it detects that this mobile belongs to an existing patient, Asha Verma, and tells me: *'Already registered. Click here to switch to Sign In.'*

Now let’s register a new patient.

`[Action: Type a new number like '9876543210', Name: 'Arjun Mehta', Age: '34', click 'Register & Continue']`

The system validates the mobile format, computes the birth year based on age, assigns a clean sequential patient ID, and generates an isolated session token. We are immediately routed into the Patient Portal.

`[Action: We are now on the Patient Dashboard]`

---

### 2. The Multimodal Vision Scanner (Standalone Feature)
"Now, let's show you one of our flagship standalone features: the **Multimodal Vision Scanner**.

Patients often have previous optical prescription papers from other doctors. Patients don't know what 'Sphere, Cylinder, Axis, or Addition' mean, nor do they know which superspecialist they should see.

`[Action: Scroll to the NetraCare Front Desk AI Chat. Click the 'Scan' paperclip button]`

I am going to upload an optical prescription image.

`[Action: Select an optical prescription image file. Type: 'Please scan my prescription card and explain what doctor I should see.']`

`[Action: Hit Send]`

Watch the AI work in real time.

`[Action: Wait 2-3 seconds for response to render]`

Notice what happened here:
1. The Vision Engine scanned the optical card and extracted the exact clinical parameters into an interactive table:
   - **OD (Right Eye)**: Sphere, Cylinder, Axis, Visual Acuity.
   - **OS (Left Eye)**: Sphere, Cylinder, Axis.
2. It identified that the prescription indicates corneal astigmatism and refraction change, and automatically recommended **Dr. Fatima Khan (Cornea & Refractive specialist)**.
3. It directly generated an action card asking if we would like to check slots with Dr. Fatima Khan!"

---

### 3. Emergency Red-Flag Triage Lockout (Clinical Safety)
"Now, let’s test the most critical safety feature of NetraCare: **Deterministic Emergency Triage**.

What happens if a patient mentions severe, dangerous symptoms? Let’s type:
`'I have sudden intense eye pain, redness, and I'm seeing rainbow-colored halos around streetlights.'`

`[Action: Type the message and hit Send]`

Look at this response:
- The system immediately displays a high-visibility **RED-FLAG EMERGENCY BANNER**.
- It identifies potential Acute Angle-Closure Glaucoma.
- It **refuses** to proceed with standard online booking. Instead, it instructs the patient to go to the emergency eye casualty immediately.
- Behind the scenes, it immediately pushed an **Urgent Safety Record** to the Front Desk Staff Dashboard so human coordinators can follow up.

The AI cannot be sweet-talked or prompt-injected out of this safety protocol. That is medical-grade reliability."

---

## Part 4: Act 2 — The Doctor Portal (07:00 – 09:30)

`[Action: Click 'Log out' on the top navbar. Select 'Doctor' tab. Choose 'Dr. Anand Rao (D1)', click 'Sign in as Doctor']`

"Now, let’s step into the shoes of our clinician: **Dr. Anand Rao**, our Cataract & Anterior Segment specialist.

Doctors don’t have time to navigate complicated software. They need an uncluttered, high-speed overview of their day.

Here is Dr. Rao’s daily schedule roster. Each appointment shows:
- The exact time slot (e.g., 09:00 AM – 09:20 AM).
- The patient's name, age, and contact number.
- Stated symptoms and visit category (New vs. Follow-up).

---

### AI Clinical Intake Summary & Medical Synthesis
"Before a doctor examines a patient, reviewing 10 pages of past medical notes takes too long. 

Notice this button next to each patient: **'AI Summary & History'**. Let's click it.

`[Action: Click 'AI Summary & History' on an appointment]`

Look at what the AI generated:
- It pulled the patient's general health, allergies, and past visits.
- It synthesized chronic conditions—for example, flagging if a glaucoma patient has a history of bronchial asthma, meaning Dr. Rao must avoid prescribing non-selective beta-blocker eye drops like Timolol.
- It provides a 3-bullet clinical briefing: *Previous Diagnosis*, *Today's Stated Concern*, and *Pre-Consultation Clinical Advice*.

This turns a 5-minute chart review into a 15-second glance.

---

### Enforcing Clinical Integrity (Mandatory Doctor's Notes)
"When the consultation is done, Dr. Rao clicks **'Complete Visit'**.

`[Action: Click 'Complete Visit' on a booked appointment]`

If the doctor tries to finalize the visit without entering notes:
`[Action: Click 'Finalize & Mark Completed' with an empty textarea]`
Notice that the system blocks it. A clinical record is incomplete without findings.

Let’s enter a real clinical note:
`'VA 6/9 OD, 6/6 OS. Early nuclear sclerotic cataract. Advised protective UV eyewear and review in 6 months.'`

`[Action: Click 'Finalize & Mark Completed']`

The appointment instantly turns to **Completed** with a green badge and is permanently stamped into the patient’s longitudinal medical record."

---

## Part 5: Act 3 — Staff Coordination Desk & Deep Tech (09:30 – 12:00)

`[Action: Click 'Log out'. Select 'Staff' tab. Enter 'Front Desk Staff', click 'Sign in to Staff Desk']`

"Now let's examine the command center of the hospital: **The Staff Care Coordination Desk**.

Hospital staff are responsible for operations, safety monitoring, walk-in patient registrations, and clinic schedule adjustments.

---

### 1. The Pinned Urgent Cases Banner
"Right at the very top of the staff screen, notice this bright red banner: **URGENT CASES**.

Remember that patient who typed acute eye pain with halos in the chat earlier? That case was caught instantly and pinned right here for the human staff. It displays the patient's phone number, summary of symptoms, and the exact time of triage.

Once a staff member calls the patient or receives them in casualty, they click **'Mark Handled'**, which archives the alert with an audit trail.

---

### 2. Walk-in & On-Behalf Booking
"Not all patients can use a smartphone. Many elderly patients walk directly up to the counter.

Staff can click **'+ Book Walk-in / On-Behalf'**. They can search any patient by name or phone, pick the specialist, and the system dynamically computes available slots that won’t clash with any existing online bookings.

---

### 3. Deep Tech: RAG Search Inspector (BM25 vs. Dense Vector vs. Hybrid)
"Let’s scroll down to an engineering highlight of NetraCare: the **RAG Knowledge Base Inspector**.

`[Action: Scroll down to the 'RAG Search Inspector' card]`

Most AI demos hide what their retriever is doing. In NetraCare, we provide full observability into how our knowledge base searches clinic protocols.

Let’s click on a benchmark question:
`'Can my kid have breakfast on the morning of the operation to straighten his eye?'`

`[Action: Click the query and click 'Search']`

Look at this 3-column breakdown:
1. **Left Column (BM25 Keyword Search)**: Shows raw lexical token matches. Good at finding exact drug names and doctor names, but misses conceptual meaning.
2. **Middle Column (Dense Semantic Vector Search)**: Uses vector embeddings to capture intent (e.g. recognizing that 'operation to straighten his eye' means Paediatric Strabismus surgery).
3. **Right Column (50/50 Unified Hybrid Retriever)**: Combines Reciprocal Rank Fusion of keyword and vector scores to deliver the single most accurate clinical policy document without hallucinations.

---

### 4. Model Context Protocol (MCP) Partner Lab Integration
"Finally, NetraCare is connected to external diagnostic facilities using the **Model Context Protocol (MCP)**.

When patients ask questions like:
`'Where is my fasting blood sugar test report?'` or `'Is my HbA1c ready for my cataract surgery?'`
The AI agent doesn’t guess. It queries our partner pathology lab MCP server (`CityCare Lab MCP`) on port 8002 via standardized JSON-RPC protocols, checks patient lab identifiers, and returns verified test results."

---

## Part 6: Why NetraCare Stands Apart (12:00 – 14:00)

`[Action: Scroll smoothly to the Top Navigation or Footer highlighting the clinic specs]`

"To summarize, what makes NetraCare fundamentally different from other healthcare chatbots?

1. **Multimodal Vision in Clinical Intake**: It doesn’t just read text; it parses physical optical prescription cards into structured OD/OS sphere and cylinder data and routes to the right doctor.
2. **Deterministic Safety Before Generative AI**: Urgent ocular emergencies are intercepted deterministically. AI is never permitted to gamble with sight-threatening symptoms.
3. **Strict Clinic Rules Enforced**: 
   - No double bookings.
   - Paediatric age isolation (<16 goes only to Paediatrics).
   - Surgery and leave blackout enforcement.
   - 2-hour late cancellation rules that require staff approval.
4. **Three-Way Collaborative Loop**: Patients, Doctors, and Front Desk Staff are synchronized on a single source of truth in real-time.
5. **Modern, Responsive SaaS Experience**: Tested and verified across desktop, tablet, and mobile viewports with zero horizontal overflow, compliant with light healthcare design standards."

---

## Part 7: Conclusion & Q&A (14:00 – 15:00)

"NetraCare proves that AI in healthcare is most powerful not when it tries to replace doctors, but when it removes the friction, queues, and administrative chaos that stand between patients and timely medical care.

Thank you so much for your time and attention. I would love to open the floor to any questions or demonstrate any specific scenario you'd like to explore!"

---

### Quick Cheat-Sheet for Live Demo Q&A

| Scenario | Input / Data to Use | What to Highlight |
| :--- | :--- | :--- |
| **New Patient Registration** | Mobile: `9876543210`, Name: `Arjun`, Age: `34` | Real-time availability check, auto-computed birth year |
| **Existing Patient Sign-In** | Mobile: `9000000001`, Name: `Asha Verma` | Loads history, patient ID `P01`, past cataract notes |
| **Paediatric Age Routing** | Mobile: `9000000007`, Name: `Anjali Desai` (Age 9) | Automatically locks to Dr. Vikram Menon (<16 rule) |
| **Emergency Red-Flag** | *"Sudden eye pain, redness, and halos around lights"* | Red emergency banner, instant triage, front desk alert |
| **Prescription OCR Scanner** | Attach prescription image in chat | Extracts Sphere, Cylinder, Axis for OD & OS |
| **Doctor AI Summary** | Doctor `D1` (Dr. Anand Rao), click `AI Summary` | Summarizes past surgeries, allergies, clinical concerns |
| **RAG Ranking** | Click *"Should I bring my HbA1c report?"* in Staff Desk | Explains BM25 vs. Vector vs. Hybrid RRF score |
