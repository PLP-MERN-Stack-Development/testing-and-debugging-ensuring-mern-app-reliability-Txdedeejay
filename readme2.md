###cd server
npm install --save-dev jest supertest mongodb-memory-server @types/jest cross-env
npm install --save-dev jest-coverage-badges      # optional
npm install express mongoose
npm i -D mongodb-memory-server

###
cd client
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event babel-jest identity-obj-proxy
End-to-End
npm install --save-dev cypress
# or for Playwright:
npm install --save-dev @playwright/test
