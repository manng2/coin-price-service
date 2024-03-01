## Accommodation Data Fusion 🤝🤝

A simple web server procuring and consolidating hotel data from various suppliers.

### Problem 😵

There is a source data and it returns many different models with the same value. How can we deal with it? 🤔

### Approach 🚀

#### Filtering 👓

If we have `hotels` or `destination` parameters, we need to filter the data before proceeding to subsequent processes to **reduce later effort** 💪.

#### Cleaning 🧹

Due to the suppliers offering data with different models. For example with `id` attribute, we might have many attribute names have the same value: `Id`, `hotel_id`, `hotelId`,..

I created a dictionary 📘 to map these random attribute names to a standardized one.

```
export const HOTEL_DATA_KEY_DICTIONARY: Record<keyof HotelDataBySupplierModel, string[]> = {
  id: ['Id', 'id', 'hotel_id'],
  destinationId: ['DestinationId', 'destination', 'destination_id'],
  name: ['Name', 'name', 'hotel_name'],
  lat: ['Latitude', 'lat'],
  lng: ['Longitude', 'lng'],
  address: ['Address', 'address', 'location.address'],
  city: ['City'],
  country: ['Country', 'location.country'],
  description: ['Description', 'info', 'details'],
  amenities: ['Facilities', 'amenities'],
  images: ['images'],
  bookingConditions: ['booking_conditions'],
};
```

To facilitate **quicker look up** of the standard attribute, we need to convert ⚔️ above dictionary 📘 into another data structure. Here is an example of how it looks after conversion.

```
const map = {
    Id: 'id',
    id: 'id',
    hotel_id: 'id',
    destination: 'destinationId',
    destination_id: 'destinationId',
    ...
}
```

What if we have nested object like this? 🤔

```
const obj = {
    location: {
        address: 'ABC'
    }
}
```

➡️ To convert nested object attribute name to standard attributes, we accommodate the attribute name format in the dictionary 📘 as `location.address`.


#### Merging ➕

After standardizing attribute names, it's time to merge the data from multiple suppliers 🎉. Since each supplier may provide data for the same hotels, we merge their values based on a common identifier, typically the `id`.

- id: no merging
- destinationId: no merging
- lat: no merging, choosing `truthy` value
- lng: no merging, choosing `truthy` value
- city; no merging, choosing the latest data
- country: no merging, choosing the latest data
- description: no merging, choosing the latest data
- name: choosing the longer name
- address: choosing the longer address
- amenities: we utilize a `dictionary 📘` to categorize where the amenities belong (`general` or `room`). We also have another `dictionary 📘` to standardize amenity names, as the same amenity can have different values
- images: selecting all images and merging them, we utilize a dictionary 📘 to standardize image type names, as the same image type can have different values
- bookingConditions: remove redundant booking conditions from each other and combine them

### Tech stacks

- Node.js (Express.js)
- TypeScript
- Jest
- Redis
- GitHub Actions
- AWS EC2

### Installation

**Prerequisites:**
- Node.js version 18
- Pnpm is installed globally
- Redis server is running locally with port **6379**

**Steps:**
1. Cloning the source code
2. Run `pnpm i`
3. Run `pnpm run dev` to serve the web server locally. The server will listen on port **3000**

### API Request

There is 1 API to retrieve hotel data: `GET /hotels`. This API accept following parameters
- **hotels**: List hotel ids - *ex: hotels=1,2,3*
- **destination**: Destination id - *ex: destination=1*

Both parameters are **optional**.

We can test this API via [Swagger UI](http://13.250.30.193:3000/api-docs/#/default/get_hotels) or using these cURL:

- Retrieving hotel data without filtering 
```
curl -H "Content-Type: application/json" -X GET http://13.250.30.193:3000/hotels
```

- Retrieving hotel data with `destination` is `1122`
```
curl -H "Content-Type: application/json" -X GET http://13.250.30.193:3000/hotels\?destination\=1122
```

- Retrieving hotel data with `hotels` are `iJhz`, `SjyX`
```
curl -H "Content-Type: application/json" -X GET http://13.250.30.193:3000/hotels\?hotels\=iJhz,SjyX
```

*Kindly change http://13.250.30.193:3000 with the hostname or IP address of your local server.*

### API Response

The response format is like below:

```
{
  "id": "iJhz",
  "destinationId": 5432,
  "name": "Beach Villas Singapore",
  "location": {
    "lat": 1.264751,
    "lng": 103.824006,
    "address": "8 Sentosa Gateway, Beach Villas, 098269",
    "city": "Singapore",
    "country": "Singapore"
  },
  "description": "Surrounded by tropical gardens.",
  "amenities": {
    "general": [
      "pool",
      "businessCenter"
    ],
    "room": [
      "wifi"
    ]
  },
  "images": {
    "rooms": [
      {
        "link": "https://d2ey9sqrvkqdfs.cloudfront.net/0qZF/2.jpg",
        "description": "Double room"
      }
    ],
    "amenity": [
      {
        "link": "https://d2ey9sqrvkqdfs.cloudfront.net/0qZF/0.jpg",
        "description": "RWS"
      }
    ]
  },
  "bookingConditions": [
    "A",
    "B"
  ]
}
```

### Testing 🕵️
Run `pnpm run test` to run all test cases with mock data.

### Optimization 🚀
- For **faster reading**, I utilize **Redis** for caching data, resulting in a reduction of **200 times** in read times (on my local machine).
- Filtering data with parameters before cleaning and merging to **reduce effort**.
- To **optimize server resources** and **reduce server load**, especially when dealing with numerous suppliers - not limited to just three - I retrieve hotel data by separate batches through API calls ✂️.

### Pipeline 🪈
Using GitHub actions, I've created a **YAML** file to trigger GitHub Actions pipeline. The pipeline consists of two steps:
1. **Test**: Running test
2. **Lint**: Running lint to check for problematic patterns in code

### Deployment 🏗️
To deploy this application, I opted for AWS EC2 (free tier). It only took me **30 minutes** to create an EC2 instance and start serving the application. 🚀🚀🚀

