const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "../../");

// Define the root folder to scan and the destination folder to move files to
const sourceFolder = projectRoot + "/.dist/";
const destFolder = projectRoot + "/dist/live-plugin/";

/**
 * Take an arbitrary file path,
 * and flatten it, i.e remove the nested folders:
 * path /bob/jo/hi.js becomes bob_jo_hi.js
 */
function flattenFilePath(pathSegment) {
  let flatSegment = pathSegment.replace(sourceFolder, "").replaceAll("/", "_");
  if (flatSegment.startsWith("_")) {
    flatSegment = flatSegment.substring(1);
  }
  return flatSegment;
}
/**
 * Take a file file path in the source folder ( with nested folders )
 * and return a file path in the destination folder ( with no nested folders )
 */
function remapFilePath(filePath) {
  let destFilePath = flattenFilePath(filePath);
  return path.join(destFolder, destFilePath);
}

/**
 * Take a file path in the source folder ( with nested folders )
 * and an import path ( relative to the file path )
 * and return the import path relative to the destination folder ( with no nested folders )
 */
function remapImportPath(filePath, importFile) {
  const absImport = path.resolve(path.dirname(filePath), importFile);
  const modulePath = flattenFilePath(absImport);

  return "./" + modulePath;
}

/**
 * Remap all the require statements in a file
 * Remove the weird exports.__esModule = true; line
 * Add the autowatch flag at the top of the file
 */
function patchFile(srcFilePath, patchedfilePath) {
  // Rewrite the require/import statements in the file
  const fileContents = fs.readFileSync(srcFilePath, "utf8");

  let content = fileContents;

  // update the content of each require
  content = content.replace(/(require)\(['"](.*)['"]\)/g, (match, p1, p2) => {
    return `require('${remapImportPath(srcFilePath, p2)}')`;
  });

  // Remove weird exports.__esModule = true; line
  content = content.replace(
    'Object.defineProperty(exports, "__esModule", { value: true });',
    ""
  );

  // Append the autowatch flag at the top of the file
  content = "autowatch = 1;\n".concat(content);
  fs.writeFileSync(patchedfilePath, content, "utf8");
}

// Define a function to recursively scan the folder
function scanFolder(folder) {
  fs.readdirSync(folder).forEach((file) => {
    const srcFilePath = path.join(folder, file);
    const stat = fs.statSync(srcFilePath);
    if (stat.isDirectory()) {
      // Recursively scan the subfolder
      scanFolder(srcFilePath);
    } else if (path.extname(srcFilePath) === ".js") {
      // Move the file to the destination folder
      const destFilePath = remapFilePath(srcFilePath);
      patchFile(srcFilePath, destFilePath);
    }
  });
}

function postProcessDist() {
  fs.mkdirSync(destFolder, { recursive: true });
  // Call the function to start scanning the root folder
  scanFolder(sourceFolder);
}

postProcessDist();
