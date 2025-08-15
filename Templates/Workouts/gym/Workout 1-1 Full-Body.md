---
date: <% tp.date.now("YYYY-MM-DD") %>
workout_title: Workout 1-1 Full-Body
exercises:
  - 11
  - 12
  - 13
  - 14
  - 15
  - 16
  - 17
  - 18
  - 21
  - 22
  - 23
  - 24
  - 25
  - 26
  - 27
  - 31
  - 32
  - 33
  - 34
  - 41
  - 42
  - 43
  - 44
  - 45
  - 46
  - 51
  - 52
  - 53
  - 54
  - 55
  - 61
  - 62
  - 63
  - 64
  - 65
  - 66
  - 67
  - 68
  - 69
  - 71
  - 72
  - 73
workout_order:
  - 11
  - 12
  - 13
  - 14
  - 15
  - 16
  - 17
  - 18
  - 21
  - 22
  - 23
  - 24
  - 25
  - 26
  - 27
  - 31
  - 32
  - 33
  - 34
  - 41
  - 42
  - 43
  - 44
  - 45
  - 46
  - 51
  - 52
  - 53
  - 54
  - 55
  - 61
  - 62
  - 63
  - 64
  - 65
  - 66
  - 67
  - 68
  - 69
  - 71
  - 72
  - 73
workout: 1-1
type: 1
sub_type: 1
tags:
  - workout
---

```dataviewjs
console.log('customJS:', window.customJS);
console.log('customJS.workout:', window.customJS?.workout);
const {workout} = customJS;
const note = {dv: dv, container: this.container, window: window};

workout.renderHeader(note);

```

## Remaining Exercises
```dataviewjs

const {workout} = customJS;
const note = {dv: dv, container: this.container, window: window};

workout.renderRemaining(note);

```

## Performed Exercises
```button
name Log
type command
action QuickAdd: Log
color green
```
^button-2vzj
```dataviewjs
const { workout } = customJS; 
setTimeout(async () => { try {

const bodyContainer = this.container.createEl('div'); 
const performedContainer = this.container.createEl('div');
const renderXpForWorkout = this.container.createEl('div');
const effortChartContainer = this.container.createEl('div');
const muscleChartContainer = this.container.createEl('div');
const muscleVolumeChartContainer = this.container.createEl('div');

await workout.renderBodyFromJSON({ dv, container: bodyContainer, window }); workout.renderPerformed({ dv, container: performedContainer, window }); 
workout.renderXpForWorkout({ dv, container: performedContainer, window }); 
workout.renderEffortChart({ dv, container: effortChartContainer, window }); 
workout.renderMuscleGroupChart({ dv, container: muscleChartContainer, window });
workout.renderMuscleVolumeChart({ dv, container: muscleVolumeChartContainer, window });} 

catch (e) { this.container.createEl('p', {text: `⚠️ Error rendering results: ${e.message}`}); console.error("Error in the training visualization block:", e); } }, 300);
```


