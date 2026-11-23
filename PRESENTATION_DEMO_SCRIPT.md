# NetraCare: Complete 10–15 Minute Live Presentation Script

**Project Title:** NetraCare — Autonomous AI-Powered Ophthalmic Clinic Care Coordination Platform  
**Target Duration:** 10 – 15 Minutes  
**Tone:** Confident, Human, Conversational, Technical yet Clinical  
**Target Audience:** Evaluators, Doctors, Investors, Technical Judges  

---

## ⏱️ Timeline & Presentation Agenda

| Segment | Topic | Target Time | Key Visual / Action |
|---|---|---|---|
| **01** | Hook, Problem Statement & The Solution | 00:00 – 02:00 (2 min) | Home page & Hero banner |
| **02** | The Patient Journey (Auth, Smart Booking, AI Chat & Vision) | 02:00 – 06:30 (4.5 min) | Patient Registration, Slot Selection, Vision Scanner |
| **03** | The Doctor Experience (Intake Summaries & Clinical Guardrails) | 06:30 – 09:30 (3 min) | Doctor Schedule, LLM History Briefing, Mandatory Notes |
| **04** | The Front Desk & Staff Coordination (Urgent Triage & MCP) | 09:30 – 12:30 (3 min) | Urgent Cases Banner, Walk-in Modal, RAG Inspector |
| **05** | Standalone Differentiators & Conclusion | 12:30 – 15:00 (2.5 min) | Architecture, Rule Engine, Closing Remarks |

---

## 🎙️ Spoken Presentation Script

### Act 1: The Hook & Introduction (00:00 – 02:00)

**[Action: Display the NetraCare Home Page (`/`)]**

> *"Good morning, everyone. Thank you for your time today.*
>
> *If you've ever tried booking an eye consultation at a busy hospital or clinic, you know the frustration. You're asked to pick between cornea specialists, retina experts, and glaucoma surgeons—terms most patients don't understand. Front desks get overwhelmed, phone lines are constantly busy, and worst of all, patients experiencing sudden vision loss or acute glaucoma often get scheduled for next Tuesday instead of being rushed to an emergency room.*
>
> *Today, I'm proud to introduce **NetraCare**—an enterprise-grade, agentic AI care coordination platform built specifically for ophthalmic clinics.*
>
> *NetraCare isn't just another booking calendar or generic chatbot. It connects **Patients**, **Specialist Doctors**, and **Front Desk Staff** through a deterministic clinical rule engine, a LangGraph autonomous agent, multimodal vision intelligence, and the Model Context Protocol (MCP).*
>
> *Let's jump straight into a live walkthrough to see how this works across all three roles."*

---

### Act 2: The Patient Portal — Seamless Intake, Vision AI & Booking (02:00 – 06:30)

#### 1. Instant Registration & Intelligent Availability
**[Action: Click 'Access Portals' $\rightarrow$ Select 'Patient' $\rightarrow$ Switch to 'Register']**

> *"Let's begin with a first-time visitor. In traditional portals, newcomers are bogged down with long 5-page forms. NetraCare keeps it frictionless: just Full Name, Mobile Number, and Age.*
>
> *Watch what happens as I type the mobile number:*
>
> **[Action: Type `9876543210` in Mobile field]**
>
> *In real-time, with zero page reloads, our API queries the clinic database and verifies availability. If a returning patient enters their number, it immediately greets them by name and offers a one-click switch to Sign-In.*
>
> *Let's complete this registration with age 28 and continue.*
>
> **[Action: Click 'Register & Continue']**
>
> *We are instantly authenticated with a secure session token and taken into the Patient Dashboard."*

#### 2. Clinical Scheduling & Zero Double-Booking Guarantee
**[Action: Scroll to the 'Book an Appointment' Wizard]**

> *"Here is our core booking engine. We have five accredited ophthalmologists covering Cataracts, Glaucoma, Vitreo-Retina, Cornea, and Paediatrics.*
>
> *Notice our slot grid:*
>
> **[Action: Pick Dr. Anand Rao, Select Tomorrow's Date, click a Slot]**
>
> *These slots aren't arbitrary time stamps. They are dynamically generated based on each doctor's Weekly OPD Grid—filtering out surgery sessions (SX), lunch hours, public holidays, and existing reservations.*
>
> *Furthermore, NetraCare strictly enforces a **Zero Double-Booking Guarantee** and hard clinical gates. For example, if a patient under 16 tries to book with an adult specialist, our system deterministically reroutes them to our paediatric specialist, Dr. Vikram Menon.*
>
> *Notice that every booking mandates a **Reason for Visit**. Descriptive symptoms help doctors prepare before the patient even walks through the clinic doors."*

#### 3. NetraCare Front Desk AI: Multimodal Vision Scanner & Triage
**[Action: Scroll down to the Patient Chat component]**

> *"Now, let's look at one of NetraCare's most powerful features: our conversational Front Desk AI agent.*
>
> *Patients often don't know what specialist they need, but they usually have an existing prescription slip or an eye photo. Let's see what happens when I use our Vision Scanner:*
>
> **[Action: Click the 'Scan' paperclip button $\rightarrow$ Select a prescription image $\rightarrow$ Click 'Send']**
>
> *Our backend leverages Gemini Multimodal Vision to process this optical prescription. Within seconds, it doesn't just read the text—it parses the clinical optical parameters into an organized tabular format: Sphere, Cylinder, and Axis for both OD (right eye) and OS (left eye). It identifies the diagnosis and immediately recommends the exact specialist you need.*
>
> *Now watch our safety guardrails in action:*
>
> **[Action: Type in chat: 'I have sudden severe eye pain with rainbow halos around lights' $\rightarrow$ Send]**
>
> *Look at the system response. The moment red-flag ocular symptoms like sudden vision loss, severe trauma, or halos appear, the AI suspends all standard booking operations. It triggers an **EMERGENCY TRIAGE ALERT**, warns the patient to seek urgent casualty care, and instantly flashes this case on the Front Desk Staff Dashboard. It never hallucinates or offers casual medical diagnoses."*

---

### Act 3: The Doctor Portal — AI Briefings & Clinical Roster (06:30 – 09:30)

**[Action: Log out $\rightarrow$ Click 'Access Portals' $\rightarrow$ Select 'Doctor' $\rightarrow$ Select Dr. Anand Rao (D1) $\rightarrow$ Click 'Sign in as Doctor']**

> *"Now let's switch perspectives to the clinician. Doctors shouldn't have to waste their first 10 minutes digging through scattered physical files.*
>
> *Here is Dr. Anand Rao's Consultation Roster for the day.*
>
> **[Action: Point to the daily appointment list]**
>
> *Each appointment card presents the allocated window, patient demographic data, contact info, and stated symptoms. On mobile, this card automatically reflows into a single clean column.*
>
> *Now, let me highlight this button: **AI Summary & History**.*
>
> **[Action: Click 'AI Summary & History' on an appointment]**
>
> *In one click, our clinical synthesis agent analyzes the patient's entire longitudinal history—their chronic conditions, allergies, past visit notes, and current complaints—and condenses it into a high-density, 30-second briefing for the doctor. If a patient is asthmatic, it warns against prescribing non-selective beta-blockers like Timolol. This isn't just convenient; it prevents adverse medical events.*
>
> *Finally, let's look at clinical compliance:*
>
> **[Action: Click 'Complete Visit' $\rightarrow$ Show the modal]**
>
> *NetraCare enforces accountability. A visit cannot be completed with an empty record. The doctor records their clinical findings, visual acuity (e.g., VA 6/9 OD), and follow-up timeline, and finalizes the record. This clinical note is permanently written to the patient's record, visible on their dashboard, and accessible for future visits."*

---

### Act 4: The Front Desk & Staff Coordination Desk (09:30 – 12:30)

**[Action: Log out $\rightarrow$ Select 'Staff' $\rightarrow$ Type 'Front Desk Staff' $\rightarrow$ Click 'Sign in to Staff Desk']**

> *"Next, let's step into the operations hub: the Front Desk Care Coordination Desk.*
>
> *This is where administrative staff manage clinic throughput.*
>
> **[Action: Highlight the top Red Banner: URGENT CASES]**
>
> *Remember that emergency symptom we typed in the patient chat just moments ago? Notice how it instantly surfaced right here in the **Urgent Cases Banner**! Staff immediately see the patient's name, phone number, and symptom summary so they can triage them at the door or initiate emergency hospital transfer. Once handled, staff simply click **Mark Handled**.*
>
> *Staff can also handle walk-ins effortlessly:*
>
> **[Action: Click '+ Book Walk-in / On-Behalf' button]**
>
> *If an elderly patient walks in without a smartphone, staff search by name or phone, select the patient profile, choose an open doctor slot, and book on their behalf while upholding every clinic rule.*
>
> *Next, let's inspect our retrieval engine:*
>
> **[Action: Scroll to 'RAG Search Inspector' $\rightarrow$ Click benchmark: 'When can I swim after LASIK?' $\rightarrow$ Click 'Search']**
>
> *This is our internal RAG Search Debugger. Rather than blindly trusting an LLM, NetraCare runs a **50/50 Hybrid Retrieval Engine**. In parallel, it calculates BM25 keyword matching for exact medical terms and Dense Vector Semantic embeddings for natural patient questions, then merges them with Reciprocal Rank Fusion. Clinicians and auditors can verify every single source document chunk retrieved from our clinic knowledge base."*

---

### Act 5: Standalone Differentiators & Conclusion (12:30 – 15:00)

**[Action: Navigate back to Home or show Architecture diagram]**

> *"To wrap up, what makes NetraCare fundamentally different from any ordinary clinic management software or ChatGPT wrapper?*
>
> *Three standalone architectural pillars define NetraCare:*
>
> 1. **Deterministic Clinical Rule Engine**: AI agents are notorious for hallucinations. NetraCare decouples medical rules from the LLM. Clinic timings, holiday calendars, 20-minute new consultation durations, 10-minute follow-ups, cancellation policies, and paediatric gates are enforced by mathematical deterministic code. The AI orchestrates; the rule engine decides.
> 2. **Model Context Protocol (MCP) Integration**: NetraCare communicates with external partner laboratory networks (like our CityCare Lab server on port 8002) using Anthropic's open Model Context Protocol. The agent queries external diagnostic tests without fragile custom APIs.
> 3. **Multimodal Clinical Vision Intake**: Patients can photograph their doctor's handwritten prescription or optical slip, and NetraCare automatically extracts parameters and routes them to the appropriate corneal, retina, or cataract specialist.
>
> *Whether accessed on a desktop workstation in a clinic or on a 360-pixel mobile screen in a patient's hands, NetraCare ensures that eye care is prompt, safe, coordinated, and error-free.*
>
> *Thank you very much. I would love to open the floor to any questions or demonstrate specific test scenarios you'd like to see."*

---

## 💡 Quick Tips for Live Demo Execution

1. **Pre-requisite Checklist**:
   - Local dev servers running: Backend (`http://127.0.0.1:8000`), MCP (`:8001`, `:8002`), Frontend (`:5173`).
   - Keep a sample prescription image on your desktop for the drag-and-drop / scan demo.
2. **Key Patient Numbers to keep handy**:
   - `Nagul` (`7667038004`) — New/Custom registered profile.
   - `Asha Verma` (`9000000001`) — Returning patient with Cataract records.
   - `Anjali Desai` (`9000000007`) — 9-year-old child (demonstrates paediatric gate).
3. **If an Evaluator asks: "Can it book two patients at 10:00 AM?"**:
   - Answer: *"No. The moment a slot is confirmed, it is excised from the available matrix in real-time with database transactional locks."*
4. **If an Evaluator asks: "What if Gemini API is down?"**:
   - Answer: *"The entire appointment booking, scheduling, and staff triage system functions 100% deterministically without the LLM. The AI serves as an intelligence layer, not a single point of failure."*
