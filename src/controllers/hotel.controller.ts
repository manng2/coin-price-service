import { Response, Request } from "express";
import { supplierService } from "../services";
import { convertToHotelModel } from "../utils/convert-to-hotel-model.util";

export async function getHotelData(req: Request, res: Response) {
    try {
        const suppliers = await supplierService.getAllSuppliers();
        const hotelData = (await supplierService.getHotelDataBySuppliers(suppliers)).map(convertToHotelModel);

        res.status(200).send(hotelData);
    } catch(err) {
        res.status(500).json({ message: (err as Error).message })
    }
}