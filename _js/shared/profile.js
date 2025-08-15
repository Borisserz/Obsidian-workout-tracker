
class profile {

    renderCharacterSheet({ dv, container }) {

        const athleteName = "your name";
        const classMap = {
    'chest': 'Press Master',
    'legs': 'Squat Legend',
    'back': 'Pull Titan',
    'biceps': 'Curl King',
    'triceps': 'Extension Overlord',
    'deltoids': 'Shoulder Architect',
    'abs': 'Captain Core'
};
const defaultClass = "Universal Soldier";
        const baseXpPerWorkout = 100;
        const xpPerTonne = 200;
        const xpNeededForLevelUp = 1000;
        const workouts = dv.pages('#workout and -"Templates"');
        const exercises = dv.pages('#exercise and -"Templates"');
        const exercisesArray = Array.from(exercises);

        let totalXP = 0;
        for (const workout of workouts) {
            totalXP += baseXpPerWorkout;
            const workoutId = workout.id ?? workout.file.name;
            const performedInWorkout = exercises.where(e => e.workout_id === workoutId);
            const workoutVolume = Array.from(performedInWorkout).reduce((sum, ex) => {
                const weight = parseFloat(ex.weight) || 0;
                const sets = parseFloat(ex.sets) || 0;
                const reps = parseFloat(ex.reps) || 0;
                return sum + (weight * sets * reps);
            }, 0);
            totalXP += Math.round((workoutVolume / 5000) * xpPerTonne);
        }
        const currentLevel = Math.floor(totalXP / xpNeededForLevelUp) + 1;
        const xpForNextLevel = totalXP % xpNeededForLevelUp;
        const progressPercent = Math.round((xpForNextLevel / xpNeededForLevelUp) * 100);

        const totalTonnage = exercisesArray.reduce((sum, ex) => sum + (parseFloat(ex.weight) || 0) * (parseFloat(ex.sets) || 0) * (parseFloat(ex.reps) || 0), 0);
        const totalWorkouts = workouts.length;
        const totalFailureExercises = exercises.where(e => e.effort == 5).length;
        const totalReps = exercisesArray.reduce((sum, ex) => sum + (parseFloat(ex.sets) || 0) * (parseFloat(ex.reps) || 0), 0);
        
        const muscleGroupTags = Object.keys(classMap);
        const tagCounts = {};
        for (const exercise of exercises) {
            for (const tag of exercise.file.tags) {
                const cleanTag = tag.replace('#', '').toLowerCase();
                if (muscleGroupTags.includes(cleanTag)) {
                    tagCounts[cleanTag] = (tagCounts[cleanTag] || 0) + 1;
                }
            }
        }
        const muscleGroupCounts = Object.entries(tagCounts)
            .map(([group, count]) => ({ group, count }))
            .sort((a, b) => b.count - a.count);

        const comboClassMap = {
   'back-chest': 'Torso Master',
'biceps-triceps': 'Arm Overlord',
'chest-deltoids': 'Upper Body Architect',
'chest-triceps': 'The Living Press',
'back-biceps': 'Iron Grip',
'back-deltoids': 'Winged Warrior',
'back-quadriceps': 'Steel Core',
'abs-quadriceps': 'Power Foundation',
'back-abs': 'Unbreakable Core',
'abs-chest': 'Steel Armor',
'biceps-deltoids': "Athlete's Peak",
'deltoids-triceps': 'Diamond Cutter'
};
        const comboThreshold = 0.75;

        let athleteClass = defaultClass;
        if (muscleGroupCounts.length > 0) {
            const primaryGroup = muscleGroupCounts[0];
            const secondaryGroup = muscleGroupCounts.length > 1 ? muscleGroupCounts[1] : null;
            let isCombo = false;
            if (secondaryGroup && secondaryGroup.count >= primaryGroup.count * comboThreshold) {
                const comboKey = [primaryGroup.group, secondaryGroup.group].sort().join('-');
                if (comboClassMap[comboKey]) {
                    athleteClass = comboClassMap[comboKey];
                    isCombo = true;
                }
            }
            if (!isCombo) {
                athleteClass = classMap[primaryGroup.group] || defaultClass;
            }
        }
        
        const prExercises = {
'Best Bench Press': 'Best Bench Press',
'Best Squat': 'Best Squat',
'Best Deadlift': 'Best Deadlift',
'Best Shoulder Press': 'Best Shoulder Press'
        };

        const personalRecords = Object.entries(prExercises).map(([searchString, prName]) => {
            const bestExercise = exercises
                .where(e => e.exercise && e.exercise.toLowerCase().includes(searchString.toLowerCase()))
                .sort(e => parseFloat(e.weight) || 0, 'desc')
                [0];

            const prValue = bestExercise ? `${bestExercise.weight} kg (${bestExercise.reps} reps )` : "No data";
            return { name: prName, value: prValue };
        });

     
  dv.header(2, "👤 Character Sheet");
        container.innerHTML = '';
        container.style.cssText = `background-color: var(--background-secondary); border: 1px solid var(--background-modifier-border); border-radius: 8px; padding: 16px; margin-top: 10px;`;
        
        const header = container.createEl('div', { attr: { style: "text-align: center; margin-bottom: 15px;" } });
        header.createEl('h3', { text: `🏋️ ${athleteName} 🏋️`, attr: { style: "margin: 0;" } });
        header.createEl('span', { text: `Класс: ${athleteClass}`, attr: { style: "font-style: italic; color: var(--text-muted);" } });

        const levelContainer = container.createEl('div', { attr: { style: "margin-bottom: 20px;" } });
        levelContainer.createEl('div', { text: `Level ${currentLevel}` });
        const progressWrapper = levelContainer.createEl('div', { attr: { style: 'display: flex; align-items: center; gap: 10px;' } });
        progressWrapper.createEl('progress', { attr: { value: xpForNextLevel, max: xpNeededForLevelUp, style: "width: 100%;" } });
        progressWrapper.createEl('span', { text: `${progressPercent}%` });

        const statsContainer = container.createEl('div', { attr: { style: "display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;" } });
        const createStatCard = (icon, title, value) => {
            const card = statsContainer.createEl('div', { attr: { style: "background-color: var(--background-primary); padding: 10px; border-radius: 5px;" } });
            card.createEl('div', { text: `${icon} ${title}` });
            card.createEl('div', { text: `${value}`, attr: { style: 'font-size: 1.2em;' } });
        };
        createStatCard('💪', 'Strength', `${Math.round(totalTonnage / 1000).toLocaleString('en-US')} t`);
    createStatCard('🏃‍♂️', 'Endurance', `${totalWorkouts} workouts`);
    createStatCard('🔥', 'Grit (to failure)', `${totalFailureExercises} exercises`);
    createStatCard('⚙️', 'Mastery (reps)', `${totalReps.toLocaleString('en-US')}`);

const profileContainer = container.createEl('div');

const recordsContainer = container.createEl('div', { attr: { style: "margin-top: 20px;" } });
recordsContainer.createEl('h4', { text: '🏆 Personal Records', attr: { style: "margin-bottom: 10px;" } });
const recordsList = recordsContainer.createEl('ul', { attr: { style: "list-style: none; padding: 0;" } });
        personalRecords.forEach(pr => {
            recordsList.createEl('li', { text: `${pr.name}: ${pr.value}` });
        });        
    }


renderAchievements(n) {
   n.dv.header(2, "🏅 Achievements");

const workouts = n.dv.pages('#workout').sort(p => p.date, 'desc');
const exercises = n.dv.pages('#exercise').sort(p => p.date, 'desc');

const achievements = [
    
    { name: "First Steps", icon: "🥇", desc: "Complete your first workout.", check: (w, e) => ({ unlocked: w.length >= 1, current: w.length, target: 1 }) },
    { name: "Amateur", icon: "💪", desc: "Complete 10 workouts.", check: (w, e) => w.length >= 10 },
    { name: "Athlete", icon: "🏋️", desc: "Complete 50 workouts.", check: (w, e) => w.length >= 50 },
    { name: "Breakthrough", icon: "🏆", desc: "Set your first personal record.", check: (w, e) => e.some(p => p.personal_record === true) },
    { name: "To the Limit", icon: "🔥", desc: "Perform 1 exercise to failure (effort 5).", check: (w, e) => e.filter(p => p.effort == 5).length >= 1 },
    { name: "Adrenaline Junkie", icon: "⚡", desc: "Perform 10 exercises to failure.", check: (w, e) => e.filter(p => p.effort == 5).length >= 10 },
    { name: "Pain Machine", icon: "🦾", desc: "Perform 50 exercises to failure.", check: (w, e) => e.filter(p => p.effort == 5).length >= 50 },
    { name: "Iron Will", icon: "💎", desc: "Perform 100 exercises to failure.", check: (w, e) => e.filter(p => p.effort == 5).length >= 100 },
    { name: "Marathoner", icon: "🏃‍♂️", desc: "Complete a workout with 40 or more sets.", check: (w, e) => {
        return e.groupBy(p => p.workout_id).some(wo => Array.from(wo.rows).reduce((sum, ex) => sum + (parseFloat(ex.sets) || 0), 0) >= 40);}},
    { name: "Therapist", icon: "🧠", desc: "Spend more than 2.5 hours in the gym during a single workout.", check: (w, e) => {
        return e.groupBy(p => p.workout_id).some(wo => {
            if (wo.rows.length < 2) return false;
            const sorted = wo.rows.sort((a,b) => new Date(a.date) - new Date(b.date));
            const firstExTime = moment(sorted[0].date);
            const lastExTime = moment(sorted[sorted.length - 1].date);
            return lastExTime.diff(firstExTime, 'minutes') >= 150;
        });
    }},
    { name: "Leg Day? Never Heard of It", icon: "🤡", desc: "Perform 3 times more arm/shoulder exercises than leg exercises.", 
        check: (w, e) => {
            const upperBodyCount = e.filter(p => 
                p.muscle_group?.toLowerCase() === 'biceps' || 
                p.muscle_group?.toLowerCase() === 'triceps' || 
                p.muscle_group?.toLowerCase() === 'deltoids'
            ).length;
            const legsCount = e.filter(p => p.muscle_group?.toLowerCase() === 'Quadriceps').length;
            return legsCount > 0 && upperBodyCount / legsCount >= 3;
        }
    },
    { name: "New Year's Hero", icon: "🎆", desc: "Complete a workout on January 1st or 2nd.", check: (w, e) => e.some(p => {
        const day = moment(p.date).dayOfYear();
        return day === 1 || day === 2;
    })},



        { name: "Chest Specialist", icon: "🧰", desc: "Perform 50 chest exercises.", 
    check: (w, e) => e.filter(p => p.file.tags.includes('chest')).length >= 50 },
{ name: "Chest Master", icon: "🛠️", desc: "Perform 150 chest exercises.", 
    check: (w, e) => e.filter(p => p.file.tags.includes('chest')).length >= 150 },
{ name: "Press Legend", icon: "👑", desc: "Perform 500 chest exercises.", 
    check: (w, e) => e.filter(p => p.file.tags.includes('chest')).length >= 500 },

{ name: "Leg Specialist", icon: "🦵", desc: "Perform 50 leg exercises.", 
    check: (w, e) => e.filter(p => p.file.tags.includes('legs')).length >= 50 },
{ name: "Squat Master", icon: "🏋️‍♂️", desc: "Perform 150 leg exercises.", 
    check: (w, e) => e.filter(p => p.file.tags.includes('legs')).length >= 150 },
{ name: "Quadzilla", icon: "🌋", desc: "Perform 500 leg exercises.", 
    check: (w, e) => e.filter(p => p.file.tags.includes('legs')).length >= 500 },

{ name: "Back Specialist", icon: "✈️", desc: "Perform 50 back exercises.", 
    check: (w, e) => e.filter(p => p.file.tags.includes('back')).length >= 50 },
{ name: "Pull Master", icon: "⚙️", desc: "Perform 150 back exercises.", 
    check: (w, e) => e.filter(p => p.file.tags.includes('back')).length >= 150 },
{ name: "Titan's Wings", icon: "🦅", desc: "Perform 500 back exercises.", 
    check: (w, e) => e.filter(p => p.file.tags.includes('back')).length >= 500 },

{ name: "Biceps Specialist", icon: "💪", desc: "Perform 50 biceps exercises.", 
    check: (w, e) => e.filter(p => p.file.tags.includes('biceps')).length >= 50 },
{ name: "Curl Master", icon: "🦾", desc: "Perform 150 biceps exercises.", 
    check: (w, e) => e.filter(p => p.file.tags.includes('biceps')).length >= 150 },
{ name: "Olympian Peaks", icon: "🏔️", desc: "Perform 500 biceps exercises.", 
    check: (w, e) => e.filter(p => p.file.tags.includes('biceps')).length >= 500 },

{ name: "Triceps Specialist", icon: "🔱", desc: "Perform 50 triceps exercises.", 
    check: (w, e) => e.filter(p => p.file.tags.includes('triceps')).length >= 50 },
{ name: "Extension Master", icon: "💥", desc: "Perform 150 triceps exercises.", 
    check: (w, e) => e.filter(p => p.file.tags.includes('triceps')).length >= 150 },
{ name: "Diamond Arms", icon: "💎", desc: "Perform 500 triceps exercises.", 
    check: (w, e) => e.filter(p => p.file.tags.includes('triceps')).length >= 500 },

{ name: "Abs Specialist", icon: "🍫", desc: "Perform 50 abs exercises.", 
    check: (w, e) => e.filter(p => p.file.tags.includes('abs')).length >= 50 },
{ name: "Crunch Master", icon: "🌀", desc: "Perform 150 abs exercises.", 
    check: (w, e) => e.filter(p => p.file.tags.includes('abs')).length >= 150 },
{ name: "Steel Core", icon: "🛡️", desc: "Perform 500 abs exercises.", 
    check: (w, e) => e.filter(p => p.file.tags.includes('abs')).length >= 500 },

{ name: "Shoulder Specialist", icon: "🥥", desc: "Perform 50 shoulder exercises.", 
    check: (w, e) => e.filter(p => p.file.tags.includes('deltoids') || p.file.tags.includes('shoulders')).length >= 50 },
{ name: "Overhead Press Master", icon: "📈", desc: "Perform 150 shoulder exercises.", 
    check: (w, e) => e.filter(p => p.file.tags.includes('deltoids') || p.file.tags.includes('shoulders')).length >= 150 },
{ name: "Cannonball Shoulders", icon: "💣", desc: "Perform 500 shoulder exercises.", 
    check: (w, e) => e.filter(p => p.file.tags.includes('deltoids') || p.file.tags.includes('shoulders')).length >= 500 },
    
{ 
    name: "Kiloton Overlord", icon: "🌌", desc: "Lift a total of over 1,000,000 kg (a thousand tons!).", check: (w, e) => {
        const totalVolume = Array.from(e).reduce((sum, ex) => sum + (parseFloat(ex.weight) || 0) * (parseFloat(ex.sets) || 0) * (parseFloat(ex.reps) || 0), 0);
        return totalVolume >= 1000000;
    }
},
{ 
    name: "Tectonic Shift", icon: "🌍", desc: "Lift a total of over 10,000,000 kg.", check: (w, e) => {
        const totalVolume = Array.from(e).reduce((sum, ex) => sum + (parseFloat(ex.weight) || 0) * (parseFloat(ex.sets) || 0) * (parseFloat(ex.reps) || 0), 0);
        return totalVolume >= 10000000;
    }
},
{ 
    name: "Iron Habit", icon: "⛓️", desc: "Complete 20 workouts in a single calendar month.", check: (w, e) => {
        const months = w.groupBy(p => moment(p.date).format("YYYY-MM"));
        return months.some(month => month.rows.length >= 20);
    }
},
{ 
    name: "A Year at the Gym", icon: "🗓️", desc: "Train at least once in 52 different weeks.", check: (w, e) => {
        const uniqueWeeks = new Set(w.map(p => moment(p.date).format("YYYY-ww")));
        return uniqueWeeks.size >= 52;
    }
},
{ 
    name: "The Iron Counter", icon: "💯", desc: "Perform 10,000 total reps.", check: (w, e) => {
        return Array.from(e).reduce((sum, ex) => sum + (parseFloat(ex.reps) || 0) * (parseFloat(ex.sets) || 0), 0) >= 10000;
    }
},
{ 
    name: "Rep Master", icon: "♾️", desc: "Perform 50,000 total reps.", check: (w, e) => {
        return Array.from(e).reduce((sum, ex) => sum + (parseFloat(ex.reps) || 0) * (parseFloat(ex.sets) || 0), 0) >= 50000;
    }
},
{ 
    name: "Rep Lord", icon: "👾", desc: "Perform 100,000 reps. You now know the true meaning of the grind.", check: (w, e) => {
        return Array.from(e).reduce((sum, ex) => sum + (parseFloat(ex.reps) || 0) * (parseFloat(ex.sets) || 0), 0) >= 100000;
    }
},
{ 
    name: "A Thousand Sets", icon: "📈", desc: "Perform 1,000 total sets.", check: (w, e) => {
        return Array.from(e).reduce((sum, ex) => sum + (parseFloat(ex.sets) || 0), 0) >= 1000;
    }
},
{ 
    name: "Tireless", icon: "🔋", desc: "Perform 5,000 sets. Your middle name is 'one more set'.", check: (w, e) => {
        return Array.from(e).reduce((sum, ex) => sum + (parseFloat(ex.sets) || 0), 0) >= 5000;
    }
},
{ 
    name: "Press Grandmaster", icon: "🎯", desc: "Perform 10,000 reps in the Seated Dumbbell Press.", check: (w, e) => {
        const exerciseName = "seated dumbbell press"; // "Жим гантелей сидя" in English
        const filteredExercises = e.filter(p => p.exercise?.toLowerCase().includes(exerciseName));
        return Array.from(filteredExercises).reduce((sum, ex) => sum + (parseFloat(ex.reps) || 0) * (parseFloat(ex.sets) || 0), 0) >= 10000;
    }
},
{ 
    name: "Olympus Conqueror", icon: "🏛️", desc: "Bench press 100 kg.", check: (w, e) => {
        const exerciseName = "barbell bench press"; // "жим штанги лежа" in English
        const targetWeight = 100;
        return e.some(p => p.exercise?.toLowerCase().includes(exerciseName) && (parseFloat(p.weight) || 0) >= targetWeight);
    }
},
{ 
    name: "The Iron Era", icon: "⏳", desc: "Keep training for 2 years.", check: (w, e) => {
        if (w.length < 2) return false;
        const sorted = w.sort(p => p.date, 'asc');
        const firstDay = moment(sorted[0].date);
        const lastDay = moment(sorted[sorted.length - 1].date);
        return lastDay.diff(firstDay, 'years') >= 2;
    }
},
{ 
    name: "Iron Dedication", icon: "💯", desc: "Complete 1000 workouts.", check: (w, e) => w.length >= 1000 
},
     
{ 
    name: "Unbreakable", icon: "🛡️", desc: "Train at least once in each of 12 consecutive months.", check: (w, e) => {
        const months = new Set(w.map(p => moment(p.date).format('YYYY-MM')));
        let consecutive = 0;
        let maxConsecutive = 0;
        let start = moment().subtract(5, 'years'); 
        let end = moment();
        while(start.isBefore(end)) {
            if (months.has(start.format('YYYY-MM'))) {
                consecutive++;
            } else {
                consecutive = 0;
            }
            maxConsecutive = Math.max(maxConsecutive, consecutive);
            start.add(1, 'month');
        }
        return maxConsecutive >= 12;
    }
},
{ 
    name: "Body Architect", 
    icon: "🏛️", 
    desc: "Reach 'Specialist' level (50 exercises) in all 7 muscle groups.", 
    check: (w, e) => {
        const officialGroups = ['chest', 'quadriceps', 'back', 'biceps', 'triceps', 'abs', 'deltoids'];
        const groupToTagMap = {
            'quadriceps': ['legs'], 
            'deltoids': ['deltoids', 'shoulders'], 
        };
        return officialGroups.every(groupName => {
            const tagsToCheck = groupToTagMap[groupName] || [groupName];
            const count = e.filter(p => 
                tagsToCheck.some(tag => p.file.tags.includes(tag))
            ).length;
            
            return count >= 50;
        });
    }
},
{ 
    name: "Monolith", icon: "🗿", desc: "Lift 200 kg in any exercise.", check: (w, e) => {
        const targetWeight = 200;
        return e.some(p => (parseFloat(p.weight) || 0) >= targetWeight);
    }
},
{ 
    name: "Four Seasons Warrior", icon: "🍂", desc: "Train in winter, spring, summer, and autumn.", check: (w, e) => {
        const seasons = new Set(w.map(p => moment(p.date).quarter()));
        return seasons.size === 4;
    }
}

];

achievements.forEach(a => a.isUnlocked = a.check(workouts, exercises));
const unlocked = achievements.filter(a => a.isUnlocked).sort((a,b) => a.name.localeCompare(b.name));
const locked = achievements.filter(a => !a.isUnlocked).sort((a,b) => a.name.localeCompare(b.name));

if (unlocked.length > 0) {
    n.dv.header(3, "Unlocked Achievements");
    n.dv.table(["", "Name", "Description"], unlocked.map(a => [a.icon, a.name, a.desc]));
}

if (locked.length > 0) {
    n.dv.header(3, "Future Goals");
    n.dv.table(["", "Name", "Description"], locked.map(a => [a.icon, a.name, a.desc]));
}
}

renderMonthlyTonnageChart({ dv, container }) {
    dv.header(3, "📈 Total Tonnage by Month");

    const exercises = dv.pages('#exercise and -"Templates"');

    if (exercises.length === 0) {
        dv.paragraph("No data to display the chart. Start working out!");
        return;
    }

    const monthlyTonnage = {};
    for (const ex of exercises) {
        if (!ex.date) continue; 

        const volume = (parseFloat(ex.weight) || 0) * (parseFloat(ex.sets) || 0) * (parseFloat(ex.reps) || 0);
        if (volume === 0) continue; 

        const monthKey = moment(ex.date).format('YYYY-MM');
        monthlyTonnage[monthKey] = (monthlyTonnage[monthKey] || 0) + volume;
    }

    const sortedMonths = Object.keys(monthlyTonnage).sort();
    
    if (sortedMonths.length === 0) {
        dv.paragraph("No tonnage data to build the chart.");
        return;
    }

        const chartLabels = sortedMonths.map(month => moment(month, 'YYYY-MM').locale('ru').format('MMM YYYY'));
        const tonnageDataInTonnes = sortedMonths.map(month => Math.round(monthlyTonnage[month] / 1000));

        const chartData = {
            type: 'bar',
            data: {
                labels: chartLabels,
                datasets: [{
                    label: 'Total Tonnage (tons)',
                    data: tonnageDataInTonnes,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Tonnage (tons)'
                        }
                    },
                    x: {
                         title: {
                            display: true,
                            text: 'Month'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false 
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += context.parsed.y.toLocaleString('en-US') + ' t';
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        };

        const chartContainer = container.createEl('div', { attr: { style: "height: 300px; position: relative;" }});
        window.renderChart(chartData, chartContainer);
    }

  renderExerciseHeatmap({ dv, container }) {
    dv.header(3, "🔥 Top 10 Exercises"); 

    const exercises = dv.pages('#exercise and -"Templates"');

    if (exercises.length === 0) {
        dv.paragraph("No data to build a heat map.");
        return;
    }
    const exerciseCounts = {};
    for (const ex of exercises) {
        if (!ex.exercise) continue;
        const exerciseName = ex.exercise.trim();
        exerciseCounts[exerciseName] = (exerciseCounts[exerciseName] || 0) + 1;
    }

    const sortedExercises = Object.entries(exerciseCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
    
    const top10Exercises = sortedExercises.slice(0, 10);

    if (top10Exercises.length === 0) {
        dv.paragraph("No completed exercises found.");
        return;
    }

    const maxCount = top10Exercises[0].count;
    const minCount = top10Exercises[top10Exercises.length - 1].count;

    const getColorForCount = (count) => {
        const coldColor = { r: 173, g: 216, b: 230 }; 
        const hotColor = { r: 255, g: 69, b: 0 };
        const range = maxCount - minCount;
        const percentage = range > 0 ? (count - minCount) / range : 1;
        const r = Math.round(coldColor.r + percentage * (hotColor.r - coldColor.r));
        const g = Math.round(coldColor.g + percentage * (hotColor.g - coldColor.g));
        const b = Math.round(coldColor.b + percentage * (hotColor.b - coldColor.b));
        return `rgba(${r}, ${g}, ${b}, 0.7)`;
    };
    const tableData = top10Exercises.map(item => {
        const backgroundColor = getColorForCount(item.count);
        const countCell = dv.el('div', item.count, {
            attr: {
                style: `
                    background-color: ${backgroundColor};
                    color: white;
                    font-weight: bold;
                    text-align: center;
                    border-radius: 5px;
                    padding: 5px;
                    text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
                `
            }
        });
        return [item.name, countCell];
    });

    dv.table(["Exercise", "Frequency"], tableData);

}



}