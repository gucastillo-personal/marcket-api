import { Asset } from "src/domain/entities/asset.entity";
import { AssetDTO } from "../dto/asset.dto";

const mapBeToDTO = (assetBe: Asset): AssetDTO => {
    const assetDTO = new AssetDTO(
        assetBe.name,
        assetBe.value,
        assetBe.performance,
        assetBe.size,
    );
    return assetDTO;
}

export default mapBeToDTO;