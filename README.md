Application CRUD API on noodejs

## Preparing for cross-check

#### Clone repo

```
git clone https://github.com/Skave-a/node-crud-api.git
```

#### Change folder

```
cd .\node-crud-api\
```

#### Change branch

```
git checkout develop
```
#### Install dependencies

```
npm install
```

#### Run in development mode

```
npm run start:dev
```

#### Run in production mode

```
npm run start:prod
```

---

## Opportunities

#### Get all users

```
method: get
address: http://localhost:3000/api/users
```

#### Add one user

```
method: post
address: http://localhost:3000/api/users
body: {
    "username": "skave",
    "age": 25,
    "hobbies": ["dance"]
}
```

#### Get user

```
method: get
address: http://localhost:3000/api/users/${userID}
```

#### Update user

```
method: put
address: http://localhost:3000/api/users/${userID}
body: {
    "username": "nat",
    "age": 12,
    "hobbies": ["dance"]
}
```

#### Delete user

```
method: delete
address: http://localhost:3000/api/users/${userID}
```

---

## Test

```
npm run test
```

## Horizontal scaling with load balancer

```
npm run start:multi
```
