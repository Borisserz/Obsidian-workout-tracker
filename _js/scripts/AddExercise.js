let obsidian = null;

module.exports = async function listFiles(params) {

    console.log("Script: Create exercise.")

    obsidian = params.obsidian;
    const templater = app.plugins.plugins["templater-obsidian"].templater;
    const dv = app.plugins.plugins['dataview'].api;
    const cache = this.app.metadataCache;
    let allFiles = this.app.vault.getMarkdownFiles();

    const activeFile = app.workspace.getActiveFile();
    let metadata = cache.getFileCache(activeFile);
    const exerciseIds = metadata.frontmatter['exercises'] || []; 
    const workout_id = metadata.frontmatter['id'];
    const exercises = [];
    const performedEx = filterFiles((fm, tags)=>{
        return (tags.includes('#exercise') || tags.includes('#start')) && fm['workout_id'] == workout_id;
    }, allFiles);
    let performedExerciseCount = performedEx.length;

    if(performedExerciseCount == 0)
    {
        const startEx = filterFiles((fm, tags) => {return tags.includes('#start') && fm['workout_id'] == null}, allFiles);
        if (startEx.length > 0) {
            exercises.push(startEx[0]);
        }
    }
    else 
    {
      
        const workoutEx = filterFiles((fm, tags) =>{
            return tags.includes('#exercise') && fm['workout_id'] == null && exerciseIds.map(String).includes(String(fm['id']));
        }, allFiles);
        const remainingEx = filterFiles((fm, tags) =>
        {
            const isPerformed = performedEx.some(performedFile => {
                const performedMetadata = app.metadataCache.getFileCache(performedFile)?.frontmatter;
                return performedMetadata && String(performedMetadata.id) === String(fm.id);
            });
            return !isPerformed;

        }, workoutEx);

        exercises.push.apply(exercises, remainingEx);
    }

    const sortedExercises = exercises.sort((a, b) => {
      const nameA = a.basename.toLowerCase();
      const nameB = b.basename.toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });

    if(performedExerciseCount > 0)
    {
        const custom = filterFiles(function(frontmatter, tags){ return tags.includes('#custom') && frontmatter['workout_id'] == null;}, allFiles);
        if (custom.length > 0) {
            sortedExercises.push(custom[0]);
        }
        sortedExercises.push({basename: 'Show all exercies', path: 'SHOW_ALL'});
    }

    
    let notesDisplay = await params.quickAddApi.suggester(
        (file) => file.basename,
        sortedExercises
    );

    if(!notesDisplay) {
        params.variables = { notePath: "" };
        return;
    }

    if(notesDisplay.path === 'SHOW_ALL')
    {
        let allExercises = filterFiles((frontmatter, tags)=>{return tags.includes("#exercise") && frontmatter['workout_id'] == null}, allFiles);

        notesDisplay = await params.quickAddApi.suggester(
        (file) => file.basename,
        allExercises);
    }
    
    if(!notesDisplay) {
        params.variables = { notePath: "" };
        return;
    }

    metadata = app.metadataCache.getFileCache(activeFile);
    let newId = metadata.frontmatter['id']; 
    console.log('Workout ID found: ' + newId);

    if(!newId)
    {
        console.log("ID not found in training file. Using temporary ID.");
        newId = generateGuid();
    }

    let templateFile = app.vault.getAbstractFileByPath(notesDisplay.path);
    let tmp = app.vault.getAbstractFileByPath(activeFile.path).parent;
    let targetFolder = app.vault.getAbstractFileByPath(tmp.path + "/Log");

    let fileName = (targetFolder.children.length+1).toString()
    let newNote = await templater.create_new_note_from_template(templateFile, targetFolder, fileName, false);

 
    await app.fileManager.processFrontMatter(newNote, (frontmatter) => {
        frontmatter['workout_id'] = newId;
    });


    params.variables = { notePath: newNote.path };
}


function filterFiles(filterFunction, files)
{
    const cache = app.metadataCache;
    const result = []
    for(let f of files)
    {
        const metadata = cache.getFileCache(f);
        if(!metadata) continue; 
        const tags = obsidian.getAllTags(metadata);
        if(filterFunction(metadata.frontmatter || {}, tags)) 
            result.push(f);
    }
    return result;
}


function generateGuid() {
  let result, i, j;
  result = '';
  for(j=0; j<12; j++) {
    i = Math.floor(Math.random()*16).toString(16).toUpperCase();
    result = result + i;
  }
  return result;
}