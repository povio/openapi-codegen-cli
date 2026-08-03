import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { GenerateFileData, GenerateFileFormatter } from "@/generators/types/generate";
import { GenerateOptions } from "@/generators/types/options";

function readFileSync(filePath: string) {
  const moduleDir = path.dirname(fileURLToPath(import.meta.url));
  const candidates = [
    path.resolve(process.cwd(), filePath),
    path.resolve(moduleDir, "../../../", filePath),
    path.resolve(moduleDir, "../", filePath),
  ];

  for (const candidatePath of candidates) {
    if (fs.existsSync(candidatePath)) {
      return fs.readFileSync(candidatePath, "utf-8");
    }
  }

  throw new Error(`Cannot read file: ${filePath}`);
}

export function readAssetSync(fileName: string) {
  const assetPath = `src/assets/${fileName}`;
  return readFileSync(assetPath);
}

export function getOutputFileName({ output, fileName }: { output: string; fileName: string }) {
  return `${output}/${fileName}`;
}

type WriteGenerateFileDataOptions = {
  formatGeneratedFile?: GenerateFileFormatter;
  skipExistingCheck?: boolean;
};

async function writeFileIfChanged(file: string, data: string, skipExistingCheck = false) {
  if (skipExistingCheck) {
    await fs.promises.writeFile(file, data, "utf-8");
    return;
  }

  try {
    const existingData = await fs.promises.readFile(file, "utf-8");
    if (existingData === data) {
      return;
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }

  await fs.promises.writeFile(file, data, "utf-8");
}

async function writeFile({ fileName, content }: GenerateFileData, options?: WriteGenerateFileDataOptions) {
  const formattedContent = options?.formatGeneratedFile
    ? await options.formatGeneratedFile({ fileName, content })
    : content;

  await fs.promises.mkdir(path.dirname(fileName), { recursive: true });
  await writeFileIfChanged(fileName, formattedContent, options?.skipExistingCheck);
}

export async function writeGenerateFileData(filesData: GenerateFileData[], options?: WriteGenerateFileDataOptions) {
  if (!options?.formatGeneratedFile) {
    const directories = new Set(filesData.map(({ fileName }) => path.dirname(fileName)));
    for (const directory of directories) {
      fs.mkdirSync(directory, { recursive: true });
    }
    await Promise.all(
      filesData.map(({ fileName, content }) => writeFileIfChanged(fileName, content, options?.skipExistingCheck)),
    );
    return;
  }

  for (const file of filesData) {
    await writeFile(file, options);
  }
}

export function removeStaleGeneratedFiles({
  output,
  filesData,
  options,
}: {
  output: string;
  filesData: GenerateFileData[];
  options: Pick<GenerateOptions, "configs">;
}) {
  if (!fs.existsSync(output)) {
    return;
  }

  const expectedFiles = new Set(filesData.map((file) => path.resolve(file.fileName)));
  const generatedSuffixes = new Set(Object.values(options.configs).map((config) => config.outputFileNameSuffix));
  const staleFiles: string[] = [];

  const visit = (dirPath: string) => {
    for (const dirent of fs.readdirSync(dirPath, { withFileTypes: true })) {
      const entryPath = path.join(dirPath, dirent.name);
      if (dirent.isDirectory()) {
        visit(entryPath);
        continue;
      }

      if (isGeneratedFile(entryPath, output, generatedSuffixes) && !expectedFiles.has(path.resolve(entryPath))) {
        staleFiles.push(entryPath);
      }
    }
  };

  visit(output);

  staleFiles.forEach((filePath) => fs.rmSync(filePath, { force: true }));
  removeEmptyDirectories(output);
}

function isGeneratedFile(filePath: string, output: string, generatedSuffixes: Set<string>) {
  const relativePath = path.relative(output, filePath);
  if (relativePath === ".openapi-codegen-cache.json") {
    return true;
  }

  const normalizedRelativePath = relativePath.split(path.sep).join("/");
  if (["app-rest-client.ts", "queryModules.ts", "acl/app.ability.ts"].includes(normalizedRelativePath)) {
    return true;
  }

  const parsedPath = path.parse(filePath);
  if (parsedPath.ext !== ".ts") {
    return false;
  }

  const segments = relativePath.split(path.sep).filter(Boolean);
  if (segments.length < 2) {
    return false;
  }

  const moduleName = segments[0];
  const fileName = segments[segments.length - 1];
  if (!fileName.startsWith(`${moduleName}.`)) {
    return false;
  }

  const suffix = fileName.slice(moduleName.length + 1).replace(/\.tsx?$/, "");
  return generatedSuffixes.has(suffix);
}

function removeEmptyDirectories(root: string) {
  if (!fs.existsSync(root)) {
    return;
  }

  const removeIfEmpty = (dirPath: string) => {
    for (const dirent of fs.readdirSync(dirPath, { withFileTypes: true })) {
      if (dirent.isDirectory()) {
        removeIfEmpty(path.join(dirPath, dirent.name));
      }
    }

    if (dirPath !== root && fs.readdirSync(dirPath).length === 0) {
      fs.rmdirSync(dirPath);
    }
  };

  removeIfEmpty(root);
}
