import { mkdir, readFile, writeFile, copyFile } from "node:fs/promises";
import { stripTypeScriptTypes } from "node:module";
await mkdir("dist",{recursive:true});
for (const module of ["index","messages","workflow"]) {
  const source=await readFile(`frontend/${module}.ts`,"utf8");
  await writeFile(`dist/${module}.js`,stripTypeScriptTypes(source));
}
await copyFile("frontend/style.css","dist/style.css");
for(const route of ["","alerts","disasters","map","shelters","resources","emergency","workspace"]) {
  await mkdir(`dist/${route}`,{recursive:true});
  await copyFile("frontend/index.html",`dist/${route}/index.html`);
}
await copyFile("frontend/sw.js","dist/sw.js");
