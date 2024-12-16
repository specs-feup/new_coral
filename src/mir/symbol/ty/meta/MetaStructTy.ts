import { RecordJp } from "@specs-feup/clava/api/Joinpoints.js";
import Ty from "@specs-feup/coral/mir/symbol/Ty";
import MetaTy from "@specs-feup/coral/mir/symbol/ty/meta/MetaTy";
import StructTy from "@specs-feup/coral/mir/symbol/ty/StructTy";
import MetaRegionVariable from "@specs-feup/coral/regionck/MetaRegionVariable";
import RegionVariable from "@specs-feup/coral/regionck/RegionVariable";
import DefMap from "@specs-feup/coral/symbol/DefMap";

export default class MetaStructTy implements MetaTy {
    #jp: RecordJp;
    // Instead of having a def, we use the lazy mapper to avoid infinite loops
    #structDefs: DefMap;
    // Maps a lifetime name to the MetaRegionVariable in the outer StructDef.
    #regionVarMap: Map<string, MetaRegionVariable>;
    #isConst: boolean;

    constructor(
        $jp: RecordJp,
        structDefs: DefMap,
        regionVarMap: Map<string, MetaRegionVariable>,
        isConst: boolean,
    ) {
        this.#jp = $jp;
        this.#regionVarMap = regionVarMap;
        this.#structDefs = structDefs;
        this.#isConst = isConst;
    }

    get semantics(): Ty.Semantics {
        return this.#structDefs.get(this.#jp).semantics;
    }

    get isConst(): boolean {
        return this.#isConst;
    }

    get jp(): RecordJp {
        return this.#jp;
    }

    toTy(regionVarMap: Map<string, RegionVariable>): Ty {
        const innerRegionVarMap = new Map<string, RegionVariable>();
        for (const [name, metaRegionVar] of this.#regionVarMap.entries()) {
            const regionVar = regionVarMap.get(metaRegionVar.name);
            if (regionVar === undefined) {
                throw new Error(`Region variable ${metaRegionVar.name} not found in map`);
            }
            innerRegionVarMap.set(name, regionVar);
        }

        return new StructTy(
            this.#structDefs.get(this.#jp),
            innerRegionVarMap,
            this.isConst,
        );
    }
}