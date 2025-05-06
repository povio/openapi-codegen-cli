import Handlebars from "handlebars";

enum ImportsHelpers {
  ImportNames = "importNames",
}

export function registerImportsHbsHelpers() {
  registerBindingsHelper();
}

function registerBindingsHelper() {
  Handlebars.registerHelper(ImportsHelpers.ImportNames, (bindings: string[], defaultImport?: string) =>
    [...(defaultImport ? [defaultImport] : []), ...(bindings ? [`{ ${bindings.join(", ")} }`] : [])].join(", "),
  );
}
