# gatsby-source-pocketbase

Source plugin for pulling data into Gatsby from pocketbase collections.

## Installation

```shell
npm install gatsby-source-pocketbase
```

## How to use

```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [
    /*
     * Gatsby's data processing layer begins with “source” plugins. Here we
     * setup the site to pull data from the "documents" collection in a local
     * pocketbase instance
     */
    {
      resolve: `gatsby-source-pocketbase`,
      options: { 
        server: {
            protocol: 'http',
            address: '127.0.0.1',
            port: '8090'
        }, 
        auth: {
            user: 'YOUR_EMAILADDRESS',
            password: 'YOUR_PASSWORD'
        } 
      },
    },
  ],
}
```


## Plugin options

- **server**: optional, default will be set as `{ protocol: 'http', address: '127.0.0.1', port: '8090' }`.
- **auth**: the authentication data to login a pocketbase collection, with sub
  properties user and password. ex. auth: { user: `admin`, password: `12345` }

```javascript
module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-pocketbase`,
      options: {
        auth: {
            user: 'YOUR_EMAILADDRESS',
            password: 'YOUR_PASSWORD'
        } 
      },
    },
  ],
}
```

The GraphQL query to get the transformed markdown would look something like
this.

```graphql
query ($id: String!) {
  allPocketBase[Item](id: { eq: $id }) {
    id
    name
    url
  }
}
```

## How to query your pocketbase data using GraphQL

Below is a sample query for fetching all pocketbase document nodes from a db named
**'Cloud'** and a collection named **'documents'**.

```graphql
query {
  allPocketbase[Items] {
    nodes {
      id
      url
      name
    }
  }
}
```
