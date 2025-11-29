import type { MarketItemType } from "@/features/market/marketTypes";
import axios from "@/lib/axios";
import { isAxiosError } from "axios";

async function addMarketItem(formData: FormData) {
    try {
        const { data } = await axios.post("/market/", formData);
        const market_item: string = data["market_item_uuid"];
        return { ok: true, market_item: market_item };
    } catch (error) {
        console.error(error);
        if (isAxiosError(error) && error.response) {
            return { ok: false, errors: error.response.data.error };
        }
        return { ok: false, errors: { root: ["some error occurred"] } };
    }
}

async function updateMarketItem(market_item_uuid: string, formData: FormData) {
    try {
        const { data } = await axios.put(
            `/market/${market_item_uuid}`,
            formData
        );
        const market_item: string = data["market_item_uuid"];
        return { ok: true, market_item: market_item };
    } catch (error) {
        console.error(error);

        return { ok: false, errors: { root: ["some error occurred"] } };
    }
}

async function patchMarketItemStatus(
    market_item_uuid: string,
    status: "active" | "sold"
) {
    try {
        await axios.patch(`/market/${market_item_uuid}/status`, {
            status: status,
        });
        return { ok: true };
    } catch (error) {
        console.error(error);

        return { ok: false, errors: { root: ["some error occurred"] } };
    }
}

async function deleteMarketItem(market_item_uuid: string) {
    try {
        await axios.delete(`/market/${market_item_uuid}`);
        return { ok: true };
    } catch (error) {
        console.error(error);

        return { ok: false, errors: { root: ["some error occurred"] } };
    }
}

async function getListing(
    username: string,
    search: string,
    plant_type_id: number | undefined,
    page: number,
    sort: string,
    status: string
) {
    try {
        const { data } = await axios.get(
            `/users/${username}/listing?page=${page}&search=${search}&plant_type_id=${plant_type_id}&sort=${sort}&status=${status}`
        );

        const listing: MarketItemType[] = data["listing"];
        const meta_data = data["meta_data"];

        return { ok: true, board: listing, meta_data };
    } catch (error) {
        console.error(error);
        return { ok: false, listing: null };
    }
}

async function getMarket(
    search: string,
    plant_type_id: number | undefined,
    page: number,
    sort: string,
    status: string
) {
    try {
        const { data } = await axios.get(
            `/market/?page=${page}&search=${search}&plant_type_id=${plant_type_id}&sort=${sort}&status=${status}`
        );

        const market: MarketItemType[] = data["market"];
        const meta_data = data["meta_data"];

        return { ok: true, market: market, meta_data };
    } catch (error) {
        console.error(error);
        return { ok: false, market: null, meta_data: null };
    }
}

export default {
    addMarketItem,
    updateMarketItem,
    patchMarketItemStatus,
    deleteMarketItem,
    getListing,
    getMarket,
};
