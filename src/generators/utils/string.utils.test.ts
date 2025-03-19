import { describe, expect, test } from "vitest";
import {
  getAdjacentStringCombinations,
  getLongestMostCommon,
  getMostCommonAdjacentCombinationSplit,
  nonWordCharactersToCamel,
  removeWord,
  splitByUppercase,
} from "./string.utils";

describe("Utils: string", () => {
  test("nonWordCharactersToCamel", () => {
    expect(nonWordCharactersToCamel("test word_Another -word-")).toEqual("testWordAnotherWord");
  });

  test("getLongestMostCommon", () => {
    expect(
      getLongestMostCommon([
        "find",
        "findPets",
        "findPetsBy",
        "findPetsByStatus",
        "Pets",
        "PetsBy",
        "PetsByStatus",
        "By",
        "ByStatus",
        "Status",
        "Pets",
      ]),
    ).toEqual("Pets");
    expect(
      getLongestMostCommon([
        "find",
        "findPets",
        "findPetsBy",
        "findPetsByStatus",
        "Pets",
        "PetsBy",
        "PetsByStatus",
        "By",
        "ByStatus",
        "Status",
        "Pets",
        "PetsByStatus",
      ]),
    ).toEqual("PetsByStatus");
  });

  test("splitByUppercase", () => {
    expect(splitByUppercase("PriceMapRegionDto")).toEqual(["Price", "Map", "Region", "Dto"]);
    expect(splitByUppercase("priceMapRegionDto")).toEqual(["price", "Map", "Region", "Dto"]);
    expect(splitByUppercase("price")).toEqual(["price"]);
  });

  test("getMostCommonAdjacentCombinationSplit", () => {
    expect(getMostCommonAdjacentCombinationSplit(["PriceMapRegionDto", "RegionListItemDto"])).toEqual("Region");
    expect(getMostCommonAdjacentCombinationSplit(["PriceMapRegionDto", "MapRegionListItemDto"])).toEqual("MapRegion");
    expect(
      getMostCommonAdjacentCombinationSplit([
        "CreateTerminalRequestDTO",
        "TerminalResponseDTO",
        "UpdateTerminalRequestDTO",
      ]),
    ).toEqual("Terminal");
    expect(getMostCommonAdjacentCombinationSplit(["findPetsByStatus", "Pet", "Status"])).toEqual("Status");
  });

  test("getAdjacentStringCombinations", () => {
    expect(getAdjacentStringCombinations(["find", "Pets", "By", "Status"])).toEqual([
      "find",
      "findPets",
      "findPetsByStatus",
      "Pets",
      "PetsByStatus",
      "Status",
    ]);
  });

  describe("removeWord", () => {
    test("plural with 's'", () => {
      expect(removeWord("getTaskPaginate", "Task")).toBe("getPaginate");
      expect(removeWord("getTasksPaginate", "Task")).toBe("getPaginate");

      expect(removeWord("getTaskPaginate", "Tasks")).toBe("getPaginate");
      expect(removeWord("getTasksPaginate", "Tasks")).toBe("getPaginate");

      expect(removeWord("taskPaginate", "Task")).toBe("Paginate");
      expect(removeWord("tasksPaginate", "Task")).toBe("Paginate");

      expect(removeWord("taskPaginate", "Tasks")).toBe("Paginate");
      expect(removeWord("tasksPaginate", "Tasks")).toBe("Paginate");
    });

    test("plural with 'es'", () => {
      expect(removeWord("getClassPaginate", "Class")).toBe("getPaginate");
      expect(removeWord("getClassesPaginate", "Class")).toBe("getPaginate");

      expect(removeWord("getClassPaginate", "Classes")).toBe("getPaginate");
      expect(removeWord("getClassesPaginate", "Classes")).toBe("getPaginate");

      expect(removeWord("classPaginate", "Class")).toBe("Paginate");
      expect(removeWord("classesPaginate", "Class")).toBe("Paginate");

      expect(removeWord("classPaginate", "Classes")).toBe("Paginate");
      expect(removeWord("classesPaginate", "Classes")).toBe("Paginate");
    });

    test("other", () => {
      expect(removeWord("useCreateServiceType", "ServiceTypes")).toBe("useCreate");
    });
  });
});
