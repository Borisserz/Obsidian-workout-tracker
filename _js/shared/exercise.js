class exercise {
	renderDescription(n) {
		const data = n.dv.current();
		let metadata = app.metadataCache.getFileCache(n.dv.current().file);

		let workout_id = metadata.frontmatter['workout_id'];
		let sets = metadata.frontmatter['sets'];
		let reps = metadata.frontmatter['reps'];
		let weight = metadata.frontmatter['weight'];
		let effort = metadata.frontmatter['effort'];
		let note = metadata.frontmatter['note'];

		if ((sets != null || reps != null) && workout_id != null) {
			n.dv.el('b', 'Volume: ');
			n.dv.span(`${sets ?? '-'} sets × ${reps ?? '-'} reps`);
			n.dv.el("br", "");
		}

		if ((weight != null || effort != null) && workout_id != null) {
			n.dv.header(2, "Exercise log:");

			if (weight != null) {
				n.dv.el('b', 'Weight: ');
				n.dv.span(weight.toString() + '\t');
				n.dv.el("br", "");
			}

			if (effort != null) {
				n.dv.el('b', 'Effort: ');
				n.dv.span(effort.toString());
				n.dv.el("br", "");
			}

			if (note != null) {
				n.dv.el('b', 'Note ✏️: ');
				n.dv.span(note.toString());
			}
			n.dv.el("br", "");
		}

		let instructions = `None`;
		if (instructions != 'None') {
			n.dv.header(2, 'Instructions');
			n.dv.paragraph(instructions);
		}

		let video_url = metadata.frontmatter['video_url'];
		if (video_url != null) {
			n.dv.el('p', `<iframe title="${metadata.frontmatter['exercise']}" src="${video_url}" allowfullscreen style="aspect-ratio: 1.77 / 1; width: 100%; height: 100%;"></iframe>`);
		}
	}

	renderEffortWeightChart(n) {
		const data = n.dv.current();
		let metadata = app.metadataCache.getFileCache(n.dv.current().file);
		let exercise = this.fixExerciseName(metadata.frontmatter['exercise']);
		let exercises = n.dv.pages('#exercise');
		let performedExercises = [];

		n.dv.header(2, "Past exercises");

		for (let e of exercises) {
			let eMeta = app.metadataCache.getFileCache(e.file);
			let exerciseId = eMeta.frontmatter['workout_id'];
			let eExercise = this.fixExerciseName(e['exercise']);

			if (exerciseId != null && exercise == eExercise)
				performedExercises.push(e);
		}

		performedExercises.sort((a, b) => new Date(a['date']) - new Date(b['date']));

		const datum = performedExercises.map(e => moment(new Date(e['date'])).format('YYYY-MM-DD'));
		const weights = performedExercises.map(e => e['weight']);
		const efforts = performedExercises.map(e => e['effort']);

		const hasWeights = weights.length > 0 && !weights.every(v => v == null);

		let datasets = {
			labels: datum,
			datasets: [{
				label: 'Effort',
				data: efforts,
				borderColor: ['rgb(232, 15, 136)'],
				borderWidth: 3,
				yAxisID: 'y1'
			}]
		};

		if (hasWeights) {
			datasets.datasets.push({
				label: 'Weight',
				data: weights,
				borderColor: ['rgb(76, 0, 51)'],
				borderWidth: 3,
				yAxisID: 'y'
			});
		}

		let scales = {
			y: {
				title: { display: true, text: 'Weight' },
				grace: 1,
				type: 'linear',
				display: hasWeights,
				position: 'left'
			},
			y1: {
				title: { display: true, text: 'Effort' },
				min: 0,
				max: 6,
				ticks: {
					callback: v => (v > 0 && v < 6 ? v : '')
				},
				type: 'linear',
				display: true,
				position: 'right',
				grid: { drawOnChartArea: false }
			}
		};

		const chartData = {
			type: 'line',
			data: datasets,
			options: {
				responsive: true,
				interaction: {
					mode: 'index',
					intersect: false
				},
				stacked: false,
				layout: {
					padding: -5
				},
				scales: scales
			}
		};

		n.window.renderChart(chartData, n.container);

		function findPrevExercise(n, current) {
			return n.dv.pages('#exercise')
				.where(e => new Date(e['date']) < new Date(current['date']))
				.sort(e => e['date'], 'desc')
				.first();
		}

		let lastExercises = [];
		for (const e of performedExercises.slice(-5)) {
			let prev = findPrevExercise(n, e);
			let prevTimeStamp = moment(new Date(prev?.['date']));
			let timeStamp = moment(new Date(e['date']));
			let diff_sec = timeStamp.diff(prevTimeStamp, "seconds");
			let timeDiff = `${Math.floor(diff_sec / 60)}m ${diff_sec % 60}s`;

			let row = [
				`[[${e.file.path}|${moment(new Date(e['date'])).format('YYYY-MM-DD')}]]`,
				timeDiff
			];

			if (hasWeights) row.push(e['weight'] + ' kg');
			row.push(e['sets']);
			row.push(e['reps']);
			row.push(e['effort']);
			row.push(e['note']);

			lastExercises.push(row);
		}

		let columns = ["Exercise", "⏱"];
		if (hasWeights) columns.push("🏋🏼");
		columns.push("Sets", "Reps", "😥", "🗒");

		n.dv.table(columns, lastExercises);
	}

	fixExerciseName(e) {
		return e.replace(' - ', ' ').toLowerCase();
	}
}
