import { describe, expect, test } from "vitest";
import {
  getAdjacentStringCombinations,
  getLongestMostCommon,
  getMostCommonAdjacentCombinationSplit,
  nonWordCharactersToCamel,
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
});
