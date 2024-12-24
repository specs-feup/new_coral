import CoralFunctionWiseTransformation, {
    CoralFunctionWiseTransformationApplier,
} from "@specs-feup/coral/graph/CoralFunctionWiseTransformation";
import Region from "@specs-feup/coral/mir/symbol/Region";
import InferLifetimeBounds from "@specs-feup/coral/pipeline/analyze/regionck/InferLifetimeBounds";

export default class SignatureAnnotator extends CoralFunctionWiseTransformation {
    fnApplier = SignatureAnnotatorApplier;
}

class SignatureAnnotatorApplier extends CoralFunctionWiseTransformationApplier {
    apply(): void {
        const fnSymbol = this.fn.getSymbol(this.fn.jp);

        const regionVars = new Map<string, Region>();
        regionVars.set("%static", this.fn.staticRegion);
        for (const metaRegion of fnSymbol.metaRegions) {
            if (!regionVars.has(metaRegion.name)) {
                const region = this.fn.generateRegion(Region.Kind.UNIVERSAL);
                // TODO `${newPragmaLhs}.${metaRegionVar.name}` for codegen
                regionVars.set(metaRegion.name, region);
            }
        }

        // Inference is only done if there are explicit no pragmas
        if (fnSymbol.hasLifetimePragmas) {
            this.fn.inferRegionBoundsState =
                InferLifetimeBounds.FunctionState.NOT_VISITED;
        }

        this.fn.returnTy = fnSymbol.return.toTy(regionVars);
        for (const param of fnSymbol.params) {
            this.fn.registerSymbol(param.jp, param.ty.toTy(regionVars));
        }
    }
}
