class workout {

 renderHeader(n)
	{
		let self = n.dv.current()

		var timeStamp = moment(new Date(self['date']));
		var diff_days = timeStamp.diff(new Date(), "days");
		let date = moment(new Date(self['date']));
		console.log(diff_days);

		if(diff_days == 0)
			n.dv.header(1, date.format('YYYY-MM-DD') + " (today)");
		else if(diff_days == -1)
			n.dv.header(1, date.format('YYYY-MM-DD') + " (yesteday)");
		else if(diff_days == -2)
			n.dv.header(1, date.format('YYYY-MM-DD') + " (day before yesterday)");
		else
			n.dv.header(1, date.format('YYYY-MM-DD'));
	}
renderRemaining(n) {
  let metadata = app.metadataCache.getFileCache(n.dv.current().file);
  let workoutExerciseIds = metadata.frontmatter['exercises'] || [];
  let workout_order = metadata.frontmatter['workout_order'] || workoutExerciseIds.slice(); // fallback
  let workoutId = metadata.frontmatter['id'];

  let allExercises = n.dv.pages('#exercise');
  let performedExercisesForThisWorkout = [];
  let allPerformedExercises = [];
  let templateExercisesForThisWorkout = [];

  if (!workoutExerciseIds.length) {
    n.dv.paragraph("No exercises defined for this workout.");
    return;
  }


  for (const e of allExercises) {
    let eMetadata = app.metadataCache.getFileCache(e.file);
    let e_workoutId = eMetadata?.frontmatter?.workout_id;
    let e_id = eMetadata?.frontmatter?.id;

    if (!e_id) continue;

    if (e_workoutId === workoutId) {
      performedExercisesForThisWorkout.push(e);
    } else if (e_workoutId != null) {
      allPerformedExercises.push(e);
    } else if(workoutExerciseIds.map(String).includes(String(e_id))) {
      e.index = workout_order.indexOf(e_id);
      templateExercisesForThisWorkout.push(e);
    }
  }

  let remainingExercises = templateExercisesForThisWorkout.filter(e =>
    !performedExercisesForThisWorkout.find(perf => perf.id === e.id)
  );

  remainingExercises.sort((a, b) => {
    if (a.index === -1) return 1;
    if (b.index === -1) return -1;
    return a.index - b.index;
  });

  let tableData = remainingExercises.map(e => {
    let fixedName = this.fixExerciseName(e.exercise);
    let relatedPerformed = allPerformedExercises.filter(pe =>
      this.fixExerciseName(pe.exercise).includes(fixedName) || pe.id === e.id
    );

    relatedPerformed.sort((a, b) => new Date(a.date) - new Date(b.date));

    let lastPerformed = relatedPerformed[relatedPerformed.length - 1] || {};

    return [
      `[[${e.file.path}|${e.exercise}]]`,
      e.muscle_group || '',
      lastPerformed.weight || '',
      lastPerformed.effort || ''
    ];
  });

  n.dv.table(["Exercise", "💪 Muscle Group", "🏋️ Weight", "😥 Effort"], tableData);
}

  renderPerformed(n) {
  let metadata = app.metadataCache.getFileCache(n.dv.current().file);
  let workoutId = metadata.frontmatter['id'];
  let pages = n.dv.pages("#exercise");
  let exercises = pages.sort(p => p['date'], 'asc');

  var performedExercises = [];
  let prevTimeStamp;
  let firstTimeStamp;
  let lastTimeStamp;
  let i = 0;

  let totalWeight = 0;

  for (const e of exercises) {
    metadata = app.metadataCache.getFileCache(e.file);
    let exerciseId = metadata.frontmatter['workout_id'];
    if (exerciseId != workoutId) continue;
    if (i == 0) {
      prevTimeStamp = moment(new Date(e['date']));
      firstTimeStamp = prevTimeStamp;
    }

    var timeStamp = moment(new Date(e['date']));
    lastTimeStamp = timeStamp;

    var diff_sec = timeStamp.diff(prevTimeStamp, "seconds");
    var diff_min = Math.floor(diff_sec / 60).toString();
    var diff_sec_remain = (diff_sec % 60).toString();
    var timeDiff = i == 0 ? timeStamp.format("HH:mm") : diff_min + 'm ' + diff_sec_remain + "s";

    performedExercises.push([
      '[[' + e.file.path + '|' + e['exercise'] + ']]',
      e["weight"] ?? '',
      e["sets"] ?? '',
      e["reps"] ?? '',
      timeDiff,
      e['note'] ?? ''
    ]);

    let sets = parseInt(e.sets || 0);
    let reps = parseInt(e.reps || 0);
    let weight = parseFloat(e.weight || 0);
    totalWeight += sets * reps * weight;

    prevTimeStamp = timeStamp;
    i++;
  }

 
    n.dv.table(["Exercice", "🏋🏼", "Sets", "Reps", "⏱", "🗒"], performedExercises);

  if (lastTimeStamp != null && firstTimeStamp != null) {
    let total_sec = lastTimeStamp.diff(firstTimeStamp, "seconds");
    let diff_hours = Math.floor(total_sec / 3600);
    let diff_min_remain = Math.round((total_sec % 3600) / 60);
    let totalTimeStr = diff_hours + "h " + diff_min_remain + "m";

    n.dv.header(3, "Workout time: " + totalTimeStr);
  }



    if (totalWeight > 0) {
   
    const smallEquivalents = [
{ weight: 4, label: 'domestic cats' },
{ weight: 8, label: 'watermelons' },
{ weight: 10, label: 'turkeys' },
{ weight: 15, label: 'bicycles' },
{ weight: 20, label: 'golden retrievers' },
{ weight: 25, label: 'bags of potatoes' },
{ weight: 50, label: 'bags of cement' },
{ weight: 70, label: 'average people' },
{ weight: 100, label: 'large punching bags' }
];

  
    const largeEquivalents = [
{ weight: 200, label: 'brown bears' },
{ weight: 500, label: 'racehorses' },
{ weight: 1500, label: 'cars' },
{ weight: 5000, label: 'African elephants' },
{ weight: 7000, label: 'T-34 tanks' },
{ weight: 25000, label: 'Tyrannosaurs' },
{ weight: 180000, label: 'blue whales' },
{ weight: 440000, label: 'International Space Stations' }
];

    const compliments = [
        "You're an absolute beast! 🔥",
        "Incredible power! 💪",
        "What a machine! 🤖",
        "That was legendary! 🏆",
        "Somebody stop this titan! 🗿",
        "Keep it up, champ! 🥇",
        "Will of iron, muscles of steel! 🦾",
        "You just rewrote the laws of physics! ⚛️",
        "Gravity clearly lost today. ⚛️" ,
        "The barbells in the gym are looking at you with respect (and a little fear). 🔥",
        "Looks like someone ate their spinach today. 💪",
        "Did you leave any weights for the rest of us? 🤖 "
    ];


    const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const smallEquivalent = getRandomItem(smallEquivalents);
    const largeEquivalent = getRandomItem(largeEquivalents);
    const randomCompliment = getRandomItem(compliments);
    const smallCount = (totalWeight / smallEquivalent.weight).toFixed(1);
    const largeCount = (totalWeight / largeEquivalent.weight).toFixed(2);


    n.dv.paragraph(`🏋️ During your workout **${Math.round(totalWeight)} kg**!`);
    n.dv.paragraph(`That's roughly equivalent to **${smallCount} ${smallEquivalent.label}**.`);
    n.dv.paragraph(`Or, on a larger scale, that's **${largeCount} ${largeEquivalent.label}**. ${randomCompliment}`);
  }
}
  renderMuscleGroupChart(n) {
    const metadata = app.metadataCache.getFileCache(n.dv.current().file);
    const workoutId = metadata.frontmatter['id'];

   
    const mainGroupMap = {
       'chest': 'Chest',
'lower-back': 'Back',
'upper-back': 'Back',
'trapezius': 'Back',
'lats': 'Back',
'quadriceps': 'Legs',
'hamstrings': 'Legs',
'glutes': 'Legs',
'calves': 'Legs',
'legs': 'Legs',
'biceps': 'Biceps',
'triceps': 'Triceps',
'deltoids': 'Shoulders',
'shoulders': 'Shoulders',
'abs': 'Abs',
'core': 'Abs'
    };

    
    const performedExercises = n.dv.pages('#exercise')
        .where(p => p.workout_id === workoutId && p.muscle_group && p.date)
        .sort(p => p.date, 'asc');
    if (performedExercises.length === 0) {
        n.dv.paragraph("No exercises to chart.");
        return;
    }

    const durations = [];
    for (let i = 0; i < performedExercises.length; i++) {
        if (i === 0) {
            durations.push(0);
        } else {
            const prevDate = new Date(performedExercises[i - 1].date);
            const currentDate = new Date(performedExercises[i].date);
            let diffSec = (currentDate - prevDate) / 1000;
            durations.push(diffSec > 0 ? diffSec : 0);
        }
    }

    
    const muscleTimesSec = {};
    for (let i = 0; i < performedExercises.length; i++) {
        const muscleGroupString = String(performedExercises[i].muscle_group || '');
        const specificGroups = muscleGroupString.split(',').map(g => g.trim().toLowerCase());

        for (const specificGroup of specificGroups) {
            if (mainGroupMap[specificGroup]) {
                const mainGroup = mainGroupMap[specificGroup];
                muscleTimesSec[mainGroup] = (muscleTimesSec[mainGroup] || 0) + durations[i];
            }
        }
    }

    const muscleGroups = Object.keys(muscleTimesSec);
    if (muscleGroups.length === 0) {
        return;
    }
    
    const muscleTimesMin = muscleGroups.map(g => muscleTimesSec[g] / 60);


    function formatMinutes(min) {
        if (min >= 60) {
            const hours = Math.floor(min / 60);
            const minutes = Math.round(min % 60);
            return `${hours} ч ${minutes} мин`;
        }
        return `${Math.round(min)} мин`;
    }
    const colors = ['rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)', 'rgba(255, 206, 86, 0.7)', 'rgba(75, 192, 192, 0.7)', 'rgba(153, 102, 255, 0.7)', 'rgba(255, 159, 64, 0.7)', 'rgba(100, 255, 100, 0.7)'];
    const backgroundColors = muscleGroups.map((_, i) => colors[i % colors.length]);

    const chartData = {
        type: 'bar',
        data: {
            labels: muscleGroups,
            datasets: [{
                label: 'Time (minutes)',
                data: muscleTimesMin,
                backgroundColor: backgroundColors,
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { 
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Minutes'
                    },
                },
                x: { 
                    title: {
                        display: true,
                        text: 'Muscle group'
                    },
                }
            },
            plugins: {
                legend: {
                    display: false 
                },
                tooltip: {
                    callbacks: {
                        label: ctx => formatMinutes(ctx.raw), 
                    }
                }
            }
        }
    };


    const chartContainer = n.container.createEl('div', { attr: { style: "height: 400px; position: relative;" }});
    window.renderChart(chartData, chartContainer);
}


  renderEffortChart(n) {
    const { utils } = customJS;
    const data = n.dv.current();
    let metadata = app.metadataCache.getFileCache(data.file);
    let workoutId = metadata.frontmatter['id'];
    let allFiles = app.vault.getMarkdownFiles();


    let performedExercises = utils.filterFiles((fm, tags) => { return tags.includes('#exercise') && fm['workout_id'] === workoutId; }, allFiles);
    performedExercises = utils.addTagsAndFrontmatter(performedExercises);

    performedExercises = performedExercises.sort(function (a, b) {
      return new Date(a.frontmatter['date']) - new Date(b.frontmatter['date']);
    });

    const datum = performedExercises.map((e) => { return moment(new Date(e.frontmatter['date'])); });
    const efforts = performedExercises.map((e) => { return e.frontmatter['effort']; });

    const datasets = {
      labels: datum,
      datasets: [
        {
          label: 'Effort',
          data: efforts,
          borderColor: ['rgb(232, 15, 136)'],
          borderWidth: 3,
          xAxisID: 'x',
          yAxisID: 'y1',
        }
      ]
    };

    let scales =
    {
      x: {
        type: 'time',
        time: {
          unit: 'minute',
          displayFormats: {
            minute: 'HH:mm'
          }
        }
      },
      y1: {
        title: {
          display: true,
          text: 'Effort'
        },
        min: 0,
        max: 6,
        ticks: {
          callback: function (value, index, ticks) {
            return value > 0 && value < 6 ? value : '';
          }
        },
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        }
      }
    };

    const chartData = {
      type: 'line',
      data: datasets,
      options: {
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        stacked: false,
        layout: {
          padding: -5
        },
        plugins: {
          tooltip: {
            callbacks: {
              title: function (context) {
                return 'Exercice:';
              },
              label: function (context) {
                let e = performedExercises[context.dataIndex];
                return ' ' + e.frontmatter['exercise'];
              },
              afterLabel: function (context) {
                let e = performedExercises[context.dataIndex];
                return ' Effort: ' + e.frontmatter['effort'];
              }
            }
          }
        },
        scales: scales
      }
    };

    window.renderChart(chartData, n.container);

    function findPrevExercise(exercise) {
      let exercises = n.dv.pages('#exercise').sort(e => e['date'], 'desc');
      for (let e of exercises) {
        if (new Date(e['date']) < new Date(exercise['date']))
          return e;
      }
    }
  }

  fixExerciseName(e) {
    return e.replace(' - ', ' ').toLowerCase();
  }

async renderBodyFromJSON(note) {
 
    if (!document.getElementById('muscle-highlighter-styles')) {
        const styleEl = document.createElement('style');
        styleEl.id = 'muscle-highlighter-styles';
        const cssStyles = `
            .markdown-reading-view .muscle-map-grid-container {
                display: grid !important;
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 10px; padding: 10px 0; justify-items: center; align-items: start;
            }
            .muscle-map-container { width: 100%; max-width: 250px; }
            .muscle-map-container svg path {
                stroke: #f5f5f5; stroke-width: 2; transition: fill 0.3s ease-in-out;
            }
        `;
        styleEl.innerHTML = cssStyles;
        document.head.appendChild(styleEl);
    }
    

    const { dv, container } = note;

    container.innerHTML = '';

    try {
        const frontBodyJsonPath = 'assets/bodyFront.json';
        const backBodyJsonPath = 'assets/bodyBack.json';
        

        console.log("renderBodyFromJSON: Starting to draw body model.");

        const [frontJsonString, backJsonString] = await Promise.all([
            app.vault.adapter.read(frontBodyJsonPath),
            app.vault.adapter.read(backBodyJsonPath)
        ]);
        
        const frontData = JSON.parse(frontJsonString);
        const backData = JSON.parse(backJsonString);
        
        const workoutId = dv.current().id ?? dv.current().file.name;
        const performedExercises = dv.pages("#exercise")
            .where(p => p.workout_id === workoutId && p.muscle_group);

        console.log(`Found ${performedExercises.length} performed exercises for workout ID: ${workoutId}`);


        const muscleCounts = {};
        performedExercises.forEach(p => {
            const muscleGroups = String(p.muscle_group).toLowerCase().split(',');
            muscleGroups.forEach(group => {
                const trimmedGroup = group.trim();
                if (trimmedGroup) {
                    muscleCounts[trimmedGroup] = (muscleCounts[trimmedGroup] || 0) + 1;
                }
            });
        });

        console.log("Calculated muscle counts:", JSON.stringify(muscleCounts));
        
        const getColorByCount = (count) => {
            if (!count) return '#3f3f3f';
            if (count === 1) return 'rgba(146, 2, 162, 0.8)';
            if (count === 2) return 'rgba(33, 18, 148, 0.8)';
            if (count === 3) return 'rgba(9, 240, 20, 0.8)';
            if (count === 4) return 'rgba(241, 230, 11, 0.8)';
            return 'rgba(255, 0, 0, 0.8)';
        };

        const mainContainer = container.createEl('div', { cls: 'muscle-map-grid-container' });
        const frontContainer = mainContainer.createEl('div', { cls: 'muscle-map-container' });
        const backContainer = mainContainer.createEl('div', { cls: 'muscle-map-container' });
        
        const drawBody = (targetContainer, modelData, side) => {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('viewBox', '0 0 700 1400');
            svg.style.width = '100%';
            svg.style.height = 'auto';
            targetContainer.appendChild(svg);
            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            if (side === 'back') { group.setAttribute('transform', 'translate(-720, 0)'); }
            svg.appendChild(group);

            modelData.forEach(part => {
                const muscleSlug = part.slug.toLowerCase();
                const exerciseCount = muscleCounts[muscleSlug] || 0;
                const fillColor = getColorByCount(exerciseCount);
                
                for (const pathType in part.path) {
                    part.path[pathType].forEach(pathData => {
                        const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                        pathEl.setAttribute('d', pathData);
                        pathEl.setAttribute('fill', fillColor);
                        group.appendChild(pathEl);
                    });
                }
            });
        };

        drawBody(frontContainer, frontData, 'front');
        drawBody(backContainer, backData, 'back');
        console.log("renderBodyFromJSON: Finished drawing body model.");

    } catch (error) {
        container.createEl('p', { text: "⚠️ **renderBodyFromJSON:** " + error.message });
        console.error("Ошибка в renderBodyFromJSON:", error);
    }
}

renderXpForWorkout(n) {

    const baseXpPerWorkout = 100;      
    const xpPerTonne = 200;           
    
    const metadata = app.metadataCache.getFileCache(n.dv.current().file);
    const workoutId = metadata.frontmatter['id'];
    const exercises = n.dv.pages("#exercise").where(e => e.workout_id === workoutId);

    if (exercises.length === 0) {
        return; 
    }

    let workoutVolume = 0;
    for (const ex of exercises) {
        const weight = ex.weight || 0;
        const sets = ex.sets || 0;
        const reps = ex.reps || 0;
        workoutVolume += weight * sets * reps;
    }

    const xpFromVolume = Math.round((workoutVolume / 5000) * xpPerTonne);
    const totalXpForThisWorkout = baseXpPerWorkout + xpFromVolume;

    n.dv.header(3, "⭐ Experience Gained");
    n.dv.paragraph(
         `You earned **${totalXpForThisWorkout} XP** from this workout!`
    );
}

renderMuscleVolumeChart(n) {
    const metadata = app.metadataCache.getFileCache(n.dv.current().file);
    const workoutId = metadata.frontmatter['id'];
    const mainGroupMap = {
        'chest': 'Chest',
'lower-back': 'Back',
'upper-back': 'Back',
'trapezius': 'Back',
'lats': 'Back',
'quadriceps': 'Legs',
'hamstrings': 'Legs',
'glutes': 'Legs',
'calves': 'Legs',
'legs': 'Legs',
'biceps': 'Biceps',
'triceps': 'Triceps',
'deltoids': 'Shoulders',
'shoulders': 'Shoulders',
'abs': 'Abs',
'core': 'Abs'
    };

    const performedExercises = n.dv.pages('#exercise')
        .where(p => p.workout_id === workoutId && p.muscle_group);

    if (performedExercises.length === 0) {
        return;
    }

    const muscleVolumes = {};

    for (const exercise of performedExercises) {
        const volume = (exercise.weight || 0) * (exercise.sets || 0) * (exercise.reps || 0);

        if (volume === 0) continue;

        const muscleGroupString = String(exercise.muscle_group || '');
        const specificGroups = muscleGroupString.split(',').map(g => g.trim().toLowerCase());

        for (const specificGroup of specificGroups) {
            if (mainGroupMap[specificGroup]) {
                const mainGroup = mainGroupMap[specificGroup];
                muscleVolumes[mainGroup] = (muscleVolumes[mainGroup] || 0) + volume;
            }
        }
    }

    const muscleGroups = Object.keys(muscleVolumes);
    if (muscleGroups.length === 0) {
        return;
    }
    
    const muscleVolumeData = Object.values(muscleVolumes);
    
    const colors = ['rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)', 'rgba(255, 206, 86, 0.7)', 'rgba(75, 192, 192, 0.7)', 'rgba(153, 102, 255, 0.7)', 'rgba(255, 159, 64, 0.7)', 'rgba(100, 255, 100, 0.7)'];
    const backgroundColors = muscleGroups.map((_, i) => colors[i % colors.length]);

    const chartData = {
        type: 'bar',
        data: {
            labels: muscleGroups,
            datasets: [{
                label: 'Volume (kg)',
                data: muscleVolumeData,
                backgroundColor: backgroundColors,
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Total Volume (kg)'
                    },
                },
                x: {
                    title: {
                        display: true,
                        text: 'Muscle Group'
                    },
                }
            },
            plugins: {
                legend: {
                    display: false 
                },
                tooltip: {
                    callbacks: {
                        label: ctx => `${ctx.raw.toLocaleString('ru-RU')} кг`, 
                    }
                }
            }
        }
    };


    const chartContainer = n.container.createEl('div', { attr: { style: "height: 400px; position: relative;" }});
    window.renderChart(chartData, chartContainer);
}


}

