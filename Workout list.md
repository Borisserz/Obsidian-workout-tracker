
```button
name Add workout
type command
action QuickAdd: Add workout
color green
```
^button-wf7a

```dataviewjs

let pages = dv.pages('"Workouts" and #workout').sort(p => p.file.day || p.date, "desc");

dv.header(3, "Total number of workouts: " + pages.length.toString());

dv.table(["Last workouts", "Date", "Workout type"], pages.slice(0, 5)
    .map(e => {
        let displayDate = "No date"; 
        if (e.file.day) {
            displayDate = moment(e.file.day.toJSDate()).format('YYYY-MM-DD');
        } else if (e.date) {
            displayDate = moment(e.date).format('YYYY-MM-DD');
        }
        return [
            e.file.link,
            displayDate,
            e['workout']
        ];
    })
);
```

```dataviewjs
dv.span("** 😊 Workouts  😥**") ⏹️💤⚡⚠🧩↑↓⏳📔💾📁📝🔄📝🔀⌨️🕸️📅🔍✨ */
const calendarData = {
    year: 2025,  
    colors: {    
        blue:        ["#8cb9ff", "#69a3ff", "#428bff", "#1872ff", "#0058e2"], 
        green:       ["#c6e48b", "#7bc96f", "#49af5d", "#2e8840", "#196127"],
        red:         ["#ff9e82", "#ff7b55", "#ff4d1a", "#e73400", "#bd2a00"],
        orange:      ["#ffa244", "#fd7f00", "#dd6f00", "#bf6000", "#9b4e00"],
        pink:        ["#ff96cb", "#ff70b8", "#ff3a9d", "#ee0077", "#c30062"],
        orangeToRed: ["#ffdf04", "#ffbe04", "#ff9a03", "#ff6d02", "#ff2c01"]
    },
    showCurrentDayBorder: true, 
    defaultEntryIntensity: 4,   
    intensityScaleStart: 10,    
    intensityScaleEnd: 100,  
    entries: [],                
}

for (let page of dv.pages('#workout')) 
{
    if (!page.file.day) {
        continue;
    }
	let metadata = app.metadataCache.getFileCache(page.file);
	let color = null;
	
	if(metadata.frontmatter['type'] != null)
	{
		let colors = Object.keys(calendarData.colors); 
		color = colors[metadata.frontmatter['sub_type']-1];
	}
	else
		color = metadata.frontmatter.tags.includes('2-1') ? "orange" : 'green'
    if(metadata.frontmatter['id'] == null)
	    continue;
        
	let formattedDate = page.file.day.toFormat("yyyy-MM-dd");
    calendarData.entries.push({
        date: formattedDate,
        intensity: 1, 
        color: color
    })
}

renderHeatmapCalendar(this.container, calendarData)
```

```dataviewjs

const allExercises = dv.pages('#exercise');
const exercisesArray = Array.from(allExercises);
const totalVolume = exercisesArray.reduce((sum, exercise) => {
    const weight = parseFloat(exercise.weight) || 0;
    const sets = parseFloat(exercise.sets) || 0;
    const reps = parseFloat(exercise.reps) || 0;

    return sum + (weight * sets * reps);
}, 0); 


const formattedVolume = Math.round(totalVolume).toLocaleString('ru-RU');


dv.header(3, `Total weight lifted: ${formattedVolume} кг 🏋️`);;
```


# 🧘‍♂️ Recovery status
```dataviewjs

const exercises = dv.pages('#exercise and -"Templates"');
const muscleGroups = ['chest', 'legs', 'back', 'biceps', 'triceps', 'deltoids', 'abs'];
const lastWorkoutDate = {};

for (let ex of exercises) {
    if (!ex.date) continue; 

    const workoutDate = dv.date(ex.date);
    const groupsInExercise = new Set();
    const tags = (ex.file.tags || []).map(t => t.replace('#', '').toLowerCase());
    const fields = (ex.muscle_group || "").split(',').map(g => g.trim().toLowerCase());

    [...tags, ...fields].forEach(group => {
        if (muscleGroups.includes(group)) {
            groupsInExercise.add(group);
        }
    });
    for (const group of groupsInExercise) {
        if (!lastWorkoutDate[group] || workoutDate > lastWorkoutDate[group]) {
            lastWorkoutDate[group] = workoutDate;
        }
    }
}

const recoveryData = muscleGroups.map(group => {
    const lastDate = lastWorkoutDate[group];
    if (!lastDate) {
        return [group, "No data", "—", "🤔"];
    }

    const daysRest = Math.floor(moment().diff(moment(lastDate.toJSDate()), 'days'));
    
    let status, icon;
    if (daysRest <= 1) {
        status = "Recovery";
        icon = "⏳";
    } else if (daysRest <= 3) {
        status = "Ready to go";
        icon = "✅";
    } else {
        status = "Completely fresh";
        icon = "🔥";
    }
    const formattedGroup = group.charAt(0).toUpperCase() + group.slice(1);
    
    return [`**${formattedGroup}**`, lastDate.toFormat("yyyy-MM-dd"), `${daysRest} д.`, `${icon} ${status}`];
});

dv.table(["Muscle Group", "Last Workout", "Rest Days", "Status"], recoveryData);
```



```dataviewjs
let yearFilter = 2025;
let workouts = dv.pages('#workout')
    .where(p => {
        if (!p.date) return false;
        let dateStr = typeof p.date === "string" ? p.date.replace(" ", "T") : p.date;
        let d = dv.date(dateStr);
        return d != null && d.year === yearFilter;
    });

dv.header(3, `Total workouts in ${yearFilter}: ${workouts.length}`);

dv.header(3, "🎯 Balance of muscle groups");

const exercises = dv.pages('#exercise and -"Templates"');
const muscleGroupCounts = {};
const muscleGroups = ['chest', 'legs', 'back', 'biceps', 'triceps', 'deltoids', 'abs'];

muscleGroups.forEach(group => {
    muscleGroupCounts[group] = 0;
});

for (let e of exercises) {
    const uniqueGroupsForExercise = new Set();
    if (e.muscle_group) {
        const groupsFromField = String(e.muscle_group).split(',');
        groupsFromField.forEach(g => {
            const cleanGroup = g.trim().toLowerCase();
            if (muscleGroups.includes(cleanGroup)) {
                uniqueGroupsForExercise.add(cleanGroup);
            }
        });
    }

    for (const tag of e.file.tags) {
        const cleanTag = tag.replace('#', '').toLowerCase();
        if (muscleGroups.includes(cleanTag)) {
            uniqueGroupsForExercise.add(cleanTag);
        }
    }

    for (const group of uniqueGroupsForExercise) {
        muscleGroupCounts[group]++;
    }
}

const chartData = {
    type: 'radar',
    data: {
        labels: Object.keys(muscleGroupCounts).map(g => g.charAt(0).toUpperCase() + g.slice(1)),
        datasets: [{
            label: 'Количество упражнений',
            data: Object.values(muscleGroupCounts),
            fill: true,
            backgroundColor: 'rgba(232, 15, 136, 0.2)',
            borderColor: 'rgb(232, 15, 136)',
            pointBackgroundColor: 'rgb(232, 15, 136)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(232, 15, 136)'
        }]
    },
    options: {
        responsive: true,
        scales: {
            r: {
                angleLines: {
                    display: false
                },
                suggestedMin: 0
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    }
};

window.renderChart(chartData, this.container);

```