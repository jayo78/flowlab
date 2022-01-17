### Notes:
- need mongo atlas uri 
  - for dev: mongodb+srv://mongo:\<password\>@cluster0.bximy.mongodb.net/dev?retryWrites=true&w=majority
  - for prod: mongodb+srv://mongo:\<password\>@cluster0.bximy.mongodb.net/prod?retryWrites=true&w=majority

### Development 

run frontend and backend on different ports 

- install packages: `npm install && npm install --prefix frontend`
  - troubleshoot: delete package-lock.json and node_modules in root and frontend/ then try installing again
- set env variables (create .env):
  - NODE_ENV = **development**
  - MONGO_DEV = **\<DEV-ATLAS-URI\>**
  - JWT_SECRET = **secret**
- start backend and frontend: `npm run dev`

### Production

instead of running backend and frontend on different ports, for production we compile (build) the frontend and serve it from the backend

- set env variables (create .env):
  - NODE_ENV = **production**
  - MONGO_PROD = **\<PROD-ATLAS-URI\>**
  - JWT_SECRET = **secret**
- build frontend: `npm run build --prefix frontend`
- start backend: `npm start`

### Docker 

- go to flowlab directory
- start app `docker-compose up --build`
- remove containers from above `docker-compose down -v`
- remove all generated artifacts with `docker system prune`
