export interface AcmeHotelModel {
    Id: string;
    DestinationId: number;
    Name: string;
    Latitude: number;
    Longitude: number;
    Address: string;
    City: string;
    Country: string;
    PostalCode: string;
    Description: string;
    Facilities: ReadonlyArray<string>;
}