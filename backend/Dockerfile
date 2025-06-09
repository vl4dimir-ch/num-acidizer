FROM public.ecr.aws/lambda/nodejs:20
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD [ "dist/index.lambdaHandler" ] 