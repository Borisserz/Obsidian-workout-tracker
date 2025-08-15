module.exports = async function listFiles(params) {
    console.log("Script: Create new workout.")

    const obsidian = params.obsidian;
    const templater = app.plugins.plugins["templater-obsidian"].templater;
    const activeFile = app.workspace.getActiveFile();
    const cache = this.app.metadataCache;
    const files = this.app.vault.getMarkdownFiles();
    let workouts = [];

    for(const file of files)
    {
        const file_cache = cache.getFileCache(file);
        const tags = obsidian.getAllTags(file_cache);
       
        let id;
        let metadata = app.metadataCache.getFileCache(file);
        if(metadata.frontmatter == null) 
            id = null;
        else
            id = metadata.frontmatter['id'];

        if (tags.includes("#workout") && id == null) {
            workouts.push(file);
        }
    }

    function sortworkout(a, b)
    {
        return a.basename.localeCompare(b.basename, undefined, {numeric: true, sensitivity: 'base'})       
    }

    hemmagym = workouts.filter(w => w.basename.includes('Hemmagym')).sort(sortworkout);
    gym = workouts.filter(w => !w.basename.includes('Hemmagym')).sort(sortworkout);

    workouts = [].concat(gym);
    workouts = workouts.concat(hemmagym);

    const notesDisplay = await params.quickAddApi.suggester(
        (file) => file.basename,
        workouts
    );
    console.log("Creating note from template: " + notesDisplay.path);
    let templateFile = app.vault.getAbstractFileByPath(notesDisplay.path);
    let tmp = app.vault.getAbstractFileByPath(activeFile.path).parent;
    let now = moment(new Date());
    let nameWoExt = templateFile.name.replace('.md', '')
    let targetPath = 'Workouts/' + now.format("YYYY-MM-DD") + ' - ' + nameWoExt;
    var folderExists = await app.vault.exists(targetPath);
    if(!folderExists)
    {
        await app.vault.createFolder(targetPath);
        await app.vault.createFolder(targetPath + '/Log');
    }
    let targetFolder = app.vault.getAbstractFileByPath(targetPath);
    let fileName = nameWoExt + ".md";
    let newNote;
    if(! await app.vault.exists(targetPath + '/' + fileName))
        newNote = await templater.create_new_note_from_template(templateFile, targetFolder, fileName, false);
    else
    {
        params.variables = { notePath: "" };
        return;
    }
    let content = await app.vault.read(newNote);
    const regex = /---\n+/m;
    const subst = '---\nid: ' + generateGuid() + '\n';
    content = content.replace(regex, subst);
    console.log(content, );
    await app.vault.modify(newNote, content);    
    params.variables = { notePath: newNote.path };
}

function generateGuid() {
  let result, i, j;
  result = '';
  for(j=0; j<6; j++) {
    if( j == 4 || j == 8 || j == 12 || j == 16)
      result = result + '-';
    i = Math.floor(Math.random()*16).toString(16).toUpperCase();
    result = result + i;
  }
  return result;
}