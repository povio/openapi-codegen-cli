import Handlebars from "handlebars";

enum CommonHelpers {
  ImportNames = "importNames",
}

export function registerImportsHbsHelpers() {
  registerBindingsHelper();
}

function registerBindingsHelper() {
  Handlebars.registerHelper(CommonHelpers.ImportNames, (bindings: string[], defaultImport?: string) =>
    [...(defaultImport ? [defaultImport] : []), ...(bindings ? [`{ ${bindings.join(", ")} }`] : [])].join(", "),
  );
}
