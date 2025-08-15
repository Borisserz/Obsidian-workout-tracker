```dataviewjs
const { profile } = customJS;

if (profile) {
    profile.renderCharacterSheet({ dv: dv, container: this.container });
} 

```

```dataviewjs
const { profile } = customJS;
if (profile) {
    profile.renderMonthlyTonnageChart({ dv: dv, container: this.container });
}
```


```dataviewjs
const { profile } = customJS;
if (profile) {
    profile.renderExerciseHeatmap({ dv: dv, container: this.container });
}
```

```dataviewjs
const {profile} = customJS; 
profile.renderAchievements({dv, container: this.container});
```
