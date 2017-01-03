const {dialog} = require('electron').remote;
import { readFileSync, writeFileSync } from 'fs';
// import { loadFile, saveFile } from './filesystem';
import { setEditorContent, setEditorPath } from '../actions/editor';
import { store } from '../index';

//HACK: Bypassing react-redux to directly dispatch to store.
export function openFilePicker() {
  dialog.showOpenDialog({ properties: ['openFile', 'createDirectory', 'showHiddenFiles'] }, function (fileNames) {
    if (fileNames && fileNames.length) {
      let fileContents = readFileSync(fileNames[0], 'utf8');
      store.dispatch(setEditorContent(fileContents)); //Save content to redux
      store.dispatch(setEditorPath(fileNames[0])); //Save content to redux
      //TODO: Save current path to redux;
    }
  })
}

export function newFile() {
  //TODO: Check to see if the current open file has unsaved changes
  store.dispatch(setEditorContent(''));
}

export function saveFile(overwrite = false) {
  let currentPath = store.getState().editor.editorPath;
  let editorContent = store.getState().editor.editorContent;
  console.log("Current Path is: ", currentPath);
  if (overwrite && currentPath) {
    writeFileSync(currentPath, editorContent);
    console.log("Saved to ", currentPath);
  } else {
    let saveAsPath = dialog.showSaveDialog();
    if (saveAsPath) {
      writeFileSync(saveAsPath, editorContent);
      console.log("Saved to ", saveAsPath);
      store.dispatch(setEditorPath(saveAsPath))
    }
    //Open SaveAs dialog
    //If SaveAs was saved, not cancelled, save the file to disk
  }
  //TODO: Check to see if the current open file has unsaved changes
}