# Obsidian-workout-tracker
A simple workout tracker for [Obsidian](https://obsidian.md/).

To use this you need to edit your own exercises and workouts.
There is a basic example workout with two exercises included.

There are four different views/pages:
- Overview / a list of workouts. Includes a workout calendar, health recovery status, and a pie chart of the muscles being worked.
- A workout view. Includes a list of remaining and completed exercises and an image of the muscles being worked.
  - At the bottom, there are graphs for effort, time under load, and muscle load volume, as well as experience gained from the workout.
- An exercise view that shows  the last few times this exercise was performed.
  - Has en effort/weight graph at the bottom
- Progress view. Shows achievements gained from workouts and also the general characteristics of your training.
  
## Usage instructions
1. Open the "Workout list" note
2. Press the "Add workout" button
3. Choose a workout in the list that appears 
4. Go to the newly created workout by pressing it in the workout list
5. Press the "Log" button
6. Select an exercise from the list that appears.
  - The list includes:
    - "Start" - Will be the only item to appear in the list when no exercies have been logged. Will log the current time as start of the workout
    - Remaining exercises (performed ones are filtered out)
    - "Show all exercises" - removes the filter and shows all exercies regardless of if they have been logged during this workout
   
<img width="689" height="145" alt="image" src="https://github.com/user-attachments/assets/28f8080b-aa89-468c-8730-f88f5da403ba" />

## Screenshots

### Workout list
<img width="1097" height="924" alt="image" src="https://github.com/user-attachments/assets/8bcae5d7-2372-45fc-8de6-f008f6a2b467" />
<img width="1192" height="770" alt="image" src="https://github.com/user-attachments/assets/b9bcaa21-a0e5-4017-ab38-d0b0b6b28010" />

### Workout
<img width="1049" height="882" alt="image" src="https://github.com/user-attachments/assets/70bd2c14-d4a1-4a59-a989-ac419cfde048" />
<img width="940" height="641" alt="image" src="https://github.com/user-attachments/assets/6ac2a894-be03-43b1-b0e5-83af99400ea9" />
<img width="1003" height="752" alt="image" src="https://github.com/user-attachments/assets/4148acff-90ab-4830-b8ea-9a460e278eb9" />
<img width="1225" height="420" alt="image" src="https://github.com/user-attachments/assets/2434f6f8-e6b5-4101-b39a-7485586a866e" />
<img width="951" height="776" alt="image" src="https://github.com/user-attachments/assets/692540bd-fb4b-4741-bc49-9de4e2b8b931" />

### Exercise
<img width="912" height="655" alt="image" src="https://github.com/user-attachments/assets/e356227b-b78a-48fb-9192-127379e7330c" />

### progress
<img width="1017" height="927" alt="image" src="https://github.com/user-attachments/assets/2b42561a-c550-41e4-ae2a-898820f9a8c8" />
<img width="930" height="807" alt="image" src="https://github.com/user-attachments/assets/49cf6a33-ff5f-45d7-845c-a64be7a86687" />


# Configuration

## Used plugins
The following amazing plugins are used:
- [Dataview](https://github.com/blacksmithgu/obsidian-dataview)
- [Buttons](https://github.com/shabegom/buttons)
- [Templater](https://github.com/SilentVoid13/Templater)
- [QuickAdd](https://github.com/chhoumann/quickadd)
- [Obsidian Charts](https://github.com/phibr0/obsidian-charts)
- [MediaExtended](https://github.com/aidenlx/media-extended)
- [Heatmap Calendar](https://github.com/Richardsl/heatmap-calendar-obsidian)
- [CustomJS](https://github.com/saml-dev/obsidian-custom-js)

## Configuration of QuickAdd
1. Open QuickAdd settings
2. Press "Manage macros"
3. Add two new macros named something like "Add exercise" and "Add workout"
4. Configure the macros by pressing "Configure"
5. Select a "User Script" corresponding to the macro you are configuring
<img width="184" alt="image" src="https://user-images.githubusercontent.com/1998726/212767899-0a338728-4d6e-4efb-ab02-0e663bcc42c9.png">
6. Press "Add"
Make sure you do this for both macros you created in #3
7. Back out to QuickAdd settings
8. Add two new "choices" of "Macro" type.
<img width="376" alt="image" src="https://user-images.githubusercontent.com/1998726/212768331-86bb9ef7-5049-4f1b-aba4-a69f2917bc47.png">
9. Press the "Cog" next to the "Choice" you added
10. Select the corresponding macro (Add workout or Add exercise)
11. Press the "Flash" symbol next to each choice to add and obsidian command for them

<br><br>
When completed it should look something like this:
<br><br>
<img width="540" alt="image" src="https://user-images.githubusercontent.com/1998726/212767442-ed2c4f23-a3b9-4bd6-9624-e3032c728a4a.png">
