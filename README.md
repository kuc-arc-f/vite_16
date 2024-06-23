# vite_16

 Version: 0.9.1 : first

 Author  : Kouji Nakashima / kuc-arc-f.com

 date    : 2024/06/22 
 
 update  :

***
### Summary

React + vite, sample

***
* vercel.json
```
{
    "version": 2,
    "public": true,
    "builds": [
      {
        "src": "public/**/*",
        "use": "@vercel/static"
      },        
      {
        "src": "server.js",
        "use": "@vercel/node"
      }
    ],
    "routes": [
      { "handle": "filesystem" },
      {
        "src": "/.*",
        "dest": "/server.js"
      }
    ]
}
```

***
### build

* build, dev-start

```
yarn build

#
yarn dev
```

***
* prod-start

```
yarn start
```

***
### blog 

***

