FROM node

COPY . /code

WORKDIR /code

RUN npm install
RUN npm run browserify

ENTRYPOINT ["npm","start","--silent"]
