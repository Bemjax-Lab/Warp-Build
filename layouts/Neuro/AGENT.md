You are an Agent for Veterinairan helper app for differential diagnosys development.

## Modus operandi :
Based on parameters in Localisations, app detects possible localisations on nervous system out of 17 defined in rules.js with 3 levels of confidence and proofs for them.

Once an array of posible localisations is obtained it will be used against same parameters to differe possible diagnoses.

## Team : 

Dario : tech, dev, infra, publishing, brand
Ivana : veterinarian, tester, factotum, product owner
Ronaldo : veterinarian, domain knowledge

Dario and Ivana are working on extracting Ronaldo's knowledge in neurological differential diagnosys in a structured parameters model and localisation detection algo.

When starting work ask for the user name so you know who you are working with, what context. 

When something  from toDO is done it is removed from ToDo file and added to daily report in diary/, if file doesnt exist - create it.

Diary entries are single files with date as name +".md", content is what is done, lines aded prefixed by users name :  "Dario " + date + whats done. Diary and todo files should be simple, not verbose as a log. Specialy the diary, when adding todo its enogh to write what was done...save the tokens, be short.

Before doing changes to software/apps make a toDO and present it to user, if confirmed, write to todo file, do changes, when working move to diary.

Look at the ToDO and diary/ for current progress, ask the user for his name if you havent.


## Initital testing rules development

As correct localisation is paramount and base for the rest of application Ronaldo explained each localisation decicion tree in natural language.
From all explanations a parameters model of symptoms was created ( in Parameters/parametersModel.json ) containing all used parameters/symptoms and each localisation / rule got its own js file ( in Localisation/rules ) with Ronaldo's textual explantion of detection.

Then a 3 tier confidence scoring system was devised, which would take all selected parameterers from user and run them through all Detection/rules to detect possible localisations.

Agent created initial test functions for each rule and also added them to individual rule files so the rule file contains veterinarian explanation and test implementation.

Ivana tested the system and it works as expected and we are ready for fine tuning the rules through implemented testing.


## Fine tuning the localisation detection rules through testing

Tests have test definitions in definedTests.json, and also user (Ivana or Ronaldo mostly) can define new tests as user tests and send them to Dario to join to definedTests.json when needed.
Test is a set of parameters sent to detection algorithm/method and what is got from detection is compared with "expected" in the test definition. These two have to match. 

Veterinarian, Ivana, can also leave comments in the test, to help solve the test or provide some insight.

When tests are run, the results can be exported by Dario and provided back to Agent.

This way Agent developer has a deterministic harness...change the algo until whats retuned matches expected.

## A refining session

So , concidering all above, a refining session begins with a results json file that tells us what tests for what localosations are failing. 

Agent should analise the file and answer : How many localisations are affected, for each : 
- is the textual explanationation ok or we need to change it.
- ok, or not ok, do we need to change the testing function
- does this affect some othe localsiations not on the list, or depends on changing other localisations
- difficoulty, price

When todo isa made, analise the changes you wanted to do...will they brake some of defined tests that were working before?


When user confirmes a todo is to be created and when user allows changes to rule files can be made.

User will test , and provide next results file.
