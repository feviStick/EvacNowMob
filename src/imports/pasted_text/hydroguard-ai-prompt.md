HYDROGUARD AI: MASTER MOBILE APP BUILD PROMPT
PROJECT OVERVIEW
Build a production-quality, mobile-first native web application / PWA called HydroGuard AI Field.
HydroGuard AI Field is the citizen-facing mobile component of the HydroGuard AI Flood Warning System. The application enables citizens, volunteers, disaster-response teams, and local authorities to:

Report flood incidents directly from the field.
Capture and upload evidence through photos and videos.
Share GPS-based incident locations.
View live crowdsourced flood reports.
Receive emergency and disaster alerts.
Send SOS rescue requests.
Locate nearby relief shelters and emergency resources.
Access critical information when internet connectivity is unavailable.
Notify family members of their safety status.
The application should feel like a real emergency-response product, not a generic dashboard or a collection of static screens.
1. PRIMARY PRODUCT GOAL
Create a functional mobile application that demonstrates a complete disaster-response workflow:

Citizen detects flood hazard
        ↓
Opens HydroGuard AI Field
        ↓
GPS location is captured
        ↓
Photo/video evidence is uploaded
        ↓
Citizen selects incident severity
        ↓
Report is submitted to backend
        ↓
Report enters verification pipeline
        ↓
Incident appears in live crowdsourced feed
        ↓
Central AI / disaster response system receives data
        ↓
Citizens receive relevant alerts and evacuation guidance
The application must prioritize:

Speed
Accessibility
Low-connectivity usability
Large touch targets
Clear emergency actions
Trustworthy information hierarchy
2. TECHNICAL REQUIREMENTS
Build this as a working application, not merely a UI prototype.

Required Functional Integrations
Device Location
Use actual device GPS/location permissions where supported.
Display:

Current latitude
Current longitude
Human-readable location name when possible
GPS accuracy
Location status
Example:

Yamuna River Bank, Sector 4, Delhi
GPS Accuracy: ±12 meters
Include:

Loading state
Permission denied state
Location unavailable state
Retry location button
Do not pretend GPS data is real when it is simulated.
For development/demo environments where GPS is unavailable, clearly label fallback data as:

Demo Location
Camera and Media Upload
Allow users to:

Capture a photo using the device camera.
Select an existing photo.
Capture or upload video where supported.
Upload media to the configured backend or cloud storage.
Display:

Upload progress
Thumbnail preview
File type
Upload success
Upload failure
Remove/replace media action
Media must be connected to the incident report rather than existing as decorative UI.
Backend Data Storage
Create a functional backend/data layer for:

Incident reports
Incident media
GPS coordinates
Report severity
Verification status
SOS emergency requests
Safety check-ins
Emergency contacts
Relief shelter data
Cached/offline content where technically supported
The application must be architected so that a real backend can easily replace demo data.
If backend credentials or external APIs are unavailable, implement a clean mock/demo backend with persistent local data and clearly separate:

Demo Data Layer
Production API Layer
Do not create fake buttons that perform no action.
3. DEFAULT LANGUAGE
The default language on first launch must be:
English
Support a language selector for:

English
Hindi
Bengali
The language selector must be visible and easy to access.
Architect the application so additional Indian languages can be added later.
Do not merely translate one or two buttons. Core emergency information should respond to the selected language.
4. DESIGN SYSTEM AND VISUAL STYLE
Overall Design
Create a modern, serious, high-trust emergency-response interface.
The visual design should communicate:

Urgency without unnecessary panic
Government/disaster-response credibility
High readability
Fast decision-making
Avoid:

Excessive gradients
Glassmorphism that reduces readability
Tiny text
Overly decorative animations
Generic SaaS dashboards
Theme
Primary default theme:
Dark Mode Emergency Interface
Use strong visual hierarchy and high contrast.
Suggested semantic color system:

Emergency/Critical: Red
Warning: Orange
Moderate Alert: Yellow/Amber
Safe/Verified: Green
Information: Blue
Neutral UI: Dark gray
All colors must meet accessibility and readability requirements.
Do not rely solely on color to communicate severity.
Mobile Requirements
The application must be optimized primarily for mobile devices.
Requirements:

Large touch targets
Minimum comfortable spacing
Thumb-friendly controls
Bottom navigation
Responsive layouts
No horizontal scrolling
Important emergency actions reachable with one hand where possible
Design target:

Mobile First
↓
Tablet Compatible
↓
Desktop Responsive
5. APPLICATION NAVIGATION
Use a persistent bottom navigation bar containing approximately five major sections:

🏠 Home
📍 Report
📡 Live Feed
🚨 Alerts
🛟 Safety
The most important emergency actions should remain easily accessible.
Potential floating emergency action:

SOS
However, avoid accidental emergency triggering.
SOS should require confirmation before submission.
6. HOME / EMERGENCY COMMAND CENTER
Create a mobile home screen that acts as the user's disaster-awareness command center.

Include:
Current Risk Status
Example:

FLOOD RISK
HIGH
Display:

Risk level
Affected region
Last updated time
Relevant alert summary
Active Alert Banner
Create a highly visible emergency alert component.
Example:

ORANGE ALERT: Heavy rainfall and rising water levels reported across the Yamuna Catchment.
Include:

Alert source
Timestamp
Severity
Expand for details
Possible sources:

NDMA
IMD
State Disaster Management Authority
Clearly distinguish:

LIVE VERIFIED ALERT
from:

DEMO ALERT
Quick Actions
Provide large buttons for:

Report Flood Incident
Send SOS
Find Shelter
I Am Safe
These should immediately navigate to or initiate the appropriate functional workflow.
7. GROUND INCIDENT REPORTING SCREEN
Create a complete citizen field-reporting workflow.

Section A: GPS LOCATION CARD
Automatically request device location permission.
Display:

CURRENT LOCATION

📍 Yamuna River Bank
Sector 4, Delhi

Latitude: XX.XXXX
Longitude: XX.XXXX

GPS Accuracy: ±12m
Include:

Refresh location
Manual location fallback
Permission guidance
If GPS fails, allow the user to manually enter or select a location.
Section B: FLOOD HAZARD EVIDENCE
Create a prominent media capture area labeled:
Capture or Upload Flood Hazard Photo / Video
Actions:

📷 Take Photo

🖼 Upload Media

🎥 Record Video
After media selection:

Show preview
Allow removal
Show upload state
Validate supported file formats
Section C: INCIDENT SEVERITY
Allow the user to select exactly one primary severity type:

○ Waterlogging

○ Road Submerged

○ Levee Breach

○ Severe Inundation
Each option should include a short description.
Example:
Road Submerged
Road access significantly affected by floodwater.
Consider adding severity levels:

LOW
MODERATE
HIGH
CRITICAL
The user should not be overwhelmed by unnecessary form fields.
Section D: OPTIONAL INCIDENT DESCRIPTION
Provide a text area:

Describe what you are seeing. Include trapped people, blocked roads, rising water, damaged infrastructure, or other immediate hazards.
Include character limits.
Section E: SUBMIT INCIDENT REPORT
Create a prominent primary action:
Send Incident Report to Central AI Engine
On submission:

Validate required information.
Save the report.
Upload associated media.
Attach location.
Generate a unique report ID.
Assign an initial verification status.
Display success confirmation.
Example:

REPORT RECEIVED

Report ID: HG-2026-XXXXX

Status: Pending AI Verification
The report should then appear in the live incident feed.
8. LIVE CROWDSOURCED INCIDENT FEED
Create a scrollable real-time style feed.
Each incident card should display:

Media thumbnail
Incident category
Severity
Location
Timestamp
Verification status
Example:

ROAD SUBMERGED
HIGH SEVERITY

📍 Sector 4, Delhi
🕒 12 minutes ago

[PHOTO]

AI VERIFIED
Verification statuses:

AI Verified
Pending Verification
Community Confirmed
Rejected / Duplicate
Do not allow unverified reports to appear identical to verified emergency information.
Feed Controls
Include:

Filter by severity
Filter by verification status
Filter by distance
Sort by newest
Sort by highest severity
Provide empty states.
Example:

No incidents have been reported in your selected area yet.
9. EMERGENCY ALERTS
Create a dedicated emergency alerts screen.

Alert Types
Support visual categories:

CRITICAL
WARNING
ADVISORY
INFORMATION
Each alert should display:

Title
Issuing authority
Location
Timestamp
Recommended action
Example:

ORANGE ALERT: Yamuna Catchment
Issued by: Disaster Management Authority
Recommended Action:
Move away from low-lying areas and prepare for possible evacuation.
10. SOS EMERGENCY BROADCAST
This is a critical feature and must feel functional.
Create a large emergency button:

SOS EMERGENCY BROADCAST
When pressed:

Step 1: Confirmation
Display:

You are about to send an emergency rescue request with your current location.
Actions:

Cancel
Send Emergency SOS
Step 2: SOS Submission
Capture:

Current GPS coordinates
Timestamp
Device battery level where browser/device APIs permit
Optional emergency message
Example:

Immediate assistance required. Floodwater is rising.
Step 3: Confirmation
Display:

SOS REQUEST SENT

Emergency Reference:
SOS-HG-XXXXX

Your last known location has been included.
If no network is available:

SOS QUEUED

Your emergency request will be transmitted when connectivity is restored.
Never claim that an SOS has reached real emergency services unless an actual emergency-service integration exists.
11. LOW-CONNECTIVITY AND OFFLINE SUPPORT
Create a dedicated offline emergency status card:

OFFLINE EMERGENCY BACKUP
Automated SMS/USSD alert mechanisms are available for configured emergency workflows on low-connectivity networks.
Important:
Do not falsely claim that SMS or USSD functionality is active unless the required platform APIs or backend services are genuinely integrated.
For web/PWA environments:

Queue reports locally when offline.
Synchronize automatically when connectivity returns.
Cache emergency survival guides.
Cache selected evacuation maps.
Clearly show offline status.
Example:

OFFLINE MODE ACTIVE

3 reports waiting to synchronize.
12. OFFLINE EVACUATION MAPS
Create an offline maps section.
Features:

Download regional evacuation map
Cache shelter locations
Cache emergency routes
Show storage/download status
Example:

DELHI EAST FLOOD ZONE

✓ Offline Map Downloaded

Last Updated:
Today, 09:42
Allow users to delete cached regions.
Clearly indicate whether routing information is:

Live
Cached
Unavailable
13. EMERGENCY SURVIVAL GUIDE
Create an offline-accessible emergency survival guide.
Use expandable accordion cards.
Required guides:

During Flash Floods
Include practical emergency instructions.

Water Purification
Explain safe methods for emergency water treatment.

First Aid for Drowning
Provide immediate basic response information while prominently encouraging emergency medical assistance.
The content should be readable offline.
Use icons and illustrations where useful, but prioritize clarity over decoration.
14. EMERGENCY HELPLINES
Create a one-tap emergency contacts section.
Include configurable cards for:

State Disaster Management Authority
NDRF Control Room: 1078
Local District Disaster Authorities
Emergency Medical Services
A tap should initiate the phone dialer where supported.
Do not invent phone numbers for local agencies.
Clearly label any numbers as:

Official
Configured
Demo
depending on the actual data source.
15. NDMA / CAP ALERT SYSTEM
Create a live-style disaster alert ticker.
Example:

ORANGE ALERT ISSUED FOR YAMUNA CATCHMENT
Display:

Alert authority
Severity
Affected region
Timestamp
Architecture should support Common Alerting Protocol (CAP) feeds or official disaster APIs in the future.
If real CAP integration is unavailable:

DEMO ALERT DATA
must be visible.
Never present simulated government alerts as real alerts.
16. RELIEF SHELTERS AND RESOURCES LOCATOR
Create an interactive map and list view.
Categories:

Relief Camps
Food Distribution Centers
Medical Tents
Emergency Water Stations
Each location should display:

YAMUNA SPORTS COMPLEX SHELTER

Capacity:
███████░░░ 72% Full

Facilities:

💧 Drinking Water
🏥 Medical Aid
🚤 Rescue Boats

[GET EVACUATION ROUTE]
Allow:

Map view
List view
Distance sorting
Category filtering
Shelter Routing
The Get Evacuation Route button should:

Use the user's current location.
Use the shelter coordinates.
Generate or open navigation directions.
If live routing is unavailable:

Open a supported external navigation service.
Clearly indicate the behavior.
Do not fake turn-by-turn navigation.
17. FAMILY SAFETY CHECK-IN
Create a major safety feature.

I AM SAFE
When pressed:

Confirm the user's status.
Capture last known location.
Capture timestamp.
Include battery level when supported.
Send the status through configured emergency contact mechanisms.
Example message:

I am safe. This is my last known location: [location]. Battery: 68%. Time: 14:32.
Emergency contacts must be manageable by the user.
Allow:

Add contact
Edit contact
Delete contact
Select default contacts
Do not send real SMS messages unless an actual SMS integration is configured.
For unsupported environments, clearly display:

MESSAGE READY TO SEND
and use the appropriate device sharing/messaging mechanism where available.
18. FIND MY FAMILY STATUS BOARD
Create a community/family status interface.
Allow users to view:

Safe
Needs Assistance
Unknown / Not Updated
Privacy requirements:

Do not publicly expose precise location without explicit permission.
Separate private family contacts from public community reporting.
Require clear consent for location sharing.
Example:

FAMILY STATUS

Amit Sharma
✓ SAFE
Updated 18 minutes ago

Priya Sharma
? STATUS UNKNOWN
Last update: Yesterday
19. NOTIFICATIONS
Create an architecture for:

Emergency flood alerts
Nearby incident alerts
Shelter availability updates
Report verification updates
SOS status updates
Support push notifications where technically possible.
Provide notification preferences.
Allow users to control:

Critical alerts
Nearby alerts
Community updates
Critical emergency alerts should have clear priority.
20. OFFLINE DATA SYNCHRONIZATION
The app must gracefully handle unstable networks.
Architecture:

USER ACTION
      ↓
NETWORK AVAILABLE?
   ↙        ↘
 YES         NO
  ↓           ↓
SEND API    STORE LOCALLY
  ↓           ↓
SUCCESS     SYNC LATER
Display synchronization status.
Example:

✓ All reports synchronized

or

⚠ 2 reports waiting for network
Prevent accidental data loss.
21. ACCESSIBILITY REQUIREMENTS
The application must support users under stressful conditions.
Requirements:

Large readable text
High contrast
Large touch targets
Clear icons with text labels
Screen reader friendly controls
No critical information conveyed only through color
Clear error messages
Avoid hiding emergency actions behind multiple menus.
22. LOADING, ERROR, AND EMPTY STATES
Every major feature requires appropriate states.

Examples
Location Loading
Locating your device...
Media Upload
Uploading evidence... 65%
Network Failure
Unable to connect. Your report has been saved and will synchronize when a network becomes available.
Empty Incident Feed
No recent incidents have been reported in this area.
Permission Denied
HydroGuard needs location access to accurately report nearby flood incidents.
Include actionable recovery options.
23. DATA MODEL
Use a clean data structure.

Incident Report
id
reporter_id
latitude
longitude
location_name
severity_category
severity_level
description
media_urls
created_at
updated_at
verification_status
ai_confidence
SOS Request
id
user_id
latitude
longitude
timestamp
battery_level
message
status
Safety Check-In
id
user_id
status
latitude
longitude
battery_level
timestamp
shared_contacts
Relief Shelter
id
name
latitude
longitude
capacity
current_occupancy
facilities
status
updated_at
24. DEMO MODE REQUIREMENTS
Because this application may initially be demonstrated during a hackathon, create a clear Demo Mode.
Demo Mode may contain:

Sample flood incidents
Sample shelters
Sample alerts
Simulated verification states
However:
Demo data must never be visually indistinguishable from live government or emergency information.
Display an indicator such as:

DEMO DATA MODE
when simulated data is being used.
25. AI INTEGRATION PLACEHOLDER
The application should integrate with the broader HydroGuard AI ecosystem.
Design the API architecture for future AI capabilities:

MEDIA UPLOAD
      ↓
AI FLOOD ANALYSIS
      ↓
OBJECT / WATER DETECTION
      ↓
SEVERITY ESTIMATION
      ↓
FRAUD / DUPLICATE DETECTION
      ↓
VERIFICATION SCORE
For the first version, the AI response may be mocked if a real AI service is unavailable.
Example:

AI ANALYSIS COMPLETE

Flood Probability: 91%

Detected Hazard:
Road Submersion

Verification:
AI VERIFIED
Clearly label simulated AI results when they are not generated by a real model.
26. SECURITY AND PRIVACY
Implement reasonable security practices.
Protect:

User location
Emergency contacts
Uploaded media
Family status
SOS information
Requirements:

Do not publicly expose exact personal GPS coordinates by default.
Require consent before location sharing.
Validate uploaded files.
Use authentication if a backend supports user accounts.
Prevent unauthorized modification of incident reports.
27. REQUIRED PROJECT STRUCTURE
Use a clean, maintainable architecture.
Suggested structure:

/src
  /components
  /screens
  /services
  /hooks
  /context
  /utils
  /types
  /assets

  /features
    /reporting
    /incidents
    /alerts
    /sos
    /shelters
    /safety
    /offline
Separate:

UI COMPONENTS
BUSINESS LOGIC
API SERVICES
LOCAL STORAGE
DEMO DATA
Do not place the entire application inside one massive component because apparently humanity has collectively decided maintainability is optional.
28. FINAL QUALITY REQUIREMENTS
Before considering the application complete, verify:

Functionality
 Location permissions work.
 Camera/media selection works.
 Reports can be created.
 Reports persist in the data layer.
 New reports appear in the incident feed.
 Severity filters work.
 SOS workflow works.
 Offline queuing works.
 Safety check-in workflow works.
 Emergency contacts can be managed.
 Shelter list works.
 Navigation/routing actions work.
 Language selection works.
 Dark mode UI is polished.
UI
 Mobile-first design.
 Bottom navigation works.
 Large touch targets.
 High contrast.
 Consistent spacing.
 Clear loading states.
 Clear error states.
 Clear empty states.
Data Integrity
 No fake "live" information presented as real.
 Demo data is clearly labeled.
 Failed network actions do not silently disappear.
 Offline reports synchronize correctly.
FINAL INSTRUCTION TO THE BUILDER
Build the application as a complete, functional emergency-response mobile experience.
Do not:

Create static placeholder buttons.
Use fake functionality without labeling it.
Build only the homepage.
Ignore error states.
Ignore offline conditions.
Prioritize decorative visuals over usability.
Create a desktop dashboard and merely shrink it for mobile.
The finished product should demonstrate a believable end-to-end disaster reporting ecosystem:

REPORT
→ VERIFY
→ ANALYZE
→ ALERT
→ EVACUATE
→ RESCUE
→ CONFIRM SAFETY
Every major button should have a meaningful destination or action.
The application should be visually impressive enough for a hackathon demonstration while remaining technically structured enough to evolve into a real-world disaster-response platform.
Build the first version as a polished, mobile-first, functional application with clean architecture and realistic workflows. prompt used in ai studio the design it gives suck better ui ux responsive dynamic mobile app interfsace means thhe way it goes  .......create a prompt for ui ux