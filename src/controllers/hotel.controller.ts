import { Response, Request } from "express";
import { supplierService } from "../services";
import { convertToHotelModel } from "../utils";

export async function getHotelData(req: Request, res: Response) {
    const { destination, hotels } = req.query;

    try {
        const suppliers = await supplierService.getAllSuppliers();
        const hotelData = (await supplierService.getHotelDataBySuppliers(suppliers, {
            destination: Number(destination),
            hotels: hotels ? hotels.toString().split(",").map(it => it.trim()) : []
        })).map(convertToHotelModel);

        res.status(200).send(hotelData);
    } catch(err) {
        console.trace(err);
        res.status(500).json({ message: (err as Error).message })
    }
}
