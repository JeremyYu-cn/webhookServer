## Project Information

- Project Name: Webhook management server

- Project Description:

- Requirements:

  - support CRUD operations for managing webhooks

  - support an endpoint which triggers the execution of a webhook

  - use JSON for requests and responses

- Create Date: 01/11/2024 19:00:00

- Update Date: 02/11/2024 17:00:00

- Language: Typescript

- Libs: Koa, @koa/router, koa-body, koa-cors, log4js, uuid, jest

- Author: Zhiming Yu

## Start

### Install Packages

- NPM

  ```shell
    npm install
  ```

- yarn

  ```shell
    yarn
  ```

### Dev

```shell
  yarn dev
```

### Preview

```shell
  yarn preview
```

### Deploy

```shell
  yarn start
```

### Test

```shell
  yarn test
```

## Architecture

The program is organized into four main modules: the server, RESTful router, business logic, and database/cache.

- The server module serves as the program's entry point.

- The RESTful router is used to handle client requests.

- The business logic module handles project-specific requirements, such as retrieving webhook project details and executing a webhook project.

- Finally, the database/cache module is responsible for data storage.

![alt text](/doc/images/architecture.png)

## Data model and get data policy

### Data model

The main data model of the project is the Webhook project table, which is designed as follows:

| fields | type     | description    | isUnique |
| ------ | -------- | -------------- | -------- |
| id     | string   | project ID     | true     |
| name   | string   | project name   | true     |
| status | string   | webhook status | false    |
| list   | string[] | webhook urls   | false    |

### Get Data Policy

- Generally, when a user needs to query data or operate on data, the first operation is performed on the database. In this project, JSON text is used to mock a database (Mysql/MongoDB).

- In order to cope with the high concurrency, the program uses cache simulation (Redis) in the project, when the user needs to repeat the query of the data has been queried, we can cache the data, reducing the time cost of the request query database.

- The following chart presents the process of getting data when the user requests the API:

![alt text](/doc/images/dataPolicy.png)

It can be seen that when we need to query data, the program will first search in the cache, when the cache exists, the program will immediately return the data, using the characteristics of high cache speed to reduce the request time and reduce the number of database queries. When the cache does not exist, the program requests a database query and saves the query results to the cache.

## API Design

When designing apis, the function of the corresponding URL can be clearly described through the design of RESTful apis, such as the request method get to obtain data, post to add data or execute methods, put to modify data and so on.

### API List：

#### Webhook

- prefix: /api/webhook/project

- return: { success: boolean, data: any, err ?: string }

1. Get webhook project List

   - path: /list

   - method: GET

   - query:

     - page: number
     - size: number

2. Get webhook project detail

   - path: /detail/:projectName

   - method: GET

3. Edit webhook project record

   - path: /:projectName

   - method: PUT

   - parameters:

     - status: boolean

     - list: string[]

4. Create webhook project record

   - path: /

   - method: POST

   - parameters:

     - projectName: string

     - status: boolean

     - list: string[]

5. Delete webhook project record

   - path: /:projectName

   - method: DELETE

6. Execute webhook project

   - path: /exec/:projectName

   - method: POST

   - return {
     data: { requestId: string }
     }

7. Get execute result

   - path: /exec/:requestId

   - method: GET
