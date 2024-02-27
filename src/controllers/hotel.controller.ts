import { Response, Request } from "express";
import { supplierService } from "../services";

export async function getHotelData(req: Request, res: Response) {
    const suppliers = await supplierService.getAllSuppliers();
    const hotelData = await supplierService.getHotelDataBySuppliers(suppliers);

    res.status(200).send(hotelData);
}