# Basic Node JS Rest API

This is a Node.js project that provides a simple RESTful API for managing car data. It uses local JSON data and plain Node.js without any external libraries.

## Getting start

To get started with the project, clone the repository and run the following commands:

```
npm install
npm run dev
```

This will install the required dependencies and start the server on port 8080.
`http://localhost:8080/api/products`

## Endpoints

### GET the whole list of the cars

`/api/products`
-> GET -> get all items

### POST a new car to the list

`/api/products`
-> POST - add new item -> validation

### GET a car by id

`/api/products/{id}`
-> GET -> get id's item

### UPDATE a car by id

`/api/products/{id}`
-> PATCH - edit the item -> validation

### DELETE a car by id

`/api/products/{id}`
-> DELETE - delete the item

### Filtered car list

`/api/products/?queries`

#### Filtered by names

`/api/products/?name=BMW`

#### Filtered by fuels

`/api/products/?fuel_types=gasoline`

Check out the opportunities in this `URL`
`api/fuels`

#### Filtered by car types

`/api/products/?type=sedan`

Check out the opportunities in this `URL`
`api/types`

#### Filtered by car seats

-min_seats
-max_seats
`/api/products/?min_seats=3`
`/api/products/?max_seats=5`
`/api/products/?min_seats=3&max_seats=5`

#### Filtered by car price

-min_price
-max_price
`/api/products?min_price=30000`
`/api/products?max_price=50000`
`/api/products?min_price=30000&max_price=50000`

#### Filtered by car production years

- min_production_year
- max_production_year
  `/api/products?min_production_year=2008`
  `/api/products?max_production_year=2010`
  `/api/products?min_production_year=2008&max_production_year=2010`
